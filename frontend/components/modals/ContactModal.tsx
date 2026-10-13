import { useState, useEffect, type ReactElement, type CSSProperties } from "react";
import Input from "#/components/Input.tsx";
import Modal from "#/components/Modal.tsx";
import Loader from "#/components/Loader.tsx";
import Button from "#/components/Button.tsx";
import colors from "#/utils/colors.ts";
import translate from "#/utils/translate.ts";
import useUserStore from "#/stores/useUserStore.ts";
import client from "#/utils/client.ts";
import { type CreateContactRequest, type CreateContactResponse, NAME_MIN } from "%/handlers/create-contact.ts";
import type { RemoveContactRequest, RemoveContactResponse } from "%/handlers/remove-contact.ts";
import type { UpdateContactRequest, UpdateContactResponse } from "%/handlers/update-contact.ts";
import useGlobalStore from "#/stores/useGlobalStore.ts";
import ErrorModal from "#/components/modals/ErrorModal.tsx";
import { isEmail } from "%/utils/validate.ts";
import type { Contact } from "%/utils/types.ts";

interface Props {
  contact?: Contact;
  onClose: () => void;
}

export default function ({ contact, onClose }: Props) {
  const user = useUserStore((store) => store.user)!;
  const addContact = useUserStore((store) => store.addContact);
  const removeContact = useUserStore((store) => store.removeContact);
  const updateContact = useUserStore((store) => store.updateContact);
  const setDisconnected = useGlobalStore((store) => store.setDisconnected);

  const [name, setName] = useState(contact ? contact.name : "");
  const [nameDirty, setNameDirty] = useState(false);

  const [email, setEmail] = useState(contact ? contact.email : "");
  const [emailDirty, setEmailDirty] = useState(false);

  const [comment, setComment] = useState(contact?.comment ?? "");

  // LOADER is shown while a request is in flight and also blocks repeated submits.
  const [modal, setModal] = useState<"NONE" | "LOADER" | "UNEXPECTED">("NONE");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" && modal === "NONE") {
        if (contact) update();
        else create();
      }
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
    width: "100%"
  };

  const $submit: CSSProperties = {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  };

  const $input: CSSProperties = {
    borderBottom: `1px solid ${colors.border.weak}`,
    width: "100%",
    height: 60,
    fontFamily: "Montserrat",
    fontSize: "24px"
  };

  const $buttons: CSSProperties = {
    display: "flex",
    height: 60
  };

  const $button: CSSProperties = {
    width: "50%",
    height: "100%",
    fontFamily: "Montserrat",
    borderRight: `1px solid ${colors.border.medium}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer"
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

  let footer: ReactElement;

  if (contact) {
    if (nameDirty && name.length < NAME_MIN) footer = <error style={$error}>{m.nameError(NAME_MIN)}</error>;
    else if (emailDirty && !isEmail(email)) footer = <error style={$error}>{m.emailError}</error>;
    else {
      footer = (
        <buttons style={$buttons}>
          <Button
            name="update-button"
            type="REGULAR"
            onClick={update}
            style={{ ...$button, borderBottomLeftRadius: 20 }}
          >
            {m.update}
          </Button>
          <Button
            name="delete-button"
            type="REGULAR"
            onClick={remove}
            style={{ ...$button, borderBottomRightRadius: 20 }}
          >
            {m.delete}
          </Button>
        </buttons>
      );
    }
  } else {
    if (nameDirty && name.length < NAME_MIN) footer = <error style={$error}>{m.nameError(NAME_MIN)}</error>;
    else if (emailDirty && !isEmail(email)) footer = <error style={$error}>{m.emailError}</error>;
    else {
      footer = (
        <Button name="create-button" type="REGULAR" style={$submit} onClick={create}>
          {m.create}
        </Button>
      );
    }
  }

  return (
    <Modal name="contact-modal" onClose={modal === "NONE" ? onClose : undefined}>
      <heading style={$heading}>{contact ? m.updateHeading : m.createHeading}</heading>
      <Input
        name="name-input"
        value={name}
        icon="person"
        autoFocus={true}
        style={$input}
        placeholder={m.name}
        onDirty={() => setNameDirty(true)}
        onChange={setName}
        invalid={nameDirty && name.length < NAME_MIN}
      />
      <Input
        name="email-input"
        value={email}
        icon="email"
        style={$input}
        placeholder={m.email}
        onDirty={() => setEmailDirty(true)}
        onChange={setEmail}
        invalid={emailDirty && !isEmail(email)}
      />
      <Input
        name="comment-input"
        value={comment}
        icon="comment"
        placeholder={m.comment}
        onChange={setComment}
        style={{
          ...$input,
          borderBottom: `1px solid ${colors.border.medium}`
        }}
      />
      {footer}
      {modal === "UNEXPECTED" ? <ErrorModal onClose={() => setModal("NONE")}>{m.unexpected}</ErrorModal> : undefined}
      {modal === "LOADER" ? <Loader /> : undefined}
    </Modal>
  );

  async function create() {
    setNameDirty(true);
    setEmailDirty(true);

    if (name.length < NAME_MIN) return;
    if (!isEmail(email)) return;
    if (modal === "LOADER") return;

    const json: CreateContactRequest = {
      username: user.username,
      password: user.password,
      name,
      email,
      comment
    };

    setModal("LOADER");
    let body: CreateContactResponse;

    try {
      const response = await client["create-contact"].$post({ json });
      body = (await response.json()) as CreateContactResponse;
    } catch {
      return setDisconnected(true);
    } finally {
      setModal("NONE");
    }

    if (body.error !== null) return setModal("UNEXPECTED");

    addContact(body.contact);
    onClose();
  }

  async function update() {
    setNameDirty(true);
    setEmailDirty(true);

    if (name.length < NAME_MIN) return;
    if (!isEmail(email)) return;
    if (modal === "LOADER") return;

    setModal("LOADER");
    let body: UpdateContactResponse;

    try {
      const json: UpdateContactRequest = {
        username: user.username,
        password: user.password,
        contactId: contact!.id,
        name,
        email,
        comment
      };

      const response = await client["update-contact"].$post({ json });
      body = (await response.json()) as UpdateContactResponse;
    } catch {
      return setDisconnected(true);
    } finally {
      setModal("NONE");
    }

    if (body.error !== null) return setModal("UNEXPECTED");

    updateContact(body.contact);
    onClose();
  }

  async function remove() {
    if (modal === "LOADER") return;

    setModal("LOADER");
    let body: RemoveContactResponse;

    try {
      const json: RemoveContactRequest = {
        username: user.username,
        password: user.password,
        contactId: contact!.id
      };

      const response = await client["remove-contact"].$post({ json });
      body = (await response.json()) as RemoveContactResponse;
    } catch {
      return setDisconnected(true);
    } finally {
      setModal("NONE");
    }

    if (body.error !== null) return setModal("UNEXPECTED");

    removeContact(contact!.id);
    onClose();
  }
}

const m = translate({
  createHeading: ["Create Contact", "Создание контакта"],
  updateHeading: ["Edit Contact", "Редактирование контакта"],
  name: ["Name", "Имя"],
  email: ["Email", "Электронная почта"],
  comment: ["Comment", "Комментарий"],
  create: ["Create Contact", "Создать контакт"],
  update: ["Update Contact", "Обновить"],
  delete: ["Delete", "Удалить"],
  nameError: ["Name must be at least ___ characters long", "Имя должно содержать не менее ___ символов"],
  emailError: ["Incorrect email", "Некорректный email"],
  unexpected: ["Something went wrong, try again", "Что-то пошло не так, попробуйте еще раз"]
});
