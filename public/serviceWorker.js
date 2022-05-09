importScripts('/assets/js/idb.js');
importScripts('/assets/js/utils.js');

const STATIC_CACHE = 'static-cache-v4';
const STATIC_FILES = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/js/idb.js',
  '/assets/js/utils.js',
  '/assets/js/dom.js',
  'https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css'
];
const DYNAMIC_CACHE = 'dynamic-cache-v3';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        cache.addAll(STATIC_FILES);
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = 'https://firestore.googleapis.com/v1/projects/igpwa-3d0a9/databases/(default)/documents/images'
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(fetch(event.request)
      .then((response) => {
        const clonedResponse = response.clone()
        clonedResponse.json()
          .then((data) => {
            data.documents.forEach((image) => {
              writeData('images', image);
            });
          })
        return response;
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response
          } else {
            return fetch(event.request)
              .then((response) => {
                return caches.open(DYNAMIC_CACHE)
                  .then((cache) =>  {
                    cache.put(event.request.url, response.clone());
                    return response;
                  })
              });
          }
        })
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-image') {
    event.waitUntil(
      readAllData('sync-images')
        .then((data) => {
          Promise.all(data.map(({ id, document }) => {
            fetch(`https://firestore.googleapis.com/v1/projects/igpwa-3d0a9/databases/(default)/documents/images?documentId=${id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(document),
            })
            .then(() => clearAllData('sync-images'));
          }));
        })
    );
  }
})
