addImage = (src) => {
  const images = document.getElementById('images');
  const img = document.createElement('img');
  img.src = src;
  img.className = "image is-128x128 m-2";
  images.appendChild(img);
}