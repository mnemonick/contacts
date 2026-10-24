import { type CSSProperties, useEffect, useState } from "react";
import { useLocation } from "wouter";
import type { CreateUserResponse } from "%/handlers/create-user.ts";
import Button from "#/components/Button.tsx";
import Input from "#/components/Input.tsx";
import Modal from "#/components/Modal.tsx";
import Loader from "#/components/Loader.tsx";
import colors from "#/utils/colors.ts";
import translate from "#/utils/translate.ts";
import useGlobalStore from "#/stores/useGlobalStore.ts";
import ErrorModal from "#/components/modals/ErrorModal.tsx";
import client from "#/utils/client.ts";
import type { CreateUserRequest } from "%/handlers/create-user.ts";
import { PASSWORD_MIN, USERNAME_MIN } from "%/utils/constants.ts";

interface Props {
  onClose: () => void;
}

export default function ({ onClose }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState<"NONE" | "LOADER" | "USERNAME_TAKEN" | "UNEXPECTED">("NONE");
  const [usernameDirty, setUsernameDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [, setLocation] = useLocation();
  const setDisconnected = useGlobalStore((store) => store.setDisconnected);

  let error: string | undefined;
  if (passwordDirty && password.length < PASSWORD_MIN) error = m.shortPassword(PASSWORD_MIN);
  if (usernameDirty && username.length < USERNAME_MIN) error = m.shortUsername(USERNAME_MIN);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" && error === undefined && modal === "NONE") register();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
    <Modal name="register-modal" onClose={modal === "NONE" ? onClose : undefined}>
      <heading style={$heading}>{m.heading}</heading>
      <form>
        <Input
          name="username-input"
          icon="person"
          value={username}
          autoFocus={true}
          style={$input}
          placeholder={m.username}
          autoComplete="username"
          invalid={usernameDirty && username.length < USERNAME_MIN}
          onChange={setUsername}
          onDirty={() => setUsernameDirty(true)}
        />

        <Input
          name="password-input"
          type="password"
          icon="password"
          value={password}
          placeholder={m.password}
          autoComplete="new-password"
          onDirty={() => setPasswordDirty(true)}
          invalid={passwordDirty && password.length < PASSWORD_MIN}
          onChange={setPassword}
          style={{
            ...$input,
            borderBottom: `1px solid ${colors.border.medium}`
          }}
        />

        {typeof error === "string" ? (
          <error style={$error}>{error}</error>
        ) : (
          <Button name="register-button" type="REGULAR" style={$submit} onClick={() => register()}>
            {m.register}
          </Button>
        )}
      </form>

      {modal === "USERNAME_TAKEN" ? <ErrorModal onClose={() => setModal("NONE")}>{m.usernameTaken}</ErrorModal> : null}
      {modal === "UNEXPECTED" ? <ErrorModal onClose={() => setModal("NONE")}>{m.unexpected}</ErrorModal> : null}
      {modal === "LOADER" ? <Loader /> : null}
    </Modal>
  );

  async function register() {
    setUsernameDirty(true);
    setPasswordDirty(true);

    if (username.length < USERNAME_MIN) return;
    if (password.length < PASSWORD_MIN) return;
    if (modal === "LOADER") return;

    setModal("LOADER");
    let body: CreateUserResponse;

    try {
      const json: CreateUserRequest = { username, password };

      const response = await client["create-user"].$post({ json });
      body = (await response.json()) as CreateUserResponse;
    } catch {
      return setDisconnected(true);
    } finally {
      setModal("NONE");
    }

    if (body.error === "USERNAME_TAKEN") return setModal("USERNAME_TAKEN");
    if (body.error !== null) return setModal("UNEXPECTED");

    localStorage.username = username;
    localStorage.password = password;
    setLocation("/user");
  }
}

const m = translate({
  heading: ["Registration", "Регистрация"],
  username: ["Username", "Имя пользователя"],
  password: ["Password", "Пароль"],
  register: ["Register", "Зарегистрироваться"],
  shortUsername: [
    "Username must be at least ___ characters long",
    "Имя пользователя должно содержать не менее ___ символов"
  ],
  shortPassword: ["Password must be at least ___ characters long", "Пароль должен содержать не менее ___ символов"],
  usernameTaken: ["Username is already taken", "Имя пользователя уже занято"],
  unexpected: ["Something went wrong, try again", "Что-то пошло не так, попробуйте еще раз"]
});
