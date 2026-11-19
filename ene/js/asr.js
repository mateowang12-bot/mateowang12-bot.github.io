/* Eñe —— 本地语音识别（自己录音 + 手机上跑的识别程序，不用系统自带的语音识别）
 *
 * 为什么要有它（2026-11-19）：iPhone 的系统语音识别，录过一次音后只要放过声音（朗读 / 提示音），
 * 之后就“看起来在听、一个字都不出”，试了 5 种办法都绕不过去。所以改成：
 *   - 自己用 getUserMedia 拿麦克风的声音（这一步在 iPhone 上很稳）；
 *   - 交给 Vosk（开源离线识别，vendor/vosk.js，Apache-2.0）在手机上把声音变成文字；
 *   - 西语小模型约 40MB（models/es.tar.gz.0 / .1，GitHub 网页上传单个文件不能超 25MB，所以切两块），
 *     第一次用时下载，之后存在手机里（IndexedDB），不用再下。
 *
 * 用法（js/speak.js 里用）：
 *   Ene.ASR.supported()              这台设备能不能用
 *   Ene.ASR.status()                 'none' 没下载 / 'loading' 下载或准备中 / 'ready' / 'error'
 *   Ene.ASR.progress()               { loaded, total } 下载进度（字节）
 *   Ene.ASR.cached()                 以前下载成功过（这次打开 App 只需要从手机里读出来，很快）
 *   Ene.ASR.load()                   开始下载 / 准备，返回 Promise
 *   Ene.ASR.onChange(fn)             状态或进度变了就调用 fn
 *   Ene.ASR.listen(h)                开始听一句：h = { onInterim(text), onFinal([text]), onFail(why), onReady(), log(x) }
 *                                    返回 { stop() }（停止并用已经听到的内容出结果）、{ abort() }（直接放弃）
 *   Ene.ASR.level()                  当前音量 0–1（给音量条用）
 *   Ene.ASR.warm()                   在点击里调用：先把麦克风和声音通道打开（iPhone 要在点击里开）
 */
(function () {
  'use strict';
  var Ene = (window.Ene = window.Ene || {});

  var MODEL_PARTS = 5, MODEL_SIZE = 39802207; // 每块 8MB（GitHub 网页上传一次太大会失败） // 改模型时一起改（tools/build.ps1 会打印）
  var MODEL_VER = 'es-small-0.42';
  var CACHED_KEY = 'ene-asr-ok';
  var AC = window.AudioContext || window.webkitAudioContext;

  var model = null, status = 'none', prog = { loaded: 0, total: MODEL_SIZE }, loading = null, lastErr = '';
  var listeners = [];
  var stream = null, ctx = null, source = null, proc = null, curLevel = 0;
  var active = null; // 正在听的那一句

  function supported() {
    return !!(window.Worker && window.WebAssembly && AC && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.ReadableStream);
  }
  function emit() { listeners.forEach(function (f) { try { f(status, prog); } catch (e) {} }); }
  function setStatus(s) { status = s; emit(); }
  function cached() { try { return localStorage.getItem(CACHED_KEY) === MODEL_VER; } catch (e) { return false; } }

  function base() {
    // 页面所在的文件夹（例如 https://xxx.github.io/ene/），worker 里要用完整地址
    return location.href.replace(/[#?].*$/, '').replace(/[^/]*$/, '');
  }
  function loadScript(src) {
    return new Promise(function (res, rej) {
      if (window.Vosk) { res(); return; }
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function () { window.Vosk ? res() : rej(new Error('vosk 没加载')); };
      s.onerror = function () { rej(new Error('vosk.js 下载失败')); };
      document.head.appendChild(s);
    });
  }

  function load() {
    if (status === 'ready') return Promise.resolve(model);
    if (loading) return loading;
    if (!supported()) return Promise.reject(new Error('unsupported'));
    lastErr = '';
    prog = { loaded: 0, total: MODEL_SIZE };
    setStatus('loading');
    loading = loadScript(base() + 'vendor/vosk.js').then(function () {
      return new Promise(function (res, rej) {
        var url = base() + 'models/es.tar.gz#parts=' + MODEL_PARTS + '&size=' + MODEL_SIZE;
        var m;
        try { m = new window.Vosk.Model(url, window.__voskLog != null ? window.__voskLog : -1); } catch (e) { rej(e); return; }
        m.on('progress', function (msg) {
          prog = { loaded: msg.loaded || 0, total: msg.total || MODEL_SIZE };
          emit();
        });
        m.on('load', function (msg) {
          if (msg.result) { res(m); } else rej(new Error('模型加载失败'));
        });
        m.on('error', function (msg) { rej(new Error(msg && msg.error || '模型出错')); });
      });
    }).then(function (m) {
      model = m; loading = null;
      try { localStorage.setItem(CACHED_KEY, MODEL_VER); } catch (e) {}
      prog = { loaded: prog.total, total: prog.total };
      setStatus('ready');
      return m;
    }, function (e) {
      loading = null; lastErr = (e && e.message) || String(e);
      setStatus('error');
      throw e;
    });
    return loading;
  }

  /* ---------- 麦克风和声音通道 ---------- */
  function ensureCtx() {
    if (!ctx || ctx.state === 'closed') {
      try { ctx = new AC(); } catch (e) { ctx = null; }
      source = null; proc = null;
    }
    if (ctx && ctx.state !== 'running') { try { var p = ctx.resume(); if (p && p.then) p.then(null, function () {}); } catch (e) {} }
    return ctx;
  }
  function streamLive() {
    try { return !!stream && stream.getAudioTracks().some(function (t) { return t.readyState === 'live'; }); } catch (e) { return false; }
  }
  function ensureStream() {
    if (streamLive()) return Promise.resolve(stream);
    return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 } })
      .then(function (s) {
        if (streamLive()) { s.getTracks().forEach(function (t) { t.stop(); }); return stream; }
        stream = s; source = null;
        return s;
      });
  }
  // 在点击里调用：声音通道和麦克风都先打开
  function warm() {
    ensureCtx();
    return ensureStream().then(function () { return true; }, function () { return false; });
  }
  function hookup() {
    var c = ensureCtx();
    if (!c || !stream) throw new Error('no-audio');
    if (!source) {
      source = c.createMediaStreamSource(stream);
      proc = c.createScriptProcessor(4096, 1, 1);
      proc.onaudioprocess = function (ev) {
        var data = ev.inputBuffer.getChannelData(0), sum = 0;
        for (var i = 0; i < data.length; i += 4) sum += data[i] * data[i];
        curLevel = Math.min(1, Math.sqrt(sum / (data.length / 4)) * 6);
        if (active) active.feed(ev.inputBuffer);
        // 输出静音（Safari 要接到 destination 才会触发 onaudioprocess）
        var out = ev.outputBuffer.getChannelData(0);
        for (var j = 0; j < out.length; j++) out[j] = 0;
      };
      source.connect(proc);
      proc.connect(c.destination);
    }
  }

  /* ---------- 听一句 ---------- */
  var SILENCE_MS = 1500, NO_SPEECH_MS = 8000, MAX_MS = 15000;
  function listen(h) {
    var log = h.log || function () {};
    var done = false, rec = null, text = '', finals = [], partial = '', lastChange = 0, started = 0, timers = [], gotAudio = false, stopping = false;
    var handle = {
      stop: function () { if (!done && !stopping) { log('stop'); stopping = true; flush(); } },
      abort: function () { finish(null, 'abort'); }
    };
    function clear() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }
    function current() { return (finals.join(' ') + ' ' + partial).replace(/\s+/g, ' ').trim(); }
    function finish(result, why) {
      if (done) return; done = true; clear();
      if (active === me) active = null;
      try { if (rec) rec.remove(); } catch (e) {}
      if (why === 'abort') return;
      if (why) { log('fail:' + why); h.onFail && h.onFail(why); return; }
      log('end');
      h.onFinal && h.onFinal(result ? [result] : []);
    }
    function flush() {
      // 让识别器把最后一段吐出来，最多等 1.5 秒
      try { rec.retrieveFinalResult(); } catch (e) {}
      timers.push(setTimeout(function () { finish(current()); }, 1500));
    }
    var me = {
      feed: function (buf) {
        if (done || stopping || !rec) return;
        if (!gotAudio) { gotAudio = true; log('audio'); }
        try { rec.acceptWaveform(buf); } catch (e) {}
      }
    };

    log('local');
    Promise.resolve().then(function () {
      return status === 'ready' ? model : (log('load'), load());
    }).then(function () {
      if (done) return;
      return ensureStream();
    }).then(function () {
      if (done) return;
      hookup();
      rec = new model.KaldiRecognizer(ctx.sampleRate);
      rec.on('partialresult', function (msg) {
        var p = (msg && msg.result && msg.result.partial) || '';
        if (p !== partial) { partial = p; lastChange = Date.now(); if (h.onInterim && current()) h.onInterim(current()); }
      });
      rec.on('result', function (msg) {
        var t = (msg && msg.result && msg.result.text) || '';
        partial = '';
        if (t) { finals.push(t); lastChange = Date.now(); if (!text) log('result'); text = current(); h.onInterim && h.onInterim(text); }
        if (stopping) finish(current());
      });
      rec.on('error', function (msg) { log('err:' + (msg && msg.error)); });
      active = me;
      started = Date.now();
      log('ready');
      h.onReady && h.onReady();
      // 说完安静 1.5 秒自动结束；8 秒都没说话也结束；最长 15 秒
      timers.push(setInterval(function () {
        if (done || stopping) return;
        var now = Date.now(), has = !!current();
        if (has && now - lastChange > SILENCE_MS) handle.stop();
        else if (!has && now - started > NO_SPEECH_MS) handle.stop();
        else if (now - started > MAX_MS) handle.stop();
      }, 200));
    }).catch(function (e) {
      var n = (e && (e.name || e.message)) || 'error';
      finish(null, /NotAllowed|Permission|denied/i.test(n) ? 'not-allowed' : status === 'error' ? 'model' : 'local-' + n);
    });
    return handle;
  }

  Ene.ASR = {
    supported: supported,
    status: function () { return status; },
    progress: function () { return prog; },
    error: function () { return lastErr; },
    cached: cached,
    load: load,
    warm: warm,
    listen: listen,
    level: function () { return curLevel; },
    onChange: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; }
  };
})();
