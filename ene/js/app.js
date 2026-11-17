/* Eñe 西语单词 —— 页面和交互（单页 App） */
(function () {
  'use strict';
  var Ene = window.Ene;
  var Store = Ene.Store, SRS = Ene.SRS, Data = Ene.Data, Speech = Ene.Speech, T = Ene.time;

  var view = document.getElementById('view');
  var tabbar = document.getElementById('tabbar');
  var sessionEl = document.getElementById('session');
  var toastEl = document.getElementById('toast');

  var EXTRA = 5;          // 今天的任务完成后，“再学 5 个新词”

  /* ---------- 小工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  var I = {
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.5 9H3.5v6h3l4.5 4z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.5 8.6a4.8 4.8 0 0 1 0 6.8M18.4 5.8a8.8 8.8 0 0 1 0 12.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    turtle: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15.5a7 6.5 0 0 1 14 0z"/><path d="M7.2 15.5 8.6 11h3.8l1.4 4.5"/><path d="M16.6 13.2c.7-1.6 1.6-2.3 2.8-2.3a1.9 1.9 0 0 1 0 3.8h-2"/><path d="M6 15.5 5.4 18.5M14 15.5l.6 3M3 15.5 1.6 16.6"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    chev: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10.5 5 8.2 4.5 4 4.5v13c4.2 0 6.5.5 8 2 1.5-1.5 3.8-2 8-2v-13c-4.2 0-6.5.5-8 2z"/><path d="M12 6.5v13"/></svg>',
    cycle: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 11A7.5 7.5 0 0 0 6 6.6L4.5 8"/><path d="M4.5 3.5V8H9"/><path d="M4.5 13A7.5 7.5 0 0 0 18 17.4l1.5-1.4"/><path d="M19.5 20.5V16H15"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.1 4.7 4.7 0 0 0 7 18.5z"/></svg>',
    logo: '<svg viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="116" fill="#000"/><path d="M150 404V196h52l108 136V196h52v208h-52L202 268v136z" fill="#fff"/><path d="M168 152c26-36 58-38 88-18s62 18 88-18" fill="none" stroke="#fff" stroke-width="34" stroke-linecap="round"/></svg>'
  };

  /* ---------- 外观：跟随系统 / 白色 / 黑色 ---------- */
  // 页面第一次画出来之前，index.html 头部的小脚本已经先设好了；这里负责之后的切换
  function applyTheme(t) {
    var root = document.documentElement;
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t);
    else root.removeAttribute('data-theme');
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      var light = /light/.test(metas[i].getAttribute('media') || '');
      var c = t === 'light' ? '#FFFFFF' : t === 'dark' ? '#000000' : (light ? '#FFFFFF' : '#000000');
      metas[i].setAttribute('content', c);
    }
  }

  /* ---------- 路由（用 # 地址，file:// 也能用） ---------- */
  var currentTab = 'learn';
  function route() {
    if (S) return;
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var page = parts[0] || 'learn';
    // 第一次打开（还没选过课本）：先选书
    var firstTime = !Store.settings().book && Data.books.length > 0;
    if (page === 'books' || firstTime) { currentTab = firstTime ? 'books-first' : 'me'; renderBooks(firstTime); }
    else if (page === 'unit' && Data.unit(parts[1])) { currentTab = 'learn'; renderUnit(parts[1]); }
    else if (page === 'review') { currentTab = 'review'; renderReview(); }
    else if (page === 'me') { currentTab = 'me'; renderMe(); }
    else { currentTab = 'learn'; renderHome(); }
    var tabs = tabbar.querySelectorAll('[data-tab]');
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute('data-tab') === currentTab;
      tabs[i].classList.toggle('on', on);
      if (on) tabs[i].setAttribute('aria-current', 'page'); else tabs[i].removeAttribute('aria-current');
    }
    document.body.classList.toggle('no-tabbar', currentTab === 'books-first'); // 第一次选书时不显示底部菜单
  }

  /* ---------- 选课本（像扇贝单词：一次只学一本，按书的顺序学） ---------- */
  function bookCover(b) {
    // 黑白“封面”：书名的前两个字
    var t = b.titleZh.replace(/[《》]/g, '').replace(/\s+/g, '');
    return '<div class="bk-cover" aria-hidden="true"><span>' + esc(t.slice(0, 2)) + '</span><small>' + esc(t.slice(2, 6)) + '</small></div>';
  }
  function renderBooks(first) {
    var cur = Store.settings().book;
    var html = first
      ? '<header class="top books-first"><div class="brand">' + I.logo + '<span>Eñe 西语单词</span></div></header>' +
        '<div class="bk-intro"><h1>选一本书开始背单词</h1><p>一次学一本，按书的顺序来。以后可以在“我的”里换。</p></div>'
      : '<header class="top sub"><a class="icon-btn" href="#/me" aria-label="返回">' + I.back + '</a>' +
        '<div class="top-title"><div class="t1">选择课本</div><div class="t2">一次学一本；换书后学过的词不会丢</div></div></header>';
    html += '<div class="bk-list">' + Data.books.map(function (b) {
      var s = SRS.bookStats(b);
      var on = b.id === cur;
      var pct = s.total ? Math.round(s.seen / s.total * 100) : 0;
      var groups = [];
      b.units.forEach(function (u) { if (u.group && groups.indexOf(u.group) < 0) groups.push(u.group); });
      return '<button class="bk' + (on ? ' on' : '') + '" data-act="pick-book" data-v="' + esc(b.id) + '">' + bookCover(b) +
        '<div class="bk-main"><div class="bk-title">' + esc(b.titleZh) + (on ? '<span class="tag">在学</span>' : '') + '</div>' +
        '<div class="bk-sub">' + esc(b.sub) + '</div>' +
        '<div class="bk-meta">' + s.total + ' 词' + (groups.length ? ' · ' + esc(groups.join(' / ')) : ' · ' + b.units.length + ' 个单元') + '</div>' +
        (s.seen ? '<div class="bar"><i class="seen" style="width:' + pct + '%"></i></div><div class="bk-meta">已学 ' + s.seen + ' · 掌握 ' + s.mastered + '</div>' : '') +
        '</div></button>';
    }).join('') + '</div>';
    html += '<p class="footnote">这些词表是按各本书的程度和话题自己整理的，例句和翻译都是自己写的，不是书里的原文生词表。同一个词在几本书里都有时，学习进度是共用的。</p>';
    view.innerHTML = html;
  }
  function pickBook(id) {
    var b = Data.book(id);
    var was = Store.settings().book;
    Store.setSetting('book', b.id);
    if (was && was !== b.id) toast('已换成' + b.titleZh);
    go('#/learn');
  }
  function go(hash) {
    if (location.hash === hash) route(); else location.hash = hash;
  }

  function renderTabbar() {
    tabbar.innerHTML =
      '<a href="#/learn" data-tab="learn">' + I.book + '<span>学习</span></a>' +
      '<a href="#/review" data-tab="review">' + I.cycle + '<span>复习</span></a>' +
      '<a href="#/me" data-tab="me">' + I.user + '<span>我的</span></a>';
  }

  function voiceBanner() {
    if (!Speech.supported) return '<div class="notice">这个浏览器不能朗读。请用 iPhone 的 Safari 或电脑上的 Edge 打开。</div>';
    if (!Speech.missing()) return '';
    return '<div class="notice"><b>没有找到西班牙语发音</b>' +
      '<p>电脑（Windows）：设置 → 时间和语言 → 语音 → 添加语音，选“西班牙语(墨西哥)”。</p>' +
      '<p>iPhone：设置 → 辅助功能 → 朗读内容 → 声音 → 西班牙语，下载一个声音。</p>' +
      '<p>装好后重新打开这个 App。</p></div>';
  }

  /* ---------- 首页：学习 ---------- */
  function plan() {
    var due = SRS.dueIds().length;
    var limit = Store.settings().newPerDay;
    var done = SRS.newToday();
    var left = Math.max(0, limit - done);
    var unseen = SRS.newIds(1).length;
    return { due: due, limit: limit, done: done, left: unseen ? left : 0, unseen: unseen };
  }

  function unitStatus(s) {
    if (!s.total) return { t: '准备中', c: 'muted' };
    if (s.seen === 0) return { t: '未开始', c: 'muted' };
    if (s.mastered === s.total) return { t: '已掌握', c: 'good' };
    if (s.seen === s.total) return { t: '已学完', c: 'blue' };
    return { t: '学习中', c: 'accent' };
  }

  function renderHome() {
    var p = plan();
    var html = '<header class="top"><div class="brand">' + I.logo + '<span>Eñe 西语单词</span></div></header>';
    html += voiceBanner();

    if (!Data.count) {
      html += '<section class="card empty"><h2>单词正在准备中</h2><p>过一会儿再来看看吧。</p></section>';
      view.innerHTML = html;
      return;
    }

    // 现在学的课本（点一下去换书）
    var bk = SRS.currentBook(), bs = SRS.bookStats(bk);
    html += '<a class="bk-now" href="#/books">' + bookCover(bk) +
      '<div class="bk-main"><div class="bk-label">正在学</div><div class="bk-title">' + esc(bk.titleZh) + '</div>' +
      '<div class="bar"><i class="seen" style="width:' + (bs.total ? Math.round(bs.seen / bs.total * 100) : 0) + '%"></i></div>' +
      '<div class="bk-meta">已学 ' + bs.seen + ' / ' + bs.total + ' 词</div></div>' +
      '<span class="bk-change">换书' + I.chev + '</span></a>';

    var btn, hint;
    if (p.due || p.left) {
      btn = '<button class="btn primary big" data-act="start">开始学习</button>';
      hint = !p.due ? '看完今天的新词就好'
        : batchOf(p.due) < p.due ? '先复习 ' + batchOf(p.due) + ' 个到期的词，再学新词'
        : '先复习到期的词，再学新词';
    } else if (p.unseen) {
      btn = '<button class="btn primary big" data-act="extra">再学 5 个新词</button>';
      hint = '今天的任务完成了，想多学一点也可以';
    } else {
      btn = '<button class="btn big" disabled>全部单词都学过了</button>';
      hint = '记得每天回来复习';
    }
    html += '<section class="card today">' +
      '<div class="today-head"><span class="today-title">今天的计划</span>' +
      (p.due || p.left ? '' : '<span class="tag good">已完成</span>') + '</div>' +
      '<div class="today-line">今天：新词 <b>' + p.done + '</b>/' + p.limit + ' · 待复习 <b>' + p.due + '</b></div>' +
      '<div class="today-bar"><i style="width:' + Math.min(100, Math.round(p.done / p.limit * 100)) + '%"></i></div>' +
      batchPicker(p.due) + btn + '<p class="hint">' + hint + '</p></section>';

    // A1、A2，然后“专业场景”（不进每天的新词，自己点进去学），最后是其他级别（以后的 B1 等）
    var groups;
    if (bk.id === 'ene') groups = [
      { title: 'A1', sub: '入门', test: function (u) { return u.level === 'A1'; } },
      { title: 'A2', sub: '基础', test: function (u) { return u.level === 'A2'; } },
      { title: '专业场景', sub: '医院、工地等，点进去自己选着学', test: function (u) { return u.level === 'PRO'; } },
      { title: '更多', sub: '', test: function (u) { return ['A1', 'A2', 'PRO'].indexOf(u.level) < 0; } }
    ];
    else { // 其他课本：按书里的分组（第一册、第二册… / A1、A2…），保持书的顺序
      groups = [];
      bk.units.forEach(function (u) {
        var g = u.group || '单元';
        if (!groups.some(function (x) { return x.title === g; })) groups.push({ title: g, sub: '', test: function (x) { return (x.group || '单元') === g; } });
      });
    }
    groups.forEach(function (g) {
      var list = bk.units.filter(g.test);
      if (!list.length) return;
      html += '<h2 class="section-title">' + g.title + (g.sub ? ' <span>' + g.sub + '</span>' : '') + '</h2><div class="units">' +
        list.map(unitRow).join('') + '</div>';
    });
    view.innerHTML = html;
  }

  function unitRow(u) {
    var s = SRS.unitStats(u);
    var st = unitStatus(s);
    var seenPct = s.total ? Math.round(s.seen / s.total * 100) : 0;
    var mPct = s.total ? Math.round(s.mastered / s.total * 100) : 0;
    return '<a class="unit" href="#/unit/' + esc(u.id) + '">' +
      '<div class="unit-no">' + u.no + '</div>' +
      '<div class="unit-main">' +
      '<div class="unit-title"><span class="zh">' + esc(u.titleZh) + '</span><span class="tag ' + st.c + '">' + st.t + '</span></div>' +
      '<div class="unit-es" lang="es">' + esc(u.titleEs) + '</div>' +
      '<div class="bar"><i class="seen" style="width:' + seenPct + '%"></i><i class="mast" style="width:' + mPct + '%"></i></div>' +
      '<div class="unit-meta">已学 ' + s.seen + ' / 总 ' + s.total + ' · 掌握 ' + s.mastered + '</div>' +
      '</div><span class="chev">' + I.chev + '</span></a>';
  }

  /* ---------- 单元页 ---------- */
  var DOT = ['新词', '学习中', '记得一些', '已掌握'];
  function renderUnit(id) {
    var u = Data.unit(id);
    var s = SRS.unitStats(u);
    var unseen = SRS.newIds(9999, id).length;
    var btn;
    if (unseen) btn = '<button class="btn primary big" data-act="unit-learn" data-unit="' + esc(id) + '">学这个单元</button>';
    else if (s.due) btn = '<button class="btn primary big" data-act="unit-review" data-unit="' + esc(id) + '">复习本单元（' + batchOf(s.due) + ' 个）</button>';
    else btn = '<button class="btn big" disabled>这个单元的词都学过了</button>';

    var html = '<header class="top sub"><a class="icon-btn" href="#/learn" aria-label="返回">' + I.back + '</a>' +
      '<div class="top-title"><div class="t1">单元 ' + u.no + ' · ' + esc(u.titleZh) + '</div><div class="t2" lang="es">' + esc(u.titleEs) + '</div></div></header>';
    html += '<section class="card unit-head">' +
      '<div class="unit-meta big">已学 ' + s.seen + ' / 总 ' + s.total + ' · 掌握 ' + s.mastered + '</div>' +
      '<div class="bar"><i class="seen" style="width:' + (s.total ? Math.round(s.seen / s.total * 100) : 0) + '%"></i><i class="mast" style="width:' + (s.total ? Math.round(s.mastered / s.total * 100) : 0) + '%"></i></div>' +
      btn + (unseen ? '<p class="hint">还有 ' + unseen + ' 个新词，一次学 ' + Math.min(unseen, Store.settings().newPerDay) + ' 个</p>' : '') +
      '</section>';
    html += '<div class="legend">' + [0, 1, 2, 3].map(function (l) { return '<span><i class="dot l' + l + '"></i>' + DOT[l] + '</span>'; }).join('') + '</div>';
    html += '<ul class="words">';
    u.words.forEach(function (w) {
      var l = SRS.level(w.id);
      // 点这一行 = 读这个词，并展开 / 收起它的例句
      html += '<li class="word-row" data-act="row" data-id="' + esc(w.id) + '">' +
        '<i class="dot l' + l + '" title="' + DOT[l] + '"></i>' +
        '<div class="wr-main"><div class="wr-es" lang="es">' + esc(Data.display(w)) + '</div><div class="wr-zh">' + esc(w.zh) + '</div>' +
        (w.example && w.example.es ? '<div class="wr-ex tap" data-act="say-row-ex" data-id="' + esc(w.id) + '"><span lang="es">' + esc(w.example.es) + '</span><span>' + esc(w.example.zh || '') + '</span></div>' : '') +
        '</div>' +
        '<button class="say" data-act="say-word" data-id="' + esc(w.id) + '" aria-label="朗读">' + I.speaker + '</button></li>';
    });
    html += '</ul>';
    view.innerHTML = html;
  }

  /* ---------- 复习页 ---------- */
  // 一轮复习几个词（0 = 全部）
  function reviewBatch() {
    var n = Number(Store.settings().reviewBatch);
    return n > 0 ? n : 0;
  }
  function batchOf(n) { var b = reviewBatch(); return b ? Math.min(b, n) : n; }
  // “一次复习 10 / 20 / 50 / 全部”（首页和复习页共用；到期词 ≤ 10 个时不显示）
  function batchPicker(due) {
    if (due <= 10) return '';
    var opts = [[10, '10 个'], [20, '20 个'], [50, '50 个'], [0, '全部']].filter(function (o) { return o[0] === 0 || o[0] < due; });
    return '<div class="rv-pick"><div class="rv-pick-t">一次复习</div>' + seg('reviewBatch', opts, reviewBatch()) + '</div>';
  }

  function renderReview() {
    var due = SRS.dueIds().length;
    var c = SRS.boxCounts();
    var tomorrow = SRS.dueIds(T.addDays(T.today(), 1)).length - due;
    var html = '<header class="top"><h1>复习</h1></header>';
    var pick = batchPicker(due);
    var n = batchOf(due);
    html += '<section class="card review-hero">' +
      '<div class="big-num">' + due + '</div><div class="big-label">今天要复习的词</div>' + pick +
      (due ? '<button class="btn primary big" data-act="review">' + (n < due ? '复习 ' + n + ' 个' : '开始复习') + '</button>'
        : '<button class="btn big" disabled>今天没有要复习的词</button>') +
      '<p class="hint">' + (n < due ? '先复习最早到期的 ' + n + ' 个，学完可以再来一组'
        : tomorrow > 0 ? '明天还有 ' + tomorrow + ' 个词到期' : '按时复习，记得更牢') + '</p>' +
      (SRS.weakCount() ? '<p class="hint">不熟的词：' + SRS.weakCount() + ' 个（错过、还在前两格）</p>' : '') + '</section>';

    // 按单元挑着复习：只列出有到期词的单元
    var units = SRS.currentBook().units.map(function (u) { return { u: u, n: SRS.dueIds(null, u.id).length }; })
      .filter(function (x) { return x.n > 0; });
    if (units.length > 1) {
      html += '<h2 class="section-title">按单元复习 <span>只复习某一个单元</span></h2><div class="units">' +
        units.map(function (x) {
          return '<button class="unit rv-unit" data-act="unit-review" data-unit="' + esc(x.u.id) + '">' +
            '<div class="unit-no">' + x.u.no + '</div>' +
            '<div class="unit-main"><div class="unit-title"><span class="zh">' + esc(x.u.titleZh) + '</span></div>' +
            '<div class="unit-es" lang="es">' + esc(x.u.titleEs) + '</div></div>' +
            '<span class="rv-n">' + x.n + ' 个</span></button>';
        }).join('') + '</div>';
    }

    var rows = [];
    // 旧版留下的“看过还没升格”的词，有才显示
    if (c.learning) rows.push({ k: '刚看过', n: c.learning, d: '今天再看一次' });
    SRS.INTERVALS.forEach(function (d, i) {
      if (i < 5) rows.push({ k: '隔 ' + d + ' 天', n: c.boxes[i], d: i === 0 ? '明天再见' : '' });
    });
    var rest = 0; for (var i = 5; i < c.boxes.length; i++) rest += c.boxes[i];
    rows.push({ k: '隔 60 天以上', n: rest, d: '' });
    // 旧版“太简单”的词（以后不再复习），有才显示
    if (c.easy) rows.push({ k: '不再复习', n: c.easy, d: '已掌握' });
    var max = 1; rows.forEach(function (r) { if (r.n > max) max = r.n; });

    html += '<h2 class="section-title">记忆盒子 <span>每看一次升一格，间隔越来越长</span></h2><section class="card boxes">';
    rows.forEach(function (r, idx) {
      html += '<div class="box-row"><div class="box-k">' + r.k + (r.d ? '<small>' + r.d + '</small>' : '') + '</div>' +
        '<div class="box-bar"><i class="b' + idx + '" style="width:' + Math.round(r.n / max * 100) + '%"></i></div>' +
        '<div class="box-n">' + r.n + '</div></div>';
    });
    html += '</section><p class="footnote">每个词看过一次就升一格，下次隔 1、3、7、14、30、60 天……再出现。隔 14 天以上就算“已掌握”。</p>';
    view.innerHTML = html;
  }

  /* ---------- 我的 ---------- */
  function seg(k, opts, cur) {
    return '<div class="seg" role="radiogroup">' + opts.map(function (o) {
      var on = String(o[0]) === String(cur);
      return '<button role="radio" aria-checked="' + on + '" class="' + (on ? 'on' : '') + '" data-act="set" data-k="' + k + '" data-v="' + o[0] + '">' + o[1] + '</button>';
    }).join('') + '</div>';
  }

  function renderMe() {
    var st = Store.settings();
    var t = SRS.totals();
    var streak = Store.streak();
    var days = [], max = 1, today = T.today();
    for (var i = 6; i >= 0; i--) {
      var d = T.addDays(today, -i);
      var n = Store.getLog(d).cards;
      if (n > max) max = n;
      days.push({ d: d, n: n, label: i === 0 ? '今天' : '周' + '日一二三四五六'.charAt(T.toDate(d).getDay()) });
    }
    var html = '<header class="top"><h1>我的</h1></header>';
    html += '<section class="stats">' +
      '<div class="stat"><b>' + streak + '</b><span>连续天数</span></div>' +
      '<div class="stat"><b>' + t.seen + '</b><span>已学单词</span></div>' +
      '<div class="stat"><b>' + t.mastered + '</b><span>已掌握</span></div></section>';
    html += '<section class="card week"><div class="card-title">最近 7 天学习的卡片</div><div class="week-bars">' +
      days.map(function (x) {
        return '<div class="wb' + (x.d === today ? ' today' : '') + '"><span class="wb-n">' + (x.n || '') + '</span>' +
          '<div class="wb-col"><i style="height:' + (x.n ? Math.max(6, Math.round(x.n / max * 100)) : 0) + '%"></i></div>' +
          '<span class="wb-l">' + x.label + '</span></div>';
      }).join('') + '</div></section>';

    html += '<h2 class="section-title">设置</h2><section class="card settings">' +
      '<a class="set-row set-link" href="#/books"><div class="set-k">课本<small>' + esc(SRS.currentBook().titleZh) + '</small></div>' +
      '<span class="set-go">换一本' + I.chev + '</span></a>' +
      '<div class="set-row col"><div class="set-k">学习方式<small>' + (st.mode === 'view' ? '只看：每张卡全部显示，按“下一个”' : '四选一：看西语和例句，从 4 个中文意思里选；选错的词会多出现几次') + '</small></div>' +
      seg('mode', [['shanbay', '四选一（推荐）'], ['view', '只看']], st.mode) + '</div>' +
      '<div class="set-row col"><div class="set-k">外观</div>' + seg('theme', [['system', '跟随系统'], ['light', '白色'], ['dark', '黑色']], st.theme) + '</div>' +
      '<div class="set-row col"><div class="set-k">每天学几个新词</div>' + seg('newPerDay', [[5, '5'], [10, '10'], [15, '15'], [20, '20']], st.newPerDay) + '</div>' +
      '<div class="set-row col"><div class="set-k">朗读速度</div>' + seg('rate', [['vslow', '很慢'], ['slow', '慢'], ['normal', '正常']], st.rate) + '</div>' +
      '<div class="set-row"><div class="set-k">自动朗读<small>每张卡片出现时先读一遍</small></div>' +
      '<button class="switch' + (st.autoplay ? ' on' : '') + '" role="switch" aria-checked="' + !!st.autoplay + '" aria-label="自动朗读" data-act="toggle-autoplay"><i></i></button></div>' +
      '<div class="set-row"><div class="set-k">按键声音<small>点按钮时轻轻“嗒”一声</small></div>' +
      '<button class="switch' + (st.sound ? ' on' : '') + '" role="switch" aria-checked="' + !!st.sound + '" aria-label="按键声音" data-act="toggle-sound"><i></i></button></div>' +
      (Sfx && Sfx.canVibrate() ?
        '<div class="set-row"><div class="set-k">震动<small>点按钮时轻轻震一下</small></div>' +
        '<button class="switch' + (st.vibrate ? ' on' : '') + '" role="switch" aria-checked="' + !!st.vibrate + '" aria-label="震动" data-act="toggle-vibrate"><i></i></button></div>' : '') +
      '</section>';
    html += voiceSection();
    html += cloudSection();
    html += voiceBanner();
    if (!Store.ok()) html += '<div class="notice">这个浏览器现在不能保存进度（可能是无痕模式），关掉后进度会丢失。</div>';
    html += '<p class="footnote center">Eñe 西语单词 · 共 ' + Data.count + ' 个词 · ' + Data.units.length + ' 个单元</p>';
    view.innerHTML = html;
  }

  /* ---------- 发音测试（找出 iPhone 上哪种方法能变慢） ---------- */
  var voiceDiagOpen = false;

  // “发音”：当前声音 + 所有西语声音的列表（点一下 = 选中并试听）+ 更多测试
  function voiceSection() {
    var html = '<h2 class="section-title">发音</h2><section class="card settings voices">' +
      '<div class="set-row"><div class="set-k">现在用的声音<small>' +
      (Speech.voice() ? esc(Speech.voice().name) + ' · ' + esc(Speech.voiceLabel()) : (Speech.missing() ? '没有找到西班牙语发音' : '正在查找……')) +
      '</small></div><button class="btn small" data-act="test-voice">试听</button></div>';
    var list = Speech.voiceList();
    if (list.length) {
      var saved = Speech.savedVoice();
      var savedFound = list.some(function (v) { return v.id === saved || v.name === saved; });
      var auto = !saved || !savedFound;
      html += '<p class="voice-hint">点一个声音试听：如果这句明显变慢，说明这个声音支持调速，选它就行。</p>' +
        '<div class="voice-list" role="radiogroup">' +
        voiceRow('', '自动选择（推荐拉美）', '', auto) +
        list.map(function (v) {
          return voiceRow(v.id, v.name, v.region + ' · ' + (v.local ? '本机' : '在线'), !auto && v.current);
        }).join('') + '</div>';
    }
    html += '<p class="voice-hint">iPhone 可以下载更多声音：设置 → 辅助功能 → 朗读内容 → 声音 → 西班牙语（例如 Paulina、Mónica、Juan），下载后重新打开 App。</p>';
    html += voiceDiag();
    return html + '</section>';
  }
  function voiceRow(id, name, sub, on) {
    return '<button class="voice-row' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" data-act="voice-pick" data-v="' + esc(id) + '">' +
      '<span class="vr-mark">' + (on ? I.check : '') + '</span>' +
      '<span class="vr-main"><span class="vr-name">' + esc(name) + '</span>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span></button>';
  }

  function voiceDiag() {
    var html = '<button class="set-row row-btn" data-act="voice-diag-open" aria-expanded="' + voiceDiagOpen + '">' +
      '<span class="set-k">更多测试<small>语速调不慢时，用这里找原因</small></span>' +
      '<span class="chev' + (voiceDiagOpen ? ' up' : '') + '">' + I.chev + '</span></button>';
    if (!voiceDiagOpen) return html;
    var v = Speech.voiceInfo();
    html += '<div class="diag">' +
      '<p class="diag-info">' + (v ? '声音：' + esc(v.name) + ' · ' + esc(v.lang) + ' · ' + (v.local ? '本机语音' : '在线语音') : '没有找到西班牙语声音') + '</p>' +
      '<p class="diag-note">每个按钮都读“Buenos días, ¿cómo estás?”，A、B、C 都用很慢的语速 0.35。</p>' +
      '<div class="diag-btns">' +
      '<button class="btn outline" data-act="voice-diag" data-m="A">A 现在的方法</button>' +
      '<button class="btn outline" data-act="voice-diag" data-m="B">B 不指定声音</button>' +
      '<button class="btn outline" data-act="voice-diag" data-m="C">C 先设语速</button>' +
      '<button class="btn outline" data-act="voice-diag" data-m="D">D 一个词一个词</button></div>' +
      '<p class="diag-note">如果 A 和正常语速一样快，说明这个声音不支持调速。</p></div>';
    return html;
  }

  /* ---------- 账号同步（“我的”页） ---------- */
  var Cloud = Ene.Cloud || null;
  var cloudUI = { open: false, email: '', pw: '', msg: '', busy: false, resend: false };

  function fmtTime(ts) {
    if (!ts) return '还没有';
    var d = new Date(ts);
    var hm = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    var day = T.dayKey(ts);
    if (day === T.dayKey(Date.now())) return '今天 ' + hm;
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm;
  }

  function cloudStatusText(st) {
    if (st.state === 'syncing') return '正在同步……';
    if (st.message) return st.message;
    return '上次同步：' + fmtTime(st.last);
  }

  function cloudSection() {
    if (!Cloud || !Cloud.enabled()) return '';
    var html = '<h2 class="section-title">账号同步 <span>手机和电脑用同一个账号，进度自动合并</span></h2><section class="card settings cloud">';
    var u = Cloud.user();
    var st = Cloud.status();
    if (u && st.state !== 'relogin') {
      html += '<div class="set-row"><div class="set-k">' + esc(u.email) + '<small class="cloud-status">' + esc(cloudStatusText(st)) + '</small></div>' +
        '<button class="btn small" data-act="cloud-sync"' + (st.state === 'syncing' ? ' disabled' : '') + '>立即同步</button></div>' +
        '<div class="set-row"><div class="set-k"><small>退出后，这台设备上的进度还在</small></div>' +
        '<button class="btn small" data-act="cloud-logout">退出</button></div>';
    } else {
      if (u && st.state === 'relogin') html += '<p class="cloud-msg">' + esc(st.message) + '</p>';
      html += '<button class="set-row row-btn" data-act="cloud-open" aria-expanded="' + cloudUI.open + '"><span class="set-k">登录 / 注册<small>用邮箱和密码，同一个账号旧网站也能用</small></span>' +
        '<span class="chev' + (cloudUI.open ? ' up' : '') + '">' + I.chev + '</span></button>';
      if (cloudUI.open) {
        html += '<form class="cloud-form" data-cloud-form novalidate>' +
          '<label>邮箱<input type="email" name="email" data-cloud="email" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" value="' + esc(cloudUI.email) + '"></label>' +
          '<label>密码（至少 6 位）<input type="password" name="password" data-cloud="pw" autocomplete="current-password" value="' + esc(cloudUI.pw) + '"></label>' +
          (cloudUI.msg ? '<p class="cloud-msg" role="status">' + esc(cloudUI.msg) + '</p>' : '') +
          '<div class="cloud-btns"><button type="submit" class="btn primary" data-act="cloud-login"' + (cloudUI.busy ? ' disabled' : '') + '>登录</button>' +
          '<button type="button" class="btn outline" data-act="cloud-signup"' + (cloudUI.busy ? ' disabled' : '') + '>注册</button></div>' +
          (cloudUI.resend ? '<button type="button" class="btn link" data-act="cloud-resend">重新发送确认邮件</button>' : '') +
          '</form>';
      }
    }
    return html + '</section>';
  }

  function rerenderMe() {
    if (S || currentTab !== 'me') return;
    var a = document.activeElement;
    // 正在输入时不整页重画（免得打断输入），只更新状态那一行
    if (a && a.tagName === 'INPUT') {
      var line = view.querySelector('.cloud-status');
      if (line && Cloud) line.textContent = cloudStatusText(Cloud.status());
      return;
    }
    renderMe();
  }

  function cloudAct(act) {
    if (!Cloud) return;
    if (act === 'cloud-open') { cloudUI.open = !cloudUI.open; cloudUI.msg = ''; return renderMe(); }
    if (act === 'cloud-sync') { Cloud.syncNow(); return; }
    if (act === 'cloud-logout') { Cloud.signOut(); cloudUI = { open: false, email: '', pw: '', msg: '', busy: false, resend: false }; toast('已退出'); return renderMe(); }
    var p;
    if (act === 'cloud-login') p = Cloud.signIn(cloudUI.email, cloudUI.pw);
    else if (act === 'cloud-signup') p = Cloud.signUp(cloudUI.email, cloudUI.pw);
    else if (act === 'cloud-resend') p = Cloud.resend(cloudUI.email);
    if (!p) return;
    cloudUI.busy = true; cloudUI.msg = '请稍等……';
    renderMe();
    p.then(function (r) {
      cloudUI.busy = false;
      if (r.ok && act === 'cloud-resend') { cloudUI.msg = '确认邮件已重新发送，请去邮箱点链接。'; cloudUI.resend = true; }
      else if (r.ok && r.needConfirm) { cloudUI.msg = '注册成功！请先去邮箱点确认链接，然后再回来登录。'; cloudUI.resend = true; }
      else if (r.ok) { cloudUI = { open: false, email: '', pw: '', msg: '', busy: false, resend: false }; toast('已登录，正在同步'); }
      else { cloudUI.msg = r.error; cloudUI.resend = cloudUI.resend || !!r.notConfirmed; }
      if (!S && currentTab === 'me') renderMe();
    });
  }

  document.addEventListener('input', function (e) {
    var k = e.target && e.target.getAttribute && e.target.getAttribute('data-cloud');
    if (k) cloudUI[k] = e.target.value;
  });
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.hasAttribute('data-cloud-form')) { e.preventDefault(); cloudAct('cloud-login'); }
  });

  if (Cloud) {
    Cloud.onChange(rerenderMe);
    Cloud.redirectResult().then(function (msg) { if (msg) { toast(msg); rerenderMe(); } });
  }
  // 同步合并了云端进度：外观可能变了，页面数字也要更新
  Store.onChange(function (what) {
    if (what !== 'merge') return;
    applyTheme(Store.settings().theme);
    if (!S) { if (currentTab === 'me') rerenderMe(); else route(); }
  });

  /* ================= 学习环节 =================
   * 两种学习方式（我的 → 学习方式）：
   * - 四选一（默认，S.sb = true；设置值仍叫 'shanbay'）：正面 = 西语 + 西语例句 + 4 个中文选项（+“不知道”）→ 标出对错 → 背面看全部 →“下一个”。
   *   选错 / 不知道 = 不熟，这个词隔 4 张卡再出现，直到选对够次数（新词 2 次，复习词 1 次）。
   *   一个词在这一轮“完成”时才更新复习安排（SRS.grade）。
   * - 只看（S.sb = false）：每张卡全部显示，一个“下一个”；每张卡第一次按“下一个”记一次“看过”（SRS.view）。 */
  var S = null;
  var GAP = 4; // 不熟的词：中间隔 4 张卡再出现

  function sbMode() { return Store.settings().mode !== 'view'; }

  function startSession(opts) {
    var reviews = [], news = [];
    var st = Store.settings();
    if (opts.mode === 'all') {
      reviews = SRS.dueIds();
      news = SRS.newIds(opts.extra ? opts.extra : SRS.newLeftToday());
    } else if (opts.mode === 'review') {
      reviews = SRS.dueIds();
    } else if (opts.mode === 'unit') {
      news = SRS.newIds(st.newPerDay, opts.unitId);
    } else if (opts.mode === 'unit-review') {
      reviews = SRS.dueIds(null, opts.unitId);
    }
    var has = function (id) { return !!Data.word(id); };
    reviews = reviews.filter(has); news = news.filter(has);
    // 复习的词一轮只拿一组（最早到期的在前），学完可以按“继续”再来一组
    var batch = reviewBatch();
    if (batch && reviews.length > batch) reviews = reviews.slice(0, batch);
    if (!reviews.length && !news.length) { toast('现在没有要学的词'); return; }
    if (sbMode()) {
      var mk = function (type) { return function (id) { return { id: id, type: type, need: type === 'new' ? 2 : 1, got: 0, shown: 0, first: null, missed: false, done: false }; }; };
      var words = reviews.map(mk('review')).concat(news.map(mk('new')));
      S = { sb: true, opts: opts, words: words, queue: words.map(function (_, i) { return i; }), pos: 0,
        side: 'front', hint: false, pending: null, history: [], peek: -1 };
    } else {
      var q = reviews.map(function (id) { return { type: 'review', id: id }; })
        .concat(news.map(function (id) { return { type: 'new', id: id }; }));
      // viewed：这一轮里哪几张已经按过“下一个”；回到上一个再按“下一个”不会重复记
      S = { sb: false, opts: opts, queue: q, idx: 0, viewed: {} };
    }
    document.body.classList.add('in-session');
    sessionEl.hidden = false;
    renderCard(true);
  }

  // 现在这张卡的词
  function curWord() {
    if (!S) return null;
    if (!S.sb) { var it = S.queue[S.idx]; return it ? Data.word(it.id) : null; }
    if (S.peek >= 0) return Data.word(S.words[S.history[S.peek].wi].id);
    var wi = S.queue[S.pos];
    return wi == null ? null : Data.word(S.words[wi].id);
  }

  /* ---------- 卡片的各个部分 ---------- */
  function topBar(done, total, label) {
    return '<div class="s-top">' +
      '<button class="icon-btn" data-act="exit" aria-label="退出">' + I.close + '</button>' +
      '<div class="s-progress"><i style="width:' + Math.round(done / Math.max(1, total) * 100) + '%"></i></div>' +
      '<div class="s-count">' + label + '</div></div>' +
      (Speech.missing() ? '<div class="s-warn">没有找到西班牙语发音，去“我的”页面看看怎么添加。</div>' : '');
  }
  // o: { kind, verdict, front, hint }
  function cardBody(w, o) {
    var alt = Array.isArray(w.alt) ? w.alt : [];
    var ex = (w.example && w.example.es) ? w.example : null;
    var html = '<div class="s-body' + (o.front ? ' front' : '') + '"><div class="w-top">' +
      '<div class="w-meta"><span>' + o.kind + '</span>' + (Data.posLabel(w) ? '<span>' + Data.posLabel(w) + '</span>' : '') +
      (o.verdict ? '<span class="verdict">' + o.verdict + '</span>' : '') + '</div>' +
      '<div class="word tap" lang="es" data-act="say" role="button" aria-label="点单词朗读"><span class="nw">' + esc(w.es) + '</span>' +
      (w.fem ? ' <span class="nw">/ ' + esc(w.fem) + '</span>' : '') + '</div>' +
      (o.front ? '' : '<div class="meaning">' + esc(w.zh) + '</div>') +
      '<div class="say-row">' +
      '<button class="say big" data-act="say" aria-label="朗读">' + I.speaker + '</button>' +
      '<button class="say slow" data-act="say-slow" aria-label="慢速朗读">' + I.turtle + '<span>慢速</span></button></div>';
    if (!o.front) {
      if (alt.length) html += '<div class="extra">' + alt.map(function (a) {
        return '<p>' + esc(a.where || '其他地区') + '：<span lang="es">' + esc(a.es) + '</span></p>';
      }).join('') + '</div>';
      if (w.note) html += '<div class="note">' + esc(w.note) + '</div>';
    }
    html += '</div>';
    // 例句：背面全部显示；四选一的正面只显示西语（不显示中文），这个词加粗
    if (ex) {
      html += '<div class="ex-zone"><div class="example"><button class="say small" data-act="say-ex" aria-label="朗读例句">' + I.speaker + '</button>' +
        '<div class="ex-text tap" data-act="say-ex" role="button" aria-label="点例句朗读"><p class="ex-es" lang="es">' + exampleHtml(w, ex.es) + '</p>' +
        (!o.front && ex.zh ? '<p class="ex-zh">' + esc(ex.zh) + '</p>' : '') + '</div></div></div>';
    }
    return html + '</div>';
  }

  function renderCard(autoplay) {
    if (!S) return;
    if (S.sb) return renderSb(autoplay);
    var item = S.queue[S.idx];
    var w = item && Data.word(item.id);
    if (!w) { S.idx++; return S.idx < S.queue.length ? renderCard(autoplay) : renderEnd(); }
    var total = S.queue.length;
    var html = topBar(S.idx, total, (S.idx + 1) + ' / ' + total) +
      cardBody(w, { kind: item.type === 'new' ? '新词' : '复习' }) +
      '<div class="s-actions s-nav">' +
      '<button class="btn prev" data-act="prev" aria-label="上一个"' + (S.idx === 0 ? ' disabled' : '') + '>' + I.back + '<span>上一个</span></button>' +
      '<button class="btn primary big" data-act="next">下一个</button></div>';
    sessionEl.innerHTML = '<div class="s-wrap">' + html + '</div>';
    if (autoplay && Store.settings().autoplay) Speech.speak(Data.speakText(w));
  }

  var VERDICT = { known: '选对了', miss: '选错了', dunno: '不知道' };

  /* ---------- 四选一 ----------
   * 1 个正确的中文意思 + 3 个干扰项：先从同一个单元里挑同词性的，不够再挑同单元其他词性，再不够从同一级别里挑；中文意思不重复。 */
  var POS_ABBR = { v: 'v.', adj: 'adj.', adv: 'adv.', pron: 'pron.', prep: 'prep.', conj: 'conj.', num: 'num.', interj: 'interj.', phr: '短语' };
  function posAbbr(w) {
    if (w.pos === 'n') return w.fem || w.gender === 'mf' ? 'm./f.' : w.gender === 'f' ? 'f.' : 'm.';
    return POS_ABBR[w.pos] || '';
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function makeChoices(w) {
    var used = {}; used[w.zh] = true;
    var picks = [];
    function take(list) {
      shuffle(list.slice()).forEach(function (x) {
        if (picks.length >= 3 || !x || x.id === w.id || used[x.zh]) return;
        used[x.zh] = true; picks.push(x);
      });
    }
    var unit = w.unit || { words: [] };
    take(unit.words.filter(function (x) { return x.pos === w.pos; }));
    take(unit.words);
    if (picks.length < 3) {
      var lvl = [];
      Data.units.forEach(function (u) { if (u.level === unit.level) lvl = lvl.concat(u.words.filter(function (x) { return x.pos === w.pos; })); });
      take(lvl);
    }
    if (picks.length < 3) take(Data.order.map(Data.word));
    return shuffle(picks.concat([w])).map(function (x) { return { id: x.id, text: (posAbbr(x) ? posAbbr(x) + ' ' : '') + x.zh, ok: x.id === w.id }; });
  }

  // 例句里把这个词加粗（找不到就不加粗）
  var ARTICLES = /^(el|la|los|las|un|una|unos|unas)\s+/i;
  function exampleHtml(w, text) {
    var low = text.toLowerCase();
    var base = [w.es, w.fem].filter(Boolean).map(function (s) { return s.replace(ARTICLES, '').replace(/[¿?¡!]/g, '').trim().toLowerCase(); });
    var tries = [];
    base.forEach(function (t) { tries.push(t, t + 's', t + 'es'); }); // 也找复数
    var at = -1, len = 0;
    tries.forEach(function (t) { if (at < 0 && t) { var i = findWord(low, t); if (i >= 0) { at = i; len = t.length; } } });
    var root = (base[0] || '').replace(/se$/, ''); // llamarse → llamar
    if (at < 0 && root && root.indexOf(' ') < 0 && root.length >= 4) { // 动词变位等：用词根找
      var stem = root.slice(0, root.length - 2);
      var m = new RegExp('(^|[^a-záéíóúüñ])(' + stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[a-záéíóúüñ]*)').exec(low);
      if (m) { at = m.index + m[1].length; len = m[2].length; }
    }
    if (at < 0) return esc(text);
    return esc(text.slice(0, at)) + '<b>' + esc(text.slice(at, at + len)) + '</b>' + esc(text.slice(at + len));
  }
  Ene.Quiz = { makeChoices: makeChoices, exampleHtml: exampleHtml }; // 给自动测试用

  function findWord(low, t) {
    var from = 0, i;
    while ((i = low.indexOf(t, from)) >= 0) {
      var before = low.charAt(i - 1), after = low.charAt(i + t.length);
      if (!/[a-záéíóúüñ]/.test(before) && !/[a-záéíóúüñ]/.test(after)) return i;
      from = i + 1;
    }
    return -1;
  }

  function renderSb(autoplay) {
    var total = S.words.length;
    var done = S.words.filter(function (x) { return x.done; }).length;
    var label = done + ' / ' + total;
    var html, w, info;
    if (S.peek >= 0) { // 回看上一张（只读）
      var h = S.history[S.peek];
      info = S.words[h.wi]; w = Data.word(info.id);
      html = topBar(done, total, label) +
        cardBody(w, { kind: '回看', verdict: (VERDICT[h.v] || '') + (h.v === 'miss' && h.pick ? '：你选了“' + h.pick + '”' : '') }) +
        '<div class="s-actions s-nav">' +
        '<button class="btn prev" data-act="prev" aria-label="上一个"' + (S.peek === 0 ? ' disabled' : '') + '>' + I.back + '<span>上一个</span></button>' +
        '<button class="btn primary big" data-act="next">下一个</button></div>';
    } else {
      info = S.words[S.queue[S.pos]]; w = Data.word(info.id);
      var kind = info.type === 'new' ? (info.shown ? '新词 · 再来一次' : '新词') : (info.shown ? '复习 · 再来一次' : '复习');
      if (S.side === 'front') {
        // 这张卡的 4 个选项（同一次出现只生成一次，重画时不变）
        var key = S.pos + ':' + info.shown;
        if (!S.quiz || S.quiz.key !== key) S.quiz = { key: key, list: makeChoices(w), picked: -1 };
        var q = S.quiz;
        html = topBar(done, total, label) +
          cardBody(w, { kind: kind, front: true }) +
          '<div class="s-actions"><div class="choices">' +
          q.list.map(function (c, i) {
            var cls = 'choice';
            if (q.picked >= 0) cls += c.ok ? ' ok' : (i === q.picked ? ' bad' : ' dim');
            return '<button class="' + cls + '" data-act="pick" data-i="' + i + '"' + (c.ok ? ' data-ok="1"' : '') +
              (q.picked >= 0 ? ' disabled' : '') + '><span>' + esc(c.text) + '</span>' +
              (q.picked >= 0 && c.ok ? '<i>' + I.check + '</i>' : '') + '</button>';
          }).join('') + '</div>' +
          '<button class="btn link dunno" data-act="dunno"' + (q.picked >= 0 ? ' disabled' : '') + '>不知道</button></div>';
      } else {
        var vt = VERDICT[S.pending] || '';
        if (S.pending === 'miss' && S.pickText) vt += '：你选了“' + S.pickText + '”';
        html = topBar(done, total, label) +
          cardBody(w, { kind: kind, verdict: vt }) +
          '<div class="s-actions">' +
          '<div class="s-nav">' +
          '<button class="btn prev" data-act="prev" aria-label="上一个"' + (S.history.length ? '' : ' disabled') + '>' + I.back + '<span>上一个</span></button>' +
          '<button class="btn primary big" data-act="next">下一个</button></div></div>';
      }
    }
    sessionEl.innerHTML = '<div class="s-wrap">' + html + '</div>';
    if (autoplay && S.peek < 0 && S.side === 'front' && Store.settings().autoplay) Speech.speak(Data.speakText(w));
  }

  /* ---------- 卡片动画（只用 transform / opacity；“减少动态效果”时不动） ----------
   * 先在同一个点击 / 手势里同步换好内容（朗读也同步开始），再让旧卡的“影子”飞走、新卡滑进来。 */
  function reduceMotion() {
    try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  var ANIM_MS = 200;
  // dir: 'next'（往左走）| 'prev'（往右走）| 'flip'（正面翻到背面）| null（不动）；drag: 手指拖动时的位置
  function swapCard(dir, change, drag) {
    var old = sessionEl.querySelector('.s-wrap > .s-body');
    var canAnim = dir && old && !reduceMotion() && typeof old.animate === 'function';
    var ghost = null, rect = null;
    if (canAnim && dir !== 'flip') { rect = old.getBoundingClientRect(); ghost = old.cloneNode(true); }
    change(); // 同步：换内容 + 朗读
    if (!canAnim) return;
    var nb = sessionEl.querySelector('.s-wrap > .s-body');
    if (!nb || typeof nb.animate !== 'function') return;
    if (dir === 'flip') {
      nb.animate([{ opacity: 0, transform: 'perspective(800px) rotateY(-10deg) scale(.98)' }, { opacity: 1, transform: 'none' }],
        { duration: 150, easing: 'ease-out' });
      return;
    }
    var W = rect.width || window.innerWidth, sign = dir === 'next' ? -1 : 1;
    var x0 = drag ? drag.x : 0, r0 = drag ? drag.rot : 0, o0 = drag ? drag.op : 1;
    ghost.classList.add('s-ghost');
    ghost.removeAttribute('id');
    ghost.style.cssText = 'position:fixed;left:' + rect.left + 'px;top:' + rect.top + 'px;width:' + rect.width + 'px;height:' + rect.height + 'px;margin:0;pointer-events:none;z-index:22;';
    ghost.setAttribute('aria-hidden', 'true');
    sessionEl.appendChild(ghost);
    var a = ghost.animate([
      { transform: 'translateX(' + x0 + 'px) rotate(' + r0 + 'deg)', opacity: o0 },
      { transform: 'translateX(' + (sign * W * 1.1) + 'px) rotate(' + (sign * 6) + 'deg)', opacity: 0 }
    ], { duration: ANIM_MS, easing: 'ease-out', fill: 'forwards' });
    a.onfinish = function () { if (ghost.parentNode) ghost.parentNode.removeChild(ghost); };
    nb.animate([
      { transform: 'translateX(' + (-sign * W * 0.35) + 'px)', opacity: 0 },
      { transform: 'none', opacity: 1 }
    ], { duration: ANIM_MS, easing: 'ease-out' });
  }

  /* ---------- 只看模式：下一个 / 上一个 ---------- */
  function viewNext(drag) {
    var item = S.queue[S.idx];
    if (!item || S.ended) return;
    if (Data.word(item.id) && !S.viewed[S.idx]) { S.viewed[S.idx] = true; SRS.view(item.id); }
    swapCard('next', function () {
      S.idx++;
      if (S.idx >= S.queue.length) renderEnd(); else renderCard(true);
    }, drag);
  }
  function viewPrev(drag) {
    if (S.ended) { S.ended = false; S.idx = S.queue.length - 1; renderCard(true); return; }
    if (S.idx <= 0) return;
    swapCard('prev', function () { S.idx--; renderCard(true); }, drag);
  }

  /* ---------- 扇贝式 ---------- */
  // 四选一：i = 选了第几个；i = -1 表示“不知道”
  var PICK_MS = 650; // 选完先看一眼对错，再翻到背面
  function sbPick(i) {
    if (!S || !S.sb || S.ended || S.peek >= 0 || S.side !== 'front' || !S.quiz || S.quiz.picked >= 0) return;
    var q = S.quiz, c = q.list[i];
    if (i >= 0 && !c) return;
    var ok = !!(c && c.ok);
    q.picked = i >= 0 ? i : q.list.findIndex(function (x) { return x.ok; });
    S.pending = i < 0 ? 'dunno' : ok ? 'known' : 'miss';
    S.pickText = c && !ok ? c.text : '';
    renderCard(false); // 先标出对错（正确的实心 + ✓，选错的划掉）
    var mine = S;
    setTimeout(function () {
      if (S !== mine || S.ended || S.side !== 'front' || S.peek >= 0) return;
      S.side = 'back';
      swapCard('flip', function () { renderCard(false); });
    }, i < 0 ? 0 : PICK_MS);
  }

  // 这个词在这一轮完成了 → 更新复习安排
  function sbFinish(info) {
    var outcome;
    if (info.type === 'review') outcome = info.missed ? 'again' : 'up';
    else outcome = info.missed ? 'newMissed' : (info.first === true ? 'newKnown' : 'new');
    SRS.grade(info.id, outcome);
  }

  // 把当前卡的答案记下来（按“下一个”或退出时）
  function sbCommit() {
    var wi = S.queue[S.pos], info = S.words[wi], v = S.pending;
    if (!v) return false;
    var firstTime = info.shown === 0;
    info.shown++;
    var known = v === 'known';
    if (info.first === null) info.first = known;
    if (known) info.got++;
    else if (!(info.type === 'new' && firstTime)) info.missed = true; // 新词第一次就选错 / 不知道：还没学过，不算不熟
    S.history.push({ wi: wi, v: v, pick: S.pickText || '' });
    if (info.got >= info.need) { info.done = true; sbFinish(info); }
    else S.queue.splice(Math.min(S.pos + 1 + GAP, S.queue.length), 0, wi);
    S.pending = null; S.pickText = ''; S.quiz = null; S.side = 'front';
    return true;
  }

  function sbNext(drag) {
    if (!S || S.ended) return;
    if (S.peek >= 0) { // 回看中：往后翻，翻回当前卡的背面
      swapCard('next', function () { S.peek++; if (S.peek >= S.history.length) S.peek = -1; renderCard(false); }, drag);
      return;
    }
    if (S.side !== 'back') return;
    sbCommit();
    swapCard('next', function () {
      S.pos++;
      while (S.pos < S.queue.length && S.words[S.queue[S.pos]].done) S.pos++;
      if (S.pos >= S.queue.length) renderEnd(); else renderCard(true);
    }, drag);
  }
  function sbPrev(drag) {
    if (!S || S.ended) return;
    if (S.peek >= 0) { if (S.peek > 0) swapCard('prev', function () { S.peek--; renderCard(false); }, drag); return; }
    if (S.side !== 'back' || !S.history.length) return;
    swapCard('prev', function () { S.peek = S.history.length - 1; renderCard(false); }, drag);
  }

  function nextCard(drag) { if (S && S.sb) sbNext(drag); else if (S) viewNext(drag); }
  function prevCard(drag) { if (S && S.sb) sbPrev(drag); else if (S) viewPrev(drag); }
  // 现在能不能左右翻（扇贝式：只在背面）
  function canNavigate() { return !!S && !S.ended && (!S.sb || S.peek >= 0 || S.side === 'back'); }
  function canGoBack() {
    if (!S || S.ended) return false;
    if (!S.sb) return S.idx > 0;
    return S.peek > 0 || (S.peek < 0 && S.side === 'back' && S.history.length > 0);
  }

  function moreAvailable() {
    var o = S.opts;
    if (o.mode === 'unit') return SRS.newIds(1, o.unitId).length > 0;
    if (o.mode === 'unit-review') return SRS.dueIds(null, o.unitId).length > 0;
    if (o.mode === 'review') return SRS.dueIds().length > 0;
    return SRS.dueIds().length > 0 || (SRS.newLeftToday() > 0 && SRS.newIds(1).length > 0);
  }

  function renderEnd() {
    var more = moreAvailable();
    S.ended = true;
    if (Cloud) Cloud.changed();
    if (Sfx && gestureEvent) Sfx.done(gestureEvent);
    var body;
    if (S.sb) {
      var once = S.words.filter(function (x) { return x.first === true; }).length;
      var weak = S.words.filter(function (x) { return x.missed; });
      body = '<p class="end-line">这一轮：' + S.words.length + ' 个词 · 一次就选对 ' + once + ' 个 · 不熟 ' + weak.length + ' 个</p>' +
        (weak.length ? '<ul class="weak-list">' + weak.map(function (x) {
          var w = Data.word(x.id);
          return '<li class="tap" data-act="say-word" data-id="' + esc(x.id) + '" role="button"><span class="wl-es" lang="es">' + esc(Data.display(w)) + '</span><span class="wl-zh">' + esc(w.zh) + '</span></li>';
        }).join('') + '</ul>' : '');
    } else {
      var log = Store.getLog();
      body = '<p class="end-line">今天看了 ' + log.cards + ' 个词 · 新词 ' + log.newWords + ' · 复习 ' + Math.max(0, log.cards - log.newWords) + '</p>';
    }
    // 复习：还剩多少个到期的词
    var contLabel = '继续', left = 0;
    var om = S.opts.mode;
    if (more && (om === 'review' || om === 'unit-review')) {
      left = (om === 'review' ? SRS.dueIds() : SRS.dueIds(null, S.opts.unitId)).length;
      contLabel = '再复习 ' + batchOf(left) + ' 个';
      body += '<p class="hint">还有 ' + left + ' 个词等着复习，不急，可以明天再来。</p>';
    }
    sessionEl.innerHTML = '<div class="s-wrap"><div class="s-top"><button class="icon-btn" data-act="exit" aria-label="关闭">' + I.close + '</button>' +
      '<div class="s-progress"><i style="width:100%"></i></div><div class="s-count">完成</div></div>' +
      '<div class="s-body s-end"><div class="end">' +
      '<div class="end-icon">' + I.check + '</div><h2>这一轮完成了</h2>' + body +
      '<p class="hint">已经连续学习 ' + Store.streak() + ' 天。</p>' +
      '</div></div><div class="s-actions">' +
      (more ? '<button class="btn primary big" data-act="continue">' + contLabel + '</button><button class="btn link" data-act="exit">先到这里</button>'
        : '<button class="btn primary big" data-act="exit">完成</button>') +
      '</div></div>';
  }

  // 中途退出（扇贝式）：已完成的保持；没完成但不熟过的 → 盒子 1、明天；没碰过的不变
  function sbAbandon() {
    if (S.peek >= 0) S.peek = -1;
    if (S.side === 'back' && S.pending) sbCommit();
    S.words.forEach(function (x) {
      if (!x.done && x.missed) { x.done = true; SRS.grade(x.id, x.type === 'new' ? 'newMissed' : 'again'); }
    });
  }

  function exitSession() {
    var had = S && (S.sb ? S.history.length > 0 : S.idx > 0);
    if (S && S.sb && !S.ended) sbAbandon();
    S = null;
    if (had && Cloud) Cloud.changed(); // 学完一轮：过 3 秒同步一次
    sessionEl.hidden = true;
    sessionEl.innerHTML = '';
    document.body.classList.remove('in-session');
    route();
  }

  function speakCurrent(which) {
    var w = curWord();
    if (!w) return;
    if (which === 'ex') Speech.speak(w.example && w.example.es, null, 'sentence');
    else Speech.speak(Data.speakText(w), which === 'slow' ? 'turtle' : null, 'word');
  }

  /* ---------- 按键声音 + 震动 ----------
   * 捕获阶段先放“嗒”（在页面处理点击之前），然后页面照常在同一个点击里朗读。
   * 朗读类的按钮（喇叭、点单词、声音列表）不加“嗒”，免得和发音叠在一起。“不认识”用另一个更低更轻的声音。 */
  var Sfx = Ene.Sfx || null;
  var gestureEvent = null; // 当前正在处理的用户操作（给结束页的“叮—咚”判断是不是真的用户操作）
  function markGesture(e) { gestureEvent = e; setTimeout(function () { if (gestureEvent === e) gestureEvent = null; }, 0); }
  var TAP_ACTS = ['next', 'prev', 'start', 'extra', 'review', 'pick-book', 'unit-learn', 'unit-review', 'continue', 'exit',
    'set', 'toggle-autoplay', 'toggle-sound', 'toggle-vibrate', 'cloud-open', 'voice-diag-open'];
  document.addEventListener('click', function (e) {
    markGesture(e);
    if (!Sfx || !e.target.closest) return;
    var el = e.target.closest('[data-act], .tabbar a, a.unit, .top a.icon-btn, a.bk-now, a.set-link');
    if (!el || el.disabled) return;
    var act = el.getAttribute('data-act');
    // 四选一：选对“嗒”，选错 / 不知道是更低的“嘟”
    if (act === 'dunno' || (act === 'pick' && !el.hasAttribute('data-ok'))) Sfx.miss(e);
    else if (act === 'pick') Sfx.tap(e);
    else if (!act || TAP_ACTS.indexOf(act) >= 0) Sfx.tap(e);
  }, true);

  /* ---------- 点击（统一处理） ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');
    switch (act) {
      case 'start': startSession({ mode: 'all' }); break;
      case 'extra': startSession({ mode: 'all', extra: EXTRA }); break;
      case 'review': startSession({ mode: 'review' }); break;
      case 'pick-book': pickBook(el.getAttribute('data-v')); break;
      case 'unit-learn': startSession({ mode: 'unit', unitId: el.getAttribute('data-unit') }); break;
      case 'unit-review': startSession({ mode: 'unit-review', unitId: el.getAttribute('data-unit') }); break;
      case 'row': { // 单元页：点一行 = 读这个词 + 展开 / 收起例句
        el.classList.toggle('open');
        var rw = Data.word(el.getAttribute('data-id'));
        if (rw) Speech.speak(Data.speakText(rw));
        break;
      }
      case 'say-row-ex': { // 单元页：点展开的例句 = 读例句（不收起）
        e.stopPropagation();
        var xw = Data.word(el.getAttribute('data-id'));
        if (xw && xw.example) Speech.speak(xw.example.es, null, 'sentence');
        break;
      }
      case 'say-word': {
        e.stopPropagation();
        var w = Data.word(el.getAttribute('data-id'));
        if (w) Speech.speak(Data.speakText(w));
        break;
      }
      case 'set': {
        var k = el.getAttribute('data-k'), v = el.getAttribute('data-v');
        if (k === 'newPerDay' || k === 'reviewBatch') v = Number(v);
        Store.setSetting(k, v);
        if (k === 'rate') Speech.speak('Hola, ¿cómo estás?', v, 'sentence');
        if (k === 'theme') applyTheme(v);
        if (k === 'reviewBatch') { if (currentTab === 'review') renderReview(); else renderHome(); }
        else renderMe();
        break;
      }
      case 'toggle-autoplay': Store.setSetting('autoplay', !Store.settings().autoplay); renderMe(); break;
      case 'test-voice':
        if (!Speech.speak('Hola, ¿cómo estás?', null, 'sentence')) toast('现在不能朗读');
        else if (Speech.missing()) toast('没有找到西班牙语发音，请先添加');
        break;
      case 'voice-diag-open': voiceDiagOpen = !voiceDiagOpen; renderMe(); break;
      case 'voice-pick':
        // 先在点击里同步试听（iPhone 要求），再重画列表
        if (!Speech.choose(el.getAttribute('data-v'))) toast('现在不能朗读');
        renderMe();
        break;
      case 'voice-diag':
        if (!Speech.test(el.getAttribute('data-m'))) toast('现在不能朗读');
        break;
      // 学习环节
      case 'say': e.stopPropagation(); speakCurrent('word'); break;
      case 'say-slow': e.stopPropagation(); speakCurrent('slow'); break;
      case 'say-ex': e.stopPropagation(); speakCurrent('ex'); break;
      case 'next': nextCard(); break;
      case 'prev': prevCard(); break;
      case 'pick': sbPick(Number(el.getAttribute('data-i'))); break;
      case 'dunno': sbPick(-1); break;
      case 'toggle-sound': Store.setSetting('sound', !Store.settings().sound); renderMe(); break;
      case 'toggle-vibrate': Store.setSetting('vibrate', !Store.settings().vibrate); renderMe(); break;
      case 'continue': {
        var o = S.opts;
        S = null;
        startSession(o.mode === 'all' ? { mode: 'all' } : o);
        if (!S) exitSession();
        break;
      }
      case 'exit': exitSession(); break;
      case 'cloud-open': case 'cloud-sync': case 'cloud-logout':
      case 'cloud-signup': case 'cloud-resend':
        cloudAct(act); break;
      case 'cloud-login': e.preventDefault(); cloudAct(act); break;
    }
  });

  /* ---------- 键盘 ----------
   * 只看：空格 / 回车 / → = 下一个，← = 上一个
   * 四选一正面：1–4 = 选第几个，0 = 不知道
   * 扇贝式背面：空格 / 回车 / → = 下一个，← = 上一个（回看）
   * Esc = 退出 */
  document.addEventListener('keydown', function (e) {
    if (!S || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    markGesture(e);
    if (k === 'Escape') { e.preventDefault(); exitSession(); return; }
    if (S.ended) {
      if (k === 'ArrowLeft' && !S.sb) { e.preventDefault(); if (Sfx) Sfx.tap(e); viewPrev(); return; }
      if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        var btn = sessionEl.querySelector('[data-act="continue"]') || sessionEl.querySelector('[data-act="exit"]');
        if (btn) btn.click();
      }
      return;
    }
    if (e.repeat) { if (k === ' ' || k.indexOf('Arrow') === 0) e.preventDefault(); return; }
    var front = S.sb && S.peek < 0 && S.side === 'front';
    if (front) {
      // 1–4 = 选第几个，0 = 不知道
      var n = '01234'.indexOf(k);
      if (n >= 0 && k.length === 1 && S.quiz && S.quiz.picked < 0) {
        e.preventDefault();
        var c = n > 0 ? S.quiz.list[n - 1] : null;
        if (n > 0 && !c) return;
        if (Sfx) { if (c && c.ok) Sfx.tap(e); else Sfx.miss(e); }
        sbPick(n - 1);
      }
      return;
    }
    if (k === 'ArrowLeft') { e.preventDefault(); if (canGoBack()) { if (Sfx) Sfx.tap(e); prevCard(); } return; }
    if (k === ' ' || k === 'Enter' || k === 'ArrowRight') { e.preventDefault(); if (Sfx) Sfx.tap(e); nextCard(); }
  });

  /* ---------- 手机上拖动卡片：左滑 = 下一个，右滑 = 上一个 ----------
   * 卡片跟着手指走（平移 + 最多 6° 旋转 + 稍微变淡）；松手时超过宽度 30% 或快速一甩就翻页，否则弹回。
   * 只有横向移动明显占主导才开始拖（不影响上下滚动和点单词朗读）。扇贝式正面不能拖（只能选认识 / 不认识）。
   * 横向移动时一律 preventDefault，挡住浏览器的“滑动返回上一页”。 */
  var drag = null; // 拖过的手指不会再触发 click（浏览器只给没移动的轻点发 click）
  function bodyEl() { return sessionEl.querySelector('.s-wrap > .s-body'); }
  sessionEl.addEventListener('touchstart', function (e) {
    var t = e.touches && e.touches[0];
    drag = null;
    if (!t || e.touches.length !== 1 || !S || S.ended) return;
    drag = { x0: t.clientX, y0: t.clientY, t0: Date.now(), on: false, dead: false, x: 0, el: bodyEl(), W: sessionEl.clientWidth || window.innerWidth };
  }, { passive: true });
  sessionEl.addEventListener('touchmove', function (e) {
    var t = e.touches && e.touches[0];
    if (!drag || !t || drag.dead) return;
    var dx = t.clientX - drag.x0, dy = t.clientY - drag.y0;
    if (!drag.on) {
      if (Math.abs(dy) > 12 && Math.abs(dy) >= Math.abs(dx)) { drag.dead = true; return; } // 上下滚动
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (!canNavigate()) { drag.dead = true; if (e.cancelable) e.preventDefault(); return; }
        drag.on = true;
      } else return;
    }
    if (e.cancelable) e.preventDefault();
    // 往右拖但没有上一张：阻力大一些
    if (dx > 0 && !canGoBack()) dx = dx * 0.25;
    drag.x = dx;
    drag.rot = Math.max(-6, Math.min(6, dx / drag.W * 12));
    drag.op = 1 - Math.min(0.35, Math.abs(dx) / drag.W * 0.6);
    if (drag.el && !reduceMotion()) {
      drag.el.style.transform = 'translateX(' + dx + 'px) rotate(' + drag.rot + 'deg)';
      drag.el.style.opacity = drag.op;
    }
  }, { passive: false });
  sessionEl.addEventListener('touchmove', function (e) {
    // 没开始拖、但横向明显：也挡住浏览器的返回手势
    var t = e.touches && e.touches[0];
    if (!drag || !t || drag.on) return;
    if (Math.abs(t.clientX - drag.x0) > 10 && Math.abs(t.clientX - drag.x0) > Math.abs(t.clientY - drag.y0) && e.cancelable) e.preventDefault();
  }, { passive: false });
  function springBack(d) {
    if (!d.el) return;
    var from = d.el.style.transform || 'none', op = d.el.style.opacity || 1;
    d.el.style.transform = ''; d.el.style.opacity = '';
    if (!reduceMotion() && typeof d.el.animate === 'function') {
      d.el.animate([{ transform: from, opacity: op }, { transform: 'none', opacity: 1 }], { duration: ANIM_MS, easing: 'cubic-bezier(.2,.8,.3,1.2)' });
    }
  }
  sessionEl.addEventListener('touchend', function (e) {
    var d = drag; drag = null;
    if (!d || !d.on) return;
    var dt = Math.max(1, Date.now() - d.t0), v = d.x / dt; // 像素 / 毫秒
    var go = Math.abs(d.x) > d.W * 0.3 || (Math.abs(v) > 0.6 && Math.abs(d.x) > 40);
    var dir = d.x < 0 ? 'next' : 'prev';
    if (!go || !S || (dir === 'prev' && !canGoBack())) { springBack(d); return; }
    markGesture(e);
    if (Sfx) Sfx.tap(e);
    var pose = { x: d.x, rot: d.rot || 0, op: d.op || 1 };
    if (dir === 'next') nextCard(pose); else prevCard(pose); // 同步换卡 + 朗读，然后再播动画
  }, { passive: true });
  sessionEl.addEventListener('touchcancel', function () { if (drag && drag.on) springBack(drag); drag = null; }, { passive: true });

  window.addEventListener('hashchange', route);
  Speech.onChange(function () { if (!S && (currentTab === 'me' || currentTab === 'learn')) route(); });
  // 跨过午夜 / 从后台回来：刷新一下今天的数字
  document.addEventListener('visibilitychange', function () { if (!document.hidden && !S) route(); });

  applyTheme(Store.settings().theme);
  renderTabbar();
  route();

  // 只有 https 才注册离线缓存（file:// 不行）
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  // 给测试用
  Ene.App = { route: route, startSession: startSession, state: function () { return S; } };
})();
