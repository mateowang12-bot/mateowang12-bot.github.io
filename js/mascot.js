// ============================================
// 吉祥物“竹竹”（mascot.js）—— window.Mascot（阶段 14）
// 一只来西班牙旅行的中国小熊猫：圆滚滚的黑白熊猫，围一条西班牙红黄配色的小围巾，右耳别着一片竹叶。我们自己原创的，用 inline SVG 画。
// 颜色都是 css/style.css 里 :root 的 --p-… 变量（SVG 里只写 class）。深色模式下黑色部分有一圈浅色描边（--p-rim），看得清。
//
//   Mascot.el(mood, cls)   → <span class="mascot …">（里面是 SVG），装饰用（aria-hidden）
//   Mascot.svg(mood)       → SVG 字符串
//   Mascot.faceSvg()       → 只有熊猫的头（头像“熊猫宝宝”用）
//   mood：
//     "hello"  挥手打招呼（地图顶部、关卡开始）
//     "happy"  开心大笑（答对）
//     "cheer"  握拳鼓励（答错：“没关系，再来！”）
//     "party"  举双手庆祝 + 彩纸（过关结算）
//     "think"  托着下巴想一想（空状态、找不到内容）
//     "sad"    难过 / 可惜，眼角一滴泪（心用完了）
//   cls：额外的 class，例如 "is-small"（56px）、"is-tiny"（44px）、"is-big"（128px）、"bob"（轻轻上下浮动）、"hop"（跳一下）
//   Mascot.row / empty：吉祥物 + 说话气泡、空状态
//   另外：卡通小喇叭（朗读按钮的图案）也在这个文件里（见下面）。
// 所有页面都引入（放在 nav.js、sfx.js、icons.js 后面）。
// ============================================
(function () {
  var NS = "http://www.w3.org/2000/svg";

  // 头：耳朵（黑）→ 白色大脸 → 黑眼圈 → 鼻子；竹叶发夹在右耳
  function ears() {
    return '<circle class="p-blk" cx="33" cy="25" r="11"/><circle class="p-blk" cx="87" cy="25" r="11"/>' +
      '<circle class="p-inner" cx="33" cy="25" r="5"/><circle class="p-inner" cx="87" cy="25" r="5"/>';
  }
  function leaf() {
    return '<path class="p-leaf" d="M91 15c6-9 16-10 22-7-4 8-12 12-22 7z"/><path class="p-leaf-v" d="M93 14c6-3 12-5 18-6"/>' +
      '<path class="p-leaf" d="M90 18c9-2 15 2 17 7-8 2-14 0-17-7z"/>';
  }
  function face() {
    return '<ellipse class="p-wht" cx="60" cy="52" rx="35" ry="32"/>' +
      '<ellipse class="p-blk" cx="45" cy="52" rx="9.5" ry="12" transform="rotate(28 45 52)"/>' +
      '<ellipse class="p-blk" cx="75" cy="52" rx="9.5" ry="12" transform="rotate(-28 75 52)"/>' +
      '<ellipse class="p-cheek" cx="35" cy="66" rx="6" ry="3.6"/><ellipse class="p-cheek" cx="85" cy="66" rx="6" ry="3.6"/>' +
      '<ellipse class="p-nose" cx="60" cy="63" rx="5" ry="3.4"/>';
  }
  var EYES = {
    open: '<circle class="p-eye" cx="46" cy="53" r="4.6"/><circle class="p-eye" cx="74" cy="53" r="4.6"/>' +
      '<circle class="p-pupil" cx="47" cy="54" r="2.6"/><circle class="p-pupil" cx="73" cy="54" r="2.6"/>' +
      '<circle class="p-shine" cx="48" cy="52.4" r="1"/><circle class="p-shine" cx="74" cy="52.4" r="1"/>',
    happy: '<path class="p-eyeline" d="M41 55q5-6 10 0M69 55q5-6 10 0"/>',
    side: '<circle class="p-eye" cx="47" cy="52" r="4.6"/><circle class="p-eye" cx="75" cy="52" r="4.6"/>' +
      '<circle class="p-pupil" cx="49" cy="50.5" r="2.6"/><circle class="p-pupil" cx="77" cy="50.5" r="2.6"/>',
    sad: '<path class="p-eyeline" d="M41 52q5 4 10 0M69 52q5 4 10 0"/><path class="p-tear" d="M79 58c-2 4-2 6 0 7 2-1 2-3 0-7z"/>'
  };
  var MOUTH = {
    smile: '<path class="p-line" d="M54 68q6 6 12 0"/>',
    open: '<path class="p-mouth" d="M51 67q9 13 18 0z"/><path class="p-tongue" d="M55 71q5 4 10 0q-5-2-10 0z"/>',
    small: '<path class="p-line" d="M56 69q4 2 8 0"/>',
    frown: '<path class="p-line" d="M54 72q6-5 12 0"/>',
    o: '<ellipse class="p-mouth" cx="60" cy="70" rx="3" ry="3.6"/>'
  };
  // 身体 + 围巾（红底黄条，西班牙的颜色）
  function body() {
    return '<ellipse class="p-shadow" cx="60" cy="115" rx="30" ry="4.5"/>' +
      '<ellipse class="p-blk" cx="45" cy="108" rx="10" ry="7"/><ellipse class="p-blk" cx="75" cy="108" rx="10" ry="7"/>' +
      '<ellipse class="p-wht" cx="60" cy="92" rx="27" ry="21"/>';
  }
  var SCARF = '<path class="p-scarf" d="M36 79q24 12 48 0l2 7q-26 13-52 0z"/><path class="p-scarf-s" d="M37 83q23 10 46 0"/>' +
    '<path class="p-scarf" d="M72 85l9 15-8 2-7-15z"/>';
  // 手臂（黑色），按姿势
  var ARMS = {
    hello: '<path class="p-blk" d="M37 92c-7 3-10 9-7 13 3 3 8 0 11-6z"/><path class="p-blk" d="M82 86c6-6 11-14 12-22 1-4 7-4 8 0 1 10-6 21-14 27z"/>',
    happy: '<path class="p-blk" d="M37 88c-9-1-15-6-16-12-1-4 4-6 7-3 3 4 6 7 11 8z"/><path class="p-blk" d="M83 88c9-1 15-6 16-12 1-4-4-6-7-3-3 4-6 7-11 8z"/>',
    cheer: '<path class="p-blk" d="M37 92c-7 3-10 9-7 13 3 3 8 0 11-6z"/><path class="p-blk" d="M82 90c5-5 8-12 8-19"/><circle class="p-blk" cx="91" cy="68" r="7.5"/><path class="p-blk" d="M80 92c4-6 6-12 7-20l7 1c-1 9-4 16-9 22z"/>',
    party: '<path class="p-blk" d="M38 84c-6-6-10-15-10-23 0-4 6-5 7-1 1 8 4 15 9 20z"/><path class="p-blk" d="M82 84c6-6 10-15 10-23 0-4-6-5-7-1-1 8-4 15-9 20z"/>' +
      '<rect class="p-c1" x="10" y="14" width="7" height="4" rx="1" transform="rotate(-25 13 16)"/><rect class="p-c2" x="102" y="38" width="7" height="4" rx="1" transform="rotate(30 105 40)"/>' +
      '<circle class="p-c3" cx="16" cy="40" r="2.5"/><circle class="p-c1" cx="108" cy="58" r="2.2"/><rect class="p-c3" x="20" y="4" width="6" height="4" rx="1" transform="rotate(15 23 6)"/>',
    think: '<path class="p-blk" d="M37 92c-7 3-10 9-7 13 3 3 8 0 11-6z"/><path class="p-blk" d="M80 96c-4-6-9-14-12-22 0-4 6-6 8-2 3 7 6 14 10 19z"/>' +
      '<circle class="p-bubble" cx="103" cy="38" r="3.5"/><circle class="p-bubble" cx="110" cy="27" r="5"/>',
    sad: '<path class="p-blk" d="M36 88c-6 5-8 12-5 15 3 2 7-2 9-8z"/><path class="p-blk" d="M84 88c6 5 8 12 5 15-3 2-7-2-9-8z"/>'
  };
  var MOODS = {
    hello: { eyes: "open", mouth: "smile", arms: "hello" },
    happy: { eyes: "happy", mouth: "open", arms: "happy" },
    cheer: { eyes: "open", mouth: "smile", arms: "cheer", brows: true },
    party: { eyes: "happy", mouth: "open", arms: "party" },
    think: { eyes: "side", mouth: "small", arms: "think" },
    sad: { eyes: "sad", mouth: "frown", arms: "sad" }
  };
  function svg(mood) {
    var m = MOODS[mood] || MOODS.hello;
    var s = body() + ears() + face() + EYES[m.eyes] + MOUTH[m.mouth] + SCARF + ARMS[m.arms] + leaf();
    if (m.brows) s += '<path class="p-line" d="M39 39l9 3M81 39l-9 3"/>';
    return '<svg xmlns="' + NS + '" viewBox="0 0 120 120" focusable="false" aria-hidden="true">' + s + "</svg>";
  }
  // 只有头（头像用）：画布裁到头部
  function faceSvg() {
    return '<svg xmlns="' + NS + '" viewBox="20 10 80 80" focusable="false" aria-hidden="true" class="panda-face">' + ears() + face() + EYES.open + MOUTH.smile + leaf() + "</svg>";
  }
  function el(mood, cls) {
    var s = document.createElement("span");
    s.className = "mascot" + (cls ? " " + cls : "");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("data-mood", MOODS[mood] ? mood : "hello");
    s.innerHTML = svg(mood);
    return s;
  }
  // 吉祥物 + 说话气泡（一行）
  function row(mood, text, cls) {
    var r = document.createElement("div");
    r.className = "mascot-row";
    r.appendChild(el(mood, cls));
    var b = document.createElement("div");
    b.className = "speech";
    b.textContent = text || "";
    r.appendChild(b);
    return r;
  }
  // 空状态：吉祥物 + 一句话（居中）
  function empty(text, mood) {
    var d = document.createElement("div");
    d.className = "empty-state";
    d.appendChild(el(mood || "think", "bob"));
    var t = document.createElement("div");
    t.className = "empty-text";
    t.textContent = text || "";
    d.appendChild(t);
    return d;
  }

  // ---------- 卡通小喇叭（阶段 12）：朗读按钮的图案 ----------
  // 大号（关卡“听音选”的大播放按钮）：一个有表情的小喇叭，张嘴“唱”出三道音波；
  // 小号（所有 .say 朗读小按钮）：同样的喇叭和音波，没有表情（太小看不清）。
  // 颜色是 css/style.css 的 --sp-… 变量。正在朗读时按钮加 class "is-speaking"，CSS 让音波一圈圈往外扩、喇叭轻轻跳。
  var WAVES = '<path class="sp-wave w1" d="M74 33q7 11 0 22"/><path class="sp-wave w2" d="M84 24q14 20 0 40"/><path class="sp-wave w3" d="M94 15q20 29 0 58"/>';
  var HORN = '<rect class="sp-body" x="4" y="29" width="22" height="30" rx="9"/>' +
    '<path class="sp-cone" d="M23 32L55 9q12-7 12 7v56q0 14-12 7L23 56z"/>';
  var HORN_FACE = '<ellipse class="m-ink" cx="40" cy="38" rx="4.4" ry="5.6"/><ellipse class="m-ink" cx="55" cy="34" rx="4.4" ry="5.6"/>' +
    '<circle class="m-shine" cx="41.6" cy="36" r="1.6"/><circle class="m-shine" cx="56.6" cy="32" r="1.6"/>' +
    '<ellipse class="m-cheek" cx="35" cy="50" rx="4.5" ry="3"/><ellipse class="m-cheek" cx="62" cy="45" rx="4.5" ry="3"/>' +
    '<ellipse class="m-ink" cx="49" cy="54" rx="6.5" ry="8"/><path class="m-tongue" d="M44.5 58q4.5 5 9 0q-4.5-3-9 0z"/>';
  function speakerSvg(mini) {
    return '<svg xmlns="' + NS + '" viewBox="0 0 104 88" focusable="false" aria-hidden="true"><g class="sp-horn">' + HORN + (mini ? "" : HORN_FACE) + "</g>" + WAVES + "</svg>";
  }
  // 给页面里的朗读按钮装上小喇叭图案（.say 小号、.p-listen 大号）；新加到页面上的按钮也会自动装上
  function decorate(root) {
    try {
      var list = (root || document).querySelectorAll(".say:not([data-sp]), .p-listen:not([data-sp])");
      for (var i = 0; i < list.length; i++) {
        var b = list[i];
        b.setAttribute("data-sp", "1");
        var big = b.classList.contains("p-listen");
        var ico = document.createElement("span");
        ico.className = "sp-ico" + (big ? " is-big" : "");
        ico.setAttribute("aria-hidden", "true");
        ico.innerHTML = speakerSvg(!big);
        b.insertBefore(ico, b.firstChild);
      }
    } catch (e) {}
  }
  // 正在朗读：被点的那个朗读按钮动起来，读完就停（每 0.12 秒看一次 speechSynthesis 还在不在读）
  var watchEl = null, watchTimer = null, sawBusy = false, watchStart = 0;
  function busy() {
    try { var ss = window.speechSynthesis; return !!(ss && (ss.speaking || ss.pending)); } catch (e) { return false; }
  }
  function unwatch() {
    if (watchTimer) { clearTimeout(watchTimer); watchTimer = null; }
    if (watchEl) watchEl.classList.remove("is-speaking");
    watchEl = null;
  }
  function tick() {
    if (!watchEl) return;
    var b = busy();
    if (b) sawBusy = true;
    if (!b && (sawBusy || Date.now() - watchStart > 1500)) { unwatch(); return; }
    watchEl.classList.add("is-speaking");
    watchTimer = setTimeout(tick, 120);
  }
  function watch(btn) {
    unwatch();
    if (!btn) return;
    watchEl = btn;
    sawBusy = false;
    watchStart = Date.now();
    tick();
  }
  try {
    document.addEventListener("click", function (ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest(".say, .p-listen, .speaker-btn") : null;
      if (t) setTimeout(function () { watch(t.classList.contains("p-slow") ? (t.parentNode && t.parentNode.querySelector(".p-listen")) || t : t); }, 0);
    }, true);
    var startObs = function () {
      decorate(document);
      if (window.MutationObserver && document.body) {
        new MutationObserver(function () { decorate(document); }).observe(document.body, { childList: true, subtree: true });
      }
    };
    if (document.body) startObs();
    else document.addEventListener("DOMContentLoaded", startObs);
  } catch (e) {}

  window.Mascot = { NAME: "竹竹", svg: svg, faceSvg: faceSvg, el: el, row: row, empty: empty, MOODS: ["hello", "happy", "cheer", "party", "think", "sad"],
    speakerSvg: speakerSvg, decorate: decorate, watch: watch };
})();
