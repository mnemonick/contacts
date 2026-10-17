import postgres from "postgres";
import args from "~/args.ts";

const sql = postgres({
  host: args.database.host,
  database: args.database.name,
  username: args.database.user,
  connection: { statement_timeout: 10_000 },
  transform: postgres.camel
});

export default sql;
