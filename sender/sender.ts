import "@total-typescript/ts-reset";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { serveFile } from "@std/http/file-server";
import { join } from "@std/path";
import args from "~/args.ts";
import secrets from "%/secrets.ts";

const publik = join(import.meta.dirname!, "./public");
const dsn = args.betterstack.dsn ? new URL(args.betterstack.dsn) : undefined;
const url = dsn ? `${dsn.origin}/api${dsn.pathname}/security/?sentry_key=${dsn.username}` : undefined;
const headers = secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'"],
    connectSrc: [
      "'self'",
      (c) => {
        const { protocol, hostname } = new URL(c.req.url);
        return `${protocol}//${hostname}:2001`;
      },
      ...(dsn ? [dsn.origin] : [])
    ],
    styleSrc: ["'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:"],
    baseUri: ["'none'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    ...(url ? { reportUri: url, reportTo: "csp" } : {})
  },
  reportingEndpoints: url ? [{ name: "csp", url }] : undefined,
  strictTransportSecurity: secrets.tls ? "max-age=31536000" : false,
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
  const res = await serveFile(c.req.raw, join(publik, path));
  res.headers.set("Cache-Control", res.status === 404 ? "no-store" : "public, max-age=31536000, immutable");
  return res;
});

// All other requests return index.html, which is not cached.
hono.get("*", async (c) => {
  const res = await serveFile(c.req.raw, join(publik, "index.html"));
  res.headers.set("Cache-Control", "no-cache");
  return res;
});

Deno.serve({
  ...secrets.tls,
  port: tls ? 443 : 2000,
  automaticCompression: true,
  onListen: (info) => console.log({ type: "LISTENING", port: info.port, tls: secrets.tls !== undefined }),
  handler: hono.fetch
});

// Plain HTTP on port 80 is redirected to HTTPS. Only in production, where TLS is configured.
if (secrets.tls !== undefined) {
  Deno.serve({
		port: 80,
		onListen: ({port}) => console.log({ type: "LISTENING", port }),
		handler: (req) => Response.redirect(req.url.replace(/^http:/, "https:"), 301)
	});
}
