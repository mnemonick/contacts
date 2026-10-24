import type { CSSProperties } from "react";
import colors from "#/utils/colors.ts";
import translate from "#/utils/translate.ts";
import { WIDTH_MIN } from "%/utils/constants.ts";

export default function () {
  const $tooNarrow: CSSProperties = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    background: colors.gradient,
    fontFamily: "Montserrat",
    textAlign: "center"
  };

  const $message: CSSProperties = {
    color: colors.text.medium,
    lineHeight: "21px"
  };

  return (
    <too-narrow style={$tooNarrow}>
      <message style={$message}>{m.message(String(WIDTH_MIN))}</message>
    </too-narrow>
  );
}

const m = translate({
  message: ["The minimum supported width is ___px.", "Минимальная поддерживаемая ширина - ___px."]
});
