self.addEventListener('install', function(event) {
  console.info('SW install ', event);
});
self.addEventListener('activate', function(event) {
  console.info('SW activate ', event);
  return self.clients.claim();
});
self.addEventListener('fetch', function(event) {
  console.info('SW fetch ', event.request);
  event.respondWith(fetch(event.request));
});
