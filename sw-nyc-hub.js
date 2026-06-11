// Service Worker for 美东华人生活圈 — Web Push
const CACHE = 'nyc-hub-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || '美东华人生活圈 — 每日更新';
  const body  = data.body  || '今日纽约社区最新民生信息已更新，点击查看。';
  const icon  = data.icon  || '/favicon.ico';
  const url   = data.url   || '/us-chinese-life-hub.html';

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge: icon,
      data: { url },
      tag: 'nyc-daily',
      renotify: false,
      requireInteraction: false,
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/us-chinese-life-hub.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      for (const c of cs) {
        if (c.url.includes('us-chinese-life-hub') && 'focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});
