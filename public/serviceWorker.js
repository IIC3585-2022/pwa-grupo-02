const STATIC_CACHE = 'static-cache-v1';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/favicon.svg',
          '/assets/css/style.css',
          '/assets/scripts/main.js',
        ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== STATIC_CACHE) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetching something...', event);
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
