// ============================================
// 离线缓存（sw.js）—— 由 tools/build-web.ps1 自动生成，不要手改
// 规则：缓存优先 + 版本号更新
//   install ：把网站全部文件（FILES 清单）下载进本版本的缓存（绕过浏览器的 HTTP 缓存，保证拿到新文件）；
//             有一个下载失败就删掉这个没装完的缓存，安装失败（旧版本继续用）；
//   activate：删除这个网站的旧版本缓存；
//   fetch   ：只管 FILES 清单里的地址（含网站根地址 "./"），其他请求一律不拦截、不缓存；
//             先用缓存，缓存里没有才上网取；断网又没缓存时，打开页面就显示一个“离线”小页面。
// 网站内容一变，build-web.ps1 算出的 VERSION 就变，sw.js 跟着变，
// 浏览器联网时发现 sw.js 变了，就在后台装新版本，下次打开页面生效。
// ============================================
var VERSION = "4df5c1960590";
var SCOPE = self.registration ? self.registration.scope : new URL("./", self.location).href;
var PREFIX = "es-study:" + SCOPE + ":";   // 同一个 github.io 域名下可能有别的网站：缓存名带上网站地址
var CACHE = PREFIX + VERSION;
var FILES = [
  "./",
  "css/style.css",
  "data/alphabet.js",
  "data/dialogues.js",
  "data/grammar.js",
  "data/levels.js",
  "data/phrases.js",
  "data/words.js",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "index.html",
  "js/claude-bridge.js",
  "js/cloud.js",
  "js/cloud-config.js",
  "js/games.js",
  "js/icons.js",
  "js/map.js",
  "js/mascot.js",
  "js/modules.js",
  "js/nav.js",
  "js/play.js",
  "js/pwa.js",
  "js/sfx.js",
  "js/skin-early.js",
  "js/speak.js",
  "js/storage.js",
  "js/swipe.js",
  "js/terrain.js",
  "js/words-util.js",
  "js/world.js",
  "manifest.webmanifest",
  "pages/alphabet.html",
  "pages/chat.html",
  "pages/collection.html",
  "pages/dialogue.html",
  "pages/game-guess.html",
  "pages/game-match.html",
  "pages/game-order.html",
  "pages/games.html",
  "pages/game-speed.html",
  "pages/grammar.html",
  "pages/learn.html",
  "pages/me.html",
  "pages/phrases.html",
  "pages/play.html",
  "pages/quiz.html",
  "pages/review.html",
  "pages/words.html"
];

// 清单里的地址先算成绝对地址（不带 ?查询 和 #）
var OWN = {};
for (var i = 0; i < FILES.length; i++) OWN[new URL(FILES[i], self.location).href] = true;

function keyOf(url) {
  var u = new URL(url);
  u.search = "";
  u.hash = "";
  return u.href;
}

function fresh(res) {
  // 跳转过的回应不能直接用来打开页面：重新包一层
  if (!res.redirected) return Promise.resolve(res);
  return res.blob().then(function (body) {
    return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
  });
}

function offlinePage() {
  var home = SCOPE; // 网站首页的绝对地址
  var html =
    '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>离线 · 我的西语学习站</title><style>' +
    'body{margin:0;padding:48px 16px;text-align:center;font-family:system-ui,-apple-system,sans-serif;' +
    'font-size:18px;line-height:1.6;background:#f7faf4;color:#1f2a1c}' +
    'a{display:inline-block;margin-top:12px;padding:12px 24px;border-radius:16px;background:#27870f;color:#fff;' +
    'text-decoration:none;font-weight:bold;box-shadow:0 4px 0 #1a5e06}' +
    '@media (prefers-color-scheme: dark){body{background:#121a14;color:#eaf2e6}a{background:#5fcf1c;color:#0b2600;box-shadow:0 4px 0 #3f9600}}' +
    '</style></head><body>' +
    '<h1>现在没有网络</h1>' +
    '<p>这个页面还没缓存，联网后再打开。</p>' +
    '<p><a href="' + home + '">返回首页</a></p>' +
    '</body></html>';
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.all(FILES.map(function (f) {
        var url = new URL(f, self.location).href;
        return fetch(new Request(url, { cache: "reload" })).then(function (res) {
          if (!res.ok) throw new Error("下载失败 " + f + " (" + res.status + ")");
          return fresh(res).then(function (r) { return cache.put(url, r); });
        });
      }));
    }).then(null, function (err) {
      // 没装完：删掉这个不完整的缓存，再让安装失败
      return caches["delete"](CACHE).then(function () { throw err; }, function () { throw err; });
    }).then(function () {
      return self.skipWaiting(); // 新版本装好就接管；已经打开的页面不变，下次打开用新版本
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k.indexOf(PREFIX) === 0 && k !== CACHE) return caches["delete"](k);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var key = keyOf(req.url);
  if (OWN[key] !== true) return; // 不在清单里：不拦截、不缓存

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(key, { ignoreVary: true }).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          if (res && res.ok && res.type === "basic") {
            fresh(res.clone()).then(function (r) { return cache.put(key, r); }).then(null, function () {});
          }
          return res;
        }, function (err) {
          if (req.mode === "navigate") return offlinePage();
          throw err;
        });
      });
    })
  );
});