import type { CSSProperties } from "react";
import colors from "#/utils/colors.ts";

const DELAY = 1000;
const FADE = 200;
const SPIN = 1000;

export default function () {
  // Fades in only after a second, so fast requests don't flash a loader; clicks are blocked from the start.
  const $loader: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: colors.loader.backdrop,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
    animation: `appear ${FADE}ms linear ${DELAY}ms forwards`
  };

  const $spinner: CSSProperties = {
    width: 50,
    height: 50,
    borderRadius: "50%",
    border: `4px solid ${colors.loader.track}`,
    borderTopColor: colors.loader.spinner,
    animation: `spin ${SPIN}ms linear infinite`
  };

  return (
    <loader style={$loader}>
      <spinner style={$spinner} />
    </loader>
  );
}
