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
    : { vslow: 0.5, slow: 0.65, normal: 0.8, turtle: 0.4 };

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

  function pick() {
    if (!synth) return null;
    var list = [];
    try { list = synth.getVoices() || []; } catch (e) { list = []; }
    var es = list.filter(isSpanish);
    if (list.length) voicesChecked = true;
    if (!es.length) { voice = null; return null; }
    es.sort(function (a, b) { return score(a) - score(b); });
    voice = es[0];
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

  // speed: 'vslow' | 'slow' | 'normal' | 'turtle'（不传就用设置里的）
  function speak(text, speed) {
    if (!synth || !text) return false;
    try {
      if (!voice) pick();
      if (synth.speaking || synth.pending) synth.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'es-MX'; }
      u.rate = rateFor(speed || (Ene.Store ? Ene.Store.settings().rate : 'slow'));
      u.pitch = 1;
      synth.speak(u);
      return true;
    } catch (e) {
      return false;
    }
  }

  function voiceLabel() {
    if (!voice) return '';
    var r = region(voice.lang);
    var where = REGION_ZH[r] || (r ? '其他地区' : '通用');
    return '西班牙语（' + where + '）· ' + (voice.localService ? '本机语音' : '在线语音');
  }

  Ene.Speech = {
    supported: !!synth,
    isIOS: isIOS,
    RATES: RATES,
    speak: speak,
    // 已经确认过：设备上没有任何西语语音
    missing: function () { return voicesChecked && !voice; },
    voice: function () { return voice; },
    voiceLabel: voiceLabel,
    onChange: function (fn) { listeners.push(fn); }
  };
})();
