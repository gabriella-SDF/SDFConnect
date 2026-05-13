// Bump this version when shipping breaking changes to force cache refresh.
const CACHE = 'sdf-connect-v2'

const PRECACHE = [
  '/',
  '/manifest.webmanifest',
  '/logo-white.png',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/sf-hero.jpg',
  '/lobby-floorplan.jpg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  // Don't touch Supabase / external API calls.
  if (url.hostname.endsWith('supabase.co')) return
  if (url.hostname.endsWith('supabase.io')) return
  if (url.origin !== self.location.origin) return

  // Navigation: network-first so users get fresh code, fall back to cached shell.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put('/', clone))
          return res
        })
        .catch(() => caches.match('/'))
    )
    return
  }

  // Static assets: cache-first with background revalidate.
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(req, clone))
        }
        return res
      }).catch(() => cached)
      return cached || fetchPromise
    })
  )
})
