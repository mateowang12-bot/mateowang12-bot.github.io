// ============================================
// 地图地形背景（terrain.js）—— window.Terrain（阶段 14）
// 每个区域一种地形，按旅行路线：机场蓝天白云 → 城市楼房 → 西班牙广场 → 森林公园 → 红瓦小镇 → 集市 → 沙漠荒原 → 山区小镇 → 田野风车 → 海边派对。
// 画法（为了 126 个节点的长地图也不卡）：
//   1. 景物都画成 <symbol>（树丛、楼群、沙丘里的仙人掌……），整页只放一次（隐藏的 SVG 精灵图）；每个区域用 <use> 引用。
//      很多景物本身就是“一丛 / 一排”（例如一个 symbol 里有 3 棵树），所以引用的数量不多。
//   2. 每个区域两侧有“地形带”：一条弯弯的边（海岸线、沙丘、田垄、远山……），用一个 <path> 画，从区域顶到底连续，不会被切成方块。
//   3. 两侧成片摆景物，分前后两层（后排浅、小；前排深、大），中间零星点缀小花、贝壳、石头（避开关卡节点）。
//   4. 区域底色是 CSS 渐变（上一段地形 → 这一段），相邻区域自然过渡（css/style.css 的 .region.has-terrain）。
//   5. 会动的只有几个（云、浪、风车叶），各自一个小 SVG，用 CSS transform 动画；系统设置了“减少动态效果”就全停。
//   6. 颜色全是 css/style.css 的 --t-… / --tc-… 变量；深色模式是夜晚配色（深色天空、星星、月亮）。
//   景物都在路径和节点的后面；节点、标题、“开始”气泡、区域横幅都是实心的，所以可读性不受影响。
// 只有首页（地图）用；在 js/map.js 之前引入。
// ============================================
(function () {
  var NS = "http://www.w3.org/2000/svg";
  // ---------- 景物（100×100 画布） ----------
  var SYM = {
    // 通用
    cloud: '<path class="tc-cloud" d="M14 72a16 16 0 013-31 22 22 0 0141-7 16 16 0 0124 25 12 12 0 01-6 13z"/>',
    sun: '<circle class="tc-sun" cx="50" cy="50" r="22"/><path class="tc-sunray" d="M50 8v12M50 80v12M8 50h12M80 50h12M20 20l9 9M71 71l9 9M80 20l-9 9M29 71l-9 9"/>',
    moon: '<path class="tc-moon" d="M62 16a34 34 0 100 68 27 27 0 010-68z"/>',
    star: '<path class="tc-star" d="M50 18l7 23 23 9-23 9-7 23-7-23-23-9 23-9z"/>',
    bird: '<path class="tc-birdline" d="M20 50q15-14 30 0q15-14 30 0"/>',
    flower: '<path class="tc-leaf3" d="M48 98V60h4v38z"/><circle class="tc-petal" cx="50" cy="44" r="10"/><circle class="tc-petal" cx="36" cy="54" r="10"/><circle class="tc-petal" cx="64" cy="54" r="10"/><circle class="tc-petal" cx="42" cy="68" r="9"/><circle class="tc-petal" cx="58" cy="68" r="9"/><circle class="tc-fruit2" cx="50" cy="57" r="8"/>',
    mushroom: '<rect class="tc-wall" x="40" y="54" width="20" height="40" rx="8"/><path class="tc-cap" d="M14 58a36 30 0 0172 0z"/><circle class="tc-wall" cx="34" cy="44" r="5"/><circle class="tc-wall" cx="58" cy="38" r="6"/><circle class="tc-wall" cx="70" cy="52" r="4"/>',
    bush: '<circle class="tc-leaf3" cx="30" cy="66" r="22"/><circle class="tc-leaf3" cx="56" cy="56" r="28"/><circle class="tc-leaf3" cx="78" cy="70" r="18"/><rect class="tc-leaf3" x="10" y="66" width="82" height="26" rx="13"/>',
    rock: '<path class="tc-rock2" d="M10 90l14-34 22-10 26 8 18 36z"/>',
    grass: '<path class="tc-leaf3" d="M10 92q4-24 8 0zM22 92q5-32 9 0zM36 92q3-20 7 0zM60 92q5-30 9 0zM76 92q4-22 8 0z"/>',
    // 机场
    plane: '<path class="tc-plane" d="M94 48c0-3-3-6-7-6H62L42 12H31l10 30H22l-8-10H6l4 18-4 18h8l8-10h19L31 88h11l20-30h25c4 0 7-3 7-6z"/><path class="tc-window" d="M66 46h4v4h-4zM74 46h4v4h-4zM82 46h4v4h-4z"/>',
    tower: '<path class="tc-wall2" d="M40 98l4-62h12l4 62z"/><path class="tc-wall" d="M28 36h44l-6-16H34z"/><rect class="tc-window" x="32" y="22" width="36" height="10" rx="3"/><path class="tc-roof" d="M34 20l16-12 16 12z"/>',
    windsock: '<rect class="tc-metal" x="20" y="20" width="4" height="78"/><path class="tc-awning1" d="M24 22l52 6v14l-52 6z"/><path class="tc-wall" d="M42 24v20M60 26v16"/>',
    // 城市
    skyline: '<rect class="tc-wall2" x="2" y="30" width="30" height="70" rx="2"/><rect class="tc-wall" x="30" y="12" width="34" height="88" rx="2"/><rect class="tc-wall2" x="62" y="42" width="34" height="58" rx="2"/>' +
      '<path class="tc-window" d="M8 38h6v6H8zM20 38h6v6h-6zM8 52h6v6H8zM20 52h6v6h-6zM8 66h6v6H8zM20 66h6v6h-6zM36 20h7v7h-7zM51 20h7v7h-7zM36 34h7v7h-7zM51 34h7v7h-7zM36 48h7v7h-7zM51 48h7v7h-7zM36 62h7v7h-7zM51 62h7v7h-7zM68 50h7v6h-7zM82 50h7v6h-7zM68 64h7v6h-7zM82 64h7v6h-7z"/>',
    lamp: '<rect class="tc-metal" x="47" y="30" width="6" height="70" rx="3"/><circle class="tc-light" cx="50" cy="26" r="9"/>',
    car: '<path class="tc-awning1" d="M10 70l8-18h46l14 18h12v14H10z"/><path class="tc-window" d="M24 56h16v12H22zM46 56h14l8 12H46z"/><circle class="tc-door" cx="28" cy="86" r="8"/><circle class="tc-door" cx="72" cy="86" r="8"/>',
    // 广场
    umbrella: '<rect class="tc-metal" x="48" y="40" width="4" height="58" rx="2"/><path class="tc-awning1" d="M8 44a42 28 0 0184 0z"/><path class="tc-awning2" d="M30 44a20 28 0 0140 0z"/><rect class="tc-wall2" x="28" y="76" width="44" height="7" rx="3"/>',
    fountain: '<ellipse class="tc-stone" cx="50" cy="82" rx="44" ry="14"/><ellipse class="tc-water" cx="50" cy="78" rx="36" ry="9"/><rect class="tc-stone" x="44" y="40" width="12" height="38"/><path class="tc-waterline" d="M50 40q-18 4-22 26M50 40q18 4 22 26"/><circle class="tc-water" cx="50" cy="36" r="8"/>',
    church: '<rect class="tc-wall" x="28" y="40" width="44" height="58" rx="3"/><rect class="tc-wall" x="40" y="10" width="20" height="32"/><path class="tc-roof" d="M36 12l14-12 14 12z"/><path class="tc-door" d="M42 98V78a8 8 0 0116 0v20z"/><circle class="tc-window" cx="50" cy="26" r="5"/>',
    pot: '<path class="tc-roof" d="M28 66h44l-6 30H34z"/><circle class="tc-petal" cx="40" cy="54" r="10"/><circle class="tc-fruit1" cx="60" cy="50" r="11"/><circle class="tc-leaf3" cx="50" cy="60" r="10"/>',
    // 森林
    treesBack: '<rect class="tc-trunk" x="20" y="64" width="7" height="34" rx="3"/><rect class="tc-trunk" x="70" y="60" width="7" height="38" rx="3"/><circle class="tc-leaf" cx="24" cy="48" r="22"/><circle class="tc-leaf" cx="74" cy="42" r="24"/><path class="tc-leaf" d="M50 6L30 64h40z"/>',
    treesFront: '<rect class="tc-trunk2" x="26" y="60" width="10" height="38" rx="4"/><rect class="tc-trunk2" x="64" y="66" width="10" height="32" rx="4"/><circle class="tc-leaf3" cx="31" cy="42" r="26"/><circle class="tc-leaf2" cx="18" cy="54" r="14"/><circle class="tc-leaf3" cx="69" cy="52" r="22"/><circle class="tc-leaf2" cx="84" cy="62" r="12"/>',
    pine: '<rect class="tc-trunk" x="45" y="76" width="10" height="22" rx="3"/><path class="tc-leaf2" d="M50 4L22 48h12L16 78h68L66 48h12z"/>',
    squirrel: '<path class="tc-fur" d="M70 70c18-4 24-30 6-40-14-8-26 4-20 16 4 8 12 6 12 0"/><ellipse class="tc-fur" cx="42" cy="72" rx="20" ry="16"/><circle class="tc-fur" cx="28" cy="52" r="12"/><path class="tc-fur" d="M22 42l2-10 6 8z"/><circle class="tc-eye" cx="25" cy="50" r="2.2"/><ellipse class="tc-fruit2" cx="34" cy="70" rx="6" ry="7"/>',
    lake: '<ellipse class="tc-water" cx="50" cy="55" rx="47" ry="24"/><path class="tc-waterline" d="M20 52q6-4 12 0t12 0M54 62q6-4 12 0t12 0"/>',
    // 小镇
    houseRow: '<rect class="tc-wall" x="4" y="48" width="44" height="50" rx="2"/><path class="tc-roof" d="M0 50L26 26l26 24z"/><rect class="tc-wall2" x="50" y="40" width="46" height="58" rx="2"/><path class="tc-roof" d="M46 42L73 16l27 26z"/>' +
      '<rect class="tc-window" x="12" y="58" width="10" height="10" rx="2"/><rect class="tc-door" x="28" y="72" width="12" height="26" rx="2"/><rect class="tc-window" x="58" y="52" width="10" height="10" rx="2"/><rect class="tc-window" x="78" y="52" width="10" height="10" rx="2"/><rect class="tc-door" x="66" y="74" width="12" height="24" rx="2"/>',
    tree: '<rect class="tc-trunk" x="44" y="58" width="12" height="40" rx="4"/><circle class="tc-leaf" cx="50" cy="40" r="28"/><circle class="tc-leaf2" cx="34" cy="50" r="15"/><circle class="tc-leaf2" cx="66" cy="48" r="16"/>',
    // 集市
    stall: '<rect class="tc-wall2" x="12" y="52" width="76" height="46" rx="3"/><path class="tc-awning1" d="M6 52l8-24h72l8 24z"/><path class="tc-awning2" d="M24 28l-4 24M40 28l-2 24M56 28l2 24M72 28l4 24"/><circle class="tc-fruit1" cx="30" cy="62" r="7"/><circle class="tc-fruit2" cx="48" cy="62" r="7"/><circle class="tc-fruit1" cx="66" cy="62" r="7"/><circle class="tc-leaf2" cx="39" cy="68" r="6"/>',
    crates: '<rect class="tc-trunk" x="8" y="58" width="40" height="40" rx="3"/><rect class="tc-trunk2" x="50" y="64" width="40" height="34" rx="3"/><circle class="tc-fruit1" cx="20" cy="56" r="7"/><circle class="tc-fruit1" cx="34" cy="56" r="7"/><circle class="tc-fruit2" cx="62" cy="62" r="7"/><circle class="tc-fruit2" cx="76" cy="62" r="7"/>',
    bunting: '<path class="tc-birdline" d="M0 20q50 22 100 0"/><path class="tc-awning1" d="M8 23l6 16 6-14zM40 30l6 16 6-16zM72 28l6 16 6-18z"/><path class="tc-awning2" d="M24 28l6 16 6-15zM56 31l6 15 6-16zM88 24l5 14 5-17z"/>',
    // 沙漠
    cactus: '<path class="tc-cactus" d="M42 98V22a8 8 0 0116 0v76zM42 60H28a8 8 0 01-8-8V38a5 5 0 0110 0v12h12zM58 50h12V34a5 5 0 0110 0v16a8 8 0 01-8 8H58z"/>',
    cactusGroup: '<path class="tc-cactus" d="M30 98V34a7 7 0 0114 0v64zM30 64H20a6 6 0 01-6-6V48a4 4 0 018 0v8h8zM44 56h8V44a4 4 0 018 0v12a6 6 0 01-6 6h-10z"/><path class="tc-cactus2" d="M66 98V56a6 6 0 0112 0v42zM78 74h6v-8a3 3 0 016 0v8a5 5 0 01-5 5h-7z"/><ellipse class="tc-rock2" cx="52" cy="96" rx="14" ry="5"/>',
    mesa: '<path class="tc-mesa" d="M0 98L12 50h22l8-18h28l10 24h12l8 42z"/><path class="tc-mesa2" d="M12 50h22l8-18h28l10 24" fill="none"/>',
    skull: '<ellipse class="tc-rock2" cx="50" cy="80" rx="40" ry="10"/>',
    // 山区
    mountains: '<path class="tc-rock" d="M0 98L30 30l18 26 14-22 38 64z"/><path class="tc-snow" d="M30 30l10 14-5 4-5-6-6 6zM62 34l9 12-5 3-4-4z"/><path class="tc-rock3" d="M0 98l18-30 14 14 12-10 22 26z"/>',
    house: '<rect class="tc-wall" x="18" y="46" width="64" height="52" rx="3"/><path class="tc-roof" d="M10 50L50 16l40 34z"/><rect class="tc-door" x="44" y="70" width="14" height="28" rx="2"/><rect class="tc-window" x="26" y="58" width="12" height="11" rx="2"/><rect class="tc-window" x="64" y="58" width="12" height="11" rx="2"/>',
    // 农场
    windmill: '<path class="tc-wall" d="M36 98l7-58h14l7 58z"/><path class="tc-roof" d="M38 42l12-16 12 16z"/><rect class="tc-door" x="45" y="80" width="10" height="18" rx="2"/>',
    blades: '<path class="tc-blade" d="M47 2h6v46h-6zM2 47h46v6H2zM52 47h46v6H52zM47 52h6v46h-6z"/><circle class="tc-metal" cx="50" cy="50" r="7"/>',
    olive: '<path class="tc-trunk" d="M44 98c4-14 0-22-6-30l6-2c6 8 8 14 8 20 2-8 6-14 12-18l4 4c-8 6-12 14-12 26z"/><ellipse class="tc-olive" cx="34" cy="50" rx="22" ry="14"/><ellipse class="tc-olive" cx="64" cy="44" rx="24" ry="15"/><ellipse class="tc-leaf2" cx="50" cy="32" rx="18" ry="11"/>',
    hay: '<ellipse class="tc-hay" cx="50" cy="70" rx="34" ry="26"/><path class="tc-hayline" d="M24 66q26-10 52 0M22 78q28-10 56 0"/>',
    fence: '<path class="tc-fence" d="M8 98V56M30 98V56M52 98V56M74 98V56M96 98V56M4 66h96M4 84h96"/>',
    // 海边
    palm: '<path class="tc-trunk" d="M48 98c-2-24 0-46 6-62l6 2c-6 16-8 36-6 60z"/><path class="tc-palm" d="M56 32c-10-12-28-14-40-6 14-2 26 2 36 10zM56 32c4-14 18-22 34-20-12 4-22 12-28 22zM56 32c14-4 30 2 38 14-12-6-26-8-36-6zM56 32c-14 0-26 10-30 24 8-10 18-16 30-16z"/><circle class="tc-trunk2" cx="56" cy="36" r="4"/>',
    beachUmbrella: '<rect class="tc-metal" x="48" y="34" width="4" height="64" rx="2"/><path class="tc-awning1" d="M10 40a40 26 0 0180 0z"/><path class="tc-wall" d="M30 40a20 26 0 0140 0z"/><path class="tc-awning2" d="M42 40a8 26 0 0116 0z"/><rect class="tc-sand2" x="20" y="86" width="40" height="10" rx="4"/>',
    boat: '<path class="tc-boat" d="M14 70h72l-12 18H26z"/><path class="tc-sail" d="M48 66V14l30 52z"/><path class="tc-sail2" d="M44 66V24L22 66z"/><rect class="tc-metal" x="45" y="12" width="3" height="58"/>',
    gull: '<path class="tc-birdline" d="M14 52q18-18 36 0q18-18 36 0"/>',
    shell: '<path class="tc-shell" d="M20 80a30 30 0 0160 0z"/><path class="tc-shellline" d="M50 80V52M50 80L34 56M50 80l16-24"/>',
    starfish: '<path class="tc-starfish" d="M50 14l8 26 28 2-22 16 8 28-22-16-22 16 8-28-22-16 28-2z"/>'
  };
  // ---------- 每种地形 ----------
  //   ground：地形带（弯弯的边）怎么画；back / front：两侧后排 / 前排的景物；small：中间零星的小东西；extra：特别的景物
  var TERRAIN = {
    airport: { back: ["cloud", "cloud"], front: ["tower", "windsock", "cloud"], small: ["grass"], sky: true, bigPlane: true, anim: ["cloud"] },
    hotel: { back: ["skyline"], front: ["skyline", "lamp", "car"], small: ["lamp"], band: "street" },
    cafe: { back: ["church", "umbrella"], front: ["umbrella", "fountain", "pot"], small: ["pot", "flower"], band: "tiles" },
    park: { back: ["treesBack", "pine", "treesBack"], front: ["treesFront", "bush", "treesFront", "pine"], small: ["flower", "mushroom", "bush", "flower", "grass"], band: "meadow", critter: ["squirrel", "bird"] },
    home: { back: ["houseRow", "tree"], front: ["houseRow", "church", "tree"], small: ["flower", "bush"], band: "meadow" },
    shop: { back: ["stall", "bunting"], front: ["stall", "crates", "umbrella"], small: ["crates", "flower"], band: "tiles" },
    train: { back: ["mesa", "mesa"], front: ["cactusGroup", "cactus", "rock", "cactusGroup"], small: ["rock", "cactus", "skull"], band: "dunes", sun: true, rails: true },
    pharmacy: { back: ["mountains", "mountains"], front: ["pine", "house", "pine"], small: ["rock", "flower"], band: "hills" },
    farm: { back: ["olive", "windmill"], front: ["olive", "hay", "fence", "windmill"], small: ["hay", "flower"], band: "fields", anim: ["blades"] },
    party: { back: ["palm"], front: ["palm", "beachUmbrella"], small: ["shell", "starfish", "shell"], band: "sea", critter: ["boat", "gull", "gull"], anim: ["wave"] }
  };
  var ORDER = ["airport", "hotel", "cafe", "park", "home", "shop", "train", "pharmacy", "farm", "party"];

  function ensureSprite() {
    if (document.getElementById("terrain-sprite")) return;
    var s = '<svg xmlns="' + NS + '" id="terrain-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">';
    for (var k in SYM) if (Object.prototype.hasOwnProperty.call(SYM, k)) s += '<symbol id="t-' + k + '" viewBox="0 0 100 100">' + SYM[k] + "</symbol>";
    s += "</svg>";
    var d = document.createElement("div");
    d.innerHTML = s;
    document.body.insertBefore(d.firstChild, document.body.firstChild);
  }
  function kindOf(regionId, index) {
    if (TERRAIN[regionId]) return regionId;
    return ORDER[index % ORDER.length]; // 临时地图：按顺序轮流
  }
  function prepareRegion(sec, regionId, index, prevId, prevIndex) {
    var k = kindOf(regionId, index);
    sec.classList.add("has-terrain", "terrain-" + k);
    sec.style.setProperty("--t-prev", prevId === null ? "var(--t-g-" + k + ")" : "var(--t-g-" + kindOf(prevId, prevIndex) + ")");
  }
  // 可重复的随机数（同一个区域每次摆得一样）
  function rngFor(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h += 0x6D2B79F5; var t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function use(sym, x, y, size, cls) {
    return '<use href="#t-' + sym + '" x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="' + size.toFixed(0) + '" height="' + size.toFixed(0) + '"' + (cls ? ' class="' + cls + '"' : "") + "/>";
  }
  // 一条弯弯的地形带：side = "l" / "r"；depth = 平均宽度；amp / period = 弯的幅度 / 间距
  function band(side, w, h, depth, amp, period, phase, cls) {
    var pts = [];
    for (var y = -10; y <= h + 10; y += 20) {
      var d = depth + amp * Math.sin(y / period + phase) + amp * 0.4 * Math.sin(y / (period * 0.37) + phase * 2);
      pts.push((side === "l" ? d : w - d).toFixed(0) + " " + y);
    }
    var edge = side === "l" ? "-20" : String(w + 20);
    return '<path class="' + cls + '" d="M' + edge + " -10L" + pts.join("L") + "L" + edge + " " + (h + 10) + 'Z"/>';
  }
  function bandLines(side, w, h, depth, amp, period, phase, cls, step) {
    var s = "";
    for (var y = 30; y < h; y += step) {
      var d = depth + amp * Math.sin(y / period + phase);
      var x0 = side === "l" ? 4 : w - d + 8, x1 = side === "l" ? d - 10 : w - 4;
      if (x1 - x0 > 16) s += '<path class="' + cls + '" d="M' + x0.toFixed(0) + " " + y + "q" + ((x1 - x0) / 4).toFixed(0) + " -6 " + ((x1 - x0) / 2).toFixed(0) + " 0t" + ((x1 - x0) / 2).toFixed(0) + ' 0"/>';
    }
    return s;
  }
  // 画一个区域的地形。path：.region-path；w、h：宽高；pts：每个节点中心 [{x,y}]
  function decorate(path, regionId, index, w, h, pts) {
    var k = kindOf(regionId, index);
    var T = TERRAIN[k];
    var R = rngFor(k + ":" + w);
    var old = path.querySelectorAll(".terrain-layer, .terrain-anim");
    for (var o = 0; o < old.length; o++) old[o].parentNode.removeChild(old[o]);
    var narrow = w < 420;
    var side = Math.max(54, Math.min(160, (w - 300) / 2 + 60)); // 两侧景物带的宽度
    var s = "";
    // 1) 地形带（连续的弯边）
    var ph = R() * 6;
    if (T.band === "sea") {
      s += band("l", w, h, side * 1.05, 12, 70, ph, "tc-sand");
      s += band("l", w, h, side * 0.72, 10, 60, ph, "tc-sea");
      s += band("l", w, h, side * 0.45, 8, 50, ph + 1, "tc-sea2");
      s += bandLines("l", w, h, side * 0.7, 10, 60, ph, "tc-waveline", 34);
      s += band("r", w, h, side * 0.5, 8, 80, ph + 2, "tc-sand");
    } else if (T.band === "dunes") {
      s += band("l", w, h, side * 0.95, 18, 55, ph, "tc-dune2");
      s += band("l", w, h, side * 0.6, 14, 45, ph + 1, "tc-dune");
      s += band("r", w, h, side * 0.95, 18, 55, ph + 2, "tc-dune2");
      s += band("r", w, h, side * 0.6, 14, 45, ph + 3, "tc-dune");
    } else if (T.band === "meadow") {
      s += band("l", w, h, side * 0.9, 14, 60, ph, "tc-meadow");
      s += band("r", w, h, side * 0.9, 14, 60, ph + 2, "tc-meadow");
    } else if (T.band === "fields") {
      s += band("l", w, h, side * 1.0, 10, 90, ph, "tc-field1");
      s += bandLines("l", w, h, side, 10, 90, ph, "tc-furrow", 16);
      s += band("r", w, h, side * 1.0, 10, 90, ph + 2, "tc-field2");
      s += bandLines("r", w, h, side, 10, 90, ph + 2, "tc-furrow", 16);
    } else if (T.band === "hills") {
      s += band("l", w, h, side * 0.9, 20, 70, ph, "tc-hill");
      s += band("r", w, h, side * 0.9, 20, 70, ph + 2, "tc-hill");
    } else if (T.band === "tiles") {
      s += band("l", w, h, side * 0.8, 4, 200, ph, "tc-stone");
      s += band("r", w, h, side * 0.8, 4, 200, ph, "tc-stone");
      s += bandLines("l", w, h, side * 0.8, 0, 200, 0, "tc-stoneline", 22);
      s += bandLines("r", w, h, side * 0.8, 0, 200, 0, "tc-stoneline", 22);
    } else if (T.band === "street") {
      s += band("l", w, h, side * 0.7, 2, 300, ph, "tc-road");
      s += band("r", w, h, side * 0.7, 2, 300, ph, "tc-road");
    }
    if (T.sky) {
      s += band("l", w, h, side * 0.55, 6, 120, ph, "tc-runway");
      for (var ry = 20; ry < h; ry += 46) s += '<rect class="tc-runline" x="' + (side * 0.22).toFixed(0) + '" y="' + ry + '" width="6" height="24" rx="3"/>';
    }
    if (T.rails) {
      var rx = w - side * 0.55;
      s += '<path class="tc-rail" d="M' + (rx - 12).toFixed(0) + " 0V" + h + "M" + (rx + 12).toFixed(0) + " 0V" + h + '"/>';
      for (var sy = 6; sy < h; sy += 18) s += '<path class="tc-sleeper" d="M' + (rx - 20).toFixed(0) + " " + sy + "h40" + '"/>';
    }
    // 2) 两侧成片的景物：后排（浅、小）+ 前排（深、大）
    var big = narrow ? 84 : 112;
    var stepY = narrow ? 100 : 112;
    for (var yy = 10, n = 0; yy < h - 30; yy += stepY, n++) {
      for (var sd = 0; sd < 2; sd++) {
        var left = sd === 0;
        if (T.band === "sea" && left) { // 海那一侧：只放船和海鸥（下面）
          continue;
        }
        if ((n + sd) % 2 === 0) { // 后排景物：两侧轮流放（数量减半，地图更省）
        var bsz = big * (0.7 + R() * 0.15);
        var bx = left ? -bsz * 0.15 + R() * 14 : w - bsz * 0.85 - R() * 14;
        s += use(T.back[(n + sd) % T.back.length], bx + (left ? side * 0.25 : -side * 0.25), yy - 18 + R() * 10, bsz, "t-back");
        }
        var fsz = big * (0.85 + R() * 0.25);
        var fx = left ? -fsz * 0.28 + R() * 12 : w - fsz * 0.72 - R() * 12;
        s += use(T.front[(n * 2 + sd) % T.front.length], fx, yy + stepY * 0.35 + R() * 12, fsz);
      }
    }
    // 3) 中间零星的小东西（避开节点）
    var small = T.small || [];
    var tries = Math.floor(h / 120);
    for (var t2 = 0; t2 < tries; t2++) {
      var sx = side * 0.6 + R() * (w - side * 1.2), syy = 20 + R() * (h - 60), ok = true;
      for (var p = 0; p < pts.length && ok; p++) if (Math.abs(pts[p].x - sx) < 90 && Math.abs(pts[p].y - syy) < 95) ok = false;
      if (ok && small.length) s += use(small[t2 % small.length], sx - 16, syy, 30 + R() * 10, "t-small");
    }
    // 4) 特别的景物：大飞机、太阳、小动物、船、海鸥、星星
    if (T.bigPlane) s += use("plane", w * 0.5 - 20, 10, narrow ? 90 : 130, "t-plane");
    if (T.sun) s += use("sun", w - (narrow ? 70 : 110), 6, narrow ? 64 : 90, "t-day");
    var cr = T.critter || [];
    for (var c = 0; c < cr.length; c++) {
      var cy = 60 + (c + 0.5) * (h - 120) / cr.length;
      var cx = T.band === "sea" ? side * (0.15 + 0.2 * (c % 2)) : (c % 2 ? w - side * 0.9 : side * 0.4);
      s += use(cr[c], cx, cy, cr[c] === "boat" ? (narrow ? 58 : 80) : 40, cr[c] === "boat" || cr[c] === "gull" ? "" : "t-small");
    }
    for (var st = 0; st < Math.floor(h / 260); st++) s += use("star", (st % 2 ? w - side * 0.6 : side * 0.4) + R() * 30, 30 + st * 260 + R() * 40, 14 + R() * 8, "t-night");
    if (k === "airport" || k === "party" || k === "train") s += use("moon", w - (narrow ? 64 : 100), 8, narrow ? 44 : 60, "t-night");

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "terrain-layer");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.innerHTML = s;
    path.insertBefore(svg, path.firstChild);
    // 5) 会动的：云、浪、风车叶（各自一个小 SVG，CSS transform 动画）
    var anims = [];
    if (T.anim && T.anim.indexOf("cloud") !== -1) { anims.push({ sym: "cloud", x: w * 0.12, y: h * 0.3, size: narrow ? 70 : 100 }); anims.push({ sym: "cloud", x: w * 0.6, y: h * 0.62, size: narrow ? 60 : 90 }); }
    if (T.anim && T.anim.indexOf("blades") !== -1) {
      // 风车叶跟着两侧前排里的风车：直接在左边放一个大风车 + 会转的叶子
      var wy = h * 0.35, wsz = narrow ? 92 : 120;
      s = use("windmill", -wsz * 0.1, wy, wsz);
      svg.insertAdjacentHTML("beforeend", s);
      anims.push({ sym: "blades", x: -wsz * 0.1 + wsz * 0.16, y: wy - wsz * 0.12, size: wsz * 0.68 });
    }
    if (T.anim && T.anim.indexOf("wave") !== -1) { anims.push({ sym: "boat", x: side * 0.1, y: h * 0.5, size: narrow ? 56 : 76, cls: "anim-wave" }); }
    for (var j = 0; j < anims.length; j++) {
      var it = anims[j];
      var s2 = document.createElementNS(NS, "svg");
      s2.setAttribute("class", "terrain-anim " + (it.cls || "anim-" + it.sym));
      s2.setAttribute("aria-hidden", "true");
      s2.setAttribute("focusable", "false");
      s2.setAttribute("viewBox", "0 0 100 100");
      s2.style.left = it.x.toFixed(0) + "px";
      s2.style.top = it.y.toFixed(0) + "px";
      s2.style.width = it.size.toFixed(0) + "px";
      s2.style.height = it.size.toFixed(0) + "px";
      s2.innerHTML = '<use href="#t-' + it.sym + '" width="100" height="100"/>';
      path.insertBefore(s2, svg.nextSibling);
    }
  }

  window.Terrain = { ensureSprite: ensureSprite, prepareRegion: prepareRegion, decorate: decorate, kindOf: kindOf, ORDER: ORDER };
})();
