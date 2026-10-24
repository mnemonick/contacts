import { createElement } from "react";

interface Lexemes {
  [key: string]: [string, string] | Lexemes;
}

type Messages<T> = {
  [K in keyof T]: T[K] extends [string, string] ? any : Messages<T[K]>;
};

const translate = <T extends Lexemes>(lexemes: T, path = ""): Messages<T> => {
  return new Proxy(lexemes, {
    get: (_, prop: string) => {
      const name = path ? `${path}.${prop}` : prop;
      const lexeme = lexemes[prop];

      if (lexeme === undefined) throw new Error(`LEXEME "${name}" NOT FOUND`);

      if (!Array.isArray(lexeme)) return translate(lexeme, name);

      const lang = navigator.language.split("-")[0];
      // Unsupported browser languages fall back to English.
      const index = lang === "ru" ? 1 : 0;

      const translation = lexeme[index];

      if (translation === undefined) throw new Error(`LEXEME "${name}" HAS NO TRANSLATION ${lang}`);

      const placeholders = (translation.match(/___/g) || []).length;
      const html = translation.includes("<") && translation.includes(">");

      // A lexeme with "___" placeholders becomes a function that takes one argument per placeholder.
      // A lexeme with HTML (e.g. <term>) is rendered as a span via innerHTML.
      if (placeholders) {
        return (...args: string[]) => {
          if (placeholders !== args.length) throw new Error(`LEXEME "${name}" HAS ${placeholders} PLACEHOLDERS`);

          let result = translation;
          for (const arg of args) result = result.replace("___", arg);

          const span = createElement("span", {
            style: { display: "inline" },
            // biome-ignore lint/security/noDangerouslySetInnerHtml: lexemes are trusted strings from the code, e.g. with <term>.
            dangerouslySetInnerHTML: { __html: result }
          });

          return html ? span : result;
        };
      }

      const span = createElement("span", {
        style: { display: "inline" },
        // biome-ignore lint/security/noDangerouslySetInnerHtml: lexemes are trusted strings from the code, e.g. with <term>.
        dangerouslySetInnerHTML: { __html: translation }
      });

      return html ? span : translation;
    }
  }) as unknown as Messages<T>;
};

export default translate;
