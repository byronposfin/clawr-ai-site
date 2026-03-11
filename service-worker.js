/**
 * CLAWR.AI Service Worker
 * PWA offline support, background sync, push notifications
 * Version: 1.0.0
 */

const CACHE_NAME = 'clawr-ai-v1';
const STATIC_CACHE = 'clawr-static-v1';
const DYNAMIC_CACHE = 'clawr-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// ─── Install ───────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[CLAWR SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[CLAWR SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('http')));
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate ──────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[CLAWR SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => {
            console.log('[CLAWR SW] Removing old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and Chrome extensions
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.hostname === 'fonts.gstatic.com' || url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Network-first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for static assets
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Stale-while-revalidate for HTML
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// ─── Strategy: Cache First ─────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return offlineFallback();
  }
}

// ─── Strategy: Network First ───────────────────────────────────────────────
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    return cached || offlineFallback();
  }
}

// ─── Strategy: Stale While Revalidate ─────────────────────────────────────
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached || offlineFallback());

  return cached || fetchPromise;
}

// ─── Offline Fallback ──────────────────────────────────────────────────────
function offlineFallback() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CLAWR.AI — Offline</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #0A0A0F;
          color: #fff;
          font-family: Inter, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
          padding: 2rem;
        }
        .logo { font-size: 3rem; font-weight: 900; background: linear-gradient(135deg, #4361EE, #E79039); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; }
        .msg { color: rgba(255,255,255,0.6); font-size: 1.1rem; margin-bottom: 2rem; }
        .pulse { width: 80px; height: 80px; border-radius: 50%; background: rgba(67,97,238,0.2); border: 2px solid #4361EE; margin: 0 auto 2rem; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        button { background: linear-gradient(135deg,#4361EE,#E79039); color:#fff; border:none; padding:0.8rem 2rem; border-radius:8px; font-size:1rem; cursor:pointer; }
      </style>
    </head>
    <body>
      <div>
        <div class="pulse"></div>
        <div class="logo">CLAWR.AI</div>
        <p class="msg">Your AI dealmaker is standing by.<br>Reconnect to resume operations.</p>
        <button onclick="window.location.reload()">Retry Connection</button>
      </div>
    </body>
    </html>`,
    {
      headers: { 'Content-Type': 'text/html' },
      status: 200
    }
  );
}

// ─── Push Notifications ────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Your AI agent has an update',
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-72.svg',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'view', title: 'View Now' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    tag: data.tag || 'clawr-notification',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'CLAWR.AI', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ─── Background Sync ───────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pipeline') {
    event.waitUntil(syncPipelineData());
  }
  if (event.tag === 'sync-agent-actions') {
    event.waitUntil(syncAgentActions());
  }
});

async function syncPipelineData() {
  console.log('[CLAWR SW] Syncing pipeline data...');
  // Implement when backend API is available
}

async function syncAgentActions() {
  console.log('[CLAWR SW] Syncing agent actions...');
  // Implement when backend API is available
}
