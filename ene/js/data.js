/* Eñe 西语单词 —— 整理单词数据
 * data/u01.js … u26.js 会把单元放进 window.ENE_UNITS。
 * 有的文件可能还不存在：有几个单元就用几个。
 */
(function () {
  'use strict';
  var Ene = (window.Ene = window.Ene || {});

  var POS = {
    n: '名词', v: '动词', adj: '形容词', adv: '副词', pron: '代词',
    prep: '介词', conj: '连词', num: '数词', interj: '感叹词', phr: '短语'
  };

  /* 课本：每个单元有 book（不写 = 'ene' 基础词汇）和 group（书里的分组，比如“第一册”“A1”）。
   * 同一个词可以出现在几本书里：书里写 { ref: "已有的 id" }，或者西语 + 词性和前面的词完全一样，
   * 都当作同一个词（共用一份学习进度）。所以加载顺序固定：基础词汇 → 其他书（见 BOOKS）。 */
  var BOOKS = [
    { id: 'ene', titleZh: 'Eñe 基础词汇', sub: 'A1–A2 常用词 + 专业场景（本 App 自编）' },
    { id: 'dele', titleZh: 'DELE 考试词汇', sub: '按 A1 · A2 · B1 · B2 各级要求整理' },
    { id: 'xianxi', titleZh: '《现代西班牙语》', sub: '按第 1–4 册的程度和话题整理' },
    { id: 'sucheng', titleZh: '《速成西班牙语》', sub: '按第 1–3 册的程度和话题整理' }
  ];
  var bookIndex = {};
  BOOKS.forEach(function (b, i) { b.i = i; b.units = []; b.order = []; bookIndex[b.id] = b; });

  var raw = Array.isArray(window.ENE_UNITS) ? window.ENE_UNITS : [];
  var units = [];
  var byUnit = {};
  var words = {};     // id -> word（word.unit 指向这个词第一次出现的单元）
  var byKey = {};     // “西语|词性” -> word（找同一个词）
  var order = [];     // 所有单词 id（不重复），按课本、单元的顺序

  function key(w) { return String(w.es).toLowerCase().replace(/[¿?¡!.,…]/g, '').replace(/\s+/g, ' ').trim() + '|' + (w.pos || ''); }

  raw.forEach(function (u, ri) {
    if (!u || typeof u.id !== 'string' || byUnit[u.id]) return;
    var book = bookIndex[u.book] ? u.book : 'ene';
    var unit = {
      id: u.id,
      book: book,
      group: u.group || '',
      no: Number(u.no) || units.length + 1,
      level: String(u.level || 'A1').toUpperCase(), // A1 / A2 / B1 / B2 / PRO（专业场景）……
      pro: String(u.level || '').toUpperCase() === 'PRO', // 专业场景：不进每天的新词，只能在单元页自己学
      scene: u.scene || '',
      titleZh: u.titleZh || u.scene || '',
      titleEs: u.titleEs || '',
      words: [],
      _raw: Array.isArray(u.words) ? u.words : [],
      _ri: ri
    };
    byUnit[unit.id] = unit;
    units.push(unit);
  });
  // 按 课本 → 原来的加载顺序 排，这样“同一个词”总是归到最早的那本书（进度 id 不会变）
  units.sort(function (a, b) { return bookIndex[a.book].i - bookIndex[b.book].i || a._ri - b._ri; });
  units.forEach(function (unit) {
    var seen = {};
    unit._raw.forEach(function (w) {
      if (!w) return;
      var real = null;
      if (typeof w.ref === 'string') real = words[w.ref] || null;
      else if (typeof w.id === 'string' && w.es) {
        if (words[w.id]) { try { console.warn('重复的单词 id：' + w.id); } catch (e) {} return; }
        real = byKey[key(w)] || null; // 别的书里已经有一样的词：共用
        if (!real) {
          w.unit = unit;
          words[w.id] = w;
          byKey[key(w)] = w;
          order.push(w.id);
          real = w;
        }
      }
      if (!real || seen[real.id]) return;
      seen[real.id] = true;
      unit.words.push(real);
    });
    delete unit._raw; delete unit._ri;
    var b = bookIndex[unit.book];
    b.units.push(unit);
    unit.words.forEach(function (w) { if (b.order.indexOf(w.id) < 0) b.order.push(w.id); });
  });
  // 每本书里的单元保持加载顺序（文件顺序：第一册 → 第二册……，文件里从上到下）
  var books = BOOKS.filter(function (b) { return b.units.length > 0; });

  function posLabel(w) {
    var p = POS[w.pos] || '';
    if (w.pos === 'n') {
      if (w.fem) return '名词·阳/阴';
      if (w.gender === 'm') return '名词·阳性';
      if (w.gender === 'f') return '名词·阴性';
      if (w.gender === 'mf') return '名词·阴阳同形';
    }
    return p;
  }

  // 显示用："el amigo / la amiga"
  function display(w) { return w.fem ? w.es + ' / ' + w.fem : w.es; }
  // 朗读用：中间停顿一下
  function speakText(w) { return w.fem ? w.es + ', ' + w.fem : w.es; }

  Ene.Data = {
    units: units,
    unit: function (id) { return byUnit[id] || null; },
    // 有内容的课本（没有单词的书不显示）
    books: books,
    book: function (id) { return (bookIndex[id] && bookIndex[id].units.length) ? bookIndex[id] : bookIndex.ene; },
    word: function (id) { return words[id] || null; },
    order: order,
    count: order.length,
    posLabel: posLabel,
    display: display,
    speakText: speakText
  };
})();
