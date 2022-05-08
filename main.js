import './style.css'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serviceWorker.js')
    .then(() => console.log('Service worker registered!'));
}
