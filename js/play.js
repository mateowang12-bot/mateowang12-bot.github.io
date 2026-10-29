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
  // 朗读：语速用“我的”页的设置；opts.rate 可以临时指定（🐢 慢速再听用 "slower"）
  function speak(text, queue, opts) { if (window.speakSpanish && text) window.speakSpanish(text, queue, null, opts); }
  function nav() { return window.SiteNav || null; }
  // 音效 + 触感（js/sfx.js）、吉祥物（js/mascot.js）：没有加载到也不影响闯关
  function sfx(name) { try { if (window.Sfx && window.Sfx[name]) window.Sfx[name](); } catch (e) {} }
  function mascot(mood, cls) { return window.Mascot ? window.Mascot.el(mood, cls) : null; }
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
    // src：保留原始数据（背单词关的字母卡片要显示字母名、读法说明、例词）
    return { kind: "letter", id: "letter-" + L, es: L + " " + (a.lower || L.toLowerCase()), zh: L, en: "", emoji: "", speak: a.speak || a.name || L, letter: L, markLetter: L, src: a };
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
    // 背单词关：没有考题，只有卡片 + 3 道不扣心的小练习
    if (lv.type === "learn") {
      var lp = learnPlan(lv, pools);
      var probs = [];
      for (var mi = 0; mi < res.missing.length; mi++) probs.push("找不到内容 " + res.missing[mi]);
      return { questions: [], dialogue: null, speed: null, pools: pools, problems: probs, learn: lp, empty: !lp.cards.length };
    }
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

  // 底部：反馈 + 按钮。opts = { kind: ""|"correct"|"wrong", title, body: [节点], mascot: 表情, buttons: [{ text, cls, onClick, href, disabled, id }] }
  // 答对 / 答错时是一整条绿色 / 红色的反馈条（从下面弹上来），左边是吉祥物（开心 / 鼓励的表情）
  var mainBtn = null;
  function setFoot(opts) {
    clear(foot);
    foot.className = "play-foot" + (opts.kind === "correct" ? " is-correct" : opts.kind === "wrong" ? " is-wrong" : "") +
      (!opts.title && !(opts.buttons && opts.buttons.length) ? (opts.body && opts.body.length ? " only-tip" : " is-empty") : ""); // 只有一行小提示：小屏时整条藏起来；什么都没有：藏起来
    if (opts.title || (opts.body && opts.body.length)) {
      var fb = el("div", "fb pop-in");
      fb.setAttribute("role", "status");
      var mm = opts.mascot ? mascot(opts.mascot, opts.kind === "wrong" ? "shake" : "hop") : null;
      if (mm) { fb.className += " has-mascot"; fb.appendChild(mm); }
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
    if (S.plan.learn) return S.plan.learn.cards.length + S.plan.learn.checks.length;
    return S.plan.questions.length + (S.plan.dialogue ? S.plan.dialogue.meCount : 0) + (S.plan.speed ? 1 : 0);
  }
  function drawHead() {
    var tot = totalSteps() || 1;
    var fill = $("p-bar-fill");
    fill.style.width = (100 * Math.min(S.step, tot) / tot).toFixed(1) + "%";
    $("p-bar").setAttribute("aria-valuemax", String(tot));
    $("p-bar").setAttribute("aria-valuenow", String(S.step));
    $("p-bar").setAttribute("aria-label", "第 " + Math.min(S.step + 1, tot) + " 题，共 " + tot + " 题");
    var h = $("p-hearts");
    clear(h);
    h.appendChild(el("span", "hh", "❤️")).setAttribute("aria-hidden", "true");
    h.appendChild(document.createTextNode(String(S.hearts)));
    h.setAttribute("aria-label", "还剩 " + S.hearts + " 颗心");
    drawCombo(false);
  }
  // 连胜：连续答对几次（答错就清零）。连续 2 次以上才显示 🔥 n
  function drawCombo(bump) {
    var c = $("p-combo");
    if (!c) return;
    var n = S.combo || 0;
    c.hidden = n < 2;
    c.textContent = "🔥" + n;
    c.setAttribute("aria-label", "连续答对 " + n + " 次");
    if (bump && n >= 2) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
  }
  function hit(ok) {
    S.combo = ok ? (S.combo || 0) + 1 : 0;
    drawCombo(ok);
    if (ok) {
      var bar = $("p-bar");
      bar.classList.remove("shine");
      void bar.offsetWidth;
      bar.classList.add("shine");
    }
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

  // =====================================================================
  // 背单词关（type "learn"，阶段 12）：“学”，不是“考”
  //   一张一张的大卡片：大 emoji、西语、中文、例句（有的话）；显示时自动读一遍（在“开始 / 下一个”的点击里同步朗读）；
  //   🔊 再听、🐢 慢速、“下一个”。最后 3 道很简单的“听一听，选意思”小确认：答错不扣心，只告诉你正确答案。
  //   没有心，不会失败；不给星星，学完一次地图上标 ✅“学过了”；XP 每天第一次学完给一点（Progress.awardLearn）。
  //   字母卡片：大字母 + 字母名 + 读法说明 + 例词（可以点读）；没有 emoji 的单词：圆牌里放去掉冠词后的第一个字母；句子：💬。
  //   看过的词只记成“见过”（Progress.touchWord：放进复习，但不会直接算掌握）。
  // =====================================================================
  var LEARN_CHECKS = 3;
  function learnPlan(lv, pools) {
    var cards = pools.words.concat(pools.phrases, pools.letters).slice(0, 8);
    var checks = [];
    var pool = cards.filter(function (c) { return c.kind !== "letter"; });
    if (pool.length >= 3) {
      var order = shuffle(pool);
      for (var i = 0; i < Math.min(LEARN_CHECKS, order.length); i++) {
        var t = order[i];
        // 干扰项只从这一关刚学的词里挑（很简单），不和正确答案撞车
        var others = shuffle(pool.filter(function (x) { return x !== t && x.zh !== t.zh && !U.conflicts(x.src, t.src); })).slice(0, 2);
        if (others.length < 2) continue;
        checks.push({ target: t, options: shuffle([t].concat(others)) });
      }
    }
    return { cards: cards, checks: checks };
  }
  function startLearn() {
    S.phase = "learn";
    S.cardIdx = -1;
    nextCard();
  }
  function nextCard() {
    var L = S.plan.learn;
    S.cardIdx++;
    if (S.cardIdx >= L.cards.length) return startLearnCheck(0);
    S.phase = "learn";
    var c = L.cards[S.cardIdx];
    S.card = c;
    var s = screen("p-learn");
    s.appendChild(el("div", "q-kind", "📖 背单词 · 第 " + (S.cardIdx + 1) + " / " + L.cards.length + " 个"));
    var card = el("div", "learn-card pop-in");
    // 有 emoji 就放大 emoji；没有（字母、句子、部分单词）就放一个彩色圆牌，里面是大字母（字母关）或西语的第一个字母
    var emo = c.emoji || (c.kind === "phrase" || c.kind === "sentence" ? "💬" : "");
    if (emo) card.appendChild(el("div", "learn-emoji", emo)).setAttribute("aria-hidden", "true");
    else if (c.kind !== "letter") {
      // 去掉冠词（el / la / los / las / un / una）再取第一个字母
      var bare = String(c.es).replace(/^[¿¡\s]+/, "").replace(/^(el|la|los|las|un|una)\s+/i, "");
      card.appendChild(el("div", "learn-badge kind-" + c.kind, (bare.charAt(0) || "?").toUpperCase())).setAttribute("aria-hidden", "true");
    }
    card.appendChild(el("div", "learn-es fit-word" + (c.kind === "phrase" ? " is-phrase" : ""), c.kind === "letter" ? c.es : c.es));
    if (c.kind !== "letter") card.appendChild(el("div", "learn-zh", c.zh));
    if (c.kind === "letter" && c.src) {
      // 字母：字母名（例如 eñe）+ 读法说明
      if (c.src.name) card.appendChild(el("div", "learn-zh", "读作 “" + c.src.name + "”"));
      if (c.src.soundZh) card.appendChild(el("div", "learn-sound", c.src.soundZh));
    }
    var ex = c.src && c.src.example;
    if (ex && ex.es) {
      var exBox = el("div", "learn-ex");
      exBox.appendChild(el("div", "learn-ex-label", c.kind === "letter" ? "例词" : "例句"));
      exBox.appendChild(sayBtn(ex.es, ex.es));
      if (ex.zh) exBox.appendChild(el("div", "learn-ex-zh", ex.zh));
      card.appendChild(exBox);
    }
    s.appendChild(card);
    var row = el("div", "p-listen-row learn-row");
    var play = el("button", "p-listen");
    play.type = "button";
    play.id = "listen-btn";
    play.setAttribute("aria-label", "再听一遍");
    play.onclick = function () { speak(c.speak); };
    row.appendChild(play);
    var slow = el("button", "p-slow", "🐢");
    slow.type = "button";
    slow.id = "slow-btn";
    slow.title = "慢速再听";
    slow.setAttribute("aria-label", "慢速再听");
    slow.onclick = function () { speak(c.speak, false, { rate: "slower" }); };
    row.appendChild(slow);
    s.appendChild(row);
    if (window.Mascot && window.Mascot.decorate) window.Mascot.decorate(s);
    // 记成“见过”（不算掌握）
    var p = P();
    if (p && c.markId && p.touchWord) p.touchWord(c.markId);
    if (p && c.markLetter) p.markAlphabetSeen(c.markLetter);
    S.step = S.cardIdx + 1;
    drawHead();
    U.fitAll(s);
    var last = S.cardIdx === L.cards.length - 1;
    setFoot({ buttons: [{ text: last ? (L.checks.length ? "学完了，做个小练习 →" : "学完了 →") : "下一个 →", id: "next-card-btn", onClick: function () { nextCard(); } }] });
    speak(c.speak); // 在“开始 / 下一个”的点击里：同步朗读
    if (window.Mascot && window.Mascot.watch) window.Mascot.watch(play);
  }
  function startLearnCheck(i) {
    var L = S.plan.learn;
    if (i >= L.checks.length) return finish();
    S.phase = "question";
    var q = L.checks[i];
    S.q = { mode: "learncheck", target: q.target, options: q.options };
    var s = screen();
    s.appendChild(el("div", "q-kind", "📖 小练习 · 答错不扣心"));
    s.appendChild(el("div", "q-title", "听一听，选出它的意思"));
    var row = el("div", "p-listen-row");
    var play = el("button", "p-listen");
    play.type = "button";
    play.id = "listen-btn";
    play.setAttribute("aria-label", "再听一遍");
    play.onclick = function () { speak(q.target.speak); };
    row.appendChild(play);
    var slow2 = el("button", "p-slow", "🐢");
    slow2.type = "button";
    slow2.id = "slow-btn";
    slow2.title = "慢速再听";
    slow2.setAttribute("aria-label", "慢速再听");
    slow2.onclick = function () { speak(q.target.speak, false, { rate: "slower" }); };
    row.appendChild(slow2);
    s.appendChild(row);
    if (window.Mascot && window.Mascot.decorate) window.Mascot.decorate(row);
    var picked = null;
    var btns = optionList(s, q.options, function (b, it) {
      if (it.emoji) b.appendChild(el("span", "opt-emoji", it.emoji));
      b.appendChild(el("span", "", it.zh));
    }, function (it) { picked = it; enableCheck(true); }, longest(q.options, function (o) { return o.zh; }) > LONG_OPTION);
    checkFoot(function () {
      if (!picked || S.phase !== "question") return;
      var ok = picked === q.target;
      speak(q.target.speak);
      lockOptions(btns, function (k) { return q.options[k] === q.target ? true : q.options[k] === picked ? false : null; });
      if (ok) S.right++;
      S.step++;
      drawHead();
      hit(ok);
      sfx(ok ? "correct" : "wrong");
      var line = el("div", "");
      line.appendChild(sayBtn(q.target.speak, q.target.es));
      line.appendChild(el("span", "quiz-feedback-zh", label(q.target)));
      setFoot({ kind: ok ? "correct" : "wrong", mascot: ok ? "happy" : "cheer", title: ok ? pickPraise() : "没关系，记住它：",
        body: [line], buttons: [{ text: "继续 →", id: "continue-btn", onClick: function () { startLearnCheck(i + 1); } }] });
      S.phase = "feedback";
      S.learnNext = i + 1;
      if (mainBtn) try { mainBtn.focus(); } catch (e) {}
    });
    speak(q.target.speak);
    if (window.Mascot && window.Mascot.watch) window.Mascot.watch(play);
  }

  // ---------- 开始 ----------
  function start(lv) {
    var rnd = lv.seed ? W.rng(lv.seed) : Math.random;
    S = { level: lv, plan: plan(lv, rnd), qi: -1, step: 0, hearts: HEARTS, mistakes: 0, right: 0, wrong: [], phase: "intro", q: null, timer: null, combo: 0 };
    var hearts = $("p-hearts");
    if (hearts) hearts.hidden = lv.type === "learn"; // 背单词关没有心
    drawHead();
    document.title = (lv.titleZh || "闯关") + " · 我的西语学习站";
    if (S.plan.empty) return showError();
    showIntro();
  }

  function showError() {
    S.phase = "error";
    var s = screen("p-center");
    var m0 = mascot("think", "bob");
    if (m0) s.appendChild(m0);
    else s.appendChild(el("div", "p-emoji", "🧭"));
    s.appendChild(el("div", "p-head-title", "这一关的内容还没准备好"));
    var ul = el("ul", "small-tip");
    for (var i = 0; i < S.plan.problems.length; i++) ul.appendChild(el("li", "", S.plan.problems[i]));
    s.appendChild(ul);
    setFoot({ buttons: [{ text: "回到地图", href: mapUrl() }] });
  }

  function showIntro() {
    var lv = S.level;
    S.phase = "intro";
    var s = screen("p-center");
    var reg = lv.region;
    var badge = lv.isDaily ? "📅" : lv.type === "boss" ? "👑" : lv.type === "task" ? "💬" : lv.type === "learn" ? "📖" : lv.type === "review" ? "🔁" : (reg && reg.emoji) || "🗺️";
    if (reg) s.appendChild(el("div", "sheet-kicker", reg.titleZh || ""));
    var t = el("div", "p-head-title");
    var pb = el("span", "p-badge", (lv.isDaily || lv.type !== "normal" || !reg || !window.Icons) ? badge : "");
    if (!pb.textContent && reg && window.Icons) pb.appendChild(window.Icons.el(window.Icons.region(reg.id)));
    t.appendChild(pb).setAttribute("aria-hidden", "true");
    t.appendChild(document.createTextNode(" " + (lv.titleZh || "")));
    s.appendChild(t);
    // 吉祥物 + 说话气泡（关卡简介）
    var say = lv.introZh || (lv.type === "boss" ? "大关！把这一站学的都用上，加油！" : "准备好了吗？我们出发吧！");
    var hero = el("div", "p-intro-hero");
    var m1 = mascot("hello", "bob");
    if (m1) hero.appendChild(m1);
    hero.appendChild(el("div", "speech", say));
    s.appendChild(hero);
    var mi = el("div", "mode-icons");
    mi.style.justifyContent = "center";
    var shown = {};
    var add = function (m) {
      if (shown[m] || !W.MODE_INFO[m]) return;
      shown[m] = 1;
      mi.appendChild(el("span", "mode-icon", W.MODE_INFO[m].icon + " " + W.MODE_INFO[m].zh));
    };
    if (S.plan.learn) mi.appendChild(el("span", "mode-icon", "📖 背单词 " + S.plan.learn.cards.length + " 个"));
    for (var i = 0; i < S.plan.questions.length; i++) add(S.plan.questions[i].mode);
    if (S.plan.dialogue) add("dialogue");
    if (S.plan.speed) add("speed");
    s.appendChild(mi);
    s.appendChild(el("p", "small-tip", S.plan.learn ? "先看、先听，没有心，不会失败。" + (S.plan.learn.checks.length ? "学完做 " + S.plan.learn.checks.length + " 道小练习（答错不扣心）。" : "") + "背单词关不算星星，学完会标上 ✅。" :
      "❤️ × " + HEARTS + "：答错一次少一颗心，心用完就要重来。错 0–1 次得 ⭐⭐⭐。"));
    var p = P();
    var rec = !lv.isDaily && p ? p.getLevel(lv.id) : null;
    if (rec && rec.stars) s.appendChild(el("p", "sheet-best", "最好成绩：" + stars(rec.stars) + "（正确率 " + rec.best + "%）"));
    if (lv.isDaily && p) {
      var d = p.getDaily(lv.day);
      if (d && d.done) s.appendChild(el("p", "sheet-best", "✓ 今天的奖励已经领过了，还可以再练。"));
    }
    setFoot({ buttons: [{ text: "开始 ▶", id: "start-btn", onClick: function () { next(); } }] });
  }

  function stars(n) {
    var s = "";
    for (var i = 0; i < 3; i++) s += i < n ? "⭐" : "☆";
    return s;
  }

  // 下一步（在点击处理函数里调用：新题需要朗读时同步朗读）
  function next() {
    if (S.plan.learn) return S.phase === "intro" ? startLearn() : finish();
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
    hit(r.ok);
    sfx(r.ok ? "correct" : (dead ? "fail" : "wrong"));
    setFoot({
      kind: r.ok ? "correct" : "wrong",
      title: r.title || (r.ok ? pickPraise() : pickOops()),
      body: body,
      mascot: r.ok ? "happy" : "cheer",
      buttons: [{ text: dead ? "❤️ 用完了…" : "继续 →", id: "continue-btn", onClick: function () { next(); } }]
    });
    S.phase = "feedback";
    if (mainBtn) try { mainBtn.focus(); } catch (e) {}
  }
  var PRAISE = ["太棒了！", "答对了！", "真厉害！", "¡Muy bien!"];
  function pickPraise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }
  // 答错：鼓励一下 + 正确答案（下面的 body 里显示）
  function pickOops() { return "差一点！正确答案："; }

  // 底部“检查”按钮
  function checkFoot(onCheck) {
    setFoot({ buttons: [{ text: "检查", id: "check-btn", disabled: true, onClick: onCheck }] });
  }
  function enableCheck(on) { if (mainBtn && mainBtn.id === "check-btn") mainBtn.disabled = !on; }

  function head(s, kind, zh) {
    s.appendChild(el("div", "q-kind", W.MODE_INFO[kind].icon + " " + W.MODE_INFO[kind].zh));
    var t = el("div", "q-title", zh);
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
  // 选项里最长的文字超过 5 个字：这一题的选项排成一列（两列时长句会被挤成一行两三个字）
  var LONG_OPTION = 5;
  function longest(list, textOf) {
    var n = 0;
    for (var i = 0; i < list.length; i++) n = Math.max(n, String(textOf(list[i]) || "").length);
    return n;
  }
  function optionList(s, items, render, onPick, col) {
    if (items.length === 3) col = true; // 3 个选项：排成一列（不要剩一个单独的大卡）
    var wrap = el("div", "p-options" + (col ? " is-col" : ""));
    wrap.style.setProperty("--rows", String(col ? items.length : Math.ceil(items.length / 2))); // CSS 用它给选项区封顶高度
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
    head(s, "listen", t.kind === "letter" ? "听一听，是哪个字母？" : "听一听，选出它的意思");
    // 大播放按钮（卡通小喇叭，图案由 js/mascot.js 装上）+ 旁边的 🐢“慢速再听”（用“很慢”档再读一遍）
    var row = el("div", "p-listen-row");
    var play = el("button", "p-listen");
    play.type = "button";
    play.id = "listen-btn";
    play.setAttribute("aria-label", "再听一遍");
    play.onclick = function () { speak(t.speak); };
    row.appendChild(play);
    var slow = el("button", "p-slow", "🐢");
    slow.type = "button";
    slow.id = "slow-btn";
    slow.title = "慢速再听";
    slow.setAttribute("aria-label", "慢速再听");
    slow.onclick = function () { speak(t.speak, false, { rate: "slower" }); };
    row.appendChild(slow);
    s.appendChild(row);
    if (window.Mascot && window.Mascot.decorate) window.Mascot.decorate(row);
    var picked = null;
    var btns = optionList(s, q.options, function (b, it) {
      if (it.kind === "letter") { b.classList.add("letter-opt"); b.appendChild(el("span", "", it.letter)); return; }
      if (it.emoji) b.appendChild(el("span", "opt-emoji", it.emoji));
      b.appendChild(el("span", "", it.zh));
    }, function (it) { picked = it; enableCheck(true); }, longest(q.options, function (o) { return o.kind === "letter" ? o.letter : o.zh; }) > LONG_OPTION);
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
    if (window.Mascot && window.Mascot.watch) window.Mascot.watch(play); // 自动朗读时大喇叭也动起来
  }

  // ---------- 2. 配对消消乐 ----------
  function qMatch(q) {
    var s = screen();
    head(s, "match", "把西语和意思配成对");
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
        a.btn.classList.add("got");
        b.classList.add("got");
        done++;
        if (done < q.pairs.length) sfx("ding");
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
      if (missCount === 1 && loseHeart()) { finishMatch(true); return; }
      sfx("wrong");
    }
    function finishMatch(dead) {
      for (var k = 0; k < q.pairs.length; k++) mark(q.pairs[k], !missed[q.pairs[k].id]);
      var cards = board.querySelectorAll(".m-card");
      for (var c = 0; c < cards.length; c++) cards[c].disabled = true;
      var ok = !missCount;
      answered({ ok: ok, title: ok ? "✔ 全部配对！" : (dead ? "✘ 心用完了" : "配对完成，配错 " + missCount + " 次"),
        extra: ok ? [] : [el("div", "small-tip", "这道题扣了一颗心（每道配对题最多扣一颗）。配错的词已经放进复习里。")] });
    }
    setFoot({ title: "", buttons: [{ text: "配完全部", id: "check-btn", disabled: true }] });
    U.fitAll(s);
  }

  // ---------- 3. 拼句子 ----------
  function qOrder(q) {
    var s = screen();
    var t = q.target;
    head(s, "order", "用西语怎么说？把词按顺序点进来");
    s.appendChild(el("div", "order-meaning", t.zh));
    var ans = el("div", "order-answer");
    ans.setAttribute("aria-label", "答题区");
    var bankBox = el("div", "order-bank");
    bankBox.setAttribute("aria-label", "可选的词");
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

  // ---------- 4. 猜单词（阶段 12：用手机自带的键盘输入整个单词） ----------
  // 屏幕上是一个大输入框（不再是字母键盘），上面一排字母格 _ _ _ _ 显示单词有几个字母，打一个字母就填进一格。
  // 比较答案：不分大小写、去掉首尾空格；重音符号和 ñ 不打也算对（答对条上提醒正确写法）；题目本来带冠词的，冠词打不打都行。
  // 💡 提示：显示首字母；用了提示，这一关最多 2 星。按“检查”或键盘回车提交；答错扣一颗心，显示正确答案。
  // iPhone：在“开始 / 继续”的点击里同步渲染并 focus()，键盘才会弹出来；弹出后用 visualViewport 让题目、输入框、“检查”都在可见区域。
  var ARTICLES = /^(el|la|los|las|un|una|unos|unas)\s+/i;
  function plainOf(s) {
    // 小写、去掉首尾空格、多个空格变一个；去掉重音（ñ 也当 n）
    var t = String(s || "").toLowerCase().trim().replace(/\s+/g, " ");
    try { t = t.normalize("NFD").replace(/[̀-ͯ]/g, ""); } catch (e) {
      t = t.replace(/[áàâä]/g, "a").replace(/[éèêë]/g, "e").replace(/[íìîï]/g, "i").replace(/[óòôö]/g, "o").replace(/[úùûü]/g, "u").replace(/ñ/g, "n");
    }
    return t.replace(/[¿?¡!.,]/g, "");
  }
  function exactOf(s) { return String(s || "").toLowerCase().trim().replace(/\s+/g, " ").replace(/[¿?¡!.,]/g, ""); }
  // → { ok, exact }：ok = 算对（宽松），exact = 连重音 / ñ 都打对了
  function judgeGuess(input, answer, full) {
    var tries = [answer];
    if (full && full !== answer) tries.push(full);
    var inPlain = plainOf(input).replace(ARTICLES, ""), inExact = exactOf(input).replace(ARTICLES, "");
    for (var i = 0; i < tries.length; i++) {
      var t = tries[i];
      if (plainOf(t).replace(ARTICLES, "") === inPlain) return { ok: true, exact: exactOf(t).replace(ARTICLES, "") === inExact };
    }
    return { ok: false, exact: false };
  }
  // 正确写法里有重音 / ñ 的字母（提醒用）
  function accentNote(word) {
    var m = String(word).match(/[áéíóúüñÁÉÍÓÚÜÑ]/g);
    if (!m) return "";
    var seen = {}, parts = [];
    for (var i = 0; i < m.length; i++) {
      var ch = m[i].toLowerCase();
      if (seen[ch]) continue;
      seen[ch] = 1;
      parts.push(ch === "ñ" ? "ñ 上有小波浪" : ch === "ü" ? "ü 上有两点" : ch + " 上有重音");
    }
    return "正确写法是 " + word + "，注意 " + parts.join("、") + "。";
  }
  function qGuess(q) {
    var s = screen("p-guess");
    var t = q.target;
    head(s, "guess", "用西语拼出这个词");
    s.appendChild(el("div", "guess-hint", (t.emoji ? t.emoji + " " : "") + t.zh));
    var wordBox = el("div", "guess-word");
    wordBox.setAttribute("aria-hidden", "true");
    s.appendChild(wordBox);
    var input = el("input", "text-input guess-input");
    input.type = "text";
    input.id = "guess-input";
    input.setAttribute("autocapitalize", "off");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("spellcheck", "false");
    input.setAttribute("lang", "es");
    input.setAttribute("inputmode", "text");
    input.setAttribute("enterkeyhint", "done");
    input.setAttribute("aria-label", "输入西语单词（" + q.answer.length + " 个字母）");
    input.placeholder = "在这里打字";
    var row = el("div", "guess-input-row");
    row.appendChild(input);
    var hintBtn = el("button", "btn btn-light guess-hint-btn", "💡 提示");
    hintBtn.type = "button";
    hintBtn.id = "hint-btn";
    hintBtn.title = "显示首字母（这一关最多 2 星）";
    row.appendChild(hintBtn);
    s.appendChild(row);
    s.appendChild(el("div", "small-tip guess-tip", "iPhone：长按字母可以打出 á é í ó ú ñ"));
    var hinted = false, over = false;
    function drawSlots() {
      clear(wordBox);
      var a = q.answer, n = a.length;
      var typed = plainOf(input.value).replace(ARTICLES, "").replace(/\s/g, "");
      var raw = String(input.value || "").trim().replace(ARTICLES, "").replace(/\s/g, "");
      wordBox.style.setProperty("--n", String(n));
      var per = wordBox.clientWidth ? (wordBox.clientWidth - (n - 1) * 4) / n : 0;
      var fontPx = per ? Math.min(28, per * 0.95) : 0;
      for (var i = 0; i < n; i++) {
        var ch = over ? a.charAt(i) : (raw.charAt(i) || (hinted && i === 0 ? a.charAt(0) : ""));
        var sp = el("span", "guess-slot" + (over && typed.charAt(i) !== plainOf(a.charAt(i)) ? " missed" : "") + (!over && hinted && i === 0 && !raw.charAt(0) ? " hinted" : ""), ch);
        if (fontPx) sp.style.fontSize = fontPx.toFixed(1) + "px";
        wordBox.appendChild(sp);
      }
    }
    input.addEventListener("input", function () {
      drawSlots();
      enableCheck(!over && !!input.value.trim());
    });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        ev.stopPropagation(); // 不再让全局的回车处理再点一次
        if (mainBtn && mainBtn.id === "check-btn" && !mainBtn.disabled) mainBtn.click();
      }
    });
    hintBtn.onclick = function () {
      if (over || hinted) return;
      hinted = true;
      S.hintUsed = true;
      hintBtn.disabled = true;
      hintBtn.textContent = "💡 首字母：" + q.answer.charAt(0);
      drawSlots();
      try { input.focus(); } catch (e) {}
    };
    checkFoot(function () {
      if (over || S.phase !== "question" || !input.value.trim()) return;
      over = true;
      var j = judgeGuess(input.value, q.answer, t.es);
      speak(t.speak); // 点“检查”的点击里：同步朗读
      input.readOnly = true;
      hintBtn.disabled = true;
      try { input.blur(); } catch (e) {}
      mark(t, j.ok);
      if (!j.ok) { loseHeart(); addWrong(t.es, label(t), t.speak); }
      drawSlots();
      var extra = [];
      if (j.ok && !j.exact) {
        var note = accentNote(q.answer);
        if (note) extra.push(el("div", "accent-note", "✍️ " + note));
      }
      answered({ ok: j.ok, title: j.ok ? null : "✘ 不对哦，正确答案是：", es: t.es, zh: label(t), speakText: t.speak, extra: extra });
    });
    S.q.input = input; // 自动测试用
    drawSlots();
    // 在“开始 / 继续”的点击里同步 focus：iPhone 才会弹出键盘（做不到也没关系，用户点输入框就行）
    try { input.focus({ preventScroll: true }); } catch (e) { try { input.focus(); } catch (e2) {} }
  }

  // ---------- 键盘弹出时（iPhone / 安卓）：整页高度跟着可见区域走，题目、输入框、“检查”都在键盘上面 ----------
  var vvBound = false;
  function applyViewport(h, top) {
    var root = document.documentElement;
    if (!h) { root.style.removeProperty("--vvh"); root.style.removeProperty("--vvt"); root.classList.remove("kb-open"); root.classList.remove("vv-set"); return; }
    root.style.setProperty("--vvh", Math.round(h) + "px");
    root.style.setProperty("--vvt", Math.round(top || 0) + "px");
    root.classList.add("vv-set");
    root.classList.toggle("kb-open", h < (window.innerHeight || h) * 0.8);
  }
  function bindViewport() {
    if (vvBound || !window.visualViewport) return;
    vvBound = true;
    var vv = window.visualViewport;
    var upd = function () {
      var full = Math.abs(vv.height - window.innerHeight) < 2 && vv.offsetTop < 1;
      applyViewport(full ? 0 : vv.height, vv.offsetTop);
      if (!full) try { window.scrollTo(0, 0); } catch (e) {}
    };
    vv.addEventListener("resize", upd);
    vv.addEventListener("scroll", upd);
  }
  bindViewport();

  // ---------- 5. 填空 ----------
  function qFill(q) {
    var s = screen();
    var ex = q.ex;
    head(s, "fill", "选出空格里该填的词");
    var pr = el("div", "fill-prompt");
    var parts = String(ex.prompt).split("___");
    var blank = el("span", "gram-blank", " ");
    for (var i = 0; i < parts.length; i++) {
      if (parts[i]) pr.appendChild(document.createTextNode(parts[i]));
      if (i < parts.length - 1) pr.appendChild(i === 0 ? blank : el("span", "gram-blank", " "));
    }
    s.appendChild(pr);
    if (ex.promptZh) s.appendChild(el("div", "", ex.promptZh));
    var picked = -1;
    var opts = q.order;
    var fillCol = longest(ex.options, function (o) { return o; }) > 9; // 填空的选项是西语，字母比汉字窄：超过 9 个字母才排一列
    var btns = optionList(s, opts, function (b, oi) { b.appendChild(el("span", "", ex.options[oi])); }, function (oi) {
      picked = oi;
      blank.textContent = ex.options[oi];
      blank.className = "gram-blank filled";
      enableCheck(true);
    }, fillCol);
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
      row.appendChild(el("div", "chat-who", who === "me" ? "我" : (src.partner || "对方")));
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
    var sayToken = 0; // 每选对一次 +1：补读时确认还是同一轮
    function go(queue) {
      var lines = d.lines, said = [];
      while (pos < lines.length && lines[pos].who === "them") {
        bubble(lines[pos].es, lines[pos].zh, "them");
        speak(lines[pos].es, queue);
        said.push(lines[pos].es);
        queue = true;
        pos++;
      }
      if (pos >= lines.length) endDialogue();
      else showTurn(lines[pos]);
      return said; // 对方这次说的话（选对后补读用）
    }
    function synthBusy() {
      try { var ss = window.speechSynthesis; return !!(ss && (ss.speaking || ss.pending)); } catch (e) { return false; }
    }
    function showTurn(ln) {
      S.dlgLine = ln; // 当前这一轮（自动测试用）
      clear(turn);
      turn.appendChild(el("div", "chat-who", "轮到你了 · 选错少一颗 ❤️"));
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
            hit(!missedHere);
            sfx("correct");
            S.step++;
            drawHead();
            clear(turn);
            var row = bubble(o.es, o.zh, "me");
            if (ln.note) row.appendChild(el("div", "mini-card", "💡 " + ln.note));
            var token = ++sayToken, reply = [];
            // 先读我这句，对方的话排在后面接着读。
            // 有的浏览器（Windows 上的 Chrome / Edge）会把排队的句子弄丢：我这句读完后如果什么都没在读，就补读对方的话
            if (window.speakSpanish) window.speakSpanish(o.es, false, function () {
              setTimeout(function () {
                if (token !== sayToken || synthBusy() || !reply.length) return;
                reply.forEach(function (t, k) { speak(t, k > 0); });
              }, 150);
            });
            pos++;
            reply = go(true);
            return;
          }
          missedHere = true;
          b.classList.add("wrong");
          b.disabled = true;
          if (o.zh && !/^\s*[（(][^）)]*[）)]\s*$/.test(o.zh)) txt.appendChild(el("span", "muted dlg-opt-zh", o.zh));
          txt.appendChild(el("span", "dlg-why", "✘ " + (o.whyZh || "不太合适，再想想。")));
          addWrong(o.es, "✘ " + (o.whyZh || "不合适"), o.es);
          hit(false);
          var deadNow = loseHeart();
          sfx(deadNow ? "fail" : "wrong");
          if (deadNow) {
            S.phase = "feedback";
            var bs = wrap.querySelectorAll("button");
            for (var i = 0; i < bs.length; i++) bs[i].disabled = true;
            setFoot({ kind: "wrong", title: "心用完了…", mascot: "cheer", buttons: [{ text: "继续 →", id: "continue-btn", onClick: function () { next(); } }] });
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
      setFoot({ kind: "correct", title: "对话完成！", mascot: "happy", buttons: [{ text: "继续 →", id: "continue-btn", onClick: function () { next(); } }] });
    }
    go(false); // 这是点击里：对方第一句同步朗读
  }

  // ---------- 7. 限时快答 ----------
  function startSpeed() {
    S.phase = "speed";
    var pool = S.plan.speed;
    var s = screen();
    head(s, "speed", "30 秒快答：看西语选意思");
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
      var spCol = longest(opts, function (o) { return o.zh; }) > LONG_OPTION || opts.length === 3;
      var wrap = el("div", "p-options" + (spCol ? " is-col" : ""));
      wrap.style.setProperty("--rows", String(spCol ? opts.length : Math.ceil(opts.length / 2)));
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
            hit(true);
            sfx("correct");
          } else {
            bad++;
            mark(t, false);
            addWrong(t.es, label(t), t.speak);
            flash.className = "speed-flash bad";
            flash.textContent = "✘ " + t.es + " = " + label(t);
            hit(false);
            if (loseHeart()) { sfx("fail"); return endSpeed(true); }
            sfx("wrong");
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
      setFoot({ kind: dead ? "wrong" : "correct", mascot: dead ? "cheer" : "happy", title: dead ? "心用完了…" : "⏱️ 时间到！答对 " + got + " 题，答错 " + bad + " 题",
        buttons: [{ text: "继续 →", id: "continue-btn", onClick: function () { next(); } }] });
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
    var mf = mascot("sad", "bob"); // 心用完：难过 / 可惜
    if (mf) s.appendChild(mf);
    else s.appendChild(el("div", "p-emoji", "💔"));
    s.appendChild(el("div", "p-head-title", "心用完了，再试一次吧！"));
    s.appendChild(el("p", "", "没关系，答错的词已经放进复习里。这次不给星星，可以马上重来。"));
    reviewList(s);
    setFoot({ buttons: [
      { text: "🔁 再试一次", id: "retry-btn", onClick: function () { start(lv); next(); } },
      { text: "回到地图", cls: "btn-light", href: mapUrl() }
    ] });
  }

  function reviewList(s) {
    if (!S.wrong.length) return;
    // 可以折叠的错题回顾：屏幕够高时默认展开，矮屏时先收起（点一下展开），结算页一屏放得下
    var box = el("details", "p-review");
    if ((window.innerHeight || 0) >= 800) box.open = true;
    box.appendChild(el("summary", "", "📝 错题回顾（" + S.wrong.length + "）"));
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
    if (S.phase === "result") return; // 已经结算过了：不再结算一次（也不再放音效）
    S.phase = "result";
    var lv = S.level, p = P();
    var st = starsFor(S.mistakes);
    if (S.hintUsed) st = Math.min(st, 2); // 猜单词用了“提示”：最多 2 星
    var acc = accuracy();
    var gained = 0, extraStars = 0, stampNew = false, dailyFirst = false;
    if (p) {
      if (lv.isDaily) {
        var dr = p.recordDaily(lv.day);
        dailyFirst = dr.first;
        if (dr.first) { gained += dr.xp ? dr.xp.gained : 0; extraStars = p.DAILY_STARS; }
      } else {
        // 背单词关：不给星星（记一次“学过了”），XP 每天第一次学完给一点（Progress.awardLearn）
        p.recordLevel(lv.id, lv.type === "learn" ? 0 : st, acc);
        var xr = lv.type === "learn" ? (p.awardLearn ? p.awardLearn(lv.id) : null) : p.awardLevel(lv.id, st);
        gained += xr ? xr.gained : 0;
        if (lv.type === "boss" && lv.region) stampNew = p.addStamp(lv.region.id);
      }
    }
    var s = screen("p-center");
    var hero = el("div", "p-result-hero");
    var mp = mascot("party", "party is-big");
    if (mp) hero.appendChild(mp);
    s.appendChild(hero);
    s.appendChild(el("div", "p-head-title", lv.isDaily ? "每日挑战完成！🎉" : lv.type === "learn" ? "学过了 ✅" : "过关！🎉"));
    // 胜利小旋律（这是点“继续”的点击里），星星蹦出来时再“闪”一下
    sfx("win");
    S.sparkleTimer = setTimeout(function () { sfx("sparkle"); }, lv.isDaily ? 500 : 650);
    var stBox = el("div", "p-stars");
    stBox.setAttribute("aria-label", st + " 颗星");
    for (var i = 0; i < 3; i++) stBox.appendChild(el("span", i < st ? "on" : "", "⭐"));
    if (!lv.isDaily && lv.type !== "learn") s.appendChild(stBox);
    if (lv.type === "learn") s.appendChild(el("p", "", "这 " + S.plan.learn.cards.length + " 个词已经放进复习里了，接下来去闯关用一用吧！"));
    if (lv.type !== "learn") s.appendChild(el("div", "small-tip", "答错 " + S.mistakes + " 次 · 正确率 " + acc + "% · 剩下 ❤️ " + S.hearts));
    var gain = el("div", "p-gain");
    if (gained) gain.appendChild(el("span", "", "+" + gained + " XP"));
    if (extraStars) gain.appendChild(el("span", "", "+" + extraStars + " ⭐"));
    if (gain.firstChild) s.appendChild(gain);
    if (lv.isDaily && !dailyFirst) s.appendChild(el("p", "small-tip", "今天的奖励已经领过了（每天一次），明天再来！"));
    if (lv.type === "boss" && lv.region) {
      var reg = lv.region;
      if (stampNew) {
        var stp = el("div", "p-stamp pop-in", "🎉 获得护照邮票：" + (reg.stampZh || reg.titleZh || ""));
        if (window.Icons) stp.appendChild(window.Icons.el(window.Icons.region(reg.id), "ic-inline"));
        s.appendChild(stp);
      }
      else s.appendChild(el("p", "small-tip", "这枚护照邮票你已经有了 ✓"));
    }
    var chests = p ? p.chestsAvailable() : 0;
    if (chests > 0) {
      var a = el("a", "btn btn-light btn-small");
      a.appendChild(el("span", "p-chest", "🎁")).setAttribute("aria-hidden", "true");
      a.appendChild(document.createTextNode(" 你有 " + chests + " 个宝箱可以打开 →"));
      a.id = "chest-link";
      a.href = collectionUrl();
      var pc = el("p", "");
      pc.appendChild(a);
      s.appendChild(pc);
    }
    reviewList(s);
    var btns = [];
    var nx = lv.isDaily ? null : W.nextLevel(lv);
    if (nx && W.isUnlocked(nx)) btns.push({ text: "下一关 →", id: "next-level-btn", href: "play.html#level=" + encodeURIComponent(nx.id) });
    btns.push({ text: "回到地图", cls: btns.length ? "btn-light" : "", id: "map-btn", href: mapUrl() });
    setFoot({ buttons: btns });
  }

  // ---------- 中途退出：页面内确认（不用 confirm 弹窗） ----------
  function busy() { return S && (S.phase === "question" || S.phase === "feedback" || S.phase === "dialogue" || S.phase === "speed" || S.phase === "learn"); }
  function askExit(ev) {
    if (!busy()) return; // 还没开始 / 已经结束：直接回地图
    if (ev) ev.preventDefault();
    if (S.phase === "speed") S.paused = true;
    var back = el("div", "sheet-back");
    back.id = "exit-sheet";
    var sh = el("div", "sheet");
    sh.setAttribute("role", "dialog");
    sh.setAttribute("aria-modal", "true");
    sh.setAttribute("aria-label", "退出关卡");
    var shHead = el("div", "sheet-head");
    var mx = mascot("cheer");
    if (mx) shHead.appendChild(mx);
    shHead.appendChild(el("div", "sheet-title", "要退出这一关吗？"));
    sh.appendChild(shHead);
    sh.appendChild(el("p", "", "现在退出，这一关的进度不会保存（已经答过的词照常记进复习）。"));
    var acts = el("div", "sheet-actions");
    var stay = el("button", "btn", "继续闯关");
    stay.type = "button";
    stay.id = "exit-stay";
    stay.onclick = function () {
      if (back.parentNode) back.parentNode.removeChild(back);
      if (S.phase === "speed" && S.paused) { S.paused = false; if (S.speedResume) S.speedResume(); }
    };
    var quit = el("a", "btn btn-light", "退出");
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
    if (S && S.sparkleTimer) { clearTimeout(S.sparkleTimer); S.sparkleTimer = null; }
    var ex = $("exit-sheet");
    if (ex && ex.parentNode) ex.parentNode.removeChild(ex);
    var lv = levelFromHash();
    if (!lv) {
      S = { level: null, plan: { questions: [], problems: [] }, step: 0, hearts: HEARTS, phase: "error" };
      var s = screen("p-center");
      var mn = mascot("think", "bob");
      if (mn) s.appendChild(mn);
      s.appendChild(el("div", "p-head-title", "没有找到这一关"));
      setFoot({ buttons: [{ text: "回到地图", href: mapUrl() }] });
      return;
    }
    if (!lv.isDaily && !W.isUnlocked(lv)) {
      S = { level: lv, plan: { questions: [], problems: [] }, step: 0, hearts: HEARTS, phase: "error" };
      var s2 = screen("p-center");
      var ml = mascot("think", "bob");
      if (ml) s2.appendChild(ml);
      else s2.appendChild(el("div", "p-emoji", "🔒"));
      s2.appendChild(el("div", "p-head-title", "这一关还没解锁"));
      s2.appendChild(el("p", "", "先过前面的关卡（至少 1 颗星）就能解锁。"));
      setFoot({ buttons: [{ text: "回到地图", href: mapUrl() }] });
      return;
    }
    start(lv);
  }

  window.addEventListener("hashchange", init);
  // 离开页面：清掉结算页还没放的“闪亮”音效
  window.addEventListener("pagehide", function () { if (S && S.sparkleTimer) { clearTimeout(S.sparkleTimer); S.sparkleTimer = null; } });
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
    starsFor: starsFor,
    judgeGuess: judgeGuess,
    viewport: applyViewport // 测试用：模拟键盘弹出后的可见高度（0 = 恢复）
  };
})();
