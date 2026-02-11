const CACHE_NAME = 'kobonz-v3-mobile';
const CACHE_TIMEOUT = 5000; // 5 seconds timeout for mobile networks

// Cache static assets for faster mobile loading
const urlsToCache = [
  '/manifest.json',
  '/favicon.svg',
  '/index.css',
  '/robots.txt',
  '/sitemap.xml'
];

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(err => {
        // Cache initialization failed - silent fail
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Don't cache HTML pages or API calls - always fetch fresh
  if (request.method !== 'GET' || 
      url.pathname.endsWith('.html') || 
      url.pathname === '/' ||
      url.hostname.includes('firebasestorage') ||
      url.hostname.includes('firestore') ||
      url.hostname.includes('googleapis')) {
    return event.respondWith(fetch(request));
  }
  
  // Cache-first strategy for static assets (CSS, JS, images) - better for mobile
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|webp|woff|woff2|ttf|otf)$/)) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // Update cache in background
          fetch(request).then(response => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }
        
        // Not in cache, fetch and cache
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          return new Response('Offline', { status: 503 });
        });
      })
    );
  } else {
    // Network-first for other requests with timeout
    event.respondWith(
      Promise.race([
        fetch(request).then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => caches.match(request)),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), CACHE_TIMEOUT)
        ).catch(() => caches.match(request))
      ]).catch(() => {
        return new Response('Offline', { status: 503 });
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  // Take control immediately
  event.waitUntil(
    Promise.all([
      // Clear old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});
