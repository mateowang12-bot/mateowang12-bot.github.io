// ============================================
// 学习进度记录（storage.js）
// 所有进度都存在浏览器的 localStorage 里，只用一个 key：
//   "es-study-progress-v1" → { version, words, grammar, alphabetSeen, alphabetAt, alphabetLetters, lastQuiz?, resetAt }
// localStorage 不可用（被禁用、隐私模式、出错）时，自动改用内存保存：
// 网站照样能用，只是关掉页面后进度会丢失（页面顶部会有一行小字提示）。
//
// 单词用简单的“莱特纳盒子”法记熟练度：
//   box 0–5。答对 / 认识 → box + 1（最多 5）；
//   答错 / 不认识 → box 直接回到 0（像卡片退回第一个盒子，下次优先复习）；
//   “模糊” → box 不变，只更新时间。
//   box ≥ 3 视为“已掌握”。
//
// 用法（页面里直接调用 window.Progress）：
//   Progress.markWord(id, true/false)   记一次答对 / 答错
//   Progress.touchWord(id)              “模糊”：box 不变，只更新时间
//   Progress.getWord(id)                → { box, correct, wrong, lastSeen } 或 null（新词）
//   Progress.wordStatus(id)             → "new" / "learning" / "mastered"
//   Progress.masteredCount(ids?)        已掌握个数（可只数一部分 id）
//   Progress.isDue(id)                  这个词现在该不该复习
//   Progress.reviewQueue(words, max)    把单词排成复习顺序（不熟的在前，新词最后）
//   Progress.wordCounts(ids)            → { seen, due, mastered }
//   Progress.recordGrammar(lessonId, score, total)  记一课的成绩（best 取最高分）
//   Progress.getGrammar(lessonId)       → { best, total, done } 或 null
//   Progress.recordQuiz(score, total)   记最近一次小测验成绩（只留最近一次）
//   Progress.lastQuiz()                 → { score, total, time } 或 null（还没做过）
//   Progress.markAlphabetSeen(letter?)  打开过字母页 / 听过某个字母
//   Progress.reset()                    清除全部学习记录（同步时其他设备也会清除）
//   Progress.isAvailable()              true = 能保存；false = 只在内存里
//
// ---------- 跨设备同步（Progress.sync） ----------
// 只在 claude.ai 上打开时有效（页面里有 window.claude）；本地双击打开时完全不起作用。
// localStorage 仍然是主存储，所有读写都是同步的、马上生效；同步层在后台：
//   1) 页面加载后连接 claude.ai 的数据库（db）和用户（user），拿不到就安静放弃；
//   2) 连上后：读远端 → 和本地合并 → 写回本地；合并结果和远端不同才写远端；
//   3) 本地每次变化，约 2 秒后合并写一次远端（写之前先读远端再合并，不会盖掉另一台设备的新进度）；
//      页面隐藏 / 离开时立刻写一次；同一份文档一次只写一个（排队）；
//   4) 另一台设备写入时（onSnapshot）只合并进本地，然后派发 window 事件 "progress-synced"，页面据此刷新数字；
//   5) 状态变化时派发 "progress-sync-status"；Progress.sync.status() →
//      "local"（只存在本机）/ "connecting"（正在同步）/ "synced"（已同步）/ "failed"（同步出错，只存本机）。
// 合并规则：words 取 lastSeen 新的（相同取 box 大的）；grammar best 取最大、done 任一为真、total 取新的；
//   lastQuiz 取 time 新的；alphabetSeen 任一为真；alphabetLetters 取并集；
//   resetAt 取较大的，早于 resetAt 的记录全部丢弃（这样“清除记录”能跨设备生效）。
// ============================================
(function () {
  var KEY = "es-study-progress-v1";
  var VERSION = 1;
  var MAX_BOX = 5;
  var MASTERED_BOX = 3;
  var DAY = 24 * 60 * 60 * 1000;
  // 已掌握的词隔多久要再复习一次（按 box）：box 3 → 3 天，box 4 → 7 天，box 5 → 14 天
  var REVIEW_AFTER = { 3: 3 * DAY, 4: 7 * DAY, 5: 14 * DAY };

  var storageOk = true;   // localStorage 能不能用
  var memory = null;      // 不能用时的内存备份（也作为最近一次读到的数据）

  function emptyState() {
    return { version: VERSION, words: {}, grammar: {}, alphabetSeen: false, alphabetAt: 0, alphabetLetters: {}, resetAt: 0 };
  }

  function getStorage() {
    try {
      var s = window.localStorage;
      if (!s) return null;
      return s;
    } catch (e) {
      return null;
    }
  }

  // 先试一下能不能写
  (function testStorage() {
    try {
      var s = getStorage();
      if (!s) { storageOk = false; return; }
      var t = KEY + "-test";
      s.setItem(t, "1");
      s.removeItem(t);
    } catch (e) {
      storageOk = false;
    }
  })();

  function num(v, def) {
    v = Number(v);
    return isFinite(v) ? v : def;
  }
  function has(o, k) {
    return Object.prototype.hasOwnProperty.call(o, k);
  }

  // 把读到的数据整理干净（防止被改坏的数据让页面出错）
  function clean(raw) {
    var st = emptyState();
    if (!raw || typeof raw !== "object" || raw.version !== VERSION) return st;
    var w = raw.words && typeof raw.words === "object" ? raw.words : {};
    for (var id in w) {
      if (!has(w, id) || !w[id] || typeof w[id] !== "object") continue;
      var r = w[id];
      st.words[id] = {
        box: Math.max(0, Math.min(MAX_BOX, Math.floor(num(r.box, 0)))),
        correct: Math.max(0, Math.floor(num(r.correct, 0))),
        wrong: Math.max(0, Math.floor(num(r.wrong, 0))),
        lastSeen: num(r.lastSeen, 0)
      };
    }
    var g = raw.grammar && typeof raw.grammar === "object" ? raw.grammar : {};
    for (var gid in g) {
      if (!has(g, gid) || !g[gid] || typeof g[gid] !== "object") continue;
      st.grammar[gid] = {
        best: Math.max(0, num(g[gid].best, 0)),
        total: Math.max(0, num(g[gid].total, 0)),
        done: !!g[gid].done,
        lastSeen: num(g[gid].lastSeen, 0)
      };
    }
    if (raw.lastQuiz && typeof raw.lastQuiz === "object") {
      var lq = raw.lastQuiz;
      var lqTotal = Math.max(0, Math.floor(num(lq.total, 0)));
      if (lqTotal > 0) {
        st.lastQuiz = {
          score: Math.max(0, Math.min(lqTotal, Math.floor(num(lq.score, 0)))),
          total: lqTotal,
          time: num(lq.time, 0)
        };
      }
    }
    st.alphabetSeen = !!raw.alphabetSeen;
    st.alphabetAt = Math.max(0, num(raw.alphabetAt, 0));
    // 听过的字母：{ "A": 时间 }（旧数据是 { "A": true }，当作时间 1）
    var al = raw.alphabetLetters && typeof raw.alphabetLetters === "object" ? raw.alphabetLetters : {};
    for (var k in al) {
      if (has(al, k) && al[k]) st.alphabetLetters[k] = al[k] === true ? 1 : Math.max(1, num(al[k], 1));
    }
    st.resetAt = Math.max(0, num(raw.resetAt, 0));
    return st;
  }

  // 读取：每次都重新读，这样另一个页面刚存的进度也能看到
  function load() {
    if (storageOk) {
      try {
        var text = getStorage().getItem(KEY);
        memory = text ? clean(JSON.parse(text)) : emptyState();
        return memory;
      } catch (e) {
        // 读不了或数据坏了：读失败就改用内存；JSON 坏了就当作空记录
        if (e && e.name === "SyntaxError") {
          memory = emptyState();
          return memory;
        }
        storageOk = false;
        showWarning(); // 读不了：之后只存在内存里，提示一下
      }
    }
    if (!memory) memory = emptyState();
    return memory;
  }

  // 只写本地（同步层合并远端数据时用，不会再触发上传）
  function saveLocal(st) {
    memory = st;
    if (!storageOk) return false;
    try {
      getStorage().setItem(KEY, JSON.stringify(st));
      return true;
    } catch (e) {
      storageOk = false; // 写不进去（例如空间满了）：之后只存在内存里
      showWarning();
      return false;
    }
  }

  // 页面改了进度：写本地，并告诉同步层“有变化”
  function save(st) {
    var ok = saveLocal(st);
    sync.changed();
    return ok;
  }

  // ---------- 单词 ----------
  function getWord(id) {
    var r = load().words[id];
    return r ? { box: r.box, correct: r.correct, wrong: r.wrong, lastSeen: r.lastSeen } : null;
  }

  function markWord(id, correct) {
    if (!id) return null;
    var st = load();
    var r = st.words[id] || { box: 0, correct: 0, wrong: 0, lastSeen: 0 };
    if (correct) {
      r.box = Math.min(MAX_BOX, r.box + 1);
      r.correct++;
    } else {
      r.box = 0; // 答错：回到第一个盒子（不是降 1），保证不熟的词马上回到复习队列最前面
      r.wrong++;
    }
    r.lastSeen = Date.now();
    st.words[id] = r;
    save(st);
    return getWord(id);
  }

  // “模糊”：box 不变，只更新最近见过的时间（新词则建一条 box 0 的记录）
  function touchWord(id) {
    if (!id) return null;
    var st = load();
    var r = st.words[id] || { box: 0, correct: 0, wrong: 0, lastSeen: 0 };
    r.lastSeen = Date.now();
    st.words[id] = r;
    save(st);
    return getWord(id);
  }

  function wordStatus(id) {
    var r = load().words[id];
    if (!r) return "new";
    return r.box >= MASTERED_BOX ? "mastered" : "learning";
  }

  // 已掌握的个数；传入 id 数组时只数这些词（例如一课的词、或数据里现有的词）
  function masteredCount(ids) {
    var w = load().words;
    var n = 0;
    if (ids && ids.length !== undefined) {
      for (var i = 0; i < ids.length; i++) {
        if (w[ids[i]] && w[ids[i]].box >= MASTERED_BOX) n++;
      }
      return n;
    }
    for (var id in w) {
      if (has(w, id) && w[id].box >= MASTERED_BOX) n++;
    }
    return n;
  }

  // 该不该复习：学过、而且（还没掌握，或者掌握了但很久没见）
  function isDue(id, now) {
    var r = load().words[id];
    if (!r) return false;
    if (r.box < MASTERED_BOX) return true;
    now = now || Date.now();
    return now - r.lastSeen >= (REVIEW_AFTER[r.box] || 14 * DAY);
  }

  // 复习顺序：把一组单词（每个要有 id）排好队，返回前 max 个
  //   1) 学过的词在前，没学过的新词放最后（按原来的顺序）；
  //   2) 学过的词里：该复习的（isDue）在前 → box 低的在前 → 错得多的在前 → 很久没见的在前。
  function reviewQueue(words, max) {
    var st = load();
    var now = Date.now();
    var seen = [], fresh = [];
    for (var i = 0; i < (words || []).length; i++) {
      var w = words[i];
      if (!w || !w.id) continue;
      var r = st.words[w.id];
      if (r) seen.push({ w: w, r: r, due: isDue(w.id, now), order: i });
      else fresh.push(w);
    }
    seen.sort(function (a, b) {
      if (a.due !== b.due) return a.due ? -1 : 1;
      if (a.r.box !== b.r.box) return a.r.box - b.r.box;
      if (a.r.wrong !== b.r.wrong) return b.r.wrong - a.r.wrong;
      if (a.r.lastSeen !== b.r.lastSeen) return a.r.lastSeen - b.r.lastSeen;
      return a.order - b.order;
    });
    var out = [];
    for (var j = 0; j < seen.length; j++) out.push(seen[j].w);
    out = out.concat(fresh);
    return typeof max === "number" ? out.slice(0, max) : out;
  }

  // 学过的词个数、该复习的词个数（只数传入的 id）
  function wordCounts(ids) {
    var w = load().words;
    var now = Date.now();
    var res = { seen: 0, due: 0, mastered: 0 };
    for (var i = 0; i < (ids || []).length; i++) {
      var r = w[ids[i]];
      if (!r) continue;
      res.seen++;
      if (r.box >= MASTERED_BOX) res.mastered++;
      if (isDue(ids[i], now)) res.due++;
    }
    return res;
  }

  // ---------- 语法 ----------
  function recordGrammar(lessonId, score, total) {
    if (!lessonId) return null;
    var st = load();
    var g = st.grammar[lessonId] || { best: 0, total: 0, done: false, lastSeen: 0 };
    score = Math.max(0, num(score, 0));
    total = Math.max(0, num(total, 0));
    // 题目数量变了（内容编写员加减了题）就以新的总数为准
    if (total !== g.total) {
      g.best = score;
    } else {
      g.best = Math.max(g.best, score);
    }
    g.total = total;
    g.done = true;
    g.lastSeen = Date.now();
    st.grammar[lessonId] = g;
    save(st);
    return getGrammar(lessonId);
  }

  // 答了一道题（只更新时间，不算完成）
  function touchGrammar(lessonId) {
    if (!lessonId) return;
    var st = load();
    var g = st.grammar[lessonId] || { best: 0, total: 0, done: false, lastSeen: 0 };
    g.lastSeen = Date.now();
    st.grammar[lessonId] = g;
    save(st);
  }

  function getGrammar(lessonId) {
    var g = load().grammar[lessonId];
    return g ? { best: g.best, total: g.total, done: g.done } : null;
  }

  // ---------- 小测验：最近一次成绩 ----------
  function recordQuiz(score, total) {
    total = Math.max(0, Math.floor(num(total, 0)));
    if (!total) return null;
    score = Math.max(0, Math.min(total, Math.floor(num(score, 0))));
    var st = load();
    st.lastQuiz = { score: score, total: total, time: Date.now() };
    save(st);
    return lastQuiz();
  }

  function lastQuiz() {
    var q = load().lastQuiz;
    return q ? { score: q.score, total: q.total, time: q.time } : null;
  }

  // ---------- 字母 ----------
  function markAlphabetSeen(letter) {
    var st = load();
    var now = Date.now();
    st.alphabetSeen = true;
    st.alphabetAt = now;
    if (letter) st.alphabetLetters[String(letter)] = now;
    save(st);
  }

  function alphabetInfo() {
    var st = load();
    var n = 0;
    for (var k in st.alphabetLetters) {
      if (has(st.alphabetLetters, k)) n++;
    }
    return { seen: st.alphabetSeen, letters: n };
  }

  // ---------- 清除 ----------
  // 不直接删掉 key，而是存一份空记录 + resetAt（清除的时间）：
  // 同步时其他设备上早于这个时间的记录也会被丢弃。
  function reset() {
    var st = emptyState();
    st.resetAt = Math.max(Date.now(), load().resetAt + 1);
    saveLocal(st);
    sync.changed(true); // 马上写到远端
  }

  // ---------- 合并两份进度（同步用） ----------
  function merge(a, b) {
    a = clean(a);
    b = clean(b);
    var out = emptyState();
    var R = Math.max(a.resetAt, b.resetAt);
    out.resetAt = R;
    var id, x, y;

    // 单词：取 lastSeen 新的；一样新取 box 大的；早于 resetAt 的丢掉
    var ids = {};
    for (id in a.words) if (has(a.words, id)) ids[id] = true;
    for (id in b.words) if (has(b.words, id)) ids[id] = true;
    for (id in ids) {
      if (!has(ids, id)) continue;
      x = has(a.words, id) && a.words[id].lastSeen >= R ? a.words[id] : null;
      y = has(b.words, id) && b.words[id].lastSeen >= R ? b.words[id] : null;
      var pick = !x ? y : !y ? x :
        (x.lastSeen !== y.lastSeen ? (x.lastSeen > y.lastSeen ? x : y) : (x.box >= y.box ? x : y));
      if (pick) out.words[id] = { box: pick.box, correct: pick.correct, wrong: pick.wrong, lastSeen: pick.lastSeen };
    }

    // 语法：best 取最大（总题数不同时以新的为准）、done 任一为真、total 取新的
    var gids = {};
    for (id in a.grammar) if (has(a.grammar, id)) gids[id] = true;
    for (id in b.grammar) if (has(b.grammar, id)) gids[id] = true;
    for (id in gids) {
      if (!has(gids, id)) continue;
      x = has(a.grammar, id) && a.grammar[id].lastSeen >= R ? a.grammar[id] : null;
      y = has(b.grammar, id) && b.grammar[id].lastSeen >= R ? b.grammar[id] : null;
      if (!x && !y) continue;
      if (!x || !y) {
        var one = x || y;
        out.grammar[id] = { best: one.best, total: one.total, done: one.done, lastSeen: one.lastSeen };
        continue;
      }
      // 时间一样时取总题数多的那边，保证合并顺序不影响结果
      var newer = x.lastSeen !== y.lastSeen ? (x.lastSeen > y.lastSeen ? x : y) : (x.total >= y.total ? x : y);
      // 只有一边真正做完过：用做完那边的 total / best（另一边只是“答过几题”）
      var best, total;
      if (x.done && y.done && x.total !== y.total) {
        best = newer.best;
        total = newer.total;
      } else if (x.done !== y.done) {
        var d = x.done ? x : y;
        best = d.best;
        total = d.total;
      } else {
        best = Math.max(x.best, y.best);
        total = newer.total;
      }
      out.grammar[id] = { best: best, total: total, done: x.done || y.done, lastSeen: Math.max(x.lastSeen, y.lastSeen) };
    }

    // 小测验：取 time 新的
    var qa = a.lastQuiz && a.lastQuiz.time >= R ? a.lastQuiz : null;
    var qb = b.lastQuiz && b.lastQuiz.time >= R ? b.lastQuiz : null;
    var q = !qa ? qb : !qb ? qa : (qa.time >= qb.time ? qa : qb);
    if (q) out.lastQuiz = { score: q.score, total: q.total, time: q.time };

    // 字母：任一为真；听过的字母取并集
    var aOk = a.alphabetSeen && a.alphabetAt >= R;
    var bOk = b.alphabetSeen && b.alphabetAt >= R;
    out.alphabetSeen = aOk || bOk;
    out.alphabetAt = Math.max(aOk ? a.alphabetAt : 0, bOk ? b.alphabetAt : 0);
    var sides = [a.alphabetLetters, b.alphabetLetters];
    for (var s = 0; s < 2; s++) {
      for (var k in sides[s]) {
        if (!has(sides[s], k) || sides[s][k] < R) continue;
        out.alphabetLetters[k] = Math.max(out.alphabetLetters[k] || 0, sides[s][k]);
      }
    }
    if (!out.alphabetSeen && hasKeys(out.alphabetLetters)) {
      out.alphabetSeen = true;
    }
    return out;
  }
  function hasKeys(o) {
    for (var k in o) if (has(o, k)) return true;
    return false;
  }

  // 固定顺序的 JSON（用来比较两份数据是不是一样）
  function stable(v) {
    if (v === null || typeof v !== "object") return JSON.stringify(v);
    if (v instanceof Array) {
      var arr = [];
      for (var i = 0; i < v.length; i++) arr.push(stable(v[i]));
      return "[" + arr.join(",") + "]";
    }
    var keys = [];
    for (var k in v) if (has(v, k) && v[k] !== undefined) keys.push(k);
    keys.sort();
    var parts = [];
    for (var j = 0; j < keys.length; j++) parts.push(JSON.stringify(keys[j]) + ":" + stable(v[keys[j]]));
    return "{" + parts.join(",") + "}";
  }
  function same(a, b) {
    return stable(clean(a)) === stable(clean(b));
  }

  // ---------- 同步层 ----------
  var sync = (function () {
    var status = "local";   // local / connecting / synced / failed
    var ref = null;         // 远端文档
    var started = false;
    var dirty = false;      // 本地有还没上传的变化
    var timer = null;       // 防抖计时器
    var writing = null;     // 正在进行的上传（Promise），同一时间只有一个
    var again = false;      // 上传期间又有变化：上传完再来一次
    var unsub = null;
    var DEBOUNCE = 2000;

    function fire(name) {
      try {
        var ev;
        if (typeof Event === "function") {
          ev = new Event(name);
        } else {
          ev = document.createEvent("Event");
          ev.initEvent(name, false, false);
        }
        window.dispatchEvent(ev);
      } catch (e) {}
    }
    function setStatus(s) {
      if (s === status) return;
      status = s;
      fire("progress-sync-status");
    }
    function fail() {
      ref = null;
      if (timer) { clearTimeout(timer); timer = null; }
      if (unsub) { try { unsub(); } catch (e) {} unsub = null; }
      setStatus("failed");
    }
    function isUnavailable(err) {
      return !!err && err.code === "unavailable";
    }
    function wait(ms) {
      return new Promise(function (res) { setTimeout(res, ms); });
    }
    // 出错是 'unavailable' 时等一下再试一次
    function retryOnce(fn) {
      return Promise.resolve().then(fn).then(null, function (err) {
        if (!isUnavailable(err)) throw err;
        return wait(1500).then(fn);
      });
    }
    function exists(snap) {
      if (!snap) return false;
      return typeof snap.exists === "function" ? !!snap.exists() : !!snap.exists;
    }
    function snapData(snap) {
      if (!exists(snap)) return null;
      try {
        var d = typeof snap.data === "function" ? snap.data() : null;
        return d ? JSON.parse(JSON.stringify(d)) : null; // 远端对象是冻结的：先深拷贝
      } catch (e) {
        return null;
      }
    }

    // 把远端数据合并进本地；本地有变化就通知页面刷新
    function absorb(remote) {
      var local = load();
      var merged = merge(local, remote);
      if (!same(merged, local)) {
        saveLocal(merged);
        fire("progress-synced");
      }
      return merged;
    }

    // 上传一次：先读远端 → 合并 → 写回本地 → 和远端不同才写远端
    function pushOnce() {
      if (!ref) return Promise.resolve();
      dirty = false;
      return retryOnce(function () { return ref.get(); }).then(function (snap) {
        if (!ref) return;
        var remote = snapData(snap);
        var merged = absorb(remote);
        if (remote && same(merged, remote)) return;
        // 远端读到“没有”、本地也是空的：不写（防止读取出错时用空进度盖掉账号里的进度）
        if (!remote && !hasKeys(merged.words) && !hasKeys(merged.grammar) && !merged.lastQuiz && !merged.alphabetSeen && !merged.resetAt) return;
        var body = JSON.parse(JSON.stringify(merged));
        return retryOnce(function () { return ref.set(body); });
      });
    }

    // 排队上传：同一份文档一次只写一个
    function flush() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (!ref) return Promise.resolve();
      if (writing) {
        again = true;
        return writing;
      }
      writing = pushOnce().then(function () {
        if (ref) setStatus("synced");
      }, function () {
        fail(); // 其他错误：放弃同步，本地照常能用
      }).then(function () {
        writing = null;
        if (again && ref) {
          again = false;
          return flush();
        }
        again = false;
      });
      return writing;
    }

    // 本地进度变了（save / reset 调用）
    function changed(now) {
      dirty = true;
      if (!ref) return; // 还没连上：连上后的第一次同步会带上
      if (timer) clearTimeout(timer);
      // localStorage 不能用时进度只在内存里：马上上传，免得离开页面就丢
      if (now || !storageOk) flush();
      else timer = setTimeout(flush, DEBOUNCE);
    }

    function onRemote(snap) {
      if (!ref) return;
      var remote = snapData(snap);
      if (!remote) return;
      // 只合并进本地；如果本地有远端没有的进度（两台设备同时写），安排一次稍后的上传（不在这里直接写）
      var m = absorb(remote);
      if (!same(m, remote)) changed();
    }

    function connect() {
      if (started) return;
      var c = window.claude;
      if (!c || typeof c.use !== "function") return; // 本地 file:// 打开：只用本地存储
      started = true;
      setStatus("connecting");
      var db = null;
      // 最多等 12 秒，连不上就当作“只存本机”
      var timeout = new Promise(function (res) { setTimeout(function () { res([null, null]); }, 12000); });
      Promise.race([Promise.all([
        Promise.resolve(c.use("db")).then(null, function () { return null; }),
        Promise.resolve(c.use("user")).then(null, function () { return null; })
      ]), timeout]).then(function (r) {
        db = r[0];
        var user = r[1];
        if (!db || !user || typeof user.id !== "function") return null;
        return user.id();
      }).then(function (uid) {
        if (!uid || !db) {
          setStatus("local"); // 没登录 / 不支持：只存本机
          return;
        }
        ref = db.doc("data/users/" + uid + "/progress");
        // 第一次同步也走 flush 排队（读远端 → 合并 → 需要时写远端），保证不会和后面的写入并发
        return flush().then(function () {
          if (!ref) return;
          if (typeof ref.onSnapshot === "function") {
            try {
              var u = ref.onSnapshot(onRemote, function () { /* 订阅出错：保留本地，不再接收 */ });
              if (typeof u === "function") unsub = u;
            } catch (e) {}
          }
          // 连接期间页面又改了进度：补传一次
          if (dirty) changed();
        });
      }).then(null, function () {
        fail();
      });
    }

    // 页面隐藏 / 离开：有没上传的变化就马上写一次
    function onHide() {
      if (ref && (dirty || timer)) flush();
    }
    try {
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") onHide();
      });
      window.addEventListener("pagehide", onHide);
    } catch (e) {}

    // 页面先显示，同步在后台开始（window.claude 可能稍后才注入，load 时再试一次）
    function start() {
      if (typeof Promise === "undefined") return;
      try { connect(); } catch (e) { fail(); }
    }
    setTimeout(start, 0);
    try { window.addEventListener("load", start); } catch (e) {}

    return {
      changed: changed,
      api: {
        status: function () { return status; },
        flush: flush,
        start: start
      }
    };
  })();

  // ---------- 不能保存时的小字提示 ----------
  var warned = false;
  function showWarning() {
    if (warned || storageOk) return;
    function put() {
      if (warned) return;
      warned = true;
      var p = document.createElement("p");
      p.className = "progress-warn";
      p.setAttribute("role", "status");
      p.textContent = "提示：浏览器不允许保存数据，学习进度只在本次打开时有效，关闭页面后不会保存。 / Progress can't be saved in this browser.";
      var place = document.querySelector(".container") || document.body;
      if (place) place.insertBefore(p, place.firstChild);
    }
    // 页面主体已经在了（storage.js 放在 body 末尾时）就马上显示，否则等页面加载完
    if (document.readyState !== "loading" || document.querySelector(".container")) {
      put();
    } else {
      document.addEventListener("DOMContentLoaded", put);
    }
  }
  if (!storageOk) showWarning();

  // ---------- 请浏览器不要自动清掉进度 ----------
  // iPhone Safari 等在空间紧张或很久没打开时可能清掉网站数据；persist() 是“请求长期保存”。
  // 页面加载后调用一次，不管结果（不支持、被拒绝都没关系）。
  function askPersist() {
    try {
      var ns = navigator.storage;
      if (!ns || typeof ns.persist !== "function") return;
      var ask = function (already) {
        if (already) return;
        try {
          var p = ns.persist();
          if (p && typeof p.then === "function") p.then(null, function () {});
        } catch (e) {}
      };
      if (typeof ns.persisted === "function") {
        var q = ns.persisted();
        if (q && typeof q.then === "function") q.then(ask, function () {});
        else ask(false);
      } else {
        ask(false);
      }
    } catch (e) {}
  }
  try {
    if (document.readyState === "complete") setTimeout(askPersist, 0);
    else window.addEventListener("load", askPersist);
  } catch (e) {}

  window.Progress = {
    MASTERED_BOX: MASTERED_BOX,
    MAX_BOX: MAX_BOX,
    isAvailable: function () { return storageOk; },
    load: function () { return clean(JSON.parse(JSON.stringify(load()))); }, // 返回一份副本
    getWord: getWord,
    markWord: markWord,
    touchWord: touchWord,
    wordStatus: wordStatus,
    masteredCount: masteredCount,
    isDue: isDue,
    reviewQueue: reviewQueue,
    wordCounts: wordCounts,
    recordGrammar: recordGrammar,
    touchGrammar: touchGrammar,
    getGrammar: getGrammar,
    recordQuiz: recordQuiz,
    lastQuiz: lastQuiz,
    markAlphabetSeen: markAlphabetSeen,
    alphabetInfo: alphabetInfo,
    reset: reset,
    merge: merge,       // 合并两份进度（测试用）
    sync: sync.api
  };
})();
