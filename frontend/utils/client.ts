import { hc } from "hono/client";
import type { AppType } from "%/backend.ts";

export default hc<AppType>(`${location.protocol}//${location.hostname}:5001`);
