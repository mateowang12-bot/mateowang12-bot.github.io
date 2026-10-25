// ============================================
// 离线网站（PWA）小助手（pwa.js）
// 只在网站放到网上（https: 或 http:，例如 GitHub Pages）时起作用：
//   1) 注册网站根目录的 sw.js（service worker），把网站存进手机，断网也能打开；
//      本地双击 file:// 打开、页面嵌在 iframe 里（claude.ai 版）、页面里没有 manifest 标签（不是 web/ 版）、
//      或浏览器不支持时，什么都不做。
//      路径全部按“本文件所在位置”算（js/pwa.js 的上一层就是网站根目录），
//      所以首页、pages/ 里的子页面、网站放在子路径（例如 /repo-name/）下都能用。
//   2) 有新版本下载好了：首页显示“网站已更新，下次打开生效”（页面里有 #pwa-update 时）。
//   3) 首页（页面里有 #install-tip 时）：iPhone Safari、并且不是从主屏幕图标打开时，
//      提示“添加到主屏幕”；点 × 关闭后记在 localStorage，不再显示。
// ============================================
(function () {
  var TIP_KEY = "es-study-install-tip-closed";

  // 记下本文件的地址（必须在一开始取，之后 currentScript 就没了）
  var me = document.currentScript;
  var scriptSrc = me && me.src ? me.src : "";

  function storageGet(k) {
    try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (e) { return null; }
  }
  function storageSet(k, v) {
    try { if (window.localStorage) window.localStorage.setItem(k, v); } catch (e) {}
  }

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  var proto = location.protocol;
  if (proto !== "https:" && proto !== "http:") return; // file:// 等：什么都不做
  if (!scriptSrc) return;

  // 嵌在别的网页里（iframe，例如 claude.ai 版）：不注册、不提示。读不到 window.top 也当作是 iframe
  var framed = true;
  try { framed = window.top !== window; } catch (e) { framed = true; }
  if (framed) return;

  // 页面里没有 <link rel="manifest">（本地版、claude.ai 的 publish 版）：不是离线网站版，不注册（也就不会去请求不存在的 sw.js）。
  // 只有 tools/build-web.ps1 生成的 web/ 版页面里有这个标签（本文件放在 body 末尾，head 里的标签已经在了）
  try {
    if (!document.querySelector('link[rel="manifest"]')) return;
  } catch (e) {
    return;
  }

  // 网站根目录：js/pwa.js 的上一层
  var rootUrl, swUrl;
  try {
    rootUrl = new URL("../", scriptSrc).href;
    swUrl = new URL("../sw.js", scriptSrc).href;
  } catch (e) {
    return;
  }

  // ---------- 首页：新版本提示 ----------
  function showUpdated() {
    onReady(function () {
      var el = document.getElementById("pwa-update");
      if (!el) return;
      el.textContent = "网站已更新，下次打开生效";
      el.hidden = false;
    });
  }

  // ---------- 首页：添加到主屏幕提示（iPhone Safari） ----------
  function isIOSSafari() {
    var ua = navigator.userAgent || "";
    var ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && "ontouchend" in document);
    if (!ios) return false;
    // iPhone 上的 Chrome / Firefox / Edge 等不能“添加到主屏幕”成离线网站，只提示 Safari
    if (/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|YaBrowser|DuckDuckGo|MicroMessenger|QQ\/|Weibo/i.test(ua)) return false;
    return /Safari/.test(ua);
  }
  function maybeShowInstallTip() {
    if (navigator.standalone === true) return;   // 已经从主屏幕图标打开
    if (navigator.standalone === undefined) return; // 不是 iPhone Safari
    if (!isIOSSafari()) return;
    if (storageGet(TIP_KEY)) return;             // 用户关过了
    onReady(function () {
      var tip = document.getElementById("install-tip");
      if (!tip) return;
      tip.hidden = false;
      var close = tip.querySelector(".notice-close");
      if (close) {
        close.onclick = function () {
          tip.hidden = true;
          storageSet(TIP_KEY, "1");
        };
      }
    });
  }

  // ---------- 注册 service worker ----------
  var sw;
  try {
    sw = navigator.serviceWorker; // 某些受限的网页（例如嵌在别的网站里）读这个属性也会出错
  } catch (e) {
    sw = null;
  }
  if (!sw || typeof sw.register !== "function" || typeof Promise === "undefined") return;

  function watch(reg) {
    // 新版本装好后，如果这个页面之前已经有旧版本在管，就提示“下次打开生效”
    function track(worker) {
      if (!worker) return;
      worker.addEventListener("statechange", function () {
        if ((worker.state === "installed" || worker.state === "activated") && hadController) showUpdated();
      });
    }
    var hadController = !!sw.controller;
    if (reg.waiting && hadController) showUpdated();
    if (reg.installing) track(reg.installing);
    reg.addEventListener("updatefound", function () { track(reg.installing); });
  }

  function register() {
    try {
      sw.register(swUrl, { scope: rootUrl }).then(function (reg) {
        try { document.documentElement.setAttribute("data-sw", "registered"); } catch (e) {}
        watch(reg);
        maybeShowInstallTip(); // 能离线，才提示“添加到主屏幕”
      }, function () {
        // 注册失败（例如没有 sw.js 的版本）：安静放弃，网站照常能用
      });
    } catch (e) {}
  }

  if (document.readyState === "complete") register();
  else window.addEventListener("load", register);
})();
