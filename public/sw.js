var CACHE_STATIC = 'static-v3';
var CACHE_DYNAMIC = 'dynamic-v2';

self.addEventListener('install', function(event) {
  // add static pages to cache using cache api
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function(cache) {
      cache.addAll([
        // add take url, send request and check the response
        '/',
        '/index.html',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/js/fetch.js',
        '/src/js/promise.js',
        '/src/js/material.min.js',
        'src/css/app.css',
        'src/css/feed.css',
        'src/images/main-image.jpg',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
      ]);
    })
  );
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    // do not procede return untill all this is done (outdated caches are removed)
    cache.keys().then(function(keyList) {
      // take cache names and through the array of them
      return Promise.all(
        // wait for all promises that gona be return
        keyList.map(function(key) {
          if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC) {
            return caches.delete(key); // remove outdated cache promise
          }
        })
      );
    })
  );
  return self.clients.claim();
});
self.addEventListener('fetch', function(event) {
  // on every fetch event check if you have it in cache, if yes take from cache, if no, fetch from server
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return (
          fetch(event.request)
            // and these that you fetch from server keep in cache as well
            .then(function(responseFromServer) {
              return caches.open(CACHE_DYNAMIC).then(function(cache) {
                cache.put(event.request.url, responseFromServer.clone()); // put do not check response on its own, clone because response used here is consumed
                return responseFromServer;
              });
            })
            .catch(function(error) {
              console.log(error);
            })
        );
      }
    })
  );
});
