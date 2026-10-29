// ============================================
// 卡通图标（icons.js）—— window.Icons（阶段 14）
// 全站界面图标都是这里画的 inline SVG（不用 emoji、不用图片文件、不用网络）。风格：粗描边、圆角、扁平填色、一点高光。
// 颜色全是 css/style.css 的 --ic-… 变量（SVG 里只写 class：s = 描边，r/y/b/g/… = 填色，hl = 高光）。
//
//   Icons.svg(name)            → SVG 字符串（48×48 画布）
//   Icons.el(name, cls, label) → <span class="ic ic-名字 …">；有 label 时 role="img" + aria-label（有意义的图标），没有就 aria-hidden（装饰）
//   Icons.region(regionId)     → 地图区域徽章的图标名（机场、酒店…）
//   Icons.avatar(id, cls)      → 头像（16 个卡通动物，id 和 js/world.js 的 AVATARS 一样）
//   Icons.npc(regionId, cls)   → 区域 NPC 的卡通头像（和熊猫同一个世界的小动物）
//   Icons.has(name)
//   自动替换：页面上文字里的“界面 emoji”（⭐ ❤️ 🔥 🎁 …，见 EMOJI 表）会被换成对应的 SVG 图标；
//            其他 emoji（单词配图，例如 🍞）包成圆形彩色底的“贴纸” <span class="sticker">。
//            在 .sticker、输入框、<title> 里不替换；单词内容（选项、配对卡、单词卡…）里的 emoji 一律做成贴纸。
// 要在 nav.js 后面、其他用到它的脚本前面引入（每个页面 body 末尾的第三个 script）。
// ============================================
(function () {
  var NS = "http://www.w3.org/2000/svg";
  // ---------- 画图小工具（cls：s 描边 + 一个填色 class） ----------
  function P(cls, d) { return '<path class="' + cls + '" d="' + d + '"/>'; }
  function C(cls, x, y, r) { return '<circle class="' + cls + '" cx="' + x + '" cy="' + y + '" r="' + r + '"/>'; }
  function E(cls, x, y, rx, ry) { return '<ellipse class="' + cls + '" cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '"/>'; }
  function R(cls, x, y, w, h, r) { return '<rect class="' + cls + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r || 0) + '"/>'; }
  function L(d) { return '<path class="ln" d="' + d + '"/>'; } // 只有描边的线
  function HL(x, y, rx, ry) { return E("hl", x, y, rx, ry || rx * 0.6); }
  var STAR = "M24 5l5.6 11.6 12.7 1.7-9.3 8.8 2.3 12.6L24 33.7l-11.3 6 2.3-12.6-9.3-8.8 12.7-1.7z";
  var HEART = "M24 41S6 30.5 6 17.8C6 11.3 10.7 7 16.2 7c3.6 0 6.3 2 7.8 4.6C25.5 9 28.2 7 31.8 7 37.3 7 42 11.3 42 17.8 42 30.5 24 41 24 41z";

  var D = {
    // ---------- 游戏元素 ----------
    star: function () { return P("s y", STAR) + HL(19, 16, 4, 2.4); },
    "star-empty": function () { return P("s gy", STAR); },
    heart: function () { return P("s r", HEART) + HL(15, 15, 4.5, 2.6); },
    "heart-empty": function () { return P("s w", HEART); },
    "heart-broken": function () { return P("s r", HEART) + L("M24 12l-4 9 6 4-4 9"); },
    fire: function () { return P("s o", "M24 43c-8.8 0-14-6-14-13.5 0-7 5-10.5 6.5-17 3.5 2.5 4.5 6 4.3 9 2.5-3.5 3.7-9.7 2.2-16.5 9.5 5 15 14.5 15 23.5C38 37 32.8 43 24 43z") + P("s y", "M24 43c-4.4 0-7-3-7-6.8 0-3.6 2.6-5.4 4-8.6 1.6 1.8 2.6 3.4 2.6 5 1.6-1.6 2.6-3.6 2.4-6.4 3.8 2.6 5 6.6 5 9.8 0 4-3 7-7 7z"); },
    xp: function () { return C("s y", 24, 24, 18) + P("s w", "M27 9L15 27h9l-3 13 12-18h-9z") + HL(16, 15, 4); },
    chest: function () { return R("s br", 7, 20, 34, 21, 4) + P("s br2", "M7 22c0-8 6-12 17-12s17 4 17 12z") + R("s y", 7, 21, 34, 5, 1) + R("s y", 20, 19, 8, 11, 2) + C("k", 24, 25, 1.6); },
    "chest-open": function () { return R("s br", 7, 22, 34, 19, 4) + P("s br2", "M9 20l4-12h22l4 12z") + P("s y", "M14 18l3-6 3 5 4-7 4 7 3-5 3 6z") + R("s y", 7, 22, 34, 5, 1) + R("s y", 20, 21, 8, 10, 2); },
    stamp: function () { return P("s pk", "M9 9h30v30H9z") + L("M9 14h-3M9 20h-3M9 26h-3M9 32h-3M39 14h3M39 20h3M39 26h3M39 32h3") + C("s r", 24, 24, 8) + HL(21, 21, 2.5); },
    calendar: function () { return R("s w", 7, 10, 34, 31, 5) + P("s r", "M7 15a5 5 0 015-5h24a5 5 0 015 5v5H7z") + R("s gy", 14, 6, 4, 9, 2) + R("s gy", 30, 6, 4, 9, 2) + R("b", 14, 26, 6, 5, 1) + R("gy", 23, 26, 6, 5, 1) + R("gy", 14, 33, 6, 4, 1); },
    book: function () { return P("s b", "M8 10c6-2 11-1 16 3 5-4 10-5 16-3v28c-6-2-11-1-16 3-5-4-10-5-16-3z") + P("s w", "M11 13c5-1 9 0 13 3v22c-4-3-8-4-13-3zM37 13c-5-1-9 0-13 3v22c4-3 8-4 13-3z"); },
    loop: function () { return P("s t", "M35 15A14 14 0 0010 21l-4-1 4 11 9-7-4-1a9 9 0 0115-4z") + P("s t", "M13 33a14 14 0 0025-6l4 1-4-11-9 7 4 1a9 9 0 01-15 4z"); },
    crown: function () { return P("s y", "M7 36L5 14l11 9 8-14 8 14 11-9-2 22z") + R("s y", 8, 35, 32, 6, 2) + C("s r", 24, 30, 3) + C("s b", 14, 31, 2) + C("s b", 34, 31, 2); },
    lock: function () { return P("ln2", "M15 22v-6a9 9 0 0118 0v6") + R("s y", 10, 21, 28, 21, 5) + C("k", 24, 30, 3) + R("k", 22.5, 31, 3, 6, 1.5); },
    check: function () { return C("s g", 24, 24, 18) + P("ckm", "M15 24l6 6 12-13") + HL(16, 15, 4); },
    cross: function () { return C("s r", 24, 24, 18) + P("ckm", "M17 17l14 14M31 17L17 31"); },
    chat: function () { return P("s w", "M8 14a6 6 0 016-6h20a6 6 0 016 6v12a6 6 0 01-6 6H22l-8 7v-7a6 6 0 01-6-6z") + C("b", 17, 20, 2.2) + C("b", 24, 20, 2.2) + C("b", 31, 20, 2.2); },
    play: function () { return P("s g", "M14 8l26 16-26 16z"); },
    party: function () { return P("s p", "M8 41l7-22 14 14z") + L("M15 19l-3 9M19 23l-4 12") + C("s y", 33, 11, 3) + C("s r", 40, 22, 2.5) + C("s b", 24, 8, 2) + L("M28 18c3-4 7-4 9-1M31 25c4-1 7 1 8 4"); },
    trophy: function () { return P("s y", "M14 8h20v8a10 10 0 01-20 0z") + L("M14 11H8c0 6 3 9 7 9M34 11h6c0 6-3 9-7 9") + R("s y", 21, 25, 6, 8, 1) + R("s br", 14, 33, 20, 8, 3) + HL(19, 12, 2.5, 3.5); },
    medal: function (c) { return P("s r", "M14 5h8l4 12h-8zM34 5h-8l-4 12h8z") + C("s " + (c || "y"), 24, 30, 12) + C("ring", 24, 30, 7) + HL(19, 25, 3); },
    "medal-bronze": function () { return D.medal("br"); },
    "medal-silver": function () { return D.medal("gy"); },
    "medal-gold": function () { return D.medal("y"); },
    diamond: function () { return P("s b", "M12 10h24l8 10-20 22L4 20z") + L("M4 20h40M17 10l-3 10 10 22 10-22-3-10") + HL(16, 14, 3, 2); },
    cloud: function () { return P("s w", "M14 38a9 9 0 01-1-18 12 12 0 0123-2 9 9 0 012 20z") + HL(18, 24, 4, 2); },
    mic: function () { return R("s gy", 17, 6, 14, 24, 7) + L("M11 22a13 13 0 0026 0M24 35v6M17 42h14"); },
    bulb: function () { return P("s y", "M24 5a13 13 0 00-8 23c2 2 3 4 3 6h10c0-2 1-4 3-6a13 13 0 00-8-23z") + R("s gy", 18, 34, 12, 8, 3) + HL(19, 13, 3.5, 2.5); },
    // 侧面的小乌龟（头朝右）：尾巴、四条腿、头 → 棕色龟壳 + 六边形花纹 → 黄色壳边 → 眼睛和微笑
    turtle: function () { return P("s g", "M7 30l-5 2 5 3z") + E("s g", 12, 38, 4.5, 4.5) + E("s g", 30, 38, 4.5, 4.5) + P("s g", "M33 30l4-6 4 2-3 6z") + C("s g", 40.5, 21.5, 6.5) + P("s br", "M4 33a17 17 0 0134 0z") + P("s br2", "M16 24.5l5-3.5 5 3.5v5.5l-5 3-5-3z") + L("M21 21v-5M16 24.5l-7-3M26 24.5l7-3") + R("s y", 3, 32, 37, 5, 2.5) + HL(13, 21, 3, 2) + C("k", 42, 20.5, 1.7) + C("w", 42.6, 19.9, 0.6) + L("M39.5 25.5q2.5 1.4 5-.3"); },
    keyboard: function () { return R("s w", 4, 13, 40, 24, 5) + R("gy", 9, 18, 5, 4, 1) + R("gy", 16, 18, 5, 4, 1) + R("gy", 23, 18, 5, 4, 1) + R("gy", 30, 18, 5, 4, 1) + R("gy", 9, 24, 5, 4, 1) + R("gy", 16, 24, 5, 4, 1) + R("gy", 23, 24, 5, 4, 1) + R("gy", 30, 24, 5, 4, 1) + R("k2", 14, 30, 20, 3, 1.5); },
    speaker: function () { return R("s b", 6, 18, 9, 12, 3) + P("s y", "M14 19l13-10v30l-13-10z") + L("M32 17q5 7 0 14M37 12q9 12 0 24"); },
    bell: function () { return P("s y", "M24 6a12 12 0 00-12 12v9l-4 6h32l-4-6v-9A12 12 0 0024 6z") + C("s o", 24, 37, 4) + HL(19, 14, 2.5, 3.5); },
    vibrate: function () { return R("s b", 15, 5, 18, 38, 5) + R("w", 18, 10, 12, 24, 2) + L("M8 16v16M41 16v16M4 20v8M45 20v8"); },
    pin: function () { return P("s r", "M24 44S10 28 10 19a14 14 0 0128 0c0 9-14 25-14 25z") + C("s w", 24, 19, 5); },
    compass: function () { return C("s w", 24, 24, 18) + P("s r", "M24 10l5 14h-10z") + P("s gy", "M24 38l-5-14h10z"); },
    clock: function () { return C("s w", 24, 26, 16) + R("s gy", 20, 3, 8, 6, 2) + L("M24 26V16M24 26l7 4"); },
    pencil: function () { return P("s y", "M9 39l3-10L33 8l7 7-21 21z") + P("s pk", "M33 8l3-3 7 7-3 3z") + P("s cr", "M9 39l3-10 7 7z"); },
    note: function () { return P("s w", "M10 6h20l8 8v28H10z") + P("s gy", "M30 6v8h8") + L("M16 22h16M16 28h16M16 34h10"); },
    clapper: function () { return R("s k2", 7, 20, 34, 21, 3) + P("s w", "M7 12l32-6 2 8-32 6z") + L("M15 11l3 7M24 9l3 7M33 8l3 7"); },
    eye: function () { return P("s w", "M4 24s8-12 20-12 20 12 20 12-8 12-20 12S4 24 4 24z") + C("s b", 24, 24, 7) + C("k", 24, 24, 3) + HL(21, 21, 1.6); },
    shuffle: function () { return L("M6 15h8c8 0 12 18 20 18h6M6 33h8c8 0 12-18 20-18h6") + P("s o", "M38 9l7 6-7 6zM38 27l7 6-7 6z"); },
    sparkle: function () { return P("s y", "M24 4l4 14 14 6-14 6-4 14-4-14-14-6 14-6z") + HL(22, 17, 1.6); },
    smile: function () { return C("s y", 24, 24, 18) + C("k", 18, 21, 2.2) + C("k", 30, 21, 2.2) + L("M16 29q8 7 16 0"); },
    suitcase: function () { return R("s br", 6, 15, 36, 26, 5) + P("ln2", "M17 15v-5h14v5") + L("M6 26h36") + R("s y", 21, 23, 6, 6, 1.5); },
    target: function () { return C("s r", 24, 24, 18) + C("s w", 24, 24, 12) + C("s r", 24, 24, 6); },
    footprints: function () { return E("s br", 16, 30, 6, 9) + C("s br", 12, 17, 2.5) + C("s br", 17, 16, 2.5) + C("s br", 21, 18, 2.2) + E("s br", 32, 22, 6, 9) + C("s br", 28, 9, 2.5) + C("s br", 33, 8, 2.5) + C("s br", 37, 10, 2.2); },
    sprout: function () { return L("M24 42V24") + P("s g", "M24 26c-2-9-9-12-16-10 1 8 8 12 16 10zM24 22c2-9 9-12 16-10-1 8-8 12-16 10z") + R("s br", 14, 38, 20, 6, 2); },
    leaf: function () { return P("s g", "M8 40C8 18 20 8 42 6c0 22-12 34-34 34z") + L("M8 40L32 16"); },
    tree: function () { return R("s br", 20, 28, 8, 15, 2) + C("s g", 24, 18, 13) + C("s g", 14, 24, 7) + C("s g", 34, 24, 7) + HL(19, 12, 4); },
    ruler: function () { return P("s y", "M6 36L36 6l6 6-30 30z") + L("M12 30l4 4M17 25l3 3M22 20l4 4M27 15l3 3M32 10l4 4"); },
    masks: function () { return P("s y", "M5 9h20v12a10 10 0 01-20 0z") + C("k", 11, 15, 1.8) + C("k", 19, 15, 1.8) + L("M11 22q4 3 8 0") + P("s b", "M23 19h20v12a10 10 0 01-20 0z") + C("k", 29, 25, 1.8) + C("k", 37, 25, 1.8) + L("M29 34q4-3 8 0"); },
    gamepad: function () { return P("s p", "M14 14h20a10 10 0 0110 10v4a6 6 0 01-11 3l-3-4H18l-3 4a6 6 0 01-11-3v-4a10 10 0 0110-10z") + L("M14 19v8M10 23h8") + C("w", 31, 21, 2.2) + C("w", 36, 25, 2.2); },
    robot: function () { return R("s gy", 9, 14, 30, 24, 7) + L("M24 14V7") + C("s r", 24, 6, 3) + C("s b", 17, 25, 4) + C("s b", 31, 25, 4) + L("M18 33h12") + R("s gy", 4, 22, 5, 9, 2) + R("s gy", 39, 22, 5, 9, 2); },
    abc: function () { return R("s r", 4, 18, 14, 14, 3) + R("s y", 17, 10, 14, 14, 3) + R("s b", 30, 18, 14, 14, 3) + '<text class="tx" x="11" y="29">a</text><text class="tx" x="24" y="21">b</text><text class="tx" x="37" y="29">c</text>'; },
    cards: function () { return R("s b", 8, 12, 22, 28, 4) + R("s w", 18, 8, 22, 28, 4) + P("s r", "M29 19c-2-3-7-1-5 3l5 5 5-5c2-4-3-6-5-3z"); },
    quiz: function () { return R("s w", 9, 6, 30, 36, 5) + R("s g", 14, 13, 6, 6, 1.5) + R("s g", 14, 23, 6, 6, 1.5) + R("s gy", 14, 33, 6, 6, 1.5) + L("M24 16h10M24 26h10M24 36h10"); },
    books: function () { return R("s r", 6, 12, 9, 30, 2) + R("s b", 16, 8, 9, 34, 2) + P("s y", "M27 14l8-2 7 28-8 2z") + L("M6 18h9M16 14h9"); },
    map: function () { return P("s y", "M5 10l12-4 14 5 12-4v31l-12 4-14-5-12 4z") + L("M17 6v31M31 11v31") + P("s r", "M33 18c0 4-4 8-4 8s-4-4-4-8a4 4 0 018 0z"); },
    headphones: function () { return P("ln2", "M10 28v-4a14 14 0 0128 0v4") + R("s b", 6, 26, 9, 15, 4) + R("s b", 33, 26, 9, 15, 4); },
    link: function () { return R("s b", 4, 17, 22, 14, 7) + R("s o", 22, 17, 22, 14, 7) + R("w", 10, 21, 10, 6, 3) + R("w", 28, 21, 10, 6, 3); },
    puzzle: function () { return P("s g", "M8 14h10a4 4 0 118 0h10v10a4 4 0 110 8v10H26a4 4 0 10-8 0H8V32a4 4 0 100-8z") + HL(14, 19, 3); },
    bolt: function () { return P("s y", "M28 3L9 27h12l-4 18 22-26H26z") + HL(21, 15, 2); },
    stopwatch: function () { return D.clock(); },
    hint: function () { return D.bulb(); },
    gift: function () { return D.chest(); },
    story: function () { return D.book(); },
    // 小熊猫的头（底部导航“我的”）
    panda: function () { return C("s k2", 11, 13, 7) + C("s k2", 37, 13, 7) + C("s w", 24, 26, 17) + E("k2", 17.5, 25, 4, 5.5) + E("k2", 30.5, 25, 4, 5.5) + C("w", 18, 25, 1.6) + C("w", 30, 25, 1.6) + E("k2", 24, 32, 2.4, 1.7) + L("M21 36q3 2 6 0") + E("pk2", 11, 32, 3, 1.8) + E("pk2", 37, 32, 3, 1.8); },
    // ---------- 地图区域徽章 ----------
    "r-airport": function () { return P("s w", "M44 22c0-2-2-3-4-3H30L20 5h-5l5 14H11l-4-5H4l2 10-2 10h3l4-5h9l-5 14h5l10-14h10c2 0 4-1 4-3z") + R("b", 24, 20, 3, 3, 1) + R("b", 30, 20, 3, 3, 1) + R("b", 36, 20, 3, 3, 1); },
    "r-hotel": function () { return R("s b", 9, 8, 30, 34, 3) + R("s r", 6, 4, 36, 7, 2) + R("y", 14, 15, 6, 5, 1) + R("y", 28, 15, 6, 5, 1) + R("y", 14, 24, 6, 5, 1) + R("y", 28, 24, 6, 5, 1) + R("s br", 20, 32, 8, 10, 1); },
    "r-cafe": function () { return P("s w", "M8 18h26v10a12 12 0 01-12 12h-2A12 12 0 018 28z") + P("ln2", "M34 21h3a5 5 0 010 10h-4") + P("s br", "M10 21h22v3H10z") + L("M15 13q-2-3 0-6M21 13q-2-3 0-6M27 13q-2-3 0-6"); },
    "r-park": function () { return D.tree(); },
    "r-home": function () { return P("s r", "M4 24L24 7l20 17") + P("s y", "M9 22l15-12 15 12v20H9z") + R("s br", 20, 30, 8, 12, 2) + R("s b", 12, 26, 6, 5, 1) + R("s b", 30, 26, 6, 5, 1); },
    "r-shop": function () { return P("s pk", "M9 15h30l-2 27H11z") + P("ln2", "M17 18v-5a7 7 0 0114 0v5") + HL(15, 24, 2.5, 4); },
    "r-train": function () { return R("s r", 10, 6, 28, 30, 7) + R("s w", 14, 11, 20, 11, 3) + C("s y", 17, 29, 3) + C("s y", 31, 29, 3) + L("M15 36l-4 7M33 36l4 7M12 41h24"); },
    "r-pharmacy": function () { return R("s w", 6, 6, 36, 36, 9) + P("s g", "M19 11h10v8h8v10h-8v8H19v-8h-8V19h8z"); },
    "r-farm": function () { return P("s r", "M6 20L24 7l18 13v22H6z") + P("s w", "M17 42V28h14v14") + L("M17 28l14 14M31 28L17 42") + P("s w", "M20 16h8v6h-8z"); },
    "r-party": function () { return D.party(); },
    // ---------- 主题皮肤 ----------
    "skin-default": function () { return D.leaf(); },
    "skin-ocean": function () { return P("s b", "M4 30c5-6 9-6 14 0s9 6 14 0 9-6 14 0v12H4z") + P("s t", "M4 22c5-6 9-6 14 0s9 6 14 0 9-6 14 0") + C("s y", 34, 11, 5); },
    "skin-sunset": function () { return P("s o", "M8 34a16 16 0 0132 0z") + L("M4 34h40M8 40h32M24 10v-4M11 16l-3-3M37 16l3-3"); },
    "skin-violet": function () { return P("s p", HEART) + HL(15, 15, 4.5, 2.6); }
  };

  // ---------- 卡通动物头像（头像、NPC 共用一个“画头”的函数，风格统一） ----------
  // a = { face, ear: round|point|long|horn|none|tuft, inner, muzzle, nose: dot|beak|trunk|snout|none, extra }
  function head(a) {
    var s = "";
    var face = a.face, ear = a.ear;
    if (ear === "round") s += C("s " + face, 12, 12, 7) + C("s " + face, 36, 12, 7) + C(a.inner || "pk", 12, 12, 3.5) + C(a.inner || "pk", 36, 12, 3.5);
    if (ear === "point") s += P("s " + face, "M8 22L10 4l12 10zM40 22L38 4 26 14z") + P(a.inner || "pk", "M11 16l1-7 5 5zM37 16l-1-7-5 5z");
    if (ear === "long") s += E("s " + face, 15, 10, 5, 12) + E("s " + face, 33, 10, 5, 12) + E(a.inner || "pk", 15, 11, 2, 8) + E(a.inner || "pk", 33, 11, 2, 8);
    if (ear === "horn") s += P("s cr", "M10 16C4 14 3 8 5 5c2 4 5 6 9 6zM38 16c6-2 7-8 5-11-2 4-5 6-9 6z") + E("s " + face, 9, 22, 6, 3.5) + E("s " + face, 39, 22, 6, 3.5);
    if (ear === "big") s += C("s " + face, 9, 24, 9) + C("s " + face, 39, 24, 9) + C(a.inner || "pk", 9, 24, 5) + C(a.inner || "pk", 39, 24, 5);
    if (ear === "mane") s += C("s " + (a.mane || "o"), 24, 25, 21);
    s += C("s " + face, 24, 26, 16);
    if (a.extra === "stripes") s += L("M24 10v6M18 12l2 5M30 12l-2 5");
    if (a.extra === "comb") s += P("s r", "M19 11c0-4 2-6 4-4 1-4 5-3 4 1 3-2 5 1 3 4z");
    if (a.extra === "tuft") s += P("s " + face, "M20 11c0-5 3-7 4-7 0 3 2 4 4 4-1 2-2 3-4 3z");
    if (a.extra === "flower") s += C("s pk", 35, 13, 4) + C("y", 35, 13, 1.6);
    if (a.extra === "hat") s += P("s " + (a.hat || "b"), "M10 17c2-9 26-9 28 0z") + R("s " + (a.hat || "b"), 8, 15, 32, 4, 2);
    if (a.extra === "cap") s += P("s " + (a.hat || "r"), "M11 18c1-10 25-10 26 0z") + P("s " + (a.hat || "r"), "M30 17h11l-1 3H30z");
    if (a.extra === "bow") s += P("s " + (a.hat || "r"), "M24 42l-7-4v8zM24 42l7-4v8z") + C("s " + (a.hat || "r"), 24, 42, 2);
    if (a.extra === "glasses") s += C("ring", 18, 25, 4.5) + C("ring", 30, 25, 4.5) + L("M22.5 25h3");
    if (a.muzzle) s += E("s " + a.muzzle, 24, 32, 9, 6.5);
    s += E("k", 18, 25, 2.2, 2.8) + E("k", 30, 25, 2.2, 2.8) + C("w", 18.8, 24, 0.9) + C("w", 30.8, 24, 0.9);
    s += E("pk2", 13, 31, 3, 1.8) + E("pk2", 35, 31, 3, 1.8);
    if (a.nose === "dot") s += E("k", 24, 30, 2.2, 1.6) + L("M21 34q3 2 6 0");
    if (a.nose === "beak") s += P("s " + (a.beak || "y"), "M19 30l5-3 5 3-5 5z");
    if (a.nose === "trunk") s += P("s " + face, "M21 30c0 6 1 10 5 11 2 0 2-2 0-3-2-1-2-4-2-8z");
    if (a.nose === "snout") s += E("s pk", 24, 32, 6, 4.5) + C("k", 22, 32, 1) + C("k", 26, 32, 1);
    if (a.nose === "frog") s += L("M17 33q7 4 14 0");
    return s;
  }
  // 16 个头像（id 不变，老存档照常；显示的是卡通动物）
  var AVATAR_ART = {
    suitcase: { zh: "熊猫宝宝", panda: true },
    bull: { zh: "小牛", a: { face: "br", ear: "horn", muzzle: "cr", nose: "dot" } },
    parrot: { zh: "鹦鹉", a: { face: "g", ear: "none", nose: "beak", beak: "o", extra: "tuft" } },
    cat: { zh: "小猫", a: { face: "o", ear: "point", nose: "dot", extra: "stripes" } },
    dancer: { zh: "火烈鸟", a: { face: "pk", ear: "none", nose: "beak", beak: "k2", extra: "flower" } },
    guitar: { zh: "小狗", a: { face: "cr", ear: "long", inner: "br", muzzle: "w", nose: "dot" } },
    sun: { zh: "小狮子", a: { face: "y", ear: "mane", mane: "o", muzzle: "cr", nose: "dot" } },
    paella: { zh: "小猪", a: { face: "pk", ear: "point", inner: "r", nose: "snout" } },
    castle: { zh: "小兔", a: { face: "w", ear: "long", nose: "dot" } },
    sunflower: { zh: "小鸡", a: { face: "y", ear: "none", nose: "beak", beak: "o", extra: "comb" } },
    fish: { zh: "小企鹅", a: { face: "k2", ear: "none", muzzle: "w", nose: "beak", beak: "o" } },
    owl: { zh: "小狐狸", a: { face: "o", ear: "point", inner: "w", muzzle: "w", nose: "dot" } },
    orange: { zh: "小老虎", a: { face: "o", ear: "round", inner: "cr", muzzle: "w", nose: "dot", extra: "stripes" } },
    trumpet: { zh: "小象", a: { face: "gy", ear: "big", nose: "trunk" } },
    football: { zh: "小猴", a: { face: "br", ear: "round", inner: "cr", muzzle: "cr", nose: "dot" } },
    cactus: { zh: "小青蛙", a: { face: "g", ear: "none", nose: "frog" } }
  };
  // 区域 NPC（按区域 id；和熊猫同一个世界：每个区域一个小动物，戴自己工作的帽子 / 饰品）
  var NPC_ART = {
    airport: { face: "w", ear: "long", nose: "dot", extra: "cap", hat: "b" },      // 机场工作人员：小兔
    hotel: { face: "o", ear: "point", inner: "w", muzzle: "w", nose: "dot", extra: "bow", hat: "r" }, // 前台：小狐狸
    cafe: { face: "br", ear: "round", inner: "cr", muzzle: "cr", nose: "dot", extra: "hat", hat: "w" }, // 服务员：小熊
    park: { face: "gy", ear: "round", inner: "pk", nose: "dot", extra: "glasses" },  // 公园的老爷爷：小老鼠
    home: { face: "cr", ear: "long", inner: "br", muzzle: "w", nose: "dot", extra: "bow", hat: "p" }, // 朋友：小狗
    shop: { face: "pk", ear: "point", inner: "r", nose: "snout", extra: "cap", hat: "g" },  // 店员：小猪
    train: { face: "y", ear: "mane", mane: "o", muzzle: "cr", nose: "dot", extra: "cap", hat: "r" }, // 售票员：小狮子
    pharmacy: { face: "w", ear: "round", inner: "pk", nose: "dot", extra: "glasses" },  // 药剂师：小羊
    farm: { face: "br", ear: "horn", muzzle: "cr", nose: "dot", extra: "hat", hat: "y" }, // 农场主：小牛
    party: { face: "g", ear: "none", nose: "frog", extra: "hat", hat: "p" }        // 派对主人：小青蛙
  };
  var REGION_ICON = { airport: "r-airport", hotel: "r-hotel", cafe: "r-cafe", park: "r-park", home: "r-home", shop: "r-shop", train: "r-train", pharmacy: "r-pharmacy", farm: "r-farm", party: "r-party" };

  function wrap(inner, viewBox) {
    return '<svg xmlns="' + NS + '" viewBox="' + (viewBox || "0 0 48 48") + '" focusable="false" aria-hidden="true">' + inner + "</svg>";
  }
  function svg(name) {
    if (name && name.indexOf("avatar:") === 0) return avatarSvg(name.slice(7));
    if (name && name.indexOf("npc:") === 0) return npcSvg(name.slice(4));
    var f = D[name] || D.sparkle;
    return wrap(f());
  }
  function avatarSvg(id) {
    var art = AVATAR_ART[id] || AVATAR_ART.suitcase;
    if (art.panda && window.Mascot && window.Mascot.faceSvg) return window.Mascot.faceSvg();
    if (art.panda) return wrap(head({ face: "w", ear: "round", inner: "k2", nose: "dot" }));
    return wrap(head(art.a));
  }
  function npcSvg(regionId) {
    return wrap(head(NPC_ART[regionId] || { face: "y", ear: "round", nose: "dot" }));
  }
  function el(name, cls, label) {
    var s = document.createElement("span");
    s.className = "ic ic-" + String(name).replace(/[^a-z0-9-]/gi, "-") + (cls ? " " + cls : "");
    if (label) { s.setAttribute("role", "img"); s.setAttribute("aria-label", label); }
    else s.setAttribute("aria-hidden", "true");
    s.innerHTML = svg(name);
    return s;
  }

  // ---------- 文字里的“界面 emoji” → 图标 ----------
  var EMOJI = {
    "⭐": "star", "🌟": "star", "☆": "star-empty", "❤️": "heart", "❤": "heart", "🤍": "heart-empty", "💔": "heart-broken",
    "🔥": "fire", "🎁": "chest", "📮": "stamp", "📅": "calendar", "📖": "book", "🔁": "loop", "👑": "crown", "🔒": "lock",
    "✅": "check", "✔️": "check", "✔": "check", "❌": "cross", "✘": "cross", "✗": "cross", "💬": "chat", "▶️": "play", "▶": "play",
    "🎉": "party", "🏆": "trophy", "🥉": "medal-bronze", "🥈": "medal-silver", "🥇": "medal-gold", "🏅": "medal-gold", "💎": "diamond",
    "☁️": "cloud", "🎤": "mic", "💡": "bulb", "🐢": "turtle", "⌨️": "keyboard", "🔊": "speaker", "🔔": "bell", "📳": "vibrate",
    "📍": "pin", "🧭": "compass", "⏱️": "clock", "⏱": "clock", "✏️": "pencil", "✍️": "pencil", "📝": "note", "🎬": "clapper",
    "👀": "eye", "🔀": "shuffle", "🙂": "smile", "🧳": "suitcase", "🎯": "target", "👣": "footprints", "🌱": "sprout",
    "🌿": "leaf", "🌳": "tree", "📐": "ruler", "🎭": "masks", "🎮": "gamepad", "🤖": "robot", "🔤": "abc", "📇": "cards",
    "📚": "books", "🗺️": "map", "🗺": "map", "🎧": "headphones", "🔗": "link", "🧩": "puzzle", "⚡": "bolt", "🃏": "cards",
    "🐼": "panda", "📦": "suitcase", "🌊": "skin-ocean", "🌅": "skin-sunset", "💜": "skin-violet", "👤": "smile"
  };
  var EMOJI_RE = /\p{Extended_Pictographic}️?(?:‍\p{Extended_Pictographic}️?)*|[☀-➿]️?/gu;
  var EMOJI_TEST = /\p{Extended_Pictographic}|\u2606/u; // ☆（空星）不是 emoji，但也换成同一套的空星图标，和 ⭐ 一致
  // 单词内容（这些地方的 emoji 是单词配图：一律做成贴纸，不换成界面图标）
  var WORDY = ".sticker-zone, .opt-emoji, .m-card, .match-card, .quiz-option, .quiz-feedback-zh, .quiz-feedback-word, .speed-flash, .p-review, .learn-emoji, .guess-hint, .flashcard, .word-list, .quiz-prompt-meaning, .review-card, .quiz-wrong-list, .game-list-box, .flash-zh, .fb-body, .bubble, .order-meaning, .card-toast-next";
  function sticker(ch) {
    var s = document.createElement("span");
    s.className = "sticker";
    s.textContent = ch;
    return s;
  }
  function processText(node) {
    var t = node.nodeValue;
    if (!t || !EMOJI_TEST.test(t)) return;
    var pe = node.parentElement;
    if (!pe || pe.closest(".sticker, .ic, script, style, textarea, title, [data-no-icons]")) return;
    var wordy = !!pe.closest(WORDY) && !pe.closest("summary, .fb-title, .quiz-feedback-title"); // 标题行里的是界面图标
    var frag = document.createDocumentFragment();
    var last = 0, m, any = false;
    EMOJI_RE.lastIndex = 0;
    while ((m = EMOJI_RE.exec(t))) {
      var ch = m[0];
      var base = ch.replace(/️/g, "");
      var name = !wordy ? (EMOJI[ch] || EMOJI[base] || EMOJI[base + "️"]) : null;
      if (!name && !EMOJI_TEST.test(ch)) continue;
      if (m.index > last) frag.appendChild(document.createTextNode(t.slice(last, m.index)));
      frag.appendChild(name ? el(name, "ic-inline") : sticker(ch));
      last = m.index + ch.length;
      any = true;
    }
    if (!any) return;
    if (last < t.length) frag.appendChild(document.createTextNode(t.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  function scan(root) {
    if (!root) return;
    if (root.nodeType === 3) { processText(root); return; }
    if (root.nodeType !== 1 || root.closest && root.closest(".sticker, .ic, script, style, textarea, [data-no-icons]")) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var list = [], n;
    while ((n = w.nextNode())) if (EMOJI_TEST.test(n.nodeValue)) list.push(n);
    for (var i = 0; i < list.length; i++) processText(list[i]);
  }
  var busy = false;
  function start() {
    scan(document.body);
    if (!window.MutationObserver) return;
    new MutationObserver(function (muts) {
      if (busy) return;
      busy = true;
      try {
        for (var i = 0; i < muts.length; i++) {
          var mu = muts[i];
          if (mu.type === "characterData") scan(mu.target);
          else for (var j = 0; j < mu.addedNodes.length; j++) scan(mu.addedNodes[j]);
        }
      } catch (e) {}
      busy = false;
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);

  window.Icons = {
    svg: svg, el: el, has: function (n) { return !!D[n]; },
    region: function (id) { return REGION_ICON[id] || "pin"; },
    avatar: function (id, cls) { var s = el("avatar:" + id, "ic-avatar" + (cls ? " " + cls : "")); return s; },
    avatarName: function (id) { var a = AVATAR_ART[id]; return a ? a.zh : ""; },
    npc: function (regionId, cls) { return el("npc:" + regionId, "ic-npc" + (cls ? " " + cls : "")); },
    scan: scan, EMOJI: EMOJI
  };
})();
