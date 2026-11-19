/* Eñe 西语单词 —— 口语课「开口 30 天」（底部“口语”栏目）
 * 数据：data/speak1–5.js 放进 window.ENE_SPEAK（格式见 data/SPEAK.md）
 * 一课 6 段：热场复现 → 可理解输入 → 拆要点 → 产出任务 → 纠错打分 → 明日挂钩
 * 打分：用浏览器的语音识别（SpeechRecognition）把用户说的话转成文字，和标准句逐词比对。
 *       只能判断“词”说没说对，不能按音节判断发音；以后可以换成付费的发音评测服务。
 *       浏览器不支持语音识别时：自己说 → 听示范、看答案 → 自己判断。
 * 进度：Store.setSpeakDay(day, { passed, passedAt, tries, scores })，会跟着云同步。
 * 点击用 data-sp（不用 data-act，免得和 app.js 的单词学习按钮冲突）。 */
(function () {
  'use strict';
  var Ene = window.Ene;
  var Store = Ene.Store, Speech = Ene.Speech;

  var PASS = 70;
  var TOTAL = 30;
  var SEGS = ['热场', '输入', '拆要点', '产出', '纠错', '挂钩'];
  var SEG_MIN = [1, 3, 3, 4, 3, 1];
  var WEEKS = [
    { n: 1, title: '能开口', from: 1, to: 7 },
    { n: 2, title: '能生存', from: 8, to: 14 },
    { n: 3, title: '能变位', from: 15, to: 21 },
    { n: 4, title: '能办事', from: 22, to: 28 },
    { n: 5, title: '综合实战', from: 29, to: 30 }
  ];
  var SKILL_ZH = { conj: '动词变位', pron: '发音', listen: '听力', phrase: '场景语块' };

  var LESSONS = {};
  (Array.isArray(window.ENE_SPEAK) ? window.ENE_SPEAK : []).forEach(function (L) {
    if (L && L.day >= 1 && L.day <= TOTAL && Array.isArray(L.tasks) && L.tasks.length && !LESSONS[L.day]) LESSONS[L.day] = L;
  });

  /* ---------- 小工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function variant() { return Store.settings().variant === 'es' ? 'es' : 'latam'; }
  function V(o) { if (o == null) return ''; if (typeof o === 'string') return o; var v = variant(); return o[v] != null ? o[v] : (o.latam || ''); }
  function rec(d) { return Store.speakDay(d); }
  function passed(d) { var r = rec(d); return !!(r && r.passed); }
  function unlocked(d) { return d === 1 || passed(d) || passed(d - 1); }
  function currentDay() { for (var d = 1; d <= TOTAL; d++) if (!passed(d)) return d; return TOTAL; }
  function weekOf(d) { for (var i = 0; i < WEEKS.length; i++) if (d >= WEEKS[i].from && d <= WEEKS[i].to) return WEEKS[i]; return WEEKS[0]; }
  // 2026-11-19 录音小测试证实：iPhone 上放过提示音（AudioContext）后，语音识别就一直不出字。
  // 所以口语课里不放按钮提示音（iPhone / iPad），录音前还会彻底关掉 AudioContext（Sfx.release）
  var NO_SFX = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function sfx(e) { if (!NO_SFX && Ene.Sfx && e) { try { Ene.Sfx.tap(e); } catch (x) {} } }
  function sfxMiss(e) { if (!NO_SFX && Ene.Sfx && e) { try { Ene.Sfx.miss(e); } catch (x) {} } }
  function say(text, rate, onEnd, pitch, who) { return Speech.speakAs(text, rate || 0.95, variant(), onEnd, pitch, who); }
  // 对话里第几个出场的人（0、1、2…）：每个人固定一个声音
  function speakerIndex(L, i) {
    var seen = [];
    for (var k = 0; k <= i; k++) { var w = L.dialog[k].who; if (seen.indexOf(w) < 0) seen.push(w); }
    return seen.indexOf(L.dialog[i].who);
  }

  var I = {
    close: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.5 9H3.5v6h3l4.5 4z" fill="currentColor"/><path d="M15.5 8.6a4.8 4.8 0 0 1 0 6.8M18.4 5.8a8.8 8.8 0 0 1 0 12.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'
  };

  /* ================= 语音识别 + 逐词打分 ================= */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  // 发现这台设备上语音识别不能用（没权限 / 服务不可用 / 卡住没反应）→ 改成自己对照，并记住（下次不用再等）
  var SR_KEY = 'ene-sr-broken';
  var srBroken = (function () { try { return localStorage.getItem(SR_KEY) === '1'; } catch (e) { return false; } })();
  function setBroken(v) { srBroken = v; try { if (v) localStorage.setItem(SR_KEY, '1'); else localStorage.removeItem(SR_KEY); } catch (e) {} }
  function canRecognize() { return !!SR && !srBroken; }

  /* 2026-11-19 用户在 iPhone 上“一直正在听、停止也按不掉”：iOS 的识别有时既不给结果也不触发 onend。
   * 所以加了几道保险：
   * - 开始后 5 秒内一点反应都没有（没有 onstart / 声音 / 结果）→ 当作这台设备不能用，改成自己对照；
   * - 按停止：调用 stop()，1.5 秒内还没结束就强制结束，用已经听到的部分打分；
   * - 最长 15 秒自动停。 */
  /* 2026-11-19 用户说“有时收不到音”。改为：
   * - continuous = true：说话中间停一下不会马上结束；最后一次听到内容后安静 1.6 秒才自动停（自己计时）；
   * - 识别真正开始（onstart / onaudiostart）才告诉页面“现在说吧”（onReady），免得一开口就被漏掉；
   * - 开始收音后 8 秒都没听到任何内容 → 自动停（显示“没听到声音”）；
   * - network 错误（电脑 Chrome 要连谷歌，国内常连不上）单独提示，不当作“这台设备不能用”。 */
  /* 2026-11-19 用户发现：第一次录音能录进去，之后就不行（iPhone）。
   * - 一节课里尽量用同一个识别器（shared），只有上一次没有正常结束（被强制停 / abort）才换新的；
   * - 开始后 2.5 秒还没收到声音（没有 audiostart / 结果）→ 换一个新的识别器重来一次；
   * - 刚开始就自己结束 → 等 0.4 秒（让麦克风放开）再换新的重来；
   * - 每次识别记下经过了哪几步（lastLog），收不到时在结果页显示，方便用户截图排查。 */
  /* 2026-11-19 用户截图：第 2 句 begin → start@7 → audio@18 → (8 秒无结果) → stop。
   * iPhone 上重复用的识别器会“假装”开始收音（audio 事件马上来）但一个字都不出。改为：
   * - 默认每次都新建识别器（第一次总能录，说明新建的可靠），并把哪种方式管用记在 localStorage；
   * - 收到 audio 但 4 秒内一个结果都没有 → 换另一种方式重来一次（只重来一次）；
   * - 开始录音前先让提示音的声音通道（AudioContext）停下，免得占着 iPhone 的麦克风。 */
  var cur = null; // 正在进行的识别 { r, finish(kind), stop() }
  var SILENCE_MS = 1600;
  var shared = null, needFresh = false, lastLog = '';
  // 记住哪种方式能收到声音：false = 重复用同一个识别器，true = 每次新建。收不到就换另一种，并记住
  var preferFresh = true;
  try { if (localStorage.getItem('ene-sr-reuse') === '1') preferFresh = false; } catch (e) {}
  /* 2026-11-19 第二张截图：begin:new → start@15 → audio@15 → 7 秒无结果。新建的识别器也一样，
   * 说明问题在 continuous=true（网上多处报告 iOS Safari 连续模式第一次后就不出结果）。
   * iPhone / iPad 改回一次一句（continuous=false）；其他设备如果连续模式“有收音没结果”，也自动改用一次一句并记住。 */
  var IS_IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var useCont = !IS_IOS;
  try { if (localStorage.getItem('ene-sr-nocont') === '1') useCont = false; } catch (e) {}
  /* 2026-11-19 小测试证实：iPhone 录过音后再放声音（朗读 / 提示音），识别就一直不出字；刷新页面也救不回来；
   * 但先用 getUserMedia 把麦克风一直开着，放完朗读后还能正常识别。
   * 所以 iPhone / iPad 上：第一次录音时（在点击里）打开一个“常开麦克风”，一直开到退出这节课 / App 切到后台。 */
  var hold = null, holdPending = false;
  function ensureHold() {
    if (!IS_IOS || hold || holdPending || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    holdPending = true;
    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
        holdPending = false;
        if (hold) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
        hold = s;
      }, function () { holdPending = false; });
    } catch (e) { holdPending = false; }
  }
  function dropHold() {
    if (hold) { try { hold.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} }
    hold = null;
  }
  function setPrefer(fresh) {
    preferFresh = fresh;
    try { if (fresh) localStorage.removeItem('ene-sr-reuse'); else localStorage.setItem('ene-sr-reuse', '1'); } catch (e) {}
  }
  var HARD_ERR = ['not-allowed', 'service-not-allowed', 'audio-capture', 'language-not-supported', 'network'];
  function getSR(fresh) {
    if (fresh || needFresh || !shared) {
      if (shared) { try { shared.onstart = shared.onaudiostart = shared.onsoundstart = shared.onspeechstart = shared.onresult = shared.onerror = shared.onend = null; shared.abort(); } catch (e) {} }
      shared = new SR(); needFresh = false;
    }
    return shared;
  }
  function listen(onInterim, onFinal, onFail, onReady, retried, log, fresh) {
    var r, t0 = Date.now();
    log = log || [];
    var usedFresh = fresh != null ? fresh : preferFresh;
    function L(x) { log.push(x + '@' + (Date.now() - t0)); lastLog = log.join(' → '); }
    try { r = getSR(usedFresh); } catch (e) { onFail('nosr'); return; }
    r.lang = variant() === 'es' ? 'es-ES' : 'es-MX';
    var cont = useCont;
    r.interimResults = true; r.maxAlternatives = 5; r.continuous = cont;
    var finals = null, lastText = '', err = '', ended = false, alive = false, heard = false, timers = [], silence = null, noSpeech = null;
    function clear() { timers.forEach(clearTimeout); timers = []; clearTimeout(silence); clearTimeout(noSpeech); }
    function detach() { r.onstart = r.onaudiostart = r.onsoundstart = r.onspeechstart = r.onresult = r.onerror = r.onend = null; }
    function retry(why, delay) {
      // 这种方式不行：换另一种（重复用 ↔ 新建），以后也先用另一种
      var next = !usedFresh;
      if (why !== 'busy' && why.indexOf('c0') < 0) setPrefer(next);
      L('retry(' + why + (next ? ',new' : ',reuse') + ')');
      needFresh = true;
      try { detach(); r.abort(); } catch (e) {}
      setTimeout(function () { listen(onInterim, onFinal, onFail, onReady, true, log, next); }, delay);
    }
    function finish(kind) {
      if (ended) return; ended = true; clear();
      L(kind);
      if (cur && cur.r === r) cur = null;
      if (kind === 'hang') { needFresh = true; try { detach(); r.abort(); } catch (e) {} onFail('hang'); return; }
      if (kind === 'force') { needFresh = true; try { detach(); r.abort(); } catch (e) {} }
      else detach();
      // 刚开始就自己结束、什么都没听到：等 0.4 秒换一个新的识别器重来一次
      if (kind === 'end' && !lastText && !retried && Date.now() - t0 < 1500 && HARD_ERR.indexOf(err) < 0) {
        retry('quick-end', 400);
        return;
      }
      if (finals && finals.length && finals[0] === lastText) onFinal(finals);
      else if (lastText) onFinal([lastText].concat(finals || []));
      else if (HARD_ERR.indexOf(err) >= 0) onFail(err);
      else onFinal([]);
    }
    var readySent = false;
    function wake() {
      alive = true;
      if (!readySent) {
        readySent = true;
        if (onReady) { try { onReady(); } catch (e) {} }
        noSpeech = setTimeout(function () { if (!lastText && cur && cur.r === r) cur.stop(); }, 8000);
      }
    }
    r.onstart = function () { L('start'); wake(); };
    r.onaudiostart = function () { L('audio'); heard = true; wake(); };
    r.onsoundstart = function () { L('sound'); heard = true; wake(); };
    r.onspeechstart = function () { L('speech'); heard = true; wake(); };
    r.onresult = function (ev) {
      if (!lastText) L('result');
      heard = true;
      wake();
      clearTimeout(noSpeech);
      clearTimeout(silence);
      silence = setTimeout(function () { if (cur && cur.r === r) cur.stop(); }, SILENCE_MS);
      var res = ev.results, joined = '';
      for (var i = 0; i < res.length; i++) joined += (i ? ' ' : '') + res[i][0].transcript;
      lastText = joined;
      var last = res[res.length - 1];
      if (last && last.isFinal) {
        if (res.length === 1) { finals = []; for (var j = 0; j < res[0].length; j++) finals.push(res[0][j].transcript); }
        else finals = [joined];
      }
      if (onInterim) onInterim(joined);
    };
    r.onerror = function (e) { err = (e && e.error) || 'error'; L('error:' + err); };
    r.onend = function () { finish('end'); };
    cur = { r: r, finish: finish, stop: function () {
      if (ended) return;
      L('stop');
      try { r.stop(); } catch (e) {}
      timers.push(setTimeout(function () { finish('force'); }, 1500));
    } };
    timers.push(setTimeout(function () { if (!alive && !ended) finish('hang'); }, 5000));
    // 开始了但 2.5 秒都没收到声音：换一个新的识别器重来一次
    timers.push(setTimeout(function () {
      if (!ended && !heard && !lastText && !retried && cur && cur.r === r) { ended = true; clear(); cur = null; retry('no-audio', 300); }
    }, 2500));
    // 显示在收音，但 4 秒一个字都没出 → 连续模式就改成一次一句（并记住）；重复用的就换新的。重来一次
    timers.push(setTimeout(function () {
      if (ended || lastText || retried || !cur || cur.r !== r) return;
      if (!usedFresh) { ended = true; clear(); cur = null; retry('no-result', 300); }
      else if (cont) {
        useCont = false;
        try { localStorage.setItem('ene-sr-nocont', '1'); } catch (e) {}
        ended = true; clear(); cur = null; retry('no-result,c0', 300);
      }
    }, 4000));
    timers.push(setTimeout(function () { if (!ended && cur && cur.r === r) cur.stop(); }, 15000));
    try { if (window.Ene && Ene.Sfx && Ene.Sfx.lock) Ene.Sfx.lock(); } catch (e) {}
    ensureHold();
    L((retried ? 'begin(new)' : 'begin') + (usedFresh ? ':new' : ':reuse') + (cont ? ':c1' : ':c0'));
    try { r.start(); }
    catch (e) {
      // 上一次还没完全结束（InvalidStateError）：换一个新的
      if (!retried) { ended = true; clear(); cur = null; retry('busy', 300); return; }
      ended = true; clear(); cur = null; onFail('start');
    }
  }
  function stopListen() { if (cur) cur.stop(); }
  function abortListen() {
    if (!cur) return;
    var c = cur; cur = null; needFresh = true;
    try { c.r.onend = null; c.r.abort(); } catch (e) {}
  }

  // 0–999 的数字转成西语（识别结果里常常是阿拉伯数字）
  var U = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince',
    'dieciseis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidos', 'veintitres', 'veinticuatro', 'veinticinco',
    'veintiseis', 'veintisiete', 'veintiocho', 'veintinueve'];
  var T = { 30: 'treinta', 40: 'cuarenta', 50: 'cincuenta', 60: 'sesenta', 70: 'setenta', 80: 'ochenta', 90: 'noventa' };
  var H = { 1: 'ciento', 2: 'doscientos', 3: 'trescientos', 4: 'cuatrocientos', 5: 'quinientos', 6: 'seiscientos', 7: 'setecientos', 8: 'ochocientos', 9: 'novecientos' };
  function numEs(n) {
    if (n < 30) return U[n];
    if (n < 100) { var t = Math.floor(n / 10) * 10, u = n % 10; return T[t] + (u ? ' y ' + U[u] : ''); }
    if (n === 100) return 'cien';
    if (n < 1000) { var h = Math.floor(n / 100), rest = n % 100; return H[h] + (rest ? ' ' + numEs(rest) : ''); }
    return String(n);
  }
  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/(\d+)[.,](\d+)/g, function (_, a, b) { return a + ' con ' + b; })
      .replace(/[¿?¡!.,;:…"“”()«»\/—–-]/g, ' ')
      .replace(/\d+/g, function (m) { var n = parseInt(m, 10); return n < 1000 ? ' ' + numEs(n) + ' ' : m; })
      .replace(/\s+/g, ' ').trim();
  }
  // 标准句 → 显示用的词（每个词可能对应几个比对用的小词）
  function units(text) {
    return String(text).split(/\s+/).map(function (t) { return { disp: t, parts: norm(t).split(' ').filter(Boolean) }; })
      .filter(function (u) { return u.parts.length; });
  }
  // 最长公共子序列：标准句里哪些词被听到了
  function matchFlags(target, heard) {
    var n = target.length, m = heard.length, i, j;
    var dp = []; for (i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--)
      dp[i][j] = target[i] === heard[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    var flags = new Array(n).fill(false); i = 0; j = 0;
    while (i < n && j < m) {
      if (target[i] === heard[j]) { flags[i] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
    }
    return flags;
  }
  function grade(text, alternatives) {
    var us = units(text), flat = [], owner = [];
    us.forEach(function (u, k) { u.parts.forEach(function (p) { flat.push(p); owner.push(k); }); });
    var best = null;
    (alternatives.length ? alternatives : ['']).forEach(function (alt) {
      var heard = norm(alt).split(' ').filter(Boolean);
      var f = matchFlags(flat, heard), hit = f.filter(Boolean).length;
      if (!best || hit > best.hit) best = { flags: f, hit: hit, heard: alt };
    });
    var ok = us.map(function () { return true; });
    best.flags.forEach(function (v, idx) { if (!v) ok[owner[idx]] = false; });
    var good = ok.filter(Boolean).length;
    var score = us.length ? Math.round(good / us.length * 100) : 0;
    return { words: us.map(function (u, k) { return { w: u.disp, ok: ok[k] }; }), score: score, pass: score >= PASS, heard: best.heard };
  }

  /* ================= 课程首页（底部“口语”） ================= */
  function renderHome(view) {
    var cur = currentDay(), L = LESSONS[cur], wk = weekOf(cur);
    var inWeek = 0; for (var d = wk.from; d <= wk.to; d++) if (passed(d)) inWeek++;
    var len = wk.to - wk.from + 1, C = 2 * Math.PI * 44;
    var allDone = passed(TOTAL);
    var lastPassed = 0; for (var k = TOTAL; k >= 1; k--) if (passed(k)) { lastPassed = k; break; }
    var html = '<header class="top sp-top"><h1>口语</h1>' + variantToggle() + '</header>';

    html += '<section class="card sp-today"><div class="sp-ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="var(--track)" stroke-width="8"/>' +
      '<circle cx="50" cy="50" r="44" fill="none" stroke="var(--fg)" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + (C * inWeek / len) + ' ' + C + '" transform="rotate(-90 50 50)"/></svg>' +
      '<div class="sp-ring-label"><b>' + inWeek + '/' + len + '</b><span>第 ' + wk.n + ' 周</span></div></div>' +
      '<div class="sp-today-main"><div class="sp-eyebrow">' + (allDone ? '30 天都完成了' : 'Día ' + cur + ' · 今日一课') + '</div>' +
      '<h2>' + esc(L ? L.title : '准备中') + '</h2>' +
      '<p class="sp-muted">15 分钟 · ' + esc(L ? L.cando : '这一课的内容还在写') + '</p></div></section>';
    html += L ? '<button class="btn primary big sp-start" data-sp="open" data-day="' + cur + '">' + (allDone ? '再练一次 Día ' + cur : passed(cur) ? '再练一次' : '开始今日一课') + '</button>'
      : '<button class="btn big" disabled>这一课还在准备中</button>';

    // “你现在能说”：最近过关那一课的句子（不是“学了多少词”）
    var cs = lastPassed && LESSONS[lastPassed] && LESSONS[lastPassed].canSay;
    if (cs) html += '<section class="card sp-cansay"><div class="sp-small">你现在能说</div><div class="sp-row">' +
      '<button class="say" data-sp="say" data-text="' + esc(V(cs)) + '" aria-label="朗读">' + I.speaker + '</button>' +
      '<div><p class="sp-es" lang="es">' + esc(V(cs)) + '</p><p class="sp-small">' + esc(cs.zh || '') + '（Día ' + lastPassed + ' 过关句）</p></div></div></section>';
    else html += '<p class="hint">每课 15 分钟，6 段：' + SEGS.join(' → ') + '。说到 ' + PASS + ' 分才算过关。</p>';

    if (!canRecognize()) html += '<p class="hint">这个浏览器不能识别语音：会改成“自己说 → 听示范 → 自己判断”。用电脑的 Chrome / Edge 或 iPhone 的 Safari 效果最好。</p>';

    WEEKS.forEach(function (w) {
      html += '<h2 class="section-title">第 ' + w.n + ' 周 <span>' + w.title + '</span></h2><div class="sp-days">';
      for (var d = w.from; d <= w.to; d++) {
        var Ld = LESSONS[d], ok = passed(d), open = unlocked(d) && !!Ld, now = d === cur;
        html += '<button class="sp-day' + (ok ? ' done' : '') + (now ? ' now' : '') + '" data-sp="open" data-day="' + d + '"' + (open ? '' : ' disabled') + '>' +
          '<span class="sp-dn">' + (ok ? I.check : d) + '</span>' +
          '<span class="sp-dt"><b>' + esc(Ld ? Ld.title : '准备中') + '</b><small>' + esc(Ld ? Ld.cando : '') + '</small></span>' +
          (open ? '' : '<span class="sp-lock">' + I.lock + '</span>') + '</button>';
      }
      html += '</div>';
    });
    // 录音小测试（2026-11-19 排查 iPhone“第二次录不进”：分别试 连录 / 放提示音后录 / 放西语后录）
    html += '<h2 class="section-title">录音小测试 <span>录不进去时用</span></h2><section class="card sp-test">' +
      '<p class="sp-small">每次点“录一句”后说 <b lang="es">hola, buenos días</b>。看看哪一步之后就录不进了。</p>' +
      '<div class="sp-test-btns"><button class="btn primary" data-sp="t-rec">录一句</button>' +
      '<button class="btn" data-sp="t-say">放一句西语</button><button class="btn" data-sp="t-beep">放提示音</button>' +
      '<button class="btn" data-sp="t-hold">' + (micHold ? '麦克风常开：开着' : '麦克风常开') + '</button>' +
      '<button class="btn" data-sp="t-reload">刷新页面</button></div>' +
      '<ol class="sp-test-log">' + testLog.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></section>';
    html += '<p class="footnote">打分用的是手机或浏览器自带的语音识别：逐词比对你说的话和标准句，不能按音节判断发音。</p>';
    view.innerHTML = html;
  }
  var testLog = [], testBusy = false, micHold = null;
  try { testLog = JSON.parse(sessionStorage.getItem('ene-sr-testlog') || '[]') || []; } catch (e) {}
  // 试验：一直开着一个麦克风流（getUserMedia），看 iPhone 放声音后识别还能不能出字
  function testHold(btn) {
    if (micHold) { try { micHold.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} micHold = null; btn.textContent = '麦克风常开'; testAdd('关了麦克风常开'); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { testAdd('这个浏览器不能开麦克风常开'); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      micHold = s; btn.textContent = '麦克风常开：开着'; testAdd('开了麦克风常开');
    }, function (e) { testAdd('麦克风常开失败：' + (e && e.name)); });
  }
  function testAdd(x) {
    testLog.push(x);
    try { sessionStorage.setItem('ene-sr-testlog', JSON.stringify(testLog)); } catch (e) {}
    var ol = document.querySelector('.sp-test-log');
    if (ol) { var li = document.createElement('li'); li.textContent = x; ol.appendChild(li); }
  }
  function testRec(btn) {
    if (testBusy) { stopListen(); return; }
    testBusy = true; btn.textContent = '请稍等…';
    var n = testLog.filter(function (x) { return /^录音/.test(x); }).length + 1;
    function done(txt) { testBusy = false; btn.textContent = '录一句'; testAdd('录音 ' + n + '：' + txt + (txt.indexOf('听到') === 0 ? '' : '｜' + lastLog)); }
    listen(function (t) { btn.textContent = '听到：' + t; },
      function (alts) { done(alts && alts.length && alts[0] ? '听到「' + alts[0] + '」' : '没听到｜' + lastLog); },
      function (why) { done('失败 ' + why + '｜' + lastLog); },
      function () { btn.textContent = '现在说（点这里停）'; });
  }
  function variantToggle() {
    var v = variant();
    return '<div class="sp-variant" role="radiogroup" aria-label="西语变体">' + [['latam', '拉美'], ['es', '西班牙']].map(function (o) {
      return '<button role="radio" aria-checked="' + (v === o[0]) + '" class="' + (v === o[0] ? 'on' : '') + '" data-sp="variant" data-v="' + o[0] + '">' + o[1] + '</button>';
    }).join('') + '</div>';
  }

  /* ================= 上课（全屏） ================= */
  var box = null, P = null, loops = [], dlgToken = 0;
  function ensureBox() {
    if (box) return box;
    box = document.createElement('section');
    box.className = 'sp-session'; box.hidden = true; box.setAttribute('aria-label', '口语课');
    document.body.appendChild(box);
    box.addEventListener('click', onClick);
    return box;
  }
  function open(day) {
    var L = LESSONS[day];
    if (!L) return;
    ensureBox();
    P = { L: L, day: day, screen: 'warm', warmPick: -1, speed: 1.0, played: false, lineNow: -1, showLines: false, reveal: {}, checkPick: -1,
      task: 0, tries: L.tasks.map(function () { return 0; }), best: L.tasks.map(function () { return 0; }), done: L.tasks.map(function () { return false; }),
      skipped: L.tasks.map(function () { return false; }), drilled: {}, rec: false, interim: '', result: null, self: !canRecognize(), selfShown: false,
      drill: null };
    document.body.classList.add('in-session');
    box.hidden = false;
    render(true);
  }
  function close() {
    stopAll();
    dropHold();
    P = null;
    if (box) { box.hidden = true; box.innerHTML = ''; }
    document.body.classList.remove('in-session');
    if (Ene.App && Ene.App.route) Ene.App.route();
  }
  function stopAll() { dlgToken++; abortListen(); Speech.stop(); stopLoops(); }
  function stopLoops() { loops.forEach(function (id) { clearInterval(id); }); loops = []; }
  function go(screen) { stopAll(); P.lineNow = -1; P.rec = false; P.screen = screen; render(true); }

  var SEG_OF = { warm: 0, input: 1, chunks: 2, produce: 3, feedback: 4, drill: 4, result: 5 };
  function topBar() {
    var cur = SEG_OF[P.screen];
    return '<div class="sp-lesson-top"><button class="icon-btn" data-sp="close" aria-label="退出这一课">' + I.close + '</button>' +
      '<div class="sp-segs" aria-label="本课进度">' + SEGS.map(function (n, i) {
        return '<i class="' + (i < cur ? 'done' : i === cur ? 'now' : '') + '" title="' + n + '"></i>';
      }).join('') + '</div><div class="sp-seg-name">' + SEGS[cur] + '</div></div>';
  }

  function render(anim) {
    if (!P) return;
    var fn = { warm: warmHTML, input: inputHTML, chunks: chunksHTML, produce: produceHTML, feedback: feedbackHTML, drill: drillHTML, result: resultHTML }[P.screen];
    box.innerHTML = '<div class="sp-wrap' + (anim ? ' sp-enter' : '') + '">' + topBar() + fn() + '</div>';
    if (anim) box.scrollTop = 0;
    if (P.screen === 'produce' && P.rec) startLevel();
  }

  function opts(list, picked, answer, act, disabled, text) {
    return '<div class="sp-opts">' + list.map(function (o, i) {
      var cls = 'sp-opt' + (text ? ' text' : '');
      if (picked >= 0) cls += i === answer ? ' ok' : i === picked ? ' bad' : ' dim';
      return '<button class="' + cls + '" data-sp="' + act + '" data-i="' + i + '"' + (picked >= 0 || disabled ? ' disabled' : '') + '>' + esc(o) + '</button>';
    }).join('') + '</div>';
  }

  // ① 热场复现
  function warmHTML() {
    var w = P.L.warm, p = P.warmPick;
    return '<div class="sp-eyebrow">Día ' + P.day + ' · ' + esc(P.L.title) + ' · 热场复现 1 分钟</div><h2>' + esc(w.q) + '</h2>' +
      '<div class="card sp-center"><button class="sp-play" data-sp="warm-play" aria-label="播放">' + I.play + '</button><p class="sp-small">点一下听，可以多听几次</p></div>' +
      opts(w.opts, p, w.answer, 'warm-pick', false, !/^[\d.,\s]+$/.test(w.opts.join(''))) +
      (p >= 0 ? '<p class="sp-muted">' + (p === w.answer ? '对了。' : '正确答案：' + esc(w.opts[w.answer]) + '。') + ' <span class="sp-es" lang="es">' + esc(V(w.say)) + '</span></p>' : '') +
      '<div class="sp-grow"></div><div class="sp-actions"><button class="btn primary big" data-sp="go" data-to="input"' + (p < 0 ? ' disabled' : '') + '>下一步：听对话</button></div>';
  }

  // ② 可理解输入
  var BARS = 36;
  var WAVE = (function () { var a = []; for (var i = 0; i < BARS; i++) a.push(0.25 + 0.75 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37))); return a; })();
  function inputHTML() {
    var D = P.L.dialog, playing = P.lineNow >= 0;
    var frac = playing ? P.lineNow / D.length : (P.played ? 1 : 0);
    var html = '<div class="sp-eyebrow">可理解输入 · 3 分钟</div><h2>先只用耳朵听，字幕默认关闭</h2>' +
      '<div class="sp-player"><div class="sp-wave" id="sp-wave">' + WAVE.map(function (h, i) {
        return '<i style="height:' + Math.round(h * 100) + '%" class="' + (i / BARS < frac ? 'played' : '') + '"></i>';
      }).join('') + '</div>' +
      '<div class="sp-player-ctl"><button class="sp-play" data-sp="dlg" aria-label="' + (playing ? '暂停' : '播放') + '">' + (playing ? I.pause : I.play) + '</button>' +
      '<div class="sp-who">' + (playing ? esc(D[P.lineNow].who) + ' · ' + (P.lineNow + 1) + '/' + D.length : D.length + ' 句 · ' + (variant() === 'es' ? '西班牙' : '拉美') + '口音') + '</div>' +
      '<div class="sp-speeds" role="radiogroup" aria-label="语速">' + [0.8, 1.0, 1.2].map(function (r) {
        return '<button role="radio" aria-checked="' + (P.speed === r) + '" class="' + (P.speed === r ? 'on' : '') + '" data-sp="speed" data-v="' + r + '">' + r.toFixed(1) + '</button>';
      }).join('') + '</div></div></div>';
    if (!P.showLines) html += '<button class="btn link" data-sp="lines">听不懂？逐句降速听</button>';
    else html += '<p class="sp-small">每句单独播放会慢一档（' + Math.max(0.6, P.speed - 0.2).toFixed(1) + '）。实在听不出来再看字幕。</p><div class="sp-lines">' +
      D.map(function (l, i) {
        return '<div class="sp-line' + (P.lineNow === i ? ' now' : '') + '"><button class="say" data-sp="line" data-i="' + i + '" aria-label="慢速播放第 ' + (i + 1) + ' 句">' + I.speaker + '</button>' +
          '<div class="sp-line-t"><div class="sp-who">' + esc(l.who) + '</div>' +
          (P.reveal[i] ? '<p class="sp-es" lang="es">' + esc(V(l)) + '</p><p class="sp-small">' + esc(l.zh) + '</p>'
            : '<p class="sp-hidden">· · · · · ·</p><button class="sp-reveal" data-sp="reveal" data-i="' + i + '">看字幕</button>') + '</div></div>';
      }).join('') + '</div>';
    var c = P.L.check;
    html += '<div class="card"><div class="sp-small">听完回答</div><p><b>' + esc(c.q) + '</b></p>' + opts(c.opts, P.checkPick, c.answer, 'check', !P.played, true) +
      (!P.played ? '<p class="sp-small">先听一遍再回答</p>' : '') + '</div>' +
      '<div class="sp-grow"></div><div class="sp-actions"><button class="btn primary big" data-sp="go" data-to="chunks"' + (P.checkPick < 0 ? ' disabled' : '') + '>下一步：拆要点</button></div>';
    return html;
  }
  function playDialog(from) {
    var token = ++dlgToken, D = P.L.dialog;
    function step(i) {
      if (!P || token !== dlgToken) return;
      if (i >= D.length) { P.lineNow = -1; P.played = true; stopLoops(); render(false); return; }
      P.lineNow = i; render(false); animateWave();
      var l = D[i];
      say(V(l), P.speed, function () { if (P && token === dlgToken) setTimeout(function () { step(i + 1); }, 320); }, null, speakerIndex(P.L, i));
    }
    step(from || 0);
  }
  function animateWave() {
    stopLoops();
    loops.push(setInterval(function () {
      var w = document.getElementById('sp-wave');
      if (!w || !P || P.lineNow < 0) return;
      var bars = w.children, f = (P.lineNow + 0.5) / P.L.dialog.length;
      for (var i = 0; i < bars.length; i++) {
        var near = Math.abs(i / BARS - f) < 0.08;
        bars[i].style.height = Math.round((near ? 0.45 + Math.random() * 0.55 : WAVE[i]) * 100) + '%';
      }
    }, 110));
  }

  // ③ 拆要点
  function chunksHTML() {
    var L = P.L;
    return '<div class="sp-eyebrow">拆要点 · 3 分钟</div><h2>这一课的 ' + L.chunks.length + ' 个语块</h2>' +
      L.chunks.map(function (c) {
        var t = V(c), differs = variant() === 'es' && c.es && c.es !== c.latam;
        return '<div class="card"><div class="sp-row"><button class="say" data-sp="say" data-text="' + esc(t.replace(/…/g, ' ').replace(/ — /g, '. ').replace(/\s*\/\s*/g, ', ')) + '" aria-label="朗读">' + I.speaker + '</button>' +
          '<div class="sp-chunk"><p class="sp-es" lang="es">' + esc(t) + (differs ? '<span class="sp-diff">西班牙说法</span>' : '') + '</p>' +
          '<p class="sp-muted">' + esc(c.zh) + '</p>' + (c.note ? '<p class="sp-small">' + esc(V(c.note)) + '</p>' : '') + '</div></div></div>';
      }).join('') +
      (L.tip ? '<div class="sp-tip"><div class="sp-small">发音提醒</div><p>' + esc(V(L.tip)) + '</p></div>' : '') +
      '<div class="sp-grow"></div><div class="sp-actions"><button class="btn primary big" data-sp="go" data-to="produce">下一步：轮到你说</button></div>';
  }

  // ④ 产出任务
  function dots() {
    return '<div class="sp-dots">' + P.L.tasks.map(function (_, i) {
      return '<i class="' + (P.done[i] || P.skipped[i] ? 'done' : i === P.task ? 'now' : '') + '"></i>';
    }).join('') + '</div>';
  }
  function produceHTML() {
    var t = P.L.tasks[P.task], inner;
    if (P.self) {
      inner = '<p class="sp-muted sp-c">大声说出来，说完点下面的按钮。</p>' +
        '<button class="sp-mic" data-sp="self-done" aria-label="说完了">' + I.check + '</button><p class="sp-small sp-c">说完了，看答案</p>' +
        (SR ? '<button class="btn link" data-sp="sr-retry">再试一次语音识别</button>' : '');
    } else if (P.rec) {
      inner = '<div class="sp-level" id="sp-level">' + new Array(16).join('<i></i>') + '</div>' +
        '<button class="sp-mic rec" data-sp="rec-stop" aria-label="停止"><span class="sp-stop"></span></button>' +
        '<p class="sp-heard-live' + (P.recReady ? ' ready' : '') + '" lang="es">' + esc(P.interim || (P.recReady ? '现在说吧' : '请稍等…')) + '</p>' +
        '<p class="sp-small sp-c">说完停一下会自动结束，也可以点方块结束</p>';
    } else {
      inner = '<button class="sp-mic" data-sp="rec" aria-label="开始说">' + I.mic + '</button>' +
        '<p class="sp-muted sp-c">' + (P.tries[P.task] ? '再说一遍' : '点一下，开始说') + '</p>';
    }
    return '<div class="sp-eyebrow">产出任务 · 第 ' + (P.task + 1) + ' / ' + P.L.tasks.length + ' 句</div>' + dots() +
      '<div class="card sp-prompt"><div class="sp-small">你要说的意思</div><div class="sp-zh">' + esc(t.zh) + '</div>' +
      '<div class="sp-small">提示：' + esc(t.cue) + '</div></div>' +
      '<div class="sp-mic-zone">' + inner + '</div>';
  }
  function startLevel() {
    stopLoops();
    loops.push(setInterval(function () {
      var lv = document.getElementById('sp-level');
      if (!lv) return;
      for (var i = 0; i < lv.children.length; i++) lv.children[i].style.height = Math.round(4 + Math.random() * 24 * (0.4 + 0.6 * Math.abs(Math.sin(Date.now() / 300 + i)))) + 'px';
    }, 90));
  }
  function startRec() {
    P.rec = true; P.recReady = false; P.interim = ''; render(false);
    var mine = P;
    listen(function (txt) {
      if (P !== mine) return;
      P.interim = txt;
      var el = box.querySelector('.sp-heard-live'); if (el) el.textContent = txt;
    }, function (alts) {
      if (P !== mine) return;
      P.rec = false; stopLoops();
      var t = P.L.tasks[P.task];
      P.tries[P.task]++;
      // 标准答案 + 也算对的说法（t.alt，例如女生说 alérgica）：取得分最高的那个
      var answers = [V(t)].concat((t.alt || []).map(V)).filter(Boolean);
      P.result = answers.map(function (a) { return grade(a, alts); })
        .reduce(function (b, g) { return !b || g.score > b.score ? g : b; }, null);
      P.result.empty = !alts.length || !String(alts[0]).trim();
      P.result.log = lastLog;
      if (P.result.score > P.best[P.task]) P.best[P.task] = P.result.score;
      P.sel = -1;
      go('feedback');
    }, function (why) {
      if (P !== mine) return;
      P.rec = false; stopLoops();
      if (why === 'network') {
        toast(NET_MSG);
        render(false);
        return;
      }
      setBroken(true); P.self = true;
      toast(why === 'hang' ? '语音识别没有反应，先改成自己对照：说完看答案、听示范，自己判断。'
        : '这里不能用语音识别，改成自己对照：说完看答案、听示范，自己判断。');
      render(false);
    }, function () {
      if (P !== mine) return;
      P.recReady = true;
      var el = box.querySelector('.sp-heard-live');
      if (el) { el.classList.add('ready'); if (!P.interim) el.textContent = '现在说吧'; }
    });
  }
  var NET_MSG = '语音识别连不上网。电脑上的 Chrome 要连谷歌的服务，国内常常连不上，建议换 Edge 浏览器或用手机。';

  // ⑤ 纠错打分
  function feedbackHTML() {
    var t = P.L.tasks[P.task], last = P.task === P.L.tasks.length - 1;
    var html = '<div class="sp-eyebrow">纠错打分 · 第 ' + (P.task + 1) + ' 句 · 第 ' + P.tries[P.task] + ' 次</div>';
    if (P.self) {
      html += '<h2>对照一下：你说的是这句吗？</h2>' +
        '<div class="card"><div class="sp-row"><button class="say" data-sp="say" data-text="' + esc(V(t)) + '" aria-label="听示范">' + I.speaker + '</button>' +
        '<div><p class="sp-es sp-big" lang="es">' + esc(V(t)) + '</p><p class="sp-small">' + esc(t.zh) + '</p></div></div>' +
        '<button class="btn link" data-sp="say" data-text="' + esc(V(t)) + '" data-rate="0.7">慢速听一遍</button></div>' +
        '<div class="sp-grow"></div><div class="sp-actions"><div class="sp-two">' +
        '<button class="btn outline big" data-sp="self-no">没说对</button><button class="btn primary big" data-sp="self-yes">说对了</button></div></div>';
      return html;
    }
    var r = P.result, C = 2 * Math.PI * 40;
    html += '<div class="sp-score-head"><div class="sp-score"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--track)" stroke-width="9"/>' +
      '<circle cx="50" cy="50" r="40" fill="none" stroke="var(--fg)" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + (C * r.score / 100) + ' ' + C + '" transform="rotate(-90 50 50)"/></svg><b>' + r.score + '</b></div>' +
      '<div><div class="sp-verdict">' + (r.pass ? '过关' : r.empty ? '没听到声音' : '还差一点') + '</div><p class="sp-small">' +
      (r.pass ? '说对了 ' + r.score + '%，可以进入下一句' : r.empty ? '靠近一点、大声一点再说一次' : '要说对 ' + PASS + '% 的词才算过关，看看黑底的词') + '</p></div></div>' +
      '<div class="card"><div class="sp-small">逐词比对（点一个词听示范）</div><div class="sp-words" lang="es">' +
      r.words.map(function (x, i) {
        return '<button class="sp-w' + (x.ok ? '' : ' low') + (P.sel === i ? ' sel' : '') + '" data-sp="word" data-i="' + i + '">' + esc(x.w) + '</button>';
      }).join('') + '</div>' +
      '<div class="sp-legend"><span><i class="sw low"></i>没听出来 / 说错了</span><span><i class="sw"></i>说对了</span></div>' +
      '<p class="sp-heard" lang="es"><span class="sp-small">我们听到：</span>' + esc(r.heard || '（没有听到）') + '</p>' +
      (r.empty && r.log ? '<p class="sp-small sp-log">识别记录（收不到音时截图给我们）：' + esc(r.log) + '</p>' : '') + '</div>';
    html += '<div class="sp-grow"></div><div class="sp-actions">';
    if (r.pass) {
      html += '<button class="btn primary big" data-sp="next">' + (last ? '本课结算' : '下一句') + '</button>' +
        '<button class="btn link" data-sp="again">再说一遍</button>';
    } else {
      var lows = r.words.filter(function (x) { return !x.ok; }).map(function (x) { return x.w.replace(/[¿?¡!.,]/g, ''); }).slice(0, 4);
      html += (r.empty ? '' : '<button class="btn primary big" data-sp="drill">进入窄场景重练' + (lows.length ? '（' + esc(lows.join('、')) + '）' : '') + '</button>') +
        '<button class="btn' + (r.empty ? ' primary' : '') + ' big" data-sp="again">再说一遍</button>' +
        (r.empty ? '<button class="btn link" data-sp="to-self">总是听不到？改成自己对照</button>' : '') +
        (P.tries[P.task] >= 3 ? '<button class="btn link" data-sp="skip">先跳过（这一课就不算过关）</button>' : '<p class="sp-small sp-c">不过关不能跳过，这一句要说对 ' + PASS + '% 的词</p>');
    }
    return html + '</div>';
  }

  // 窄场景重练：本课的 drill 项目 + 刚才没说对的词
  function drillHTML() {
    var d = P.drill, all = d.items.every(function (it) { return it.done; });
    return '<div class="sp-eyebrow">窄场景重练</div><h2>' + esc(P.L.drill.title) + '</h2>' +
      '<p class="sp-muted">先把容易错的地方放进这个场景里的短词练熟，再回去说整句。每个先听，再跟着说。</p>' +
      d.items.map(function (it, i) {
        var active = !it.done && d.items.slice(0, i).every(function (x) { return x.done; });
        return '<div class="sp-drill' + (it.done ? ' done' : '') + '">' +
          '<button class="say" data-sp="say" data-text="' + esc(it.text) + '" data-rate="0.7" aria-label="慢速示范">' + I.speaker + '</button>' +
          '<div class="sp-drill-t"><div class="sp-es" lang="es">' + esc(it.text) + '</div><div class="sp-small">' + esc(it.tip || '') +
          (it.msg ? ' · ' + esc(it.msg) : '') + '</div></div>' +
          (it.done ? '<span class="sp-ok">' + I.check + '</span>'
            : P.self ? '<button class="btn sp-mini-btn" data-sp="drill-self" data-i="' + i + '"' + (active ? '' : ' disabled') + '>跟读了</button>'
            : '<button class="sp-mini' + (d.rec === i ? ' rec' : '') + '" data-sp="drill-rec" data-i="' + i + '"' + (active ? '' : ' disabled') + ' aria-label="跟读">' + I.mic + '</button>') +
          '</div>';
      }).join('') +
      '<div class="sp-grow"></div><div class="sp-actions"><button class="btn primary big" data-sp="drill-back"' + (all ? '' : ' disabled') + '>回到第 ' + (P.task + 1) + ' 句再说一遍</button></div>';
  }
  function startDrill() {
    var items = (P.L.drill.items || []).map(function (it) { return { text: V(it), tip: V(it.tip), tries: 0, done: false }; });
    // 刚才没说对的词（最多 2 个）也加进来练
    if (P.result && P.result.words) {
      P.result.words.filter(function (x) { return !x.ok; }).slice(0, 2).forEach(function (x) {
        var w = x.w.replace(/[¿?¡!.,;:]/g, '');
        if (w && !items.some(function (it) { return norm(it.text) === norm(w); })) items.push({ text: w, tip: '刚才这个词没说对', tries: 0, done: false });
      });
    }
    P.drill = { items: items, rec: -1 };
    P.drilled[P.task] = true;
    go('drill');
  }

  // ⑥ 结算 + 明日挂钩
  function lessonScores() {
    var by = {}, cnt = {};
    P.L.tasks.forEach(function (t, i) { var k = t.skill || 'phrase'; by[k] = (by[k] || 0) + (P.self ? (P.done[i] ? 85 : 50) : P.best[i]); cnt[k] = (cnt[k] || 0) + 1; });
    var s = {}; for (var k in by) s[k] = Math.round(by[k] / cnt[k]);
    s.listen = P.checkPick === P.L.check.answer ? (P.reveal && Object.keys(P.reveal).length ? 75 : 90) : 45;
    return s;
  }
  function weekWeak(day) {
    var w = weekOf(day), sum = {}, cnt = {};
    for (var d = w.from; d <= w.to; d++) {
      var r = rec(d); if (!r || !r.scores) continue;
      for (var k in r.scores) { sum[k] = (sum[k] || 0) + r.scores[k]; cnt[k] = (cnt[k] || 0) + 1; }
    }
    return ['conj', 'pron', 'listen'].map(function (k) { return { k: k, v: cnt[k] ? Math.round(sum[k] / cnt[k]) : null }; });
  }
  function finishLesson() {
    var ok = P.done.every(Boolean);
    var old = rec(P.day) || {};
    var r = { passed: ok || !!old.passed, passedAt: ok ? (old.passedAt || Date.now()) : (old.passedAt || null),
      tries: (old.tries || 0) + 1, scores: lessonScores(), self: P.self };
    Store.setSpeakDay(P.day, r);
    try { Store.logStudy(P.L.tasks.length, 0); } catch (e) {}
    if (Ene.Cloud && Ene.Cloud.changed) { try { Ene.Cloud.changed(); } catch (e) {} }
    P.lessonOk = ok;
    go('result');
  }
  function resultHTML() {
    var L = P.L, ok = P.lessonOk, next = LESSONS[P.day + 1];
    var weak = weekWeak(P.day);
    var html = '<div class="card ' + (ok ? 'sp-cando-ok' : 'sp-cando-no') + '"><div class="sp-check">' + (ok ? I.check : '!') + '</div>' +
      '<div class="sp-small">Día ' + P.day + (ok ? ' 达成' : ' 还没达成') + '</div><h2>' + esc(L.cando) + '</h2>' +
      '<ul class="sp-cando-list">' + L.candoItems.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      (ok ? '' : '<p>有 ' + P.skipped.filter(Boolean).length + ' 句跳过了。明天先把这一课再练一遍，过关后才会解锁下一课。</p>') + '</div>';
    html += '<div class="card"><div class="sp-small">第 ' + weekOf(P.day).n + ' 周薄弱项</div><div class="sp-weak">' + weak.map(function (w) {
      return '<span>' + SKILL_ZH[w.k] + '</span><div class="sp-bar"><i style="width:' + (w.v || 0) + '%"></i></div><b>' + (w.v == null ? '—' : w.v) + '</b>';
    }).join('') + '</div><p class="sp-small">' + weakHint(weak) + '</p></div>';
    if (next && ok) html += '<div class="card"><div class="sp-small">明日预告 · Día ' + next.day + '</div><h2>' + esc(next.title) + '</h2><p class="sp-muted">' + esc(next.cando) + '</p>' +
      (next.canSay ? '<div class="sp-row"><button class="say" data-sp="say" data-text="' + esc(V(next.canSay)) + '" aria-label="朗读">' + I.speaker + '</button>' +
        '<div><p class="sp-es" lang="es">' + esc(V(next.canSay)) + '</p><p class="sp-small">' + esc(next.canSay.zh || '') + ' 明天你就会说这句。</p></div></div>' : '') + '</div>';
    else if (ok && P.day === TOTAL) html += '<div class="card"><h2>30 天完成了</h2><p class="sp-muted">可以回到任何一课再练，也可以换成“西班牙”说法再走一遍。</p></div>';
    html += '<div class="sp-grow"></div><div class="sp-actions"><button class="btn primary big" data-sp="close">完成</button>' +
      '<button class="btn link" data-sp="again-lesson">这一课再练一次</button></div>';
    return html;
  }
  function weakHint(weak) {
    var low = weak.filter(function (w) { return w.v != null; }).sort(function (a, b) { return a.v - b.v; })[0];
    if (!low) return '多学几课就能看出薄弱项。';
    if (low.v >= 85) return '这周都不错，保持。';
    return '最弱的是' + SKILL_ZH[low.k] + '，周复盘课会再练。';
  }

  /* ---------- 点击 ---------- */
  var toastEl = null;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastEl); toastEl = setTimeout(function () { t.classList.remove('show'); }, 3600);
  }
  function onClick(e) {
    var el = e.target.closest('[data-sp]');
    if (!el || el.disabled || !P) return;
    var a = el.getAttribute('data-sp');
    switch (a) {
      case 'close': sfx(e); close(); break;
      case 'say': say(el.getAttribute('data-text'), Number(el.getAttribute('data-rate')) || 0.95); break;
      case 'go': sfx(e); go(el.getAttribute('data-to')); break;
      case 'warm-play': say(V(P.L.warm.say), 0.95); break;
      case 'warm-pick': {
        P.warmPick = +el.getAttribute('data-i');
        if (P.warmPick === P.L.warm.answer) sfx(e); else sfxMiss(e);
        say(V(P.L.warm.say), 0.95); render(false); break;
      }
      case 'dlg':
        if (P.lineNow >= 0) { dlgToken++; Speech.stop(); P.lineNow = -1; stopLoops(); render(false); }
        else playDialog(0);
        break;
      case 'speed': P.speed = +el.getAttribute('data-v'); if (P.lineNow >= 0) playDialog(P.lineNow); else render(false); break;
      case 'lines': sfx(e); P.showLines = true; render(false); break;
      case 'line': {
        dlgToken++; stopLoops();
        var li = +el.getAttribute('data-i'), mine = P;
        P.lineNow = li; render(false);
        say(V(P.L.dialog[li]), Math.max(0.6, P.speed - 0.2), function () { if (P === mine && P.lineNow === li) { P.lineNow = -1; P.played = true; render(false); } }, null, speakerIndex(P.L, li));
        break;
      }
      case 'reveal': P.reveal[+el.getAttribute('data-i')] = true; render(false); break;
      case 'check': {
        P.checkPick = +el.getAttribute('data-i');
        if (P.checkPick === P.L.check.answer) sfx(e); else sfxMiss(e);
        render(false); break;
      }
      case 'rec': Speech.stop(); startRec(); break;
      case 'rec-stop': stopListen(); break;
      case 'self-done': sfx(e); P.tries[P.task]++; go('feedback'); break;
      case 'sr-retry': sfx(e); setBroken(false); P.self = false; render(false); break;
      case 'to-self': sfx(e); setBroken(true); P.self = true; go('produce'); break;
      case 'self-yes': sfx(e); P.done[P.task] = true; nextTask(); break;
      case 'self-no': sfxMiss(e); P.result = null; startDrill(); break;
      case 'word': {
        P.sel = +el.getAttribute('data-i');
        var w = P.result.words[P.sel];
        if (w) say(w.w.replace(/[¿?¡!.,;:]/g, ''), 0.7);
        render(false); break;
      }
      case 'again': sfx(e); go('produce'); break;
      case 'next': sfx(e); P.done[P.task] = true; nextTask(); break;
      case 'skip': sfxMiss(e); P.skipped[P.task] = true; nextTask(); break;
      case 'drill': sfx(e); startDrill(); break;
      case 'drill-rec': {
        var di = +el.getAttribute('data-i');
        if (P.drill.rec >= 0) return;
        Speech.stop();
        P.drill.rec = di; render(false);
        var mineD = P;
        listen(null, function (alts) {
          if (P !== mineD || !P.drill) return;
          var it = P.drill.items[di], g = grade(it.text, alts);
          it.tries++;
          if (g.pass) { it.done = true; it.msg = '说对了'; }
          else if (it.tries >= 2) { it.done = true; it.msg = '练过了，回到整句再试'; }
          else it.msg = '没听清，再听一遍跟着说';
          P.drill.rec = -1; render(false);
        }, function () {
          if (P !== mineD) return;
          P.drill.rec = -1;
          if (arguments[0] === 'network') { toast(NET_MSG); render(false); return; }
          setBroken(true); P.self = true; render(false);
        });
        break;
      }
      case 'drill-self': { var it2 = P.drill.items[+el.getAttribute('data-i')]; it2.done = true; sfx(e); render(false); break; }
      case 'drill-back': sfx(e); go('produce'); break;
      case 'again-lesson': sfx(e); var d0 = P.day; close(); open(d0); break;
    }
  }
  function nextTask() {
    var n = P.L.tasks.length;
    for (var i = P.task + 1; i < n; i++) if (!P.done[i] && !P.skipped[i]) { P.task = i; P.result = null; go('produce'); return; }
    finishLesson();
  }

  // 课程首页上的点击（在 #view 里）
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-sp]');
    if (!el || el.disabled || (box && box.contains(el))) return;
    var a = el.getAttribute('data-sp');
    if (a === 'open') { sfx(e); open(+el.getAttribute('data-day')); }
    else if (a === 'variant') {
      sfx(e);
      Store.setSetting('variant', el.getAttribute('data-v'));
      if (Ene.App && Ene.App.route) Ene.App.route();
    } else if (a === 'say') say(el.getAttribute('data-text'), 0.95);
    else if (a === 't-rec') { Speech.stop(); testRec(el); }
    else if (a === 't-hold') testHold(el);
    else if (a === 't-reload') { testAdd('刷新了页面'); setTimeout(function () { location.reload(); }, 50); }
    else if (a === 't-say') { testAdd('放了一句西语'); say('Hola, ¿cómo estás?', 0.95); }
    else if (a === 't-beep') { testAdd(Ene.Sfx && Ene.Sfx.locked && Ene.Sfx.locked() ? '提示音已关（录过音后不再放）' : '放了提示音');if (Ene.Sfx) { try { Ene.Sfx.tap(e); } catch (x) {} } }
  });

  // 离开页面（切到后台、锁屏）时停止识别，免得回来后卡在“正在听”
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') { if (cur) stopListen(); dropHold(); }
  });

  Ene.Speak = {
    renderHome: renderHome,
    open: open,
    close: close,
    active: function () { return !!P; },
    lessons: LESSONS,
    grade: grade,       // 给测试用
    norm: norm
  };
})();
