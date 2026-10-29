// ============================================
// 邮箱登录同步 + 搬家码（cloud.js）—— window.CloudSync、window.Transfer（阶段 15）
//
// 一、邮箱 + 密码登录同步（Supabase，web/ 和本地版用；Claude 版自己有同步，这里整个关掉，“我的”页也不显示这一块）
//   - 不用 Supabase SDK（不加载外部资源），直接用 fetch 调 REST 接口；地址和 anon key 在 js/cloud-config.js（为空时显示“还没配置云同步”）
//     注册 POST /auth/v1/signup；登录 POST /auth/v1/token?grant_type=password；刷新 …grant_type=refresh_token；退出 POST /auth/v1/logout
//     读 GET /rest/v1/progress?select=data,updated_at&user_id=eq.{uid}；写 POST /rest/v1/progress（Prefer: resolution=merge-duplicates，upsert）
//     数据表见 tools/supabase-setup.sql（每个用户一行，RLS：只能读写自己的那一行）
//   - 会话（access_token / refresh_token）只存在这台设备 localStorage 的单独 key（SESSION_KEY）里：
//     不放进进度数据、不会被导出、不会进 Claude 的 db、不写进日志。密码绝不保存。快过期时自动刷新；刷新失败就提示重新登录。
//   - 同步 = 先拉远端 → 用 js/storage.js 的合并规则合并进本地（和顺序无关、取较新、resetAt…）→ 和远端不同才 upsert 回去
//     第一次登录时本机进度和云端合并，两边都不丢；本地是空进度、云端还没有时不写（空进度不覆盖）
//   - 时机：登录后、打开页面（稍等 1 秒）、进度变了以后停 8 秒（防抖）、切回前台、切到后台（有没传的变化时）
//   - 出错：离线 / 超时（8 秒）/ 401（先刷新 token，不行就提示重新登录）/ 429 / 5xx……都不影响学习；
//     失败后逐渐拉长间隔再试（1、2、5、10、15 分钟），不狂发请求。国内连不上时网站照常能用
//   - sw.js 不缓存这些请求（它只管自己清单里的文件）
// 二、搬家码（所有版本都有，“我的”页）：Transfer.exportText() / parse(text) / summary(state) / apply(state)
//   格式：“ES1:” + base64。能压缩就先 gzip（CompressionStream），导入时压缩 / 不压缩两种都认。导入是合并，不是覆盖。
// 要在 js/storage.js 和 js/cloud-config.js 之后引入。
// ============================================
(function () {
  var SESSION_KEY = "es-study-cloud-session"; // 只在本机：{ access_token, refresh_token, expires_at, user: { id, email } }
  var LAST_KEY = "es-study-cloud-last";       // 上次同步成功的时间
  var TIMEOUT = 8000, DEBOUNCE = 8000;
  var BACKOFF = [60e3, 120e3, 300e3, 600e3, 900e3];

  function P() { return window.Progress || null; }
  function lsGet(k) { try { return window.localStorage ? window.localStorage.getItem(k) : null; } catch (e) { return null; } }
  function lsSet(k, v) { try { if (window.localStorage) window.localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { if (window.localStorage) window.localStorage.removeItem(k); } catch (e) {} }
  function fire(name) { try { window.dispatchEvent(new Event(name)); } catch (e) {} }
  function cfg() {
    var c = window.CLOUD_CONFIG || {};
    var url = String(c.url || "").replace(/\/+$/, "");
    return { url: url, key: String(c.anonKey || "") };
  }
  function configured() { var c = cfg(); return !!(c.url && c.key); }
  // Claude 版（publish/）：首页文件叫 home.html（js/nav.js 由构建脚本改的）
  function isClaudeBuild() { var n = window.SiteNav; return !!(n && n.homeFile === "home.html"); }
  function available() { return !isClaudeBuild() && typeof fetch === "function" && typeof Promise === "function"; }
  function enabled() { return available() && configured(); }

  // ---------- 会话（只在本机） ----------
  function getSession() {
    try { var s = JSON.parse(lsGet(SESSION_KEY) || "null"); return s && s.access_token && s.user && s.user.id ? s : null; } catch (e) { return null; }
  }
  function saveSession(d) {
    var s = { access_token: d.access_token, refresh_token: d.refresh_token, expires_at: Date.now() + (Number(d.expires_in) || 3600) * 1000,
      user: { id: d.user && d.user.id, email: d.user && d.user.email } };
    lsSet(SESSION_KEY, JSON.stringify(s));
    return s;
  }

  // ---------- 状态 ----------
  // state："off"（没登录）/ "syncing" / "ok" / "offline" / "limit" / "error" / "relogin"（需要重新登录）
  var state = getSession() ? "idle" : "off", lastError = "", busy = null, again = false, timer = null, retryTimer = null, fails = 0;
  function setState(s, msg) { state = s; lastError = msg || ""; fire("cloud-status"); }

  // ---------- 请求（8 秒超时） ----------
  function req(method, path, opts) {
    opts = opts || {};
    var c = cfg();
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var to = null;
    var p = new Promise(function (resolve, reject) {
      to = setTimeout(function () { if (ctrl) ctrl.abort(); reject({ kind: "timeout" }); }, TIMEOUT);
      var headers = { apikey: c.key, "Content-Type": "application/json" };
      if (opts.token) headers.Authorization = "Bearer " + opts.token;
      if (opts.prefer) headers.Prefer = opts.prefer;
      fetch(c.url + path, { method: method, headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined, cache: "no-store", signal: ctrl ? ctrl.signal : undefined })
        .then(function (res) {
          return res.text().then(function (txt) {
            var data = null;
            try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = null; }
            if (res.ok) return resolve(data);
            var msg = data && (data.error_description || data.msg || data.message || data.error || data.error_code) || "";
            if (res.status === 401) return reject({ kind: "auth", msg: String(msg) });
            if (res.status === 429) return reject({ kind: "limit", msg: String(msg) });
            if (res.status >= 500) return reject({ kind: "server", status: res.status });
            reject({ kind: "http", status: res.status, msg: String(msg), code: data && (data.error_code || data.code) });
          });
        }, function () { reject({ kind: "offline" }); });
    });
    return p.then(function (v) { clearTimeout(to); return v; }, function (e) { clearTimeout(to); throw e; });
  }

  // ---------- 错误 → 中文 ----------
  function authMessage(e) {
    var m = String((e && (e.msg || "")) + " " + ((e && e.code) || "")).toLowerCase();
    if (e && e.kind === "offline") return "网络连不上云同步服务，请稍后再试（网站照常能用，进度先存在本机）。";
    if (e && e.kind === "timeout") return "连接云同步太慢（超过 8 秒），请稍后再试。";
    if (e && e.kind === "limit") return "操作太频繁了，请过几分钟再试。";
    if (e && e.kind === "server") return "云同步服务暂时出了问题，请稍后再试。";
    if (/already registered|already been registered|user_already_exists|email_exists/.test(m)) return "这个邮箱已经注册过了，请直接点“登录”。";
    if (/invalid login|invalid_credentials|invalid grant/.test(m)) return "邮箱或密码不对，请再检查一下。";
    if (/not confirmed|email_not_confirmed/.test(m)) return "这个邮箱还没确认：请先打开邮箱，点一下确认链接，再回来登录。";
    if (/password/.test(m) && /(short|weak|least|characters)/.test(m)) return "密码太短或太简单了，至少 6 位。";
    if (/email/.test(m) && /(invalid|format)/.test(m)) return "邮箱格式好像不对，请检查一下。";
    if (/signup.*disabled|signups not allowed/.test(m)) return "现在不能注册新账号。";
    return "没有成功（" + ((e && (e.status || e.kind)) || "未知错误") + "），请稍后再试。";
  }

  // ---------- 登录相关 ----------
  function checkInput(email, pw) {
    email = String(email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "请填写正确的邮箱，例如 abc@qq.com。" };
    if (String(pw || "").length < 6) return { error: "密码至少 6 位。" };
    return { email: email };
  }
  function signUp(email, pw) {
    if (!enabled()) return Promise.resolve({ ok: false, error: "还没配置云同步。" });
    var c = checkInput(email, pw);
    if (c.error) return Promise.resolve({ ok: false, error: c.error });
    return req("POST", "/auth/v1/signup", { body: { email: c.email, password: String(pw) } }).then(function (d) {
      if (d && d.access_token) { saveSession(d); afterLogin(); return { ok: true, loggedIn: true }; }
      // 需要去邮箱点确认链接（Supabase 默认开着“确认邮箱”）
      var u = d && (d.user || d);
      if (u && u.identities && u.identities.length === 0) return { ok: false, error: "这个邮箱已经注册过了，请直接点“登录”。" };
      return { ok: true, needConfirm: true, email: c.email };
    }, function (e) { return { ok: false, error: authMessage(e) }; });
  }
  function signIn(email, pw) {
    if (!enabled()) return Promise.resolve({ ok: false, error: "还没配置云同步。" });
    var c = checkInput(email, pw);
    if (c.error) return Promise.resolve({ ok: false, error: c.error });
    return req("POST", "/auth/v1/token?grant_type=password", { body: { email: c.email, password: String(pw) } }).then(function (d) {
      if (!d || !d.access_token) return { ok: false, error: "登录没有成功，请稍后再试。" };
      saveSession(d);
      afterLogin();
      return { ok: true };
    }, function (e) {
      if (e && (e.kind === "http" || e.kind === "auth")) e.msg = e.msg || "invalid login";
      var m = String((e && e.msg) || "") + " " + String((e && e.code) || "");
      return { ok: false, error: authMessage(e), notConfirmed: /not confirmed|email_not_confirmed/i.test(m) };
    });
  }
  // 重新发送确认邮件（项目开着“邮箱确认”）
  function resend(email) {
    if (!enabled()) return Promise.resolve({ ok: false, error: "还没配置云同步。" });
    email = String(email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Promise.resolve({ ok: false, error: "请先在上面填好邮箱。" });
    return req("POST", "/auth/v1/resend", { body: { type: "signup", email: email } }).then(function () {
      return { ok: true, email: email };
    }, function (e) { return { ok: false, error: authMessage(e) }; });
  }
  // 点了邮件里的确认链接以后，会跳回网站，地址后面带着 #access_token=…&refresh_token=…：
  // 把会话存下来（算已登录），再把这串东西从地址栏里清掉。链接失效时地址里是 #error=…
  function handleRedirect() {
    var h = String(location.hash || "");
    if (!/access_token=|error_description=|error_code=/.test(h)) return Promise.resolve(null);
    var q = {};
    h.replace(/^#/, "").split("&").forEach(function (kv) { var i = kv.indexOf("="); if (i > 0) { try { q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, " ")); } catch (e) {} } });
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { location.hash = ""; }
    if (!q.access_token) return Promise.resolve({ ok: false, message: "确认链接已经失效了。请回到“我的”页，点“重新发送确认邮件”。" });
    if (!enabled()) return Promise.resolve({ ok: true, message: "邮箱已确认，请到“我的”页登录。" });
    return req("GET", "/auth/v1/user", { token: q.access_token }).then(function (u) {
      saveSession({ access_token: q.access_token, refresh_token: q.refresh_token, expires_in: Number(q.expires_in) || 3600, user: u });
      afterLogin();
      return { ok: true, message: "邮箱已确认，已登录" + (u && u.email ? "（" + u.email + "）" : "") + "。进度会自动同步。" };
    }, function () {
      return { ok: true, message: "邮箱已确认，请到“我的”页登录。" };
    });
  }
  // 在页面最上面显示一条小提示
  function notice(text) {
    function put() {
      var box = document.createElement("div");
      box.className = "notice cloud-notice";
      box.setAttribute("role", "status");
      box.textContent = text;
      var close = document.createElement("button");
      close.type = "button";
      close.className = "notice-close";
      close.setAttribute("aria-label", "关闭");
      close.textContent = "×";
      close.onclick = function () { if (box.parentNode) box.parentNode.removeChild(box); };
      box.appendChild(close);
      var place = document.querySelector(".container") || document.body;
      place.insertBefore(box, place.firstChild);
    }
    if (document.body) put(); else document.addEventListener("DOMContentLoaded", put);
  }
  var refreshing = null;
  function refresh() {
    var s = getSession();
    if (!s || !s.refresh_token) return Promise.reject({ kind: "relogin" });
    if (refreshing) return refreshing;
    refreshing = req("POST", "/auth/v1/token?grant_type=refresh_token", { body: { refresh_token: s.refresh_token } }).then(function (d) {
      refreshing = null;
      if (!d || !d.access_token) throw { kind: "relogin" };
      return saveSession(d);
    }, function (e) {
      refreshing = null;
      // 网络问题：先不要求重新登录（下次再试）；token 真的不能用了：要重新登录
      if (e && (e.kind === "offline" || e.kind === "timeout" || e.kind === "server" || e.kind === "limit")) throw e;
      throw { kind: "relogin" };
    });
    return refreshing;
  }
  // 拿一个能用的 access_token（还有 1 分钟就过期时先刷新）
  function freshToken() {
    var s = getSession();
    if (!s) return Promise.reject({ kind: "relogin" });
    if (s.expires_at - Date.now() > 60e3) return Promise.resolve(s);
    return refresh();
  }
  // 带登录的请求：401 时刷新一次再试
  function authed(method, path, opts) {
    opts = opts || {};
    return freshToken().then(function (s) {
      opts.token = s.access_token;
      return req(method, path, opts).then(null, function (e) {
        if (!e || e.kind !== "auth") throw e;
        return refresh().then(function (s2) { opts.token = s2.access_token; return req(method, path, opts); });
      });
    });
  }
  function signOut() {
    var s = getSession();
    if (s) req("POST", "/auth/v1/logout", { token: s.access_token }).then(null, function () {}); // 退不退得成功都无所谓：本机先删
    lsDel(SESSION_KEY); lsDel(LAST_KEY);
    if (timer) { clearTimeout(timer); timer = null; }
    if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
    setState("off");
  }
  function afterLogin() {
    fails = 0;
    if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
    state = "idle";
    run();
  }

  // ---------- 同步一次 ----------
  function syncOnce() {
    var s = getSession();
    if (!s) { setState("off"); return Promise.resolve(); }
    var p = P();
    if (!p || !p.exportState) return Promise.resolve();
    setState("syncing");
    var uid = s.user.id;
    return authed("GET", "/rest/v1/progress?select=data,updated_at&user_id=eq." + encodeURIComponent(uid)).then(function (rows) {
      var remote = rows && rows[0] && rows[0].data && typeof rows[0].data === "object" ? rows[0].data : null;
      if (remote) p.importState(remote);                 // 云端合并进本地
      var merged = p.exportState();
      if (remote && p.sameState(merged, remote)) return "same";
      if (!remote && p.isEmptyState(merged)) return "same"; // 空进度不写
      return authed("POST", "/rest/v1/progress", { prefer: "resolution=merge-duplicates,return=minimal",
        body: { user_id: uid, data: merged, updated_at: new Date().toISOString() } }).then(function () { return "pushed"; });
    }).then(function () {
      fails = 0;
      lsSet(LAST_KEY, String(Date.now()));
      setState("ok");
    }, function (e) {
      var k = e && e.kind;
      if (k === "relogin") { setState("relogin", "登录已过期，请重新登录（进度先存在本机，不会丢）。"); return; }
      fails++;
      var wait = BACKOFF[Math.min(fails - 1, BACKOFF.length - 1)];
      if (k === "limit") { setState("limit", "同步太频繁了，过一会儿自动再试。"); wait = Math.max(wait, 300e3); }
      else if (k === "offline" || k === "timeout") setState("offline", "云同步连不上，进度先存在本机，稍后自动再试。");
      else setState("error", "同步出了点问题（" + ((e && e.status) || k || "未知") + "），稍后自动再试。");
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(function () { retryTimer = null; run(); }, wait);
    });
  }
  function run() {
    if (!enabled() || !getSession() || state === "relogin") return Promise.resolve();
    if (busy) { again = true; return busy; }
    busy = syncOnce().then(function () {
      busy = null;
      if (again) { again = false; return run(); }
    });
    return busy;
  }
  function schedule(ms) {
    if (!enabled() || !getSession() || state === "relogin" || retryTimer) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { timer = null; run(); }, ms);
  }

  var CloudSync = {
    SESSION_KEY: SESSION_KEY,
    available: available, configured: configured, enabled: enabled,
    user: function () { var s = getSession(); return s ? { id: s.user.id, email: s.user.email } : null; },
    status: function () { return { state: getSession() ? state : "off", message: lastError, last: Number(lsGet(LAST_KEY)) || 0 }; },
    signUp: signUp, signIn: signIn, signOut: signOut, resend: resend, handleRedirect: handleRedirect,
    syncNow: function () { if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; } return run(); },
    _refresh: refresh // 测试用
  };

  if (enabled()) {
    try {
      window.addEventListener("progress-changed", function () { schedule(DEBOUNCE); });
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
          if (Date.now() - (Number(lsGet(LAST_KEY)) || 0) > 30e3) schedule(500);
        } else if (timer) { clearTimeout(timer); timer = null; run(); }
      });
      if (getSession()) setTimeout(function () { schedule(0); }, 1000);
    } catch (e) {}
  }
  window.CloudSync = CloudSync;
  // 从确认邮件的链接跳回来：接住登录信息（Claude 版不做）
  if (available()) {
    var onRedirect = function () {
      try { handleRedirect().then(function (r) { if (r && r.message) { var old = document.querySelectorAll(".cloud-notice"); for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]); notice(r.message); fire("cloud-status"); } }); } catch (e) {}
    };
    onRedirect();
    try { window.addEventListener("hashchange", onRedirect); } catch (e) {} // 页面已经打开着、只换了 # 后面的部分时也接住
  }

  // =====================================================================
  // 搬家码：导出 / 导入
  // =====================================================================
  var PREFIX = "ES1:";
  function b64encode(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function b64decode(str) {
    var bin = atob(str);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function streamBytes(bytes, stream) {
    var blob = new Blob([bytes]);
    return new Response(blob.stream().pipeThrough(stream)).arrayBuffer().then(function (ab) { return new Uint8Array(ab); });
  }
  var Transfer = {
    // → Promise<string>
    exportText: function () {
      var p = P();
      var json = JSON.stringify(p ? p.exportState() : {});
      var bytes = new TextEncoder().encode(json);
      if (typeof CompressionStream === "function") {
        return streamBytes(bytes, new CompressionStream("gzip")).then(function (z) { return PREFIX + b64encode(z); }, function () { return PREFIX + b64encode(bytes); });
      }
      return Promise.resolve(PREFIX + b64encode(bytes));
    },
    // → Promise<{ ok, state?, error? }>
    parse: function (text) {
      var t = String(text || "").replace(/\s+/g, "");
      if (!t) return Promise.resolve({ ok: false, error: "还没有粘贴搬家码，或者文件是空的。" });
      if (t.indexOf(PREFIX) !== 0) {
        if (/^ES\d+:/.test(t)) return Promise.resolve({ ok: false, error: "这个搬家码的版本太新了，请先把这台设备的网站更新到最新版本。" });
        return Promise.resolve({ ok: false, error: "这不是本网站的搬家码（应该以 ES1: 开头）。请检查有没有复制完整。" });
      }
      var bytes;
      try { bytes = b64decode(t.slice(PREFIX.length)); } catch (e) { return Promise.resolve({ ok: false, error: "搬家码好像不完整或被改动过了，请重新复制一次。" }); }
      var gz = bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
      var getText = gz ? (typeof DecompressionStream === "function" ? streamBytes(bytes, new DecompressionStream("gzip")).then(function (u) { return new TextDecoder().decode(u); })
        : Promise.reject({ msg: "这台设备的浏览器太旧，打不开压缩过的搬家码。请在另一台设备上更新浏览器后再试。" })) : Promise.resolve(new TextDecoder().decode(bytes));
      return getText.then(function (txt) {
        var o;
        try { o = JSON.parse(txt); } catch (e) { return { ok: false, error: "搬家码好像不完整或被改动过了，请重新复制一次。" }; }
        if (!o || typeof o !== "object" || !o.words || typeof o.version !== "number") return { ok: false, error: "搬家码里没有找到学习进度。" };
        if (o.version > 1) return { ok: false, error: "这个搬家码来自更新版本的网站，请先把这台设备的网站更新到最新版本。" };
        return { ok: true, state: o };
      }, function (e) { return { ok: false, error: (e && e.msg) || "搬家码好像不完整或被改动过了，请重新复制一次。" }; });
    },
    // 合并前给用户看的数字
    summary: function (st) {
      var p = P();
      var c = p && p.cleanState ? p.cleanState(st) : st;
      function n(o) { var k = 0; for (var x in o) if (Object.prototype.hasOwnProperty.call(o, x)) k++; return k; }
      var stars = 0;
      for (var id in c.levels) if (Object.prototype.hasOwnProperty.call(c.levels, id)) stars += c.levels[id].stars || 0;
      var xp = 0;
      for (var d in c.xp) if (Object.prototype.hasOwnProperty.call(c.xp, d)) xp += c.xp[d] || 0;
      return { words: n(c.words), levels: n(c.levels), stars: stars, days: n(c.days), xp: xp, stamps: n(c.stamps), avatars: n(c.owned.avatars) };
    },
    apply: function (st) { var p = P(); return p ? p.importState(st) : { changed: false }; }
  };

  window.Transfer = Transfer;
})();
