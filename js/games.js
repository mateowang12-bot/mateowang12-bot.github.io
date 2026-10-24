// ============================================
// 小游戏共用代码（games.js）—— window.GameKit
// 游戏大厅 pages/games.html 和 4 个游戏页面都用它。要在 storage.js、words-util.js 之后引入。
//
//   GameKit.GAMES                    4 个游戏的说明（id、名字、计分方向、最高分怎么显示）
//   GameKit.get(id)                  取一个游戏的说明
//   GameKit.bestText(id)             “最高分：…”的文字（还没玩过就是“还没玩过”）
//   GameKit.record(id, score)        记一局成绩（方向按 GAMES 里的 lowerIsBetter）→ Progress.recordGame 的结果
//   GameKit.scope(box, id, opts)     开始前选范围（全部 / 某几课单词 / 日常句子），记住上次的选择
//       opts.words = true            可以选单词课
//       opts.phrases = "option"      多一项“日常句子”（全部句子）；"groups"：按句子分组选；不写：不能选句子
//       → { items() → 选中范围里的条目 [{ word, lesson, kind }], keys() }
//   GameKit.typing(ev)               按键是不是发生在输入框里（是的话游戏不要抢键盘）
// ============================================
(function () {
  var U = window.WordsUtil;

  var GAMES = [
    { id: "match", icon: "🃏", zh: "翻牌配对", en: "Memory Match", url: "game-match.html", lowerIsBetter: true,
      desc: ["12 张牌里有 6 对“西语 ↔ 中文”。每次翻两张，配对成功就留下。步数越少越好。",
             "Find 6 Spanish–Chinese pairs. Fewer moves is better."],
      best: function (b) { return "最少 " + b + " 步 / Best: " + b + " moves"; } },
    { id: "speed", icon: "⚡", zh: "60 秒快答", en: "60-Second Sprint", url: "game-speed.html", lowerIsBetter: false,
      desc: ["60 秒内看西语选中文。答对 +10 分，连对越多分越多（×2、×3）；答错扣 3 秒。",
             "Pick the meaning fast. Combos multiply points; mistakes cost 3 seconds."],
      best: function (b) { return "最高 " + b + " 分 / Best: " + b; } },
    { id: "order", icon: "🧩", zh: "拼句子", en: "Build the Sentence", url: "game-order.html", lowerIsBetter: false,
      desc: ["看中文，把打乱的西语词按顺序点进答题区。每轮 5 句，看第一次就拼对几句。",
             "Tap the words in the right order. 5 sentences per round."],
      best: function (b) { return "最好 " + b + " / 5 句 / Best: " + b + " of 5"; } },
    { id: "guess", icon: "🔤", zh: "猜单词", en: "Guess the Word", url: "game-guess.html", lowerIsBetter: false,
      desc: ["看中文提示，一个一个字母猜出西语单词。每个词有 6 颗 ❤️，剩几颗就得几分；每轮 5 个词，满分 30。",
             "Guess the Spanish word letter by letter. 6 hearts per word, 5 words per round."],
      best: function (b) { return "最高 " + b + " / 30 分 / Best: " + b + " of 30"; } }
  ];

  function get(id) {
    for (var i = 0; i < GAMES.length; i++) if (GAMES[i].id === id) return GAMES[i];
    return null;
  }

  function bestText(id) {
    var g = get(id);
    var P = window.Progress;
    var r = P && P.getGame ? P.getGame(id) : null;
    if (!g || !r) return "还没玩过 / Not played yet";
    return g.best(r.best) + " · 玩过 " + r.plays + " 次";
  }

  // earned：这一局是不是“真正玩了”（例如答对至少一题、配对完成）。只有 true 才加经验值，
  // 挂机不答、0 分、全部看答案的局照常记成绩，但不给 XP（防刷分）
  function record(id, score, earned) {
    var g = get(id);
    var P = window.Progress;
    if (!g || !P || !P.recordGame) return null;
    var res = P.recordGame(id, score, g.lowerIsBetter);
    if (earned === true && P.award) P.award("gameDone"); // 完成一局加经验值（数值在 js/storage.js 的 XP_RULES）
    if (res) res.xp = earned === true;
    return res;
  }

  // ---------- 记住上次选的范围（读写失败也没关系） ----------
  function loadKeys(id) {
    try {
      var t = window.localStorage ? window.localStorage.getItem("es-study-game-scope-" + id) : null;
      var v = t ? JSON.parse(t) : null;
      return v && v.length !== undefined ? v : null;
    } catch (e) {
      return null;
    }
  }
  function saveKeys(id, keys) {
    try {
      if (window.localStorage) window.localStorage.setItem("es-study-game-scope-" + id, JSON.stringify(keys));
    } catch (e) {}
  }

  // ---------- 选范围 ----------
  function scope(box, id, opts) {
    opts = opts || {};
    var words = U.collectWords();
    var phrases = U.collectPhrases();
    var groups = [];
    var WL = window.WORD_LESSONS || [];
    var PL = window.PHRASE_LESSONS || [];
    function countIn(list, idx) {
      var n = 0;
      for (var i = 0; i < list.length; i++) if (list[i].lesson === idx) n++;
      return n;
    }
    // 记住的范围按课的 id 存（"w:greetings"、"p:phrase-polite"），课的顺序变了也不会选错；
    // 没有 id 的课才退回用位置
    function wKey(i) { return "w:" + ((WL[i] && WL[i].id) || ("#" + i)); }
    function pKey(i) { return "p:" + ((PL[i] && PL[i].id) || ("#" + i)); }
    if (opts.words) {
      var lg = U.lessonGroups(WL);
      for (var g = 0; g < lg.length; g++) {
        var its = [];
        for (var n = 0; n < lg[g].indices.length; n++) {
          var i = lg[g].indices[n];
          var c = countIn(words, i);
          its.push({ key: wKey(i), zh: (i + 1) + ". " + ((WL[i] && WL[i].titleZh) || ""), en: ((WL[i] && WL[i].titleEn) || "") + " · " + c + " 个词", count: c });
        }
        // 只有一组时也写上“单词”，和下面的“日常句子”分开
        groups.push({ zh: lg[g].zh ? "单词 · " + lg[g].zh : (opts.phrases ? "单词" : ""), en: lg[g].zh ? "Words · " + lg[g].en : (opts.phrases ? "Words" : ""), items: its });
      }
    }
    if (opts.phrases === "option") {
      groups.push({ zh: "日常句子", en: "Everyday phrases", items: [{ key: "p:all", zh: "日常句子（全部）", en: "All phrases · " + phrases.length + " 句", count: phrases.length }] });
    } else if (opts.phrases === "groups") {
      var pits = [];
      for (var p = 0; p < PL.length; p++) {
        var pc = countIn(phrases, p);
        pits.push({ key: pKey(p), zh: (p + 1) + ". " + ((PL[p] && PL[p].titleZh) || ""), en: ((PL[p] && PL[p].titleEn) || "") + " · " + pc + " 句", count: pc });
      }
      groups.push({ zh: "", en: "", items: pits });
    }
    // 上次的选择（没有就默认：单词全选；“日常句子”那一项默认不选，免得一开始太难）
    var saved = loadKeys(id);
    // 旧格式（按位置存的 "w:2"）或者课被删掉了：认不出的 key 丢掉；一个都认不出就当作没存过
    if (saved) {
      var known = {}, valid = [];
      for (var a0 = 0; a0 < groups.length; a0++) {
        for (var b0 = 0; b0 < groups[a0].items.length; b0++) known[groups[a0].items[b0].key] = true;
      }
      for (var s0 = 0; s0 < saved.length; s0++) if (known[saved[s0]] === true) valid.push(saved[s0]);
      saved = valid.length ? valid : null;
    }
    for (var a = 0; a < groups.length; a++) {
      for (var b = 0; b < groups[a].items.length; b++) {
        var it = groups[a].items[b];
        it.checked = saved ? saved.indexOf(it.key) !== -1 : it.key !== "p:all";
      }
    }
    var picker = U.lessonPicker(box, groups, { allLabel: ["全部", "All"], onChange: opts.onChange });

    function keys() {
      return picker.selected();
    }
    function items() {
      var ks = keys();
      saveKeys(id, ks);
      var out = [];
      for (var i = 0; i < words.length; i++) if (ks.indexOf(wKey(words[i].lesson)) !== -1) out.push(words[i]);
      var allP = ks.indexOf("p:all") !== -1;
      for (var j = 0; j < phrases.length; j++) {
        if (allP || ks.indexOf(pKey(phrases[j].lesson)) !== -1) out.push(phrases[j]);
      }
      return out;
    }
    return { items: items, keys: keys, allWords: words, allPhrases: phrases };
  }

  function typing(ev) {
    var t = ev && ev.target;
    if (!t || !t.tagName) return false;
    var tag = t.tagName.toLowerCase();
    return tag === "input" && t.type !== "checkbox" || tag === "textarea" || tag === "select" || t.isContentEditable;
  }

  window.GameKit = { GAMES: GAMES, get: get, bestText: bestText, record: record, scope: scope, typing: typing };
})();
