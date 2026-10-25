// ============================================
// 吉祥物“橙橙”（mascot.js）—— window.Mascot（阶段 12）
// 一颗戴草帽的橙子（西班牙瓦伦西亚的橙子 + 夏天的草帽），我们自己原创的，用 inline SVG 画，不用图片文件。
// 颜色都是 css/style.css 里 :root 的 --m-… 变量（SVG 里只写 class，颜色由 CSS 给）。
//
//   Mascot.el(mood, cls)   → 一个 <span class="mascot …">（里面是 SVG），装饰用（aria-hidden）
//   Mascot.svg(mood)       → SVG 字符串
//   mood：
//     "hello"   挥手打招呼（地图顶部、关卡开始）
//     "happy"   开心大笑（答对）
//     "cheer"   握拳鼓励（答错：“没关系，再来！”）
//     "party"   举双手庆祝 + 彩纸（过关结算）
//     "think"   歪头想一想（空状态、找不到内容）
//   cls：额外的 class，例如 "is-small"（56px）、"is-tiny"（44px）、"is-big"（128px）、"bob"（轻轻上下浮动）、"hop"（跳一下）
// 所有页面都引入（放在 nav.js、sfx.js 后面）。
// ============================================
(function () {
  var NS = "http://www.w3.org/2000/svg";

  // 身体、草帽、叶子（所有表情共用）
  var BODY =
    '<ellipse class="m-shadow" cx="60" cy="113" rx="30" ry="5"/>' +
    '<circle class="m-body" cx="60" cy="70" r="40"/>' +
    '<path class="m-shade" d="M96 78a40 40 0 0 1-70 22a44 44 0 0 0 70-22z"/>' +
    '<ellipse class="m-gloss" cx="41" cy="58" rx="8" ry="5.5" transform="rotate(-30 41 58)"/>' +
    '<circle class="m-shade" cx="80" cy="86" r="1.6"/><circle class="m-shade" cx="86" cy="76" r="1.4"/><circle class="m-shade" cx="74" cy="96" r="1.4"/>';
  var HAT =
    '<ellipse class="m-hat-shade" cx="60" cy="40" rx="47" ry="10"/>' +
    '<ellipse class="m-hat" cx="60" cy="37" rx="47" ry="10"/>' +
    '<path class="m-straw" d="M22 38q8 3 16 4M84 42q8-1 15-4M48 44q12 2 24 0"/>' +
    '<path class="m-hat" d="M37 37q1-24 23-24t23 24q-23 7-46 0z"/>' +
    '<path class="m-band" d="M37.6 31q22.4 7 44.8 0l.4 5.6q-22.8 7-45.6 0z"/>' +
    '<path class="m-straw" d="M46 20q2 6 1 11M60 15v15M74 20q-2 6-1 11"/>' +
    '<path class="m-leaf" d="M62 14q6-12 20-10q-5 11-20 10z"/>';
  var CHEEKS = '<ellipse class="m-cheek" cx="38" cy="80" rx="6" ry="3.6"/><ellipse class="m-cheek" cx="82" cy="80" rx="6" ry="3.6"/>';
  function eyes(dx) {
    dx = dx || 0;
    return '<ellipse class="m-ink" cx="' + (47 + dx) + '" cy="68" rx="5" ry="6.5"/><ellipse class="m-ink" cx="' + (73 + dx) + '" cy="68" rx="5" ry="6.5"/>' +
      '<circle class="m-shine" cx="' + (48.6 + dx) + '" cy="65.4" r="1.9"/><circle class="m-shine" cx="' + (74.6 + dx) + '" cy="65.4" r="1.9"/>';
  }
  var HAPPY_EYES = '<path class="m-line" d="M41 69q6-8 12 0M67 69q6-8 12 0"/>';
  var FACES = {
    hello: eyes(0) + CHEEKS + '<path class="m-line" d="M51 82q9 8 18 0"/>' +
      // 右手挥手、左手放下
      '<path class="m-arm" d="M99 72q11-6 12-20"/><circle class="m-hand" cx="111" cy="49" r="6"/>' +
      '<path class="m-arm" d="M21 78q-9 5-10 13"/><circle class="m-hand" cx="11" cy="93" r="5.5"/>',
    happy: HAPPY_EYES + CHEEKS + '<path class="m-ink" d="M47 80q13 15 26 0z"/><path class="m-tongue" d="M53 85q7 5 14 0q-7-3-14 0z"/>' +
      '<path class="m-arm" d="M99 70q12-4 14-17"/><circle class="m-hand" cx="113" cy="50" r="6"/>' +
      '<path class="m-arm" d="M21 70q-12-4-14-17"/><circle class="m-hand" cx="7" cy="50" r="6"/>',
    cheer: eyes(0) + CHEEKS + '<path class="m-line" d="M42 58l9 3M78 58l-9 3"/><path class="m-line" d="M52 83q8 5 16 0"/>' +
      // 握拳加油
      '<path class="m-arm" d="M99 76q12-3 12-17"/><circle class="m-hand" cx="111" cy="55" r="6.5"/>' +
      '<path class="m-arm" d="M21 80q-9 4-10 12"/><circle class="m-hand" cx="11" cy="94" r="5.5"/>',
    party: HAPPY_EYES + CHEEKS + '<path class="m-ink" d="M45 79q15 18 30 0z"/><path class="m-tongue" d="M52 86q8 5 16 0q-8-3-16 0z"/>' +
      '<path class="m-arm" d="M99 64q10-10 8-24"/><circle class="m-hand" cx="107" cy="37" r="6"/>' +
      '<path class="m-arm" d="M21 64q-10-10-8-24"/><circle class="m-hand" cx="13" cy="37" r="6"/>' +
      '<rect class="m-c1" x="8" y="10" width="7" height="4" rx="1" transform="rotate(-25 11 12)"/>' +
      '<rect class="m-c2" x="100" y="8" width="7" height="4" rx="1" transform="rotate(30 103 10)"/>' +
      '<rect class="m-c3" x="24" y="2" width="6" height="4" rx="1" transform="rotate(15 27 4)"/>' +
      '<circle class="m-c1" cx="96" cy="22" r="2.5"/><circle class="m-c3" cx="112" cy="24" r="2"/><circle class="m-c2" cx="6" cy="26" r="2.2"/>',
    think: eyes(3) + CHEEKS + '<path class="m-line" d="M53 84q6-3 12 0"/>' +
      '<path class="m-arm" d="M24 90q6 12 20 8"/><circle class="m-hand" cx="47" cy="96" r="6"/>' +
      '<circle class="m-c2" cx="104" cy="24" r="3"/><circle class="m-c2" cx="111" cy="14" r="4.2"/>'
  };

  function svg(mood) {
    var face = FACES[mood] || FACES.hello;
    return '<svg xmlns="' + NS + '" viewBox="0 0 120 120" focusable="false" aria-hidden="true">' + BODY + face + HAT + "</svg>";
  }
  function el(mood, cls) {
    var s = document.createElement("span");
    s.className = "mascot" + (cls ? " " + cls : "");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("data-mood", mood || "hello");
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

  window.Mascot = { NAME: "橙橙", svg: svg, el: el, row: row, empty: empty, MOODS: ["hello", "happy", "cheer", "party", "think"] };
})();
