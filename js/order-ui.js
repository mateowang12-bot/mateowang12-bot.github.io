// ============================================
// 拼句子的字块界面（order-ui.js）—— window.OrderUI（阶段 17）
// 关卡里的拼句子题（js/play.js 的 qOrder）和游戏大厅的拼句子（pages/game-order.html）共用。
//
// 做法：
//   - 词库（下面）里每个词的位置固定：点走以后原处留一个同样大小的灰色虚线空位（不能点），别的词不动；
//   - 答题区（上面）里的词点一下，退回它原来的空位；
//   - 撤销 = 退回最后放进去的一个词；清空 = 全部退回；
//   - check()：从左往右“位置正确”的词标绿，从第一个错的词开始标红；returnWrong() 一键把第一个错词及其后面的都退回；
//   - 比较的是文字：两个一样的词（例如两个 la）谁先谁后都算对；
//   - 字块移动有 200ms 的小动画（FLIP：先记下旧位置，换好以后从旧位置滑过去）；系统设置“减少动态效果”时不动；
//   - 点字块的“啵”声由 js/sfx.js 自动放（它认 .order-token），这里不用管；
//   - 答题区按词库的行数预留高度，拼的过程中下面的词库不会被挤得跳来跳去。
//
// 用法：
//   var ui = OrderUI.create({
//     answer: 答题区元素, bank: 词库元素, tools: 放“撤销 / 清空”的元素（可选）,
//     tokens: 正确顺序的词, order: 打乱后的词（词库从左到右）,
//     keys: true/false（字块角上显示 1–9 小数字，只在电脑宽屏上显示）,
//     undoId, clearId: 两个小按钮的 id（可选）,
//     onChange: function (ui) {}   // 用户每次放 / 退词以后调用
//   });
//   ui.full() / ui.placedTexts() / ui.check() → { ok, prefix } / ui.returnWrong() / ui.undo() / ui.clear()
//   ui.keyPick(n)（第 n 个格子里还在的词）/ ui.lock(true) / ui.solve()（摆出正确答案）/ ui.relayout()
// ============================================
(function () {
  function mk(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function reduced() {
    try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }

  function create(o) {
    var ansBox = o.answer, bankBox = o.bank;
    var tokens = (o.tokens || []).slice();
    var bank = (o.order || tokens).map(function (t) { return { text: t, used: false, btn: null }; });
    var placed = [];      // bank 下标，按答题区从左到右
    var good = 0;         // 已确认“位置正确”的前几个（标绿）
    var bad = false;      // 正在显示红色（检查错了以后，改动前）
    var locked = false;
    var undoBtn = null, clearBtn = null;
    var api;

    // ---------- 词库：只画一次 ----------
    function buildBank() {
      while (bankBox.firstChild) bankBox.removeChild(bankBox.firstChild);
      bank.forEach(function (b, idx) {
        var btn = mk("button", "order-token", null);
        btn.type = "button";
        btn.textContent = b.text;
        // 角上的小数字用 CSS ::after 画（data-key），按钮文字仍然只是这个词
        if (o.keys && idx < 9) btn.setAttribute("data-key", String(idx + 1));
        btn.onclick = function () { place(idx); };
        b.btn = btn;
        bankBox.appendChild(btn);
      });
    }

    // ---------- 撤销 / 清空 ----------
    if (o.tools) {
      while (o.tools.firstChild) o.tools.removeChild(o.tools.firstChild);
      undoBtn = mk("button", "order-tool", "↶ 撤销");
      undoBtn.type = "button";
      if (o.undoId) undoBtn.id = o.undoId;
      undoBtn.title = "退回最后放进去的一个词";
      undoBtn.onclick = function () { undo(); };
      clearBtn = mk("button", "order-tool", "↺ 清空");
      clearBtn.type = "button";
      if (o.clearId) clearBtn.id = o.clearId;
      clearBtn.title = "全部退回，重新拼";
      clearBtn.onclick = function () { clearAll(); };
      o.tools.appendChild(undoBtn);
      o.tools.appendChild(clearBtn);
    }

    // ---------- 小动画（FLIP） ----------
    function visibleEl(idx) {
      var b = bank[idx];
      if (!b.used) return b.btn;
      return ansBox.querySelector('[data-idx="' + idx + '"]');
    }
    function snapshot() {
      if (reduced()) return null;
      var m = {};
      for (var i = 0; i < bank.length; i++) {
        var e = visibleEl(i);
        if (e) m[i] = e.getBoundingClientRect();
      }
      return m;
    }
    function animate(prev) {
      if (!prev) return;
      for (var i = 0; i < bank.length; i++) {
        var e = visibleEl(i), p = prev[i];
        if (!e || !p) continue;
        var r = e.getBoundingClientRect();
        var dx = p.left - r.left, dy = p.top - r.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
        (function (node, x, y) {
          node.style.transition = "none";
          node.style.transform = "translate(" + x + "px," + y + "px)";
          node.style.zIndex = "2";
          void node.offsetWidth;
          node.style.transition = "transform 0.2s cubic-bezier(0.2, 0.8, 0.3, 1)";
          node.style.transform = "";
          setTimeout(function () { node.style.transition = ""; node.style.zIndex = ""; }, 240);
        })(e, dx, dy);
      }
    }

    // ---------- 画答题区 + 更新词库状态 ----------
    function render() {
      while (ansBox.firstChild) ansBox.removeChild(ansBox.firstChild);
      if (!placed.length) ansBox.appendChild(mk("span", "order-empty", locked ? "" : (o.emptyText || "点下面的词，按顺序放进来")));
      placed.forEach(function (bi, k) {
        var btn = mk("button", "order-token", null);
        btn.type = "button";
        btn.setAttribute("data-idx", String(bi));
        btn.textContent = bank[bi].text;
        if (k < good) btn.className += " is-right";
        else if (bad) btn.className += " is-bad";
        btn.disabled = locked;
        btn.title = "点一下退回";
        btn.onclick = function () { unplace(k); };
        ansBox.appendChild(btn);
      });
      bank.forEach(function (b, idx) {
        // 空位：先把按钮现在的宽高固定住，再去掉文字（这样大小不变，别的词不动）
        if (b.used && !b.btn.classList.contains("is-used")) {
          var br = b.btn.getBoundingClientRect(); // 用带小数的宽高（offsetWidth 会取整，居中排列时别的词会挪 1px）
          b.btn.style.width = br.width + "px";
          b.btn.style.height = br.height + "px";
          b.btn.textContent = "";
        } else if (!b.used && b.btn.classList.contains("is-used")) {
          b.btn.style.width = "";
          b.btn.style.height = "";
          b.btn.textContent = b.text;
        }
        b.btn.classList.toggle("is-used", b.used);
        b.btn.disabled = locked || b.used;
        if (b.used) {
          b.btn.setAttribute("aria-hidden", "true");
          b.btn.tabIndex = -1;
        } else {
          b.btn.removeAttribute("aria-hidden");
          b.btn.removeAttribute("tabindex");
          b.btn.setAttribute("aria-label", (o.keys && idx < 9 ? (idx + 1) + "：" : "") + b.text);
        }
      });
      if (undoBtn) { undoBtn.disabled = locked || !placed.length; undoBtn.hidden = locked; }
      if (clearBtn) { clearBtn.disabled = locked || !placed.length; clearBtn.hidden = locked; }
      if (o.tools) o.tools.hidden = locked;
    }
    function changed() { if (o.onChange) try { o.onChange(api); } catch (e) { if (window.console) console.error(e); } }

    // ---------- 动作 ----------
    function place(idx) {
      if (locked || !bank[idx] || bank[idx].used) return;
      var prev = snapshot();
      bank[idx].used = true;
      placed.push(idx);
      bad = false;
      render();
      animate(prev);
      changed();
    }
    function unplace(k) {
      if (locked || k < 0 || k >= placed.length) return;
      var prev = snapshot();
      bank[placed[k]].used = false;
      placed.splice(k, 1);
      if (k < good) good = k;
      bad = false;
      render();
      animate(prev);
      changed();
    }
    function undo() { if (placed.length) unplace(placed.length - 1); }
    function backTo(n) {
      // 把答题区第 n 个（从 0 数）及后面的都退回
      if (locked || n >= placed.length) return;
      var prev = snapshot();
      for (var k = n; k < placed.length; k++) bank[placed[k]].used = false;
      placed.length = n;
      if (good > n) good = n;
      bad = false;
      render();
      animate(prev);
      changed();
    }
    function clearAll() { backTo(0); }

    function prefixRight() {
      var n = 0;
      while (n < placed.length && n < tokens.length && bank[placed[n]].text === tokens[n]) n++;
      return n;
    }
    function check() {
      var p = prefixRight();
      var ok = p === tokens.length && placed.length === tokens.length;
      good = p;
      bad = !ok;
      render();
      return { ok: ok, prefix: p };
    }
    function returnWrong() { backTo(prefixRight()); }

    function solve() {
      // 把正确答案摆进答题区（重复的词按词库里先出现的那个）
      var prev = snapshot();
      for (var i = 0; i < bank.length; i++) bank[i].used = false;
      placed = [];
      for (var t = 0; t < tokens.length; t++) {
        for (var j = 0; j < bank.length; j++) {
          if (!bank[j].used && bank[j].text === tokens[t]) { bank[j].used = true; placed.push(j); break; }
        }
      }
      good = placed.length;
      bad = false;
      render();
      animate(prev);
    }

    // 答题区的高度：按词库排成几行来预留（词一样多、宽度一样，排进答题区大约也是这么多行）
    function relayout() {
      var tops = {}, rows = 0, sum = 0;
      for (var i = 0; i < bank.length; i++) {
        var b = bank[i].btn;
        var t = Math.round(b.offsetTop / 8);
        if (!tops[t]) { tops[t] = 1; rows++; }
        sum += b.offsetWidth + 8;
      }
      var w = bankBox.clientWidth - 16;
      // 答题区里的顺序和词库不一样，换行的地方可能不同：快排满时多留一行
      if (w > 0 && sum > w * rows * 0.85) rows++;
      ansBox.style.setProperty("--rows", String(Math.max(1, Math.min(rows, 6))));
    }

    buildBank();
    render();
    relayout();
    var onResize = function () { if (document.body.contains(bankBox)) relayout(); };
    window.addEventListener("resize", onResize);

    api = {
      place: place,
      unplace: unplace,
      undo: undo,
      clear: clearAll,
      returnWrong: returnWrong,
      check: check,
      solve: solve,
      relayout: relayout,
      full: function () { return placed.length === bank.length; },
      count: function () { return placed.length; },
      placedTexts: function () { return placed.map(function (i) { return bank[i].text; }); },
      // 键盘数字键：第 n 个格子里还在的词（用 click()，这样 sfx.js 也会“啵”一下）
      keyPick: function (n) {
        var b = bank[n - 1];
        if (locked || !b || b.used) return false;
        b.btn.click();
        return true;
      },
      lock: function (on) { locked = on !== false; render(); },
      locked: function () { return locked; },
      destroy: function () { window.removeEventListener("resize", onResize); }
    };
    return api;
  }

  window.OrderUI = { create: create };
})();
