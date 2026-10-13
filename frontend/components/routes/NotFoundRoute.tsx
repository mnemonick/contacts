import type { CSSProperties } from "react";
import useLayout from "#/hooks/useLayout.ts";
import colors from "#/utils/colors.ts";
import translate from "#/utils/translate.ts";

export default function () {
  const layout = useLayout();

  const $route: CSSProperties = {
    height: "100%",
    color: colors.text.strong,
    background: colors.gradient
  };

  const $notFound: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    left: layout.left,
    width: layout.width,
    height: "100%",
    borderLeft: `1px solid ${colors.border.strong}`,
    borderRight: `1px solid ${colors.border.strong}`,
    fontFamily: "Montserrat",
    fontSize: 24,
    color: colors.text.weak
  };

  const $number: CSSProperties = {
    fontWeight: 500,
    textAlign: "center",
    fontSize: 32,
    color: colors.text.strong
  };

  return (
    <route style={$route}>
      <not-found style={$notFound}>
        <number style={$number}>404</number>
        {m.error}
      </not-found>
    </route>
  );
}

const m = translate({
  error: ["This page doesn't exist", "Эта страница не существует"]
});
