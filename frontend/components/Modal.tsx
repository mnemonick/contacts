import { createElement, type CSSProperties, type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import useLayout from "#/hooks/useLayout.ts";
import colors from "#/utils/colors.ts";

const FADE = 120;
const SLIDE = 200;

interface Props {
  name: string;
  children: ReactNode;
  onClose?: () => void;
}

// Like Chrome, the modal sits in the visible area above the keyboard. On iOS the keyboard shrinks the visual viewport
// but not the layout viewport. iOS can keep a stale offsetTop after the keyboard closes, so the offset is used only
// while a text field is focused.
function readViewport() {
  const visual = window.visualViewport;
  const { activeElement } = document;
  const editing = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
  return visual && editing ? { top: visual.offsetTop, height: visual.height } : { top: 0, height: window.innerHeight };
}

export default function ({ name, onClose, children }: Props) {
  const layout = useLayout();
  const [viewport, setViewport] = useState(readViewport);
  const modalRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  const $modal: CSSProperties = {
    position: "fixed",
    top: viewport.top,
    left: 0,
    width: "100%",
    opacity: 0,
    height: viewport.height,
    background: colors.modal.backdrop,
    display: "flex",
    justifyContent: "center",
    alignItems: layout.desktop ? "center" : "end",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
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

  useEffect(() => {
    const update = () => setViewport(readViewport());
    // focusout reports the old activeElement, so the update waits one tick.
    const later = () => setTimeout(update);
    const visual = window.visualViewport;

    visual?.addEventListener("resize", update);
    visual?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("focusin", later);
    window.addEventListener("focusout", later);
    return () => {
      visual?.removeEventListener("resize", update);
      visual?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("focusin", later);
      window.removeEventListener("focusout", later);
    };
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
