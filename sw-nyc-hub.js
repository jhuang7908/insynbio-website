const CACHE_NAME = 'us-chinese-life-hub-v39';
const ASSETS = [
  '/',
  '/us-chinese-life-hub.html',
  '/latest.html',
  '/channels.html',
  '/deals.html',
  '/yellow-pages.html',
  'https://cdn.jsdelivr.net/npm/lunar-javascript/lunar.min.js'
];

// Install Service Worker and cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch assets with Stale-While-Revalidate strategy
self.addEventListener('fetch', event => {
  // Only handle GET requests and same-origin or specific CDN requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isLivelihoodData = url.pathname.includes('livelihood_items.json') || url.pathname.includes('deals_items.json');

  // For dynamic data, use Network-First to ensure freshness, fall back to cache if offline
  if (isLivelihoodData) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For HTML and libraries, use Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});

// Handle Push Notifications
self.addEventListener('push', event => {
  let data = { title: '美东华人生活圈', body: '您关注的频道有新的社区动态更新！' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: '美东华人生活圈', body: event.data.text() };
    }
  }
  const options = {
    body: data.body,
    icon: 'https://img.icons8.com/color/192/000000/china.png',
    badge: 'https://insynbio.com/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/us-chinese-life-hub.html'
    }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle Notification Click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      const targetUrl = event.notification.data.url;
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
