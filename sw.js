// Keeps the CRM opening fast and working with a weak signal. The site's own files are fetched fresh when online
// (so updates show on the next open) and come from this cache when offline. Your data isn't cached here;
// Firebase keeps its own copy on the device.
const CACHE = "gic-crm-1b58b93a075d";
const SHELL = ["./", "./index.html", "./fb.js", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/apple-touch-icon.png"];
const CDN = /^https:\/\/(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("gic-crm-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === "navigate" ? caches.match("./index.html") : Response.error()))));
  } else if (CDN.test(req.url)) {
    // PDF and font libraries: use the saved copy, refresh it in the background
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => { const net = fetch(req).then(res => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => hit); return hit || net; })));
  }
});
// Notifications (Settings > Notifications): a new text or a closed deal, sent by the texting script through Firebase
// Cloud Messaging. Every push shows one (an iPhone stops delivering them to a site that doesn't). Tapping it opens the
// CRM on that conversation or lead: the open CRM if there is one, a new window if not.
self.addEventListener("push", (e) => {
  let p = {}; try { p = e.data ? e.data.json() : {}; } catch (err) { p = {}; }
  const n = p.notification || {}, d = p.data || {};
  e.waitUntil(self.registration.showNotification(String(d.title || n.title || "Get It Clean CRM"), { body: String(d.body || n.body || ""), icon: "icons/icon-192.png", data: { link: String(d.link || "./") } }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const scope = self.registration.scope, url = new URL((e.notification.data && e.notification.data.link) || "./", scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => x.url.startsWith(scope));
    if (c) { c.postMessage({ gicOpen: url }); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
