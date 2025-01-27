const CACHE_NAME = 'eaglercraft-pwa-v1';
const FILES_TO_CACHE = [
  '/index.html',
  '/site.webmanifest',
  '/EaglercraftX_1.8_WASM-GC_Offline_Download.html',
  '/WASM-Eagler.html',
  '/EaglercraftX_1.8_u47_Offline_Signed.html',
  '/JS-Eagler.html',
  '/Offline_Download_Version.html',
  '/1.5.2-Eagler.html',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
];

// Install Event
self.addEventListener('install', (evt) => {
  console.log('[Service Worker] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (evt) => {
  console.log('[Service Worker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[Service Worker] Removing old cache: ${key}`);
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
  if (evt.request.method === 'GET') {
    evt.respondWith(
      caches.match(evt.request).then((response) => {
        if (response) {
          return response;
        }
        console.log(`[Service Worker] Fetching resource: ${evt.request.url}`);
        return fetch(evt.request).catch(() => {
          console.error('[Service Worker] Fetch failed; returning offline page.');
        });
      })
    );
  }
});