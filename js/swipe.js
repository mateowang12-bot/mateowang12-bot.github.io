// ============================================
// 触屏左右滑动（swipe.js）
// 用法：var sw = addSwipe(元素, { left: 函数, right: 函数, follow: true });
//   left  —— 向左滑（手指从右往左）时调用
//   right —— 向右滑时调用
//   follow —— true：滑动时元素跟着手指稍微移动一点
//   sw.justSwiped() —— 刚刚是不是一次滑动（在 click 处理函数里用它判断“这次不是点击”）
// 规则：横向移动超过 50px、并且横向比竖向明显多，才算滑动；否则当作普通点击 / 上下滚动。
// ============================================
(function () {
  var MIN_DIST = 50;

  function addSwipe(elm, opts) {
    opts = opts || {};
    var startX = 0, startY = 0, dx = 0, dy = 0;
    var tracking = false, horizontal = false;
    var lastSwipe = 0;

    function setShift(x) {
      if (!opts.follow) return;
      elm.style.transform = x ? "translateX(" + x + "px)" : "";
    }

    elm.addEventListener("touchstart", function (ev) {
      if (!ev.touches || ev.touches.length !== 1) { tracking = false; return; }
      tracking = true;
      horizontal = false;
      startX = ev.touches[0].clientX;
      startY = ev.touches[0].clientY;
      dx = dy = 0;
      elm.classList.remove("swipe-back");
    }, { passive: true });

    elm.addEventListener("touchmove", function (ev) {
      if (!tracking || !ev.touches || !ev.touches.length) return;
      dx = ev.touches[0].clientX - startX;
      dy = ev.touches[0].clientY - startY;
      if (!horizontal && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) horizontal = true;
      if (horizontal) setShift(Math.max(-80, Math.min(80, dx * 0.4)));
    }, { passive: true });

    function end() {
      if (!tracking) return;
      tracking = false;
      if (opts.follow) {
        elm.classList.add("swipe-back");
        setShift(0);
      }
      var isSwipe = Math.abs(dx) >= MIN_DIST && Math.abs(dx) > Math.abs(dy) * 1.5;
      if (!isSwipe) return;
      lastSwipe = Date.now();
      if (dx < 0 && opts.left) opts.left();
      else if (dx > 0 && opts.right) opts.right();
    }
    elm.addEventListener("touchend", end);
    elm.addEventListener("touchcancel", function () {
      tracking = false;
      setShift(0);
    });

    return {
      // 滑动结束后 0.5 秒内收到的 click 当作滑动的一部分，不翻面
      justSwiped: function () { return Date.now() - lastSwipe < 500; }
    };
  }

  window.addSwipe = addSwipe;
})();
