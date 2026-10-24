// Webisaurus Service Worker — Offline Cache & Instant Load
const CACHE_NAME = 'webisaurus-static-v6';

const STATIC_ASSETS = [
  './',
  './index.html',
  './compare.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './css/main.css?v=20260907-v6',
  './css/compare.css?v=20260907-v6',
  './css/syntax-theme.css?v=20260907-v6',
  './js/theme.js',
  './js/data-loader.js',
  './js/app.js?v=20260907-v6',
  './js/compare.js?v=20260907-v6',
  './js/command-palette.js',
  './js/playground.js',
  './js/vendor/prism.min.js?v=20260907-v6',
  './data/registry.json',
  './data/concepts.json'
];

// Install: Cache core application shell using reload to bypass disk cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        STATIC_ASSETS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'reload' });
            if (res.ok) await cache.put(url, res);
          } catch (e) {
            console.warn('SW pre-cache failed for', url, e);
          }
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions immediately
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

// Fetch: Network-First with Cache fallback for data JSON, Stale-While-Revalidate for application shell
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);
  const isData = url.pathname.includes('/data/') || (url.pathname.endsWith('.json') && !url.pathname.endsWith('manifest.json'));

  if (isData) {
    // Network-First with Cache Fallback for dynamic JSON data
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          }

          // If server responded with error (e.g. 500, 502, 503, 504), attempt cache fallback
          const cached = await caches.match(event.request);
          if (cached) {
            return cached;
          }

          return networkResponse || new Response(JSON.stringify({ error: 'Server error' }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          // Network failed (offline, timeout, connection refused)
          const cached = await caches.match(event.request);
          if (cached) {
            return cached;
          }

          // Always return a valid Response to prevent "Failed to convert value to 'Response'"
          return new Response(JSON.stringify({ error: 'Resource unavailable offline' }), {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })()
    );
    return;
  }

  // Stale-While-Revalidate for application shell (HTML, CSS, JS, Images, Manifest)
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);

      const networkFetch = (async () => {
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, responseToCache);
          }
          return networkResponse;
        } catch (err) {
          return null;
        }
      })();

      // If cached copy exists, return it immediately while revalidating in background
      if (cachedResponse) {
        return cachedResponse;
      }

      // Not in cache, await network
      const networkResponse = await networkFetch;
      if (networkResponse) {
        return networkResponse;
      }

      // Neither cache nor network returned a valid Response
      return new Response('Asset unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    })()
  );
});
