const CACHE_NAME = 'my-app-v2';
const OFFLINE_URL = '/offline.html'; // Или ваш HTML-файл для отображения оффлайн

const RESOURCES_TO_CACHE = [
    OFFLINE_URL,
    '/image/error-text.png',
    '/image/error-capibara.png',
    // Другие ресурсы, которые нужно кэшировать
];

// Устанавливаем Service Worker и кэшируем ресурсы
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(RESOURCES_TO_CACHE);
        })
    );
});

// Обновляем кэш при каждом активации Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Удаляем кэши, которые не совпадают с текущим CACHE_NAME
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Перехватываем запросы и возвращаем кэшированные ресурсы
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Если ресурс найден в кэше, возвращаем его
            if (response) {
                return response;
            }

            // Если ресурс не найден в кэше, выполняем запрос
            return fetch(event.request).then((networkResponse) => {
                // Проверяем, что запрос был успешным
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse; // Возвращаем сетевой ответ, если это не базовый запрос
                }

                // Кэшируем ответ для будущего использования
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone()); // Сохраняем ответ в кэше
                    return networkResponse; // Возвращаем оригинальный ответ
                });
            }).catch(() => {
                // Если произошла ошибка, возвращаем страницу оффлайна для навигационных запросов
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});
