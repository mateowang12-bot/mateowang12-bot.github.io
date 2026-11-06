// ============================================
// 背诵模式（memorize.js）—— 只给 pages/memorize.html 用（阶段 22）
// 用户：“可以出一个单独的单词模式，我在闯关的时候有很多句子都记不住”。
// 一个安静地背单词 / 句子的地方：不扣心、不计时、不会失败。
//
// 1) 选范围：单词 / 句子 / 全部 + 来源（我的错题，或 14 个地图单元之一；默认是现在走到的单元，没解锁的也能背）。
// 2) 一张一张背：正面大字西语（出现时自动读：在“开始背 / 记住了 / 还不熟”的点击里同步朗读，iPhone 才出声），
//    点卡片或“看意思”看中文；句子还有逐词小块（WordsUtil.glossTokens，数据 data/lexicon.js）和备注。
//    “中文先”：反过来先看中文、想西语（这时不自动读，看答案时才读）。
//    “记住了”：Progress.markWord(id, true)（和单词卡片页一样，盒子 +1）；
//    “还不熟”：Progress.markWord(id, false)（盒子回 0；同一轮里同一张只记一次），并把这张放回队列，隔 3 张再出现。
//    每张都点过一次“记住了”这一轮就结束。一轮默认 10 张，不熟的先出（学过但不熟 → 学习中 → 新的 → 已掌握）。
// 3) 结束页：一次就记住几个、还不熟的列表（可点读）、再来 10 个 / 去闯关 / 返回。
//    经验值：每个来源（单元 / 错题）每天第一次背完一轮 +5（Progress.awardLearn("memo-…")，和背单词关同一条规则）。
//
// 直接打开（深链接）：
//   memorize.html#region=<单元id>&kind=words|phrases|all   选好单元和种类（kind 可省，默认上次选的）
//   memorize.html#source=wrong&kind=…                       选好“我的错题”
//   再加 &start=1：直接开始背（这时第一张不会自动读——不是在点击里，iPhone 不出声；点喇叭就行）
//
// 本机小设置（不进进度、不同步）：localStorage 的 es-study-memo-kind（words / phrases / all）、es-study-memo-zhfirst（"1" = 中文先）。
// ============================================
(function () {
  var U = window.WordsUtil;
  var ROUND = 10;        // 一轮几张
  var REQUEUE_GAP = 3;   // “还不熟”的卡隔几张再出现
  var KIND_KEY = "es-study-memo-kind";
  var ZH_KEY = "es-study-memo-zhfirst";
  var KINDS = [["words", "单词"], ["phrases", "句子"], ["all", "全部"]];

  function P() { return window.Progress || null; }
  function W() { return window.World || null; }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { return U.el(tag, cls, text); }
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function getLS(k) { try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (e) { return null; } }
  function setLS(k, v) { try { if (window.localStorage) window.localStorage.setItem(k, v); } catch (e) {} }

  // ---------- 内容 ----------
  var IDX = null;
  function index() {
    if (IDX) return IDX;
    var w = W();
    if (w && w.index) { IDX = w.index(); return IDX; }
    // 没有 world.js：自己建（只要单词和句子）
    IDX = { words: {}, phrases: {} };
    var wl = window.WORD_LESSONS || [], pl = window.PHRASE_LESSONS || [];
    for (var i = 0; i < wl.length; i++) {
      var ws = (wl[i] && wl[i].words) || [];
      for (var j = 0; j < ws.length; j++) if (ws[j] && ws[j].id && ws[j].es) IDX.words[ws[j].id] = { w: ws[j], lesson: i };
    }
    for (var a = 0; a < pl.length; a++) {
      var ps = (pl[a] && pl[a].phrases) || [];
      for (var b = 0; b < ps.length; b++) if (ps[b] && ps[b].id && ps[b].es) IDX.phrases[ps[b].id] = { w: ps[b], lesson: a };
    }
    return IDX;
  }
  function makeItem(kind, id) {
    var c = index();
    var src = kind === "phrase" ? c.phrases[id] : c.words[id];
    if (!src || !src.w || !src.w.es) return null;
    var x = src.w;
    return { id: id, kind: kind, es: x.es, zh: x.zh || "", note: x.note || "", emoji: kind === "word" ? (x.emoji || "") : "", example: kind === "word" ? x.example || null : null };
  }
  function wantKind(kind, itemKind) {
    return kind === "all" || (kind === "words" && itemKind === "word") || (kind === "phrases" && itemKind === "phrase");
  }

  // 一个地图单元里出现的单词 / 句子 id（按第一次出现的顺序，不重复；复习关的 reviewOf 不算）
  var regionCache = {};
  function regionIds(reg) {
    if (regionCache[reg.id]) return regionCache[reg.id];
    var out = { words: [], phrases: [] }, seen = {};
    var c = index();
    for (var i = 0; i < reg.levels.length; i++) {
      var it = reg.levels[i].items || {};
      var lw = it.words || [], lp = it.phrases || [];
      for (var a = 0; a < lw.length; a++) if (!seen["w:" + lw[a]] && has(c.words, lw[a])) { seen["w:" + lw[a]] = 1; out.words.push(lw[a]); }
      for (var b = 0; b < lp.length; b++) if (!seen["p:" + lp[b]] && has(c.phrases, lp[b])) { seen["p:" + lp[b]] = 1; out.phrases.push(lp[b]); }
    }
    // 关卡里没用到、但适合这个单元背的额外内容：data/levels.js 里地区的 memo: { words: [...], phrases: [...] }（可选）
    var raw = null, wr = (window.WORLD && window.WORLD.regions) || [];
    for (var r = 0; r < wr.length; r++) if (wr[r] && wr[r].id === reg.id) raw = wr[r];
    var memo = (raw && raw.memo) || {};
    var mw = memo.words || [], mp = memo.phrases || [];
    for (var x = 0; x < mw.length; x++) if (!seen["w:" + mw[x]] && has(c.words, mw[x])) { seen["w:" + mw[x]] = 1; out.words.push(mw[x]); }
    for (var y = 0; y < mp.length; y++) if (!seen["p:" + mp[y]] && has(c.phrases, mp[y])) { seen["p:" + mp[y]] = 1; out.phrases.push(mp[y]); }
    regionCache[reg.id] = out;
    return out;
  }
  function regions() {
    var w = W();
    return w && w.regions ? w.regions() : [];
  }
  function findRegion(id) {
    var rs = regions();
    for (var i = 0; i < rs.length; i++) if (rs[i].id === id) return rs[i];
    return null;
  }
  function currentRegion() {
    var w = W();
    var lv = null;
    try { lv = w && w.current ? w.current() : null; } catch (e) { lv = null; }
    return lv && lv.region ? lv.region : regions()[0] || null;
  }

  // “我的错题”：在关卡、复习、测验里答错过（wrong > 0）、而且还没掌握（盒子 < 3）的
  function wrongItems(kind) {
    var p = P();
    if (!p || !p.load) return [];
    var st = p.load().words || {};
    var c = index(), list = [], k;
    var M = p.MASTERED_BOX || 3;
    var groups = [["word", c.words], ["phrase", c.phrases]];
    for (var g = 0; g < groups.length; g++) {
      if (!wantKind(kind, groups[g][0])) continue;
      for (k in groups[g][1]) {
        if (!has(groups[g][1], k) || !has(st, k)) continue;
        var r = st[k];
        if (r.wrong > 0 && r.box < M) list.push({ kind: groups[g][0], id: k, r: r });
      }
    }
    list.sort(function (a, b) {
      if (a.r.box !== b.r.box) return a.r.box - b.r.box;
      if (a.r.wrong !== b.r.wrong) return b.r.wrong - a.r.wrong;
      return b.r.lastSeen - a.r.lastSeen;
    });
    var out = [];
    for (var i = 0; i < list.length; i++) { var it = makeItem(list[i].kind, list[i].id); if (it) out.push(it); }
    return out;
  }
  function regionItems(reg, kind) {
    var ids = regionIds(reg), out = [], i, it;
    if (wantKind(kind, "word")) for (i = 0; i < ids.words.length; i++) { it = makeItem("word", ids.words[i]); if (it) out.push(it); }
    if (wantKind(kind, "phrase")) for (i = 0; i < ids.phrases.length; i++) { it = makeItem("phrase", ids.phrases[i]); if (it) out.push(it); }
    return out;
  }
  function poolFor(src, kind) {
    if (src.type === "wrong") return wrongItems(kind);
    var reg = findRegion(src.id);
    return reg ? regionItems(reg, kind) : [];
  }
  function boxOf(id) { var p = P(); return p && p.getBox ? p.getBox(id) : 0; }
  // 已记住：上一次是“记住了 / 答对”（盒子 ≥ 1）；已掌握：盒子 ≥ 3（3 个小圆点）
  function rememberedCount(items) {
    var p = P();
    if (!p || !p.load) return 0;
    var st = p.load().words || {}, n = 0;
    for (var i = 0; i < items.length; i++) if (has(st, items[i].id) && st[items[i].id].box >= 1) n++;
    return n;
  }

  // 不熟的先出：学过但还在盒子 0 的（答错过）→ 盒子 1 → 盒子 2 → 没见过的新内容（按课程顺序）→ 已掌握的（很久没见的先）
  function prioritized(items) {
    var p = P();
    var st = p && p.load ? p.load().words || {} : {};
    var M = p && p.MASTERED_BOX || 3;
    var arr = [];
    for (var i = 0; i < items.length; i++) {
      var r = has(st, items[i].id) ? st[items[i].id] : null;
      var group, sub;
      if (!r) { group = 3; sub = 0; }
      else if (r.box >= M) { group = 4; sub = r.lastSeen; }
      else { group = r.box; sub = -r.wrong; }  // 0 / 1 / 2
      arr.push({ it: items[i], g: group, s: sub, o: i });
    }
    arr.sort(function (a, b) { return a.g - b.g || a.s - b.s || a.o - b.o; });
    return arr.map(function (x) { return x.it; });
  }

  // ---------- 朗读 ----------
  function speak(text, slow) {
    if (!text || typeof window.speakSpanish !== "function") return;
    window.speakSpanish(text, false, null, slow ? { rate: "slower" } : undefined);
  }
  function stopSpeech() {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  }
  function listenRow(getText) {
    var row = el("div", "p-listen-row memo-listen");
    var play = el("button", "p-listen");
    play.type = "button";
    play.id = "memo-listen";
    play.setAttribute("aria-label", "听发音");
    play.onclick = function (ev) { ev.stopPropagation(); speak(getText()); };
    var slow = el("button", "p-slow", "🐢");
    slow.type = "button";
    slow.id = "memo-slow";
    slow.title = "慢速再听";
    slow.setAttribute("aria-label", "慢速再听");
    slow.onclick = function (ev) { ev.stopPropagation(); speak(getText(), true); };
    row.appendChild(play);
    row.appendChild(slow);
    return row;
  }

  // ---------- 选择页 ----------
  var pick = { kind: "words", src: null };
  (function () {
    var k = getLS(KIND_KEY);
    if (k === "words" || k === "phrases" || k === "all") pick.kind = k;
  })();
  var zhFirst = getLS(ZH_KEY) === "1";

  function srcKey(src) { return src.type === "wrong" ? "wrong" : "region:" + src.id; }
  function srcTitle(src) {
    if (src.type === "wrong") return "我的错题";
    var r = findRegion(src.id);
    return r ? r.titleZh || r.id : "";
  }
  function kindName(k) {
    for (var i = 0; i < KINDS.length; i++) if (KINDS[i][0] === k) return KINDS[i][1];
    return "";
  }

  function renderPicker() {
    var seg = $("memo-kinds");
    seg.innerHTML = "";
    for (var i = 0; i < KINDS.length; i++) {
      (function (k) {
        var b = el("button", "memo-seg-btn", k[1]);
        b.type = "button";
        b.setAttribute("role", "radio");
        b.setAttribute("aria-checked", pick.kind === k[0] ? "true" : "false");
        b.setAttribute("data-kind", k[0]);
        b.onclick = function () {
          pick.kind = k[0];
          setLS(KIND_KEY, k[0]);
          renderPicker();
        };
        seg.appendChild(b);
      })(KINDS[i]);
    }

    // 我的错题
    var wrongBox = $("memo-wrong");
    wrongBox.innerHTML = "";
    var wl = wrongItems(pick.kind);
    wrongBox.appendChild(sourceRow({ type: "wrong" }, Icons ? "note" : "", "我的错题",
      wl.length ? "闯关和复习里答错过、还没掌握的 · " + wl.length + " 个" : "现在没有错题", wl.length, null));

    // 地图单元
    var list = $("memo-regions");
    list.innerHTML = "";
    var rs = regions();
    var cur = currentRegion();
    var w = W();
    for (var r = 0; r < rs.length; r++) {
      var reg = rs[r];
      var items = regionItems(reg, pick.kind);
      var sub = items.length ? items.length + " 个 · 已记住 " + rememberedCount(items) + " / " + items.length
        : (pick.kind === "phrases" ? "这个单元没有句子" : pick.kind === "words" ? "这个单元没有单词" : "这个单元没有单词和句子");
      var tag = null;
      if (cur && cur.id === reg.id) tag = { cls: "is-cur", text: "现在在这里" };
      else if (w && w.regionUnlocked && !w.regionUnlocked(reg)) tag = { cls: "is-lock", text: "还没走到" };
      list.appendChild(sourceRow({ type: "region", id: reg.id }, Icons ? Icons.region(reg.id) : "", (r + 1) + ". " + (reg.titleZh || reg.id), sub, items.length, tag,
        items.length ? rememberedCount(items) / items.length : 0));
    }
    // 选中的来源没东西可背（例如换成“句子”后这个单元没有句子）：开始按钮变灰
    updateStart();
  }
  var Icons = window.Icons || null;
  function sourceRow(src, icon, title, sub, count, tag, ratio) {
    var b = el("button", "memo-src");
    b.type = "button";
    b.setAttribute("role", "radio");
    var on = pick.src && srcKey(pick.src) === srcKey(src);
    b.setAttribute("aria-checked", on ? "true" : "false");
    b.setAttribute("data-src", srcKey(src));
    if (!count) b.classList.add("is-empty");
    var ic = el("span", "memo-src-ic");
    if (Icons && icon) ic.appendChild(Icons.el(icon));
    b.appendChild(ic);
    var body = el("span", "memo-src-body");
    var t = el("span", "memo-src-title", title);
    body.appendChild(t);
    if (tag) body.appendChild(el("span", "memo-tag " + tag.cls, tag.text));
    body.appendChild(el("span", "memo-src-sub", sub));
    if (typeof ratio === "number" && count) {
      var bar = el("span", "memo-src-bar");
      var fill = el("span", "");
      fill.style.width = Math.round(ratio * 100) + "%";
      bar.appendChild(fill);
      body.appendChild(bar);
    }
    b.appendChild(body);
    b.appendChild(el("span", "memo-src-radio")).setAttribute("aria-hidden", "true");
    b.onclick = function () {
      pick.src = src;
      var all = document.querySelectorAll(".memo-src");
      for (var i = 0; i < all.length; i++) all[i].setAttribute("aria-checked", all[i] === b ? "true" : "false");
      updateStart();
    };
    return b;
  }
  function updateStart() {
    var btn = $("memo-start");
    var info = $("memo-start-info");
    var n = pick.src ? poolFor(pick.src, pick.kind).length : 0;
    btn.disabled = !n;
    if (!pick.src) info.textContent = "先选一个单元";
    else if (!n) info.textContent = srcTitle(pick.src) + "：没有可以背的" + (pick.kind === "all" ? "内容" : kindName(pick.kind));
    else info.textContent = srcTitle(pick.src) + " · " + kindName(pick.kind) + " · 这一轮 " + Math.min(ROUND, n) + " 个";
  }
  function scrollToPicked() {
    if (!pick.src) return;
    var b = document.querySelector('.memo-src[data-src="' + srcKey(pick.src) + '"]');
    if (b && b.scrollIntoView) { try { b.scrollIntoView({ block: "center" }); } catch (e) { b.scrollIntoView(); } }
  }

  // ---------- 一轮 ----------
  var S = null;
  var visited = {};  // 这次打开页面已经背完（点过“记住了”）的：再来 10 个时先背别的

  function startRound(fromClick) {
    if (!pick.src) return;
    var pool = poolFor(pick.src, pick.kind);
    if (!pool.length) return;
    var order = prioritized(pool);
    var fresh = [], again = [];
    for (var i = 0; i < order.length; i++) (visited[srcKey(pick.src) + "|" + order[i].id] ? again : fresh).push(order[i]);
    var items = fresh.concat(again).slice(0, ROUND);
    S = { src: pick.src, kind: pick.kind, items: items, queue: items.slice(), done: {}, notYet: {}, notYetList: [], doneCount: 0, revealed: false, cur: null, total: items.length,
      poolLeft: fresh.length - Math.min(fresh.length, ROUND) };
    showView("session");
    showCard(!!fromClick);
  }

  function showView(name) {
    $("memo-pick").hidden = name !== "pick";
    $("memo-session").hidden = name !== "session";
    $("memo-end").hidden = name !== "end";
    document.body.classList.toggle("memo-on", name === "session");
    if (U.closeWordPop) U.closeWordPop();
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function drawTop() {
    var pct = S.total ? Math.round(100 * S.doneCount / S.total) : 0;
    $("memo-bar-fill").style.width = pct + "%";
    var bar = $("memo-bar");
    bar.setAttribute("aria-valuenow", String(S.doneCount));
    bar.setAttribute("aria-valuemax", String(S.total));
    $("memo-count").textContent = S.doneCount + " / " + S.total;
    var z = $("memo-zh-first");
    z.setAttribute("aria-pressed", zhFirst ? "true" : "false");
  }

  // 显示队列最前面的那张。speakNow：这是在用户点击里调用的 → 同步朗读（中文先时不读，免得说出答案）
  function showCard(speakNow) {
    S.cur = S.queue[0];
    S.revealed = false;
    drawTop();
    renderCard();
    if (speakNow && !zhFirst) speak(S.cur.es);
  }

  function renderCard() {
    var it = S.cur;
    var card = $("memo-card");
    card.innerHTML = "";
    card.className = "memo-card" + (S.revealed ? " is-open" : "") + (it.kind === "phrase" ? " is-phrase" : " is-word");
    card.setAttribute("aria-label", S.revealed ? "卡片" : "点一下看意思");
    var top = el("div", "memo-card-top");
    top.appendChild(el("span", "memo-kind", it.kind === "phrase" ? "句子" : "单词"));
    if (S.notYet[it.id]) top.appendChild(el("span", "memo-again", "再看一遍"));
    var badge = el("span", "memo-badge");
    badge.appendChild(U.masteryBadge(it.id, it.kind === "phrase" ? "新句" : "新词", S.lastPop === it.id));
    top.appendChild(badge);
    card.appendChild(top);

    var face = el("div", "memo-face");
    var esBig = el("div", "memo-es" + (it.kind === "word" ? " fit-word" : ""), it.es);
    esBig.setAttribute("lang", "es");
    if (zhFirst) {
      face.appendChild(el("div", "memo-zh-big", it.zh));
      if (!S.revealed) face.appendChild(el("div", "memo-hint", "想一想西语怎么说，再点一下看答案"));
    } else {
      face.appendChild(esBig);
      face.appendChild(listenRow(function () { return it.es; }));
      if (!S.revealed) face.appendChild(el("div", "memo-hint", "点一下看意思"));
    }
    card.appendChild(face);

    if (S.revealed) {
      var back = el("div", "memo-back");
      if (zhFirst) {
        back.appendChild(esBig);
        back.appendChild(listenRow(function () { return it.es; }));
      } else {
        back.appendChild(el("div", "memo-zh", it.zh));
      }
      if (it.emoji) back.appendChild(el("div", "memo-emoji sticker-zone", it.emoji));
      if (it.kind === "phrase") {
        var chips = glossChips(it.es);
        if (chips) back.appendChild(chips);
      }
      if (it.note) {
        var n = el("div", "memo-note");
        if (Icons) n.appendChild(Icons.el("bulb", "memo-note-ic"));
        n.appendChild(el("span", "", it.note));
        back.appendChild(n);
      }
      if (it.example && it.example.es) {
        var ex = el("div", "memo-ex");
        ex.appendChild(el("div", "memo-ex-label", "例句"));
        ex.appendChild(U.sayLine(it.example.es));
        if (it.example.zh) ex.appendChild(el("div", "memo-ex-zh", it.example.zh));
        back.appendChild(ex);
      }
      card.appendChild(back);
    }

    // 下面的按钮
    var act = $("memo-actions");
    act.innerHTML = "";
    if (!S.revealed) {
      var show = el("button", "btn btn-big btn-block memo-show", "看意思");
      show.type = "button";
      show.id = "memo-show";
      show.onclick = reveal;
      act.appendChild(show);
    } else {
      var no = el("button", "btn btn-light btn-big memo-no", "还不熟");
      no.type = "button";
      no.id = "memo-no";
      no.onclick = function () { mark(false); };
      var yes = el("button", "btn btn-big memo-yes", "记住了");
      yes.type = "button";
      yes.id = "memo-yes";
      yes.onclick = function () { mark(true); };
      act.appendChild(no);
      act.appendChild(yes);
    }
    S.lastPop = null;
    if (window.Mascot && window.Mascot.decorate) window.Mascot.decorate(card);
    U.fitAll(card);
  }

  // 句子的逐词小块：西语 + 中文，点一下读这个词（数据 data/lexicon.js；查不到意思的词只显示西语）
  function glossChips(es) {
    if (!U.glossTokens || !window.LEXICON) return null;
    var toks = U.glossTokens(es);
    var box = el("div", "memo-chips");
    var any = false;
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      if (t.other) continue;
      var c = el("button", "memo-chip" + (t.zh ? "" : " no-zh"));
      c.type = "button";
      var e1 = el("span", "memo-chip-es", t.text);
      e1.setAttribute("lang", "es");
      c.appendChild(e1);
      c.appendChild(el("span", "memo-chip-zh", t.zh || "　"));
      if (t.zh) any = true;
      (function (say) {
        c.onclick = function (ev) { ev.stopPropagation(); speak(say); };
      })(t.say);
      c.setAttribute("aria-label", t.say + (t.zh ? "：" + t.zh : "") + "（点一下听）");
      box.appendChild(c);
    }
    return any ? box : null;
  }

  function reveal() {
    if (!S || S.revealed) return;
    S.revealed = true;
    renderCard();
    if (zhFirst) speak(S.cur.es);   // 中文先：看答案时读西语（在点击里同步读）
    var y = $("memo-yes");
    if (y && document.activeElement && document.activeElement.id === "memo-show") y.focus();
  }

  function mark(known) {
    if (!S || !S.revealed || !S.cur) return;
    var it = S.cur;
    var p = P();
    S.queue.shift();
    if (known) {
      if (p) p.markWord(it.id, true);
      S.done[it.id] = 1;
      S.doneCount++;
      visited[srcKey(S.src) + "|" + it.id] = 1;
    } else {
      if (!S.notYet[it.id]) {
        if (p) p.markWord(it.id, false);  // 同一轮里同一张只记一次“还不熟”
        S.notYet[it.id] = 1;
        S.notYetList.push(it);
      }
      S.queue.splice(Math.min(REQUEUE_GAP, S.queue.length), 0, it);
    }
    if (!S.queue.length) {
      if (window.Sfx) window.Sfx.win();
      finishRound();
      return;
    }
    showCard(true);  // 在这次点击里同步读下一张
    if (window.Sfx) { if (known) window.Sfx.correct(); else window.Sfx.pop(); }
  }

  function exitSession() {
    stopSpeech();
    S = null;
    showView("pick");
    renderPicker();
    scrollToPicked();
  }

  // ---------- 结束页 ----------
  function levelLink(src) {
    var w = W();
    if (!w) return null;
    if (src.type === "wrong") {
      var c = w.current ? w.current() : null;
      return c ? { href: "play.html#level=" + encodeURIComponent(c.id), text: "去闯关" } : null;
    }
    var reg = findRegion(src.id);
    if (!reg) return null;
    if (w.regionUnlocked && !w.regionUnlocked(reg)) return { href: "../index.html", text: "去地图" };
    for (var i = 0; i < reg.levels.length; i++) {
      var lv = reg.levels[i];
      if (w.isUnlocked(lv) && !w.isDone(lv)) return { href: "play.html#level=" + encodeURIComponent(lv.id), text: "去闯关" };
    }
    return { href: "play.html#level=" + encodeURIComponent(reg.levels[0].id), text: "去闯关" };
  }

  function finishRound() {
    var p = P();
    var xp = null;
    if (p && p.awardLearn) xp = p.awardLearn("memo-" + (S.src.type === "wrong" ? "wrong" : S.src.id));
    var box = $("memo-end-body");
    box.innerHTML = "";
    var first = S.total - S.notYetList.length;
    if (window.Mascot) box.appendChild(window.Mascot.el(S.notYetList.length ? "happy" : "party", "memo-end-mascot bob"));
    box.appendChild(el("h2", "memo-end-title", "这一轮背完了"));
    var big = el("div", "memo-end-big");
    big.appendChild(el("span", "memo-end-num", String(S.total)));
    big.appendChild(el("span", "memo-end-unit", " 个记住了"));
    box.appendChild(big);
    box.appendChild(el("p", "memo-end-sub", S.notYetList.length ? "一次就记住 " + first + " 个，" + S.notYetList.length + " 个多看了几遍" : "全部一次就记住了，真棒！"));
    if (xp && xp.gained) box.appendChild(el("p", "memo-end-xp", "+" + xp.gained + " 经验值"));
    if (S.notYetList.length) {
      var sec = el("div", "memo-weak");
      sec.appendChild(el("div", "memo-weak-title", "刚才还不熟的（" + S.notYetList.length + "）"));
      var ul = el("ul", "memo-weak-list");
      for (var i = 0; i < S.notYetList.length; i++) {
        var it = S.notYetList[i];
        var li = el("li", "");
        var sb = U.sayButton(it.es, it.es);
        sb.setAttribute("lang", "es");
        li.appendChild(sb);
        li.appendChild(el("span", "memo-weak-zh", it.zh));
        ul.appendChild(li);
      }
      sec.appendChild(ul);
      box.appendChild(sec);
    }
    var btns = $("memo-end-btns");
    btns.innerHTML = "";
    var more = el("button", "btn btn-big btn-block", S.poolLeft > 0 ? "再来 " + Math.min(ROUND, S.poolLeft) + " 个" : "再来一轮");
    more.type = "button";
    more.id = "memo-more";
    more.onclick = function () { pick.src = S.src; pick.kind = S.kind; startRound(true); };
    btns.appendChild(more);
    var ln = levelLink(S.src);
    if (ln) {
      var a = el("a", "btn btn-light btn-big btn-block", ln.text);
      a.id = "memo-go-level";
      a.href = ln.href;
      btns.appendChild(a);
    }
    var back = el("button", "btn btn-light btn-big btn-block", "返回");
    back.type = "button";
    back.id = "memo-back";
    back.onclick = function () { S = null; showView("pick"); renderPicker(); scrollToPicked(); };
    btns.appendChild(back);
    showView("end");
    if (window.Mascot && window.Mascot.decorate) window.Mascot.decorate(box);
  }

  // ---------- 深链接 ----------
  function hashParams() {
    var h = String(location.hash || "").replace(/^#/, "");
    var out = {};
    var parts = h.split("&");
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split("=");
      if (!kv[0]) continue;
      var v = kv.slice(1).join("=");
      try { v = decodeURIComponent(v); } catch (e) {}
      out[kv[0]] = v;
    }
    return out;
  }
  function applyHash() {
    var q = hashParams();
    var changed = false;
    if (q.kind === "words" || q.kind === "phrases" || q.kind === "all") { pick.kind = q.kind; changed = true; }
    if (q.source === "wrong") { pick.src = { type: "wrong" }; changed = true; }
    else if (q.region && findRegion(q.region)) { pick.src = { type: "region", id: q.region }; changed = true; }
    return { changed: changed, start: q.start === "1" };
  }

  // ---------- 键盘 ----------
  function interactive(t) {
    if (!t || !t.tagName) return false;
    var tag = t.tagName.toLowerCase();
    return tag === "button" || tag === "a" || tag === "input" || tag === "textarea" || tag === "select" || (t.getAttribute && t.getAttribute("role") === "button" && t.id !== "memo-card");
  }
  document.addEventListener("keydown", function (ev) {
    if (!S || $("memo-session").hidden || ev.altKey || ev.ctrlKey || ev.metaKey) return;
    var k = ev.key;
    if (k === "Escape") { ev.preventDefault(); exitSession(); return; }
    if (!S.revealed) {
      if ((k === " " || k === "Spacebar" || k === "Enter") && !interactive(ev.target)) { ev.preventDefault(); reveal(); }
      return;
    }
    if (interactive(ev.target) && (k === " " || k === "Enter")) return;
    if (k === "1" || k === "ArrowLeft") { ev.preventDefault(); mark(false); }
    else if (k === "2" || k === "ArrowRight") { ev.preventDefault(); mark(true); }
  });

  // ---------- 启动 ----------
  function init() {
    var hasData = !!(window.WORD_LESSONS && window.WORD_LESSONS.length);
    if (!hasData || !regions().length) {
      $("memo-pick").insertBefore(el("div", "notice", "没有找到学习内容（data/words.js 或 data/levels.js 没有加载到）。"), $("memo-pick").firstChild);
    }
    var cur = currentRegion();
    if (cur) pick.src = { type: "region", id: cur.id };
    var h = applyHash();

    $("memo-start").onclick = function () { startRound(true); };
    $("memo-exit").onclick = exitSession;
    $("memo-zh-first").onclick = function () {
      zhFirst = !zhFirst;
      setLS(ZH_KEY, zhFirst ? "1" : "0");
      if (S && S.cur) { S.revealed = false; drawTop(); renderCard(); if (!zhFirst) speak(S.cur.es); }
    };
    var card = $("memo-card");
    var sw = window.addSwipe ? window.addSwipe(card, {
      left: function () { if (S && S.revealed) mark(false); },
      right: function () { if (S && S.revealed) mark(true); },
      follow: true
    }) : null;
    card.onclick = function () {
      if (sw && sw.justSwiped()) return;
      if (S && !S.revealed) reveal();
    };
    card.onkeydown = function (ev) {
      if ((ev.key === "Enter" || ev.key === " ") && S && !S.revealed && ev.target === card) { ev.preventDefault(); ev.stopPropagation(); reveal(); }
    };

    renderPicker();
    if (h.start && pick.src && poolFor(pick.src, pick.kind).length) startRound(false);
    else if (h.changed) scrollToPicked();

    window.addEventListener("hashchange", function () {
      var r = applyHash();
      if (!r.changed) return;
      if (S) { stopSpeech(); S = null; }
      showView("pick");
      renderPicker();
      if (r.start && pick.src && poolFor(pick.src, pick.kind).length) startRound(false);
      else scrollToPicked();
    });
    window.addEventListener("pageshow", function (ev) { if (ev.persisted && !S) renderPicker(); });
    window.addEventListener("progress-synced", function () { if (!S && !$("memo-pick").hidden) renderPicker(); });
  }

  // 测试用
  window.Memorize = { state: function () { return S; }, pick: pick, poolFor: poolFor, regionIds: regionIds, wrongItems: wrongItems };
  init();
})();
