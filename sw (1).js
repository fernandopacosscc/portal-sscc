/* Service worker mínimo: permite instalar la app.
   Siempre pide la versión más reciente a GitHub; la copia guardada
   solo se usa si no hay conexión. El portal (Apps Script) nunca se toca. */
const CACHE = 'portal-sscc-v5';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // Google: nunca se toca

  e.respondWith(
    fetch(url.href, { cache: 'no-store', credentials: 'same-origin' })
      .then(r => {
        if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(url.href, copia)); }
        return r;
      })
      .catch(() => caches.match(url.href).then(r => r || caches.match('./')))
  );
});
