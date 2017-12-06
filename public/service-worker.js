this.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('assets-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/js/index.js',
        '/css/styles.css',
        '/assets/lock.svg',
        '/assets/unlock.svg'
      ]);
    })
  );
});

this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

this.addEventListener('actiavte', (event) => {
  let cacheWhiteList = ['assets-v1'];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheWhiteList.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
