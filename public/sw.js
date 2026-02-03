self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// 🔥 ENG MUHIMI — FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
