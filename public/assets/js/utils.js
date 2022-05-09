const dbPromise = idb.open('instagram-pwa-db', 3, (db) => {
  if (!db.objectStoreNames.contains('images')) {
    db.createObjectStore('images', { keyPath: 'id' });
  }
  if (!db.objectStoreNames.contains('sync-images')) {
    db.createObjectStore('sync-images', { keyPath: 'id' });
  }
});

const writeData = async (dbStore, data) => {
  const db = await dbPromise;
  const tx = db.transaction(dbStore, 'readwrite');
  const store = tx.objectStore(dbStore);
  store.put(data);
  return tx.complete;
}

const readAllData = async (dbStore) => {
  const db = await dbPromise;
  const tx = db.transaction(dbStore, 'readonly');
  const store = tx.objectStore(dbStore);
  return store.getAll();
}

const clearAllData = async (dbStore) => {
  const db = await dbPromise;
  const tx = db.transaction(dbStore, 'readwrite');
  const store = tx.objectStore(dbStore); 
  return store.clear();
}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
