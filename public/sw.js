const CACHE_NAME = "sampi-pwa-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(["/", "/index.html", "/manifest.json"])),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // ❌ API so‘rovlar SW’dan o‘tmasin
  if (url.pathname.startsWith("/api")) {
    return;
  }

  // ✅ JS / CSS → DO NOT CACHE (MIME xatosi oldini oladi)
  if (
    req.destination === "script" ||
    req.destination === "style" ||
    req.destination === "font"
  ) {
    event.respondWith(fetch(req));
    return;
  }

  // ✅ HTML → cache first
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      caches.match("/index.html").then((cached) => {
        return cached || fetch(req);
      }),
    );
    return;
  }

  // default
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
