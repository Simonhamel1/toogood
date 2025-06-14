self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('reservation-store').then(function(cache) {
      return cache.addAll([
        '/reservation.html',
        '/reservation.css',
        // Ajoute d'autres fichiers si besoin
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
}); 