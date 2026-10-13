CREATE TABLE users (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username     TEXT NOT NULL,
    password     TEXT NOT NULL,
    registration TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usernames are unique regardless of case: "Egor" and "egor" are the same user.
CREATE UNIQUE INDEX users_username_index ON users (lower(username));

CREATE TABLE contacts (
    id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    TEXT NOT NULL,
    email   TEXT NOT NULL,
    comment TEXT NOT NULL DEFAULT '',
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Contacts are always looked up by their owner (get-user JOIN, update and delete checks).
CREATE INDEX contacts_user_id_index ON contacts (user_id);
