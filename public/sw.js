const CACHE_NAME = 'my-cache-v1'; // Название кэша
const OFFLINE_URL = '/offline'; // Путь к офлайн странице

// Список файлов для кэширования
const FILES_TO_CACHE = [
    OFFLINE_URL,
    // Добавьте другие ресурсы, которые хотите кэшировать
    // Например:
    // '/css/styles.css',
    // '/js/script.js',
];

// Событие установки Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker установлен');

    // Кэшируем файлы при установке
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Кэширование офлайн страницы');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Событие активации Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker активирован');

    // Удаляем старые кэши
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Удаляем старый кэш:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Событие перехвата запросов
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match('/offline'); // Путь к вашему компоненту
        })
    );
});
