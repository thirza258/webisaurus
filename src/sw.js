// Webisaurus Service Worker — Offline Cache & Instant Load
const CACHE_NAME = 'webisaurus-static-v4';

const STATIC_ASSETS = [
  './',
  './index.html',
  './compare.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './css/main.css',
  './css/compare.css',
  './css/syntax-theme.css',
  './js/theme.js',
  './js/data-loader.js',
  './js/app.js',
  './js/compare.js',
  './js/command-palette.js',
  './js/playground.js',
  './js/vendor/prism.min.js',
  './data/registry.json',
  './data/concepts.json'
];

// Install: Cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate strategy for maximum speed and freshness
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and http/https schemes
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache valid responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed; cachedResponse will be returned if available
      });

      // Return cached response immediately if found, else wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
