/* Eñe 西语单词 —— 按键声音 + 震动（Ene.Sfx）
 *
 * 声音：Web Audio 现场合成（没有音频文件）
 *   Sfx.tap(e)   很短、很轻的“嗒”（下一个、上一个、开始、底部菜单、设置……）
 *   Sfx.done(e)  一轮学完时的轻柔“叮—咚”
 * 震动：navigator.vibrate(10)，只在安卓等支持的手机上。
 *   iPhone 的网页（Safari / 添加到主屏幕）不支持震动——旧项目在用户的 iOS 27 上试过各种办法都不行，所以 iPhone 上什么都不做。
 *   以后用 Capacitor 打包成 App 时，再换成 Haptics 插件。
 *
 * 规矩（旧项目踩过的坑）：
 *   - AudioContext 只在真正的用户操作（isTrusted 的点击 / 按键）里创建或 resume；
 *   - 最后一个声音放完约 1.5 秒后 suspend；页面切到后台就 suspend；pagehide 时 close；
 *   - 不把声音排队留到以后：resume 没在 150 毫秒内成功，这次就不放；
 *   - 不碰 speechSynthesis：页面在同一个点击里先放“嗒”，再调用朗读（朗读照样同步发生）。
 * 开关：设置里的 sound（按键声音）、vibrate（震动），默认都开。
 */
(function () {
  'use strict';
  var Ene = (window.Ene = window.Ene || {});
  var AC = window.AudioContext || window.webkitAudioContext || null;
  var ctx = null, master = null, idleTimer = null;

  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  function settings() { return Ene.Store ? Ene.Store.settings() : { sound: true, vibrate: true }; }
  function soundOn() { return settings().sound !== false; }
  function vibrateOn() { return settings().vibrate !== false; }
  function trusted(e) { return !e || e.isTrusted === true; }

  function canVibrate() {
    return !isIOS && typeof navigator.vibrate === 'function' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);
  }

  // 只在用户操作里调用：需要时创建 AudioContext
  function getCtx() {
    if (!AC) return null;
    try {
      if (!ctx || ctx.state === 'closed') {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);
      }
    } catch (e) { ctx = null; }
    return ctx;
  }

  function suspendSoon(seconds) {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      idleTimer = null;
      try { if (ctx && ctx.state === 'running') { var p = ctx.suspend(); if (p && p.then) p.then(null, function () {}); } } catch (e) {}
    }, (seconds || 0) * 1000 + 1500);
  }
  function suspendNow() {
    clearTimeout(idleTimer); idleTimer = null;
    try { if (ctx && ctx.state === 'running') { var p = ctx.suspend(); if (p && p.then) p.then(null, function () {}); } } catch (e) {}
  }

  function tone(c, o) {
    var t0 = c.currentTime + (o.at || 0) + 0.003;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + o.dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(o.vol, t0 + (o.attack || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + o.dur + 0.03);
  }

  function play(list, e) {
    if (!soundOn() || !trusted(e)) return;
    try { if (document.visibilityState === 'hidden') return; } catch (x) {}
    var c = getCtx();
    if (!c) return;
    var go = function () {
      var end = 0;
      try { list.forEach(function (o) { tone(c, o); end = Math.max(end, (o.at || 0) + o.dur); }); } catch (x) {}
      suspendSoon(end);
    };
    if (c.state === 'running') { go(); return; }
    var t0 = Date.now();
    try {
      var p = c.resume();
      if (p && p.then) p.then(function () { if (c === ctx && c.state === 'running' && Date.now() - t0 <= 150) go(); }, function () {});
      else if (c.state === 'running') go();
    } catch (x) {}
  }

  function buzz(ms, e) {
    if (!vibrateOn() || !canVibrate() || !trusted(e)) return;
    try {
      if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
      navigator.vibrate(ms);
    } catch (x) {}
  }

  var Sfx = {
    // 轻轻的“嗒”+ 轻震
    tap: function (e) {
      play([{ freq: 1500, to: 900, dur: 0.035, type: 'sine', vol: 0.09 }], e);
      buzz(10, e);
    },
    // “不认识”：更低、更轻的“嘟”
    miss: function (e) {
      play([{ freq: 330, to: 240, dur: 0.09, type: 'sine', vol: 0.08 }], e);
      buzz(10, e);
    },
    // 一轮学完：轻柔的两个音
    done: function (e) {
      play([
        { freq: 880, dur: 0.22, type: 'sine', vol: 0.08, at: 0.04 },
        { freq: 1318.5, dur: 0.32, type: 'sine', vol: 0.08, at: 0.16 }
      ], e);
      buzz([10, 40, 10], e);
    },
    canVibrate: canVibrate,
    soundOn: soundOn,
    vibrateOn: vibrateOn,
    info: function () { return { audio: !!AC, ctx: ctx ? ctx.state : 'none', vibrate: canVibrate(), ios: isIOS }; }
  };

  try {
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') suspendNow(); });
    window.addEventListener('pagehide', function () {
      clearTimeout(idleTimer); idleTimer = null;
      try { if (ctx && ctx.close) { var p = ctx.close(); if (p && p.then) p.then(null, function () {}); } } catch (x) {}
      ctx = null; master = null;
    });
  } catch (x) {}

  Ene.Sfx = Sfx;
})();
