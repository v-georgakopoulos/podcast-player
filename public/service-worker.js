const cacheName = 'podcast-player-v2';
const assetsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/podcast-icon-192.png',
  '/podcast-icon-512.png',
  '/podcast-icon.png',
];

// Install event - caching assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(assetsToCache))
  );
  self.skipWaiting();
});

// Fetch event - serving cached content
self.addEventListener('fetch', event => {
  // Ignore invalid requests to prevent /undefined 404
  if (!event.request || !event.request.url || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .catch(() => {
            // Optional: return a fallback asset if offline
            return caches.match('/podcast-icon.png');
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (!cacheWhitelist.includes(cache)) return caches.delete(cache);
        })
      );
    }).then(() => self.clients.claim())
  );
});
