// Cache static assets; keep HTML network-fresh
const CACHE = 'etrx-static-v1';
const ASSETS = [
  './',
  './assets/logo.png',
  './assets/Background.png?v=6',
  './assets/Background-640.jpg',
  './assets/Background-960.jpg',
  './assets/Background-1280.jpg'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )));
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  // Never intercept documents (HTML) — keep them fresh
  if (req.destination === 'document') return;

  e.respondWith(
    caches.match(req).then(cached=>{
      if (cached) return cached;
      return fetch(req).then(resp=>{
        const copy = resp.clone();
        caches.open(CACHE).then(c=>c.put(req, copy));
        return resp;
      });
    })
  );
});
