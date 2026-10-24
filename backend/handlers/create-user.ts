import type { Context } from "hono";
import { PostgresError } from "pg-error-enum";
import postgres from "postgres";
import sql from "%/utils/sql.ts";
import { PASSWORD_MIN, USERNAME_MIN } from "%/utils/constants.ts";
import { isObject, isText } from "%/utils/validate.ts";

export default async function (c: Context) {
  const body: unknown = await c.req.json().catch(() => undefined);

  if (!isObject(body)) return c.json<CreateUserResponse>({ error: "BODY_INVALID" });

  if (!isText(body.username)) return c.json<CreateUserResponse>({ error: "USERNAME_INVALID" });
  if (!isText(body.password)) return c.json<CreateUserResponse>({ error: "PASSWORD_INVALID" });

  if (body.username.length < USERNAME_MIN) return c.json<CreateUserResponse>({ error: "USERNAME_INCORRECT" });
  if (body.password.length < PASSWORD_MIN) return c.json<CreateUserResponse>({ error: "PASSWORD_INCORRECT" });

  try {
    await sql`
      INSERT INTO users (username, password)
      VALUES (${body.username}, ${body.password})
    `;

    return c.json({ error: null });
  } catch (error) {
    if (error instanceof postgres.PostgresError && error.code === PostgresError.UNIQUE_VIOLATION) {
      return c.json<CreateUserResponse>({ error: "USERNAME_TAKEN" });
    }

    // Any other database error goes to app.onError.
    throw error;
  }
}

export type CreateUserRequest = {
  username: string;
  password: string;
};

export type CreateUserResponse = {
  error: null | string;
};
