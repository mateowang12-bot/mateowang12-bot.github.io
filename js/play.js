// ============================================
// 关卡引擎（play.js）—— pages/play.html 用（阶段 11）
// 打开方式：pages/play.html#level=关卡id（地图上的关卡）/ pages/play.html#daily（每日挑战）
// 要在 data/*.js、speak.js、storage.js、words-util.js、world.js 之后引入。
//
// 一关 = 若干道混合题（count 道，题型从 modes 里选：listen / match / order / guess / fill，同一题型不连续出现超过 2 次）
//       + 对话任务（modes 里有 dialogue 并且 items.dialogue 找得到；task 关通常整关就是一段对话）
//       + 限时快答（modes 里有 speed：最后 30 秒看西语选意思，Boss 关用）
// 生命值：每关 5 颗 ❤️，答错一次扣一颗（对话选错一次、快答答错一次都算一次；配对题每道最多扣一颗：第一次配错扣心，之后只闪红），扣完就失败（不给星，可以重来）。
// 星星：错 0–1 次 = 3 星，2–3 次 = 2 星，更多 = 1 星。XP 由 Progress.awardLevel 按星星给（规则在 js/storage.js 的 XP_RULES）。
// 朗读：都在点击处理函数里同步调用 speakSpanish（“开始”“继续”“检查”、点选项），iPhone 才肯出声。
// 自动测试用：window.__play（plan(levelId) 看某一关能出几道题、各是什么题型、缺什么内容）
// ============================================
(function () {
  var U = window.WordsUtil, W = window.World;
  var el = U.el;
  var HEARTS = 5, SPEED_SECONDS = 30, DEFAULT_COUNT = 8;
  var MIX_MODES = ["listen", "match", "order", "guess", "fill"];
  function P() { return window.Progress || null; }
  function $(id) { return document.getElementById(id); }
  function speak(text, queue) { if (window.speakSpanish && text) window.speakSpanish(text, queue); }
  function nav() { return window.SiteNav || null; }
  function mapUrl() { var n = nav(); return n ? n.href(n.homeFile) : "../index.html"; }
  function collectionUrl() { var n = nav(); return n ? n.href("pages/collection.html") : "collection.html"; }

  // ---------- 小工具 ----------
  function shuffle(arr, rnd) {
    var a = (arr || []).slice();
    rnd = rnd || Math.random;
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  // 拼句子的拆词规则（和 game-order.html 一样）：按空格拆，只有标点的“词”粘到旁边的词上
  var LETTER = /[0-9A-Za-zÀ-ÖØ-öø-ÿ]/;
  function tokenize(es) {
    var raw = String(es || "").trim().split(/\s+/);
    var out = [], carry = "";
    for (var i = 0; i < raw.length; i++) {
      var t = raw[i];
      if (!t) continue;
      if (!LETTER.test(t)) {
        if (out.length) out[out.length - 1] += " " + t;
        else carry += t + " ";
        continue;
      }
      out.push(carry + t);
      carry = "";
    }
    return out;
  }
  // 猜单词的规则（和 game-guess.html 一样）：重音字母当普通字母；ñ 单独算
  var LETTERS = "abcdefghijklmnñopqrstuvwxyz".split("");
  var ACCENT = { "á": "a", "à": "a", "â": "a", "ä": "a", "é": "e", "è": "e", "ê": "e", "ë": "e",
    "í": "i", "ì": "i", "î": "i", "ï": "i", "ó": "o", "ò": "o", "ô": "o", "ö": "o", "ú": "u", "ù": "u", "û": "u", "ü": "u" };
  function base(ch) { var c = String(ch || "").toLowerCase(); return ACCENT[c] || c; }
  function answerOf(es) {
    var s = String(es || "").trim().replace(/^(el|la|los|las)\s+/i, "");
    if (!/^[a-záéíóúüñ]+$/i.test(s)) return null;
    return s.length >= 3 ? s : null;
  }
  var GUESS_MAX_WRONG = 3;

  // ---------- 内容 → 题目用的条目 ----------
  // item = { kind: "word"|"phrase"|"letter"|"sentence", id, es, zh, en, emoji, speak, wrap（给 WordsUtil.pickDistractors 用）, markId }
  var allW = null, allP = null, wrapById = null;
  function globals() {
    if (allW) return;
    allW = U.collectWords();
    allP = U.collectPhrases();
    wrapById = {};
    for (var i = 0; i < allW.length; i++) wrapById[allW[i].word.id] = allW[i];
    for (var j = 0; j < allP.length; j++) wrapById[allP[j].word.id] = allP[j];
  }
  function itemOf(entry, kind) {
    var w = entry.w;
    return { kind: kind, id: w.id, es: w.es, zh: w.zh || w.en || "", en: w.en || "", emoji: w.emoji || "", speak: w.es, wrap: wrapById[w.id], markId: w.id, src: w };
  }
  function letterItem(a) {
    var L = String(a.letter);
    return { kind: "letter", id: "letter-" + L, es: L + " " + (a.lower || L.toLowerCase()), zh: L, en: "", emoji: "", speak: a.speak || a.name || L, letter: L, markLetter: L };
  }
  function label(it) {
    if (it.kind === "letter") return it.letter;
    return (it.emoji ? it.emoji + " " : "") + it.zh;
  }

  function buildPools(res) {
    globals();
    var pools = { words: [], phrases: [], letters: [], grammar: res.grammar.slice(), sentences: [], guess: [] };
    var i;
    for (i = 0; i < res.words.length; i++) pools.words.push(itemOf(res.words[i], "word"));
    for (i = 0; i < res.phrases.length; i++) pools.phrases.push(itemOf(res.phrases[i], "phrase"));
    for (i = 0; i < res.letters.length; i++) pools.letters.push(letterItem(res.letters[i]));
    // 拼句子：句子（2–7 个词），不够再用这一关单词的例句（3–7 个词）
    var seen = {};
    for (i = 0; i < pools.phrases.length; i++) {
      var ph = pools.phrases[i], tk = tokenize(ph.es);
      if (tk.length >= 2 && tk.length <= 7 && !seen[U.norm(ph.es)]) { seen[U.norm(ph.es)] = 1; pools.sentences.push({ item: ph, tokens: tk }); }
    }
    for (i = 0; i < pools.words.length; i++) {
      var w = pools.words[i], ex = w.src.example;
      if (!ex || !ex.es) continue;
      var t2 = tokenize(ex.es);
      if (t2.length < 3 || t2.length > 7 || seen[U.norm(ex.es)]) continue;
      seen[U.norm(ex.es)] = 1;
      pools.sentences.push({ item: { kind: "sentence", id: w.id + "#ex", es: ex.es, zh: ex.zh || "", en: ex.en || "", speak: ex.es, markId: w.id }, tokens: t2 });
    }
    for (i = 0; i < pools.words.length; i++) {
      var a = answerOf(pools.words[i].es);
      if (a) pools.guess.push({ item: pools.words[i], answer: a });
    }
    return pools;
  }

  // ---------- 出题 ----------
  // 干扰项：单词 / 句子用 WordsUtil.pickDistractors（不会和正确答案撞车）；字母从字母表里挑。
  // rnd：随机数（每日挑战用当天日期做种子，干扰项也跟着固定）
  function distractors(it, n, rnd) {
    if (it.kind === "letter") {
      var al = window.ALPHABET || [], out = [];
      var c = shuffle(al, rnd);
      for (var i = 0; i < c.length && out.length < n; i++) if (c[i] && c[i].letter && c[i].letter !== it.letter) out.push(letterItem(c[i]));
      return out;
    }
    if (!it.wrap) return [];
    var list = U.pickDistractors(it.wrap, it.kind === "phrase" ? allP : allW, n, rnd);
    var res = [];
    for (var j = 0; j < list.length; j++) res.push(itemOf({ w: list[j].word }, list[j].kind));
    return res;
  }
  // 从 list 里挑一个：fresh = true 只挑这一关还没出过的；false 时允许重复，但不挑上一道同题型刚出过的
  function pickOne(list, used, rnd, keyOf, fresh, last) {
    var c = [];
    for (var i = 0; i < list.length; i++) {
      var k = keyOf(list[i]);
      if (fresh ? !used[k] : k !== last) c.push(list[i]);
    }
    return c.length ? c[Math.floor(rnd() * c.length)] : null;
  }
  var MATCH_NEW = 3;    // 新的配对题里，至少要有几个这一关还没配过的词
  var MATCH_PER = 5;    // 配对题数量封顶：这一关每 5 个词（句子）最多 1 道配对题（至少 1 道）
  // ctx = { used: {题目key: 1}, last: {题型: 上一道的key}, matchN: 已出的配对题数, matchCap }
  // fresh = true：只出这一关没出过的题；false：允许重复（不和上一道同题型一样；配对题不重复出）
  function makeQuestion(mode, pools, ctx, rnd, fresh) {
    var used = ctx.used;
    function take(key, q) { used[key] = 1; ctx.last[mode] = key; return q; }
    if (mode === "listen") {
      var targets = shuffle(pools.words.concat(pools.phrases, pools.letters), rnd);
      for (var i = 0; i < targets.length; i++) {
        var k = "l:" + targets[i].id;
        if (fresh ? used[k] : k === ctx.last.listen) continue;
        var d = distractors(targets[i], 3, rnd);
        if (d.length >= 2) return take(k, { mode: "listen", target: targets[i], options: shuffle([targets[i]].concat(d), rnd) });
      }
      return null;
    }
    if (mode === "match") {
      if (!fresh || ctx.matchN >= ctx.matchCap) return null;
      // 先放没配过的，再用配过的补；彼此不能撞车
      var all = shuffle(pools.words, rnd).concat(shuffle(pools.phrases, rnd));
      var news = [], olds = [];
      for (var a = 0; a < all.length; a++) (used["m:" + all[a].id] ? olds : news).push(all[a]);
      var chosen = [], nNew = 0;
      var cand = news.concat(olds);
      for (var c2 = 0; c2 < cand.length && chosen.length < 5; c2++) {
        var ok = true;
        for (var m = 0; m < chosen.length && ok; m++) if (U.conflicts(cand[c2].src, chosen[m].src)) ok = false;
        if (ok) { chosen.push(cand[c2]); if (!used["m:" + cand[c2].id]) nNew++; }
      }
      if (chosen.length < 4 || nNew < Math.min(MATCH_NEW, chosen.length)) return null; // 凑不够新词：不出配对题（改出别的题）
      var ids = [];
      for (var q = 0; q < chosen.length; q++) { used["m:" + chosen[q].id] = 1; ids.push(chosen[q].id); }
      ctx.matchN++;
      return take("m:" + ids.sort().join(","), { mode: "match", pairs: chosen });
    }
    if (mode === "order") {
      var s = pickOne(pools.sentences, used, rnd, function (x) { return "o:" + x.item.id; }, fresh, ctx.last.order);
      return s ? take("o:" + s.item.id, { mode: "order", target: s.item, tokens: s.tokens }) : null;
    }
    if (mode === "guess") {
      var g = pickOne(pools.guess, used, rnd, function (x) { return "g:" + x.item.id; }, fresh, ctx.last.guess);
      return g ? take("g:" + g.item.id, { mode: "guess", target: g.item, answer: g.answer }) : null;
    }
    if (mode === "fill") {
      var f = pickOne(pools.grammar, used, rnd, function (x) { return "f:" + x.lesson.id + "#" + x.index; }, fresh, ctx.last.fill);
      return f ? take("f:" + f.lesson.id + "#" + f.index, { mode: "fill", ex: f.ex, lesson: f.lesson, order: shuffle(f.ex.options.map(function (o, i) { return i; }), rnd) }) : null;
    }
    return null;
  }
  function newCtx(pools) {
    var n = pools.words.length + pools.phrases.length;
    return { used: {}, last: {}, matchN: 0, matchCap: Math.max(1, Math.floor(n / MATCH_PER)) };
  }
  // 能不能出这种题（用一份新的 ctx，不影响正式出题）
  function feasible(mode, pools, rnd) {
    return !!makeQuestion(mode, pools, newCtx(pools), rnd, true);
  }

  // 配对题不要总在第一道：把配对题均匀放到这一关中间（8 道里 1 道配对 → 第 4 道），
  // 别的题保持原来的先后顺序（同题型相邻的两道本来就不一样，所以不会出现连续两道一样的题）
  function spreadMatches(qs) {
    var ms = [], rest = [];
    for (var i = 0; i < qs.length; i++) (qs[i].mode === "match" ? ms : rest).push(qs[i]);
    if (!ms.length || !rest.length) return qs;
    var n = qs.length, out = rest.slice();
    for (var k = 0; k < ms.length; k++) {
      var at = Math.max(1, Math.min(out.length, Math.round((k + 1) * n / (ms.length + 1)) - 1));
      out.splice(at, 0, ms[k]);
    }
    return out;
  }

  // 整关的计划：混合题 + 对话 + 快答
  function plan(lv, rnd) {
    rnd = rnd || Math.random;
    var res = W.resolve(lv);
    var pools = buildPools(res);
    var modes = [];
    for (var i = 0; i < lv.modes.length; i++) {
      var m = lv.modes[i];
      if (MIX_MODES.indexOf(m) !== -1 && feasible(m, pools, rnd)) modes.push(m);
    }
    var wantDialogue = lv.modes.indexOf("dialogue") !== -1;
    var dialogue = wantDialogue && res.dialogue ? prepareDialogue(res.dialogue) : null;
    var wantSpeed = lv.modes.indexOf("speed") !== -1;
    var speedPool = pools.words.concat(pools.phrases);
    var speedOk = false;
    if (wantSpeed) {
      var okN = 0;
      for (var s = 0; s < speedPool.length && okN < 2; s++) if (distractors(speedPool[s], 3, rnd).length >= 2) okN++;
      speedOk = okN >= 2;
    }
    var mixWanted = 0;
    for (var j = 0; j < lv.modes.length; j++) if (MIX_MODES.indexOf(lv.modes[j]) !== -1) mixWanted++;
    var count = lv.count || (mixWanted ? DEFAULT_COUNT : 0);
    if (!mixWanted) count = 0;
    var qs = [], uses = {};
    var ctx = newCtx(pools);
    while (qs.length < count && modes.length) {
      // 题型顺序：同一题型最多连续 2 道；用得少的题型优先（打乱后按次数排）
      var n = qs.length;
      var c = [];
      for (var a = 0; a < modes.length; a++) {
        var mm = modes[a];
        if (n >= 2 && qs[n - 1].mode === mm && qs[n - 2].mode === mm && modes.length > 1) continue;
        c.push(mm);
      }
      if (!c.length) c = modes.slice();
      c = shuffle(c, rnd);
      c.sort(function (x, y) { return (uses[x] || 0) - (uses[y] || 0); });
      // 先找“这一关没出过的题”，都出过了才允许重复（不和上一道同题型一样）；
      // 按“连续规则”排好的题型出不了时，再试全部题型（宁可连续 3 道同题型，也不要出重复的题）
      var allM = shuffle(modes, rnd);
      allM.sort(function (x, y) { return (uses[x] || 0) - (uses[y] || 0); });
      var lists = [c, allM];
      var q = null;
      for (var pass = 0; pass < 2 && !q; pass++) {
        for (var li = 0; li < lists.length && !q; li++) {
          for (var k = 0; k < lists[li].length && !q; k++) q = makeQuestion(lists[li][k], pools, ctx, rnd, pass === 0);
        }
      }
      if (!q) break;
      uses[q.mode] = (uses[q.mode] || 0) + 1;
      qs.push(q);
    }
    qs = spreadMatches(qs);
    var problems = [];
    for (var r = 0; r < res.missing.length; r++) problems.push("找不到内容 " + res.missing[r]);
    for (var t = 0; t < lv.modes.length; t++) {
      var md = lv.modes[t];
      if (MIX_MODES.indexOf(md) !== -1 && modes.indexOf(md) === -1) problems.push("题型 " + md + " 出不了题（内容不够）");
    }
    if (wantDialogue && !dialogue) problems.push("对话任务找不到对话（items.dialogue = " + (lv.items.dialogue || "空") + "）");
    if (wantSpeed && !speedOk) problems.push("限时快答需要至少 2 个单词或句子");
    if (count && qs.length < count) problems.push("只出了 " + qs.length + " / " + count + " 道混合题");
    return { questions: qs, dialogue: dialogue, speed: speedOk ? speedPool : null, pools: pools, problems: problems,
      empty: !qs.length && !dialogue && !speedOk };
  }

  // 对话：只留完整的句子（和 dialogue.html 的规则一样）
  function prepareDialogue(d) {
    var lines = [], me = 0;
    var src = (d && d.lines) || [];
    for (var i = 0; i < src.length; i++) {
      var ln = src[i];
      if (!ln || typeof ln !== "object") continue;
      if (ln.who === "them" && typeof ln.es === "string" && ln.es.trim()) lines.push(ln);
      else if (ln.who === "me") {
        var opts = [], right = 0;
        var os = ln.options || [];
        for (var j = 0; j < os.length; j++) {
          if (!os[j] || typeof os[j].es !== "string" || !os[j].es.trim()) continue;
          opts.push(os[j]);
          if (os[j].correct === true) right++;
        }
        if (!right) continue;
        lines.push({ who: "me", hintZh: ln.hintZh, hintEn: ln.hintEn, note: ln.note, options: opts });
        me++;
      }
    }
    if (!me) return null;
    return { src: d, id: d.id, lines: lines, meCount: me };
  }

  // =====================================================================
  // 运行一关
  // =====================================================================
  var S = null; // 当前这一局的状态
  var main = null, foot = null;

  function levelFromHash() {
    var h = String(location.hash || "");
    if (/^#daily\b/.test(h) || /[#&]level=daily\b/.test(h)) return W.daily();
    var m = /[#&]level=([^&#]+)/.exec(h);
    if (!m) return null;
    var id;
    try { id = decodeURIComponent(m[1]); } catch (e) { id = m[1]; }
    return W.getLevel(id);
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // 底部：反馈 + 按钮。opts = { kind: ""|"correct"|"wrong", title, body: [节点], buttons: [{ text, cls, onClick, href, disabled, id }] }
  var mainBtn = null;
  function setFoot(opts) {
    clear(foot);
    foot.className = "play-foot" + (opts.kind === "correct" ? " is-correct" : opts.kind === "wrong" ? " is-wrong" : "") +
      (!opts.title && !(opts.buttons && opts.buttons.length) ? (opts.body && opts.body.length ? " only-tip" : " is-empty") : ""); // 只有一行小提示：小屏时整条藏起来；什么都没有：藏起来
    if (opts.title || (opts.body && opts.body.length)) {
      var fb = el("div", "fb pop-in");
      fb.setAttribute("role", "status");
      if (opts.title) fb.appendChild(el("div", "fb-title", opts.title));
      if (opts.body && opts.body.length) {
        var b = el("div", "fb-body");
        for (var i = 0; i < opts.body.length; i++) if (opts.body[i]) b.appendChild(opts.body[i]);
        fb.appendChild(b);
      }
      foot.appendChild(fb);
    }
    mainBtn = null;
    var btns = opts.buttons || [];
    var wrap = el("div", btns.length > 1 ? "p-actions" : "");
    for (var j = 0; j < btns.length; j++) {
      var bd = btns[j];
      var x = el(bd.href ? "a" : "button", "btn btn-big btn-block" + (bd.cls ? " " + bd.cls : ""), bd.text);
      if (bd.href) x.href = bd.href;
      else x.type = "button";
      if (bd.id) x.id = bd.id;
      if (bd.disabled) x.disabled = true;
      if (bd.onClick) x.onclick = bd.onClick;
      wrap.appendChild(x);
      if (j === 0) mainBtn = x;
    }
    if (btns.length) foot.appendChild(wrap);
  }
  function screen(cls) {
    clear(main);
    var s = el("div", "p-screen" + (cls ? " " + cls : ""));
    main.appendChild(s);
    main.scrollTop = 0;
    return s;
  }

  // ---------- 顶部：进度条、心 ----------
  function totalSteps() {
    return S.plan.questions.length + (S.plan.dialogue ? S.plan.dialogue.meCount : 0) + (S.plan.speed ? 1 : 0);
  }
  function drawHead() {
    var tot = totalSteps() || 1;
    var fill = $("p-bar-fill");
    fill.style.width = (100 * Math.min(S.step, tot) / tot).toFixed(1) + "%";
    $("p-bar").setAttribute("aria-valuemax", String(tot));
    $("p-bar").setAttribute("aria-valuenow", String(S.step));
    $("p-bar").setAttribute("aria-label", "第 " + Math.min(S.step + 1, tot) + " 题 / 共 " + tot + " 题");
    var h = $("p-hearts");
    h.textContent = "❤️ " + S.hearts;
    h.setAttribute("aria-label", "还剩 " + S.hearts + " 颗心 / " + S.hearts + " hearts");
  }
  function loseHeart() {
    S.hearts = Math.max(0, S.hearts - 1);
    S.mistakes++;
    var h = $("p-hearts");
    h.classList.remove("lost");
    void h.offsetWidth;
    h.classList.add("lost");
    drawHead();
    return S.hearts <= 0;
  }

  // 记录答题（单词、句子 → 自动进复习；字母 → 听过）
  function mark(it, ok) {
    var p = P();
    if (!p || !it) return;
    if (it.markLetter) p.markAlphabetSeen(it.markLetter);
    else if (it.markId) p.markWord(it.markId, ok);
  }
  function addWrong(es, zh, sp) {
    for (var i = 0; i < S.wrong.length; i++) if (S.wrong[i].es === es) return;
    S.wrong.push({ es: es, zh: zh, speak: sp || es });
  }
  function sayBtn(text, labelText) { return U.sayButton(text, labelText); }

  // ---------- 开始 ----------
  function start(lv) {
    var rnd = lv.seed ? W.rng(lv.seed) : Math.random;
    S = { level: lv, plan: plan(lv, rnd), qi: -1, step: 0, hearts: HEARTS, mistakes: 0, right: 0, wrong: [], phase: "intro", q: null, timer: null };
    drawHead();
    document.title = (lv.titleZh || "闯关") + " · 我的西语学习站";
    if (S.plan.empty) return showError();
    showIntro();
  }

  function showError() {
    S.phase = "error";
    var s = screen("p-center");
    s.appendChild(el("div", "p-emoji", "🧭"));
    s.appendChild(el("div", "p-head-title", "这一关的内容还没准备好"));
    s.appendChild(el("p", "en", "This level isn't ready yet."));
    var ul = el("ul", "small-tip");
    for (var i = 0; i < S.plan.problems.length; i++) ul.appendChild(el("li", "", S.plan.problems[i]));
    s.appendChild(ul);
    setFoot({ buttons: [{ text: "回到地图 / Map", href: mapUrl() }] });
  }

  function showIntro() {
    var lv = S.level;
    S.phase = "intro";
    var s = screen("p-center");
    var reg = lv.region;
    s.appendChild(el("div", "p-emoji", lv.isDaily ? "📅" : lv.type === "boss" ? "👑" : lv.type === "task" ? "💬" : (reg && reg.emoji) || "🗺️"));
    if (reg) s.appendChild(el("div", "sheet-kicker", (reg.titleZh || "") + (reg.titleEn ? " · " + reg.titleEn : "")));
    var t = el("div", "p-head-title", lv.titleZh || "");
    if (lv.titleEn) t.appendChild(el("span", "en", lv.titleEn));
    s.appendChild(t);
    if (lv.introZh) s.appendChild(el("p", "", lv.introZh));
    if (lv.introEn) s.appendChild(el("p", "en", lv.introEn));
    var mi = el("div", "mode-icons");
    mi.style.justifyContent = "center";
    var shown = {};
    var add = function (m) {
      if (shown[m] || !W.MODE_INFO[m]) return;
      shown[m] = 1;
      mi.appendChild(el("span", "mode-icon", W.MODE_INFO[m].icon + " " + W.MODE_INFO[m].zh));
    };
    for (var i = 0; i < S.plan.questions.length; i++) add(S.plan.questions[i].mode);
    if (S.plan.dialogue) add("dialogue");
    if (S.plan.speed) add("speed");
    s.appendChild(mi);
    s.appendChild(el("p", "small-tip", "❤️ × " + HEARTS + "：答错一次少一颗心，心用完就要重来。错 0–1 次得 ⭐⭐⭐。"));
    var p = P();
    var rec = !lv.isDaily && p ? p.getLevel(lv.id) : null;
    if (rec && rec.stars) s.appendChild(el("p", "sheet-best", "最好成绩：" + stars(rec.stars) + "（正确率 " + rec.best + "%）"));
    if (lv.isDaily && p) {
      var d = p.getDaily(lv.day);
      if (d && d.done) s.appendChild(el("p", "sheet-best", "✓ 今天的奖励已经领过了，还可以再练。"));
    }
    setFoot({ buttons: [{ text: "开始 / Start ▶", id: "start-btn", onClick: function () { next(); } }] });
  }

  function stars(n) {
    var s = "";
    for (var i = 0; i < 3; i++) s += i < n ? "⭐" : "☆";
    return s;
  }

  // 下一步（在点击处理函数里调用：新题需要朗读时同步朗读）
  function next() {
    if (S.hearts <= 0) return showFail();
    S.qi++;
    if (S.qi < S.plan.questions.length) return showQuestion(S.plan.questions[S.qi]);
    if (S.plan.dialogue && !S.dialogueDone) return startDialogue();
    if (S.plan.speed && !S.speedDone) return startSpeed();
    finish();
  }

  // 题目做完：底部显示反馈 + “继续”
  // r = { ok, title?, es, zh, extra:[节点], speakText }
  function answered(r) {
    S.step++;
    drawHead();
    var body = [];
    if (r.es) {
      var line = el("div", "");
      line.appendChild(sayBtn(r.speakText || r.es, r.es));
      if (r.zh) line.appendChild(el("span", "quiz-feedback-zh", r.zh));
      body.push(line);
    }
    if (r.extra) body = body.concat(r.extra);
    if (r.ok) S.right++;
    var dead = S.hearts <= 0;
    setFoot({
      kind: r.ok ? "correct" : "wrong",
      title: r.title || (r.ok ? pickPraise() : "✘ 正确答案： / Correct answer:"),
      body: body,
      buttons: [{ text: dead ? "❤️ 用完了… / Out of hearts" : "继续 / Continue →", id: "continue-btn", onClick: function () { next(); } }]
    });
    S.phase = "feedback";
    if (mainBtn) try { mainBtn.focus(); } catch (e) {}
  }
  var PRAISE = ["✔ 太棒了！ / Great!", "✔ 答对了！ / Correct!", "✔ 很好！ / Nice!", "✔ ¡Muy bien!"];
  function pickPraise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }

  // 底部“检查”按钮
  function checkFoot(onCheck) {
    setFoot({ buttons: [{ text: "检查 / Check", id: "check-btn", disabled: true, onClick: onCheck }] });
  }
  function enableCheck(on) { if (mainBtn && mainBtn.id === "check-btn") mainBtn.disabled = !on; }

  function head(s, kind, zh, en) {
    s.appendChild(el("div", "q-kind", W.MODE_INFO[kind].icon + " " + W.MODE_INFO[kind].zh + " · " + W.MODE_INFO[kind].en));
    var t = el("div", "q-title", zh);
    if (en) t.appendChild(el("span", "en", en));
    s.appendChild(t);
  }

  function showQuestion(q) {
    S.phase = "question";
    S.q = q;
    if (q.mode === "listen") return qListen(q);
    if (q.mode === "match") return qMatch(q);
    if (q.mode === "order") return qOrder(q);
    if (q.mode === "guess") return qGuess(q);
    if (q.mode === "fill") return qFill(q);
  }

  // 选项按钮（选一个，再点“检查”）
  function optionList(s, items, render, onPick, col) {
    var wrap = el("div", "p-options" + (col ? " is-col" : ""));
    var btns = [];
    for (var i = 0; i < items.length; i++) {
      (function (it, n) {
        var b = el("button", "quiz-option");
        b.type = "button";
        b.appendChild(el("span", "quiz-option-num", String(n + 1)));
        render(b, it);
        b.onclick = function () {
          if (S.phase !== "question") return;
          for (var k = 0; k < btns.length; k++) btns[k].classList.toggle("picked", btns[k] === b);
          onPick(it, b);
        };
        btns.push(b);
        wrap.appendChild(b);
      })(items[i], i);
    }
    s.appendChild(wrap);
    return btns;
  }
  function lockOptions(btns, isRight) {
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      var r = isRight(i);
      if (r === true) btns[i].classList.add("correct");
      else if (r === false) btns[i].classList.add("wrong");
    }
  }

  // ---------- 1. 听音选 ----------
  function qListen(q) {
    var s = screen();
    var t = q.target;
    head(s, "listen", t.kind === "letter" ? "听一听，是哪个字母？" : "听一听，选出它的意思", t.kind === "letter" ? "Which letter do you hear?" : "What does it mean?");
    var play = el("button", "p-listen", "🔊");
    play.type = "button";
    play.id = "listen-btn";
    play.setAttribute("aria-label", "再听一遍 / Play again");
    play.onclick = function () { speak(t.speak); };
    s.appendChild(play);
    var picked = null;
    var btns = optionList(s, q.options, function (b, it) {
      if (it.kind === "letter") { b.classList.add("letter-opt"); b.appendChild(el("span", "", it.letter)); return; }
      if (it.emoji) b.appendChild(el("span", "opt-emoji", it.emoji));
      b.appendChild(el("span", "", it.zh));
    }, function (it) { picked = it; enableCheck(true); });
    checkFoot(function () {
      if (!picked || S.phase !== "question") return;
      var ok = picked === t;
      speak(t.speak);
      lockOptions(btns, function (i) { return q.options[i] === t ? true : q.options[i] === picked ? false : null; });
      mark(t, ok);
      if (!ok) { loseHeart(); addWrong(t.kind === "letter" ? t.letter : t.es, label(t), t.speak); }
      answered({ ok: ok, es: t.kind === "letter" ? t.letter : t.es, zh: t.kind === "letter" ? "" : label(t), speakText: t.speak });
    });
    speak(t.speak); // 这是“开始 / 继续”的点击里：同步朗读
  }

  // ---------- 2. 配对消消乐 ----------
  function qMatch(q) {
    var s = screen();
    head(s, "match", "把西语和意思配成对", "Tap a Spanish word, then its meaning");
    var board = el("div", "m-board");
    var left = el("div", "m-col"), right = el("div", "m-col");
    board.appendChild(left);
    board.appendChild(right);
    s.appendChild(board);
    var sel = null; // { side, it, btn }
    var done = 0, missed = {}, missCount = 0;
    var L = shuffle(q.pairs), R = shuffle(q.pairs);
    function card(it, side) {
      var b = el("button", "m-card" + (side === "es" ? " is-es fit-word" : ""), side === "es" ? it.es : label(it));
      b.type = "button";
      b.onclick = function () { tap(it, side, b); };
      return b;
    }
    for (var i = 0; i < L.length; i++) left.appendChild(card(L[i], "es"));
    for (var j = 0; j < R.length; j++) right.appendChild(card(R[j], "zh"));
    function tap(it, side, b) {
      if (S.phase !== "question" || b.classList.contains("done")) return;
      if (side === "es") speak(it.speak);
      if (!sel || sel.side === side) {
        if (sel) sel.btn.classList.remove("sel");
        sel = { side: side, it: it, btn: b };
        b.classList.add("sel");
        return;
      }
      var a = sel;
      sel = null;
      a.btn.classList.remove("sel");
      if (a.it === it) {
        a.btn.classList.add("done");
        b.classList.add("done");
        a.btn.disabled = true;
        b.disabled = true;
        done++;
        if (done === q.pairs.length) finishMatch();
        return;
      }
      // 配错：闪红，算一次错误（扣一颗心）
      var esIt = a.side === "es" ? a.it : it;
      missed[esIt.id] = 1;
      missCount++;
      addWrong(esIt.es, label(esIt), esIt.speak);
      [a.btn, b].forEach(function (x) {
        x.classList.remove("miss");
        void x.offsetWidth;
        x.classList.add("miss");
        setTimeout(function () { x.classList.remove("miss"); }, 600);
      });
      // 每道配对题最多扣一颗心：这题第一次配错扣心（算一次错误，影响星星），之后再配错只闪红
      if (missCount === 1 && loseHeart()) finishMatch(true);
    }
    function finishMatch(dead) {
      for (var k = 0; k < q.pairs.length; k++) mark(q.pairs[k], !missed[q.pairs[k].id]);
      var cards = board.querySelectorAll(".m-card");
      for (var c = 0; c < cards.length; c++) cards[c].disabled = true;
      var ok = !missCount;
      answered({ ok: ok, title: ok ? "✔ 全部配对！ / All matched!" : (dead ? "✘ 心用完了" : "配对完成，配错 " + missCount + " 次 / Done with " + missCount + " mistakes"),
        extra: ok ? [] : [el("div", "small-tip", "这道题扣了一颗心（每道配对题最多扣一颗）。配错的词已经放进复习里。")] });
    }
    setFoot({ title: "", buttons: [{ text: "配完全部 / Match all", id: "check-btn", disabled: true }] });
    U.fitAll(s);
  }

  // ---------- 3. 拼句子 ----------
  function qOrder(q) {
    var s = screen();
    var t = q.target;
    head(s, "order", "用西语怎么说？把词按顺序点进来", "Build the sentence");
    s.appendChild(el("div", "order-meaning", t.zh));
    if (t.en) s.appendChild(el("div", "en", t.en));
    var ans = el("div", "order-answer");
    ans.setAttribute("aria-label", "答题区 / Your answer");
    var bankBox = el("div", "order-bank");
    bankBox.setAttribute("aria-label", "可选的词 / Words");
    s.appendChild(ans);
    s.appendChild(bankBox);
    var sh = q.tokens.slice();
    for (var x = 0; x < 12; x++) { sh = shuffle(q.tokens); if (sh.join("\u0001") !== q.tokens.join("\u0001")) break; }
    var bank = sh.map(function (tx) { return { text: tx, used: false }; });
    var placed = [];
    var locked = false;
    function draw() {
      clear(ans);
      if (!placed.length) ans.appendChild(el("span", "order-empty", "点下面的词，按顺序放到这里"));
      placed.forEach(function (bi, k) {
        var b = el("button", "order-token", bank[bi].text);
        b.type = "button";
        b.disabled = locked;
        b.onclick = function () { if (locked) return; bank[placed[k]].used = false; placed.splice(k, 1); draw(); };
        ans.appendChild(b);
      });
      clear(bankBox);
      var n = 0;
      bank.forEach(function (bb, idx) {
        if (bb.used) return;
        n++;
        var b = el("button", "order-token", bb.text);
        b.type = "button";
        b.disabled = locked;
        b.onclick = function () { if (locked) return; bb.used = true; placed.push(idx); draw(); };
        bankBox.appendChild(b);
      });
      if (!n) bankBox.appendChild(el("span", "order-empty", locked ? "✔" : "词都用完了，点“检查”"));
      enableCheck(!locked && placed.length === bank.length);
    }
    checkFoot(function () {
      if (locked || placed.length !== bank.length) return;
      locked = true;
      var mine = placed.map(function (i) { return bank[i].text; });
      var ok = mine.join("\u0001") === q.tokens.join("\u0001");
      speak(t.speak);
      ans.className = "order-answer " + (ok ? "is-correct" : "is-wrong");
      draw();
      mark(t, ok);
      if (!ok) { loseHeart(); addWrong(t.es, t.zh, t.speak); }
      answered({ ok: ok, es: t.es, zh: ok ? t.zh : "", speakText: t.speak });
    });
    draw();
  }

  // ---------- 4. 猜单词 ----------
  function qGuess(q) {
    var s = screen();
    var t = q.target;
    head(s, "guess", "猜出这个词的西语", "Spell the Spanish word");
    var hint = el("div", "guess-hint", (t.emoji ? t.emoji + " " : "") + t.zh);
    s.appendChild(hint);
    if (t.en) s.appendChild(el("div", "en", t.en));
    var wordBox = el("div", "guess-word");
    wordBox.setAttribute("aria-live", "polite");
    s.appendChild(wordBox);
    var left = el("div", "guess-left");
    s.appendChild(left);
    var keys = el("div", "guess-keys");
    keys.setAttribute("role", "group");
    keys.setAttribute("aria-label", "字母键盘 / Letters");
    s.appendChild(keys);
    var guessed = {}, wrongN = 0, over = false;
    var keyBtns = {};
    LETTERS.forEach(function (Lt) {
      var b = el("button", "guess-key", Lt);
      b.type = "button";
      b.setAttribute("aria-label", "字母 " + Lt);
      b.onclick = function () { guess(Lt); };
      keyBtns[Lt] = b;
      keys.appendChild(b);
    });
    function drawWord() {
      clear(wordBox);
      var a = q.answer, n = a.length, shown = "";
      wordBox.style.setProperty("--n", String(n));
      var per = wordBox.clientWidth ? (wordBox.clientWidth - (n - 1) * 4) / n : 0;
      var fontPx = per ? Math.min(28, per * 0.95) : 0;
      for (var i = 0; i < n; i++) {
        var ch = a.charAt(i);
        var open = guessed[base(ch)] || over;
        var sp = el("span", "guess-slot" + (over && !guessed[base(ch)] ? " missed" : ""), open ? ch : "");
        if (fontPx) sp.style.fontSize = fontPx.toFixed(1) + "px";
        wordBox.appendChild(sp);
        shown += open ? ch : "_";
      }
      wordBox.setAttribute("aria-label", shown.split("").join(" "));
      // 矮屏时 CSS 藏掉括号里的说明（.gl-more），只留“猜错 1 / 3”
      left.textContent = "猜错 " + wrongN + " / " + GUESS_MAX_WRONG;
      left.appendChild(el("span", "gl-more", "（错第 " + (GUESS_MAX_WRONG + 1) + " 个就算答错）"));
    }
    function solved() {
      for (var i = 0; i < q.answer.length; i++) if (!guessed[base(q.answer.charAt(i))]) return false;
      return true;
    }
    function guess(Lt) {
      if (over || S.phase !== "question") return;
      var k = base(Lt);
      if (LETTERS.indexOf(k) === -1 || guessed[k]) return;
      guessed[k] = true;
      var hit = false;
      for (var i = 0; i < q.answer.length; i++) if (base(q.answer.charAt(i)) === k) hit = true;
      keyBtns[k].disabled = true;
      keyBtns[k].className = "guess-key " + (hit ? "hit" : "miss");
      if (!hit) wrongN++;
      var win = solved();
      if (win || wrongN > GUESS_MAX_WRONG) {
        over = true;
        for (var kk in keyBtns) if (Object.prototype.hasOwnProperty.call(keyBtns, kk)) keyBtns[kk].disabled = true;
        speak(t.speak);
        mark(t, win);
        if (!win) { loseHeart(); addWrong(t.es, label(t), t.speak); }
        drawWord();
        answered({ ok: win, title: win ? null : "✘ 没猜出来，答案是： / The answer:", es: t.es, zh: label(t), speakText: t.speak });
        return;
      }
      drawWord();
    }
    S.q.guess = guess; // 实体键盘用
    setFoot({ buttons: [{ text: "猜出整个词 / Spell it", id: "check-btn", disabled: true }] });
    drawWord();
  }

  // ---------- 5. 填空 ----------
  function qFill(q) {
    var s = screen();
    var ex = q.ex;
    head(s, "fill", "选出空格里该填的词", "Fill in the blank");
    var pr = el("div", "fill-prompt");
    var parts = String(ex.prompt).split("___");
    var blank = el("span", "gram-blank", " ");
    for (var i = 0; i < parts.length; i++) {
      if (parts[i]) pr.appendChild(document.createTextNode(parts[i]));
      if (i < parts.length - 1) pr.appendChild(i === 0 ? blank : el("span", "gram-blank", " "));
    }
    s.appendChild(pr);
    if (ex.promptZh) s.appendChild(el("div", "", ex.promptZh));
    if (ex.promptEn) s.appendChild(el("div", "en", ex.promptEn));
    var picked = -1;
    var opts = q.order;
    var btns = optionList(s, opts, function (b, oi) { b.appendChild(el("span", "", ex.options[oi])); }, function (oi) {
      picked = oi;
      blank.textContent = ex.options[oi];
      blank.className = "gram-blank filled";
      enableCheck(true);
    });
    var full = function (oi) { return String(ex.prompt).replace("___", ex.options[oi]); };
    checkFoot(function () {
      if (picked < 0 || S.phase !== "question") return;
      var ok = picked === ex.answer;
      speak(full(ex.answer));
      blank.textContent = ex.options[ex.answer];
      blank.className = "gram-blank filled " + (ok ? "is-correct" : "is-wrong");
      lockOptions(btns, function (i) { return opts[i] === ex.answer ? true : opts[i] === picked ? false : null; });
      var p = P();
      if (p && q.lesson && q.lesson.id) p.touchGrammar(q.lesson.id);
      if (!ok) { loseHeart(); addWrong(full(ex.answer), ex.promptZh || "", full(ex.answer)); }
      var extra = [];
      if (ex.explainZh) extra.push(el("div", "", "💡 " + ex.explainZh));
      answered({ ok: ok, es: full(ex.answer), zh: "", extra: extra });
    });
  }

  // ---------- 6. 对话任务 ----------
  function startDialogue() {
    S.phase = "dialogue";
    var d = S.plan.dialogue;
    var s = screen();
    var src = d.src;
    var t = el("div", "q-kind", W.MODE_INFO.dialogue.icon + " 对话任务 · " + (src.titleZh || "") + (src.partner ? " · 和 " + src.partner : ""));
    s.appendChild(t);
    // 场景说明放进聊天记录的最上面（会跟着往上滚，不长期占地方）
    var chat = el("div", "p-chat");
    var log = el("div", "chat-log");
    log.setAttribute("aria-live", "polite");
    chat.appendChild(log);
    if (src.sceneZh) log.appendChild(el("div", "small-tip p-scene", "🎬 " + src.sceneZh));
    s.appendChild(chat);
    var turn = el("div", "p-turn");
    s.appendChild(turn);
    var pos = 0, dlgRight = 0;
    setFoot({ buttons: [] }); // 对话进行中底部什么都没有（藏起来），把地方留给聊天记录和选项；规则写在“轮到你了”那一行
    function bubble(es, zh, who) {
      var row = el("div", "chat-row " + who);
      row.appendChild(el("div", "chat-who", who === "me" ? "我 / Me" : (src.partner || "对方")));
      var b = el("div", "bubble");
      var line = el("div", "bubble-es", es);
      line.appendChild(sayBtn(es, "听"));
      b.appendChild(line);
      if (zh) b.appendChild(el("div", "bubble-zh", zh));
      row.appendChild(b);
      log.appendChild(row);
      chat.scrollTop = chat.scrollHeight;
      return row;
    }
    // 聊天记录滚到最底下（对方刚说的那句要一直看得见）。
    // 选项区画出来、选错后展开说明，都会把聊天框压矮：画完以后在下一帧再滚一次
    function scrollChat() {
      chat.scrollTop = chat.scrollHeight;
      var again = function () { chat.scrollTop = chat.scrollHeight; };
      if (window.requestAnimationFrame) window.requestAnimationFrame(again);
      else setTimeout(again, 16);
    }
    function go(queue) {
      var lines = d.lines;
      while (pos < lines.length && lines[pos].who === "them") {
        bubble(lines[pos].es, lines[pos].zh, "them");
        speak(lines[pos].es, queue);
        queue = true;
        pos++;
      }
      if (pos >= lines.length) return endDialogue();
      showTurn(lines[pos]);
    }
    function showTurn(ln) {
      S.dlgLine = ln; // 当前这一轮（自动测试用）
      clear(turn);
      turn.appendChild(el("div", "chat-who", "轮到你了 / Your turn · 选错少一颗 ❤️"));
      if (ln.hintZh) turn.appendChild(el("div", "dlg-hint", ln.hintZh));
      var wrap = el("div", "quiz-options");
      var missedHere = false;
      shuffle(ln.options).forEach(function (o, n) {
        var b = el("button", "quiz-option");
        b.type = "button";
        b.appendChild(el("span", "quiz-option-num", String.fromCharCode(65 + n)));
        var txt = el("span", "quiz-option-text");
        txt.appendChild(el("span", "dlg-opt-text", o.es)); // 选项只显示西语
        b.appendChild(txt);
        b.onclick = function () {
          if (S.phase !== "dialogue") return;
          if (o.correct === true) {
            if (!missedHere) { S.right++; dlgRight++; }
            S.step++;
            drawHead();
            clear(turn);
            var row = bubble(o.es, o.zh, "me");
            if (ln.note) row.appendChild(el("div", "mini-card", "💡 " + ln.note));
            speak(o.es);
            pos++;
            go(true);
            return;
          }
          missedHere = true;
          b.classList.add("wrong");
          b.disabled = true;
          if (o.zh && !/^\s*[（(][^）)]*[）)]\s*$/.test(o.zh)) txt.appendChild(el("span", "en dlg-opt-text", o.zh));
          txt.appendChild(el("span", "dlg-why", "✘ " + (o.whyZh || "不太合适，再想想。")));
          addWrong(o.es, "✘ " + (o.whyZh || "不合适"), o.es);
          if (loseHeart()) {
            S.phase = "feedback";
            var bs = wrap.querySelectorAll("button");
            for (var i = 0; i < bs.length; i++) bs[i].disabled = true;
            setFoot({ kind: "wrong", title: "✘ 心用完了 / Out of hearts", buttons: [{ text: "继续 / Continue →", id: "continue-btn", onClick: function () { next(); } }] });
          }
          scrollChat(); // 展开了说明（底部也可能多了“继续”按钮）：聊天框变矮了，再滚一次
        };
        wrap.appendChild(b);
      });
      turn.appendChild(wrap);
      scrollChat(); // 选项区画好以后聊天框变矮了：再滚一次
    }
    function endDialogue() {
      S.dialogueDone = true;
      clear(turn);
      var p = P();
      // 记下这个对话的成绩（第一次就选对的轮数）。DIALOGUES 里的情景和 WORLD.tasks 里的任务对话都会记录
      // （任务对话不在“情景对话”页的列表里，只是多一条记录，不影响那边的完成数）
      if (p && d.id) p.recordDialogue(d.id, dlgRight, d.meCount);
      S.phase = "feedback";
      setFoot({ kind: "correct", title: "✔ 对话完成！ / Dialogue complete!", buttons: [{ text: "继续 / Continue →", id: "continue-btn", onClick: function () { next(); } }] });
    }
    go(false); // 这是点击里：对方第一句同步朗读
  }

  // ---------- 7. 限时快答 ----------
  function startSpeed() {
    S.phase = "speed";
    var pool = S.plan.speed;
    var s = screen();
    head(s, "speed", "30 秒快答：看西语选意思", "Quick! Pick the meaning");
    var leftBox = el("div", "speed-left");
    s.appendChild(leftBox);
    var bar = el("div", "speed-bar");
    var fill = el("div", "speed-bar-fill");
    bar.appendChild(fill);
    s.appendChild(bar);
    var prompt = el("div", "q-big fit-word");
    s.appendChild(prompt);
    var optBox = el("div", "");
    s.appendChild(optBox);
    var flash = el("div", "speed-flash");
    flash.setAttribute("aria-live", "polite");
    s.appendChild(flash);
    var got = 0, bad = 0, last = null;
    var endAt = Date.now() + SPEED_SECONDS * 1000;
    S.speedRemain = SPEED_SECONDS * 1000;
    setFoot({ body: [el("div", "small-tip", "答错一次少一颗心。时间到就结束。")], buttons: [] });
    function tick() {
      if (S.phase !== "speed") return;
      if (S.paused) return;
      var leftMs = Math.max(0, endAt - Date.now());
      S.speedRemain = leftMs;
      var sec = Math.ceil(leftMs / 1000);
      leftBox.textContent = "⏱️ " + sec + " 秒 · 答对 " + got;
      fill.style.width = (100 * leftMs / (SPEED_SECONDS * 1000)).toFixed(1) + "%";
      fill.classList.toggle("low", sec <= 8);
      if (leftMs <= 0) endSpeed(false);
    }
    function nextPrompt() {
      var cands = pool.filter(function (x) { return x !== last; });
      var t = cands[Math.floor(Math.random() * cands.length)] || pool[0];
      var d = distractors(t, 3, Math.random);
      if (d.length < 2) { last = t; return nextPrompt(); }
      last = t;
      S.speedTarget = t; // 当前这道（自动测试用）
      prompt.textContent = t.es;
      prompt.className = "q-big fit-word" + (t.kind === "phrase" ? " is-phrase" : "");
      clear(optBox);
      var opts = shuffle([t].concat(d));
      var wrap = el("div", "p-options");
      opts.forEach(function (o, n) {
        var b = el("button", "quiz-option");
        b.type = "button";
        b.appendChild(el("span", "quiz-option-num", String(n + 1)));
        if (o.emoji) b.appendChild(el("span", "opt-emoji", o.emoji));
        b.appendChild(el("span", "", o.zh));
        b.onclick = function () {
          if (S.phase !== "speed" || S.paused) return;
          if (o === t) {
            got++;
            S.right++;
            mark(t, true);
            flash.className = "speed-flash ok";
            flash.textContent = "✔ " + t.es + " = " + label(t);
            speak(t.speak);
          } else {
            bad++;
            mark(t, false);
            addWrong(t.es, label(t), t.speak);
            flash.className = "speed-flash bad";
            flash.textContent = "✘ " + t.es + " = " + label(t);
            if (loseHeart()) return endSpeed(true);
          }
          nextPrompt();
        };
        wrap.appendChild(b);
      });
      optBox.appendChild(wrap);
      U.fitAll(s);
    }
    function endSpeed(dead) {
      if (S.timer) { clearInterval(S.timer); S.timer = null; }
      S.speedDone = true;
      S.step++;
      drawHead();
      S.phase = "feedback";
      var bs = optBox.querySelectorAll("button");
      for (var i = 0; i < bs.length; i++) bs[i].disabled = true;
      setFoot({ kind: dead ? "wrong" : "correct", title: dead ? "✘ 心用完了 / Out of hearts" : "⏱️ 时间到！答对 " + got + " 题，答错 " + bad + " 题",
        buttons: [{ text: "继续 / Continue →", id: "continue-btn", onClick: function () { next(); } }] });
    }
    S.speedResume = function () { endAt = Date.now() + S.speedRemain; };
    nextPrompt();
    tick();
    S.timer = setInterval(tick, 200);
  }

  // ---------- 结束：失败 / 过关 ----------
  function accuracy() {
    var tot = S.right + S.mistakes;
    return tot ? Math.round(100 * S.right / tot) : 100;
  }
  function starsFor(mistakes) { return mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1; }

  function showFail() {
    S.phase = "fail";
    if (S.timer) { clearInterval(S.timer); S.timer = null; }
    var lv = S.level, p = P();
    if (!lv.isDaily && p) p.recordLevel(lv.id, 0, accuracy());
    var s = screen("p-center");
    s.appendChild(el("div", "p-emoji", "💔"));
    s.appendChild(el("div", "p-head-title", "心用完了，再试一次吧！"));
    s.appendChild(el("p", "en", "Out of hearts — give it another try!"));
    s.appendChild(el("p", "", "没关系，答错的词已经放进复习里。这次不给星星，可以马上重来。"));
    reviewList(s);
    setFoot({ buttons: [
      { text: "🔁 再试一次 / Try again", id: "retry-btn", onClick: function () { start(lv); next(); } },
      { text: "回到地图 / Map", cls: "btn-light", href: mapUrl() }
    ] });
  }

  function reviewList(s) {
    if (!S.wrong.length) return;
    // 可以折叠的错题回顾：屏幕够高时默认展开，矮屏时先收起（点一下展开），结算页一屏放得下
    var box = el("details", "p-review");
    if ((window.innerHeight || 0) >= 800) box.open = true;
    box.appendChild(el("summary", "", "📝 错题回顾（" + S.wrong.length + "）/ Review"));
    var ul = el("ul", "");
    for (var i = 0; i < S.wrong.length; i++) {
      var li = el("li", "");
      li.appendChild(sayBtn(S.wrong[i].speak, S.wrong[i].es));
      if (S.wrong[i].zh) li.appendChild(document.createTextNode(" " + S.wrong[i].zh));
      ul.appendChild(li);
    }
    box.appendChild(ul);
    s.appendChild(box);
  }

  function finish() {
    S.phase = "result";
    var lv = S.level, p = P();
    var st = starsFor(S.mistakes);
    var acc = accuracy();
    var gained = 0, extraStars = 0, stampNew = false, dailyFirst = false;
    if (p) {
      if (lv.isDaily) {
        var dr = p.recordDaily(lv.day);
        dailyFirst = dr.first;
        if (dr.first) { gained += dr.xp ? dr.xp.gained : 0; extraStars = p.DAILY_STARS; }
      } else {
        p.recordLevel(lv.id, st, acc);
        var xr = p.awardLevel(lv.id, st);
        gained += xr ? xr.gained : 0;
        if (lv.type === "boss" && lv.region) stampNew = p.addStamp(lv.region.id);
      }
    }
    var s = screen("p-center");
    s.appendChild(el("div", "p-head-title", lv.isDaily ? "每日挑战完成！🎉" : "过关！🎉"));
    var stBox = el("div", "p-stars");
    stBox.setAttribute("aria-label", st + " 颗星 / " + st + " stars");
    for (var i = 0; i < 3; i++) stBox.appendChild(el("span", i < st ? "on" : "", "⭐"));
    if (!lv.isDaily) s.appendChild(stBox);
    s.appendChild(el("div", "small-tip", "答错 " + S.mistakes + " 次 · 正确率 " + acc + "% · 剩下 ❤️ " + S.hearts));
    var gain = el("div", "p-gain");
    if (gained) gain.appendChild(el("span", "", "+" + gained + " XP"));
    if (extraStars) gain.appendChild(el("span", "", "+" + extraStars + " ⭐"));
    if (gain.firstChild) s.appendChild(gain);
    if (lv.isDaily && !dailyFirst) s.appendChild(el("p", "small-tip", "今天的奖励已经领过了（每天一次），明天再来！"));
    if (lv.type === "boss" && lv.region) {
      var reg = lv.region;
      if (stampNew) s.appendChild(el("div", "p-stamp pop-in", "🎉 获得护照邮票：" + (reg.emoji ? reg.emoji + " " : "") + (reg.stampZh || reg.titleZh || "") + (reg.stampEn ? " / " + reg.stampEn : "")));
      else s.appendChild(el("p", "small-tip", "这枚护照邮票你已经有了 ✓"));
    }
    var chests = p ? p.chestsAvailable() : 0;
    if (chests > 0) {
      var a = el("a", "btn btn-light btn-small", "🎁 你有 " + chests + " 个宝箱可以打开 →");
      a.id = "chest-link";
      a.href = collectionUrl();
      var pc = el("p", "");
      pc.appendChild(a);
      s.appendChild(pc);
    }
    reviewList(s);
    var btns = [];
    var nx = lv.isDaily ? null : W.nextLevel(lv);
    if (nx && W.isUnlocked(nx)) btns.push({ text: "下一关 / Next level →", id: "next-level-btn", href: "play.html#level=" + encodeURIComponent(nx.id) });
    btns.push({ text: "回到地图 / Map", cls: btns.length ? "btn-light" : "", id: "map-btn", href: mapUrl() });
    setFoot({ buttons: btns });
  }

  // ---------- 中途退出：页面内确认（不用 confirm 弹窗） ----------
  function busy() { return S && (S.phase === "question" || S.phase === "feedback" || S.phase === "dialogue" || S.phase === "speed"); }
  function askExit(ev) {
    if (!busy()) return; // 还没开始 / 已经结束：直接回地图
    if (ev) ev.preventDefault();
    if (S.phase === "speed") S.paused = true;
    var back = el("div", "sheet-back");
    back.id = "exit-sheet";
    var sh = el("div", "sheet");
    sh.setAttribute("role", "dialog");
    sh.setAttribute("aria-modal", "true");
    sh.setAttribute("aria-label", "退出关卡 / Quit");
    sh.appendChild(el("div", "sheet-title", "要退出这一关吗？"));
    sh.appendChild(el("p", "", "现在退出，这一关的进度不会保存（已经答过的词照常记进复习）。"));
    sh.appendChild(el("p", "en", "If you quit now, this level's progress won't be saved."));
    var acts = el("div", "sheet-actions");
    var stay = el("button", "btn", "继续闯关 / Keep going");
    stay.type = "button";
    stay.id = "exit-stay";
    stay.onclick = function () {
      if (back.parentNode) back.parentNode.removeChild(back);
      if (S.phase === "speed" && S.paused) { S.paused = false; if (S.speedResume) S.speedResume(); }
    };
    var quit = el("a", "btn btn-light", "退出 / Quit");
    quit.href = mapUrl();
    quit.id = "exit-quit";
    acts.appendChild(stay);
    acts.appendChild(quit);
    sh.appendChild(acts);
    back.appendChild(sh);
    back.onclick = function (e) { if (e.target === back) stay.onclick(); };
    document.body.appendChild(back);
    try { stay.focus(); } catch (e2) {}
  }

  // ---------- 键盘（电脑）：1–4 选选项，回车 = 检查 / 继续，字母 = 猜单词 ----------
  function onKey(ev) {
    if (!S || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if ($("exit-sheet")) { if (ev.key === "Escape") $("exit-stay").click(); return; }
    var k = ev.key || "";
    if (k === "Enter") {
      if (mainBtn && !mainBtn.disabled && document.activeElement !== mainBtn) { ev.preventDefault(); mainBtn.click(); }
      return;
    }
    if (S.phase === "question" && S.q && S.q.mode === "guess" && S.q.guess && k.length === 1 && LETTERS.indexOf(base(k)) !== -1) {
      ev.preventDefault();
      S.q.guess(k);
      return;
    }
    if (/^[1-9]$/.test(k) && (S.phase === "question" || S.phase === "speed")) {
      var opts = main.querySelectorAll(".p-options .quiz-option");
      var b = opts[Number(k) - 1];
      if (b && !b.disabled) { ev.preventDefault(); b.click(); }
    }
  }

  // ---------- 启动 ----------
  function init() {
    main = $("p-main");
    foot = $("p-foot");
    if (S && S.timer) { clearInterval(S.timer); S.timer = null; }
    var ex = $("exit-sheet");
    if (ex && ex.parentNode) ex.parentNode.removeChild(ex);
    var lv = levelFromHash();
    if (!lv) {
      S = { level: null, plan: { questions: [], problems: [] }, step: 0, hearts: HEARTS, phase: "error" };
      var s = screen("p-center");
      s.appendChild(el("div", "p-emoji", "🗺️"));
      s.appendChild(el("div", "p-head-title", "没有找到这一关"));
      s.appendChild(el("p", "en", "Level not found."));
      setFoot({ buttons: [{ text: "回到地图 / Map", href: mapUrl() }] });
      return;
    }
    if (!lv.isDaily && !W.isUnlocked(lv)) {
      S = { level: lv, plan: { questions: [], problems: [] }, step: 0, hearts: HEARTS, phase: "error" };
      var s2 = screen("p-center");
      s2.appendChild(el("div", "p-emoji", "🔒"));
      s2.appendChild(el("div", "p-head-title", "这一关还没解锁"));
      s2.appendChild(el("p", "", "先过前面的关卡（至少 1 颗星）就能解锁。"));
      setFoot({ buttons: [{ text: "回到地图 / Map", href: mapUrl() }] });
      return;
    }
    start(lv);
  }

  window.addEventListener("hashchange", init);
  document.addEventListener("keydown", onKey);
  var close = $("p-close");
  if (close) close.addEventListener("click", askExit);
  init();

  // 给自动测试用
  window.__play = {
    plan: function (id) {
      var lv = id === "daily" ? W.daily() : W.getLevel(id);
      if (!lv) return null;
      var pl = plan(lv, lv.seed ? W.rng(lv.seed) : Math.random);
      var key = function (q) {
        if (q.mode === "listen") return "l:" + q.target.id;
        if (q.mode === "match") return "m:" + q.pairs.map(function (x) { return x.id; }).sort().join(",");
        if (q.mode === "order" || q.mode === "guess") return q.mode.charAt(0) + ":" + q.target.id;
        if (q.mode === "fill") return "f:" + q.lesson.id + "#" + q.ex.prompt;
        return q.mode;
      };
      return { id: lv.id, count: lv.count, modes: lv.modes, questions: pl.questions.map(function (q) { return q.mode; }),
        keys: pl.questions.map(key), matchCap: newCtx(pl.pools).matchCap,
        dialogue: pl.dialogue ? pl.dialogue.meCount : 0, speed: !!pl.speed, problems: pl.problems, empty: pl.empty };
    },
    state: function () { return S; },
    tokenize: tokenize,
    answerOf: answerOf,
    starsFor: starsFor
  };
})();
