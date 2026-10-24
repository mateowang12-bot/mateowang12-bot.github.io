// ============================================
// 冒险地图（map.js）—— 首页 index.html 用（阶段 11）
// 要在 storage.js、world.js 之后引入。页面里要有 #map-top、#daily-box、#map。
//
// 地图从上往下走：每个区域一块浅色背景带 + 标题牌（点开看故事），区域里的关卡是一条弯曲虚线上的圆形节点。
//   普通关：数字；对话任务关：💬；Boss 关：👑（更大）；锁住：🔒；过了：黄色 + 下面的星星 ⭐⭐☆。
//   当前该玩的关卡上方有跳动的“开始”气泡；打开页面时自动滚到它。
// 点关卡 → 弹出关卡卡片（标题、简介、题型、最好成绩）→ “开始” → pages/play.html#level=关卡id
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
  var TYPE_ZH = { normal: "关卡", task: "对话任务", boss: "Boss 挑战" };

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
    var a = el("a", "map-avatar", av.emoji);
    a.href = "pages/collection.html";
    a.id = "map-avatar";
    a.setAttribute("aria-label", "我的头像：" + av.zh + "。点这里换头像 / Change avatar");
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
    chip(streak ? "is-streak" : "is-zero", "🔥 " + streak, "pages/me.html", "连续学习 " + streak + " 天 / Streak", "chip-streak");
    chip(xp >= goal ? "is-streak" : "", "⭐ " + xp + "/" + goal + " XP", "pages/me.html", "今天 " + xp + " / " + goal + " 经验值 / Today's XP", "chip-xp");
    chip("", rk.cur.emoji + " " + rk.cur.zh, "pages/me.html", "段位：" + rk.cur.zh + " / Rank: " + rk.cur.en, "chip-rank");
    chip("", "⭐×" + stars, "pages/collection.html", "一共 " + stars + " 颗星 / Stars", "chip-stars");
    if (chest > 0) chip("is-chest", "🎁 " + chest, "pages/collection.html", "有 " + chest + " 个宝箱可以打开 / Open chests", "chip-chest");
    box.appendChild(chips);
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
    t.appendChild(el("div", "daily-title", "每日挑战 · Daily"));
    t.appendChild(el("div", "daily-sub", done ? "今天已完成 ✓ 还可以再练（奖励每天一次）" : "10 道混合题 · 通关 +30 XP、+3 ⭐"));
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
    var b = el("button", "btn btn-light", text || "关闭 / Close");
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
      sh.appendChild(el("div", "sheet-kicker", (lv.region.emoji || "") + " " + (lv.region.titleZh || "") + " · 第 " + (lv.index + 1) + " 关 · " + TYPE_ZH[lv.type]));
      var t = el("div", "sheet-title", (lv.type === "boss" ? "👑 " : lv.type === "task" ? "💬 " : "") + (lv.titleZh || ""));
      if (lv.titleEn) t.appendChild(el("span", "en", lv.titleEn));
      sh.appendChild(t);
      if (lv.introZh) sh.appendChild(el("p", "", lv.introZh));
      if (lv.introEn) sh.appendChild(el("p", "en", lv.introEn));
      var mi = el("div", "mode-icons");
      for (var i = 0; i < lv.modes.length; i++) {
        var m = W.MODE_INFO[lv.modes[i]];
        if (m) mi.appendChild(el("span", "mode-icon", m.icon + " " + m.zh));
      }
      sh.appendChild(mi);
      if (rec && rec.stars) sh.appendChild(el("p", "sheet-best", "最好成绩：" + starsText(rec.stars) + " · 正确率 " + rec.best + "% · 玩过 " + rec.plays + " 次"));
      else if (unlocked) sh.appendChild(el("p", "small-tip", "还没过关。❤️ × 5，答错一次少一颗。"));
      if (!unlocked) sh.appendChild(el("p", "small-tip", "🔒 还没解锁：先过前一关（至少 1 颗星）。 / Locked — clear the previous level first."));
      var acts = el("div", "sheet-actions");
      if (unlocked) {
        var go = el("a", "btn", (rec && rec.stars ? "再玩一次 / Play again ▶" : "开始 / Start ▶"));
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
      sh.appendChild(el("div", "sheet-kicker", "第 " + (reg.index + 1) + " 站 · Stop " + (reg.index + 1)));
      var t = el("div", "sheet-title", (reg.emoji ? reg.emoji + " " : "") + (reg.titleZh || ""));
      if (reg.titleEn) t.appendChild(el("span", "en", reg.titleEn));
      sh.appendChild(t);
      if (reg.storyZh) sh.appendChild(el("p", "", reg.storyZh));
      if (reg.storyEn) sh.appendChild(el("p", "en", reg.storyEn));
      if (reg.npc && reg.npc.name) {
        var n = el("div", "npc");
        n.appendChild(el("div", "npc-emoji", reg.npc.emoji || "🙂"));
        var tx = el("div", "");
        tx.appendChild(el("div", "npc-name", reg.npc.name));
        tx.appendChild(el("div", "", (reg.npc.roleZh || "") + (reg.npc.roleEn ? " / " + reg.npc.roleEn : "")));
        n.appendChild(tx);
        sh.appendChild(n);
      }
      var p = P();
      var got = p ? p.stamps()[reg.id] : 0;
      if (reg.stampZh) sh.appendChild(el("p", "small-tip", (got ? "✓ 已获得护照邮票：" : "打败本站 Boss 可以得到护照邮票：") + reg.stampZh + (reg.stampEn ? " / " + reg.stampEn : "")));
      var acts = el("div", "sheet-actions");
      acts.appendChild(closeBtn("好的 / OK"));
      sh.appendChild(acts);
    }, "故事：" + (reg.titleZh || ""));
  }

  // ---------- 地图 ----------
  var cur = null;
  function render() {
    var box = $("map");
    box.innerHTML = "";
    var regs = W.regions();
    cur = W.current();
    for (var r = 0; r < regs.length; r++) box.appendChild(regionEl(regs[r]));
    layout();
  }

  function regionEl(reg) {
    var unlocked = W.regionUnlocked(reg);
    var sec = el("section", "region" + (unlocked ? "" : " is-locked"));
    sec.id = "region-" + reg.id;
    sec.setAttribute("aria-label", "第 " + (reg.index + 1) + " 站：" + (reg.titleZh || ""));
    var sign = el("button", "region-sign");
    sign.type = "button";
    sign.appendChild(el("span", "region-emoji", reg.emoji || "📍")).setAttribute("aria-hidden", "true");
    var t = el("span", "region-title", reg.titleZh || "");
    if (reg.titleEn) t.appendChild(el("span", "en", reg.titleEn));
    sign.appendChild(t);
    var rs = W.regionStars(reg);
    var meta = el("span", "region-meta", "⭐ " + rs.got + "/" + rs.max);
    meta.appendChild(document.createElement("br"));
    meta.appendChild(el("span", "story", unlocked ? "📖 故事" : "🔒"));
    sign.appendChild(meta);
    sign.onclick = function () { storySheet(reg); };
    sec.appendChild(sign);

    var path = el("div", "region-path");
    path.setAttribute("data-region", reg.id);
    for (var i = 0; i < reg.levels.length; i++) path.appendChild(nodeEl(reg.levels[i]));
    sec.appendChild(path);
    return sec;
  }

  function nodeEl(lv) {
    var unlocked = W.isUnlocked(lv);
    var st = W.starsOf(lv);
    var isCur = cur && cur.id === lv.id && unlocked && st < 1;
    var wrap = el("div", "node-wrap");
    wrap.setAttribute("data-level", lv.id);
    var icon = !unlocked ? "🔒" : lv.type === "boss" ? "👑" : lv.type === "task" ? "💬" : String(lv.index + 1);
    var b = el("button", "node" + (lv.type === "boss" ? " is-boss" : "") + (!unlocked ? " is-locked" : st ? " is-done" : "") + (isCur ? " is-current" : ""), icon);
    b.type = "button";
    b.id = "node-" + lv.id;
    b.setAttribute("aria-label", (lv.titleZh || "") + "，" + TYPE_ZH[lv.type] + "，" + (!unlocked ? "还没解锁" : st ? st + " 颗星" : "还没过关"));
    b.onclick = function () { levelSheet(lv); };
    if (isCur) b.appendChild(el("span", "node-bubble", "开始 ▶")).setAttribute("aria-hidden", "true");
    wrap.appendChild(b);
    var ss = el("div", "node-stars");
    ss.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 3; i++) ss.appendChild(el("span", i < st ? "on" : "", i < st ? "⭐" : "☆"));
    wrap.appendChild(ss);
    wrap.appendChild(el("div", "node-label", lv.titleZh || ""));
    return wrap;
  }

  // 节点位置：左右摆动的曲线（宽度变了就重新算）
  function layout() {
    var paths = document.querySelectorAll(".region-path");
    for (var r = 0; r < paths.length; r++) {
      var path = paths[r];
      var nodes = path.querySelectorAll(".node-wrap");
      var w = path.clientWidth || 320;
      // 左右摆动幅度：节点块宽 140px，不能超出地图；宽屏时最大 200px
      var amp = Math.max(0, Math.min(200, (w - 150) / 2));
      var pts = [];
      var old = path.querySelector("svg");
      if (old) path.removeChild(old);
      for (var i = 0; i < nodes.length; i++) {
        var x = w / 2 + amp * Math.sin(i * 1.15 + r * 0.7);
        var y = TOP + i * ROW;
        var isBoss = nodes[i].querySelector(".is-boss");
        var half = isBoss ? 38 : 32;
        nodes[i].style.left = x.toFixed(1) + "px";
        nodes[i].style.top = (y - half).toFixed(1) + "px";
        // “开始”气泡放在朝地图中间的那一侧（节点在右半边 → 气泡在左边）
        nodes[i].classList.toggle("bubble-left", x > w / 2 + 1);
        pts.push({ x: x, y: y, done: !!nodes[i].querySelector(".is-done") });
      }
      path.style.height = (TOP + (nodes.length - 1) * ROW + 116) + "px";
      var svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      for (var k = 1; k < pts.length; k++) {
        var a = pts[k - 1], b = pts[k];
        var d = "M" + a.x.toFixed(1) + " " + a.y.toFixed(1) + " C" + a.x.toFixed(1) + " " + (a.y + ROW / 2).toFixed(1) + " " +
          b.x.toFixed(1) + " " + (b.y - ROW / 2).toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
        var pe = document.createElementNS(SVGNS, "path");
        pe.setAttribute("d", d);
        pe.setAttribute("class", "trail" + (a.done ? " done" : ""));
        svg.appendChild(pe);
      }
      path.insertBefore(svg, path.firstChild);
    }
  }

  function scrollToCurrent() {
    if (!cur) return;
    var n = document.getElementById("node-" + cur.id);
    if (!n) return;
    var r = n.getBoundingClientRect();
    var y = window.pageYOffset + r.top - window.innerHeight / 2 + r.height / 2;
    if (cur.order === 0) return; // 第一关就在页面上方，不用滚
    try { window.scrollTo(0, Math.max(0, y)); } catch (e) {}
  }

  function renderAll() {
    renderTop();
    renderDaily();
    render();
    var note = $("map-note");
    if (note) note.hidden = !W.isFallback();
  }

  var t = null;
  window.addEventListener("resize", function () {
    if (t) clearTimeout(t);
    t = setTimeout(layout, 120);
  });
  window.addEventListener("progress-synced", renderAll);
  window.addEventListener("progress-xp", renderTop);
  window.addEventListener("profile-changed", renderTop);
  window.addEventListener("pageshow", function (ev) { if (ev.persisted) { renderAll(); scrollToCurrent(); } });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") { renderTop(); renderDaily(); } });

  renderAll();
  scrollToCurrent();
  window.MapView = { render: renderAll, layout: layout, levelSheet: levelSheet, storySheet: storySheet, closeSheet: closeSheet };
})();
