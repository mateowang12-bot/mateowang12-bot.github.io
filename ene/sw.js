/* Eñe 西语单词 —— 离线缓存（先用缓存，没有再上网取）
 * 发布时运行 tools/build.ps1：它会自动把下面的 VERSION 换成“文件内容的指纹”，
 * 并重新生成 FILES 清单。所以只要内容变了，版本号一定会变，手机上就会换成新文件。
 * （这里手写的内容只是在没用 build 时的后备。）
 */
var VERSION = 'ene-56826e3b14c7'; // BUILD:VERSION
var VENDOR_CACHE = 'vendor-v2'; // 识别程序 vendor/vosk.js 的缓存；改了 vosk.js 就和 js/asr.js 的 VOSK_VER 一起加 1

/* BUILD:FILES-START */
var FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/app.js',
  'js/asr.js',
  'js/cloud.js',
  'js/cloud-config.js',
  'js/data.js',
  'js/sfx.js',
  'js/speak.js',
  'js/speech.js',
  'js/srs.js',
  'js/store.js',
  'data/u01.js',
  'data/u02.js',
  'data/u03.js',
  'data/u04.js',
  'data/u05.js',
  'data/u06.js',
  'data/u07.js',
  'data/u08.js',
  'data/u09.js',
  'data/u10.js',
  'data/u11.js',
  'data/u12.js',
  'data/u13.js',
  'data/u14.js',
  'data/u15.js',
  'data/u16.js',
  'data/u17.js',
  'data/u18.js',
  'data/u19.js',
  'data/u20.js',
  'data/u21.js',
  'data/u22.js',
  'data/u23.js',
  'data/u24.js',
  'data/u25.js',
  'data/u26.js',
  'data/u27.js',
  'data/u28.js',
  'data/u29.js',
  'data/u30.js',
  'data/u31.js',
  'data/u32.js',
  'data/dele1.js',
  'data/dele2.js',
  'data/dele3.js',
  'data/dele4.js',
  'data/xianxi1.js',
  'data/xianxi2.js',
  'data/xianxi3.js',
  'data/xianxi4.js',
  'data/sucheng1.js',
  'data/sucheng2.js',
  'data/sucheng3.js',
  'data/speak1.js',
  'data/speak2.js',
  'data/speak3.js',
  'data/speak4.js',
  'data/speak5.js',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/logo.svg'
];
/* BUILD:FILES-END */

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      // 一个一个加：某个文件取不到也不会让整个安装失败
      return Promise.all(FILES.map(function (url) {
        return fetch(url, { cache: 'no-cache' }).then(function (res) {
          if (res && res.ok) return cache.put(url, res);
        }).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== VERSION && k.indexOf('ene-') === 0) return caches.delete(k);
        if (k !== VENDOR_CACHE && k.indexOf('vendor-') === 0) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 云同步（Supabase）的请求不经过缓存
  // 识别模型（约 40MB）不放进离线缓存：识别程序自己会存到手机里（IndexedDB）
  if (url.pathname.indexOf('/models/') >= 0) return;
  // 识别程序 vendor/vosk.js（约 6MB）：放进一个不随版本删除的缓存，App 更新时不用重新下载
  if (url.pathname.indexOf('/vendor/') >= 0) {
    event.respondWith(caches.open(VENDOR_CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) { if (res && res.ok) c.put(req, res.clone()); return res; });
      });
    }));
    return;
  }
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === 'basic') {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (req.mode === 'navigate') return caches.match('index.html');
        return Response.error();
      });
    })
  );
});
