
const CACHE_NAME = 'eaglercraft-pwa-v1';
const FILES_TO_CACHE = [
  '/index.html',
  '/site.webmanifest',
  '/EaglercraftX_1.8_WASM-GC_Offline_Download.html',
  './WASM-Eagler.html',
  '/EaglercraftX_1.8_u47_Offline_Signed.html',
  './JS-Eagler.html',
  './Offline_Download_Version.html',
  './1.5.2-Eagler.html',
];

// Install Event
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Force service worker to become active immediately
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      // Remove old caches
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});