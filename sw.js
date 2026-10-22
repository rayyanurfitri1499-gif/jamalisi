const CACHE = "se-v1";
const SHELL = ["./", "./index.html", "./style.css", "./manifest.json", "./icon-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (/\.(mp4|webm|m3u8)$/i.test(url.pathname)) return;
  e.respondWith(
    fetch(req).then(res => {
      const salinan = res.clone();
      caches.open(CACHE).then(c => c.put(req, salinan)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
