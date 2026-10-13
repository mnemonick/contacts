import type { Context } from "hono";
import sql from "%/utils/sql.ts";
import { isObject, isText } from "%/utils/validate.ts";
import { PASSWORD_MIN, USERNAME_MIN } from "%/handlers/create-user.ts";
import type { User } from "%/utils/types.ts";

export default async function (c: Context) {
  const body: unknown = await c.req.json().catch(() => undefined);

  if (!isObject(body)) return c.json<GetUserResponse>({ error: "BODY_INVALID" });

  if (!isText(body.username)) return c.json<GetUserResponse>({ error: "USERNAME_INVALID" });
  if (!isText(body.password)) return c.json<GetUserResponse>({ error: "PASSWORD_INVALID" });

  if (body.username.length < USERNAME_MIN) return c.json<GetUserResponse>({ error: "USERNAME_INCORRECT" });
  if (body.password.length < PASSWORD_MIN) return c.json<GetUserResponse>({ error: "PASSWORD_INCORRECT" });

  const rows = await sql`
    SELECT
      users.username,
      users.password,
      users.registration,
      contacts.id AS contact_id,
      contacts.name,
      contacts.email,
      contacts.comment
    FROM users
    LEFT JOIN contacts ON users.id = contacts.user_id
    WHERE lower(users.username) = lower(${body.username})
      AND users.password = ${body.password}
    ORDER BY contacts.id DESC
  `;

  if (rows.length === 0) {
    return c.json<GetUserResponse>({ error: "INVALID_CREDENTIALS" });
  }

  const user: User = {
    registration: rows[0].registration,
    username: rows[0].username,
    password: rows[0].password,
    contacts: []
  };

  // LEFT JOIN returns one row with NULL contact fields for a user without contacts.
  for (const row of rows) {
    if (row.name === null) continue;

    user.contacts.push({
      id: row.contactId,
      name: row.name,
      email: row.email,
      comment: row.comment
    });
  }

  return c.json<GetUserResponse>({ error: null, user });
}

export type GetUserRequest = {
  username: string;
  password: string;
};

export type GetUserResponse =
  | { error: null; user: User }
  | { error: string };
