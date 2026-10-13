import postgres from "postgres";
import args from "~/args.ts";

const sql = postgres({
  // The port is the PostgreSQL default 5432.
  host: args.database.host,
  database: args.database.name,
  username: args.database.user,
  password: args.database.password,
  // Matches the HTTP timeout in backend.ts: after a timeout the query is canceled, not left running.
  connection: { statement_timeout: 10_000 },
  // Turns snake_case columns into camelCase keys (contact_id -> contactId).
  transform: postgres.camel
});

export default sql;
