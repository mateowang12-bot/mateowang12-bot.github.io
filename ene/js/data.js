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

  var raw = Array.isArray(window.ENE_UNITS) ? window.ENE_UNITS : [];
  var units = [];
  var byUnit = {};
  var words = {};     // id -> word（word.unit 指向单元）
  var order = [];     // 所有单词 id，按单元、按顺序

  raw.forEach(function (u) {
    if (!u || typeof u.id !== 'string' || byUnit[u.id]) return;
    var unit = {
      id: u.id,
      no: Number(u.no) || units.length + 1,
      level: String(u.level || 'A1').toUpperCase(), // A1 / A2 / PRO（专业场景）……
      pro: String(u.level || '').toUpperCase() === 'PRO', // 专业场景：不进每天的新词，只能在单元页自己学
      scene: u.scene || '',
      titleZh: u.titleZh || u.scene || '',
      titleEs: u.titleEs || '',
      words: []
    };
    (Array.isArray(u.words) ? u.words : []).forEach(function (w) {
      if (!w || typeof w.id !== 'string' || !w.es) return;
      if (words[w.id]) { try { console.warn('重复的单词 id：' + w.id); } catch (e) {} return; }
      w.unit = unit;
      words[w.id] = w;
      unit.words.push(w);
    });
    byUnit[unit.id] = unit;
    units.push(unit);
  });
  units.sort(function (a, b) { return a.no - b.no; });
  units.forEach(function (u) { u.words.forEach(function (w) { order.push(w.id); }); });

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
    word: function (id) { return words[id] || null; },
    order: order,
    count: order.length,
    posLabel: posLabel,
    display: display,
    speakText: speakText
  };
})();
