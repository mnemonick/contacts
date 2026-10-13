import { type CSSProperties, useEffect, useState } from "react";
import { useLocation } from "wouter";
import Button from "#/components/Button.tsx";
import Input from "#/components/Input.tsx";
import Modal from "#/components/Modal.tsx";
import Loader from "#/components/Loader.tsx";
import colors from "#/utils/colors.ts";
import translate from "#/utils/translate.ts";
import client from "#/utils/client.ts";
import useGlobalStore from "#/stores/useGlobalStore.ts";
import type { GetUserResponse } from "%/handlers/get-user.ts";
import { PASSWORD_MIN, USERNAME_MIN } from "%/handlers/create-user.ts";
import ErrorModal from "#/components/modals/ErrorModal.tsx";

interface Props {
  onClose: () => void;
}

export default function ({ onClose }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const [usernameDirty, setUsernameDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  // LOADER is shown while a request is in flight and also blocks repeated submits.
  const [modal, setModal] = useState<"NONE" | "LOADER" | "USER_NOT_FOUND" | "UNEXPECTED">("NONE");

  let error: string | undefined;
  if (passwordDirty && password.length < PASSWORD_MIN) error = m.shortPassword(PASSWORD_MIN);
  if (usernameDirty && username.length < USERNAME_MIN) error = m.shortUsername(USERNAME_MIN);

  const setDisconnected = useGlobalStore((store) => store.setDisconnected);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" && error === undefined && modal === "NONE") login();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const $heading: CSSProperties = {
    borderBottom: `1px solid ${colors.border.medium}`,
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 500,
    fontSize: 20,
    color: colors.text.strong,
    textAlign: "center",
    height: 60,
    lineHeight: "60px",
    width: "100%"
  };

  const $input: CSSProperties = {
    borderBottom: `1px solid ${colors.border.weak}`,
    width: "100%",
    height: 60,
    fontFamily: "Montserrat",
    fontSize: "24px"
  };

  const $submit: CSSProperties = {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  };

  const $error: CSSProperties = {
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.error,
    fontFamily: "Montserrat",
    fontSize: "16px",
    textAlign: "center",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  };

  return (
    <Modal name="login-modal" onClose={modal === "NONE" ? onClose : undefined}>
      <heading style={$heading}>{m.heading}</heading>
      <form>
        <Input
          name="username-input"
          icon="person"
          value={username}
          style={$input}
          onChange={setUsername}
          placeholder={m.username}
          autoFocus={true}
          autoComplete="username"
          invalid={usernameDirty && username.length < USERNAME_MIN}
          onDirty={() => setUsernameDirty(true)}
        />
        <Input
          name="password-input"
          type="password"
          icon="password"
          value={password}
          autoComplete="current-password"
          placeholder={m.password}
          onChange={setPassword}
          onDirty={() => setPasswordDirty(true)}
          invalid={passwordDirty && password.length < PASSWORD_MIN}
          style={{ ...$input, borderBottom: `1px solid ${colors.border.medium}` }}
        />
      </form>
      {typeof error === "string" ? (
        <error style={$error}>{error}</error>
      ) : (
        <Button name="login-button" type="REGULAR" onClick={login} style={$submit}>
          {m.login}
        </Button>
      )}
      {modal === "USER_NOT_FOUND" ? <ErrorModal onClose={() => setModal("NONE")}>{m.userNotFound}</ErrorModal> : undefined}
      {modal === "UNEXPECTED" ? <ErrorModal onClose={() => setModal("NONE")}>{m.unexpected}</ErrorModal> : undefined}
      {modal === "LOADER" ? <Loader /> : undefined}
    </Modal>
  );

  async function login() {
    setUsernameDirty(true);
    setPasswordDirty(true);

    if (username.length < USERNAME_MIN) return;
    if (password.length < PASSWORD_MIN) return;
    if (modal === "LOADER") return;

    setModal("LOADER");
    let body: GetUserResponse;

    try {
      const response = await client["get-user"].$post({ json: { username, password } });
      body = (await response.json()) as GetUserResponse;
    } catch {
      return setDisconnected(true);
    } finally {
      setModal("NONE");
    }

    if (body.error === "INVALID_CREDENTIALS") return setModal("USER_NOT_FOUND");
    if (body.error !== null) return setModal("UNEXPECTED");

    localStorage.username = username;
    localStorage.password = password;
    setLocation("/user");
  }
}

const m = translate({
  login: ["Log in", "Войти"],
  heading: ["Login", "Вход"],
  username: ["Username", "Имя пользователя"],
  password: ["Password", "Пароль"],
  shortUsername: [
    "Username should be at least ___ characters long",
    "Имя пользователя должно содержать не менее ___ символов"
  ],
  shortPassword: ["Password should be at least ___ characters long", "Пароль должен содержать не менее ___ символов"],
  userNotFound: ["User not found", "Пользователь не найден"],
  unexpected: ["Something went wrong, try again", "Что-то пошло не так, попробуйте еще раз"]
});
