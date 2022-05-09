importScripts('/assets/js/idb.js');
importScripts('/assets/js/utils.js');

const STATIC_CACHE = 'static-cache-v1';
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

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    cache.addAll(STATIC_FILES);
  })());
});

self.addEventListener('activate', (event) =>  {
  event.waitUntil((async () => {
    const keyList = await caches.keys();
    return Promise.all(keyList.map(function(key) {
      if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
        return caches.delete(key);
      }
    }));
  })())
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = 'https://firestore.googleapis.com/v1/projects/igpwa-3d0a9/databases/(default)/documents/images'
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith((async () => {
      const response = await fetch(event.request);
      const clonedResponse = response.clone();
      const data = await clonedResponse.json()
      data.documents.forEach((image) => {
        writeData('images', image);
      });
      return response;
    })())
  } else {
    event.respondWith((async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      const response = await fetch(event.request);
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(event.request.url, response.clone());
      return response;
    })());
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-new-image') {
    event.waitUntil((async () => {
      const data = await readAllData('sync-images');
      const responses = await Promise.all(data.map(({ id, document }) => (
        fetch(`https://firestore.googleapis.com/v1/projects/igpwa-3d0a9/databases/(default)/documents/images?documentId=${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(document),
        })
      )));
      const documents = await Promise.all(responses.map((response) => response.json()));
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        documents.forEach(({ fields: { url: { stringValue } } }) => client.postMessage({
          type: 'load-image',
          image: stringValue,
        }));
      });
      await clearAllData('sync-images');
    })());
  }
})
