// Service Worker for MCNepal.fun - Optimized for Vercel

const CACHE_NAME = 'mcnepal-v1.0.0';
const STATIC_CACHE = 'mcnepal-static-v1.0.0';
const DYNAMIC_CACHE = 'mcnepal-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/css/animations.css',
    '/assets/js/main.js',
    '/assets/js/particles-config.js',
    '/assets/js/server-status.js',
    '/assets/js/store.js',
    '/assets/js/performance.js',
    '/assets/images/server_icon.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Network-first strategy for these patterns
const NETWORK_FIRST = [
    '/api/',
    'https://api.mcsrvstat.us/'
];

// Cache-first strategy for these patterns
const CACHE_FIRST = [
    '/assets/',
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/',
    'https://cdnjs.cloudflare.com/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('[SW] Static files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all pages
            self.clients.claim()
        ])
    );
});

// Fetch event - handle requests
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Choose strategy based on request URL
    if (shouldUseNetworkFirst(request.url)) {
        event.respondWith(networkFirst(request));
    } else if (shouldUseCacheFirst(request.url)) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Network-first strategy
async function networkFirst(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
        }
        
        throw error;
    }
}

// Cache-first strategy
async function cacheFirst(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        // Update cache in the background
        fetch(request).then(response => {
            if (response.ok) {
                cache.put(request, response);
            }
        }).catch(() => {
            // Ignore network errors
        });
        
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] Cache-first failed:', error);
        throw error;
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Fetch from network in the background
    const networkPromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => {
        // Ignore network errors
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Otherwise wait for network
    return networkPromise;
}

// Helper functions
function shouldUseNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function shouldUseCacheFirst(url) {
    return CACHE_FIRST.some(pattern => url.includes(pattern));
}

// Background sync for failed requests
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('[SW] Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Retry failed requests
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
        try {
            const response = await fetch(request);
            if (response.ok) {
                await cache.put(request, response);
            }
        } catch (error) {
            console.log('[SW] Background sync failed for:', request.url);
        }
    }
}

// Push notification handling
self.addEventListener('push', event => {
    if (!event.data) {
        return;
    }
    
    const data = event.data.json();
    const options = {
        body: data.body || 'New update from MCNepal.fun!',
        icon: '/assets/images/logo-192.png',
        badge: '/assets/images/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: data.primaryKey || 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Visit Server',
                icon: '/assets/images/action-explore.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/images/action-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'MCNepal.fun', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('https://www.mcnepal.fun')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the main page
        event.waitUntil(
            clients.openWindow('https://www.mcnepal.fun')
        );
    }
});

// Message handling
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
});

// Cache management utilities
async function cleanupCache() {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Remove old entries (older than 7 days)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const request of requests) {
        const response = await cache.match(request);
        const dateHeader = response.headers.get('date');
        
        if (dateHeader) {
            const responseDate = new Date(dateHeader).getTime();
            if (responseDate < oneWeekAgo) {
                await cache.delete(request);
            }
        }
    }
}

// Run cleanup periodically
setInterval(cleanupCache, 24 * 60 * 60 * 1000); // Daily cleanup