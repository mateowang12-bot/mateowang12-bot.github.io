// ============================================
// 单词 / 句子共用小工具（words-util.js）—— window.WordsUtil
// 小测验、复习、日常句子、小游戏都用它。放在 data/*.js 之后、页面脚本之前引入。
//
//   WordsUtil.el(tag, className, text)          创建元素（文字用 textContent，安全）
//   WordsUtil.shuffled(arr, rnd?)               洗牌（返回新数组；rnd 可选，自己的随机数函数）
//   WordsUtil.sayButton(text, label)            “点一下就朗读”的按钮（在点击里同步朗读，iPhone 也能出声）
//   WordsUtil.conflicts(a, b)                   两个词（或句子）放进同一道选择题会不会“撞车”
//   WordsUtil.collectWords()                    所有课的词 → [{ word, lesson(课的下标), kind: "word" }]
//   WordsUtil.collectPhrases()                  所有句子 → [{ word: 句子, lesson(组的下标), kind: "phrase" }]
//   WordsUtil.pickDistractors(item, all, n, rnd?)  给一道题挑 n 个不撞车的干扰项（先同一课，再别的课；只挑同一种 kind；rnd 可选）
//   WordsUtil.lessonGroups(lessons)             把课分成“基础 / 进阶”两组 → [{ id, zh, en, indices }]
//   WordsUtil.lessonPicker(box, groups, opts)   勾选范围的列表（全部 / 每组全选 / 每一课），见下面说明
//   WordsUtil.masteryBadge(id, newText, pop)    状态小标记 + 掌握进度 3 个小圆点（○○○ → ●●● 已掌握 ✓）
//   WordsUtil.markMessage(before, after, known) 点“记住了 / 还不熟”后的提示文字
//   WordsUtil.setLessonCount(span, ids)         选课按钮上的“已掌握 x / y · 学习中 n”
// ============================================
(function () {
  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined && text !== null && text !== "") e.textContent = text;
    return e;
  }

  // rnd（可选）：自己的随机数函数（例如每日挑战用当天日期做种子）；不传就用 Math.random
  function shuffled(arr, rnd) {
    var a = (arr || []).slice();
    var R = typeof rnd === "function" ? rnd : Math.random;
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(R() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function sayButton(text, label) {
    var b = el("button", "say", label || text);
    b.type = "button";
    b.title = "点击朗读";
    b.onclick = function (ev) {
      if (ev) ev.stopPropagation();
      if (window.speakSpanish) window.speakSpanish(text);
    };
    return b;
  }

  // ---------- 选项“撞车”判断（原来在 quiz.html 里） ----------
  // 比较用：去掉大小写、标点、首尾空格
  function norm(s) {
    return String(s || "").toLowerCase()
      .replace(/[¿?¡!。，,.？！（）()\s—-]/g, "");
  }
  // 把“好；挺好”“well / fine”拆成几个意思
  function parts(s, sep) {
    var out = [];
    var arr = String(s || "").split(sep);
    for (var i = 0; i < arr.length; i++) {
      var p = norm(arr[i]);
      if (p) out.push(p);
    }
    return out;
  }
  function shareAny(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (b.indexOf(a[i]) !== -1) return true;
    }
    return false;
  }
  // 意思太接近、但文字不同的词：手动写成“互斥”，不放在同一题里（每一对写的是 id）
  var EXCLUSIVE = [
    ["adios", "hasta-luego"],   // 再见 / 回头见：都是告别
    ["que-tal", "como-estas"],  // 怎么样；你好吗？ / 你好吗？
    // （bien / bueno 已经靠中文“好”判断成撞车，这里再保险一次）
    ["bien", "bueno"],          // 好；挺好 / 好；好的
    ["abrigo", "chaqueta"],     // 大衣 / 夹克；短外套：都是外套
    ["camisa", "camiseta"],     // 衬衫 / T恤
    ["falda", "vestido"],       // 半身裙；裙子 / 连衣裙
    ["pescado", "pez"],         // 鱼（食物） / 鱼（活的）
    ["pollo", "carne"],         // 鸡肉 / 肉
    ["pescado", "carne"],       // 鱼肉 / 肉
    ["tienda", "supermercado"], // 商店 / 超市
    ["querer", "gustar"],       // 想要；爱 / 喜欢
    ["cafe", "restaurante"],    // 咖啡馆 / 餐厅
    // 日常句子（快答游戏可以出句子题）：意思几乎一样的句子
    ["ph-cuanto-cuesta", "ph-cuanto-es"],         // 多少钱？ / 一共多少钱？
    ["ph-hablo-un-poco", "ph-no-hablo-bien"],     // 我会说一点西语 / 我西语说得不好
    ["ph-quiero-esto", "ph-me-lo-llevo"],         // 我要这个 / 我买了
    ["ph-me-puede-ayudar", "ph-necesito-ayuda"],  // 您能帮我一下吗？ / 我需要帮助
    ["ph-un-billete-para", "ph-ida-y-vuelta"],    // 一张去马德里的票 / 要往返票
    ["ph-me-gusta-mucho", "ph-esta-muy-bueno"],   // 我很喜欢 / 很好吃
    ["ph-estoy-enfermo", "ph-me-duele-la-cabeza"], // 我生病了 / 我头疼
    ["ph-que-significa", "ph-como-se-dice"]       // 这是什么意思？ / 这个用西语怎么说？
  ];
  function exclusive(a, b) {
    if (!a.id || !b.id) return false;
    for (var i = 0; i < EXCLUSIVE.length; i++) {
      var p = EXCLUSIVE[i];
      if ((p[0] === a.id && p[1] === b.id) || (p[0] === b.id && p[1] === a.id)) return true;
    }
    return false;
  }
  // 西语相同、中文相同（或有一个意思相同）、英文意思相同、手动互斥 → 撞车
  function conflicts(a, b) {
    if (a === b) return true;
    if (a.id && b.id && a.id === b.id) return true;
    if (exclusive(a, b)) return true;
    if (norm(a.es) === norm(b.es)) return true;
    if (a.zh && b.zh && norm(a.zh) === norm(b.zh)) return true;
    if (shareAny(parts(a.zh, /[；;]/), parts(b.zh, /[；;]/))) return true;
    if (shareAny(parts(a.en, /\//), parts(b.en, /\//))) return true;
    return false;
  }

  // ---------- 收集内容 ----------
  function collectWords() {
    var out = [];
    var ls = window.WORD_LESSONS || [];
    for (var i = 0; i < ls.length; i++) {
      var ws = (ls[i] && ls[i].words) || [];
      for (var j = 0; j < ws.length; j++) {
        var w = ws[j];
        if (w && w.es && (w.zh || w.en)) out.push({ word: w, lesson: i, kind: "word" });
      }
    }
    return out;
  }
  function collectPhrases() {
    var out = [];
    var ls = window.PHRASE_LESSONS || [];
    for (var i = 0; i < ls.length; i++) {
      var ps = (ls[i] && ls[i].phrases) || [];
      for (var j = 0; j < ps.length; j++) {
        var p = ps[j];
        if (p && p.id && p.es && (p.zh || p.en)) out.push({ word: p, lesson: i, kind: "phrase" });
      }
    }
    return out;
  }

  // 干扰项：同一种（单词 / 句子），先同一课，再别的课；和正确答案、和彼此都不能撞车
  // rnd（可选）：随机数函数，传了就用它打乱（同一个种子挑出一样的干扰项）；旧的 3 个参数的调用不受影响
  function pickDistractors(item, all, n, rnd) {
    var same = [], other = [];
    for (var i = 0; i < all.length; i++) {
      var c = all[i];
      if (c === item || c.kind !== item.kind) continue;
      (c.lesson === item.lesson ? same : other).push(c);
    }
    var candidates = shuffled(same, rnd).concat(shuffled(other, rnd));
    var chosen = [];
    for (var j = 0; j < candidates.length && chosen.length < n; j++) {
      var cand = candidates[j];
      var ok = !conflicts(cand.word, item.word);
      for (var k = 0; ok && k < chosen.length; k++) {
        if (conflicts(cand.word, chosen[k].word)) ok = false;
      }
      if (ok) chosen.push(cand);
    }
    return chosen;
  }

  // ---------- 课程分组：基础 / 进阶 ----------
  // 课上写了 level: "basic" / "advanced" 就按它；没写就按位置：前 6 课是基础，后面是进阶。
  // 课不多（≤ 6）时只有一组，不显示组名。
  var BASIC_COUNT = 6;
  function lessonGroups(lessons) {
    lessons = lessons || [];
    var basic = [], adv = [];
    for (var i = 0; i < lessons.length; i++) {
      var lv = lessons[i] && lessons[i].level;
      var isAdv = lv ? lv === "advanced" : i >= BASIC_COUNT;
      (isAdv ? adv : basic).push(i);
    }
    if (!adv.length || !basic.length) {
      return [{ id: "all", zh: "", en: "", indices: basic.concat(adv) }];
    }
    return [
      { id: "basic", zh: "基础", en: "Basics", indices: basic },
      { id: "advanced", zh: "进阶", en: "More topics", indices: adv }
    ];
  }

  // ---------- 勾选范围的列表 ----------
  // groups：[{ id, zh, en, items: [{ key, zh, en, count, checked? }] }]（组名为空就不显示组标题）
  // opts.allLabel：[中文, 英文]，“全部”那一项（默认“全部 / All”）
  // opts.onChange()：勾选变化时调用
  // 返回 { selected() → [key...]（只含能选的、勾上的），set(keys), total() }
  // 样式沿用小测验的 .quiz-check-list / .quiz-check
  function makeCheck(labelZh, labelEn, checked, extraClass) {
    var label = el("label", "quiz-check" + (extraClass ? " " + extraClass : ""));
    var box = el("input");
    box.type = "checkbox";
    box.checked = !!checked;
    label.appendChild(box);
    var txt = el("span", "quiz-check-text");
    txt.appendChild(el("span", "lesson-title", labelZh));
    if (labelEn) txt.appendChild(el("span", "muted lesson-sub", labelEn)); // 第二行小字（阶段 12 起只写中文，例如“10 个词”）
    label.appendChild(txt);
    return { label: label, box: box };
  }

  function lessonPicker(box, groups, opts) {
    opts = opts || {};
    box.innerHTML = "";
    var items = [];      // { key, c }
    var groupChecks = []; // { c, items: [...] }
    var allLabel = opts.allLabel || ["全部", ""];
    var all = makeCheck(allLabel[0], allLabel[1], true, "quiz-check-all");
    box.appendChild(all.label);

    for (var g = 0; g < groups.length; g++) {
      var grp = groups[g];
      var mine = [];
      var usable = 0;
      for (var u = 0; u < grp.items.length; u++) if (grp.items[u].count > 0) usable++;
      var gc = null;
      if (grp.zh) {
        if (usable >= 2) {
          gc = makeCheck(grp.zh + " · 全选", "", true, "quiz-check-group");
          box.appendChild(gc.label);
        } else {
          box.appendChild(el("div", "quiz-check-heading", grp.zh));
        }
      }
      for (var i = 0; i < grp.items.length; i++) {
        var it = grp.items[i];
        var c = makeCheck(it.zh, it.en, it.count > 0 && it.checked !== false);
        if (!(it.count > 0)) {
          c.box.disabled = true;
          c.label.className += " disabled";
        }
        c.box.onchange = changed;
        var rec = { key: it.key, c: c };
        items.push(rec);
        mine.push(rec);
        box.appendChild(c.label);
      }
      if (gc) {
        (function (gcc, list) {
          gcc.box.onchange = function () {
            for (var k = 0; k < list.length; k++) if (!list[k].c.box.disabled) list[k].c.box.checked = gcc.box.checked;
            changed();
          };
          groupChecks.push({ c: gcc, items: list });
        })(gc, mine);
      }
    }
    all.box.onchange = function () {
      for (var k = 0; k < items.length; k++) if (!items[k].c.box.disabled) items[k].c.box.checked = all.box.checked;
      changed();
    };

    function refresh() {
      var allOn = true, any = false;
      for (var k = 0; k < items.length; k++) {
        if (items[k].c.box.disabled) continue;
        any = true;
        if (!items[k].c.box.checked) allOn = false;
      }
      all.box.checked = any && allOn;
      for (var g2 = 0; g2 < groupChecks.length; g2++) {
        var on = true;
        for (var m = 0; m < groupChecks[g2].items.length; m++) {
          var cc = groupChecks[g2].items[m].c.box;
          if (!cc.disabled && !cc.checked) on = false;
        }
        groupChecks[g2].c.box.checked = on;
      }
      var labels = box.querySelectorAll(".quiz-check");
      for (var i2 = 0; i2 < labels.length; i2++) {
        var b = labels[i2].querySelector("input");
        labels[i2].classList.toggle("active", !!b.checked);
      }
    }
    function changed() {
      refresh();
      if (opts.onChange) opts.onChange();
    }
    refresh();

    return {
      selected: function () {
        var out = [];
        for (var k = 0; k < items.length; k++) {
          if (items[k].c.box.checked && !items[k].c.box.disabled) out.push(items[k].key);
        }
        return out;
      },
      set: function (keys) {
        for (var k = 0; k < items.length; k++) {
          if (!items[k].c.box.disabled) items[k].c.box.checked = keys.indexOf(items[k].key) !== -1;
        }
        refresh();
      },
      total: function () { return items.length; }
    };
  }

  // ---------- 大字西语：单词不从中间断开，太长就缩小字号 ----------
  // 加了 class="fit-word" 的元素：CSS 里规定只能在空格处换行（不拆单词）；
  // fitAll() 量一下，放不下（横向溢出）就一点点缩小字号，最小到原来的 45%。
  // 页面每次显示新的词以后调用一次 WordsUtil.fitAll()；窗口大小变化时会自动再算一次。
  function fit(e) {
    e.style.fontSize = "";
    if (!e.clientWidth) return; // 现在看不见（隐藏着）：不量
    var base = parseFloat(window.getComputedStyle(e).fontSize) || 16;
    var size = base;
    for (var i = 0; i < 20 && e.scrollWidth > e.clientWidth + 1 && size > base * 0.45; i++) {
      size = size * 0.92;
      e.style.fontSize = size.toFixed(1) + "px";
    }
  }
  function fitAll(root) {
    var list = (root || document).querySelectorAll(".fit-word");
    for (var i = 0; i < list.length; i++) fit(list[i]);
  }
  var fitTimer = null;
  try {
    window.addEventListener("resize", function () {
      if (fitTimer) clearTimeout(fitTimer);
      fitTimer = setTimeout(function () { fitAll(); }, 150);
    });
  } catch (e) {}

  // ---------- 掌握进度：3 个小圆点（单词页、句子页共用） ----------
  // box 0 → ○○○，1 → ●○○，2 → ●●○，≥3 → ●●● + “已掌握 ✓”（box 来自 Progress.getBox，3 = 已掌握）
  var NEED = 3;
  function boxOf(id) {
    var P = window.Progress;
    if (!P || !id) return 0;
    return typeof P.getBox === "function" ? P.getBox(id) : ((P.getWord(id) || {}).box || 0);
  }
  // 状态小标记（带圆点）：<span class="status-badge status-learning mastery" data-box="1">●○○ 学习中 / Learning</span>
  // newText：新词的叫法（单词“新词 / New”，句子“新句 / New”）
  // pop：true = 刚刚变化，最后一个变化的圆点做一个小动画
  function masteryBadge(id, newText, pop) {
    var P = window.Progress;
    var s = P && id ? P.wordStatus(id) : "new";
    var box = boxOf(id);
    var filled = Math.min(NEED, box);
    var b = el("span", "status-badge status-" + s + " mastery");
    b.setAttribute("data-box", String(box));
    b.title = "掌握进度 " + filled + " / " + NEED + "（点 3 次“记住了”就算掌握）";
    var dots = el("span", "mdots");
    dots.setAttribute("aria-hidden", "true");
    for (var i = 0; i < NEED; i++) {
      var d = el("span", "mdot" + (i < filled ? " on" : ""));
      if (pop && i === filled - 1) d.className += " pop";
      dots.appendChild(d);
    }
    if (pop && filled === 0) dots.className += " reset";
    b.appendChild(dots);
    // 给读屏软件的文字（看不见）
    b.appendChild(el("span", "sr-only", "掌握进度 " + filled + " / " + NEED + "，"));
    var text = s === "mastered" ? "已掌握 ✓ " : s === "learning" ? "学习中" : (newText || "新词");
    b.appendChild(el("span", "mtext", text));
    return b;
  }
  // 点“记住了 / 还不熟”以后的提示文字；before / after = 点之前 / 之后的 box
  // → { zh, en, text（= zh + " / " + en）, kind: "up"（进一步）/ "done"（刚掌握）/ "keep"（本来就掌握了）/ "reset"（清零） }
  function markMessage(before, after, known) {
    var m;
    if (!known) {
      m = { kind: "reset", zh: "没关系，已放回复习列表（圆点清零）", en: "No worries — back to review (dots reset)" };
    } else if (after >= NEED && before < NEED) {
      m = { kind: "done", zh: "🎉 已掌握！", en: "Mastered!" };
    } else if (after >= NEED) {
      m = { kind: "keep", zh: "✓ 已经掌握了，复习得很好！", en: "Already mastered — nice review!" };
    } else {
      var left = NEED - after;
      m = { kind: "up", zh: "✓ 记住 " + after + " 次，再记住 " + left + " 次就掌握了", en: left + " more to master" };
    }
    m.text = m.zh;
    return m;
  }
  // 选课按钮上的“已掌握 x / y”，有学习中的再加一行“学习中 n”
  function setLessonCount(span, ids) {
    var P = window.Progress;
    var m = P ? P.masteredCount(ids) : 0;
    var l = P && typeof P.learningCount === "function" ? P.learningCount(ids) : 0;
    span.innerHTML = "";
    span.appendChild(el("span", "lm-done", "已掌握 " + m + " / " + ids.length));
    if (l > 0) {
      span.appendChild(document.createTextNode(" "));
      span.appendChild(el("span", "lm-learning", "学习中 " + l));
    }
    span.classList.toggle("all-done", ids.length > 0 && m === ids.length);
  }

  window.WordsUtil = {
    masteryBadge: masteryBadge,
    markMessage: markMessage,
    setLessonCount: setLessonCount,
    fit: fit,
    fitAll: fitAll,
    el: el,
    shuffled: shuffled,
    sayButton: sayButton,
    norm: norm,
    conflicts: conflicts,
    collectWords: collectWords,
    collectPhrases: collectPhrases,
    pickDistractors: pickDistractors,
    lessonGroups: lessonGroups,
    lessonPicker: lessonPicker
  };
})();
