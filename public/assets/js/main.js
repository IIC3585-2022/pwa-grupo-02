window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js');
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'load-image') {
        addImage(event.data.image);
        hideSyncMessage();
      }
    });
  }

  try {
    const response = await fetch('https://igpwa-3d0a9-default-rtdb.firebaseio.com/images.json');
    const data = await response.json();
    Object.keys(data).forEach((key) => {
      addImage(data[key].url);
    });
  } catch (error) {
    if ('indexedDB' in window) {
      const data = await readAllData('images');
      data.forEach(({ url }) => {
        addImage(url);
      });
    }
  }

  const form = document.getElementById('upload-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const id = new Date().toISOString();
    const image = {
      id,
      url: data.get('url'),
    }
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const sw = await navigator.serviceWorker.ready
      await writeData('sync-images', image);
      await sw.sync.register('sync-new-image');
      const urlField = document.getElementById('url');
      urlField.value = '';
      showSyncMessage();
    }
  });

  const syncMessageButton = document.getElementById('sync-message-button');
  syncMessageButton.addEventListener('click', hideSyncMessage);

  if ('Notification' in window) {
    requestNotificationsPermissions();
  }
});
