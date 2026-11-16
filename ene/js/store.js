/* Eñe 西语单词 —— 存储模块
 * 所有进度都存在 localStorage 的 "ene-progress-v1" 里（这个名字永远不改）。
 * 结构设计成“好合并”：每个单词、每天的记录、设置都有自己的 updatedAt，
 * 以后同步（阶段 3）只要调用 Store.exportData() / Store.merge(远端数据) 即可。
 */
(function () {
  'use strict';
  var Ene = (window.Ene = window.Ene || {});
  var KEY = 'ene-progress-v1';

  /* ---------- 时间（本地日期） ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var time = {
    // 测试时可以设置 window.__eneTimeOffset（毫秒）来模拟日期
    now: function () { return Date.now() + (Number(window.__eneTimeOffset) || 0); },
    dayKey: function (ts) {
      var d = new Date(ts == null ? time.now() : ts);
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    },
    today: function () { return time.dayKey(); },
    toDate: function (key) {
      var p = String(key).split('-');
      return new Date(+p[0], +p[1] - 1, +p[2]);
    },
    addDays: function (key, n) {
      var d = time.toDate(key);
      d.setDate(d.getDate() + n);
      return time.dayKey(d.getTime());
    },
    diffDays: function (a, b) { // b - a，单位：天
      return Math.round((time.toDate(b) - time.toDate(a)) / 86400000);
    }
  };
  Ene.time = time;

  // theme：'system' 跟随系统 / 'light' 白色 / 'dark' 黑色
  // voice：选中的朗读声音（voiceURI，没有就用名字）；'' = 自动选择（推荐拉美）
  // sound：按键声音；vibrate：震动（只在支持的安卓手机上有用）
  // mode：学习方式 'shanbay' 扇贝式（默认）/ 'view' 只看
  // reviewBatch：一轮最多复习几个到期的词（10 / 20 / 50，0 = 全部）
  var DEFAULT_SETTINGS = { newPerDay: 10, rate: 'slow', autoplay: true, theme: 'system', voice: '', sound: true, vibrate: true, mode: 'shanbay', reviewBatch: 20 };

  function rid() {
    return 'd' + Math.random().toString(36).slice(2, 10) + time.now().toString(36);
  }

  function blank() {
    var now = time.now();
    return {
      v: 1,
      deviceId: rid(),
      createdAt: now,
      updatedAt: now,
      words: {},     // id -> { box, due, seen, lastReview, reps, lapses, easy, updatedAt }
      settings: { newPerDay: 10, rate: 'slow', autoplay: true, theme: 'system', voice: '', sound: true, vibrate: true, mode: 'shanbay', reviewBatch: 20, updatedAt: 0 },
      log: {},       // 'YYYY-MM-DD' -> { cards, newWords, updatedAt }
      streak: { days: 0, last: null, updatedAt: 0 }
    };
  }

  function isObj(o) { return o && typeof o === 'object' && !Array.isArray(o); }

  function normalize(o) {
    var b = blank();
    if (!isObj(o)) return b;
    b.deviceId = typeof o.deviceId === 'string' ? o.deviceId : b.deviceId;
    b.createdAt = Number(o.createdAt) || b.createdAt;
    b.updatedAt = Number(o.updatedAt) || b.updatedAt;
    if (isObj(o.words)) b.words = o.words;
    if (isObj(o.settings)) {
      for (var k in DEFAULT_SETTINGS) if (o.settings[k] != null) b.settings[k] = o.settings[k];
      b.settings.updatedAt = Number(o.settings.updatedAt) || 0;
    }
    if (isObj(o.log)) b.log = o.log;
    if (isObj(o.streak)) b.streak = o.streak;
    return b;
  }

  /* ---------- 读写（每次都 try/catch） ---------- */
  var data;
  var storageOk = true;
  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) return normalize(JSON.parse(raw));
    } catch (e) {
      storageOk = false;
    }
    return blank();
  }
  function save() {
    data.updatedAt = time.now();
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
      storageOk = true;
      return true;
    } catch (e) {
      storageOk = false;
      return false;
    }
  }
  data = load();

  var listeners = [];
  function emit(what) {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](what); } catch (e) { /* 忽略 */ }
    }
  }

  /* ---------- 连续天数：根据每日记录计算 ---------- */
  function computeStreak() {
    var today = time.today();
    var day = today;
    if (!(data.log[day] && data.log[day].cards > 0)) day = time.addDays(today, -1);
    var n = 0;
    while (data.log[day] && data.log[day].cards > 0) {
      n++;
      day = time.addDays(day, -1);
    }
    return n;
  }

  var Store = {
    KEY: KEY,
    ok: function () { return storageOk; },

    getWord: function (id) {
      var r = data.words[id];
      return isObj(r) ? r : null;
    },
    allWords: function () { return data.words; },
    setWord: function (id, rec) {
      rec.updatedAt = time.now();
      data.words[id] = rec;
      save();
      emit('word');
      return rec;
    },

    settings: function () {
      var s = {};
      for (var k in DEFAULT_SETTINGS) s[k] = data.settings[k] != null ? data.settings[k] : DEFAULT_SETTINGS[k];
      return s;
    },
    setSetting: function (k, v) {
      data.settings[k] = v;
      data.settings.updatedAt = time.now();
      save();
      emit('settings');
    },

    getLog: function (day) {
      var l = data.log[day || time.today()];
      return { cards: (l && l.cards) || 0, newWords: (l && l.newWords) || 0 };
    },
    // 记一次学习：cards 张卡片，newWords 个新词
    logStudy: function (cards, newWords) {
      var day = time.today();
      var l = data.log[day] || { cards: 0, newWords: 0 };
      l.cards = (l.cards || 0) + (cards || 0);
      l.newWords = (l.newWords || 0) + (newWords || 0);
      l.updatedAt = time.now();
      data.log[day] = l;
      data.streak = { days: computeStreak(), last: day, updatedAt: time.now() };
      save();
      emit('log');
    },
    streak: function () { return computeStreak(); },

    /* ---------- 给以后的同步用 ---------- */
    exportData: function () { return JSON.parse(JSON.stringify(data)); },
    // 合并远端数据：每个单词 / 每天 / 设置，谁的 updatedAt 新就用谁
    merge: function (remote) {
      if (!isObj(remote)) return false;
      var r = normalize(remote);
      var id, day;
      for (id in r.words) {
        var a = data.words[id], b = r.words[id];
        if (!isObj(b)) continue;
        if (!isObj(a) || (Number(b.updatedAt) || 0) > (Number(a.updatedAt) || 0)) data.words[id] = b;
      }
      for (day in r.log) {
        var la = data.log[day], lb = r.log[day];
        if (!isObj(lb)) continue;
        if (!isObj(la)) { data.log[day] = lb; continue; }
        // 同一天两台设备都学了：取较大值（不会重复相加）
        data.log[day] = {
          cards: Math.max(la.cards || 0, lb.cards || 0),
          newWords: Math.max(la.newWords || 0, lb.newWords || 0),
          updatedAt: Math.max(la.updatedAt || 0, lb.updatedAt || 0)
        };
      }
      if ((r.settings.updatedAt || 0) > (data.settings.updatedAt || 0)) data.settings = r.settings;
      data.streak = { days: computeStreak(), last: time.today(), updatedAt: time.now() };
      save();
      emit('merge');
      return true;
    },
    onChange: function (fn) { listeners.push(fn); },
    reload: function () { data = load(); emit('reload'); }
  };

  Ene.Store = Store;
})();
