const addImage = (src) => {
  const images = document.getElementById('images');
  const img = document.createElement('img');
  img.src = src;
  img.className = "image is-128x128 m-2";
  images.appendChild(img);
}

const showSyncMessage = () => {
  const syncMessage = document.getElementById('sync-message');
  syncMessage.style.display = 'block';
}

const hideSyncMessage = () => {
  const syncMessage = document.getElementById('sync-message');
  syncMessage.style.display = 'none';
}
