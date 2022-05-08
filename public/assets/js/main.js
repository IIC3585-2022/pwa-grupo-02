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
})
