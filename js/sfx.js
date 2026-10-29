// ============================================
// 音效 + 触感（sfx.js）—— window.Sfx（阶段 12）
// 所有页面都引入：body 末尾第三个 script（claude-bridge.js 第一、nav.js 第二、然后就是本文件）。
//
// 音效：全部用 Web Audio 现场合成（不用音频文件），短、清脆、卡通：
//   Sfx.pop()      点选项的“啵”
//   Sfx.correct()  答对：上升的两个音“叮—咚”
//   Sfx.wrong()    答错：低沉的“嘟”
//   Sfx.ding()     小的“叮”（配对题配对成功一对）
//   Sfx.win()      过关：一段短的胜利小旋律
//   Sfx.sparkle()  开宝箱、拿星星：闪亮的声音
//   Sfx.fail()     心用完了：往下走的三个音
//   普通按钮不加点击声（免得和答对 / 答错的声音叠在一起太吵）。
// 触感：Sfx.buzz(毫秒或数组)
//   只用 navigator.vibrate（安卓等）：点选项 10ms，答错 [30,40,30]，过关短震。
//   iPhone 的网页实测无法震动（iOS 27 也不行；试过 iOS 18 的 switch 开关小技巧，没有效果，还会抢焦点），已放弃：
//   iPhone 上什么都不做，“我的”页的震动开关也藏起来（Sfx.canVibrate() = false）。
//
// 自动“啵”：点到选项类的按钮（.quiz-option / .m-card / .match-card / .order-token / .guess-key）时，
//   本文件在捕获阶段先同步震一下，再在 0 毫秒后放“啵”；如果同一次点击里页面又调用了答对 / 答错等音效，“啵”就取消，只放那一个。
//
// 规则：
//   - iOS：AudioContext 在第一次用户点击（touchend / pointerdown / keydown）时才创建或 resume；
//   - 不打断西语发音：speechSynthesis 正在读（或排队要读）时，音效只用很小的音量（约 1/4）；
//     页面照样在点击处理函数里同步调用 speakSpanish（音效不碰 speechSynthesis）；
//   - 开关：“我的”页的“声音”“震动”（Progress.soundOn() / vibrateOn()，存在进度的 settings 里，跟着同步，默认都开）；
//     storage.js 还没加载时直接读 localStorage 的进度 key；
//   - 页面在后台（看不见）时不出声。
// ============================================
(function () {
  var PROGRESS_KEY = "es-study-progress-v1";
  var AC = window.AudioContext || window.webkitAudioContext || null;
  var ctx = null, master = null;

  // ---------- 开关 ----------
  function setting(name) {
    try {
      var P = window.Progress;
      if (P && P.soundOn && P.vibrateOn) return name === "sound" ? P.soundOn() : P.vibrateOn();
      var t = window.localStorage ? window.localStorage.getItem(PROGRESS_KEY) : null;
      var st = t ? JSON.parse(t) : null;
      var s = st && st.settings;
      return !(s && s[name] === false);
    } catch (e) {
      return true;
    }
  }
  function soundOn() { return setting("sound"); }
  function vibrateOn() { return setting("vibrate"); }

  // ---------- Web Audio ----------
  function ensure() {
    if (!AC) return null;
    try {
      if (!ctx) {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.55;
        master.connect(ctx.destination);
      }
      if (ctx.state === "suspended" && ctx.resume) {
        var p = ctx.resume();
        if (p && p.then) p.then(null, function () {});
      }
    } catch (e) {
      ctx = null;
    }
    return ctx;
  }
  // 第一次用户操作时解锁（iOS 必须在用户操作里创建 / resume，并放一个无声的小片段）
  var unlocked = false;
  function unlock() {
    if (!soundOn()) return;
    var c = ensure();
    if (!c || unlocked) return;
    try {
      var b = c.createBuffer(1, 1, 22050);
      var s = c.createBufferSource();
      s.buffer = b;
      s.connect(master);
      s.start(0);
      // 只有真的跑起来了才算解锁（iOS 上 resume 可能还没完成，下一次点击再试）
      if (c.state === "running") unlocked = true;
    } catch (e) {}
  }
  ["touchend", "pointerdown", "mousedown", "keydown"].forEach(function (t) {
    try { window.addEventListener(t, unlock, { capture: true, passive: true }); } catch (e) {}
  });

  // 西语正在读（或排队要读）：音效放小声
  function speechBusy() {
    try {
      var ss = window.speechSynthesis;
      return !!(ss && (ss.speaking || ss.pending));
    } catch (e) {
      return false;
    }
  }
  // “安全带”：只记真正的用户操作（isTrusted）。5 秒内没真正操作过，绝不出声（防止任何意外的自动发声）
  var lastInput = 0;
  ["pointerdown", "keydown", "touchend"].forEach(function (t) {
    try { window.addEventListener(t, function (ev) { if (ev && ev.isTrusted) lastInput = Date.now(); }, { capture: true, passive: true }); } catch (e) {}
  });
  function canPlay() {
    if (!soundOn()) return null;
    try { if (document.visibilityState === "hidden") return null; } catch (e) {}
    if (Date.now() - lastInput > 5000) return null;
    var c = ensure();
    return c && c.state !== "closed" ? c : null;
  }
  // 不出声的时候让声音引擎休息：最后一个声音放完 1.5 秒后 suspend（下次 ensure() 会 resume）
  var idleTimer = null;
  function scheduleIdle(seconds) {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      idleTimer = null;
      try { if (ctx && ctx.state === "running" && ctx.suspend) { var p = ctx.suspend(); if (p && p.then) p.then(null, function () {}); } } catch (e) {}
    }, Math.max(0, seconds) * 1000 + 1500);
  }
  function suspendNow() {
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
    try { if (ctx && ctx.state === "running" && ctx.suspend) { var p = ctx.suspend(); if (p && p.then) p.then(null, function () {}); } } catch (e) {}
  }
  // 一个音：freq 起始频率，to 结束频率（可选，滑音），dur 秒，type 波形，vol 音量，at 延迟（秒）
  function tone(c, o) {
    var t0 = c.currentTime + (o.at || 0) + 0.005;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + (o.slide || o.dur));
    var v = Math.max(0.0001, (o.vol || 0.3) * (speechBusy() ? 0.25 : 1));
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + (o.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    var out = g;
    if (o.lowpass) {
      var f = c.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = o.lowpass;
      g.connect(f);
      out = f;
    }
    osc.connect(g);
    out.connect(master);
    osc.start(t0);
    osc.stop(t0 + o.dur + 0.05);
  }
  function play(list) {
    var c = canPlay();
    if (!c) return;
    var go = function () {
      var end = 0;
      try {
        for (var i = 0; i < list.length; i++) { tone(c, list[i]); end = Math.max(end, (list[i].at || 0) + list[i].dur); }
      } catch (e) {}
      scheduleIdle(end + 0.05);
    };
    if (c.state === "running") { go(); return; }
    // 引擎不在运行：先 resume；300 毫秒内跑起来了才放，否则这次就不放（不留到以后补播）
    var t0 = Date.now();
    try {
      var p = c.resume ? c.resume() : null;
      if (p && p.then) p.then(function () { if (c === ctx && c.state === "running" && Date.now() - t0 <= 300) go(); }, function () {});
      else if (c.state === "running") go();
    } catch (e) {}
  }

  // ---------- 触感 ----------
  function buzz(pattern) {
    if (!vibrateOn()) return;
    // 用户还没真正点过页面（例如程序自己触发的点击）：浏览器不让震，直接跳过（免得控制台报错）
    try {
      if (typeof navigator.vibrate === "function") {
        if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  }

  // ---------- 声音清单 ----------
  var pendingPop = null;
  function cancelPop() {
    if (pendingPop) { clearTimeout(pendingPop); pendingPop = null; }
  }
  var S = {
    pop: function () {
      play([{ freq: 380, to: 920, slide: 0.06, dur: 0.09, type: "sine", vol: 0.32 }]);
    },
    ding: function () {
      cancelPop();
      play([{ freq: 1318.5, dur: 0.22, type: "sine", vol: 0.22 }, { freq: 2637, dur: 0.12, type: "sine", vol: 0.05 }]);
    },
    correct: function () {
      cancelPop();
      play([
        { freq: 880, dur: 0.16, type: "triangle", vol: 0.3 },
        { freq: 1760, dur: 0.1, type: "sine", vol: 0.06 },
        { freq: 1318.5, dur: 0.34, type: "triangle", vol: 0.32, at: 0.11 },
        { freq: 2637, dur: 0.2, type: "sine", vol: 0.06, at: 0.11 }
      ]);
    },
    wrong: function () {
      cancelPop();
      play([
        { freq: 196, to: 150, slide: 0.3, dur: 0.32, type: "sawtooth", vol: 0.22, lowpass: 700 },
        { freq: 98, to: 80, slide: 0.3, dur: 0.3, type: "sine", vol: 0.2 }
      ]);
      buzz([30, 40, 30]);
    },
    fail: function () {
      cancelPop();
      play([
        { freq: 392, dur: 0.18, type: "triangle", vol: 0.25 },
        { freq: 330, dur: 0.18, type: "triangle", vol: 0.25, at: 0.17 },
        { freq: 262, to: 220, slide: 0.35, dur: 0.4, type: "triangle", vol: 0.25, at: 0.34 }
      ]);
      buzz([30, 40, 30]);
    },
    win: function () {
      cancelPop();
      var n = [523.25, 659.25, 783.99, 1046.5];
      var list = [];
      for (var i = 0; i < n.length; i++) list.push({ freq: n[i], dur: 0.16, type: "triangle", vol: 0.26, at: i * 0.1 });
      list.push({ freq: 783.99, dur: 0.5, type: "triangle", vol: 0.2, at: 0.42 });
      list.push({ freq: 1046.5, dur: 0.6, type: "triangle", vol: 0.24, at: 0.42 });
      list.push({ freq: 1318.5, dur: 0.6, type: "sine", vol: 0.14, at: 0.42 });
      play(list);
      buzz([20, 60, 40]);
    },
    sparkle: function () {
      cancelPop();
      var n = [1567.98, 2093, 2637, 2349.3, 3136, 3520];
      var list = [];
      for (var i = 0; i < n.length; i++) list.push({ freq: n[i], dur: 0.14, type: "sine", vol: 0.13, at: i * 0.055 });
      play(list);
      buzz(15);
    },
    buzz: buzz,
    // 这台设备的网页能不能震动（iPhone 不能）：“我的”页据此决定显不显示震动开关
    canVibrate: function () { return typeof navigator.vibrate === "function"; },
    soundOn: soundOn,
    vibrateOn: vibrateOn,
    unlock: unlock,
    // 给测试看：有没有 vibrate、有没有 Web Audio、声音引擎的状态
    info: function () {
      return { audio: !!AC, ctx: ctx ? ctx.state : "none", vibrate: typeof navigator.vibrate === "function" };
    }
  };

  // ---------- 点选项时的“啵” + 轻震（捕获阶段，比页面自己的点击处理更早） ----------
  var OPTION_SEL = ".quiz-option, .m-card, .match-card, .order-token, .guess-key";
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    var b = t.closest(OPTION_SEL);
    if (!b || b.disabled || b.getAttribute("aria-disabled") === "true") return;
    if (!ev.isTrusted && Date.now() - lastInput > 1000) return; // 不是真正的点击（程序触发的）：不“啵”也不震
    buzz(10);
    if (!soundOn()) return;
    ensure();
    cancelPop();
    pendingPop = setTimeout(function () { pendingPop = null; S.pop(); }, 0);
  }, true);

  // 页面切到后台：停掉没放的“啵”，引擎休息；离开页面：关掉引擎（回来时会重新创建）
  try {
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") { cancelPop(); suspendNow(); } });
    window.addEventListener("pagehide", function () {
      cancelPop();
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
      try { if (ctx && ctx.close) { var p = ctx.close(); if (p && p.then) p.then(null, function () {}); } } catch (e) {}
      ctx = null; master = null; unlocked = false;
    });
  } catch (e) {}

  window.Sfx = S;
})();
