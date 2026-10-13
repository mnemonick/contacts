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
  sentry: {
    url: "",
    org: "",
    project: "",
    authToken: ""
  } as SentryConfig | null,
  tls: null as TLSConfig | null,
  mode: "development" as Mode
};
