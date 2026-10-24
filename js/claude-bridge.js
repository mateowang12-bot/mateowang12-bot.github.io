// ============================================
// 连接 Claude 的小桥（claude-bridge.js）
// 所有页面都要引入，而且放在最前面（data/*.js 之前），让外壳尽早收到 ready；storage.js 依赖它，要在它后面。
//
// window.getClaude()      → 能用的 claude 对象，或 null
//   1) 先看本页面的 window.claude；
//   2) 没有的话看 window.parent.claude（claude.ai 版是“外壳 + iframe”结构：
//      外壳 publish/index.html 里有 window.claude，网站各页面都在外壳的 iframe 里打开）；
//      读 parent 可能因为跨域报错，所以包在 try 里；
//   3) 都没有（本地双击打开、GitHub Pages 版）→ null。
// window.getClaudeHost()  → window.claude 所在的那个 window（本页或 parent），或 null。
//   调用 parent 的 claude 时，传过去的对象最好也在那个 window 里创建
//   （例如 new host.AbortController()），免得对方用 instanceof 检查时认不出来。
//
// 另外：页面加载后，如果是在“外壳”的 iframe 里，就给外壳发一个
//   postMessage({ type: "es-site-ready" })，告诉外壳“iframe 能正常用”。
//   外壳 4 秒内收不到，就会退回直接打开 home.html。
//   脚本运行时马上发一次，load 时再发一次（重复没关系）。只在 window.parent !== window、并且 parent 是同源的外壳（有 __esShell 标记）时才发。
// ============================================
(function () {
  function usable(c) {
    return !!c && typeof c.use === "function";
  }

  function getClaudeHost() {
    try {
      if (usable(window.claude)) return window;
    } catch (e) {}
    try {
      var p = window.parent;
      if (p && p !== window && usable(p.claude)) return p;
    } catch (e) {
      // parent 是别的网站（跨域）：读不了，当作没有
    }
    return null;
  }

  function getClaude() {
    var h = getClaudeHost();
    return h ? h.claude : null;
  }

  window.getClaudeHost = getClaudeHost;
  window.getClaude = getClaude;

  // ---------- 告诉外壳“我加载好了” ----------
  function tellShell() {
    try {
      var p = window.parent;
      if (!p || p === window) return;
      if (p.__esShell !== true) return; // 不是我们的外壳（或跨域读不了）：不发
      p.postMessage({ type: "es-site-ready" }, "*");
    } catch (e) {}
  }
  // 本文件放在页面末尾，运行时页面主体已经在了：马上发一次（不用等图片等全部加载完），load 时再发一次
  tellShell();
  try {
    if (document.readyState !== "complete") window.addEventListener("load", tellShell);
  } catch (e) {}
})();
