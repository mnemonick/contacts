import "@total-typescript/ts-reset";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { timeout } from "hono/timeout";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import shift from "postgres-shift";
import createContact from "%/handlers/create-contact.ts";
import createUser from "%/handlers/create-user.ts";
import getUser from "%/handlers/get-user.ts";
import removeContact from "%/handlers/remove-contact.ts";
import updateContact from "%/handlers/update-contact.ts";
import sql from "%/utils/sql.ts";

// All handlers are POST requests with verb in URL instead of method.
const hono = new Hono()
  .use(cors({ maxAge: 86_400 }))
  .use(bodyLimit({ maxSize: 64 * 1024 }))
  .use(timeout(10_000, new HTTPException(504, { message: "TIMEOUT" })))
  .post("/get-user", getUser)
  .post("/create-user", createUser)
  .post("/create-contact", createContact)
  .post("/update-contact", updateContact)
  .post("/remove-contact", removeContact)
  .notFound((c) => c.json({ error: "NOT_FOUND" }))
  .onError((err, c) => {
    return c.json({ error: err instanceof HTTPException ? err.message : "INTERNAL" });
  });

await shift({
  sql,
  path: resolve(import.meta.dirname!, "./migrations"),
  before: ({ migration_id, name }) => console.log(JSON.stringify({ type: "MIGRATING", migration_id, name }))
});

const production = process.platform === "linux" && !process.env.CI;

const tls = production
  ? {
      cert: readFileSync("/etc/letsencrypt/live/koshelko.com/fullchain.pem", "utf8"),
      key: readFileSync("/etc/letsencrypt/live/koshelko.com/privkey.pem", "utf8")
    }
  : undefined;

const server = Bun.serve({ port: 5001, tls, fetch: hono.fetch });

console.log(JSON.stringify({ type: "LISTENING", port: server.port }));

// Windows supports only SIGINT (Ctrl+C); on the server systemd stops the process with SIGTERM.
const signal = process.platform === "win32" ? "SIGINT" : "SIGTERM";

process.on(signal, async () => {
  console.log(JSON.stringify({ type: "SHUTDOWN", signal }));
  await server.stop();
  await sql.end({ timeout: 5 });
  process.exit(0);
});

// Export types for frontend.
export type AppType = typeof hono;
