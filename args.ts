type SentryConfig = { url: string; org: string; project: string; authToken: string };
type TLSConfig = { cert: string; key: string };
type Mode = "production" | "development";

export default {
  database: {
    host: "localhost",
    name: "main",
    user: "postgres",
    password: ""
  },
  betterstack: {
    dsn: ""
  },
  sentry: undefined as SentryConfig | undefined,
  tls: undefined as TLSConfig | undefined,
  mode: "development" as Mode
};
