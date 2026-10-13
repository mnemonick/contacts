import "@total-typescript/ts-reset";
import { createRoot } from "react-dom/client";
import "#/utils/customs.ts";
import "#/utils/defines.ts";
import Router from "#/components/Router.tsx";
import useGlobalStore from "#/stores/useGlobalStore.ts";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: BETTERSTACK,
  enabled: MODE === "production"
});

if (!("Temporal" in globalThis)) {
  const { Temporal } = await import("@js-temporal/polyfill");
  Object.assign(globalThis, { Temporal });
}

const rootElement = document.querySelector("root") as HTMLElement;
const root = createRoot(rootElement, {
  onUncaughtError: Sentry.reactErrorHandler((error) => {
    useGlobalStore.setState({ error: true });
    root.render(<Router />);
    console.error(error);
  }),
  onRecoverableError: Sentry.reactErrorHandler((error) => {
    console.error(error);
  })
});

root.render(<Router />);
