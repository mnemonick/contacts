import "@total-typescript/ts-reset";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { timeout } from "hono/timeout";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as Sentry from "@sentry/bun";
import shift from "postgres-shift";
import createContact from "%/handlers/create-contact.ts";
import createUser from "%/handlers/create-user.ts";
import getUser from "%/handlers/get-user.ts";
import removeContact from "%/handlers/remove-contact.ts";
import updateContact from "%/handlers/update-contact.ts";
import sql from "%/utils/sql.ts";
import args from "~/args.ts";
import secrets from "%/secrets.ts";

// All handlers are POST requests with verb in URL instead of method.
const hono = new Hono()
  .use(cors({ maxAge: 86_400 }))
  .use(logger())
  .use(bodyLimit({ maxSize: 64 * 1024 }))
  .use(timeout(10_000, new HTTPException(504, { message: "TIMEOUT" })))
  .post("/get-user", getUser)
  .post("/create-user", createUser)
  .post("/create-contact", createContact)
  .post("/update-contact", updateContact)
  .post("/remove-contact", removeContact)
  .notFound((c) => c.json({ error: "NOT_FOUND" }))
  .onError((err, c) => {
    console.error(err);
    Sentry.captureException(err);
    // The only HTTPException thrown is the timeout; anything else is a bug.
    return c.json({ error: err instanceof HTTPException ? err.message : "INTERNAL" });
  });

// Errors are sent to Better Stack only in production.
Sentry.init({
  dsn: args.betterstack,
  enabled: args.mode === "production"
});

// Applies new migrations from backend/migrations in a single transaction.
await shift({
  sql,
  path: resolve(import.meta.dirname!, "./migrations"),
  before: ({ migration_id, name }) => console.log({ type: "MIGRATING", migration_id, name })
});

// TLS only when args.tls is set (production). Locally the server runs over plain HTTP.
const tls = secrets.tls
  ? { cert: readFileSync(secrets.tls.cert, "utf8"), key: readFileSync(secrets.tls.key, "utf8") }
  : undefined;

// Start listening.
const server = Bun.serve({
  tls,
  port: 2001,
  fetch: hono.fetch
});
console.log({ type: "LISTENING", port: server.port, tls: tls !== undefined });

// Windows supports only SIGINT (Ctrl+C); on the server rc.d stops the process with SIGTERM.
const signal = process.platform === "win32" ? "SIGINT" : "SIGTERM";

// Finishes in-flight requests, then closes the database pool.
process.on(signal, async () => {
  console.log({ type: "SHUTDOWN", signal });
  await server.stop();
  await sql.end({ timeout: 5 });
  process.exit(0);
});

// Export types for frontend.
export type AppType = typeof hono;
