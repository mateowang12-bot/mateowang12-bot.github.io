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
  var VOSK_VER = 2; // 改了 vendor/vosk.js 就加 1（同时改 sw.js 里的 VENDOR_CACHE）
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

  // 模型几块的地址。标准位置：ene/models/es.tar.gz.0…；
  // 2026-11-19 第一次上传时模型落在了网站根目录的 models-a/ene/models（0–2）和 models-b/ene/models（3–4），也认
  function modelUrls() {
    var std = [], alt = [], root = base().replace(/[^/]*\/$/, '');
    for (var k = 0; k < MODEL_PARTS; k++) {
      std.push(base() + 'models/es.tar.gz.' + k);
      alt.push(root + (k < 3 ? 'models-a' : 'models-b') + '/ene/models/es.tar.gz.' + k);
    }
    return fetch(std[0], { method: 'HEAD', cache: 'no-store' }).then(function (r) { return r.ok ? std : alt; }, function () { return alt; });
  }
  function load() {
    if (status === 'ready') return Promise.resolve(model);
    if (loading) return loading;
    if (!supported()) return Promise.reject(new Error('unsupported'));
    lastErr = '';
    prog = { loaded: 0, total: MODEL_SIZE };
    setStatus('loading');
    loading = loadScript(base() + 'vendor/vosk.js?v=' + VOSK_VER).then(modelUrls).then(function (urls) {
      return new Promise(function (res, rej) {
        var url = base() + 'models/es.tar.gz#list=' + encodeURIComponent(JSON.stringify(urls)) + '&size=' + MODEL_SIZE;
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
  /* 2026-11-19 用户说“不灵敏”：给了 h.grammar（这一课的词）时，同时开两个识别器：
   *   - 一个“优先这一课的词”（带口音也更容易认出来，例如 ¿De dónde eres? 不会被听成 johnny gris）；
   *   - 一个自由识别（有时候带词表的会漏掉 hola 这种词）。
   * 两个结果都交给打分，取分高的那个。 */
  function listen(h) {
    var log = h.log || function () {};
    var done = false, recs = [], lastChange = 0, gotFinal = false, started = 0, timers = [], gotAudio = false, stopping = false, logged = false;
    var handle = {
      stop: function () { if (!done && !stopping) { log('stop'); stopping = true; flush(); } },
      abort: function () { finish('abort'); }
    };
    function clear() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }
    function textOf(s) { return (s.finals.join(' ') + ' ' + s.partial).replace(/\[unk\]/g, ' ').replace(/\s+/g, ' ').trim(); }
    // 显示给用户看的：两个里面字多的那个
    function current() { var best = ''; recs.forEach(function (s) { var t = textOf(s); if (t.length > best.length) best = t; }); return best; }
    function finish(why) {
      if (done) return; done = true; clear();
      if (active === me) active = null;
      recs.forEach(function (s) { try { s.rec.remove(); } catch (e) {} });
      if (why === 'abort') return;
      if (why) { log('fail:' + why); h.onFail && h.onFail(why); return; }
      var out = [];
      recs.forEach(function (s) { var t = textOf(s); if (t && out.indexOf(t) < 0) out.push(t); });
      log('end');
      h.onFinal && h.onFinal(out);
    }
    function flush() {
      // 让识别器把最后一段吐出来；都吐完就结束，最多等 1.5 秒
      recs.forEach(function (s) { s.waiting = true; try { s.rec.retrieveFinalResult(); } catch (e) { s.waiting = false; } });
      timers.push(setTimeout(function () { finish(); }, 1500));
    }
    var me = {
      feed: function (buf) {
        if (done || stopping || !recs.length) return;
        if (!gotAudio) { gotAudio = true; log('audio'); }
        recs.forEach(function (s) { try { s.rec.acceptWaveform(buf); } catch (e) {} });
      }
    };
    function makeRec(grammar) {
      var s = { finals: [], partial: '', waiting: false };
      s.rec = grammar ? new model.KaldiRecognizer(ctx.sampleRate, JSON.stringify(grammar.concat(['[unk]'])))
        : new model.KaldiRecognizer(ctx.sampleRate);
      s.rec.on('partialresult', function (msg) {
        var p = (msg && msg.result && msg.result.partial) || '';
        if (p !== s.partial) { s.partial = p; lastChange = Date.now(); if (p) gotFinal = false; if (h.onInterim && current()) h.onInterim(current()); }
      });
      s.rec.on('result', function (msg) {
        var t = (msg && msg.result && msg.result.text) || '';
        s.partial = '';
        if (t) { s.finals.push(t); lastChange = Date.now(); gotFinal = true; if (!logged) { logged = true; log('result'); } if (h.onInterim && current()) h.onInterim(current()); }
        if (stopping) { s.waiting = false; if (recs.every(function (x) { return !x.waiting; })) finish(); }
      });
      s.rec.on('error', function (msg) { log('err:' + (msg && msg.error)); });
      return s;
    }

    log('local');
    Promise.resolve().then(function () {
      return status === 'ready' ? model : (log('load'), load());
    }).then(function () {
      if (done) return;
      return ensureStream();
    }).then(function () {
      if (done) return;
      hookup();
      recs.push(makeRec(null));
      if (h.grammar && h.grammar.length) recs.push(makeRec(h.grammar));
      active = me;
      started = Date.now();
      log('ready' + (recs.length > 1 ? '(2)' : ''));
      h.onReady && h.onReady();
      timers.push(setInterval(function () {
        if (done || stopping) return;
        var now = Date.now(), has = !!current();
        // 识别器判断“这句说完了”（result）之后 1.1 秒没再说话 → 结束；否则安静 1.5 秒结束
        // （不能太短：初学者词和词之间常停顿，比如 “Hola, … buenos días”）。8 秒没说话也结束；最长 15 秒
        if (has && now - lastChange > (gotFinal ? 1100 : SILENCE_MS)) handle.stop();
        else if (!has && now - started > NO_SPEECH_MS) handle.stop();
        else if (now - started > MAX_MS) handle.stop();
      }, 200));
    }).catch(function (e) {
      var n = (e && (e.name || e.message)) || 'error';
      finish(/NotAllowed|Permission|denied/i.test(n) ? 'not-allowed' : status === 'error' ? 'model' : 'local-' + n);
    });
    return handle;
  }

  /* 按键声音走录音用的同一个声音通道（2026-11-19 用户：口语课里点按钮没声音）。
   * iPhone 上同时开两个 AudioContext（提示音一个、录音一个）时提示音常常出不来；
   * 而且麦克风开着时这个通道是“录音+播放”模式，手机静音键打开也能听到。
   * list：[{ freq, to, dur, vol, at }]，和 js/sfx.js 的格式一样。返回 true = 放了 */
  function tone(list) {
    if (!ctx || ctx.state === 'closed') return false;
    if (ctx.state !== 'running') { try { ctx.resume(); } catch (e) {} }
    try {
      list.forEach(function (o) {
        var t0 = ctx.currentTime + (o.at || 0) + 0.005;
        var osc = ctx.createOscillator(), g = ctx.createGain();
        osc.type = o.type || 'sine';
        osc.frequency.setValueAtTime(o.freq, t0);
        if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + o.dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(o.vol, t0 + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t0); osc.stop(t0 + o.dur + 0.03);
      });
      return true;
    } catch (e) { return false; }
  }
  // 退出口语课：关掉麦克风（屏幕上方的橙点会消失）和声音通道
  function release() {
    if (active) return;
    try { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    stream = null; source = null; proc = null;
    try { if (ctx) ctx.close(); } catch (e) {}
    ctx = null;
  }

  Ene.ASR = {
    tone: tone,
    release: release,
    hasAudio: function () { return !!ctx && ctx.state !== 'closed'; },
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
