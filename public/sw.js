var CACHE_STATIC = 'static-v16';
var CACHE_DYNAMIC = 'dynamic-v5';
var CACHE_STATIC_FILES = [
  '/',
  '/offline.html',
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
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

function isInArray(string, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === string) {
      return true;
    }
  }
  return false;
}

// static cache of apps shell strategy
self.addEventListener('install', function(event) {
  // add static pages to cache using cache api
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function(cache) {
      // add take url, send request and check the response
      cache.addAll(CACHE_STATIC_FILES);
    })
  );
});

// deleting the old cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    // do not procede return untill all this is done (outdated caches are removed)
    caches.keys().then(function(keyList) {
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

//cache then network  update strategy  for a specific urls - part 2
self.addEventListener('fetch', function(event) {
  var url = 'https://httpbin.org/get';
  if (event.request.url.indexOf(url) > -1) {
    // on this fetch event save response in cache for this url
    event.respondWith(
      caches.open(CACHE_DYNAMIC).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
  } else if (isInArray(event.request.url, CACHE_STATIC_FILES)) {
    // use cache only for files which for sure are in static cache
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response;
      })
    );
  } else {
    // use cache with network fallback strategy
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
                return caches.open(CACHE_STATIC).then(function(cache) {
                  // showing fallback offline page for a specific url
                  if (event.request.url.indexOf('/help') > -1) {
                    return cache.match('/offline.html');
                  }
                });
              })
          );
        }
      })
    );
  }
});

//cache with network fallback strategy
// self.addEventListener('fetch', function(event) {
//   // on every fetch event check if you have it in cache, if yes take from cache, if no, fetch from server
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       if (response) {
//         return response;
//       } else {
//         return (
//           fetch(event.request)
//             // and these that you fetch from server keep in cache as well
//             .then(function(responseFromServer) {
//               return caches.open(CACHE_DYNAMIC).then(function(cache) {
//                 cache.put(event.request.url, responseFromServer.clone()); // put do not check response on its own, clone because response used here is consumed
//                 return responseFromServer;
//               });
//             })
//             .catch(function(error) {
//               return caches.open(CACHE_STATIC).then(function(cache) {
//                 return cache.match('/offline.html');
//               });
//             })
//         );
//       }
//     })
//   );
// });

// cache only strategy
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response;
//     })
//   );
// });

// network only strategy
// self.addEventListener('fetch', function(event) {
//   event.respondWith(fetch(event.request));
// });

//network first than cache strategy
// self.addEventListener('fetch', function(event) {
//   // on every fetch event check server, if server do not respond, check cache
//   event.respondWith(
//     fetch(event.request).catch(function(err) {
//       caches.match(event.request).then(function(response) {
//         if (response) {
//           return response;
//         }
//       });
//     })
//   );
// });
