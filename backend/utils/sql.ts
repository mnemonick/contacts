import postgres from "postgres";

const sql = postgres({
  host: "localhost",
  database: "main",
  username: "postgres",
  connection: { statement_timeout: 10_000 },
  transform: postgres.camel
});

export default sql;
