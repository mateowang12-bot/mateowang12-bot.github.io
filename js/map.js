// ============================================
// 冒险地图（map.js）—— 首页 index.html 用（阶段 11）
// 要在 storage.js、world.js 之后引入。页面里要有 #map-top、#map-hero、#daily-box、#map。
// 阶段 12：顶部有吉祥物（阶段 14 起是小熊猫“竹竹”）和说话气泡（js/mascot.js）；区域牌是彩色横幅（band-1 … band-6 轮流）；关卡圆钮里画白色星星（Boss 👑、对话 💬、锁 🔒）。
//
// 地图从上往下走：每个区域一块浅色背景带 + 标题牌（点开看故事），区域里的关卡是一条弯曲虚线上的圆形节点。
//   普通关：数字；对话任务关：💬；Boss 关：👑（更大）；锁住：🔒；过了：黄色 + 下面的星星 ⭐⭐☆。
//   当前该玩的关卡上方有跳动的“开始”气泡；打开页面时自动滚到它。
// 点关卡 → 弹出关卡卡片（标题、简介、题型、最好成绩）→ “开始” → pages/play.html#level=关卡id
//
// 阶段 20：一次只显示一个单元（区域），不再是一条很长的滚动地图。
//   单元标题牌两边 ‹ › 换单元；手机左右滑（js/swipe.js）；电脑键盘 ← →；下面“第 3 / 14 单元”点开可以直接跳。
//   关卡排成“蛇形”格子（一行从左到右、下一行从右到左），按屏幕高度选列数，390×844 一屏放下。
//   打开时：到“现在该玩的关卡”所在的单元；如果上次看的单元之后进度没变，就回到上次看的单元
//   （本机 localStorage 的 es-study-map-unit，和进度分开，不同步）。没解锁的单元也能看（灰色、锁住）。
// ============================================
(function () {
  var W = window.World;
  var U = window.WordsUtil || null;
  function P() { return window.Progress || null; }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null && text !== "") e.textContent = String(text);
    return e;
  }
  // ROW：两关之间的高度（节点 + 星星 + 最多两行标题，不会压到下一关）；TOP：第一个节点中心离区域牌的距离
  var ROW = 146, TOP = 50, SVGNS = "http://www.w3.org/2000/svg";
  var TYPE_ZH = { normal: "关卡", task: "对话任务", boss: "大关挑战", learn: "背单词", review: "复习关" };

  function starsText(n) {
    var s = "";
    for (var i = 0; i < 3; i++) s += i < n ? "⭐" : "☆";
    return s;
  }

  // ---------- 顶部状态栏 ----------
  function renderTop() {
    var p = P();
    var box = $("map-top");
    box.innerHTML = "";
    var prof = p ? p.profile() : { avatar: "suitcase" };
    var av = W.avatar(prof.avatar);
    var a = el("a", "map-avatar");
    if (window.Icons) a.appendChild(window.Icons.avatar(prof.avatar)); else a.textContent = av.emoji;
    a.href = "pages/collection.html";
    a.id = "map-avatar";
    a.setAttribute("aria-label", "我的头像：" + av.zh + "。点这里换头像");
    box.appendChild(a);
    var chips = el("div", "map-chips");
    var streak = p ? p.streak() : 0;
    var xp = p ? p.xpToday() : 0, goal = p ? p.dailyGoal() : 20;
    var rk = W.rank(p ? p.xpTotal() : 0);
    var stars = p ? p.starsTotal() : 0;
    var chest = p ? p.chestsAvailable() : 0;
    function chip(cls, text, href, label, id) {
      var c = el(href ? "a" : "span", "map-chip" + (cls ? " " + cls : ""), text);
      if (href) c.href = href;
      if (label) c.setAttribute("aria-label", label);
      if (id) c.id = id;
      chips.appendChild(c);
      return c;
    }
    chip(streak ? "is-streak" : "is-zero", "🔥 " + streak, "pages/me.html", "连续学习 " + streak + " 天", "chip-streak");
    chip(xp >= goal ? "is-streak" : "", "⭐ " + xp + "/" + goal + " XP", "pages/me.html", "今天 " + xp + " / " + goal + " 经验值", "chip-xp");
    chip("", rk.cur.emoji + " " + rk.cur.zh, "pages/me.html", "段位：" + rk.cur.zh, "chip-rank");
    chip("", "⭐×" + stars, "pages/collection.html", "一共 " + stars + " 颗星", "chip-stars");
    if (chest > 0) chip("is-chest", "🎁 " + chest, "pages/collection.html", "有 " + chest + " 个宝箱可以打开", "chip-chest");
    box.appendChild(chips);
  }

  // ---------- 吉祥物 + 说话气泡 ----------
  function heroText() {
    var p = P();
    if (!p) return "今天也来闯一关吧！";
    var xp = p.xpToday(), goal = p.dailyGoal();
    var cur0 = W.current();
    if (p.starsTotal() === 0) return "¡Hola! 我是竹竹，一只来西班牙旅行的小熊猫。我们先从第一关开始吧！";
    if (xp >= goal) return "今天的目标完成啦，真棒！想再闯一关吗？";
    if (p.chestsAvailable() > 0) return "你有宝箱还没打开哦！🎁";
    if (cur0 && cur0.type === "boss" && W.starsOf(cur0) < 1) return "前面是大关，加油！";
    return "今天也来闯一关吧！";
  }
  function renderHero() {
    var box = $("map-hero");
    if (!box) return;
    box.innerHTML = "";
    if (window.Mascot) box.appendChild(window.Mascot.el("hello", "bob"));
    var sp = el("div", "speech", heroText());
    sp.id = "map-speech";
    box.appendChild(sp);
  }

  // ---------- 每日挑战入口 ----------
  function renderDaily() {
    var p = P();
    var box = $("daily-box");
    box.innerHTML = "";
    var d = p ? p.getDaily(p.dayKey()) : null;
    var done = !!(d && d.done);
    var a = el("a", "daily-card" + (done ? " is-done" : ""));
    a.href = "pages/play.html#daily";
    a.id = "daily-link";
    a.appendChild(el("div", "daily-icon", done ? "✅" : "📅")).setAttribute("aria-hidden", "true");
    var t = el("div", "");
    t.appendChild(el("div", "daily-title", "每日挑战"));
    t.appendChild(el("div", "daily-sub", done ? "今天已完成 ✓ 还可以再练" : "10 道题 · +30 XP、+3 ⭐"));
    a.appendChild(t);
    a.appendChild(el("div", "daily-go", done ? "再练 ›" : "开始 ›"));
    box.appendChild(a);
  }

  // ---------- 弹出卡片 ----------
  var sheetBack = null, lastFocus = null;
  function closeSheet() {
    if (sheetBack && sheetBack.parentNode) sheetBack.parentNode.removeChild(sheetBack);
    sheetBack = null;
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
  }
  function openSheet(build, label) {
    closeSheet();
    lastFocus = document.activeElement;
    var back = el("div", "sheet-back");
    back.id = "sheet";
    var sh = el("div", "sheet");
    sh.setAttribute("role", "dialog");
    sh.setAttribute("aria-modal", "true");
    sh.setAttribute("aria-label", label);
    build(sh);
    back.appendChild(sh);
    back.onclick = function (e) { if (e.target === back) closeSheet(); };
    document.body.appendChild(back);
    sheetBack = back;
    var f = sh.querySelector(".btn");
    if (f) try { f.focus(); } catch (e2) {}
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheetBack) closeSheet(); });

  function closeBtn(text) {
    var b = el("button", "btn btn-light", text || "关闭");
    b.type = "button";
    b.id = "sheet-close";
    b.onclick = closeSheet;
    return b;
  }

  function levelSheet(lv) {
    var p = P();
    var unlocked = W.isUnlocked(lv);
    var rec = p ? p.getLevel(lv.id) : null;
    openSheet(function (sh) {
      sh.appendChild(el("div", "sheet-kicker", (lv.region.titleZh || "") + " · 第 " + (lv.index + 1) + " 关 · " + TYPE_ZH[lv.type]));
      var t = el("div", "sheet-title", (lv.type === "boss" ? "👑 " : lv.type === "task" ? "💬 " : lv.type === "learn" ? "📖 " : lv.type === "review" ? "🔁 " : "") + (lv.titleZh || ""));
      sh.appendChild(t);
      if (lv.introZh) sh.appendChild(el("p", "", lv.introZh));
      var mi = el("div", "mode-icons");
      for (var i = 0; i < lv.modes.length; i++) {
        var m = W.MODE_INFO[lv.modes[i]];
        if (m) mi.appendChild(el("span", "mode-icon", m.icon + " " + m.zh));
      }
      sh.appendChild(mi);
      if (lv.type === "learn") sh.appendChild(el("p", "small-tip", "📖 背单词关：先看一遍、听一遍这一单元的词，没有心，不会失败。可以先玩它，也可以跳过。"));
      if (lv.type === "review") sh.appendChild(el("p", "small-tip", "🔁 复习关：优先出你答错过、还不熟的词。可以先玩它，也可以跳过。"));
      if (lv.type === "learn" && rec && rec.plays) sh.appendChild(el("p", "sheet-best", "✅ 学过了（" + rec.plays + " 次）"));
      else if (lv.type === "learn") { /* 没学过：上面已经有说明 */ }
      else if (rec && rec.stars) sh.appendChild(el("p", "sheet-best", "最好成绩：" + starsText(rec.stars) + " · 正确率 " + rec.best + "% · 玩过 " + rec.plays + " 次"));
      else if (unlocked) sh.appendChild(el("p", "small-tip", "还没过关。❤️ × 5，答错一次少一颗。"));
      if (!unlocked) sh.appendChild(el("p", "small-tip", "🔒 还没解锁：先过前一关（至少 1 颗星）。"));
      var acts = el("div", "sheet-actions");
      if (unlocked) {
        var go = el("a", "btn", lv.type === "learn" ? (rec && rec.plays ? "再学一次 ▶" : "开始学 ▶") : (rec && rec.stars ? "再玩一次 ▶" : "开始 ▶"));
        go.href = "pages/play.html#level=" + encodeURIComponent(lv.id);
        go.id = "level-start";
        acts.appendChild(go);
      }
      acts.appendChild(closeBtn());
      sh.appendChild(acts);
    }, "关卡：" + (lv.titleZh || ""));
  }

  function storySheet(reg) {
    openSheet(function (sh) {
      sh.appendChild(el("div", "sheet-kicker", "第 " + (reg.index + 1) + " 站"));
      var t = el("div", "sheet-title", reg.titleZh || "");
      if (window.Icons) t.insertBefore(window.Icons.el(window.Icons.region(reg.id), "ic-title"), t.firstChild);
      sh.appendChild(t);
      if (reg.storyZh) sh.appendChild(el("p", "", reg.storyZh));
      if (reg.npc && reg.npc.name) {
        var n = el("div", "npc");
        var ne = el("div", "npc-emoji");
        if (window.Icons) ne.appendChild(window.Icons.npc(reg.id)); else ne.textContent = reg.npc.emoji || "";
        n.appendChild(ne);
        var tx = el("div", "");
        tx.appendChild(el("div", "npc-name", reg.npc.name));
        tx.appendChild(el("div", "", reg.npc.roleZh || ""));
        n.appendChild(tx);
        sh.appendChild(n);
      }
      var p = P();
      var got = p ? p.stamps()[reg.id] : 0;
      if (reg.stampZh) sh.appendChild(el("p", "small-tip", (got ? "✓ 已获得护照邮票：" : "打败本站大关可以得到护照邮票：") + reg.stampZh));
      var acts = el("div", "sheet-actions");
      acts.appendChild(closeBtn("好的"));
      sh.appendChild(acts);
    }, "故事：" + (reg.titleZh || ""));
  }

  // ---------- 地图 ----------
  var cur = null;
  // ---------- 阶段 20：一次一个单元 ----------
  var UNIT_KEY = "es-study-map-unit"; // 本机记住上次看的单元（和进度分开）
  var unitIdx = 0, swiper = null, slideDir = 0;
  function loadUnit() {
    try { var s = localStorage.getItem(UNIT_KEY); var o = s ? JSON.parse(s) : null; return o && typeof o === "object" ? o : null; } catch (e) { return null; }
  }
  function saveUnit() {
    try {
      var regs = W.regions();
      if (regs[unitIdx]) localStorage.setItem(UNIT_KEY, JSON.stringify({ region: regs[unitIdx].id, cur: cur ? cur.id : "" }));
    } catch (e) {}
  }
  // 打开时看哪个单元：上次看的单元（如果那之后“现在该玩的关”没变）；否则现在该玩的关所在的单元
  function pickUnit(regs) {
    var curIdx = cur && typeof cur.regionIndex === "number" ? cur.regionIndex : 0;
    var saved = loadUnit();
    if (saved && saved.cur === (cur ? cur.id : "")) {
      for (var i = 0; i < regs.length; i++) if (regs[i].id === saved.region) return i;
    }
    return curIdx;
  }
  function levelsDone(reg) {
    var n = 0;
    for (var i = 0; i < reg.levels.length; i++) if (W.isDone(reg.levels[i])) n++;
    return n;
  }
  function goUnit(delta) {
    var regs = W.regions();
    var to = Math.max(0, Math.min(regs.length - 1, unitIdx + delta));
    if (to === unitIdx) return;
    slideDir = delta > 0 ? 1 : -1;
    unitIdx = to;
    render(true);
    saveUnit();
    var m = $("map");
    if (m && m.getBoundingClientRect().top < 0) try { window.scrollTo(0, window.pageYOffset + m.getBoundingClientRect().top - 8); } catch (e) {}
  }
  function jumpUnit(i) {
    slideDir = 0;
    unitIdx = i;
    render(true);
    saveUnit();
  }
  function unitListSheet() {
    var regs = W.regions();
    openSheet(function (sh) {
      sh.appendChild(el("div", "sheet-title", "选择单元"));
      var list = el("div", "unit-list");
      for (var i = 0; i < regs.length; i++) {
        (function (reg, i) {
          var unlocked = W.regionUnlocked(reg);
          var b = el("button", "unit-row" + (i === unitIdx ? " is-here" : "") + (unlocked ? "" : " is-locked"));
          b.type = "button";
          var ic = el("span", "unit-row-ic");
          if (window.Icons) ic.appendChild(window.Icons.el(window.Icons.region(reg.id))); else ic.textContent = reg.emoji || "";
          b.appendChild(ic);
          var tx = el("span", "unit-row-text");
          tx.appendChild(el("span", "unit-row-kicker", "第 " + (i + 1) + " 站"));
          tx.appendChild(el("span", "unit-row-name", reg.titleZh || ""));
          b.appendChild(tx);
          b.appendChild(el("span", "unit-row-meta", unlocked ? levelsDone(reg) + "/" + reg.levels.length + " 关" : "🔒"));
          if (i === unitIdx) b.setAttribute("aria-current", "true");
          b.onclick = function () {
            closeSheet();
            jumpUnit(i);
            var ind = $("unit-ind");
            if (ind) try { ind.focus(); } catch (e) {}
          };
          list.appendChild(b);
        })(regs[i], i);
      }
      sh.appendChild(list);
      var acts = el("div", "sheet-actions");
      acts.appendChild(closeBtn());
      sh.appendChild(acts);
      var here = list.querySelector(".is-here");
      if (here) setTimeout(function () { try { here.scrollIntoView({ block: "center" }); here.focus(); } catch (e) {} }, 0);
    }, "选择单元");
  }

  function render(keep) {
    var box = $("map");
    box.innerHTML = "";
    box.classList.add("is-unit");
    document.body.classList.add("map-unit-page");
    var regs = W.regions();
    cur = W.current();
    if (!regs.length) return;
    if (!keep) unitIdx = pickUnit(regs);
    unitIdx = Math.max(0, Math.min(regs.length - 1, unitIdx));
    if (window.Terrain) window.Terrain.ensureSprite();
    var reg = regs[unitIdx];
    var sec = regionEl(reg, regs);
    // 地形背景（js/terrain.js）：只有这一个单元，底色就用自己的
    if (window.Terrain) window.Terrain.prepareRegion(sec, reg.id, unitIdx, null, -1);
    if (slideDir) sec.classList.add(slideDir > 0 ? "slide-from-right" : "slide-from-left");
    slideDir = 0;
    box.appendChild(sec);
    if (!swiper && window.addSwipe) swiper = window.addSwipe(box, { left: function () { goUnit(1); }, right: function () { goUnit(-1); } });
    layout();
    // 图标（js/icons.js）把文字里的 emoji 换成 SVG 以后，上面的高度会变一点：等一下再按真实高度排一次
    if (relayoutTimer) clearTimeout(relayoutTimer);
    relayoutTimer = setTimeout(function () { relayoutTimer = null; layout(); }, 80);
  }
  var relayoutTimer = null;

  function regionEl(reg, regs) {
    regs = regs || W.regions();
    var unlocked = W.regionUnlocked(reg);
    var sec = el("section", "region band-" + (reg.index % 6 + 1) + (unlocked ? "" : " is-locked"));
    sec.id = "region-" + reg.id;
    sec.setAttribute("aria-label", "第 " + (reg.index + 1) + " 站：" + (reg.titleZh || ""));
    var headRow = el("div", "unit-head");
    var prev = el("button", "unit-arrow is-prev", "‹");
    prev.type = "button";
    prev.id = "unit-prev";
    prev.disabled = reg.index <= 0;
    prev.setAttribute("aria-label", reg.index > 0 ? "上一个单元：" + (regs[reg.index - 1].titleZh || "") : "已经是第一个单元");
    prev.onclick = function () { goUnit(-1); };
    var next = el("button", "unit-arrow is-next", "›");
    next.type = "button";
    next.id = "unit-next";
    next.disabled = reg.index >= regs.length - 1;
    next.setAttribute("aria-label", reg.index < regs.length - 1 ? "下一个单元：" + (regs[reg.index + 1].titleZh || "") : "已经是最后一个单元");
    next.onclick = function () { goUnit(1); };
    var sign = el("button", "region-sign");
    sign.type = "button";
    var re = el("span", "region-emoji");
    re.setAttribute("aria-hidden", "true");
    if (window.Icons) re.appendChild(window.Icons.el(window.Icons.region(reg.id))); else re.textContent = reg.emoji || "";
    sign.appendChild(re);
    var t = el("span", "region-title");
    var p0 = P();
    var stamped = !!(p0 && p0.stamps && p0.stamps()[reg.id]);
    t.appendChild(el("span", "region-kicker", "第 " + (reg.index + 1) + " 站" + (unlocked ? "" : " 🔒")));
    t.appendChild(document.createTextNode(reg.titleZh || ""));
    sign.appendChild(t);
    var rs = W.regionStars(reg);
    var meta = el("span", "region-meta", (stamped ? "📮 " : "") + levelsDone(reg) + "/" + reg.levels.length + " 关");
    meta.appendChild(document.createElement("br"));
    meta.appendChild(el("span", "story", "⭐ " + rs.got + "/" + rs.max));
    sign.appendChild(meta);
    sign.setAttribute("aria-label", "第 " + (reg.index + 1) + " 站：" + (reg.titleZh || "") + "，完成 " + levelsDone(reg) + " / " + reg.levels.length + " 关，" + rs.got + " 颗星。点这里看故事");
    sign.onclick = function () { storySheet(reg); };
    headRow.appendChild(prev);
    headRow.appendChild(sign);
    headRow.appendChild(next);
    sec.appendChild(headRow);
    var ind = el("button", "unit-ind");
    ind.type = "button";
    ind.id = "unit-ind";
    ind.setAttribute("aria-label", "第 " + (reg.index + 1) + " 个单元，共 " + regs.length + " 个。点这里选择单元");
    var dots = el("span", "unit-dots");
    dots.setAttribute("aria-hidden", "true");
    for (var d = 0; d < regs.length; d++) dots.appendChild(el("span", "unit-dot" + (d === reg.index ? " on" : "") + (W.regionUnlocked(regs[d]) ? "" : " off")));
    ind.appendChild(dots);
    ind.appendChild(el("span", "unit-ind-text", "第 " + (reg.index + 1) + " / " + regs.length + " 单元 ▾"));
    ind.onclick = unitListSheet;
    // 第二行：单元指示（点开选单元）+ “背一背本单元”（pages/memorize.html 背诵模式）
    var bar = el("div", "unit-bar");
    bar.appendChild(ind);
    var memo = el("a", "unit-memo", "📖 背一背本单元");
    memo.href = "pages/memorize.html#region=" + encodeURIComponent(reg.id) + "&kind=all";
    memo.id = "unit-memo";
    memo.setAttribute("aria-label", "背一背本单元：" + (reg.titleZh || "") + "的单词和句子");
    bar.appendChild(memo);
    sec.appendChild(bar);

    var path = el("div", "region-path");
    path.setAttribute("data-region", reg.id);
    for (var i = 0; i < reg.levels.length; i++) path.appendChild(nodeEl(reg.levels[i]));
    sec.appendChild(path);
    return sec;
  }

  function nodeEl(lv) {
    var unlocked = W.isUnlocked(lv);
    var st = W.starsOf(lv);
    var isLearn = lv.type === "learn";
    var done = W.isDone(lv);
    var isCur = cur && cur.id === lv.id && unlocked && !done;
    // 被已经过了的关“跳过”的背单词 / 复习关：可以补学（半透明 + 小标记），不挡路，气泡也不会拉回来
    var optional = W.isPractice(lv) && unlocked && !done && cur && lv.order < cur.order;
    var wrap = el("div", "node-wrap");
    wrap.setAttribute("data-level", lv.id);
    // 圆钮里的图案：普通关是白色星星（SVG），Boss 👑、对话任务 💬、没解锁 🔒
    var icon = !unlocked ? "🔒" : lv.type === "boss" ? "👑" : lv.type === "task" ? "💬" : isLearn ? (done ? "✅" : "📖") : lv.type === "review" ? "🔁" : "";
    if (lv.type === "boss") wrap.classList.add("is-boss");
    var b = el("button", "node" + (lv.type === "boss" ? " is-boss" : "") + (lv.type === "learn" ? " is-learn" : lv.type === "review" ? " is-review" : "") + (!unlocked ? " is-locked" : done ? " is-done" : "") + (isCur ? " is-current" : "") + (optional ? " is-optional" : ""));
    if (optional) wrap.classList.add("is-optional");
    if (icon) b.appendChild(el("span", "node-icon", icon)).setAttribute("aria-hidden", "true");
    else b.appendChild(starSvg());
    b.type = "button";
    b.id = "node-" + lv.id;
    b.setAttribute("aria-label", "第 " + (lv.index + 1) + " 关：" + (lv.titleZh || "") + "，" + TYPE_ZH[lv.type] + "，" + (!unlocked ? "还没解锁" : isLearn ? (done ? "学过了" : (optional ? "可以补学" : "还没学")) : st ? st + " 颗星" : (optional ? "可以补做" : "还没过关")));
    b.onclick = function () { if (swiper && swiper.justSwiped()) return; levelSheet(lv); };
    if (isCur) b.appendChild(el("span", "node-bubble", "开始 ▶")).setAttribute("aria-hidden", "true");
    wrap.appendChild(b);
    // 背单词 / 复习关的标题一般是“背句子：请和谢谢”这种：小标签放“：”前面的部分，标题只放后面的部分（不重复）
    var title = lv.titleZh || "", tag = "";
    var cut = W.isPractice(lv) ? title.search(/[：:]/) : -1;
    if (cut > 0) { tag = title.slice(0, cut); title = title.slice(cut + 1).replace(/^\s+/, ""); }
    else if (isLearn) tag = "背单词";
    else if (lv.type === "review") tag = "复习";
    var ss = el("div", "node-stars" + (W.isPractice(lv) ? " is-learn" : ""));
    ss.setAttribute("aria-hidden", "true");
    if (isLearn) ss.textContent = (done ? "✅ " : "📖 ") + tag + (optional ? " · 可补学" : "");
    else if (lv.type === "review" && !st) ss.textContent = "🔁 " + tag + (optional ? " · 可补做" : "");
    else for (var i = 0; i < 3; i++) ss.appendChild(el("span", i < st ? "on" : "", i < st ? "⭐" : "☆"));
    wrap.appendChild(ss);
    wrap.appendChild(el("div", "node-label", title || lv.titleZh || ""));
    return wrap;
  }

  function starSvg() {
    var s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    var pth = document.createElementNS(SVGNS, "path");
    pth.setAttribute("class", "node-star");
    pth.setAttribute("d", "M12 2.2l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 16.9l-5.9 3.3 1.3-6.6-4.9-4.5 6.6-.8z");
    pth.setAttribute("stroke-linejoin", "round");
    s.appendChild(pth);
    return s;
  }

  // 节点位置：左右摆动的曲线（宽度变了就重新算）
  // 地形景物不在第一次画地图时一起画（免得打开首页变慢）：地图先出来，然后每一帧画一个区域，离屏幕近的先画
  var terrainJobs = [], terrainTimer = null;
  function runTerrain() {
    if (terrainTimer) clearTimeout(terrainTimer);
    var vh = window.innerHeight || 700;
    terrainJobs.sort(function (a, b) {
      var ra = a.path.getBoundingClientRect(), rb = b.path.getBoundingClientRect();
      var da = ra.bottom < 0 ? -ra.bottom : ra.top > vh ? ra.top - vh : 0;
      var db = rb.bottom < 0 ? -rb.bottom : rb.top > vh ? rb.top - vh : 0;
      return da - db;
    });
    var step = function () {
      var j = terrainJobs.shift();
      if (!j) { terrainTimer = null; return; }
      try { window.Terrain.decorate(j.path, j.id, j.index, j.w, j.h, j.pts); } catch (e) {}
      terrainTimer = setTimeout(step, 16);
    };
    terrainTimer = setTimeout(step, 30);
  }
  // 阶段 20：蛇形格子。一行 cols 个（一行从左到右、下一行从右到左），列数按屏幕剩下的高度选：放得下就少用几列（更好看）。
  var CELL_MIN = 78, ROW_MIN = 96, ROW_MAX = 130, PAD_TOP = 10;
  function availHeight(path) {
    var top = path.getBoundingClientRect().top + window.pageYOffset;
    var nav = document.getElementById("bottom-nav");
    var nh = nav ? nav.getBoundingClientRect().height : 0; // 导航栏是 position: fixed（offsetParent 一直是 null，不能用它判断）
    return (window.innerHeight || 700) - top - nh - 26;
  }
  function layout() {
    terrainJobs = [];
    var paths = document.querySelectorAll(".region-path");
    for (var r = 0; r < paths.length; r++) {
      var path = paths[r];
      var nodes = path.querySelectorAll(".node-wrap");
      var n = nodes.length;
      var w = path.clientWidth || 320;
      var maxCols = Math.max(2, Math.min(7, Math.floor(w / CELL_MIN)));
      var rowsFit = Math.max(1, Math.floor((availHeight(path) - PAD_TOP) / ROW_MIN));
      var cols = Math.max(Math.min(3, maxCols), Math.min(maxCols, Math.ceil(n / rowsFit)));
      cols = Math.max(1, Math.min(cols, n));
      var avail = availHeight(path) - PAD_TOP;
      var rows, rowH, cellW;
      // 先定宽度，量一下最高的一格（标题三行时更高），行距至少要放得下它，不压到下一行；
      // 这样还放不下屏幕，就多用一列再试（最多到 maxCols）
      for (;;) {
        rows = Math.ceil(n / cols) || 1;
        cellW = w / cols;
        var tallest = 0;
        for (var q = 0; q < n; q++) {
          nodes[q].style.width = Math.floor(cellW - 4) + "px";
          tallest = Math.max(tallest, nodes[q].offsetHeight + (nodes[q].classList.contains("is-boss") ? 0 : 5));
        }
        rowH = Math.max(ROW_MIN, tallest + 3, Math.min(ROW_MAX, Math.floor(avail / rows)));
        if (rows * rowH <= avail || cols >= Math.min(maxCols, n)) break;
        cols++;
      }
      var pts = [];
      var old = path.querySelector("svg.trail-svg");
      if (old) path.removeChild(old);
      for (var i = 0; i < n; i++) {
        var row = Math.floor(i / cols), c = i % cols;
        if (row % 2 === 1) c = cols - 1 - c;
        var x = cellW * (c + 0.5);
        var isBoss = nodes[i].querySelector(".is-boss");
        var half = isBoss ? 32 : 27;
        var y = PAD_TOP + row * rowH + 32;
        nodes[i].style.left = x.toFixed(1) + "px";
        nodes[i].style.top = (y - half).toFixed(1) + "px";
        nodes[i].style.width = Math.floor(cellW - 4) + "px";
        nodes[i].style.marginLeft = (-Math.floor(cellW - 4) / 2).toFixed(1) + "px";
        nodes[i].classList.remove("bubble-left");
        pts.push({ x: x, y: y, row: row, done: !!nodes[i].querySelector(".is-done") });
      }
      var h = PAD_TOP + rows * rowH;
      path.style.height = h + "px";
      var svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("class", "trail-svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      for (var k = 1; k < pts.length; k++) {
        var a = pts[k - 1], b = pts[k], d;
        if (a.row === b.row) {
          // 同一行：微微弯一点的线
          d = "M" + a.x.toFixed(1) + " " + a.y.toFixed(1) + " Q" + ((a.x + b.x) / 2).toFixed(1) + " " + (a.y + (k % 2 ? 12 : -12)) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
        } else {
          // 换行：在这一侧往外绕一个弯
          var dir = b.x > w / 2 ? 1 : -1, bulge = Math.min(cellW * 0.5, 46);
          d = "M" + a.x.toFixed(1) + " " + a.y.toFixed(1) + " C" + (a.x + dir * bulge).toFixed(1) + " " + a.y.toFixed(1) + " " +
            (b.x + dir * bulge).toFixed(1) + " " + b.y.toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
        }
        var pe = document.createElementNS(SVGNS, "path");
        pe.setAttribute("d", d);
        pe.setAttribute("class", "trail" + (a.done ? " done" : ""));
        svg.appendChild(pe);
      }
      path.insertBefore(svg, path.firstChild);
      if (window.Terrain) {
        var rid = path.getAttribute("data-region");
        var rg = W.getRegion(rid);
        terrainJobs.push({ path: path, id: rid, index: rg ? rg.index : r, w: w, h: h, pts: pts });
      }
    }
    if (terrainJobs.length) runTerrain();
  }

  // 当前关卡在这个单元里、但在屏幕下面（例如 320×568 小屏）：滚一下让它看得见
  function scrollToCurrent() {
    if (!cur) return;
    var n = document.getElementById("node-" + cur.id);
    if (!n) return;
    var r = n.getBoundingClientRect();
    var nav = document.getElementById("bottom-nav");
    var bottom = window.innerHeight - (nav ? nav.getBoundingClientRect().height : 0) - 60;
    if (r.top >= 0 && r.bottom <= bottom) return;
    try { window.scrollTo(0, Math.max(0, window.pageYOffset + r.bottom - bottom)); } catch (e) {}
  }

  function renderAll(keep) {
    renderTop();
    renderHero();
    renderDaily();
    render(keep === true);
    var note = $("map-note");
    if (note) note.hidden = !W.isFallback();
  }
  // 电脑键盘：← → 换单元（弹出卡片开着、在输入框里时不管）
  document.addEventListener("keydown", function (e) {
    if (sheetBack || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var tg = e.target && e.target.tagName;
    if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT") return;
    if (e.key === "ArrowLeft") { goUnit(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { goUnit(1); e.preventDefault(); }
  });

  var t = null;
  window.addEventListener("resize", function () {
    if (t) clearTimeout(t);
    t = setTimeout(layout, 120);
  });
  window.addEventListener("progress-synced", function () { renderAll(true); });
  window.addEventListener("progress-xp", function () { renderTop(); renderHero(); });
  window.addEventListener("profile-changed", renderTop);
  window.addEventListener("pageshow", function (ev) { if (ev.persisted) { renderAll(); scrollToCurrent(); } });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") { renderTop(); renderDaily(); } });

  renderAll();
  scrollToCurrent();
  window.MapView = { render: renderAll, layout: layout, levelSheet: levelSheet, storySheet: storySheet, closeSheet: closeSheet,
    goUnit: goUnit, jumpUnit: jumpUnit, unitIndex: function () { return unitIdx; }, unitList: unitListSheet };
})();
