/* Eñe —— 动词变位（Ene.Conj）
 * 按规则自动变位 + 不规则动词单独列出。只做 5 个最常用的时态、5 个人称（拉美说法：不列 vosotros）。
 *   Ene.Conj.table(word) → { kind: 'normal'|'gustar'|'impersonal', inf, rows: [{ k, zh, hint, forms[5] 或 [1] }], persons, note } 或 null（不是动词）
 *   Ene.Conj.forms(inf)  → { pres, pret, impf, fut, perf }（测试用）
 */
(function () {
  'use strict';
  window.Ene = window.Ene || {};

  var PERSONS = [
    { es: 'yo', zh: '我' },
    { es: 'tú', zh: '你' },
    { es: 'él / ella / usted', zh: '他 / 她 / 您' },
    { es: 'nosotros', zh: '我们' },
    { es: 'ellos / ustedes', zh: '他们 / 你们' }
  ];
  var TENSES = [
    { k: 'pres', zh: '现在时', hint: '现在做、经常做' },
    { k: 'pret', zh: '过去时', hint: '过去某个时候做完了（简单过去时）' },
    { k: 'impf', zh: '过去未完成时', hint: '过去经常做、当时正在做' },
    { k: 'fut', zh: '将来时', hint: '将来会做' },
    { k: 'perf', zh: '现在完成时', hint: '已经做了（haber + 过去分词）' }
  ];
  var END = {
    pres: { ar: ['o', 'as', 'a', 'amos', 'an'], er: ['o', 'es', 'e', 'emos', 'en'], ir: ['o', 'es', 'e', 'imos', 'en'] },
    pret: { ar: ['é', 'aste', 'ó', 'amos', 'aron'], er: ['í', 'iste', 'ió', 'imos', 'ieron'], ir: ['í', 'iste', 'ió', 'imos', 'ieron'] },
    impf: { ar: ['aba', 'abas', 'aba', 'ábamos', 'aban'], er: ['ía', 'ías', 'ía', 'íamos', 'ían'], ir: ['ía', 'ías', 'ía', 'íamos', 'ían'] }
  };
  var FUT = ['é', 'ás', 'á', 'emos', 'án'];
  var HABER = ['he', 'has', 'ha', 'hemos', 'han'];
  var REFL = ['me', 'te', 'se', 'nos', 'se'];
  var IOBJ = ['me', 'te', 'le', 'nos', 'les'];

  // 词根元音变化（现在时 yo/tú/él/ellos；-ir 动词的过去时 él/ellos 也变：e→i、o→u）
  var IE = 'tender despertar sentar cerrar nevar pensar empezar entender perder recomendar confesar gobernar quebrar negar defender calentar sobrecalentar apretar atender extender verter mentir sentir preferir sugerir advertir divertir transferir invertir arrepentir desmentir hervir comenzar';
  var UE = 'sonar soler colgar torcer demostrar comprobar resolver consolar absolver acordar rodar encontrar recordar mostrar probar contar costar volver devolver envolver almorzar acostar dormir morir doler llover soñar mover soldar demoler colar esforzar cocer aprobar reprobar';
  var EI = 'pedir repetir servir seguir conseguir vestir despedir medir elegir corregir competir derretir';
  // 现在时 yo/tú/él/ellos 要加重音：envío、actúo、aíslo、reúno、prohíbo
  var ACC = 'enviar reenviar confiar esquiar extraviar enfriar criar resfriar actuar graduar evaluar aislar reunir prohibir';
  // “喜欢”类：主语是喜欢的东西 → me gusta / te gusta …
  var GUSTAR = 'gustar encantar interesar importar faltar doler';
  // 天气：只用第三人称单数
  var GUSTAR_ZH = { gustar: '让我喜欢', encantar: '让我特别喜欢', interesar: '让我感兴趣', importar: '对我很重要', faltar: '是我缺的' };
  var WEATHER = 'llover nevar';
  // 平时只说“它 / 它们”的动词：只列第三人称单数、复数
  var THIRD = set('ocurrir suceder escasear sobrecalentar');
  function set(s) { var o = {}; s.split(' ').forEach(function (x) { o[x] = 1; }); return o; }
  IE = set(IE); UE = set(UE); EI = set(EI); ACC = set(ACC); GUSTAR = set(GUSTAR); WEATHER = set(WEATHER);

  // 不规则动词（只写不规则的部分；f = 将来时词根，pp = 过去分词）
  function L(s) { return s.split(','); }
  var IRR = {
    ser: { pres: L('soy,eres,es,somos,son'), pret: L('fui,fuiste,fue,fuimos,fueron'), impf: L('era,eras,era,éramos,eran'), pp: 'sido' },
    estar: { pres: L('estoy,estás,está,estamos,están'), pret: L('estuve,estuviste,estuvo,estuvimos,estuvieron') },
    ir: { pres: L('voy,vas,va,vamos,van'), pret: L('fui,fuiste,fue,fuimos,fueron'), impf: L('iba,ibas,iba,íbamos,iban') },
    tener: { pres: L('tengo,tienes,tiene,tenemos,tienen'), pret: L('tuve,tuviste,tuvo,tuvimos,tuvieron'), f: 'tendr' },
    venir: { pres: L('vengo,vienes,viene,venimos,vienen'), pret: L('vine,viniste,vino,vinimos,vinieron'), f: 'vendr' },
    poner: { pres: L('pongo,pones,pone,ponemos,ponen'), pret: L('puse,pusiste,puso,pusimos,pusieron'), f: 'pondr', pp: 'puesto' },
    hacer: { pres: L('hago,haces,hace,hacemos,hacen'), pret: L('hice,hiciste,hizo,hicimos,hicieron'), f: 'har', pp: 'hecho' },
    decir: { pres: L('digo,dices,dice,decimos,dicen'), pret: L('dije,dijiste,dijo,dijimos,dijeron'), f: 'dir', pp: 'dicho' },
    traer: { pres: L('traigo,traes,trae,traemos,traen'), pret: L('traje,trajiste,trajo,trajimos,trajeron'), pp: 'traído' },
    dar: { pres: L('doy,das,da,damos,dan'), pret: L('di,diste,dio,dimos,dieron') },
    poder: { pres: L('puedo,puedes,puede,podemos,pueden'), pret: L('pude,pudiste,pudo,pudimos,pudieron'), f: 'podr' },
    saber: { pres: L('sé,sabes,sabe,sabemos,saben'), pret: L('supe,supiste,supo,supimos,supieron'), f: 'sabr' },
    querer: { pres: L('quiero,quieres,quiere,queremos,quieren'), pret: L('quise,quisiste,quiso,quisimos,quisieron'), f: 'querr' },
    salir: { pres: L('salgo,sales,sale,salimos,salen'), f: 'saldr' },
    ver: { pres: L('veo,ves,ve,vemos,ven'), pret: L('vi,viste,vio,vimos,vieron'), impf: L('veía,veías,veía,veíamos,veían'), pp: 'visto' },
    'oír': { pres: L('oigo,oyes,oye,oímos,oyen'), pret: L('oí,oíste,oyó,oímos,oyeron'), impf: L('oía,oías,oía,oíamos,oían'), pp: 'oído' },
    oler: { pres: L('huelo,hueles,huele,olemos,huelen') },
    caer: { pres: L('caigo,caes,cae,caemos,caen') },
    haber: { pres: L('he,has,ha,hemos,han'), pret: L('hube,hubiste,hubo,hubimos,hubieron'), f: 'habr' },
    'reír': { pres: L('río,ríes,ríe,reímos,ríen'), pret: L('reí,reíste,rio,reímos,rieron'), impf: L('reía,reías,reía,reíamos,reían'), pp: 'reído' },
    'sonreír': { pres: L('sonrío,sonríes,sonríe,sonreímos,sonríen'), pret: L('sonreí,sonreíste,sonrió,sonreímos,sonrieron'), impf: L('sonreía,sonreías,sonreía,sonreíamos,sonreían'), pp: 'sonreído' },
    'freír': { pres: L('frío,fríes,fríe,freímos,fríen'), pret: L('freí,freíste,frio,freímos,frieron'), impf: L('freía,freías,freía,freíamos,freían'), pp: 'frito' },
    jugar: { pres: L('juego,juegas,juega,jugamos,juegan') },
    avergonzar: { pres: L('avergüenzo,avergüenzas,avergüenza,avergonzamos,avergüenzan') },
    criar: { pret: L('crie,criaste,crio,criamos,criaron') }
  };
  // 带前缀的不规则动词跟着原词变：detener → tener，proponer → poner，extraer → traer……
  var PREFIXABLE = ['tener', 'venir', 'poner', 'traer', 'hacer', 'decir'];
  // 不规则过去分词（按词尾）
  var PP_END = [['scribir', 'scrito'], ['cubrir', 'cubierto'], ['olver', 'uelto'], ['romper', 'roto'], ['abrir', 'abierto'], ['morir', 'muerto'], ['imprimir', 'impreso']];

  function noAcc(s) { return s.replace(/[áéíóú]/g, function (c) { return 'aeiou'['áéíóú'.indexOf(c)]; }); }
  function accent(c) { return { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' }[c] || c; }
  function replaceLast(s, from, to) { var i = s.lastIndexOf(from); return i < 0 ? s : s.slice(0, i) + to + s.slice(i + from.length); }
  function isVowel(c) { return /[aeiouáéíóú]/.test(c || ''); }

  function irrFor(inf) {
    if (IRR[inf]) return { d: IRR[inf], pre: '' };
    for (var i = 0; i < PREFIXABLE.length; i++) {
      var k = PREFIXABLE[i];
      if (inf.length > k.length && inf.slice(-k.length) === k) return { d: IRR[k], pre: inf.slice(0, -k.length) };
    }
    return null;
  }

  // 一个动词原形（不带 se）的 5 个时态
  function forms(inf) {
    var plain = noAcc(inf);
    var type = plain.slice(-2), stem = plain.slice(0, -2);
    var irr = irrFor(inf), d = irr ? irr.d : {}, pre = irr ? irr.pre : '';
    function pf(arr) { return arr.map(function (x) { return pre + x; }); }
    var isUir = type === 'ir' && /[^gq]u$/.test(stem);              // construir, incluir…
    var vstem = (type === 'er' || type === 'ir') && /[aeo]$/.test(stem); // leer, creer, caer…
    var res = {};

    // 现在时
    if (d.pres) res.pres = pf(d.pres);
    else {
      res.pres = END.pres[type].map(function (e, p) {
        var s = stem;
        if (p !== 3) {
          if (IE[plain]) s = replaceLast(s, 'e', 'ie');
          else if (UE[plain]) s = replaceLast(s, 'o', 'ue');
          else if (EI[plain]) s = replaceLast(s, 'e', 'i');
          else if (ACC[plain]) { var j = Math.max(s.lastIndexOf('i'), s.lastIndexOf('u')); s = s.slice(0, j) + accent(s[j]) + s.slice(j + 1); }
          if (isUir) s += 'y';
        }
        if (p === 0 && type !== 'ar') {
          if (/gu$/.test(s)) s = s.slice(0, -2) + 'g';                       // seguir → sigo
          else if (/g$/.test(s)) s = s.slice(0, -1) + 'j';                   // recoger → recojo
          else if (/c$/.test(s)) {
            if (isVowel(s[s.length - 2]) && plain !== 'cocer') s = s.slice(0, -1) + 'zc'; // conocer → conozco
            else s = s.slice(0, -1) + 'z';                                   // convencer → convenzo, torcer → tuerzo
          }
        }
        return s + e;
      });
    }
    // 过去时
    if (d.pret) res.pret = pf(d.pret);
    else if (type === 'ir' && /duc$/.test(stem)) {
      var js = stem.slice(0, -1) + 'j';                                      // traducir → traduje
      res.pret = ['e', 'iste', 'o', 'imos', 'eron'].map(function (e) { return js + e; });
    } else {
      res.pret = END.pret[type].map(function (e, p) {
        var s = stem;
        if (type === 'ar' && p === 0) {
          if (/c$/.test(s)) s = s.slice(0, -1) + 'qu';
          else if (/g$/.test(s)) s = s + 'u';
          else if (/z$/.test(s)) s = s.slice(0, -1) + 'c';
        }
        if (type === 'ir' && (p === 2 || p === 4)) {
          if (IE[plain] || EI[plain]) s = replaceLast(s, 'e', 'i');
          else if (UE[plain]) s = replaceLast(s, 'o', 'u');
        }
        if ((vstem || isUir) && (p === 2 || p === 4)) e = e.replace(/^i/, 'y');   // leyó, construyeron
        else if (vstem && (p === 1 || p === 3)) e = e.replace(/^i/, 'í');         // leíste, leímos
        return s + e;
      });
    }
    // 过去未完成时
    res.impf = d.impf ? pf(d.impf) : END.impf[type].map(function (e) { return stem + e; });
    // 将来时
    var fs = d.f ? pre + d.f : plain;
    res.fut = FUT.map(function (e) { return fs + e; });
    // 现在完成时
    var pp = d.pp ? pre + d.pp : null;
    if (!pp) for (var i = 0; i < PP_END.length; i++) if (plain.slice(-PP_END[i][0].length) === PP_END[i][0]) { pp = plain.slice(0, -PP_END[i][0].length) + PP_END[i][1]; break; }
    if (!pp) pp = stem + (type === 'ar' ? 'ado' : vstem ? 'ído' : 'ido');
    res.pp = pp;
    res.perf = HABER.map(function (h) { return h + ' ' + pp; });
    return res;
  }

  function table(w) {
    if (!w || w.pos !== 'v' || !w.es) return null;
    var es = String(w.es).trim().toLowerCase();
    var rows;
    if (es === 'hay') {
      return { kind: 'impersonal', inf: 'hay', note: 'hay = “有”（haber 的特殊用法），不分人称，单数复数都用 hay：Hay un libro. / Hay dos libros.',
        rows: TENSES.map(function (t, i) { return { k: t.k, zh: t.zh, hint: t.hint, forms: [['hay', 'hubo', 'había', 'habrá', 'ha habido'][i]] }; }) };
    }
    var refl = /se$/.test(es);   // 原形都以 r 结尾，结尾是 se 的一定是带 se 的动词（irse、levantarse）
    var inf = refl ? es.slice(0, -2) : es;
    var f = forms(inf);
    if (WEATHER[inf]) {
      return { kind: 'impersonal', inf: es, note: '说天气，只用这一种形式（不分“我、你”）。',
        rows: TENSES.map(function (t) { return { k: t.k, zh: t.zh, hint: t.hint, forms: [f[t.k][2]] }; }) };
    }
    if (THIRD[inf]) {
      return { kind: 'third', inf: es, note: '这个词平时只说“它 / 它们”（东西、事情做主语），不说“我、你”。',
        rows: TENSES.map(function (t) { return { k: t.k, zh: t.zh, hint: t.hint, forms: [2, 4].map(function (p) { return (refl ? 'se ' : '') + f[t.k][p]; }) }; }) };
    }
    if (GUSTAR[inf]) {
      var pl = f.pres[4];
      return { kind: 'gustar', inf: es,
        note: inf === 'doler'
          ? '西语说“某处让我疼”：me duele la cabeza（我头疼）。疼的是两个以上时用复数：me duelen los pies。'
          : '西语说“某样东西' + GUSTAR_ZH[inf] + '”：me ' + f.pres[2] + ' el café。东西是两个以上时用复数：me ' + pl + ' los libros。',
        rows: TENSES.map(function (t) { return { k: t.k, zh: t.zh, hint: t.hint, forms: IOBJ.map(function (o) { return o + ' ' + f[t.k][2]; }) }; }) };
    }
    rows = TENSES.map(function (t) {
      var list = f[t.k].map(function (x, p) { return refl ? REFL[p] + ' ' + x : x; });
      if (inf === 'soler' && (t.k === 'pret' || t.k === 'fut' || t.k === 'perf')) list = list.map(function () { return '—'; });
      return { k: t.k, zh: t.zh, hint: t.hint, forms: list };
    });
    var note = '';
    if (refl) note = '带 se 的动词：前面的小词跟着人变（me / te / se / nos / se）。';
    if (inf === 'soler') note = 'soler（通常、习惯做）一般只用现在时和过去未完成时，后面接动词原形：Suelo correr.';
    return { kind: 'normal', inf: es, rows: rows, note: note };
  }

  window.Ene.Conj = { table: table, forms: forms, persons: PERSONS, tenses: TENSES };
})();
