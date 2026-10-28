# Contacts Manager

The project is available at **[contacts.koshelko.com](https://contacts.koshelko.com)**.

This is a demonstration of how I write code: architecture, frontend, backend, tests and deployment. The project was written by hand; neural networks were used only while learning.

The business logic is intentionally simple: users register and keep a list of contacts (create, edit, delete). The main criterion for choosing technologies is simplicity and minimalism.

## Stack

- **Frontend:** `TypeScript`, `React 19`, `Vite`, `wouter`, `zustand`. Styles are inline styles plus one global `Styles` component.
- **Backend:** `Bun`, `Hono`, `PostgreSQL`. Migrations are applied with `postgres-shift`. The client uses the backend types via `hono/client`.
- **Sender:** static file server on `Bun` + `Hono` with CSP and caching.
- **Tests:** `Playwright`, E2E only: tests act like a user and check what is visible on the page.
- **Quality:** `Biome` for linting, `tsc` for types.
- **CI/CD:** `GitHub Actions`. Build, lint, types, E2E tests and deployment over SSH.

## Structure

- `frontend/` - `React` app. Components in `components/`, API calls in `utils/client.ts`.
- `backend/` - `Hono` API. Handlers in `handlers/`, migrations in `migrations/`.
- `sender/` - static file server. The frontend is built into it.
- `tests/` - `Playwright` E2E tests in `specs/`.

## Running locally

### Requirements

- `Bun`, version 1.4.3
- `PostgreSQL` 18 on `localhost:5432`

### 1. Clone the project

```bash
git clone https://github.com/mnemonick/contacts.git
```

### 2. Install dependencies

```bash
bun install
```

### 3. Create the database

The backend connects to the `main` database on `localhost:5432` as the `postgres` user without a password.

```bash
createdb -U postgres main
```

### 4. Start the frontend in development mode

In the first terminal:

```bash
bunx vite build frontend --mode=development --watch
```

`Vite` rebuilds the project on every file change. The output goes to `sender/public`. The command keeps running until you stop it with Ctrl+C.

For a production build, run this once:

```bash
bunx vite build frontend --mode=production
```

### 5. Start the backend in development mode (port 5001)

In the second terminal:

```bash
bun --watch backend/backend.ts
```

Migrations are applied automatically on start.

### 6. Start the sender in development mode (port 5000)

In the third terminal:

```bash
bun --watch sender/sender.ts
```

### 7. Open the project

Open [http://localhost:5000](http://localhost:5000). The frontend calls the backend on port 5001 of the same host automatically.

## Tests

Requires the running backend and sender from steps 5 and 6.

```bash
bunx playwright install chromium
bunx playwright test --config tests/playwright.config.ts
```

Tests create data in the same `main` database.

## Code checks

```bash
bunx tsc -p frontend && bunx biome check frontend
bunx tsc -p backend && bunx biome check backend
```

## Deployment

`GitHub Actions` checks the project, runs the E2E tests and deploys it to the server over SSH. Settings are in `.github/workflows/workflow.yml`.
