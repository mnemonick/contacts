# Code conventions

## General
- Shared frontend/backend types (`User`, `Contact`) - in `backend/utils/types.ts`.
- New files are added to git staging (`git add <file>`) right after they are created.

## Frontend
- Styles - separate constants inside the component with the `$` prefix: `const $section: CSSProperties = {...}`. 
- Style constants are declared in the order their layers first appear in the markup.
- Reusable components (`Button`, `Input`, `Modal`) take a required `name` prop and render a custom tag with that name, so E2E tests locate them by tag: `<Input name="email-input" />` → `page.locator("email-input input")`.
- Translations - `const m = translate({...})` at the very bottom of the file, after the component.
- Lexeme - an `[en, ru]` pair, one paragraph per lexeme, terms wrapped in `<term>`.
- Shared limits (min lengths etc.) live in `backend/utils/constants.ts`, the frontend imports them via `%/`, like types.
- Every new component should be covered by E2E tests.

## Backend
- A handler validates the body itself via `typeof` and the helpers from `%/utils/validate.ts` and returns `{ error: "UPPER_SNAKE_CODE" }` or `{ error: null, ... }`.
- In handlers, exported types (`...Request`, `...Response`) go at the very bottom of the file, after the logic.
- SQL only via `` sql`...` ``; migrations - flat files `backend/migrations/NNNNN_name.sql` (five digits, numbered consecutively, no folders), applied by `postgres-shift`.
- Endpoints are `POST` only and always answer HTTP 200, an error is passed only in the `error` field.

## Tests
- Tests are strictly E2E, they act like a user and check only what is visible on the page.