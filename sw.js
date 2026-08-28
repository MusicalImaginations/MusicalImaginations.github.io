/**
 * sw.js
 * ----------------------------------------------------------------------
 * Caches the app shell (HTML/CSS/JS/manifest/icons) so the player UI
 * loads with zero network connection. Local music files are NOT cached
 * here — they're read live from disk each session via the File System
 * Access API / folder picker, since they live outside the web origin
 * and (depending on size) shouldn't be duplicated into the Cache API.
 *
 * Bump CACHE_NAME whenever you change any shell file, so old clients
 * pick up the update instead of serving a stale cached copy.
 * ----------------------------------------------------------------------
 */

const CACHE_NAME = 'musical-imaginations-shell-v2';

const SHELL_FILES = [
  './',
  './musical_imaginations_player.html',
  './manifest.json',
  './sw.js',
  './styles.css',
  './theme.js',
  './uiWiring.js',
  './app.js',
  './icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Cache-first for shell files; network requests that aren't part of the
// shell (there shouldn't be many, since this is an offline-first app)
// fall through to the network and simply fail gracefully if offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        // No cached copy and no network — nothing sensible to return
        // for a non-shell request in a fully offline app.
        return new Response('Offline and resource not cached.', { status: 503 });
      });
    })
  );
});
