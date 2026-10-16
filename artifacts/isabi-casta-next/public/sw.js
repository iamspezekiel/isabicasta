/*
 * IsabiCasta service worker.
 *
 * The app tells the user it works offline, so this has to be real rather than a
 * badge. Three strategies, chosen per request type:
 *
 *  - the app shell is precached on install, which gives an offline first paint;
 *  - navigation is network-first with a cached fallback, so a deep link still
 *    opens without a connection;
 *  - build assets (which carry hashed names that cannot be known here) use
 *    stale-while-revalidate, serving from cache instantly and refreshing behind
 *    the scenes.
 */

const CACHE = "isabi-v1";
const READY_MESSAGE = "isabi-cache-ready";

const SHELL = [
  "/",
  "/coin",
  "/lots",
  "/history",
  "/local",
  "/manifest.webmanifest",
  "/icon.svg",
];

/*
 * Each shell entry is cached on its own rather than with `addAll`, which is
 * all-or-nothing: a single failing URL would otherwise leave the cache empty and
 * the app would never be able to claim it works offline.
 */
async function precacheShell() {
  const cache = await caches.open(CACHE);
  const results = await Promise.allSettled(
    SHELL.map(async (path) => {
      const response = await fetch(path, { cache: "reload" });
      if (!response.ok) throw new Error(`Failed to precache ${path}`);
      await cache.put(path, response);
    }),
  );

  const cached = results.filter((result) => result.status === "fulfilled").length;
  return cached >= 1;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    precacheShell()
      .catch(() => false)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => name !== CACHE).map((name) => caches.delete(name)),
      );
      await self.clients.claim();

      // Let any open page re-evaluate offline readiness without a reload.
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({ type: READY_MESSAGE });
      }
    })(),
  );
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isStaticAsset(pathname) {
  return (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/icon.svg" ||
    pathname.startsWith("/fonts/") ||
    /\.(?:css|js|woff2?|png|jpg|jpeg|svg|webp|avif|ico)$/.test(pathname)
  );
}

async function networkFirst(request, fallbackKey) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(fallbackKey ?? request, response.clone());
    }
    return response;
  } catch {
    const cached =
      (await caches.match(fallbackKey ?? request)) ?? (await caches.match("/"));
    if (cached) return cached;
    throw new Error("offline and not cached");
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached ?? (await network) ?? Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (!isSameOrigin(url)) return;

  if (request.mode === "navigation") {
    event.respondWith(networkFirst(request, url.pathname));
    return;
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(
    (async () => {
      try {
        return await fetch(request);
      } catch {
        const cached = await caches.match(request);
        return cached ?? Response.error();
      }
    })(),
  );
});
