import "@total-typescript/ts-reset";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { join } from "node:path";

const publik = join(import.meta.dirname!, "./public");
const headers = secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'"],
    connectSrc: [
      "'self'",
      (c) => {
        const url = new URL(c.req.url);
        const protocol = c.req.header("x-forwarded-proto") ?? url.protocol.slice(0, -1);
        const hostname = c.req.header("x-forwarded-host") ?? url.hostname;
        return `${protocol}://${hostname}:5001`;
      }
    ],
    styleSrc: ["'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:"],
    baseUri: ["'none'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"]
  },
  strictTransportSecurity: false,
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: [],
    usb: [],
    bluetooth: [],
    serial: [],
    hid: [],
    midi: [],
    magnetometer: [],
    gyroscope: [],
    accelerometer: [],
    xrSpatialTracking: [],
    screenWakeLock: [],
    fullscreen: [],
    clipboardRead: [],
    clipboardWrite: [],
    autoplay: [],
    encryptedMedia: [],
    pictureInPicture: [],
    webShare: [],
    browsingTopics: []
  }
});

const hono = new Hono().use(headers);

// All assets are cached except for 404.
hono.get("/assets/*", async (c) => {
  const path = new URL(c.req.url).pathname;
  // Bun.file sets Content-Type from the extension; a missing file is answered with 404.
  const file = Bun.file(join(publik, path));
  const res = (await file.exists()) ? new Response(file) : new Response(null, { status: 404 });
  res.headers.set("Cache-Control", res.status === 404 ? "no-store" : "public, max-age=31536000, immutable");
  return res;
});

// All other requests return index.html, which is not cached.
hono.get("*", async () => {
  const file = Bun.file(join(publik, "index.html"));
  const res = (await file.exists()) ? new Response(file) : new Response(null, { status: 404 });
  res.headers.set("Cache-Control", "no-cache");
  return res;
});

// Plain HTTP only: the conductor terminates TLS on 443 and redirects port 80.
const server = Bun.serve({
  port: 5000,
  fetch: hono.fetch
});
console.log(JSON.stringify({ type: "LISTENING", port: server.port }));
