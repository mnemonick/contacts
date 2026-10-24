import type { CSSProperties } from "react";
import Button from "#/components/Button.tsx";
import useLayout from "#/hooks/useLayout.ts";
import colors from "#/utils/colors.ts";
import translate from "#/utils/translate.ts";

export default function () {
  const layout = useLayout();

  const $errorScreen: CSSProperties = {
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

  const $reload: CSSProperties = {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  };

  return (
    <error-screen style={$errorScreen}>
      <card style={$card}>
        <heading style={$heading}>{m.heading}</heading>
        <message style={$message}>{m.message}</message>
        <Button name="reload-button" type="REGULAR" style={$reload} onClick={() => location.reload()}>
          {m.reload}
        </Button>
      </card>
    </error-screen>
  );
}

const m = translate({
  heading: ["Something went wrong", "Что-то пошло не так"],
  message: [
    "An unexpected error occurred. Try reloading the page.",
    "Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу."
  ],
  reload: ["Reload page", "Перезагрузить страницу"]
});
