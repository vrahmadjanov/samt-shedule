/* eslint-disable no-restricted-globals */
// Базовый service worker для поддержки PWA (offline, кэширование)
// Этот файл будет автоматически обработан Workbox при сборке

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// self.__WB_MANIFEST — специальная переменная, которую CRA/Workbox заменяет на список файлов для кэширования
// eslint-disable-next-line no-underscore-dangle
const ignored = self.__WB_MANIFEST; 