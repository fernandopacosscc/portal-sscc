/* Service worker mínimo: permite instalar la app y que la pantalla de
   bienvenida abra al instante. El portal (Apps Script) siempre va por red. */
const CACHE = 'portal-sscc-v4';
const ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png', 'favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // Google: nunca se toca
  // Red primero (para que los cambios se vean), caché si no hay conexión
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }) // siempre pregunta a GitHub si hay versión nueva
      .then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request))
  );
});
