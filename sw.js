const CACHE = "se-v2";
const SHELL = ["./", "./index.html", "./style.css", "./manifest.json", "./ikon-192.png"];
const API = "https://vjjdeyyjinerila.xyz";

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

/* ===== NOTIFIKASI EPISODE BARU ===== */
self.addEventListener("push", e => {
  e.waitUntil((async () => {
    let n = null;
    try { const r = await fetch(API + "/api/notif/terbaru", { cache: "no-store" }); n = (await r.json()).notif; } catch (err) {}
    const judul = (n && n.judul) || "Spesial Edition";
    const opsi = {
      body: (n && n.isi) || "Ada episode baru, tonton sekarang",
      icon: "ikon-192.png",
      badge: "ikon-192.png",
      tag: "se-" + ((n && n.id) || "baru"),
      data: { url: (n && n.url) || "./" },
      vibrate: [80, 40, 80]
    };
    if (n && n.gambar) opsi.image = n.gambar;
    await self.registration.showNotification(judul, opsi);
    try {
      const semua = await self.registration.getNotifications();
      if (self.navigator.setAppBadge) await self.navigator.setAppBadge(semua.length || 1);
    } catch (err) {}
  })());
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const tujuan = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil((async () => {
    try { if (self.navigator.clearAppBadge) await self.navigator.clearAppBadge(); } catch (err) {}
    const tab = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of tab) {
      if ("navigate" in c) { await c.focus(); return c.navigate(tujuan); }
    }
    return self.clients.openWindow(tujuan);
  })());
});
