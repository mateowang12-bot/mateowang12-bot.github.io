/* Eñe 西语单词 —— 朗读（speechSynthesis）
 * - 优先拉美西语：es-MX、es-US、es-419、es-CO、es-AR、其他非西班牙的 es-*，最后才是 es-ES
 * - 优先本机语音（在线语音开口慢）
 * - iPhone 要求：必须在点击事件里“同步”调用 speak，所以这里不用 setTimeout
 */
(function () {
  'use strict';
  var Ene = (window.Ene = window.Ene || {});
  var synth = window.speechSynthesis || null;

  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  var RATES = isIOS
    ? { vslow: 0.45, slow: 0.6, normal: 0.85, turtle: 0.35 }
    : { vslow: 0.6, slow: 0.8, normal: 1, turtle: 0.5 }; // 电脑：用户觉得原来的“慢”(0.65) 太慢（2026-11-14）

  var REGION_RANK = { MX: 0, US: 1, '419': 2, CO: 3, AR: 4 };
  var REGION_ZH = {
    MX: '墨西哥', US: '美国', '419': '拉丁美洲', CO: '哥伦比亚', AR: '阿根廷', ES: '西班牙',
    CL: '智利', PE: '秘鲁', VE: '委内瑞拉', CU: '古巴', UY: '乌拉圭', EC: '厄瓜多尔',
    BO: '玻利维亚', PY: '巴拉圭', CR: '哥斯达黎加', PA: '巴拿马', DO: '多米尼加',
    GT: '危地马拉', HN: '洪都拉斯', NI: '尼加拉瓜', SV: '萨尔瓦多', PR: '波多黎各'
  };

  var voice = null;
  var voicesChecked = false;
  var listeners = [];

  function region(lang) {
    var m = String(lang || '').replace('_', '-').split('-');
    return (m[1] || '').toUpperCase();
  }
  function isSpanish(v) { return /^es([-_]|$)/i.test(v.lang || ''); }
  function score(v) {
    var r = region(v.lang);
    var s;
    if (REGION_RANK.hasOwnProperty(r)) s = REGION_RANK[r];
    else if (r === 'ES') s = 6;
    else s = 5; // 其他拉美国家或没写国家
    if (!v.localService) s += 2.5; // 在线语音：慢，往后排
    return s;
  }

  // 设备上所有西语声音，按“推荐”顺序排好（拉美、本机优先）
  function spanishVoices() {
    if (!synth) return [];
    var list = [];
    try { list = synth.getVoices() || []; } catch (e) { list = []; }
    if (list.length) voicesChecked = true;
    var es = list.filter(isSpanish);
    es.sort(function (a, b) { return score(a) - score(b); });
    return es;
  }
  function voiceId(v) { return v ? String(v.voiceURI || v.name || '') : ''; }
  function savedVoice() { return Ene.Store ? String(Ene.Store.settings().voice || '') : ''; }

  // 用户在“我的”里选过声音就用它（按 voiceURI，找不到再按名字）；没选过或这台设备上没有 → 自动选
  var pickedFor = null;
  function pick() {
    var es = spanishVoices();
    var want = savedVoice();
    pickedFor = want;
    if (!es.length) { voice = null; return null; }
    var chosen = null;
    if (want) {
      for (var i = 0; i < es.length && !chosen; i++) if (es[i].voiceURI && es[i].voiceURI === want) chosen = es[i];
      for (var j = 0; j < es.length && !chosen; j++) if (es[j].name === want) chosen = es[j];
    }
    voice = chosen || es[0];
    return voice;
  }

  function notify() { for (var i = 0; i < listeners.length; i++) { try { listeners[i](); } catch (e) {} } }

  if (synth) {
    pick();
    try {
      if (synth.addEventListener) synth.addEventListener('voiceschanged', function () { pick(); notify(); });
      else synth.onvoiceschanged = function () { pick(); notify(); };
    } catch (e) {}
    // 有的浏览器不会触发 voiceschanged：过一会儿再看一次
    setTimeout(function () { pick(); voicesChecked = true; notify(); }, 1500);
  } else {
    voicesChecked = true;
  }

  function rateFor(speed) {
    if (speed === 'turtle') {
      var cur = Ene.Store ? Ene.Store.settings().rate : 'slow';
      return cur === 'vslow' ? RATES.turtle : RATES.vslow;
    }
    return RATES[speed] || RATES.slow;
  }

  /* ---------- 西语分音节（给“慢速”用） ----------
   * 规则：ch / ll / rr 算一个辅音；qu、gu（后面是 e / i）里的 u 不发音，算辅音的一部分；
   * pl pr bl br cl cr dr tr fl fr gl gr 不拆开；两个强元音（a e o）或带重音的 í / ú 和别的元音 = 分开（hiatus）；
   * 其余相邻元音 = 二合元音（不拆）；词尾的 y 当元音。 */
  var STRONG = 'aeoáéó', WEAK = 'iuü', ACC_WEAK = 'íú';
  var CLUSTERS = ['pl', 'pr', 'bl', 'br', 'cl', 'cr', 'dr', 'tr', 'fl', 'fr', 'gl', 'gr', 'kl', 'kr'];
  function isVowelCh(c) { return (STRONG + WEAK + ACC_WEAK).indexOf(c) >= 0; }

  function syllables(word) {
    var w = String(word || '').toLowerCase();
    if (!/[a-záéíóúüñ]/.test(w)) return [word];
    // 1. 切成“单位”：{ s: 文字, v: 是不是元音, key: 用来判断辅音组合 }
    var units = [];
    for (var i = 0; i < w.length; i++) {
      var c = w[i], n = w[i + 1], n2 = w[i + 2];
      if ((c === 'c' && n === 'h') || (c === 'l' && n === 'l') || (c === 'r' && n === 'r')) {
        units.push({ s: c + n, v: false, key: c + n }); i++; continue;
      }
      if ((c === 'q' || c === 'g') && n === 'u' && n2 && 'eéií'.indexOf(n2) >= 0) {
        units.push({ s: c + n, v: false, key: c }); i++; continue;
      }
      if (c === 'y') {
        var last = i === w.length - 1 || !/[a-záéíóúüñ]/.test(n || '');
        var prevV = units.length && units[units.length - 1].v;
        if (last && prevV) { units.push({ s: c, v: true, weak: true }); continue; }
        units.push({ s: c, v: false, key: c }); continue;
      }
      if (isVowelCh(c)) units.push({ s: c, v: true, strong: STRONG.indexOf(c) >= 0 || ACC_WEAK.indexOf(c) >= 0, acc: ACC_WEAK.indexOf(c) >= 0 });
      else units.push({ s: c, v: false, key: c });
    }
    // 2. 找出“韵核”（一个或几个连着的元音），两个强元音之间要断开
    var nuclei = []; // [起点, 终点] 单位下标
    for (var j = 0; j < units.length; j++) {
      if (!units[j].v) continue;
      var start = j;
      while (j + 1 < units.length && units[j + 1].v) {
        var a = units[j], b = units[j + 1];
        var hiatus = (a.strong && b.strong) || a.acc || b.acc;
        if (hiatus) break;
        j++;
      }
      nuclei.push([start, j]);
    }
    if (nuclei.length <= 1) return [word];
    // 3. 两个韵核之间的辅音怎么分
    var cuts = []; // 新音节从哪个单位开始
    for (var k = 0; k < nuclei.length - 1; k++) {
      var from = nuclei[k][1] + 1, to = nuclei[k + 1][0]; // 辅音在 [from, to)
      var cons = to - from, cut;
      var pair = function (x) { return units[x].key + units[x + 1].key; };
      if (cons === 0) cut = to;
      else if (cons === 1) cut = from;
      else if (cons === 2) cut = CLUSTERS.indexOf(pair(from)) >= 0 ? from : from + 1;
      else if (cons === 3) cut = CLUSTERS.indexOf(pair(from + 1)) >= 0 ? from + 1 : from + 2;
      else cut = from + 2;
      cuts.push(cut);
    }
    // 4. 按原来的字母（保留大写和重音）拼回去
    var out = [], pos = 0, startUnit = 0, origPos = 0;
    var lens = units.map(function (u) { return u.s.length; });
    cuts.concat([units.length]).forEach(function (cut) {
      var len = 0;
      for (var m = startUnit; m < cut; m++) len += lens[m];
      out.push(String(word).substr(origPos, len));
      origPos += len; startUnit = cut;
    });
    return out.filter(function (s) { return s; });
  }

  /* ---------- 说话 ----------
   * 设置顺序：先 rate、pitch，再 lang、voice（有说法是 WebKit 在先设 voice 后设 rate 时会忽略 rate）；
   * 只有正在说话时才 cancel（cancel 后立刻 speak，iOS 有时会忽略 rate）。
   * 所有 speak() 都在同一次点击里同步排队，不用 setTimeout（iOS 会拦截延迟的朗读）。 */
  function makeUtt(text, rate, mode) {
    var u = new SpeechSynthesisUtterance(String(text));
    if (mode === 'A') { // 旧方法：先 voice / lang，后 rate
      if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'es-MX';
      u.rate = rate; u.pitch = 1;
      return u;
    }
    u.rate = rate; u.pitch = 1;
    u.lang = voice ? voice.lang : 'es-MX';
    if (voice && mode !== 'B') u.voice = voice; // B：不指定声音，只给语言
    return u;
  }

  function begin() {
    if (!voice || pickedFor !== savedVoice()) pick(); // 换过声音（或同步来了别的设置）就重新找
    if (synth.speaking || synth.pending) synth.cancel();
  }

  // 慢速朗读的“说法清单”：例句 → 一个词一个词；单词（3 个音节以上）→ 一个音节一个音节，最后整词正常读一遍
  function slowPlan(text, kind) {
    var t = String(text).trim();
    var parts = t.split(/\s+/).filter(function (x) { return /[a-záéíóúüñ0-9]/i.test(x); });
    if (kind === 'sentence') return { pieces: parts, whole: null };
    var syl = [];
    parts.forEach(function (p) { syllables(p.replace(/[,.;:!?¡¿"]/g, '')).forEach(function (s) { syl.push(s); }); });
    if (syl.length >= 3) return { pieces: syl, whole: t };
    if (parts.length > 1) return { pieces: parts, whole: t };
    return { pieces: [t], whole: null };
  }

  function queueSlow(text, kind, rate) {
    var plan = slowPlan(text, kind);
    plan.pieces.forEach(function (p) { synth.speak(makeUtt(p, rate)); });
    if (plan.whole) synth.speak(makeUtt(plan.whole, RATES.normal));
    return plan;
  }

  /* speed: 'vslow' | 'slow' | 'normal' | 'turtle'（不传就用设置里的）；kind: 'word'（默认）| 'sentence'
   * 很慢 / 乌龟：句子按词、3 个音节以上的单词按音节（最后整词再读一遍）
   * 慢：电脑上只调语速；iPhone 上的声音常常不理语速，所以句子按词分开读，单词一次读完
   * 正常：一次读完
   * 不管哪种，都照样设置 rate（换成支持调速的声音时就有效） */
  function speak(text, speed, kind) {
    if (!synth || !text) return false;
    try {
      begin();
      var sp = speed || (Ene.Store ? Ene.Store.settings().rate : 'slow');
      var rate = rateFor(sp);
      kind = kind || 'word';
      // 电脑的声音会听语速，所以只调语速、不拆开读（拆开读 + 低语速太慢了）；拆开读只给 iPhone 用
      if ((sp === 'turtle' || sp === 'vslow') && isIOS) queueSlow(text, kind, rate);
      else if (sp === 'slow' && isIOS && kind === 'sentence') queueSlow(text, 'sentence', rate);
      else synth.speak(makeUtt(text, rate));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* 口语课用：按变体选声音（'es' = 优先西班牙的声音，'latam' = 平常选的拉美声音），
   * rate 直接给数字；读完调用 onEnd（有的浏览器不触发 onend，所以加一个兜底计时）。
   * 和 speak 一样在点击里同步调用。 */
  function spainVoice() {
    var list = spanishVoices().filter(function (v) { return region(v.lang) === 'ES'; });
    list.sort(function (a, b) { return (b.localService ? 1 : 0) - (a.localService ? 1 : 0); });
    return list[0] || null;
  }
  function estMs(text, rate) { return Math.max(900, String(text).split(/\s+/).length * 380 / (rate || 1)); }
  function speakAs(text, rate, variant, onEnd, pitch) {
    var done = false;
    function fin() { if (done) return; done = true; if (onEnd) { try { onEnd(); } catch (e) {} } }
    if (!synth || !text) { setTimeout(fin, estMs(text || '', rate)); return false; }
    try {
      begin();
      var u = new SpeechSynthesisUtterance(String(text));
      u.rate = rate || 1; u.pitch = pitch || 1;
      var v = variant === 'es' ? (spainVoice() || voice) : voice;
      u.lang = v ? v.lang : (variant === 'es' ? 'es-ES' : 'es-MX');
      if (v) u.voice = v;
      u.onend = fin; u.onerror = fin;
      synth.speak(u);
      setTimeout(fin, estMs(text, rate) * 2.5 + 1500);
      return true;
    } catch (e) { setTimeout(fin, estMs(text, rate)); return false; }
  }
  function stop() { try { if (synth && (synth.speaking || synth.pending)) synth.cancel(); } catch (e) {} }

  function regionZh(lang) {
    var r = region(lang);
    return REGION_ZH[r] || (r ? '其他地区' : '通用');
  }

  // 给“我的”页的声音列表
  function voiceList() {
    var cur = voiceId(voice);
    return spanishVoices().map(function (v) {
      return { id: voiceId(v), name: v.name, lang: v.lang, region: regionZh(v.lang), local: !!v.localService, current: voiceId(v) === cur };
    });
  }

  // 选一个声音（'' = 自动选择），马上用 0.35 的语速读一句（一句话一次读完，听得出这个声音支不支持调速）
  function choose(id) {
    if (Ene.Store) Ene.Store.setSetting('voice', String(id || ''));
    pick();
    notify();
    if (!synth) return false;
    try {
      if (synth.speaking || synth.pending) synth.cancel();
      synth.speak(makeUtt(TEST_TEXT, 0.35));
      return true;
    } catch (e) { return false; }
  }

  // “发音测试”：A 旧方法 / B 不指定声音 / C 先设 rate / D 一个词一个词
  var TEST_TEXT = 'Buenos días, ¿cómo estás?';
  function test(mode) {
    if (!synth) return false;
    try {
      begin();
      if (mode === 'D') queueSlow(TEST_TEXT, 'sentence', 0.35);
      else synth.speak(makeUtt(TEST_TEXT, 0.35, mode));
      return true;
    } catch (e) { return false; }
  }

  function voiceLabel() {
    if (!voice) return '';
    return '西班牙语（' + regionZh(voice.lang) + '）· ' + (voice.localService ? '本机语音' : '在线语音');
  }

  Ene.Speech = {
    supported: !!synth,
    isIOS: isIOS,
    RATES: RATES,
    speak: speak,
    speakAs: speakAs,
    stop: stop,
    test: test,
    voiceList: voiceList,
    choose: choose,
    savedVoice: savedVoice,
    syllables: syllables,
    slowPlan: slowPlan,
    voiceInfo: function () { return voice ? { name: voice.name, lang: voice.lang, local: !!voice.localService } : null; },
    // 已经确认过：设备上没有任何西语语音
    missing: function () { return voicesChecked && !voice; },
    voice: function () { return voice; },
    voiceLabel: voiceLabel,
    onChange: function (fn) { listeners.push(fn); }
  };
})();
