const dbPromise = idb.open('instagram-pwa-db', 1, (db) => {
  if (!db.objectStoreNames.contains('images')) {
    db.createObjectStore('images', { keyPath: 'name' });
  }
});

const writeData = (dbStore, data) => {
  return dbPromise
    .then((db) => {
      const tx = db.transaction(dbStore, 'readwrite');
      const store = tx.objectStore(dbStore);
      store.put(data);
      return tx.complete;
    })
}

const readAllData = (dbStore) => {
  return dbPromise
    .then((db) => {
      const tx = db.transaction(dbStore, 'readonly');
      const store = tx.objectStore(dbStore);
      return store.getAll();
    })
}