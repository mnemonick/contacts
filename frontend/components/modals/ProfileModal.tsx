import type { CSSProperties } from "react";
import Modal from "#/components/Modal.tsx";
import colors from "#/utils/colors.ts";
import translate from "#/utils/translate.ts";
import useLayout from "#/hooks/useLayout.ts";
import useUserStore from "#/stores/useUserStore.ts";

interface Props {
  onClose: () => void;
}

export default function ({ onClose }: Props) {
  const user = useUserStore((store) => store.user)!;
  const layout = useLayout();
  // registration is a Postgres TIMESTAMPTZ, shown as a date in the viewer's time zone.
  const registration = Temporal.Instant.from(user.registration).toLocaleString(navigator.language, {
    dateStyle: "medium"
  });

  const $heading: CSSProperties = {
    borderBottom: `1px solid ${colors.border.medium}`,
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 500,
    fontSize: 20,
    textAlign: "center",
    height: 60,
    lineHeight: "60px",
    width: "100%",
    color: colors.text.strong
  };

  const $field: CSSProperties = {
    display: "flex",
    fontFamily: "Montserrat, sans-serif",
    height: 50,
    borderBottom: `1px solid ${colors.border.weak}`
  };

  const $label: CSSProperties = {
    display: "flex",
    width: "50%",
    height: "100%",
    borderRight: `1px solid ${colors.border.weak}`,
    paddingLeft: layout.desktop ? 20 : 10,
    alignItems: "center"
  };

  const $value: CSSProperties = {
    display: "flex",
    width: "50%",
    height: "100%",
    paddingLeft: layout.desktop ? 20 : 10,
    alignItems: "center"
  };

  return (
    <Modal name="profile-modal" onClose={onClose}>
      <heading style={$heading}>{user.username}</heading>
      <field style={$field}>
        <label style={$label}>{m.registration}</label>
        <value style={$value}>{registration}</value>
      </field>
      <field style={$field}>
        <label style={$label}>{m.contacts}</label>
        <value style={$value}>{user.contacts.length}</value>
      </field>
    </Modal>
  );
}

const m = translate({
  registration: ["Registration date", "Дата регистрации"],
  contacts: ["Contacts count", "Кол-во контактов"]
});
