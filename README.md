# Contacts Manager

The project is available at **[contacts.koshelko.com](https://contacts.koshelko.com)**.

This is a demonstration of how I write code: architecture, frontend, backend, tests and deployment. The project was written by hand, neural networks were used only while learning.

The business logic is intentionally simple: users register and keep a list of contacts (create, edit, delete). The main criterion for choosing technologies is simplicity and minimalism.

## Stack

- **Frontend:** `TypeScript`, `React 19`, `Vite`, `wouter`, `zustand`.
- **Backend:** `Bun`, `Hono`, `PostgreSQL`. Migrations are applied with `postgres-shift`. 
- **Sender:** static file server on `Bun` + `Hono` with CSP and caching.
- **Tests:** `Playwright`.
- **Quality:** `Biome` for linting, `tsc` for types.
- **CI/CD:** `GitHub Actions`. Build, lint, types, E2E tests and deployment over SSH.

## Structure

- `frontend/` - `React` app. Components in `components/`, API calls in `utils/client.ts`.
- `backend/` - `Hono` API. Handlers in `handlers/`, migrations in `migrations/`.
- `sender/` - static file server. The frontend is built into it.
- `tests/` - `Playwright` E2E tests in `specs/`.

## Development

### Requirements

- `Bun`, version 1.4.3
- `PostgreSQL` 18 on `localhost:5432`

### Clone the project

```bash
git clone https://github.com/mnemonick/contacts.git
```

### Install dependencies

```bash
bun install
```

### Create the database

The backend connects to the `main` database on `localhost:5432` as the `postgres` user without a password.

```bash
createdb -U postgres main
```

### Install the Playwright browser

```bash
bunx playwright install chromium
```

### Run the E2E tests

Requires the backend and the sender running in development mode (commands 1 and 3 below).

```bash
bunx playwright test --config tests/playwright.config.ts
```

Tests create data in the same `main` database.

## Commands

Run all commands from the project root. Commands 1 to 3 keep running, so start each one in its own terminal.

### 1. Run the sender in development mode (port 5000)

```bash
bun --watch sender/sender.ts
```

### 2. Run the frontend in development mode

```bash
bunx vite build frontend --mode=development --watch
```

`Vite` rebuilds the frontend on every file change. The output goes to `sender/public`.

### 3. Run the backend in development mode (port 5001)

```bash
bun --watch backend/backend.ts
```

Migrations are applied automatically on start.

Open [http://localhost:5000](http://localhost:5000). The frontend calls the backend on port 5001 of the same host automatically.

### 4. Run the sender in production

```bash
bun sender/sender.ts
```

The server runs this command as the `sender.contacts` systemd service (`sender/sender.contacts.service`). The sender serves the frontend from `sender/public`.

### 5. Build the frontend for production

```bash
bunx vite build frontend --mode=production
```

### 6. Run the backend in production

```bash
bun backend/backend.ts
```

The server runs this command as the `backend.contacts` systemd service (`backend/backend.contacts.service`). On Linux without the `CI` variable, the backend reads Let's Encrypt certificates for `koshelko.com`, so run it in production only on the server.

### 7. Type checks

```bash
bunx tsc -p frontend
bunx tsc -p backend
```

### 8. Linting

```bash
bunx biome check frontend
bunx biome check backend
```