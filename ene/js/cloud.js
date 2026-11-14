/* Eñe 西语单词 —— 邮箱 + 密码登录同步（Supabase，不用 SDK，直接 fetch REST 接口）
 *
 * - 设置在 js/cloud-config.js（地址、anon key、表名 ene_progress）；建表 SQL 在 tools/supabase-ene.sql。
 * - 登录信息只存在本机 localStorage 的 "ene-cloud-session"（和旧网站分开）。密码从不保存。
 * - 同步一次 = 拉云端 → Ene.Store.merge(云端)（每个词 / 设置按 updatedAt 取新的，每天记录取较大值，和顺序无关）→ 把合并结果推回云端。
 * - 什么时候同步：登录后；打开 App（1 秒后）；切回前台（距上次超过 30 秒）；每轮学习结束后 3 秒（防抖）；切到后台时如果有没推的变化。
 * - 出错（离线、超时、服务器问题）都不影响学习，只在“我的”页显示一行小字。
 * - 表还没建（404 / relation 不存在）：显示“云同步还没开通（需要先建表）”，照常本机使用。
 */
(function () {
  'use strict';
  var Ene = (window.Ene = window.Ene || {});
  var SESSION_KEY = 'ene-cloud-session';
  var LAST_KEY = 'ene-cloud-last';
  var TIMEOUT = 10000;

  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { window.localStorage.removeItem(k); } catch (e) {} }
  function cfg() {
    var c = window.ENE_CLOUD || {};
    return { url: String(c.url || '').replace(/\/+$/, ''), key: String(c.anonKey || ''), table: String(c.table || 'ene_progress') };
  }
  function enabled() { var c = cfg(); return !!(c.url && c.key) && typeof fetch === 'function' && typeof Promise === 'function'; }

  /* ---------- 会话 ---------- */
  function getSession() {
    try {
      var s = JSON.parse(lsGet(SESSION_KEY) || 'null');
      return s && s.access_token && s.user && s.user.id ? s : null;
    } catch (e) { return null; }
  }
  function saveSession(d) {
    var s = {
      access_token: d.access_token, refresh_token: d.refresh_token,
      expires_at: Date.now() + (Number(d.expires_in) || 3600) * 1000,
      user: { id: d.user && d.user.id, email: d.user && d.user.email }
    };
    lsSet(SESSION_KEY, JSON.stringify(s));
    return s;
  }

  /* ---------- 状态（给“我的”页显示） ----------
   * off 没登录 / idle / syncing / ok / offline / notable 表没建 / relogin 要重新登录 / error */
  var state = getSession() ? 'idle' : 'off', message = '';
  var listeners = [];
  function setState(s, msg) {
    state = s; message = msg || '';
    for (var i = 0; i < listeners.length; i++) { try { listeners[i](); } catch (e) {} }
  }

  /* ---------- 请求 ---------- */
  function req(method, path, opts) {
    opts = opts || {};
    var c = cfg();
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var to;
    return new Promise(function (resolve, reject) {
      to = setTimeout(function () { if (ctrl) ctrl.abort(); reject({ kind: 'timeout' }); }, TIMEOUT);
      var headers = { apikey: c.key, 'Content-Type': 'application/json' };
      if (opts.token) headers.Authorization = 'Bearer ' + opts.token;
      if (opts.prefer) headers.Prefer = opts.prefer;
      fetch(c.url + path, {
        method: method, headers: headers, cache: 'no-store',
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (res) {
        return res.text().then(function (txt) {
          var data = null;
          try { data = txt ? JSON.parse(txt) : null; } catch (e) {}
          if (res.ok) return resolve(data);
          var msg = String((data && (data.error_description || data.msg || data.message || data.error)) || '');
          var code = String((data && (data.error_code || data.code)) || '');
          if (res.status === 401) return reject({ kind: 'auth', msg: msg, code: code });
          if (res.status === 429) return reject({ kind: 'limit', msg: msg });
          if (res.status >= 500) return reject({ kind: 'server', status: res.status, msg: msg, code: code });
          reject({ kind: 'http', status: res.status, msg: msg, code: code });
        });
      }, function () { reject({ kind: 'offline' }); });
    }).then(function (v) { clearTimeout(to); return v; }, function (e) { clearTimeout(to); throw e; });
  }

  function isNoTable(e) {
    var m = String((e && e.msg) || '') + ' ' + String((e && e.code) || '');
    return !!e && (e.status === 404 || /PGRST205|42P01|does not exist|could not find the table|relation/i.test(m));
  }

  /* ---------- 错误 → 中文 ---------- */
  function authMessage(e) {
    var m = (String((e && e.msg) || '') + ' ' + String((e && e.code) || '')).toLowerCase();
    if (e && e.kind === 'offline') return '网络连不上，请稍后再试（App 照常能用，进度先存在本机）。';
    if (e && e.kind === 'timeout') return '连接太慢，请稍后再试。';
    if (e && e.kind === 'limit') return '操作太频繁了，请过几分钟再试。';
    if (e && e.kind === 'server') return '云同步服务暂时出了问题，请稍后再试。';
    if (/not confirmed|email_not_confirmed/.test(m)) return '请先去邮箱点确认链接，然后再回来登录。';
    if (/already registered|already been registered|user_already_exists|email_exists/.test(m)) return '这个邮箱已经注册过了，请直接点“登录”。';
    if (/invalid login|invalid_credentials|invalid grant|invalid_grant/.test(m)) return '邮箱或密码不对，请再检查一下。';
    if (/password/.test(m) && /(short|weak|least|characters)/.test(m)) return '密码太短或太简单了，至少 6 位。';
    if (/email/.test(m) && /(invalid|format)/.test(m)) return '邮箱格式好像不对，请检查一下。';
    if (/signup.*disabled|signups not allowed/.test(m)) return '现在不能注册新账号。';
    if (/rate limit|over_email_send_rate_limit/.test(m)) return '发邮件太频繁了，请过一会儿再试。';
    return '没有成功，请稍后再试。';
  }

  function checkInput(email, pw) {
    email = String(email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: '请填写正确的邮箱，例如 abc@qq.com。' };
    if (String(pw || '').length < 6) return { error: '密码至少 6 位。' };
    return { email: email };
  }

  // 确认邮件里的链接要跳回这个 App（需要在 Supabase 的 Redirect URLs 里允许）
  function redirectTo() {
    if (location.protocol !== 'https:') return '';
    return '?redirect_to=' + encodeURIComponent(location.origin + location.pathname);
  }

  function signUp(email, pw) {
    if (!enabled()) return Promise.resolve({ ok: false, error: '还没配置云同步。' });
    var c = checkInput(email, pw);
    if (c.error) return Promise.resolve({ ok: false, error: c.error });
    return req('POST', '/auth/v1/signup' + redirectTo(), { body: { email: c.email, password: String(pw) } }).then(function (d) {
      if (d && d.access_token) { saveSession(d); afterLogin(); return { ok: true, loggedIn: true }; }
      var u = d && (d.user || d);
      if (u && u.identities && u.identities.length === 0) return { ok: false, error: '这个邮箱已经注册过了，请直接点“登录”。' };
      return { ok: true, needConfirm: true };
    }, function (e) { return { ok: false, error: authMessage(e) }; });
  }

  function signIn(email, pw) {
    if (!enabled()) return Promise.resolve({ ok: false, error: '还没配置云同步。' });
    var c = checkInput(email, pw);
    if (c.error) return Promise.resolve({ ok: false, error: c.error });
    return req('POST', '/auth/v1/token?grant_type=password', { body: { email: c.email, password: String(pw) } }).then(function (d) {
      if (!d || !d.access_token) return { ok: false, error: '登录没有成功，请稍后再试。' };
      saveSession(d);
      afterLogin();
      return { ok: true };
    }, function (e) {
      if (e && (e.kind === 'http' || e.kind === 'auth') && !e.msg && !e.code) e.msg = 'invalid login';
      var m = String((e && e.msg) || '') + ' ' + String((e && e.code) || '');
      return { ok: false, error: authMessage(e), notConfirmed: /not confirmed|email_not_confirmed/i.test(m) };
    });
  }

  function resend(email) {
    if (!enabled()) return Promise.resolve({ ok: false, error: '还没配置云同步。' });
    email = String(email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Promise.resolve({ ok: false, error: '请先在上面填好邮箱。' });
    return req('POST', '/auth/v1/resend' + redirectTo(), { body: { type: 'signup', email: email } }).then(function () {
      return { ok: true };
    }, function (e) { return { ok: false, error: authMessage(e) }; });
  }

  var refreshing = null;
  function refresh() {
    var s = getSession();
    if (!s || !s.refresh_token) return Promise.reject({ kind: 'relogin' });
    if (refreshing) return refreshing;
    refreshing = req('POST', '/auth/v1/token?grant_type=refresh_token', { body: { refresh_token: s.refresh_token } }).then(function (d) {
      refreshing = null;
      if (!d || !d.access_token) throw { kind: 'relogin' };
      if (!d.user) d.user = s.user;
      return saveSession(d);
    }, function (e) {
      refreshing = null;
      if (e && (e.kind === 'offline' || e.kind === 'timeout' || e.kind === 'server' || e.kind === 'limit')) throw e;
      throw { kind: 'relogin' };
    });
    return refreshing;
  }
  function freshToken() {
    var s = getSession();
    if (!s) return Promise.reject({ kind: 'relogin' });
    if (s.expires_at - Date.now() > 60e3) return Promise.resolve(s);
    return refresh();
  }
  function authed(method, path, opts) {
    opts = opts || {};
    return freshToken().then(function (s) {
      opts.token = s.access_token;
      return req(method, path, opts).then(null, function (e) {
        if (!e || e.kind !== 'auth') throw e;
        return refresh().then(function (s2) { opts.token = s2.access_token; return req(method, path, opts); });
      });
    });
  }

  function signOut() {
    var s = getSession();
    if (s && enabled()) req('POST', '/auth/v1/logout', { token: s.access_token }).then(null, function () {});
    lsDel(SESSION_KEY); lsDel(LAST_KEY);
    clearTimeout(timer); timer = null;
    setState('off');
  }

  function afterLogin() { state = 'idle'; run(); }

  /* ---------- 同步一次：拉 → 合并 → 推 ---------- */
  var busy = null, again = false, timer = null, dirty = false;
  function syncOnce() {
    var s = getSession();
    if (!s) { setState('off'); return Promise.resolve(); }
    var Store = Ene.Store;
    var t = cfg().table;
    var uid = s.user.id;
    setState('syncing');
    return authed('GET', '/rest/v1/' + t + '?select=data,updated_at&user_id=eq.' + encodeURIComponent(uid)).then(function (rows) {
      var remote = rows && rows[0] && rows[0].data && typeof rows[0].data === 'object' ? rows[0].data : null;
      if (remote) Store.merge(remote);
      var merged = Store.exportData();
      var empty = !Object.keys(merged.words || {}).length && !Object.keys(merged.log || {}).length;
      if (!remote && empty) return; // 两边都是空的：不写
      return authed('POST', '/rest/v1/' + t, {
        prefer: 'resolution=merge-duplicates,return=minimal',
        body: { user_id: uid, data: merged, updated_at: new Date().toISOString() }
      });
    }).then(function () {
      dirty = false;
      lsSet(LAST_KEY, String(Date.now()));
      setState('ok');
    }, function (e) {
      var k = e && e.kind;
      if (k === 'relogin') setState('relogin', '登录已过期，请重新登录（进度先存在本机，不会丢）。');
      else if (isNoTable(e)) setState('notable', '云同步还没开通（需要先建表）。进度先存在本机。');
      else if (k === 'offline' || k === 'timeout') setState('offline', '现在连不上网，进度先存在本机。');
      else if (k === 'limit') setState('error', '同步太频繁了，过一会儿再试。');
      else setState('error', '同步没有成功，稍后再试。');
    });
  }
  function run() {
    if (!enabled() || !getSession() || state === 'relogin') return Promise.resolve();
    if (busy) { again = true; return busy; }
    busy = syncOnce().then(function () {
      busy = null;
      if (again) { again = false; return run(); }
    });
    return busy;
  }
  function schedule(ms) {
    if (!enabled() || !getSession() || state === 'relogin') return;
    clearTimeout(timer);
    timer = setTimeout(function () { timer = null; run(); }, ms);
  }

  /* ---------- 从确认邮件的链接跳回来：地址里带 #access_token=… ----------
   * 在 app.js 处理 # 路由之前先同步地把它接住、清掉。 */
  var redirectResult = Promise.resolve(null);
  (function catchRedirect() {
    var h = String(location.hash || '');
    if (!/access_token=|error_description=|error_code=/.test(h)) return;
    var q = {};
    h.replace(/^#/, '').split('&').forEach(function (kv) {
      var i = kv.indexOf('=');
      if (i > 0) { try { q[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' ')); } catch (e) {} }
    });
    try { history.replaceState(null, '', location.pathname + location.search + '#/me'); } catch (e) { location.hash = '#/me'; }
    if (!q.access_token) { redirectResult = Promise.resolve('确认链接已经失效了，请在“我的”页点“重新发送确认邮件”。'); return; }
    if (!enabled()) return;
    redirectResult = req('GET', '/auth/v1/user', { token: q.access_token }).then(function (u) {
      saveSession({ access_token: q.access_token, refresh_token: q.refresh_token, expires_in: Number(q.expires_in) || 3600, user: u });
      afterLogin();
      return '邮箱已确认，已登录。进度会自动同步。';
    }, function () { return '邮箱已确认，请登录。'; });
  })();

  if (enabled()) {
    try {
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
          if (Date.now() - (Number(lsGet(LAST_KEY)) || 0) > 30e3) schedule(300);
        } else if (dirty || timer) { clearTimeout(timer); timer = null; run(); }
      });
      if (getSession()) setTimeout(function () { schedule(0); }, 1000);
    } catch (e) {}
  }

  Ene.Cloud = {
    enabled: enabled,
    user: function () { var s = getSession(); return s ? { id: s.user.id, email: s.user.email } : null; },
    status: function () { return { state: getSession() ? state : 'off', message: message, last: Number(lsGet(LAST_KEY)) || 0 }; },
    signUp: signUp, signIn: signIn, signOut: signOut, resend: resend,
    syncNow: function () { clearTimeout(timer); timer = null; return run(); },
    // 学习结束后调用：3 秒后同步一次（防抖）
    changed: function () { dirty = true; schedule(3000); },
    onChange: function (fn) { listeners.push(fn); },
    redirectResult: function () { return redirectResult; },
    SESSION_KEY: SESSION_KEY
  };
})();
