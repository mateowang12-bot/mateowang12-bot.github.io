// ============================================
// 挑战码 PK（duel.js）—— pages/game-duel.html 专用（阶段 17）
// 和朋友比分：不用同时在线、不用联网、不用登录。
//   发起挑战：昵称 → 选范围 → 10 道题（看西语选中文 / 看中文选西语 / 听音选西语）→ 生成挑战码 + 挑战链接
//   接受挑战：粘贴挑战码（或从链接 #c=… 进来）→ 做完全一样的 10 道题 → 对比结果 + 回复码
//   发起人粘贴回复码 → 看到同样的对比结果（自动认出是挑战码还是回复码）
//
// 挑战码格式："ZZ1:" + base64url(JSON 的 UTF-8) + "." + 6 位校验码（FNV-1a，36 进制）
//   JSON = { v: 1, t: "c"（挑战）/ "r"（回复）, n: 发起人昵称, s: 种子（也当这场挑战的编号）,
//            q: "题型,正确选项位置,选项id,选项id,…;…"（题型 0 看西语选中文 / 1 看中文选西语 / 2 听音选西语；
//               选项 id 和顺序直接写进码里，两边一定一样，不靠两边的数据版本相同），
//            a: [发起人答对几题, 用时（0.1 秒）, "1101…"（每题对错）],
//            b: [对方昵称, 答对几题, 用时, "每题对错"]（只有回复码有） }
//   链接永远指向 GitHub Pages 版（朋友打不开本地文件和私密的 claude.ai 版）。
//
// 本机存储（都包在 try/catch 里，读写失败照样能玩）：
//   es-study-duel-name      昵称
//   es-study-duel-history   最近 20 场战绩（不进学习进度、不同步）
// 经验值：和其他小游戏一样，做完一局用 GameKit.record("duel", 答对题数, 至少答对 1 题) → 每局 gameDone。
// ============================================
(function () {
  var U = window.WordsUtil, K = window.GameKit;
  var el = U.el;
  function $(id) { return document.getElementById(id); }

  var N_Q = 10;
  var CODE_VER = 1;
  var PREFIX = "ZZ" + CODE_VER + ":";
  var NAME_KEY = "es-study-duel-name";
  var HIST_KEY = "es-study-duel-history";
  var HIST_MAX = 20;
  var NAME_MAX = 8;
  var SITE_URL = "https://mateowang12-bot.github.io/pages/game-duel.html";
  var TYPE_ZH = ["看西语选中文", "看中文选西语", "听音选西语"];

  // ---------- localStorage（失败也没关系） ----------
  function lsGet(k) { try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (e) { return null; } }
  function lsSet(k, v) { try { if (window.localStorage) window.localStorage.setItem(k, v); } catch (e) {} }

  // ---------- 小工具 ----------
  function chars(s) {
    s = String(s || "");
    if (Array.from) return Array.from(s);
    return s.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || [];
  }
  function cleanName(s) {
    s = String(s == null ? "" : s).replace(/[\u0000-\u001f\u007f-\u009f<>]/g, "").replace(/\s+/g, " ").replace(/^ | $/g, "");
    return chars(s).slice(0, NAME_MAX).join("");
  }
  function fmtTime(ds) { return (Math.max(0, Number(ds) || 0) / 10).toFixed(1) + " 秒"; }
  function countOnes(bits) { var n = 0; for (var i = 0; i < bits.length; i++) if (bits.charAt(i) === "1") n++; return n; }
  function meaning(w) { return w.zh || w.en || ""; }

  // 可以重现的随机数（mulberry32）
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul ? Math.imul(t ^ (t >>> 15), t | 1) : ((t ^ (t >>> 15)) * (t | 1)) >>> 0;
      t ^= t + (Math.imul ? Math.imul(t ^ (t >>> 7), t | 61) : ((t ^ (t >>> 7)) * (t | 61)) >>> 0);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function newSeed() {
    var s = 0;
    try {
      if (window.crypto && window.crypto.getRandomValues) {
        var a = new Uint32Array(1);
        window.crypto.getRandomValues(a);
        s = a[0];
      }
    } catch (e) {}
    if (!s) s = Math.floor(Math.random() * 4294967295);
    return (s >>> 0) || 1;
  }

  // ---------- UTF-8 ↔ base64url ----------
  function toB64url(str) {
    var bin = "";
    if (window.TextEncoder) {
      var bytes = new TextEncoder().encode(str);
      for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    } else {
      bin = unescape(encodeURIComponent(str));
    }
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function fromB64url(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    var bin = atob(s); // 坏的 base64 会抛错
    if (window.TextDecoder) {
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    }
    return decodeURIComponent(escape(bin));
  }
  // 简单校验码：FNV-1a 32 位 → 36 进制，补足 6 位（防止复制不全）
  function checksum(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul ? Math.imul(h, 0x01000193) : (h * 0x01000193) | 0;
    }
    var t = ((h >>> 0) % 2176782336).toString(36); // 36^6：保证最多 6 位
    while (t.length < 6) t = "0" + t;
    return t;
  }

  // ---------- 内容（单词 + 句子） ----------
  var allWords = U.collectWords(), allPhrases = U.collectPhrases();
  var BY_ID = {};
  (function () {
    var all = allWords.concat(allPhrases);
    for (var i = 0; i < all.length; i++) if (all[i].word.id) BY_ID[all[i].word.id] = all[i];
  })();

  // ---------- 出题（发起人） ----------
  // 种子决定：选哪 10 个、题型、干扰项（遵守 WordsUtil 的撞车判断和互斥表）、选项顺序
  function buildQuestions(pool, everything, seed) {
    var rnd = rng(seed);
    var usable = [];
    for (var u = 0; u < pool.length; u++) if (pool[u].word.id) usable.push(pool[u]);
    if (!usable.length) return [];
    var picked = U.shuffled(usable, rnd).slice(0, N_Q);
    // 范围里不够 10 个：再洗一遍补上（不和上一题一样）
    var guard = 0;
    while (picked.length < N_Q && guard++ < 50) {
      var more = U.shuffled(usable, rnd);
      for (var m = 0; m < more.length && picked.length < N_Q; m++) {
        if (usable.length > 1 && more[m] === picked[picked.length - 1]) continue;
        picked.push(more[m]);
      }
    }
    // 三种题型混合：每种至少 3 道，第 10 道随机
    var types = [0, 0, 0, 1, 1, 1, 2, 2, 2, Math.floor(rnd() * 3)];
    types = U.shuffled(types, rnd).slice(0, picked.length);
    var qs = [];
    for (var i = 0; i < picked.length; i++) {
      var item = picked[i];
      var opts = U.shuffled([item].concat(U.pickDistractors(item, everything, 3, rnd)), rnd);
      qs.push({ type: types[i], opts: opts, c: opts.indexOf(item) });
    }
    return qs;
  }
  function encodeQs(qs) {
    var parts = [];
    for (var i = 0; i < qs.length; i++) {
      var ids = [];
      for (var j = 0; j < qs[i].opts.length; j++) ids.push(qs[i].opts[j].word.id);
      parts.push(qs[i].type + "," + qs[i].c + "," + ids.join(","));
    }
    return parts.join(";");
  }

  // ---------- 生成 / 解析挑战码 ----------
  function makeCode(d) {
    var payload = toB64url(JSON.stringify(d));
    return PREFIX + payload + "." + checksum(payload);
  }
  function codeLink(code) { return SITE_URL + "#c=" + code; }

  // → { ok: true, d, qs, kind: "c"/"r" } 或 { ok: false, err: 中文提示 }
  var ERR_BROKEN = "挑战码不完整，可能没有复制全。请让朋友重新复制一次完整的码（或整段消息）再粘贴。";
  var ERR_NEWER = "对方的网站比你的新，请刷新或更新后再试。";
  function parseCode(text) {
    var t = String(text == null ? "" : text);
    if (/%3A|%2E/i.test(t)) { try { t = decodeURIComponent(t); } catch (e) {} } // 有的 App 会把链接里的 : 编成 %3A
    t = t.replace(/\s+/g, "");
    if (!t) return { ok: false, err: "请先把挑战码粘贴到上面的框里。" };
    var m = /ZZ(\d+):([A-Za-z0-9_-]*)(?:\.([0-9a-z]{6}))?/.exec(t);
    if (!m) {
      if (/ES1:/.test(t)) return { ok: false, err: "这是“搬家码”（用来换设备的），不是挑战码。搬家码请到“我的”页导入。" };
      return { ok: false, err: "这不是挑战码。挑战码是以 ZZ1: 开头的一长串字母。" };
    }
    if (Number(m[1]) > CODE_VER) return { ok: false, err: "这个挑战码的版本太新：" + ERR_NEWER };
    if (Number(m[1]) !== CODE_VER) return { ok: false, err: "这不是挑战码。挑战码是以 ZZ1: 开头的一长串字母。" };
    if (!m[2] || !m[3] || checksum(m[2]) !== m[3]) return { ok: false, err: ERR_BROKEN };
    var d;
    try { d = JSON.parse(fromB64url(m[2])); } catch (e) { return { ok: false, err: ERR_BROKEN }; }
    if (!d || typeof d !== "object") return { ok: false, err: ERR_BROKEN };
    if (Number(d.v) > CODE_VER) return { ok: false, err: "这个挑战码的版本太新：" + ERR_NEWER };
    if (d.t !== "c" && d.t !== "r") return { ok: false, err: ERR_BROKEN };
    if (typeof d.n !== "string" || typeof d.q !== "string" || typeof d.s !== "number") return { ok: false, err: ERR_BROKEN };
    // 题目
    var raw = d.q.split(";"), qs = [], missing = false;
    if (raw.length < 1 || raw.length > 20) return { ok: false, err: ERR_BROKEN };
    for (var i = 0; i < raw.length; i++) {
      var f = raw[i].split(",");
      var type = Number(f[0]), c = Number(f[1]), ids = f.slice(2);
      if (!(type === 0 || type === 1 || type === 2) || ids.length < 2 || ids.length > 4 || !(c >= 0 && c < ids.length) || Math.floor(c) !== c) return { ok: false, err: ERR_BROKEN };
      var opts = [];
      for (var j = 0; j < ids.length; j++) {
        if (!/^[a-z0-9-]{1,40}$/.test(ids[j])) return { ok: false, err: ERR_BROKEN };
        var it = BY_ID[ids[j]];
        if (!it) missing = true;
        opts.push(it || null);
      }
      qs.push({ type: type, opts: opts, c: c });
    }
    // 成绩
    function side(arr, withName) {
      if (!arr || typeof arr.length !== "number") return null;
      var o = withName ? 1 : 0;
      var r = { n: withName ? arr[0] : d.n, sc: arr[o], tm: arr[o + 1], bits: arr[o + 2] };
      if (typeof r.n !== "string" || typeof r.bits !== "string" || r.bits.length !== qs.length || !/^[01]+$/.test(r.bits)) return null;
      if (r.sc !== countOnes(r.bits) || typeof r.tm !== "number" || r.tm < 0 || r.tm > 1e7) return null;
      r.n = cleanName(r.n) || "朋友";
      return r;
    }
    var host = side(d.a, false);
    if (!host) return { ok: false, err: ERR_BROKEN };
    var guest = null;
    if (d.t === "r") {
      guest = side(d.b, true);
      if (!guest) return { ok: false, err: ERR_BROKEN };
    }
    if (missing) return { ok: false, err: "里面有这个网站还没有的内容：" + ERR_NEWER };
    return { ok: true, d: d, qs: qs, kind: d.t, id: (d.s >>> 0).toString(36), host: host, guest: guest };
  }

  // ---------- 战绩（本机最近 20 场） ----------
  // 每一条：{ k, cid, role: "host"/"guest", me, opp, ms, mt, os, ot, res: "win"/"lose"/"tie"/"pending", at, code }
  function loadHist() {
    try {
      var v = JSON.parse(lsGet(HIST_KEY) || "[]");
      if (!v || typeof v.length !== "number") return [];
      var out = [];
      for (var i = 0; i < v.length; i++) if (v[i] && typeof v[i] === "object" && typeof v[i].k === "string") out.push(v[i]);
      return out;
    } catch (e) { return []; }
  }
  function saveHist(list) {
    list.sort(function (a, b) { return (b.at || 0) - (a.at || 0); });
    lsSet(HIST_KEY, JSON.stringify(list.slice(0, HIST_MAX)));
  }
  function findHist(list, k) { for (var i = 0; i < list.length; i++) if (list[i].k === k) return list[i]; return null; }
  function outcome(me, opp) {
    if (me.sc !== opp.sc) return me.sc > opp.sc ? "win" : "lose";
    if (me.tm !== opp.tm) return me.tm < opp.tm ? "win" : "lose";
    return "tie";
  }
  // 发起人做完：记一条“等朋友回复”
  function histHostPending(p, code) {
    var list = loadHist();
    if (findHist(list, "h:" + p.id)) return;
    list.push({ k: "h:" + p.id, cid: p.id, role: "host", me: p.host.n, opp: "", ms: p.host.sc, mt: p.host.tm, os: 0, ot: 0, res: "pending", at: Date.now(), code: code });
    saveHist(list);
  }
  // 看到一场完整的对比（回复码）：按身份记下 / 更新（同一场不重复记）
  function histResult(p, role, replyCode) {
    var list = loadHist();
    var me = role === "host" ? p.host : p.guest, opp = role === "host" ? p.guest : p.host;
    var res = outcome(me, opp);
    var rec = { cid: p.id, role: role, me: me.n, opp: opp.n, ms: me.sc, mt: me.tm, os: opp.sc, ot: opp.tm, res: res, at: Date.now(), code: replyCode };
    if (role === "guest") {
      if (findHist(list, "g:" + p.id)) return false;
      rec.k = "g:" + p.id;
      list.push(rec);
    } else {
      // 同一位朋友的同一份回复只记一次；第一份回复填进“等朋友回复”那一条
      var k2 = "h:" + p.id + ":" + checksum(opp.n + "|" + opp.tm + "|" + opp.bits);
      if (findHist(list, k2)) return false;
      var pend = findHist(list, "h:" + p.id);
      if (pend && pend.res === "pending") {
        for (var key in rec) if (Object.prototype.hasOwnProperty.call(rec, key)) pend[key] = rec[key];
        pend.k = k2;
      } else {
        rec.k = k2;
        list.push(rec);
      }
    }
    saveHist(list);
    return true;
  }
  // 这一场挑战我是什么身份：本机有接受过的记录 → guest；否则 host
  function myRole(p) {
    var list = loadHist();
    if (findHist(list, "g:" + p.id)) return "guest";
    for (var i = 0; i < list.length; i++) if (list[i].cid === p.id && list[i].role === "host") return "host";
    return "host";
  }
  function isMine(p) {
    var list = loadHist();
    for (var i = 0; i < list.length; i++) if (list[i].cid === p.id && list[i].role === "host") return true;
    return false;
  }

  // ---------- 界面：切换画面 ----------
  var SCREENS = ["home", "create", "accept", "preview", "play", "hostdone", "compare"];
  function show(name) {
    for (var i = 0; i < SCREENS.length; i++) $("s-" + SCREENS[i]).hidden = SCREENS[i] !== name;
    window.scrollTo(0, 0);
    if (name === "home") renderRecord();
  }
  function say(box, msg, warn) {
    box.textContent = msg || "";
    box.className = "cloud-status" + (warn ? " is-warn" : "");
  }
  function loadName() { return cleanName(lsGet(NAME_KEY) || ""); }
  function saveName(n) { if (n) lsSet(NAME_KEY, n); }
  function mark(ok) {
    var box = el("span", "duel-mark " + (ok ? "is-ok" : "is-bad"));
    if (window.Icons) box.appendChild(window.Icons.el(ok ? "check" : "cross", "", ok ? "答对" : "答错"));
    else box.textContent = ok ? "对" : "错";
    return box;
  }

  // ---------- 首页：战绩 ----------
  function renderRecord() {
    var box = $("record-box");
    box.innerHTML = "";
    var list = loadHist();
    var w = 0, l = 0, t = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].res === "win") w++; else if (list[i].res === "lose") l++; else if (list[i].res === "tie") t++;
    }
    box.appendChild(el("h2", "", "战绩：" + w + " 胜 " + l + " 负 " + t + " 平"));
    if (!list.length) {
      box.appendChild(el("p", "muted", "还没有比过。发起一个挑战，发给朋友试试吧！"));
      return;
    }
    box.appendChild(el("p", "small-tip", "只保存在这台设备上（最近 " + HIST_MAX + " 场）。点一场可以再看一次。"));
    var ul = el("ul", "duel-hist");
    for (var j = 0; j < list.length && j < 8; j++) {
      (function (r) {
        var li = el("li");
        var b = el("button", "duel-hist-item is-" + r.res);
        b.type = "button";
        var tag = r.res === "win" ? "胜" : r.res === "lose" ? "负" : r.res === "tie" ? "平" : "等回复";
        b.appendChild(el("span", "duel-hist-tag", tag));
        var main = el("span", "duel-hist-main");
        if (r.res === "pending") {
          main.appendChild(el("span", "duel-hist-title", "我发起的挑战"));
          main.appendChild(el("span", "duel-hist-sub", "我答对 " + r.ms + " 题 · " + fmtTime(r.mt) + " · 等朋友发回复码"));
        } else {
          main.appendChild(el("span", "duel-hist-title", (r.role === "host" ? "我 对 " : "我 接受 ") + (r.opp || "朋友")));
          main.appendChild(el("span", "duel-hist-sub", "我 " + r.ms + " : " + r.os + " " + (r.opp || "朋友") + " · " + fmtTime(r.mt) + " / " + fmtTime(r.ot)));
        }
        b.appendChild(main);
        b.onclick = function () { openHist(r); };
        li.appendChild(b);
        ul.appendChild(li);
      })(list[j]);
    }
    box.appendChild(ul);
  }
  function openHist(r) {
    var p = parseCode(r.code || "");
    if (!p.ok) { show("accept"); say($("accept-msg"), p.err, true); return; }
    if (p.kind === "c") showHostDone(p, r.code);
    else showCompare(p, r.role, r.code, false);
  }

  // ---------- 发起挑战 ----------
  var scope = null;
  function goCreate() {
    $("create-name").value = loadName();
    say($("create-msg"), "");
    show("create");
  }
  function startCreate() {
    var n = cleanName($("create-name").value);
    if (!n) { say($("create-msg"), "请先写一个昵称（最多 " + NAME_MAX + " 个字），朋友才知道是谁发的挑战。", true); $("create-name").focus(); return; }
    var pool = scope ? scope.items() : [];
    if (!pool.length) { say($("create-msg"), "请至少选一项范围。", true); return; }
    saveName(n);
    $("create-name").value = n;
    var seed = newSeed();
    var qs = buildQuestions(pool, allWords.concat(allPhrases), seed);
    if (!qs.length) { say($("create-msg"), "选中的范围里没有可以出题的内容。", true); return; }
    startGame({ mode: "host", name: n, seed: seed, qs: qs, ch: null });
  }

  // ---------- 接受挑战（粘贴 / 链接进来） ----------
  var pending = null; // 解析好、等开始的挑战
  function goAccept() {
    say($("accept-msg"), "");
    show("accept");
    try { $("accept-text").focus(); } catch (e) {}
  }
  function handleCode(text, fromLink) {
    var p = parseCode(text);
    if (!p.ok) {
      show("accept");
      if (fromLink) $("accept-text").value = text;
      say($("accept-msg"), p.err, true);
      return;
    }
    if (p.kind === "r") {
      var role = myRole(p);
      var code = makeCode(p.d);
      showCompare(p, role, code, true);
      return;
    }
    // 挑战码
    var list = loadHist();
    var done = findHist(list, "g:" + p.id);
    if (done && done.code) {
      var p2 = parseCode(done.code);
      if (p2.ok) { showCompare(p2, "guest", done.code, false, "你已经接受过这个挑战了，下面是当时的结果。"); return; }
    }
    if (isMine(p)) {
      showHostDone(p, makeCode(p.d), "这是你自己发起的挑战码。把它发给朋友，等朋友做完把回复码发回来。");
      return;
    }
    pending = p;
    var box = $("preview-card");
    box.innerHTML = "";
    if (window.Mascot) box.appendChild(window.Mascot.el("hello", "is-small"));
    var t = el("div", "duel-preview-text");
    t.appendChild(el("strong", "duel-name", p.host.n));
    t.appendChild(document.createTextNode(" 向你发起挑战："));
    t.appendChild(el("div", "duel-preview-line", p.qs.length + " 题，答对 " + p.host.sc + " 题，用时 " + fmtTime(p.host.tm)));
    box.appendChild(t);
    $("preview-name").value = loadName();
    say($("preview-msg"), "");
    show("preview");
  }
  function startAccept() {
    if (!pending) { show("accept"); return; }
    var n = cleanName($("preview-name").value);
    if (!n) { say($("preview-msg"), "请先写一个昵称（最多 " + NAME_MAX + " 个字）。", true); $("preview-name").focus(); return; }
    saveName(n);
    var p = pending;
    var qs = [];
    for (var i = 0; i < p.qs.length; i++) qs.push({ type: p.qs[i].type, opts: p.qs[i].opts, c: p.qs[i].c });
    startGame({ mode: "guest", name: n, seed: p.d.s, qs: qs, ch: p });
  }

  // ---------- 做题 ----------
  var G = null, tick = null;
  function startGame(g) {
    G = g;
    G.idx = 0;
    G.bits = "";
    G.ms = 0;
    G.qStart = 0;
    G.answered = false;
    $("play-goal").textContent = g.mode === "guest" ? g.ch.host.n + "：答对 " + g.ch.host.sc + " 题 · " + fmtTime(g.ch.host.tm) : "";
    $("play-goal").hidden = g.mode !== "guest";
    show("play");
    showQuestion();
    if (tick) clearInterval(tick);
    tick = setInterval(updateClock, 100);
  }
  function now() { return window.performance && performance.now ? performance.now() : Date.now(); }
  function elapsed() { return G.ms + (G.answered ? 0 : Math.max(0, now() - G.qStart)); }
  function updateClock() {
    if (!G || $("s-play").hidden) return;
    $("play-time").textContent = fmtTime(Math.floor(elapsed() / 100));
  }
  function showQuestion() {
    var q = G.qs[G.idx];
    var item = q.opts[q.c], w = item.word;
    G.answered = false;
    $("play-progress").textContent = "第 " + (G.idx + 1) + " / " + G.qs.length + " 题";
    var box = $("q-box");
    box.innerHTML = "";
    if (q.type === 0) {
      box.appendChild(el("div", "quiz-prompt-label", "这是什么意思？"));
      var es = el("div", "quiz-prompt-es fit-word" + (item.kind === "phrase" ? " is-phrase" : ""), w.es);
      es.setAttribute("lang", "es");
      box.appendChild(es);
      box.appendChild(U.sayButton(w.es, "听"));
    } else if (q.type === 1) {
      box.appendChild(el("div", "quiz-prompt-label", "西语怎么说？"));
      box.appendChild(el("div", "quiz-prompt-meaning", meaning(w)));
    } else {
      box.appendChild(el("div", "quiz-prompt-label", "听一听，选出你听到的西语"));
      var play = U.sayButton(w.es, "再听一次");
      play.className += " quiz-play";
      box.appendChild(play);
      var help = el("button", "btn btn-light btn-small duel-nohear", "听不到声音？看中文提示");
      help.type = "button";
      help.onclick = function () {
        var z = el("div", "quiz-prompt-meaning duel-hint-zh", meaning(w));
        help.parentNode.replaceChild(z, help);
      };
      box.appendChild(help);
      // 这里是从“开始 / 下一题”的点击里同步调用过来的，iPhone 也能出声
      if (window.speakSpanish) window.speakSpanish(w.es);
    }
    var ob = $("q-options");
    ob.innerHTML = "";
    var showEs = q.type !== 0;
    for (var i = 0; i < q.opts.length; i++) {
      (function (idx) {
        var ow = q.opts[idx].word;
        var b = el("button", "quiz-option");
        b.type = "button";
        b.appendChild(el("span", "quiz-option-num", String(idx + 1)));
        var tx = el("span", "quiz-option-text", showEs ? ow.es : meaning(ow));
        if (showEs) tx.setAttribute("lang", "es");
        b.appendChild(tx);
        b.onclick = function () { answer(idx); };
        ob.appendChild(b);
      })(i);
    }
    $("q-feedback").hidden = true;
    $("q-feedback").innerHTML = "";
    $("next-btn").hidden = true;
    U.fitAll(box);
    G.qStart = now();
    updateClock();
  }
  function answer(idx) {
    if (!G || G.answered) return;
    var q = G.qs[G.idx];
    if (idx < 0 || idx >= q.opts.length) return;
    G.ms += Math.max(0, now() - G.qStart);
    G.answered = true;
    var ok = idx === q.c;
    G.bits += ok ? "1" : "0";
    var btns = $("q-options").querySelectorAll(".quiz-option");
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      if (i === q.c) btns[i].classList.add("correct");
      else if (i === idx) btns[i].classList.add("wrong");
    }
    if (window.Sfx) { if (ok) window.Sfx.correct(); else window.Sfx.wrong(); }
    var w = q.opts[q.c].word;
    var fb = $("q-feedback");
    fb.innerHTML = "";
    fb.className = "quiz-feedback " + (ok ? "is-correct" : "is-wrong");
    fb.appendChild(el("div", "quiz-feedback-title", ok ? "✔ 答对了！" : "✘ 答错了，正确答案是："));
    var line = el("div", "quiz-feedback-word");
    line.appendChild(U.sayButton(w.es));
    line.appendChild(el("span", "quiz-feedback-zh", meaning(w)));
    fb.appendChild(line);
    fb.hidden = false;
    var next = $("next-btn");
    next.textContent = G.idx + 1 < G.qs.length ? "下一题 →" : "看结果 →";
    next.hidden = false;
    updateClock();
    try { next.focus({ preventScroll: true }); } catch (e) {}
    try { next.scrollIntoView({ block: "nearest" }); } catch (e2) {}
  }
  function nextQuestion() {
    if (!G || !G.answered) return;
    if (G.idx + 1 < G.qs.length) { G.idx++; showQuestion(); return; }
    finish();
  }
  function finish() {
    if (tick) { clearInterval(tick); tick = null; }
    var right = countOnes(G.bits);
    var ds = Math.round(G.ms / 100);
    if (K && K.record) K.record("duel", right, right > 0); // 和其他小游戏一样：答对至少 1 题才给经验值
    if (window.Sfx && window.Sfx.win) window.Sfx.win();
    if (G.mode === "host") {
      var d = { v: CODE_VER, t: "c", n: G.name, s: G.seed, q: encodeQs(G.qs), a: [right, ds, G.bits] };
      var code = makeCode(d);
      var p = parseCode(code);
      if (!p.ok) { show("accept"); say($("accept-msg"), p.err, true); return; }
      histHostPending(p, code);
      showHostDone(p, code);
    } else {
      var ch = G.ch;
      var d2 = {};
      for (var k in ch.d) if (Object.prototype.hasOwnProperty.call(ch.d, k)) d2[k] = ch.d[k];
      d2.t = "r";
      d2.b = [G.name, right, ds, G.bits];
      var rcode = makeCode(d2);
      var rp = parseCode(rcode);
      if (!rp.ok) { show("accept"); say($("accept-msg"), rp.err, true); return; }
      histResult(rp, "guest", rcode);
      showCompare(rp, "guest", rcode, false);
    }
    G = null;
  }

  // ---------- 复制 / 分享 ----------
  function copyFrom(ta, msgBox, okText) {
    var fail = function () {
      try { ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length); } catch (e) {}
      say(msgBox, "没能自动复制。文字已经选中，请长按它选择“复制”。", true);
    };
    var done = function () { say(msgBox, okText); };
    var legacy = function () {
      try {
        ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length);
        if (document.execCommand && document.execCommand("copy")) { done(); return; }
      } catch (e) {}
      fail();
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ta.value).then(done, legacy);
        return;
      }
    } catch (e) {}
    legacy();
  }
  function canShare() { return !!(navigator.share && typeof navigator.share === "function"); }
  function shareIt(text, url, msgBox) {
    try {
      navigator.share({ title: "挑战码 PK · 竹竹西语", text: text, url: url }).then(function () {
        say(msgBox, "已打开分享。");
      }, function (err) {
        if (err && err.name === "AbortError") return; // 用户自己取消
        say(msgBox, "没能打开分享，请用“复制”按钮，再粘贴到微信。", true);
      });
    } catch (e) {
      say(msgBox, "没能打开分享，请用“复制”按钮，再粘贴到微信。", true);
    }
  }
  // 一个“码 + 消息”区：消息（含链接）、只要码，复制按钮、分享按钮
  function codeBlock(box, opts) {
    // opts: { title, tip, message, url, code, codeLabel }
    var wrap = el("div", "duel-code");
    wrap.appendChild(el("h2", "", opts.title));
    wrap.appendChild(el("p", "duel-code-tip", opts.tip));
    var msgBox = el("div", "cloud-status");
    msgBox.setAttribute("role", "status");
    msgBox.setAttribute("aria-live", "polite");

    var f1 = el("label", "field");
    f1.appendChild(el("span", "", "发给朋友的话（带链接，推荐）"));
    var ta1 = el("textarea", "text-input move-text");
    ta1.readOnly = true;
    ta1.rows = 4;
    ta1.value = opts.message + "\n" + opts.url;
    f1.appendChild(ta1);
    wrap.appendChild(f1);
    var row1 = el("div", "cloud-actions");
    var c1 = el("button", "btn", "复制这段话");
    c1.type = "button";
    c1.onclick = function () { copyFrom(ta1, msgBox, "已复制！打开微信，粘贴发给" + (opts.to || "朋友") + "。"); };
    row1.appendChild(c1);
    if (canShare()) {
      var s1 = el("button", "btn btn-light", "分享…");
      s1.type = "button";
      s1.onclick = function () { shareIt(opts.message, opts.url, msgBox); };
      row1.appendChild(s1);
    }
    wrap.appendChild(row1);

    var f2 = el("label", "field duel-code-only");
    f2.appendChild(el("span", "", opts.codeLabel));
    var ta2 = el("textarea", "text-input move-text");
    ta2.readOnly = true;
    ta2.rows = 3;
    ta2.value = opts.code;
    f2.appendChild(ta2);
    wrap.appendChild(f2);
    var row2 = el("div", "cloud-actions");
    var c2 = el("button", "btn btn-light", "只复制" + opts.codeLabel);
    c2.type = "button";
    c2.onclick = function () { copyFrom(ta2, msgBox, "已复制" + opts.codeLabel + "。"); };
    row2.appendChild(c2);
    wrap.appendChild(row2);
    wrap.appendChild(msgBox);
    box.appendChild(wrap);
  }

  // ---------- 发起人做完：成绩 + 挑战码 ----------
  function showHostDone(p, code, note) {
    var box = $("hostdone-box");
    box.innerHTML = "";
    if (note) box.appendChild(el("div", "notice", note));
    var res = el("div", "quiz-result");
    if (window.Mascot) res.appendChild(window.Mascot.el(p.host.sc >= 7 ? "happy" : "cheer", "bob"));
    res.appendChild(el("div", "quiz-result-label", p.host.n + " 的成绩"));
    res.appendChild(el("div", "quiz-result-score", "答对 " + p.host.sc + " / " + p.qs.length));
    res.appendChild(el("div", "quiz-result-msg", "用时 " + fmtTime(p.host.tm)));
    box.appendChild(res);
    var msg = "【竹竹西语 · 挑战码 PK】" + p.host.n + " 向你发起挑战：" + p.qs.length + " 道西语题，我答对 " + p.host.sc + " 题，用时 " + fmtTime(p.host.tm) + "。你能赢我吗？点开链接接受挑战：";
    codeBlock(box, {
      title: "把挑战发给朋友",
      tip: "用微信发给朋友。朋友点链接（或打开“挑战码 PK”→“接受挑战”，粘贴挑战码）就能做同样的 " + p.qs.length + " 道题。朋友做完会得到一个“回复码”，让 TA 发回给你，粘贴到“接受挑战”里就能看到谁赢了。",
      message: msg, url: codeLink(code), code: code, codeLabel: "挑战码"
    });
    show("hostdone");
  }

  // ---------- 对比结果 ----------
  function showCompare(p, role, replyCode, record, note) {
    var isNew = false;
    if (record) isNew = histResult(p, role, replyCode);
    var me = role === "host" ? p.host : p.guest, opp = role === "host" ? p.guest : p.host;
    var res = outcome(me, opp);
    var box = $("compare-box");
    box.innerHTML = "";
    if (note) box.appendChild(el("div", "notice", note));
    if (record && !isNew) box.appendChild(el("p", "small-tip", "这一场已经记过战绩了，不会重复记。"));
    var head = el("div", "quiz-result duel-head is-" + res);
    if (window.Mascot) head.appendChild(window.Mascot.el(res === "win" ? "party" : res === "lose" ? "sad" : "cheer", "bob"));
    head.appendChild(el("div", "quiz-result-score duel-verdict", res === "win" ? "你赢了！" : res === "lose" ? "你输了，再接再厉！" : "平手！"));
    var why = me.sc === opp.sc ? (res === "tie" ? "答对一样多，用时也一样" : "答对一样多，用时短的赢") : "答对多的赢";
    head.appendChild(el("div", "quiz-result-label", why));
    var vs = el("div", "duel-vs");
    var winner = res === "win" ? me : res === "lose" ? opp : null;
    var sides = role === "host" ? [p.host, p.guest] : [p.guest, p.host];
    for (var i = 0; i < 2; i++) {
      var s = sides[i];
      var card = el("div", "duel-side" + (s === winner ? " is-winner" : ""));
      var nm = el("div", "duel-side-name");
      if (s === winner && window.Icons) nm.appendChild(window.Icons.el("crown", "duel-crown", "赢家"));
      nm.appendChild(el("span", "duel-name", s.n));
      if (s === me) nm.appendChild(el("span", "duel-me", "（我）"));
      card.appendChild(nm);
      card.appendChild(el("div", "duel-side-score", s.sc + " / " + p.qs.length));
      card.appendChild(el("div", "duel-side-time", "用时 " + fmtTime(s.tm)));
      vs.appendChild(card);
      if (i === 0) vs.appendChild(el("div", "duel-vs-mid", "对"));
    }
    head.appendChild(vs);
    box.appendChild(head);

    // 每一题双方对错
    box.appendChild(el("h2", "", "每一题的对错"));
    var table = el("div", "duel-table");
    table.setAttribute("role", "table");
    var hr = el("div", "duel-row duel-row-head");
    hr.setAttribute("role", "row");
    var heads = ["", "题目", sides[0].n, sides[1].n];
    for (var h = 0; h < heads.length; h++) { var hc = el("div", "duel-cell", heads[h]); hc.setAttribute("role", "columnheader"); hr.appendChild(hc); }
    table.appendChild(hr);
    for (var q = 0; q < p.qs.length; q++) {
      var qq = p.qs[q], it = qq.opts[qq.c];
      var row = el("div", "duel-row");
      row.setAttribute("role", "row");
      var c0 = el("div", "duel-cell duel-num", String(q + 1));
      var c1 = el("div", "duel-cell duel-item");
      var esLine = el("div", "duel-item-es");
      esLine.appendChild(U.sayButton(it.word.es));
      c1.appendChild(esLine);
      c1.appendChild(el("div", "duel-item-zh", meaning(it.word) + " · " + TYPE_ZH[qq.type]));
      var c2 = el("div", "duel-cell"); c2.appendChild(mark(sides[0].bits.charAt(q) === "1"));
      var c3 = el("div", "duel-cell"); c3.appendChild(mark(sides[1].bits.charAt(q) === "1"));
      var cells = [c0, c1, c2, c3];
      for (var c = 0; c < cells.length; c++) { cells[c].setAttribute("role", "cell"); row.appendChild(cells[c]); }
      table.appendChild(row);
    }
    box.appendChild(table);

    if (role === "guest") {
      var msg = "【竹竹西语 · 挑战码 PK】我做完了 " + p.host.n + " 的挑战：我（" + p.guest.n + "）答对 " + p.guest.sc + " 题，用时 " + fmtTime(p.guest.tm) + "。点开链接（或在“接受挑战”里粘贴这段话）看看谁赢了：";
      codeBlock(box, {
        title: "把回复码发回给 " + p.host.n,
        tip: "用微信把下面这段话发回给 " + p.host.n + "，TA 粘贴到“接受挑战”里，也能看到同样的对比结果。",
        message: msg, url: codeLink(replyCode), code: replyCode, codeLabel: "回复码", to: p.host.n
      });
    }
    show("compare");
  }

  // ---------- 事件 ----------
  $("go-create").onclick = goCreate;
  $("go-accept").onclick = goAccept;
  $("create-start").onclick = startCreate;
  $("accept-go").onclick = function () { handleCode($("accept-text").value, false); };
  $("preview-start").onclick = startAccept;
  $("next-btn").onclick = nextQuestion;
  var homes = document.querySelectorAll("[data-go-home]");
  for (var hi = 0; hi < homes.length; hi++) {
    homes[hi].onclick = function () {
      if (tick) { clearInterval(tick); tick = null; }
      G = null;
      show("home");
    };
  }
  var news = document.querySelectorAll("[data-go-create]");
  for (var ni = 0; ni < news.length; ni++) news[ni].onclick = goCreate;
  $("create-name").addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); startCreate(); } });
  $("preview-name").addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); startAccept(); } });
  $("accept-text").addEventListener("input", function () { say($("accept-msg"), ""); });

  document.addEventListener("keydown", function (ev) {
    if ($("s-play").hidden || ev.altKey || ev.ctrlKey || ev.metaKey || K.typing(ev)) return;
    var k = ev.key;
    if (k.length === 1 && k >= "1" && k <= "4") { ev.preventDefault(); answer(Number(k) - 1); }
    else if (k === "Enter" && G && G.answered) { ev.preventDefault(); nextQuestion(); }
  });

  // ---------- 开始 ----------
  if (!allWords.length && !allPhrases.length) {
    $("s-home").innerHTML = "";
    $("s-home").appendChild(el("div", "notice", "没有找到单词内容（data/words.js 没有加载到）。"));
    return;
  }
  scope = K.scope($("scope-box"), "duel", { words: true, phrases: allPhrases.length ? "option" : "", onChange: function () { say($("create-msg"), ""); } });
  renderRecord();
  // 从链接 #c=… 进来：认出挑战码 / 回复码，然后清掉地址里的 hash（刷新不会重复处理）
  function fromHash() {
    var hm = /[#&]c=(.+)$/.exec(String(location.hash || ""));
    if (!hm) return;
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { try { location.hash = ""; } catch (e2) {} }
    if (tick) { clearInterval(tick); tick = null; }
    G = null;
    handleCode(hm[1], true);
  }
  fromHash();
  // 页面已经开着、又点了一个挑战链接（只有 # 后面变了，浏览器不会重新打开页面）
  window.addEventListener("hashchange", fromHash);
  window.addEventListener("pageshow", function (ev) { if (ev.persisted && !$("s-home").hidden) renderRecord(); });

  // 给自动测试用（不影响页面）
  window.Duel = { parseCode: parseCode, makeCode: makeCode, buildQuestions: buildQuestions, encodeQs: encodeQs, checksum: checksum, SITE_URL: SITE_URL,
    state: function () { return G; } };
})();
