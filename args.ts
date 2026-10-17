type Mode = "production" | "development";

export default {
  database: {
    host: "localhost",
    name: "main",
    user: "postgres"
  },
  betterstack: {
    dsn: ""
  },
  mode: "development" as Mode
};
