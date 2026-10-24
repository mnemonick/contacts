import type { Context } from "hono";
import sql from "%/utils/sql.ts";
import { isEmail, isId, isObject, isText } from "%/utils/validate.ts";
import { NAME_MIN } from "%/utils/constants.ts";
import type { Contact } from "%/utils/types.ts";

export default async function (c: Context) {
  const body: unknown = await c.req.json().catch(() => undefined);

  if (!isObject(body)) return c.json({ error: "BODY_INVALID" });

  if (!isText(body.username)) return c.json<UpdateContactResponse>({ error: "USERNAME_REQUIRED" });
  if (!isText(body.password)) return c.json<UpdateContactResponse>({ error: "PASSWORD_REQUIRED" });
  if (!isId(body.contactId)) return c.json<UpdateContactResponse>({ error: "CONTACT_ID_REQUIRED" });
  if (!isText(body.name)) return c.json<UpdateContactResponse>({ error: "NAME_REQUIRED" });
  if (!isText(body.email)) return c.json<UpdateContactResponse>({ error: "EMAIL_REQUIRED" });
  if (!isText(body.comment)) return c.json<UpdateContactResponse>({ error: "COMMENT_REQUIRED" });

  if (body.name.length < NAME_MIN) return c.json<UpdateContactResponse>({ error: "NAME_INCORRECT" });
  if (!isEmail(body.email)) return c.json<UpdateContactResponse>({ error: "EMAIL_INCORRECT" });

  const [user] = await sql`
    SELECT * FROM users
    WHERE lower(username) = lower(${body.username})
      AND password = ${body.password}
  `;
  if (user === undefined) return c.json({ error: "INVALID_CREDENTIALS" });

  // The user_id check prevents changing another user's contact.
  const [contact] = await sql<Contact[]>`
    UPDATE contacts
    SET name = ${body.name}, email = ${body.email}, comment = ${body.comment}
    WHERE id = ${body.contactId} AND user_id = ${user.id}
    RETURNING id, name, email, comment
  `;

  if (contact === undefined) return c.json({ error: "CONTACT_ID_INVALID" });

  return c.json<UpdateContactResponse>({ error: null, contact });
}

export type UpdateContactRequest = {
  username: string;
  password: string;
  contactId: number;
  name: string;
  email: string;
  comment: string;
};

export type UpdateContactResponse = { error: string } | { error: null; contact: Contact };
