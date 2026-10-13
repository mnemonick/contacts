import type { Context } from "hono";
import sql from "%/utils/sql.ts";
import { isId, isObject, isText } from "%/utils/validate.ts";

export default async function (c: Context) {
  const body: unknown = await c.req.json().catch(() => null);

  if (!isObject(body)) return c.json({ error: "BODY_INVALID" });

  if (!isText(body.username)) return c.json<RemoveContactResponse>({ error: "USERNAME_REQUIRED" });
  if (!isText(body.password)) return c.json<RemoveContactResponse>({ error: "PASSWORD_REQUIRED" });
  if (!isId(body.contactId)) return c.json<RemoveContactResponse>({ error: "CONTACT_ID_REQUIRED" });

  const [user] = await sql`
    SELECT * FROM users
    WHERE lower(username) = lower(${body.username})
      AND password = ${body.password}
  `;
  if (user === undefined) return c.json({ error: "INVALID_CREDENTIALS" });

  // The user_id check prevents deleting another user's contact.
  const { count } = await sql`DELETE FROM contacts WHERE id = ${body.contactId} AND user_id = ${user.id}`;
  if (count === 0) return c.json({ error: "CONTACT_NOT_FOUND" });

  return c.json({ error: null });
}

export type RemoveContactRequest = {
  username: string;
  password: string;
  contactId: number;
};

export type RemoveContactResponse = {
  error: null | string;
};
