import { type CSSProperties, useRef } from "react";
import usePointer from "#/hooks/usePointer.ts";
import colors from "#/utils/colors.ts";

const FADE = 100;

interface Props {
  children: string;
}

export default function ({ children }: Props) {
  const pointer = usePointer();
  const tooltipRef = useRef<HTMLElement>(null);

  const $trigger: CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0
  };

  const $tooltip: CSSProperties = {
    position: "absolute",
    top: 0,
    opacity: 0,
    left: "50%",
    pointerEvents: "none",
    transition: `opacity ${FADE}ms linear`,
    background: colors.tooltip.background,
    borderRadius: 5,
    fontSize: 16,
    transform: "translateY(calc(-100% - 10px)) translateX(-50%)",
    padding: 10,
    border: `1px solid ${colors.border.strong}`,
    fontFamily: "Montserrat",
    whiteSpace: "nowrap"
  };

  // Touch screens have no hover, so the tooltip is not rendered there.
  if (pointer === "TOUCH") return undefined;
  if (pointer === "MOUSE") {
    return (
      <trigger onMouseMove={show} onMouseLeave={hide} style={$trigger}>
        <tooltip ref={tooltipRef} style={$tooltip}>
          {children}
        </tooltip>
      </trigger>
    );
  }

  function hide() {
    tooltipRef.current!.style.opacity = "0";
  }

  function show() {
    tooltipRef.current!.style.opacity = "1";
  }
}
