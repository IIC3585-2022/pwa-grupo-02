if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.js');
}

window.addEventListener('load', () => {
  fetch('https://firestore.googleapis.com/v1/projects/igpwa-3d0a9/databases/(default)/documents/images')
    .then((response) => response.json())
    .then(({ documents }) => {
      const images = document.getElementById('images');
      documents.forEach(({ fields: { url: { stringValue } } }) => {
        const img = document.createElement('img');
        img.src = stringValue;
        img.className = "image is-128x128 m-2";
        images.appendChild(img);
      });
    });
});
