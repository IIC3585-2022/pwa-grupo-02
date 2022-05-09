const dbPromise = idb.open('instagram-pwa-db', 2, (db) => {
  if (!db.objectStoreNames.contains('images')) {
    db.createObjectStore('images', { keyPath: 'name' });
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