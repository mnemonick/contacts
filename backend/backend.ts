import "@total-typescript/ts-reset";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { timeout } from "hono/timeout";
import { resolve } from "@std/path";
import * as Sentry from "@sentry/deno";
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
  ? { cert: Deno.readTextFileSync(secrets.tls.cert), key: Deno.readTextFileSync(secrets.tls.key) }
  : undefined;

// Start listening.
const server = Deno.serve({
  ...tls,
  port: 2001,
  handler: hono.fetch,
  onListen: (info) => console.log({ type: "LISTENING", port: info.port, tls: tls !== undefined })
});

// Windows supports only SIGINT (Ctrl+C); on the server rc.d stops the process with SIGTERM.
const signal = Deno.build.os === "windows" ? "SIGINT" : "SIGTERM";

// Finishes in-flight requests, then closes the database pool.
Deno.addSignalListener(signal, async () => {
  console.log({ type: "SHUTDOWN", signal });
  await server.shutdown();
  await sql.end({ timeout: 5 });
  Deno.exit(0);
});

// Export types for frontend.
export type AppType = typeof hono;