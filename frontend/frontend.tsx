import "@total-typescript/ts-reset";
import { createRoot } from "react-dom/client";
import "#/utils/customs.ts";
import Router from "#/components/Router.tsx";
import useGlobalStore from "#/stores/useGlobalStore.ts";

if (!("Temporal" in globalThis)) {
  const { Temporal } = await import("@js-temporal/polyfill");
  Object.assign(globalThis, { Temporal });
}

if (navigator.language.startsWith("ru")) document.title = "Менеджер контактов";

const rootElement = document.querySelector("root") as HTMLElement;
const root = createRoot(rootElement, {
  onUncaughtError: (error) => {
    useGlobalStore.setState({ error: true });
    root.render(<Router />);
    console.error(error);
  },
  onRecoverableError: (error) => {
    console.error(error);
  }
});

root.render(<Router />);
