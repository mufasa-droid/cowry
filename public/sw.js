// public/sw.js: Hand-written lightweight service worker for BRT Lagos demo
const CACHE_NAME = "brt-demo-v1";

const PRECACHE_URLS = [
  "/",
  "/plan",
  "/about",
  "/offline",
  "/manifest.webmanifest",
  // Demo places
  "/place/ayobo",
  "/place/iyana-ipaja",
  "/place/ikeja",
  "/place/oshodi",
  "/place/abule-egba",
  "/place/obalende",
  // Demo routes
  "/route/ikeja-ayobo",
  "/route/ayobo-ikeja",
  "/route/ikeja-iyana-ipaja",
  "/route/oshodi-ayobo",
  "/route/iyana-ipaja-obalende",
  "/route/ikeja-obalende",
  "/route/iyana-ipaja-ikeja",
  "/route/ayobo-obalende",
  // App icons
  "/icons/192",
  "/icons/512",
  "/icons/maskable",
  "/icons/apple-touch-icon",
];

// Install: precache the app shell and core demo pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

// Activate: clean up outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Strategy depending on request type
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Strategy 1: Page Navigations (network-first, falling back to cache, then /offline)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const offlinePage = await caches.match("/offline");
          if (offlinePage) return offlinePage;
          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain" },
          });
        })
    );
    return;
  }

  // Strategy 2: Static Assets (_next/static, icons) -> Cache-first
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/"))
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Strategy 3: Other same-origin assets -> Network-first with cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});

