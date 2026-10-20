import "@total-typescript/ts-reset";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { secureHeaders } from "hono/secure-headers";
import { join } from "node:path";
import args from "~/args.ts";

const publik = join(import.meta.dirname!, "./public");

// Bun.file sets Content-Type from the extension; a missing file is answered with 404.
async function serveFile(path: string) {
  const file = Bun.file(path);
  return (await file.exists()) ? new Response(file) : new Response(null, { status: 404 });
}
const dsn = args.betterstack ? new URL(args.betterstack) : undefined;
const betterstack = dsn ? `${dsn.origin}/api${dsn.pathname}/security/?sentry_key=${dsn.username}` : undefined;
const headers = secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'"],
    connectSrc: [
      "'self'",
      // Behind the conductor the public scheme and host come from X-Forwarded-*; req.url shows 127.0.0.1.
      (c) => {
        const url = new URL(c.req.url);
        const protocol = c.req.header("x-forwarded-proto") ?? url.protocol.slice(0, -1);
        const hostname = c.req.header("x-forwarded-host") ?? url.hostname;
        return `${protocol}://${hostname}:2001`;
      },
      ...(dsn ? [dsn.origin] : [])
    ],
    styleSrc: ["'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:"],
    baseUri: ["'none'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    ...(betterstack ? { reportUri: betterstack, reportTo: "csp" } : {})
  },
  reportingEndpoints: betterstack ? [{ name: "csp", url: betterstack }] : undefined,
  // The conductor sends HSTS for the public site.
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

const hono = new Hono().use(headers).use(compress());

// All assets are cached except for 404.
hono.get("/assets/*", async (c) => {
  const path = new URL(c.req.url).pathname;
  const res = await serveFile(join(publik, path));
  res.headers.set("Cache-Control", res.status === 404 ? "no-store" : "public, max-age=31536000, immutable");
  return res;
});

// All other requests return index.html, which is not cached.
hono.get("*", async () => {
  const res = await serveFile(join(publik, "index.html"));
  res.headers.set("Cache-Control", "no-cache");
  return res;
});

// Plain HTTP only: the conductor terminates TLS on 443 and redirects port 80.
const server = Bun.serve({
  port: 3000,
  fetch: hono.fetch
});
console.log({ type: "LISTENING", port: server.port });
