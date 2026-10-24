import { createElement, type CSSProperties, type MouseEvent, type ReactNode, useEffect, useRef } from "react";
import useLayout from "#/hooks/useLayout.ts";
import colors from "#/utils/colors.ts";

const FADE = 120;
const SLIDE = 200;

interface Props {
  name: string;
  children: ReactNode;
  onClose?: () => void;
}

export default function ({ name, onClose, children }: Props) {
  const layout = useLayout();
  const modalRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  const $modal: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    opacity: 0,
    height: "100%",
    background: colors.modal.backdrop,
    display: "flex",
    justifyContent: "center",
    alignItems: layout.desktop ? "center" : "end",
    backdropFilter: "blur(2px)",
    transition: `opacity ${FADE}ms linear`
  };

  const $content: CSSProperties = {
    background: colors.modal.content,
    width: layout.desktop ? 400 : "calc(100% - 40px)",
    borderRadius: 20,
    border: `1px solid ${colors.border.strong}`,
    boxShadow: colors.modal.shadow,
    marginBottom: layout.desktop ? "" : 20,
    transition: `transform ${SLIDE}ms linear`,
    transform: "translateY(20px)"
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Changing the styles after mount starts the enter transition.
  useEffect(() => {
    modalRef.current!.style.opacity = "1";
    contentRef.current!.style.transform = "";
  }, []);

  return createElement(
    name,
    { ref: modalRef, style: $modal, onClick },
    <content ref={contentRef} style={$content}>
      {children}
    </content>
  );

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && typeof onClose === "function") {
      close();
    }
  }

  function onClick(event: MouseEvent<HTMLElement>) {
    if (event.target === event.currentTarget && onClose) close();
  }

  function close() {
    (document.activeElement as HTMLElement)?.blur();
    modalRef.current!.style.opacity = "0";
    contentRef.current!.style.transform = "translateY(120px)";
    // Unmount only after the fade-out transition has finished.
    setTimeout(() => onClose!(), FADE);
  }
}
