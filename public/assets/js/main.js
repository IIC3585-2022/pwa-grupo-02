window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js');
  }

  fetch('https://firestore.googleapis.com/v1/projects/igpwa-3d0a9/databases/(default)/documents/images')
    .then((response) => response.json())
    .then(({ documents }) => {
      documents.forEach(({ fields: { url: { stringValue } } }) => {
        addImage(stringValue);
      });
    })
    .catch(() => {
      if ('indexedDB' in window) {
        readAllData('images')
          .then((data) => {
            data.forEach(({ fields: { url: { stringValue } } }) => {
              addImage(stringValue);
            });
          });
      }
    });

  const form = document.getElementById('upload-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const id = new Date().toISOString();
    const image = {
      id,
      document: {
        fields: {
          url: {
            stringValue: data.get('url'),
          },
        },
      },
    }
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then((sw) => {
          writeData('sync-images', image)
            .then(() => {
              return sw.sync.register('sync-new-image');
            })
            .then(() => {
              const urlField = document.getElementById('url');
              urlField.value = '';
            });
        });
    }
  });
});
