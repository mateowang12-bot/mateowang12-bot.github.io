/* Eñe 西语单词 —— 复习安排（间隔重复，类似 Leitner 盒子）
 *
 * 现在的学法是“只看不考”：App 只调用 view()。
 * 每个词有一个“盒子号” box：
 *   box 1..8   = 下次间隔 1、3、7、14、30、60、120、240 天
 *   每看一次（按“下一个”）：box + 1，到期日 = 今天 + 新盒子的间隔；没有降级
 *   box 0      = 旧版留下的“看过还没测”（今天到期）
 *   easy=true  = 旧版的“太简单”，不再复习（算已掌握）
 * 已掌握 = box ≥ 4（间隔 ≥ 14 天），或者 easy
 * answer()/markSeen() 是旧版自测用的，保留着以免旧数据出问题，现在页面不再调用。
 */
(function () {
  'use strict';
  var Ene = (window.Ene = window.Ene || {});
  var Store = Ene.Store, T = Ene.time, Data = Ene.Data;

  var INTERVALS = [1, 3, 7, 14, 30, 60, 120, 240];
  var MAX_BOX = INTERVALS.length;
  var MASTER_BOX = 4;

  function rec(id) { return Store.getWord(id); }

  function isSeen(r) { return !!r; }
  function isMastered(r) { return !!r && (r.easy === true || (r.box || 0) >= MASTER_BOX); }
  function isDue(r, today) {
    return !!r && !r.easy && typeof r.due === 'string' && r.due <= (today || T.today());
  }

  function newRec() {
    return { box: 0, due: T.today(), seen: T.now(), lastReview: null, reps: 0, lapses: 0, easy: false };
  }

  // 第一次看到新词时调用
  function markSeen(id) {
    if (rec(id)) return false;
    Store.setWord(id, newRec());
    Store.logStudy(0, 1);
    return true;
  }

  /* grade: 'again' 还不熟 | 'good' 记住了 | 'easy' 太简单
   * opts.retry = 这个词本轮已经答错过（这次“记住了”不再升级，保持明天复习） */
  function answer(id, grade, opts) {
    opts = opts || {};
    var today = T.today();
    var r = rec(id);
    var isNew = false;
    if (!r) { r = newRec(); isNew = true; }
    r = JSON.parse(JSON.stringify(r));

    if (grade === 'easy') {
      r.easy = true;
      r.box = MAX_BOX;
      r.due = null;
    } else if (grade === 'again') {
      if ((r.box || 0) > 0) r.lapses = (r.lapses || 0) + 1;
      r.easy = false;
      r.box = 1;
      r.due = T.addDays(today, 1);
    } else { // good
      r.easy = false;
      if (opts.retry) {
        r.box = 1;
        r.due = T.addDays(today, INTERVALS[0]);
      } else {
        r.box = Math.min((r.box || 0) + 1, MAX_BOX);
        r.due = T.addDays(today, INTERVALS[r.box - 1]);
      }
    }
    r.reps = (r.reps || 0) + 1;
    r.lastReview = T.now();
    Store.setWord(id, r);
    Store.logStudy(1, isNew ? 1 : 0);
    return r;
  }

  /* 只看不考：每看一次（按“下一个”）就升一格。
   * 新词第一次看 → 盒子 1，明天；之后 3、7、14、30、60、120、240 天。没有降级。 */
  function view(id) {
    var today = T.today();
    var r = rec(id);
    var isNew = !r;
    r = r ? JSON.parse(JSON.stringify(r)) : newRec();
    if (!r.easy) {
      r.box = Math.min((r.box || 0) + 1, MAX_BOX);
      r.due = T.addDays(today, INTERVALS[r.box - 1]);
    }
    r.reps = (r.reps || 0) + 1;
    r.lastReview = T.now();
    Store.setWord(id, r);
    Store.logStudy(1, isNew ? 1 : 0);
    return r;
  }

  // 今天到期的词（只算现在有数据的词），最早到期的排前面
  function dueIds(today, unitId) {
    today = today || T.today();
    var list = [];
    var ids = unitId ? (Data.unit(unitId) || { words: [] }).words.map(function (w) { return w.id; }) : Data.order;
    for (var i = 0; i < ids.length; i++) {
      var r = rec(ids[i]);
      if (isDue(r, today)) list.push({ id: ids[i], due: r.due, i: i });
    }
    list.sort(function (a, b) { return a.due < b.due ? -1 : a.due > b.due ? 1 : a.i - b.i; });
    return list.map(function (x) { return x.id; });
  }

  // 还没学过的词，按单元顺序
  // 不指定单元时（每天的“开始学习”）：跳过专业场景单元，只按 A1 → A2 的顺序
  function newIds(limit, unitId) {
    var out = [];
    var ids = unitId ? (Data.unit(unitId) || { words: [] }).words.map(function (w) { return w.id; }) : Data.order;
    for (var i = 0; i < ids.length && out.length < limit; i++) {
      if (rec(ids[i])) continue;
      if (!unitId) { var w = Data.word(ids[i]); if (w && w.unit && w.unit.pro) continue; }
      out.push(ids[i]);
    }
    return out;
  }

  function newToday() { return Store.getLog().newWords; }
  function newLeftToday() { return Math.max(0, Store.settings().newPerDay - newToday()); }

  function unitStats(unit) {
    var s = { total: unit.words.length, seen: 0, mastered: 0, due: 0 };
    var today = T.today();
    unit.words.forEach(function (w) {
      var r = rec(w.id);
      if (!r) return;
      s.seen++;
      if (isMastered(r)) s.mastered++;
      if (isDue(r, today)) s.due++;
    });
    return s;
  }

  function totals() {
    var t = { seen: 0, mastered: 0 };
    Data.order.forEach(function (id) {
      var r = rec(id);
      if (!r) return;
      t.seen++;
      if (isMastered(r)) t.mastered++;
    });
    return t;
  }

  // 每个盒子里有几个词（复习页用）
  function boxCounts() {
    var c = { learning: 0, easy: 0, boxes: [] };
    for (var b = 0; b < MAX_BOX; b++) c.boxes.push(0);
    Data.order.forEach(function (id) {
      var r = rec(id);
      if (!r) return;
      if (r.easy) c.easy++;
      else if (!r.box) c.learning++;
      else c.boxes[Math.min(r.box, MAX_BOX) - 1]++;
    });
    return c;
  }

  // 0 新词 / 1 学习中 / 2 记得一些 / 3 已掌握（单词列表里的小圆点）
  function level(id) {
    var r = rec(id);
    if (!r) return 0;
    if (isMastered(r)) return 3;
    if ((r.box || 0) >= 2) return 2;
    return 1;
  }

  Ene.SRS = {
    INTERVALS: INTERVALS,
    MASTER_BOX: MASTER_BOX,
    isSeen: isSeen,
    isMastered: isMastered,
    isDue: isDue,
    view: view,
    markSeen: markSeen,
    answer: answer,
    dueIds: dueIds,
    newIds: newIds,
    newToday: newToday,
    newLeftToday: newLeftToday,
    unitStats: unitStats,
    totals: totals,
    boxCounts: boxCounts,
    level: level
  };
})();
