// A module, not a script: otherwise the declaration below replaces the JSX types of react/jsx-runtime instead of extending them.
export {};

// Allow any custom tags, e.g. <root />, <wrapper />, <asdf />.
declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

// Suppress react errors for custom tags.
const _error = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("is unrecognized in this browser")) return;
  _error(...args);
};
