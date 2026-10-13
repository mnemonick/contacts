CREATE TABLE users (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username     TEXT NOT NULL,
    password     TEXT NOT NULL,
    registration TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE contacts (
    id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    TEXT NOT NULL,
    email   TEXT NOT NULL,
    comment TEXT NOT NULL DEFAULT '',
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX users_username_index ON users (lower(username));
CREATE INDEX contacts_user_id_index ON contacts (user_id);
