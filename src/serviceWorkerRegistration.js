// Этот файл основан на стандартном serviceWorkerRegistration.js из Create React App
// Документация: https://cra.link/PWA

// В production мы хотим регистрировать service worker для поддержки PWA
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] — IPv6 localhost
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 — IPv4 localhost
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Проверяем, существует ли service worker
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('Это приложение обслуживается сервис-воркером.');
        });
      } else {
        // Регистрируем service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Новое обновление доступно
              console.log('Доступно новое обновление.');
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Контент закеширован для офлайн-работы
              console.log('Контент закеширован для офлайн-работы.');
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Ошибка при регистрации service worker:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // Убедимся, что service worker существует и JS-файл получен
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Нет service worker — удаляем регистрацию
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker найден — регистрируем
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Нет подключения к интернету. Приложение работает в офлайн-режиме.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
} 