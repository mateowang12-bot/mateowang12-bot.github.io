// ============================================
// 冒险世界（world.js）—— window.World（阶段 11）
// 地图首页、关卡页 pages/play.html、收藏页、我的页共用。
// 要在 data/*.js（含 data/levels.js）和 js/storage.js 之后引入。
//
// 数据：window.WORLD（data/levels.js，内容编写员写）
//   { regions: [ { id, titleZh, titleEn, emoji, storyZh, storyEn, npc:{ name, emoji, roleZh, roleEn }, stampZh, stampEn,
//       levels: [ { id, type: "normal"|"task"|"boss", titleZh, titleEn, introZh, introEn,
//         items: { letters:[...], words:[wordId], phrases:[phraseId], grammar:[{ lesson, ex:[下标] }], dialogue: "对话id" },
//         modes: ["listen","match","order","guess","fill","dialogue","speed"], count } ] } ],
//     tasks: [ 和 data/dialogues.js 一样格式的对话 ] }
//   还没有 data/levels.js（或格式不对）时：用现有的单词课 / 句子 / 语法 / 情景对话自动排一张“临时地图”（World.isFallback = true），
//   不编新内容，只是把已有内容排成关卡，保证地图能用。
//
//   World.regions()              区域列表（每个区域多了 index）
//   World.levels()               所有关卡按顺序排成一列（每关多了 region、regionIndex、index、order）
//   World.getLevel(id) / getRegion(id)
//   World.isUnlocked(level)      解锁规则：第一关开放；前一关 ≥ 1 星才解锁下一关（boss 是区域最后一关，所以 boss 过了才开下一个区域）。
//                                阶段 12：背单词关（type "learn"）和复习关（type "review"）是“推荐关”，不挡路：
//                                算“前一关”时跳过它们，看再往前最近的一个普通 / 对话 / Boss 关有没有星星。
//                                这样新插进来的 learn / review 关不会把老存档锁住（已经过了的关之前、之后都能接着玩），
//                                新用户的地图气泡也会先指向它们（见 current）。
//   World.current()              现在该玩的关卡：最后一个有星星的关卡之后，第一个解锁了但还没星星的（全过了就是最后一关）
//   World.isPractice(level)      是不是背单词关 / 复习关
//   World.nextLevel(level)       下一关（没有 → null）
//   World.regionStars(region)    → { got, max }
//   World.resolve(level)         把 items 里的 id 换成真正的内容 → { letters, words, phrases, grammar:[练习题], dialogue }
//   World.dialogueById(id)       先找 window.DIALOGUES，再找 WORLD.tasks
//   World.AVATARS / SKINS / RANKS   头像、界面主题、段位（常量只写在这里）
//   World.avatar(id) / skin(id)  取一个
//   World.rank(xp)               → { cur, next, from, to, ratio }
//   World.openChest()            开宝箱：随机给一个还没拥有的头像或主题，全部拿完改给 XP → Progress.openChest 的结果 + item
//   World.daily()                今天的每日挑战（一个特别的“关卡”对象，id = "daily-YYYY-MM-DD"）
//   World.rng(seedText)          可重复的随机数（同一个种子每次一样）
// ============================================
(function () {
  function P() { return window.Progress || null; }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

  // ---------- 奖励清单（想改只改这里） ----------
  var AVATARS = [
    { id: "suitcase", emoji: "🧳", zh: "熊猫宝宝", en: "Suitcase" },
    { id: "bull", emoji: "🐂", zh: "小牛", en: "Bull" },
    { id: "parrot", emoji: "🦜", zh: "鹦鹉", en: "Parrot" },
    { id: "cat", emoji: "🐱", zh: "小猫", en: "Cat" },
    { id: "dancer", emoji: "💃", zh: "火烈鸟", en: "Flamenco" },
    { id: "guitar", emoji: "🎸", zh: "小狗", en: "Guitar" },
    { id: "sun", emoji: "🌞", zh: "小狮子", en: "Sun" },
    { id: "paella", emoji: "🥘", zh: "小猪", en: "Paella" },
    { id: "castle", emoji: "🏰", zh: "小兔", en: "Castle" },
    { id: "sunflower", emoji: "🌻", zh: "小鸡", en: "Sunflower" },
    { id: "fish", emoji: "🐟", zh: "小企鹅", en: "Fish" },
    // 阶段 12：这个头像换成了小狐狸 🦊；id 仍然叫 "owl"（老存档里拥有 / 正在用的 "owl" 直接变成狐狸，不会变成空白头像）
    { id: "owl", emoji: "🦊", zh: "小狐狸", en: "Fox" },
    { id: "orange", emoji: "🍊", zh: "小老虎", en: "Orange" },
    { id: "trumpet", emoji: "🎺", zh: "小象", en: "Trumpet" },
    { id: "football", emoji: "⚽", zh: "小猴", en: "Football" },
    { id: "cactus", emoji: "🌵", zh: "小青蛙", en: "Cactus" }
  ];
  // 主题的颜色在 css/style.css 的 html[data-skin="…"]（浅色、深色各一套）
  var SKINS = [
    { id: "default", emoji: "🌿", zh: "清新绿", en: "Green" },
    { id: "ocean", emoji: "🌊", zh: "海蓝", en: "Ocean" },
    { id: "sunset", emoji: "🌅", zh: "日落橙", en: "Sunset" },
    { id: "violet", emoji: "💜", zh: "紫罗兰", en: "Violet" }
  ];
  // 段位：按总经验值
  var RANKS = [
    { id: "bronze", emoji: "🥉", zh: "青铜", en: "Bronze", min: 0 },
    { id: "silver", emoji: "🥈", zh: "白银", en: "Silver", min: 200 },
    { id: "gold", emoji: "🥇", zh: "黄金", en: "Gold", min: 600 },
    { id: "diamond", emoji: "💎", zh: "钻石", en: "Diamond", min: 1500 },
    { id: "legend", emoji: "👑", zh: "传奇", en: "Legend", min: 3000 }
  ];
  var MODES = ["listen", "match", "order", "guess", "fill", "dialogue", "speed"];
  var MODE_INFO = {
    listen: { icon: "🎧", zh: "听音选", en: "Listen" },
    match: { icon: "🔗", zh: "配对", en: "Match" },
    order: { icon: "🧩", zh: "拼句子", en: "Build" },
    guess: { icon: "🔤", zh: "猜单词", en: "Spell" },
    fill: { icon: "✏️", zh: "填空", en: "Fill in" },
    dialogue: { icon: "💬", zh: "对话任务", en: "Dialogue" },
    speed: { icon: "⏱️", zh: "限时快答", en: "Speed round" }
  };

  function find(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  // ---------- 内容查找 ----------
  var cache = null;
  function index() {
    if (cache) return cache;
    var c = { words: {}, phrases: {}, letters: {}, grammar: {}, dialogues: {} };
    var wl = window.WORD_LESSONS || [];
    for (var i = 0; i < wl.length; i++) {
      var ws = (wl[i] && wl[i].words) || [];
      for (var j = 0; j < ws.length; j++) if (ws[j] && ws[j].id && ws[j].es) c.words[ws[j].id] = { w: ws[j], lesson: i };
    }
    var pl = window.PHRASE_LESSONS || [];
    for (var a = 0; a < pl.length; a++) {
      var ps = (pl[a] && pl[a].phrases) || [];
      for (var b = 0; b < ps.length; b++) if (ps[b] && ps[b].id && ps[b].es) c.phrases[ps[b].id] = { w: ps[b], lesson: a };
    }
    var al = window.ALPHABET || [];
    for (var k = 0; k < al.length; k++) {
      if (!al[k] || !al[k].letter) continue;
      c.letters[String(al[k].letter).toLowerCase()] = al[k];
    }
    var gl = window.GRAMMAR_LESSONS || [];
    for (var g = 0; g < gl.length; g++) if (gl[g] && gl[g].id) c.grammar[gl[g].id] = gl[g];
    var dl = window.DIALOGUES || [];
    for (var d = 0; d < dl.length; d++) if (dl[d] && dl[d].id) c.dialogues[dl[d].id] = dl[d];
    var W = window.WORLD;
    var tk = W && W.tasks && W.tasks.length ? W.tasks : [];
    // 先找 DIALOGUES，找不到再找 WORLD.tasks（两边 id 不重复；万一重复以 DIALOGUES 为准）
    for (var t = 0; t < tk.length; t++) if (tk[t] && tk[t].id && !has(c.dialogues, tk[t].id)) c.dialogues[tk[t].id] = tk[t];
    cache = c;
    return c;
  }
  function dialogueById(id) {
    var c = index();
    return id && has(c.dialogues, id) ? c.dialogues[id] : null;
  }

  // ---------- 地图数据（真数据或临时地图） ----------
  var built = null;
  function validWorld(W) {
    return !!(W && W.regions && W.regions.length && W.regions[0] && W.regions[0].levels && W.regions[0].levels.length);
  }
  function arr(x) { return x && typeof x.length === "number" ? x : []; }

  // 临时地图：只用已有内容排关卡（每个区域 = 2 课单词 + 1 组句子 + 1 课语法 + 1 个情景）
  function fallbackWorld() {
    var wl = window.WORD_LESSONS || [], pl = window.PHRASE_LESSONS || [], gl = window.GRAMMAR_LESSONS || [], dl = window.DIALOGUES || [];
    var regions = [];
    var n = Math.max(1, Math.min(10, Math.ceil(wl.length / 2)));
    function ids(list, field) {
      var out = [], xs = (list && list[field]) || [];
      for (var i = 0; i < xs.length; i++) if (xs[i] && xs[i].id) out.push(xs[i].id);
      return out;
    }
    for (var r = 0; r < n; r++) {
      var a = wl[2 * r], b = wl[2 * r + 1];
      var words = ids(a, "words").concat(ids(b, "words"));
      var phr = pl[r] ? ids(pl[r], "phrases") : [];
      var gram = [];
      if (gl[r] && gl[r].exercises) {
        var ex = [];
        for (var e = 0; e < gl[r].exercises.length; e++) ex.push(e);
        gram.push({ lesson: gl[r].id, ex: ex });
      }
      var levels = [];
      var t1 = (a && a.titleZh) || ("第 " + (r + 1) + " 站");
      var t1e = (a && a.titleEn) || ("Stop " + (r + 1));
      var lv1 = { id: "fb-" + r + "-1", type: "normal", titleZh: t1, titleEn: t1e, introZh: "", introEn: "",
        items: { words: ids(a, "words"), letters: r === 0 ? ["a", "e", "i", "o", "u"] : [] }, modes: ["listen", "match", "guess"], count: 8 };
      levels.push(lv1);
      if (b) levels.push({ id: "fb-" + r + "-2", type: "normal", titleZh: b.titleZh || "", titleEn: b.titleEn || "", introZh: "", introEn: "",
        items: { words: ids(b, "words"), phrases: phr, grammar: gram }, modes: ["listen", "match", "order", "fill", "guess"], count: 8 });
      if (dl[r] && dl[r].id) levels.push({ id: "fb-" + r + "-t", type: "task", titleZh: dl[r].titleZh || "对话任务", titleEn: dl[r].titleEn || "Dialogue", introZh: dl[r].sceneZh || "", introEn: dl[r].sceneEn || "",
        items: { dialogue: dl[r].id }, modes: ["dialogue"], count: 0 });
      levels.push({ id: "fb-" + r + "-b", type: "boss", titleZh: "本站挑战", titleEn: "Challenge", introZh: "", introEn: "",
        items: { words: words, phrases: phr, grammar: gram }, modes: ["listen", "match", "order", "guess", "fill", "speed"], count: 8 });
      regions.push({ id: "fb-" + r, titleZh: "第 " + (r + 1) + " 站：" + t1, titleEn: "Stop " + (r + 1) + ": " + t1e, emoji: "📍",
        storyZh: "（临时地图：冒险故事还在准备中，先用已有的课程闯关。）", storyEn: "(Temporary map — the story is still being written.)",
        npc: null, stampZh: t1, stampEn: t1e, levels: levels });
    }
    return { regions: regions, tasks: [] };
  }

  function build() {
    if (built) return built;
    var W = window.WORLD;
    var fb = !validWorld(W);
    if (fb) W = fallbackWorld();
    var regions = [], flat = [];
    var rs = arr(W.regions);
    for (var r = 0; r < rs.length; r++) {
      var src = rs[r];
      if (!src || !src.id) continue;
      var reg = {};
      for (var k in src) if (has(src, k)) reg[k] = src[k];
      reg.index = regions.length;
      reg.levels = [];
      var ls = arr(src.levels);
      for (var i = 0; i < ls.length; i++) {
        var l = ls[i];
        if (!l || !l.id) continue;
        var lv = {};
        for (var k2 in l) if (has(l, k2)) lv[k2] = l[k2];
        lv.type = lv.type === "boss" || lv.type === "task" || lv.type === "learn" || lv.type === "review" ? lv.type : "normal";
        lv.items = lv.items && typeof lv.items === "object" ? lv.items : {};
        var ms = [];
        var srcModes = arr(lv.modes);
        for (var m = 0; m < srcModes.length; m++) if (MODES.indexOf(srcModes[m]) !== -1 && ms.indexOf(srcModes[m]) === -1) ms.push(srcModes[m]);
        if (lv.type === "task" && ms.indexOf("dialogue") === -1) ms.push("dialogue");
        lv.modes = ms;
        lv.count = Math.max(0, Math.min(30, Math.floor(Number(lv.count) || 0)));
        lv.region = reg;
        lv.regionIndex = reg.index;
        lv.index = reg.levels.length;
        lv.order = flat.length;
        reg.levels.push(lv);
        flat.push(lv);
      }
      if (reg.levels.length) regions.push(reg);
    }
    built = { regions: regions, levels: flat, fallback: fb };
    return built;
  }

  function regions() { return build().regions; }
  function levels() { return build().levels; }
  function getLevel(id) { return find(levels(), id); }
  function getRegion(id) { return find(regions(), id); }
  function starsOf(lv) {
    var p = P();
    var r = p && p.getLevel ? p.getLevel(lv.id) : null;
    return r ? r.stars : 0;
  }
  function isPractice(lv) { return !!lv && (lv.type === "learn" || lv.type === "review"); }
  // 背单词关不给星星：学完一次（有记录、玩过）就算“学过了”
  function learnDone(lv) {
    var p = P();
    var r = lv && lv.type === "learn" && p && p.getLevel ? p.getLevel(lv.id) : null;
    return !!(r && r.plays > 0);
  }
  // 这一关算不算“完成了”：普通 / 对话 / 大关 / 复习关 ≥ 1 星；背单词关学过一次
  function isDone(lv) { return lv && lv.type === "learn" ? learnDone(lv) : starsOf(lv) >= 1; }
  function isUnlocked(lv) {
    if (!lv) return false;
    if (lv.order === 0) return true;
    var ls = levels();
    // 往前找最近的一个“正式关”（跳过背单词 / 复习关）；前面只有推荐关 → 开放
    for (var i = lv.order - 1; i >= 0; i--) {
      if (isPractice(ls[i])) continue;
      return starsOf(ls[i]) >= 1;
    }
    return true;
  }
  function current() {
    var ls = levels();
    var last = -1;
    for (var i = 0; i < ls.length; i++) if (isDone(ls[i])) last = i;
    for (var j = last + 1; j < ls.length; j++) {
      if (!isUnlocked(ls[j])) break;
      if (!isDone(ls[j])) return ls[j];
    }
    return ls[Math.max(0, Math.min(ls.length - 1, last + 1))] || ls[ls.length - 1] || null;
  }
  function nextLevel(lv) {
    return lv ? levels()[lv.order + 1] || null : null;
  }
  function regionStars(reg) {
    var got = 0, n = 0;
    for (var i = 0; i < reg.levels.length; i++) {
      if (reg.levels[i].type === "learn") continue; // 背单词关没有星星，不算进区域星星
      got += starsOf(reg.levels[i]);
      n++;
    }
    return { got: got, max: n * 3 };
  }
  function regionUnlocked(reg) { return isUnlocked(reg.levels[0]); }

  // ---------- items → 真正的内容 ----------
  // 复习关：把 reviewOf 里那些区域所有关卡的条目合在一起，按“掌握得最差”排序后截取一部分
  //   （答错过的、Leitner 盒子低的、还没掌握的在前；没见过的排在中间；已掌握的在最后）
  var REVIEW_CAP = { words: 16, phrases: 8, letters: 6, grammar: 6 };
  function reviewItems(lv) {
    var p = P();
    var ids = { words: [], phrases: [], letters: [], grammar: [] }, seen = {};
    var rs = arr(lv.reviewOf);
    for (var r = 0; r < rs.length; r++) {
      var reg = getRegion(rs[r]);
      if (!reg) continue;
      for (var i = 0; i < reg.levels.length; i++) {
        var it0 = reg.levels[i].items || {};
        var lists = [["words", "w:"], ["phrases", "p:"], ["letters", "l:"]];
        for (var q = 0; q < lists.length; q++) {
          var src = arr(it0[lists[q][0]]);
          for (var k = 0; k < src.length; k++) {
            var key = lists[q][1] + src[k];
            if (seen[key]) continue;
            seen[key] = 1;
            ids[lists[q][0]].push(src[k]);
          }
        }
        var G = arr(it0.grammar);
        for (var g = 0; g < G.length; g++) if (G[g] && G[g].lesson) ids.grammar.push(G[g]);
      }
    }
    var R = rng("review-" + lv.id + "-" + Date.now());
    function weak(id) {
      var w = p && p.getWord ? p.getWord(id) : null;
      if (!w) return 50 + R();                     // 没见过
      var s = w.box * 20 - (w.wrong > 0 ? 30 : 0) - (w.wrong > w.correct ? 10 : 0);
      if (w.box >= 3) s += 60;                    // 已经掌握：放在最后
      return s + R() * 5;
    }
    function sortWeak(list) {
      return list.map(function (id) { return { id: id, s: weak(id) }; }).sort(function (a, b) { return a.s - b.s; }).map(function (x) { return x.id; });
    }
    return {
      words: sortWeak(ids.words).slice(0, REVIEW_CAP.words),
      phrases: sortWeak(ids.phrases).slice(0, REVIEW_CAP.phrases),
      // 字母和语法题没有“熟不熟”的记录：每次随机抽，不总是前几个
      letters: shuffleR(ids.letters, R).slice(0, REVIEW_CAP.letters),
      grammar: shuffleR(ids.grammar, R).slice(0, REVIEW_CAP.grammar)
    };
  }
  function shuffleR(list, R) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function resolve(lv) {
    var c = index();
    var it = (lv && lv.type === "review" && lv.reviewOf) ? reviewItems(lv) : ((lv && lv.items) || {});
    var out = { letters: [], words: [], phrases: [], grammar: [], dialogue: null, missing: [] };
    var i, k;
    var L = arr(it.letters);
    for (i = 0; i < L.length; i++) {
      k = String(L[i] || "").toLowerCase();
      if (has(c.letters, k)) out.letters.push(c.letters[k]);
      else out.missing.push("letter:" + L[i]);
    }
    var Wd = arr(it.words);
    for (i = 0; i < Wd.length; i++) {
      if (has(c.words, Wd[i])) out.words.push(c.words[Wd[i]]);
      else out.missing.push("word:" + Wd[i]);
    }
    var Ph = arr(it.phrases);
    for (i = 0; i < Ph.length; i++) {
      if (has(c.phrases, Ph[i])) out.phrases.push(c.phrases[Ph[i]]);
      else out.missing.push("phrase:" + Ph[i]);
    }
    var G = arr(it.grammar);
    for (i = 0; i < G.length; i++) {
      var g = G[i];
      var les = g && has(c.grammar, g.lesson) ? c.grammar[g.lesson] : null;
      if (!les) { out.missing.push("grammar:" + (g && g.lesson)); continue; }
      var exs = arr(les.exercises);
      var want = g.ex && g.ex.length !== undefined ? g.ex : null;
      for (var e = 0; e < exs.length; e++) {
        if (want && want.indexOf(e) === -1) continue;
        var x = exs[e];
        if (x && x.prompt && x.options && x.options.length && x.options[x.answer] !== undefined) out.grammar.push({ ex: x, lesson: les, index: e });
      }
      if (want) for (var w2 = 0; w2 < want.length; w2++) if (!exs[want[w2]]) out.missing.push("grammar:" + g.lesson + "#" + want[w2]);
    }
    if (it.dialogue) {
      out.dialogue = dialogueById(it.dialogue);
      if (!out.dialogue) out.missing.push("dialogue:" + it.dialogue);
    }
    return out;
  }

  // ---------- 段位 ----------
  function rank(xp) {
    xp = Math.max(0, Math.floor(Number(xp) || 0));
    var cur = RANKS[0], next = null;
    for (var i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].min) { cur = RANKS[i]; next = RANKS[i + 1] || null; }
    }
    return { cur: cur, next: next, xp: xp, from: cur.min, to: next ? next.min : cur.min,
      ratio: next ? (xp - cur.min) / (next.min - cur.min) : 1 };
  }

  // ---------- 宝箱 ----------
  function openChest() {
    var p = P();
    if (!p || p.chestsAvailable() < 1) return null;
    var o = p.owned();
    var pool = [];
    for (var i = 0; i < AVATARS.length; i++) if (!o.avatars[AVATARS[i].id]) pool.push({ kind: "avatar", item: AVATARS[i] });
    for (var j = 0; j < SKINS.length; j++) if (!o.skins[SKINS[j].id]) pool.push({ kind: "skin", item: SKINS[j] });
    var pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    var res = pick ? p.openChest(pick.kind, pick.item.id) : p.openChest("xp", null);
    if (!res) return null;
    res.item = pick ? pick.item : null;
    return res;
  }

  // ---------- 可重复的随机数（每日挑战用当天日期做种子） ----------
  function rng(seedText) {
    var h = 2166136261;
    var s = String(seedText);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul ? Math.imul(h, 16777619) : (h * 16777619) | 0; }
    var x = h >>> 0 || 1;
    return function () {
      // xorshift32
      x ^= x << 13; x >>>= 0;
      x ^= x >>> 17;
      x ^= x << 5; x >>>= 0;
      return (x >>> 0) / 4294967296;
    };
  }

  // ---------- 每日挑战 ----------
  // 从已经解锁的区域里收集内容，学习中的词放在前面；10 道混合题（不含对话和限时）
  function daily() {
    var p = P();
    var day = p ? p.dayKey() : "today";
    var R = rng("daily-" + day);
    var words = [], phrases = [], letters = [], grammar = [], seen = {};
    var rs = regions();
    for (var r = 0; r < rs.length; r++) {
      if (!regionUnlocked(rs[r])) continue;
      for (var i = 0; i < rs[r].levels.length; i++) {
        if (isPractice(rs[r].levels[i])) continue; // 每日挑战跳过背单词关和复习关
        var it = rs[r].levels[i].items || {};
        var lists = [[arr(it.words), words, "w:"], [arr(it.phrases), phrases, "p:"], [arr(it.letters), letters, "l:"]];
        for (var q = 0; q < lists.length; q++) {
          for (var k = 0; k < lists[q][0].length; k++) {
            var key = lists[q][2] + lists[q][0][k];
            if (seen[key]) continue;
            seen[key] = 1;
            lists[q][1].push(lists[q][0][k]);
          }
        }
        var G = arr(it.grammar);
        for (var g = 0; g < G.length; g++) if (G[g] && G[g].lesson) grammar.push(G[g]);
      }
    }
    function prioritize(ids) {
      // 洗牌（可重复）→ 学习中的排前面
      var a = ids.slice();
      for (var i2 = a.length - 1; i2 > 0; i2--) { var j = Math.floor(R() * (i2 + 1)); var t = a[i2]; a[i2] = a[j]; a[j] = t; }
      if (!p) return a;
      var learning = [], rest = [];
      for (var x = 0; x < a.length; x++) (p.wordStatus(a[x]) === "learning" ? learning : rest).push(a[x]);
      return learning.concat(rest);
    }
    var items = { words: prioritize(words).slice(0, 14), phrases: prioritize(phrases).slice(0, 6), letters: letters.slice(0, 6), grammar: grammar.slice(0, 3) };
    // 当天第一次打开时定下内容，存在本机（Progress.dailyPick）；当天之后都用这一份（学了新词也不会变）
    if (p && p.dailyPick) items = p.dailyPick(day, items) || items;
    var lv = {
      id: "daily-" + day, type: "daily", isDaily: true, day: day,
      titleZh: "每日挑战", titleEn: "Daily challenge",
      introZh: "今天的特别关卡：10 道混合题，复习你已经走过的地方。通关 +30 XP、+3 ⭐（每天领一次）。",
      introEn: "10 mixed questions from places you've visited. +30 XP and +3 stars once a day.",
      items: items,
      modes: ["listen", "match", "order", "guess", "fill"], count: 10, region: null, order: -1, seed: "daily-" + day
    };
    return lv;
  }

  window.World = {
    AVATARS: AVATARS, SKINS: SKINS, RANKS: RANKS, MODES: MODES, MODE_INFO: MODE_INFO,
    isFallback: function () { return build().fallback; },
    regions: regions, levels: levels, getLevel: getLevel, getRegion: getRegion,
    starsOf: starsOf, isUnlocked: isUnlocked, isPractice: isPractice, learnDone: learnDone, isDone: isDone, regionUnlocked: regionUnlocked, current: current, nextLevel: nextLevel, regionStars: regionStars,
    resolve: resolve, dialogueById: dialogueById, index: index,
    avatar: function (id) { return find(AVATARS, id) || AVATARS[0]; },
    skin: function (id) { return find(SKINS, id) || SKINS[0]; },
    rank: rank, openChest: openChest, rng: rng, daily: daily
  };
})();
