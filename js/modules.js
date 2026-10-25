// ============================================
// 学习模块清单 + 进度小字 + “继续学习”推荐（modules.js）—— window.Modules
// 首页（index.html）、学习页（pages/learn.html）、我的页（pages/me.html）共用。
// 要在 data/*.js 和 js/storage.js 之后引入（用到 window.Progress 和学习内容）。
//
//   Modules.href(rel)          网站根目录下的相对路径 → 完整地址（例如 "pages/words.html"）。
//                              根目录按本文件的位置算（js/modules.js 的上一层），首页和子页面都能用。
//   Modules.LIST               9 个模块 [{ id, icon, zh, en, url, group, available(), progress(), desc() }]
//   Modules.GROUPS             学习页的 3 组 [{ id, zh, en, ids }]
//   Modules.get(id)            取一个模块
//   Modules.isAvailable(m)     模块现在能不能点（AI 对话只在 Claude 版可用）
//   Modules.stats()            各种数字（已掌握单词 / 句子、语法 / 情景完成数、待复习、今天学了几个词、游戏局数…）
//   Modules.recommend()        “继续学习”推荐 → { id, icon, kicker, title, titleEn, desc:[中,英], btn, url, progress?, alt:[{ text, url }] }
//                              推荐顺序：字母没学过（而且还没学过任何词）→ 待复习 ≥ 8（不算今天刚学的“学习中”的词）→ 第一个没全部掌握的单词课 → 第一组没全部掌握的句子
//                              → 第一课没完成的语法 → 第一个没完成的情景对话 → 全部学过：有待复习就复习，否则玩游戏
//   Modules.REVIEW_MIN         待复习多少个才优先推荐复习（8）
// 打开指定的课：words.html#lesson=课的id、phrases.html#group=组的id、grammar.html#lesson=课的id、dialogue.html#scene=情景id
// （用 # 而不用 ?：本地 file://、GitHub Pages、claude.ai 外壳的 iframe 里都可靠，也不会影响离线缓存）
// ============================================
(function () {
  var REVIEW_MIN = 8;

  // 根目录：本文件 js/modules.js 的上一层
  var me = document.currentScript;
  var src = me && me.src ? String(me.src) : "";
  var ROOT = src ? src.replace(/[?#].*$/, "").replace(/js\/modules\.js$/, "") : "";
  function href(rel) {
    return ROOT ? ROOT + rel : rel;
  }

  function P() { return window.Progress || null; }

  // ---------- 内容 id ----------
  function wordLessons() { return window.WORD_LESSONS || []; }
  function phraseGroups() { return window.PHRASE_LESSONS || []; }
  function grammarLessons() {
    var out = [], ls = window.GRAMMAR_LESSONS || [];
    for (var i = 0; i < ls.length; i++) if (ls[i]) out.push(ls[i]);
    return out;
  }
  function dialogueList() {
    var out = [], ds = window.DIALOGUES || [];
    for (var i = 0; i < ds.length; i++) if (ds[i] && ds[i].id) out.push(ds[i]);
    return out;
  }
  function idsOfLesson(ls, field) {
    var ids = [], arr = (ls && ls[field]) || [];
    for (var i = 0; i < arr.length; i++) if (arr[i] && arr[i].id) ids.push(arr[i].id);
    return ids;
  }
  function allWordIds() {
    var ids = [], ls = wordLessons();
    for (var i = 0; i < ls.length; i++) ids = ids.concat(idsOfLesson(ls[i], "words"));
    return ids;
  }
  function allPhraseIds() {
    var ids = [], gs = phraseGroups();
    for (var i = 0; i < gs.length; i++) ids = ids.concat(idsOfLesson(gs[i], "phrases"));
    return ids;
  }
  var GAME_IDS = ["match", "speed", "order", "guess"];

  // ---------- 数字 ----------
  function startOfToday() {
    var d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }
  function stats() {
    var p = P();
    var wIds = allWordIds(), pIds = allPhraseIds();
    var g = grammarLessons(), d = dialogueList();
    var s = {
      wordsTotal: wIds.length, phrasesTotal: pIds.length,
      grammarTotal: g.length, dialoguesTotal: d.length,
      wordsMastered: 0, phrasesMastered: 0, grammarDone: 0, dialoguesDone: 0,
      seen: 0, due: 0, dueOld: 0, todayItems: 0, gamesPlays: 0, firstGotIt: false
    };
    if (!p) return s;
    s.wordsMastered = p.masteredCount(wIds);
    s.phrasesMastered = p.masteredCount(pIds);
    for (var i = 0; i < g.length; i++) {
      var gr = g[i].id ? p.getGrammar(g[i].id) : null;
      if (gr && gr.done) s.grammarDone++;
    }
    for (var j = 0; j < d.length; j++) {
      var dr = p.getDialogue ? p.getDialogue(d[j].id) : null;
      if (dr && dr.done) s.dialoguesDone++;
    }
    var c = p.wordCounts(wIds.concat(pIds));
    s.seen = c.seen;
    s.due = c.due;
    // 今天学过的词和句子（今天点过“记住了 / 还不熟”、复习过、测验里答过）
    var st = p.load();
    var t0 = startOfToday();
    for (var id in st.words) {
      if (!Object.prototype.hasOwnProperty.call(st.words, id)) continue;
      var r = st.words[id];
      if (r.lastSeen >= t0) s.todayItems++;
      if (r.correct > 0) s.firstGotIt = true;
    }
    // 推荐“复习”用的待复习数：不算今天刚学、还在“学习中”的词（免得刚学完一课就被推荐去复习）
    var all = wIds.concat(pIds);
    for (var q = 0; q < all.length; q++) {
      var rw = st.words[all[q]];
      if (!rw || !p.isDue(all[q])) continue;
      if (rw.lastSeen >= t0 && rw.box < p.MASTERED_BOX) continue;
      s.dueOld++;
    }
    for (var k = 0; k < GAME_IDS.length; k++) {
      var gm = p.getGame ? p.getGame(GAME_IDS[k]) : null;
      if (gm) s.gamesPlays += gm.plays;
    }
    return s;
  }

  // ---------- 每个模块的说明和进度小字（原来写在首页里） ----------
  function alphabetDesc() {
    var n = (window.ALPHABET || []).length;
    return n ? [n + " 个字母，点一下听发音", n + " letters — tap to hear each one"]
             : ["西语字母，点一下听发音", "Spanish letters — tap to listen"];
  }
  function wordsDesc() {
    var n = allWordIds().length;
    return n ? [n + " 个常用词，翻卡片记忆", n + " common words on flip cards"]
             : ["常用词，翻卡片记忆", "Common words on flip cards"];
  }
  function phrasesDesc() {
    var n = allPhraseIds().length, g = phraseGroups().length;
    return n ? [g + " 组 " + n + " 句生活常用句，点读跟说", n + " everyday phrases in " + g + " groups"]
             : ["生活常用句，点读跟说", "Everyday phrases to listen and repeat"];
  }
  function grammarDesc() {
    var n = grammarLessons().length;
    return n ? [n + " 课入门语法 + 练习", n + " beginner lessons with practice"]
             : ["入门语法 + 练习", "Beginner grammar with practice"];
  }
  function dialogueDesc() {
    var n = dialogueList().length;
    return n ? [n + " 个生活情景，一句一句练说话", n + " everyday scenes to practise speaking"]
             : ["生活情景，一句一句练说话", "Everyday scenes to practise speaking"];
  }

  function alphabetProgress() {
    var p = P();
    if (!p) return "";
    var a = p.alphabetInfo();
    var total = (window.ALPHABET || []).length;
    if (!a.seen) return "还没开始";
    return "已学过 ✓" + (total ? "（听过 " + Math.min(a.letters, total) + " / " + total + " 个）" : "");
  }
  function wordsProgress() {
    var p = P();
    if (!p) return "";
    var ids = allWordIds();
    return "已掌握 " + p.masteredCount(ids) + " / " + ids.length;
  }
  function phrasesProgress() {
    var p = P();
    var ids = allPhraseIds();
    if (!p || !ids.length) return "";
    return "已掌握 " + p.masteredCount(ids) + " / " + ids.length;
  }
  function quizProgress() {
    var p = P();
    if (!p || !p.lastQuiz) return "";
    var q = p.lastQuiz();
    if (!q) return "还没做过";
    return "上次得分 " + q.score + " / " + q.total;
  }
  function grammarProgress() {
    var p = P();
    if (!p) return "";
    var s = stats();
    return "完成 " + s.grammarDone + " / " + s.grammarTotal + " 课";
  }
  function reviewProgress() {
    var p = P();
    if (!p) return "";
    var c = p.wordCounts(allWordIds().concat(allPhraseIds()));
    if (!c.seen) return "先去学几个单词";
    return "待复习 " + c.due + " 个";
  }
  function dialogueProgress() {
    var p = P();
    var d = dialogueList();
    if (!p || !d.length) return "";
    return "完成 " + stats().dialoguesDone + " / " + d.length + " 个";
  }
  function gamesProgress() {
    var p = P();
    if (!p || !p.getGame) return "";
    var n = stats().gamesPlays;
    return n ? "玩过 " + n + " 局" : "还没玩过";
  }
  function always() { return true; }
  function claudeOnly() { return !!(window.getClaude && window.getClaude()); }
  function fixed(zh, en) { return function () { return [zh, en]; }; }

  var LIST = [
    { id: "alphabet", icon: "🔤", zh: "字母与发音", en: "Alphabet & Pronunciation", url: "pages/alphabet.html", group: "learn", available: always, progress: alphabetProgress, desc: alphabetDesc },
    { id: "words",    icon: "📇", zh: "单词卡片",   en: "Word Cards",               url: "pages/words.html",    group: "learn", available: always, progress: wordsProgress,    desc: wordsDesc },
    { id: "phrases",  icon: "💬", zh: "日常句子",   en: "Everyday Phrases",         url: "pages/phrases.html",  group: "learn", available: always, progress: phrasesProgress,  desc: phrasesDesc },
    { id: "grammar",  icon: "📐", zh: "基础语法",   en: "Basic Grammar",            url: "pages/grammar.html",  group: "learn", available: always, progress: grammarProgress,  desc: grammarDesc },
    { id: "review",   icon: "🔁", zh: "复习",       en: "Review",                   url: "pages/review.html",   group: "practice", available: always, progress: reviewProgress,
      desc: fixed("优先复习不熟的词和句子", "Words and phrases you don't know well come first") },
    { id: "quiz",     icon: "✅", zh: "小测验",     en: "Quiz",                     url: "pages/quiz.html",     group: "practice", available: always, progress: quizProgress,
      desc: fixed("看词选意思，检验学会没有", "Pick the right meaning to check what you've learned") },
    { id: "dialogue", icon: "🎭", zh: "情景对话",   en: "Dialogues",                url: "pages/dialogue.html", group: "practice", available: always, progress: dialogueProgress, desc: dialogueDesc },
    { id: "chat",     icon: "🤖", zh: "AI 对话",    en: "Chat with AI",             url: "pages/chat.html",     group: "practice", available: claudeOnly,
      lockedText: "只在 Claude 版可用",
      desc: fixed("用简单的西语和 AI 老师聊天，写错了温和地帮你改", "Chat in simple Spanish; the AI gently corrects you") },
    { id: "games",    icon: "🎮", zh: "小游戏",     en: "Games",                    url: "pages/games.html",    group: "relax", available: always, progress: gamesProgress,
      desc: fixed("翻牌配对、60 秒快答、拼句子、猜单词", "Memory match, speed quiz, sentence builder, word guess") }
  ];
  var GROUPS = [
    { id: "learn", zh: "学习", en: "Learn", ids: ["alphabet", "words", "phrases", "grammar"] },
    { id: "practice", zh: "练习", en: "Practice", ids: ["review", "quiz", "dialogue", "chat"] },
    { id: "relax", zh: "放松一下", en: "Take a break", ids: ["games"] }
  ];

  function get(id) {
    for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i];
    return null;
  }
  function isAvailable(m) {
    try { return !!(m && m.available && m.available()); } catch (e) { return false; }
  }

  // ---------- “继续学习”推荐 ----------
  // 第一个“没有全部掌握”的课（单词课 / 句子组）→ { index, lesson, done, learning, total } 或 null
  function firstUnmastered(lessons, field) {
    var p = P();
    for (var i = 0; i < lessons.length; i++) {
      var ids = idsOfLesson(lessons[i], field);
      if (!ids.length) continue;
      var done = p ? p.masteredCount(ids) : 0;
      if (done < ids.length) {
        return { index: i, lesson: lessons[i], done: done, learning: p && p.learningCount ? p.learningCount(ids) : 0, total: ids.length };
      }
    }
    return null;
  }
  // 往下学的内容（不管字母和复习）：单词 → 句子 → 语法 → 情景对话；全部学过 → null
  function nextLesson() {
    var p = P();
    var w = firstUnmastered(wordLessons(), "words");
    if (w) {
      var started = w.done > 0 || w.learning > 0;
      return {
        id: "words", icon: "📇", kicker: "单词卡片 · 第 " + (w.index + 1) + " 课",
        title: w.lesson.titleZh || "单词", titleEn: w.lesson.titleEn || "Word Cards",
        desc: started ? ["已掌握 " + w.done + " / " + w.total + " 个，继续把这一课学完", "Keep going — finish this lesson"]
                      : ["这一课有 " + w.total + " 个新词，翻卡片记一记", w.total + " new words on flip cards"],
        btn: started ? "继续学习" : "开始这一课",
        url: "pages/words.html#lesson=" + encodeURIComponent(w.lesson.id || ""),
        progress: { done: w.done, total: w.total },
        short: "单词：" + (w.lesson.titleZh || "")
      };
    }
    var ph = firstUnmastered(phraseGroups(), "phrases");
    if (ph) {
      return {
        id: "phrases", icon: "💬", kicker: "日常句子 · 第 " + (ph.index + 1) + " 组",
        title: ph.lesson.titleZh || "日常句子", titleEn: ph.lesson.titleEn || "Everyday Phrases",
        desc: ["已掌握 " + ph.done + " / " + ph.total + " 句，点 🔊 跟着说", "Listen and repeat"],
        btn: ph.done || ph.learning ? "继续学习" : "开始这一组",
        url: "pages/phrases.html#group=" + encodeURIComponent(ph.lesson.id || ""),
        progress: { done: ph.done, total: ph.total },
        short: "句子：" + (ph.lesson.titleZh || "")
      };
    }
    var g = grammarLessons();
    for (var i = 0; i < g.length; i++) {
      var gr = p && g[i].id ? p.getGrammar(g[i].id) : null;
      if (!(gr && gr.done)) {
        return {
          id: "grammar", icon: "📐", kicker: "基础语法 · 第 " + (i + 1) + " 课",
          title: g[i].titleZh || "基础语法", titleEn: g[i].titleEn || "Grammar",
          desc: ["先看讲解，再做几道练习", "Read, then practise"],
          btn: "开始这一课",
          url: "pages/grammar.html#lesson=" + encodeURIComponent(g[i].id || ""),
          short: "语法：" + (g[i].titleZh || "")
        };
      }
    }
    var d = dialogueList();
    for (var j = 0; j < d.length; j++) {
      var dr = p && p.getDialogue ? p.getDialogue(d[j].id) : null;
      if (!(dr && dr.done)) {
        return {
          id: "dialogue", icon: "🎭", kicker: "情景对话 · 第 " + (j + 1) + " 个",
          title: d[j].titleZh || "情景对话", titleEn: d[j].titleEn || "Dialogues",
          desc: ["和对方一句一句聊下去，练习开口说", "Talk step by step"],
          btn: "开始练习",
          url: "pages/dialogue.html#scene=" + encodeURIComponent(d[j].id),
          short: "情景对话"
        };
      }
    }
    return null;
  }

  function recommend() {
    var p = P();
    var s = stats();
    var main = null;
    var a = p ? p.alphabetInfo() : { seen: false };
    var next = nextLesson();
    // 字母：从没打开过字母页、而且还没学过任何单词 / 句子时才推荐（学过词以后字母只放在备选里）
    if (!a.seen && !s.seen) {
      main = {
        id: "alphabet", icon: "🔤", kicker: "第一步", title: "字母与发音", titleEn: "Alphabet & Pronunciation",
        desc: ["从字母开始：点一下字母，听它怎么读", "Start with the letters — tap to listen"],
        btn: "开始学字母", url: "pages/alphabet.html"
      };
    } else if (s.dueOld >= REVIEW_MIN) {
      main = {
        id: "review", icon: "🔁", kicker: "复习", title: "有 " + s.dueOld + " 个词该复习了", titleEn: s.dueOld + " items to review",
        desc: ["趁还记得，花几分钟巩固一下", "A few minutes now helps you remember"],
        btn: "开始复习", url: "pages/review.html"
      };
    } else if (next) {
      main = next;
    } else if (s.due > 0) {
      main = {
        id: "review", icon: "🔁", kicker: "全部学过了 🎉", title: "复习 " + s.due + " 个词", titleEn: "Review",
        desc: ["内容都学过了！复习一下，记得更牢", "You've covered everything — keep it fresh"],
        btn: "开始复习", url: "pages/review.html"
      };
    } else {
      main = {
        id: "games", icon: "🎮", kicker: "全部学过了 🎉", title: "玩一局小游戏", titleEn: "Play a game",
        desc: ["今天没有要复习的，轻松玩一局吧", "Nothing to review — have some fun"],
        btn: "去玩游戏", url: "pages/games.html"
      };
    }
    // 备选（最多 2 个）
    var alt = [];
    if (main.id !== "review" && s.due > 0) alt.push({ text: "复习 " + s.due + " 个词", url: href("pages/review.html") });
    if (next && main.id !== next.id) alt.push({ text: next.short, url: href(next.url) });
    if (!a.seen && main.id !== "alphabet") alt.unshift({ text: "字母与发音", url: href("pages/alphabet.html") });
    if (alt.length < 2 && main.id !== "games") alt.push({ text: "玩一局游戏", url: href("pages/games.html") });
    main.alt = alt.slice(0, 2);
    main.url = href(main.url);
    return main;
  }

  window.Modules = {
    REVIEW_MIN: REVIEW_MIN,
    LIST: LIST,
    GROUPS: GROUPS,
    href: href,
    get: get,
    isAvailable: isAvailable,
    stats: stats,
    recommend: recommend,
    allWordIds: allWordIds,
    allPhraseIds: allPhraseIds
  };
})();
