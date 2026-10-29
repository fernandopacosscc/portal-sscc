/* Portal SSCC · sw.js v6
   No guarda NADA: todo se pide siempre a internet.
   Al instalarse borra las copias viejas que pudiera haber en el móvil. */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Necesario para que el navegador permita "instalar" la app; deja pasar todo a internet.
self.addEventListener('fetch', () => {});
