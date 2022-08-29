const APP_PREFIX = 'Budget-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('static').then(function(cache) {
            return cache.addAll([
                '/',
                './index.html',
                './js/index.js',
                './js/idb.js',
                './css/styles.css',
                './icons/icon-192x192.png',
                './icons/icon-512x512.png',
                './icons/icon-72x72.png',
                './icons/icon-96x96.png',
                './icons/icon-128x128.png',
                './icons/icon-144x144.png',
                './icons/icon-152x152.png',
                './icons/icon-384x384.png',
                './manifest.json',
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
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(request) {
            if (request) {
                return request;
            } else {
                return fetch(event.request).then(function(response) {
                    return caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request.url, response.clone());
                        return fetch;
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

/*
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
*/