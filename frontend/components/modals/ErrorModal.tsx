import type { CSSProperties } from "react";
import Modal from "#/components/Modal.tsx";
import colors from "#/utils/colors.ts";
import useLayout from "#/hooks/useLayout.ts";
import translate from "#/utils/translate.ts";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

export default function ({ onClose, children }: Props) {
  const layout = useLayout();
  const $heading: CSSProperties = {
    borderBottom: `1px solid ${colors.border.medium}`,
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 500,
    fontSize: layout.mobile ? 18 : 20,
    textAlign: "center",
    height: 60,
    lineHeight: "60px",
    width: "100%",
    color: colors.text.error,
    background: colors.error.background
  };

  const $error: CSSProperties = {
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.strong,
    fontFamily: "Montserrat",
    fontSize: layout.mobile ? 14 : 20,
    textAlign: "center",
    padding: 20
  };

  return (
    <Modal name="error-modal" onClose={onClose}>
      <heading style={$heading}>{m.heading}</heading>
      <message style={$error}>{children}</message>
    </Modal>
  );
}

const m = translate({
  heading: ["Error", "Ошибка"]
});
