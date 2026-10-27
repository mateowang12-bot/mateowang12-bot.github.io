// ============================================
// 底部导航栏 + 经验值小提示（nav.js）
// 所有页面都引入，放在 claude-bridge.js 后面（第二个 script，页面 body 的最后面）。
//
// 0) 阶段 11：界面主题（html 的 data-skin），见下面 applySkin。
// 1) 底部导航栏：🗺️ 冒险（首页地图）/ 📚 练习 / 🎁 收藏 / 👤 我的，当前页面对应的标签高亮（阶段 11 改的；游戏页属于“练习”）。
//    链接全部按“本文件的位置”算出网站根目录（js/nav.js 的上一层），所以首页、pages/ 里的子页面都对。
//    首页的文件名：本地版和 GitHub Pages 版是 index.html；claude.ai 版（publish/）是 home.html
//    （tools/build-mobile.ps1 会把下面 HOME_FILE 这一行改成 "home.html"；当前页面本身就是根目录的 home.html 时也用它）。
//    哪个标签算“当前”：根目录的页面 = 冒险；pages/collection.html = 收藏；pages/me.html = 我的；其他 pages/（含游戏大厅和小游戏）= 练习。
//    关卡页 pages/play.html 的 body 有 no-bottom-nav（一屏一题，像 App），不显示导航栏。
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
  else if (file === "collection.html") tab = "collection";
  else if (file === "play.html") tab = "home";

  var TABS = [
    { id: "home", icon: "🗺️", zh: "冒险", en: "Adventure", url: homeFile },
    { id: "learn", icon: "📚", zh: "练习", en: "Practice", url: "pages/learn.html" },
    { id: "collection", icon: "🎁", zh: "收藏", en: "Collection", url: "pages/collection.html" },
    { id: "me", icon: "🐼", zh: "我的", en: "Me", url: "pages/me.html" }
  ];

  // ---------- 界面主题（阶段 11）：尽早设置 html 的 data-skin，免得先闪一下绿色 ----------
  // 直接读进度 key 里的 profile.skin（storage.js 还没加载）；默认主题不设属性。
  // 和深浅色的 data-theme 不冲突。换主题时 storage.js 派发 "profile-changed"，别的标签页改了会触发 "storage"。
  var PROGRESS_KEY = "es-study-progress-v1";
  var SKIN_IDS = { ocean: 1, sunset: 1, violet: 1 };
  function savedSkin() {
    try {
      var t = window.localStorage ? window.localStorage.getItem(PROGRESS_KEY) : null;
      var st = t ? JSON.parse(t) : null;
      var p = st && st.profile;
      var s = p && typeof p.skin === "string" ? p.skin : "";
      // 主题必须是拥有的（防止清除记录后还留着旧主题）
      if (!SKIN_IDS[s] || !(st.owned && st.owned.skins && st.owned.skins[s])) return "";
      return s;
    } catch (e) {
      return "";
    }
  }
  var previewSkin = null; // 收藏页“预览”时临时用的主题
  function applySkin(s) {
    var v = previewSkin !== null ? previewSkin : (s === undefined ? savedSkin() : s);
    try {
      var root = document.documentElement;
      if (v && SKIN_IDS[v]) root.setAttribute("data-skin", v);
      else root.removeAttribute("data-skin");
    } catch (e) {}
  }
  applySkin();
  try {
    window.addEventListener("profile-changed", function () { applySkin(); });
    window.addEventListener("progress-synced", function () { applySkin(); });
    window.addEventListener("storage", function (ev) { if (!ev || ev.key === PROGRESS_KEY || ev.key === null) applySkin(); });
    window.addEventListener("pageshow", function () { applySkin(); });
  } catch (e) {}

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
    nav.setAttribute("aria-label", "主导航");
    var inner = el("div", "bottom-nav-inner");
    for (var i = 0; i < TABS.length; i++) {
      var t = TABS[i];
      var a = el("a", "bn-item" + (t.id === tab ? " is-active" : ""));
      a.href = (ROOT || (inPages ? "../" : "")) + t.url;
      a.setAttribute("data-tab", t.id);
      if (t.id === tab) a.setAttribute("aria-current", "page");
      a.setAttribute("aria-label", t.zh);
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

  var party = null, partyTimer = null, celebratedDay = null;
  function celebrate(info) {
    if (!document.body) return;
    if (party && party.parentNode) party.parentNode.removeChild(party);
    party = el("div", "goal-party");
    party.setAttribute("role", "status");
    if (window.Mascot) party.appendChild(window.Mascot.el("party", "party is-small"));
    else party.appendChild(el("div", "goal-party-icon", "🎉"));
    var t = el("div", "goal-party-text", "完成今天的目标！");
    t.appendChild(el("span", "goal-party-sub", "今天 " + info.today + " / " + info.goal + " XP"));
    party.appendChild(t);
    var close = el("button", "goal-party-close", "好的");
    close.type = "button";
    close.onclick = hideParty;
    party.appendChild(close);
    document.body.appendChild(party);
    try { if (window.Sfx) window.Sfx.sparkle(); } catch (e) {}
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
      // celebratedDay：内存里也记一下（localStorage 写不进去时，例如某些沙盒，也不会每加一次 XP 就再庆祝一次）
      if (getItem(CELEBRATE_KEY) !== d && celebratedDay !== d) {
        celebratedDay = d;
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
    celebrateKey: CELEBRATE_KEY,
    applySkin: applySkin,
    // 收藏页预览主题：preview("ocean") 临时换上；preview(null) 结束预览、回到自己的主题
    preview: function (s) { previewSkin = s ? String(s) : null; applySkin(); },
    href: function (rel) { return (ROOT || (inPages ? "../" : "")) + rel; }
  };
})();
