// ============================================
// 共用发音功能（speak.js）
// 用法：speakSpanish("hola")  —— 朗读一段西班牙语（必须在点击处理函数里同步调用，iPhone 才肯出声）
//       speakSpanish("hola", true) —— 不打断上一句，排在后面读
//       speakSpanish("hola", false, function () {...}) —— 这一句读完（或读不出来）时调用回调，只调一次
//       hasSpanishVoice()     —— 设备上有没有西语语音（true / false）
//       isIOSDevice()         —— 是不是 iPhone / iPad
// ============================================
(function () {
  var synth = window.speechSynthesis; // 浏览器自带的“朗读”功能
  var spanishVoice = null;            // 找到的西语语音
  var voicesLoaded = false;           // 语音列表是否已经加载好
  var noticeShown = false;            // 提示是否已经显示过（只显示一次，不反复打扰）

  // iPhone / iPad（新 iPad 的 Safari 会伪装成 Mac，用“有触屏”区分）
  var UA = navigator.userAgent || "";
  var IS_IOS = /iPhone|iPad|iPod/.test(UA) ||
    (/Macintosh/.test(UA) && "ontouchend" in document);
  var IS_WINDOWS = /Windows/.test(UA);

  // 好听的西语语音名（iPhone / Mac：Mónica、Jorge、Paulina…；Windows：Helena、Laura、Pablo…）
  var GOOD_NAMES = /m[oó]nica|jorge|paulina|marisol|juan|diego|angelica|helena|laura|pablo|elvira|alvaro|dalia/i;
  // iPhone 上的“搞怪”语音（读起来很奇怪，尽量不选）
  var NOVELTY_NAMES = /eddy|flo|grandma|grandpa|abuel|reed|rocko|sandy|shelley|bells|bad news|bahh|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|fred|junior|kathy|ralph/i;

  function langOf(v) {
    return (v.lang || "").toLowerCase().replace("_", "-");
  }

  // 给每个语音打分，挑最合适的西语语音：es-ES 最优先，其次 es-MX / 其他 es
  function score(v) {
    var lang = langOf(v);
    if (lang.indexOf("es") !== 0) return -1;
    var s = 10;
    if (lang === "es-es") s += 6;
    else if (lang === "es-mx") s += 3;
    if (GOOD_NAMES.test(v.name || "")) s += 4;
    if (NOVELTY_NAMES.test(v.name || "")) s -= 8;
    if (v.localService) s += 1;
    return s;
  }

  // 从设备的语音列表里挑一个西语语音
  function pickVoice() {
    if (!synth || typeof synth.getVoices !== "function") return;
    var voices;
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
    if (voices.length === 0) return; // iPhone 上一开始常常是空的，等 voiceschanged 再选
    voicesLoaded = true;
    var best = null, bestScore = -1;
    for (var i = 0; i < voices.length; i++) {
      var sc = score(voices[i]);
      if (sc > bestScore) {
        best = voices[i];
        bestScore = sc;
      }
    }
    spanishVoice = bestScore >= 0 ? best : null;
  }

  // 在页面顶部显示一条友好的中文提示（只显示一次）
  function showNotice(message) {
    if (noticeShown) return;
    noticeShown = true;
    var box = document.createElement("div");
    box.className = "notice";
    box.setAttribute("role", "status");
    box.textContent = message;

    var close = document.createElement("button");
    close.className = "notice-close";
    close.type = "button";
    close.title = "关闭";
    close.setAttribute("aria-label", "关闭 / Close");
    close.textContent = "×";
    close.onclick = function () {
      if (box.parentNode) box.parentNode.removeChild(box);
    };
    box.appendChild(close);

    // 放在 .container 最前面；没有就放在 body 最前面
    var place = document.querySelector(".container") || document.body;
    place.insertBefore(box, place.firstChild);
  }

  // “没有西语语音”的提示：按设备给出不同的说明
  var NO_VOICE_MSG;
  if (IS_IOS) {
    NO_VOICE_MSG =
      "你的 iPhone / iPad 好像没有西班牙语语音，所以可能听不到正确的发音。" +
      "iPhone：设置 → 辅助功能 → 朗读内容 → 声音 → 西班牙语，下载一个声音（例如 Mónica），然后重新打开这个网页。" +
      " / No Spanish voice found on this device.";
  } else if (IS_WINDOWS) {
    NO_VOICE_MSG =
      "你的电脑没有西班牙语语音，所以可能听不到正确的发音。" +
      "可以在 Windows 设置 → 时间和语言 → 语音 里添加“西班牙语(西班牙)”，然后重新打开浏览器。" +
      " / No Spanish voice found on this computer.";
  } else {
    NO_VOICE_MSG =
      "你的设备好像没有西班牙语语音，所以可能听不到正确的发音。" +
      "请在系统设置的“语音 / 朗读”里添加一个西班牙语（Español）声音，然后重新打开浏览器。" +
      " / No Spanish voice found on this device.";
  }
  var NO_SUPPORT_MSG = IS_IOS ?
    "这个浏览器不支持朗读功能，请用 iPhone 自带的 Safari 打开。 / This browser does not support speech." :
    "你的浏览器不支持朗读功能，请换用最新版的 Edge 或 Chrome 浏览器。 / This browser does not support speech.";

  // 如果语音已加载但没有西语，就提示
  function checkVoice() {
    if (voicesLoaded && !spanishVoice) showNotice(NO_VOICE_MSG);
  }

  // 正在朗读 / 排队中的句子。有些浏览器（Chrome / Edge）会把没人引用的 utterance 当垃圾回收掉，
  // 结果 end 事件永远不来；放在这里留个引用，读完（end / error）再删掉。
  var alive = [];

  // 朗读西班牙语。注意：iPhone 要求在“用户点击”的处理函数里同步调用，
  // 不要放进 setTimeout / Promise 之后，否则不出声。
  // queue = true：不打断正在读的上一句，排在它后面读（情景对话里“我”说完、对方接着说时用）
  // onEnd（可选）：这一句读完（end）或读不出来（error，包括被 cancel 打断）时调用，只调一次。
  //   用途：让画面切换和声音对上（例如单词页“记住了”：读完当前词再换卡片）。
  //   不传 onEnd 时和以前完全一样，其他页面只传 1–2 个参数照常工作。
  //   注意：有的设备可能永远不发 end / error，调用方要自己加兜底计时器。
  function speakSpanish(text, queue, onEnd) {
    var done = false;
    // 只调一次；回调里抛错也不影响页面
    function finish() {
      if (done) return;
      done = true;
      if (typeof onEnd === "function") {
        try { onEnd(); } catch (e) {}
      }
    }
    // 读不出来的情况（没有文字、浏览器不支持、出错）：稍后调用 onEnd，
    // 用 setTimeout 是为了让调用方先把自己的状态设好，再收到回调
    function finishLater() {
      if (typeof onEnd === "function") setTimeout(finish, 0);
    }

    if (!text) { finishLater(); return; }
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      showNotice(NO_SUPPORT_MSG);
      finishLater();
      return;
    }
    if (!spanishVoice) pickVoice();

    try {
      if (!queue) synth.cancel(); // 先停掉上一句，避免排队
      if (synth.paused) synth.resume(); // iPhone 切回网页后朗读有时停在“暂停”状态
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "es-ES";
      if (spanishVoice) {
        u.voice = spanishVoice;
        if (langOf(spanishVoice) !== "es-es" && spanishVoice.lang) u.lang = spanishVoice.lang;
      }
      u.rate = IS_IOS ? 0.85 : 0.8; // 稍慢一点，方便初学者听清（iPhone 的语速刻度略不同）
      alive.push(u);
      var release = function () {
        for (var i = alive.length - 1; i >= 0; i--) if (alive[i] === u) alive.splice(i, 1);
        finish();
      };
      u.onend = release;
      u.onerror = release;
      // 防止 alive 无限变长（例如某些设备从来不发 end）：只留最近 20 句
      if (alive.length > 20) alive.splice(0, alive.length - 20);
      synth.speak(u);
    } catch (e) {
      // 朗读失败不影响页面
      finishLater();
    }

    if (voicesLoaded) {
      checkVoice();
    } else {
      // 语音列表还没加载好：等一会儿再检查（只影响提示，不影响朗读）
      setTimeout(function () {
        pickVoice();
        if (voicesLoaded) checkVoice();
        else if (!IS_IOS) showNotice(NO_VOICE_MSG); // iPhone 上列表为空不一定是没有语音，不乱提示
      }, 1500);
    }
  }

  // 有没有西语语音
  function hasSpanishVoice() {
    pickVoice();
    return !!spanishVoice;
  }

  // 语音列表可能是异步加载的，加载好后重新挑选
  if (synth) {
    pickVoice();
    try {
      if (typeof synth.addEventListener === "function") {
        synth.addEventListener("voiceschanged", pickVoice);
      } else {
        synth.onvoiceschanged = pickVoice;
      }
    } catch (e) {}
    // 有些 iPhone 版本不发 voiceschanged：开头几秒再查几次
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (!voicesLoaded) pickVoice();
      if (voicesLoaded || tries >= 12) clearInterval(timer);
    }, 250);
  }

  // 暴露给页面使用
  window.speakSpanish = speakSpanish;
  window.hasSpanishVoice = hasSpanishVoice;
  window.isIOSDevice = function () { return IS_IOS; };
})();
