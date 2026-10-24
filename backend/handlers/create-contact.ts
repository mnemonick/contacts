import type { Context } from "hono";
import sql from "%/utils/sql.ts";
import { NAME_MIN } from "%/utils/constants.ts";
import { isEmail, isObject, isText } from "%/utils/validate.ts";
import type { Contact } from "%/utils/types.ts";

export default async function (c: Context) {
  const body: unknown = await c.req.json().catch(() => undefined);

  if (!isObject(body)) return c.json({ error: "BODY_INVALID" });

  if (!isText(body.username)) return c.json<CreateContactResponse>({ error: "USERNAME_REQUIRED" });
  if (!isText(body.password)) return c.json<CreateContactResponse>({ error: "PASSWORD_REQUIRED" });
  if (!isText(body.name)) return c.json<CreateContactResponse>({ error: "NAME_REQUIRED" });
  if (!isText(body.email)) return c.json<CreateContactResponse>({ error: "EMAIL_REQUIRED" });
  if (!isText(body.comment)) return c.json<CreateContactResponse>({ error: "COMMENT_REQUIRED" });

  if (body.name.length < NAME_MIN) return c.json<CreateContactResponse>({ error: "NAME_INCORRECT" });
  if (!isEmail(body.email)) return c.json<CreateContactResponse>({ error: "EMAIL_INCORRECT" });

  const [contact] = await sql<Contact[]>`
    INSERT INTO contacts (user_id, email, name, comment)
    SELECT id, ${body.email}, ${body.name}, ${body.comment}
    FROM users
    WHERE lower(username) = lower(${body.username})
      AND password = ${body.password}
    RETURNING id, name, email, comment
  `;

  if (contact === undefined) {
    return c.json<CreateContactResponse>({ error: "INVALID_CREDENTIALS" });
  }

  return c.json<CreateContactResponse>({ error: null, contact });
}

export type CreateContactRequest = {
  username: string;
  password: string;
  name: string;
  email: string;
  comment: string;
};

export type CreateContactResponse = { error: null; contact: Contact } | { error: string };
