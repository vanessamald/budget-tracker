const APP_PREFIX = 'Budget-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('static').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/public/js/index.js',
                '/public/js/idb.js',
                '/public/css/styles.css',
                '/public/icons/icon-192x192.png',
                '/public/icons/icon-512x512.png',
                '/public/icons/icon-72x72.png',
                '/public/icons/icon-96x96.png',
                '/public/icons/icon-128x128.png',
                '/public/icons/icon-144x144.png',
                '/public/icons/icon-152x152.png',
                '/public/icons/icon-384x384.png',
            ]);
        })
    );
}
);

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith(APP_PREFIX) && cacheName != CACHE_NAME;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
}   
);

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            } else {
                return fetch(event.request).then(function(response) {
                    return caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request.url, response.clone());
                        return response;
                    }
                    );
                }
                );
            }
        }
        )
    );
}
);

caches.match(event.request).then (function (response) {
    if (response) {
        return response;
    } else {
        return fetch (event.request).then (function (response) {
            return caches.open (CACHE_NAME).then (function (cache) {
                cache.put (event.request.url, response.clone ());
                return response;
            }
            );
        }
        );
    }
}
);

