import { useEffect, type CSSProperties } from "react";
import useLayout from "#/hooks/useLayout.ts";
import colors from "#/utils/colors.ts";
import translate from "#/utils/translate.ts";

const RECONNECT_DELAY = 5000;

export default function () {
  const layout = useLayout();

  useEffect(() => {
    const timer = setTimeout(() => location.reload(), RECONNECT_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const $disconnected: CSSProperties = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: layout.desktop ? "center" : "end",
    background: colors.gradient
  };

  const $card: CSSProperties = {
    width: layout.desktop ? 400 : "calc(100% - 40px)",
    marginBottom: layout.desktop ? 0 : 20,
    background: colors.modal.content,
    borderRadius: 20,
    border: `1px solid ${colors.border.strong}`,
    boxShadow: colors.modal.shadow,
    fontFamily: "Montserrat"
  };

  const $heading: CSSProperties = {
    borderBottom: `1px solid ${colors.border.medium}`,
    fontWeight: 500,
    fontSize: 20,
    textAlign: "center",
    height: 60,
    lineHeight: "60px",
    color: colors.text.error
  };

  const $message: CSSProperties = {
    display: "block",
    padding: 20,
    lineHeight: "21px",
    textAlign: "center",
    color: colors.text.medium,
    borderBottom: `1px solid ${colors.border.medium}`
  };

  return (
    <disconnected style={$disconnected}>
      <card style={$card}>
        <heading style={$heading}>{m.heading}</heading>
        <message style={$message}>{m.message}</message>
      </card>
    </disconnected>
  );
}

const m = translate({
  heading: ["Connection error", "Ошибка соединения"],
  message: [
    "The connection to the server was lost. The page will reload automatically.",
    "Соединение с сервером было потеряно. Страница перезагрузится автоматически."
  ]
});
