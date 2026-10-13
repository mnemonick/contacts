import { hc } from "hono/client";
import type { AppType } from "%/backend.ts";

// The backend listens on port 2001 of the same host that serves the site.
export default hc<AppType>(`${location.protocol}//${location.hostname}:2001`);
