/* Zylo Solution admin service worker – handles Web Push notifications. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Zylo Solution", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Zylo Solution";
  const options = {
    body: data.body || "",
    icon: "/icon.png",
    badge: "/icon.png",
    tag: data.tag || undefined,
    renotify: Boolean(data.tag),
    requireInteraction: true,
    data: { url: data.url || "/admin/bookings" },
  };
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      // Tell any open admin tabs to refresh their bell immediately.
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) =>
        clients.forEach((c) => c.postMessage({ type: "booking:new" })),
      ),
    ]),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/admin/bookings", self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.navigate(target).then((c) => (c || client).focus());
        }
      }
      return self.clients.openWindow(target);
    }),
  );
});
