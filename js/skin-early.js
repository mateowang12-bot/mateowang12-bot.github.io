// ============================================
// 尽早套用界面主题（skin-early.js）—— 阶段 11
// 放在每个页面的 <head> 里、css 那一行后面（这是“claude-bridge.js 必须是第一个 script”规则里唯一的例外）。
// 页面一开始画出来之前就把 html 的 data-skin 设好，避免先闪一下默认的绿色。
// 只读进度 key 里的 profile.skin，而且必须是已经拥有的主题；读不了（localStorage 不能用、数据坏了）就什么都不做。
// 之后换主题、同步、预览等都由 js/nav.js 处理（它和这里用一样的规则）。
// ============================================
(function () {
  try {
    var t = window.localStorage ? window.localStorage.getItem("es-study-progress-v1") : null;
    if (!t) return;
    var st = JSON.parse(t);
    var s = st && st.profile && st.profile.skin;
    if ((s === "ocean" || s === "sunset" || s === "violet") && st.owned && st.owned.skins && st.owned.skins[s]) {
      document.documentElement.setAttribute("data-skin", s);
    }
  } catch (e) {}
})();
