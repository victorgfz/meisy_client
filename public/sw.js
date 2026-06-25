const DEFAULT_NOTIFICATION_URL = '/dashboard/orders';

self.addEventListener('push', (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = payload.title || 'Meisy';
  const url = payload.url || DEFAULT_NOTIFICATION_URL;

  const options = {
    body: payload.message || 'Você tem uma nova atualização.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      url,
      type: payload.type,
      orderId: payload.orderId,
      dateOfArrival: Date.now(),
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || DEFAULT_NOTIFICATION_URL;
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const matchingClient = clientList.find((client) => client.url === absoluteUrl);

      if (matchingClient) {
        return matchingClient.focus();
      }

      return clients.openWindow(absoluteUrl);
    })
  );
});
