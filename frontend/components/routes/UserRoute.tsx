import { useEffect, useState, type CSSProperties } from "react";
import { useLocation } from "wouter";
import Loader from "#/components/Loader.tsx";
import Button from "#/components/Button.tsx";
import Electrons from "#/components/Electrons.tsx";
import ContactModal from "#/components/modals/ContactModal.tsx";
import useLayout from "#/hooks/useLayout.ts";
import translate from "#/utils/translate.ts";
import colors from "#/utils/colors.ts";
import useUserStore from "#/stores/useUserStore.ts";
import useGlobalStore from "#/stores/useGlobalStore.ts";
import Tooltip from "#/components/Tooltip.tsx";
import type { Contact } from "%/utils/types.ts";
import type { GetUserResponse } from "%/handlers/get-user.ts";
import client from "#/utils/client.ts";
import ProfileModal from "#/components/modals/ProfileModal.tsx";

const HOVER = 120;

export default function () {
  const layout = useLayout();

  const [, setLocation] = useLocation();
  const [modal, setModal] = useState<"NONE" | "CREATE" | "PROFILE" | Contact>("NONE");

  const user = useUserStore((store) => store.user);
  const setUser = useUserStore((store) => store.setUser);
  const setDisconnected = useGlobalStore((store) => store.setDisconnected);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const username = localStorage.username;
      const password = localStorage.password;

      // biome-ignore lint/complexity/useSimplifiedLogicExpression: This way it is more descriptive
      if (!username || !password) return setLocation("/");

      let body: GetUserResponse;

      try {
        const response = await client["get-user"].$post(
          { json: { username, password } },
          { init: { signal: controller.signal } }
        );
        body = (await response.json()) as GetUserResponse;
      } catch {
        if (!controller.signal.aborted) setDisconnected(true);
        return;
      }

      if (body.error === null) return setUser(body.user);
      if (body.error === "INTERNAL") return setDisconnected(true);

      logout();
    }

    load();

    return () => controller.abort();
  }, []);

  const $route: CSSProperties = {
    height: "100%",
    color: colors.text.strong,
    background: colors.gradient
  };

  const $routeHeader: CSSProperties = {
    height: 60,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    color: colors.text.strong,
    fontFamily: "Montserrat",
    fontWeight: 500,
    borderBottom: `1px solid ${colors.border.strong}`
  };

  const $toolbar: CSSProperties = {
    maxWidth: 1024,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    height: "100%",
    borderLeft: layout.desktop ? `1px solid ${colors.border.strong}` : undefined,
    borderRight: layout.desktop ? `1px solid ${colors.border.strong}` : undefined
  };

  const $content: CSSProperties = {
    position: "relative",
    width: layout.width,
    minHeight: "100%",
    left: layout.left,
    borderLeft: `1px solid ${colors.border.strong}`,
    borderRight: `1px solid ${colors.border.strong}`
  };

  const $routeBody: CSSProperties = {
    position: "relative",
    height: `calc(100% - ${$routeHeader.height}px)`
  };

  // Positioned, so the list and its scrollbar are drawn above the electrons.
  const $scroll: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflowY: "scroll"
  };

  const $headers: CSSProperties = {
    display: "flex",
    alignItems: "center",
    height: 60,
    borderBottom: `1px solid ${colors.border.weak}`
  };

  // On mobile (360px wide) the text is smaller and cut with an ellipsis instead of spilling into the next column.
  const $cell: CSSProperties = {
    height: "100%",
    display: layout.mobile ? "block" : "flex",
    fontFamily: "Montserrat",
    alignItems: "center",
    width: "calc(100% / 3)",
    minWidth: 0,
    paddingLeft: layout.mobile ? 10 : 20,
    paddingRight: layout.mobile ? 10 : undefined,
    fontSize: layout.mobile ? 14 : undefined,
    lineHeight: layout.mobile ? "60px" : undefined,
    overflow: layout.mobile ? "hidden" : undefined,
    whiteSpace: layout.mobile ? "nowrap" : undefined,
    textOverflow: layout.mobile ? "ellipsis" : undefined,
    borderRight: `1px solid ${colors.border.weak}`
  };

  const $placeholder: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    left: layout.left,
    width: layout.width,
    height: "100%",
    borderLeft: layout.desktop ? `1px solid ${colors.border.strong}` : undefined,
    borderRight: layout.desktop ? `1px solid ${colors.border.strong}` : undefined,
    fontFamily: "Montserrat",
    fontSize: 24,
    color: colors.text.weak
  };

  const $username: CSSProperties = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    position: "absolute",
    left: 10,
    bottom: 10,
    top: 10,
    borderRadius: 5,
    padding: "0 10px",
    transition: `background ${HOVER}ms linear`
  };

  const $exit: CSSProperties = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    position: "absolute",
    right: 10,
    bottom: 10,
    top: 10,
    borderRadius: 5,
    padding: "0 10px",
    transition: `background ${HOVER}ms linear`
  };

  if (user === undefined) {
    return <Loader />;
  }

  return (
    <route style={$route}>
      <route-header style={$routeHeader}>
        <toolbar style={$toolbar}>
          <username
            style={$username}
            onMouseMove={(event) => (event.currentTarget.style.background = colors.link.hover)}
            onMouseLeave={(event) => (event.currentTarget.style.background = "transparent")}
            onClick={() => setModal("PROFILE")}
          >
            <span className="material-symbols-outlined">person</span>
            <span style={{ marginLeft: 5 }}>{user.username}</span>
          </username>
          <exit
            style={$exit}
            onMouseMove={(event) => (event.currentTarget.style.background = colors.link.hover)}
            onMouseLeave={(event) => (event.currentTarget.style.background = "transparent")}
            onClick={logout}
          >
            <span className="material-symbols-outlined">door_back</span>
            <span style={{ marginLeft: 5 }}>{m.exit}</span>
          </exit>
        </toolbar>
      </route-header>

      <route-body style={$routeBody}>
        {layout.desktop ? <Electrons side="left" width={layout.left} /> : null}
        {layout.desktop ? <Electrons side="right" width={layout.left} /> : null}

        {user.contacts.length === 0 ? (
          <placeholder style={$placeholder}>{m.placeholder}</placeholder>
        ) : (
          <scroll style={$scroll}>
            <content style={$content}>
              <headers style={$headers}>
                <name style={$cell}>{m.name}</name>
                <email style={$cell}>{m.email}</email>
                <comment style={{ ...$cell, borderRight: undefined }}>{m.comment}</comment>
              </headers>
              <contacts>{user.contacts.map(renderContact)}</contacts>
            </content>
          </scroll>
        )}
      </route-body>

      <Button
        name="create-button"
        type="ACCENT"
        bottom={40}
        left={layout.right - 100}
        onClick={() => setModal("CREATE")}
      >
        <span className="material-symbols-outlined">add</span>
        <Tooltip>{m.createContact}</Tooltip>
      </Button>

      {modal === "CREATE" ? <ContactModal onClose={() => setModal("NONE")} /> : null}
      {modal === "PROFILE" ? <ProfileModal onClose={() => setModal("NONE")} /> : null}
      {typeof modal === "object" ? <ContactModal contact={modal} onClose={() => setModal("NONE")} /> : null}
    </route>
  );

  // The user is cleared too, so the next user to log in doesn't see this user's data while loading.
  function logout() {
    delete localStorage.username;
    delete localStorage.password;
    setUser(undefined);
    setLocation("/");
  }

  function renderContact(contact: Contact) {
    const $contact: CSSProperties = {
      height: 60,
      display: "flex",
      borderBottom: `1px solid ${colors.border.weak}`,
      transition: `background ${HOVER}ms linear`,
      fontFamily: "Montserrat",
      alignItems: "center",
      cursor: "pointer",
      fontSize: layout.mobile ? 14 : 16,
      WebkitTapHighlightColor: "transparent"
    };

    return (
      <contact
        key={contact.id}
        style={$contact}
        onClick={() => setModal(contact)}
        onMouseMove={(event) => (event.currentTarget.style.backgroundColor = colors.button.hover)}
        onMouseLeave={(event) => (event.currentTarget.style.backgroundColor = "transparent")}
      >
        <name style={$cell}>{contact.name}</name>
        <email style={$cell}>{contact.email}</email>
        <comment style={{ ...$cell, borderRight: undefined }}>{contact.comment || "-"}</comment>
      </contact>
    );
  }
}

const m = translate({
  name: ["Name", "Имя"],
  email: ["Email", "Email"],
  comment: ["Comment", "Комментарий"],
  exit: ["Exit", "Выход"],
  placeholder: ["No contacts", "Нет контактов"],
  createContact: ["Create contact", "Создать контакт"]
});
