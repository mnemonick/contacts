import "@total-typescript/ts-reset";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { serveFile } from "@std/http/file-server";
import { join } from "@std/path";
import args from "~/args.ts";

const root = join(import.meta.dirname!, "./public");
const dsn = args.betterstack.dsn;

// TLS only when args.tls is set (production). Locally the server runs over plain HTTP.
const tls = args.tls
	? { cert: Deno.readTextFileSync(args.tls.cert), key: Deno.readTextFileSync(args.tls.key) }
	: null;

// The DSN has the form https://<key>@<host>/<project>. CSP violations go to the Sentry-compatible security endpoint.
const reporting = dsn ? new URL(dsn) : null;
const reportUrl = reporting
	? `${reporting.origin}/api${reporting.pathname}/security/?sentry_key=${reporting.username}`
	: null;

// Every browser feature the site does not use is disabled.
const permissions = {
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
};

// Security headers for every response. The API address in connect-src depends on the host of the request.
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
			...(reporting ? [reporting.origin] : [])
		],
		styleSrc: ["'unsafe-inline'", "https://fonts.googleapis.com"],
		fontSrc: ["https://fonts.gstatic.com"],
		imgSrc: ["'self'", "data:"],
		baseUri: ["'none'"],
		formAction: ["'self'"],
		frameAncestors: ["'none'"],
		...(reportUrl ? { reportUri: reportUrl, reportTo: "csp" } : {})
	},
	...(reportUrl ? { reportingEndpoints: [{ name: "csp", url: reportUrl }] } : {}),
	permissionsPolicy: permissions,
	strictTransportSecurity: tls ? "max-age=31536000" : false
});

const hono = new Hono();

hono.use(headers);

// Asset names contain a content hash (see vite.config.ts), so they can be cached forever.
// A missing asset is not cached, otherwise a request for an old hash during a deployment would keep the 404 for a year.
hono.get("/assets/*", async (c) => {
	const path = new URL(c.req.url).pathname;
	const res = await serveFile(c.req.raw, join(root, path));
	res.headers.set("Cache-Control", res.status === 404 ? "no-store" : "public, max-age=31536000, immutable");
	return res;
});

hono.get("*", async (c) => {
	const res = await serveFile(c.req.raw, join(root, "index.html"));
	res.headers.set("Cache-Control", "no-cache");
	return res;
});

Deno.serve({
	...tls,
	port: 443,
	automaticCompression: true,
	onListen: (info) => console.log({ type: "LISTENING", port: info.port, tls: tls !== null }),
	handler: hono.fetch
});
