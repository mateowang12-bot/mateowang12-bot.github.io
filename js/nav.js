// ============================================
// 底部导航栏 + 经验值小提示（nav.js）
// 所有页面都引入，放在 claude-bridge.js 后面（第二个 script，页面 body 的最后面）。
//
// 1) 底部导航栏：🏠 首页 / 📚 学习 / 🎮 游戏 / 👤 我的，当前页面对应的标签高亮。
//    链接全部按“本文件的位置”算出网站根目录（js/nav.js 的上一层），所以首页、pages/ 里的子页面都对。
//    首页的文件名：本地版和 GitHub Pages 版是 index.html；claude.ai 版（publish/）是 home.html
//    （tools/build-mobile.ps1 会把下面 HOME_FILE 这一行改成 "home.html"；当前页面本身就是根目录的 home.html 时也用它）。
//    哪个标签算“当前”：根目录的页面 = 首页；pages/games.html、pages/game-*.html = 游戏；pages/me.html = 我的；其他 pages/ = 学习。
//    页面 <body> 有 class="no-bottom-nav" 时不显示（例如外壳）。AI 对话聊天时 body 加 class="chatting"，CSS 会把导航栏藏起来，只留输入栏。
// 2) 加经验值时（js/storage.js 派发 "progress-xp" 事件），在右上角弹一个小提示“+5 XP”，0.8 秒后自动消失，不挡内容（点不到它）。
// 3) 当天第一次达到每日目标：显示“🎉 完成今天的目标！”（CSS 小动画；系统设了“减少动态效果”就不动）。
//    每天只庆祝一次，记在 localStorage 的 es-study-goal-celebrated（值是日期）。
// ============================================
(function () {
  var HOME_FILE = "index.html"; // build-mobile.ps1 把这一行改成 home.html（不要改这行的写法）
  var CELEBRATE_KEY = "es-study-goal-celebrated";

  var me = document.currentScript;
  var src = me && me.src ? String(me.src) : "";
  var ROOT = src.replace(/[?#].*$/, "").replace(/js\/nav\.js$/, "");

  // 当前页面相对根目录的路径，例如 "index.html"、"home.html"、""、"pages/words.html"
  var here = String(location.href).replace(/[?#].*$/, "");
  var rel = ROOT && here.indexOf(ROOT) === 0 ? here.substring(ROOT.length) : here.replace(/^.*\//, "");
  try { rel = decodeURIComponent(rel); } catch (e) {}
  var inPages = ROOT ? /^pages\//.test(rel) : /\/pages\/[^\/]*$/.test(here);
  var file = rel.replace(/^.*\//, "");
  var homeFile = !inPages && file === "home.html" ? "home.html" : HOME_FILE;

  var tab = "learn";
  if (!inPages) tab = "home";
  else if (file === "me.html") tab = "me";
  else if (file === "games.html" || /^game-/.test(file)) tab = "games";

  var TABS = [
    { id: "home", icon: "🏠", zh: "首页", en: "Home", url: homeFile },
    { id: "learn", icon: "📚", zh: "学习", en: "Learn", url: "pages/learn.html" },
    { id: "games", icon: "🎮", zh: "游戏", en: "Games", url: "pages/games.html" },
    { id: "me", icon: "👤", zh: "我的", en: "Me", url: "pages/me.html" }
  ];

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text) e.textContent = text;
    return e;
  }

  function buildNav() {
    var body = document.body;
    if (!body || body.classList.contains("no-bottom-nav") || document.getElementById("bottom-nav")) return;
    var nav = el("nav", "bottom-nav");
    nav.id = "bottom-nav";
    nav.setAttribute("aria-label", "主导航 / Main menu");
    var inner = el("div", "bottom-nav-inner");
    for (var i = 0; i < TABS.length; i++) {
      var t = TABS[i];
      var a = el("a", "bn-item" + (t.id === tab ? " is-active" : ""));
      a.href = (ROOT || (inPages ? "../" : "")) + t.url;
      a.setAttribute("data-tab", t.id);
      if (t.id === tab) a.setAttribute("aria-current", "page");
      a.setAttribute("aria-label", t.zh + " / " + t.en);
      a.appendChild(el("span", "bn-icon", t.icon)).setAttribute("aria-hidden", "true");
      a.appendChild(el("span", "bn-label", t.zh));
      inner.appendChild(a);
    }
    nav.appendChild(inner);
    body.appendChild(nav);
    body.classList.add("has-bottom-nav");
  }

  // ---------- 经验值小提示 ----------
  var toast = null, toastTimer = null;
  function showXp(n) {
    if (!document.body) return;
    if (!toast) {
      toast = el("div", "xp-toast");
      toast.setAttribute("aria-hidden", "true"); // 只是装饰，读屏软件不用每次念
      document.body.appendChild(toast);
    }
    toast.textContent = "+" + n + " XP ⭐";
    toast.classList.remove("show");
    void toast.offsetWidth; // 重新开始动画
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 800);
  }

  function getItem(k) {
    try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (e) { return null; }
  }
  function setItem(k, v) {
    try { if (window.localStorage) window.localStorage.setItem(k, v); } catch (e) {}
  }
  function today() {
    var P = window.Progress;
    if (P && P.dayKey) return P.dayKey();
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  var party = null, partyTimer = null;
  function celebrate(info) {
    if (!document.body) return;
    if (party && party.parentNode) party.parentNode.removeChild(party);
    party = el("div", "goal-party");
    party.setAttribute("role", "status");
    party.appendChild(el("div", "goal-party-icon", "🎉"));
    var t = el("div", "goal-party-text", "完成今天的目标！");
    t.appendChild(el("span", "en", "Daily goal reached · " + info.today + " / " + info.goal + " XP"));
    party.appendChild(t);
    var close = el("button", "goal-party-close", "好的 / OK");
    close.type = "button";
    close.onclick = hideParty;
    party.appendChild(close);
    document.body.appendChild(party);
    if (partyTimer) clearTimeout(partyTimer);
    partyTimer = setTimeout(hideParty, 3500);
    try { window.dispatchEvent(new Event("goal-celebrated")); } catch (e) {}
  }
  function hideParty() {
    if (partyTimer) { clearTimeout(partyTimer); partyTimer = null; }
    if (party && party.parentNode) party.parentNode.removeChild(party);
    party = null;
  }

  function onXp(ev) {
    var info = ev && ev.detail;
    if (!info || !info.gained) return;
    showXp(info.gained);
    if (info.today >= info.goal) {
      var d = today();
      if (getItem(CELEBRATE_KEY) !== d) {
        setItem(CELEBRATE_KEY, d);
        celebrate(info);
      }
    }
  }

  buildNav();
  if (!document.getElementById("bottom-nav") && document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildNav);
  }
  try { window.addEventListener("progress-xp", onXp); } catch (e) {}

  window.SiteNav = {
    tab: tab,
    root: ROOT,
    homeFile: homeFile,
    celebrateKey: CELEBRATE_KEY
  };
})();
