import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { createElement } from "react";
import colors from "#/utils/colors.ts";
import useLayout from "#/hooks/useLayout.ts";

const HOVER = 120;

type Props = {
  name: string;
  type: "ACCENT" | "REGULAR";
  onClick?: () => void;
  children: ReactNode;
  style?: CSSProperties;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

export default function ({ name, type, onClick, children, style, top, left, right, bottom }: Props) {
  const layout = useLayout();
  const size = layout.desktop ? 60 : 50;

  const $base: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
    border: 0,
    outline: "none",
    cursor: "pointer",
    userSelect: "none",
    textAlign: "center",
    lineHeight: "normal",
    color: colors.text.strong
  };

  const $accent: CSSProperties = {
    ...$base,
    position: "absolute",
    top,
    left,
    right,
    bottom,
    borderRadius: "50%",
    height: size,
    width: size,
    backgroundColor: colors.button.color,
    boxShadow: colors.button.shadow
  };

  const $regular: CSSProperties = {
    ...$base,
    width: "100%",
    height: 60,
    transition: `background ${HOVER}ms linear`,
    fontFamily: "Montserrat",
    fontSize: 14,
    textTransform: "uppercase"
  };

  const $button = type === "ACCENT" ? $accent : $regular;

  const props = {
    role: "button",
    tabIndex: 0,
    style: { ...$button, ...style },
    onClick,
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        // Stop the key here, so modals listening for Enter on window don't submit a second time.
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }
    },
    onMouseMove:
      type === "REGULAR"
        ? (event: MouseEvent<HTMLElement>) => (event.currentTarget.style.background = colors.button.hover)
        : undefined,
    onMouseLeave:
      type === "REGULAR" ? (event: MouseEvent<HTMLElement>) => (event.currentTarget.style.background = "") : undefined
  };

  return createElement(name, props, children);
}
