# Testing

This project uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit and integration tests.

## Running Tests

- Run all tests:
  ```sh
  npm run test
  ```
- Watch tests:
  ```sh
  npm run test:watch
  ```
- Coverage report:
  ```sh
  npm run test:coverage
  ```

## Test Structure

- All test files are in `src/__tests__` mirroring the source structure.
- Component tests: `src/__tests__/components/`
- API tests: `src/__tests__/api/`
- Store/state tests: `src/__tests__/store/` (if needed)

## Mocking

- API calls are mocked using Vitest/vi or Jest mocks.
- Store (Zustand) is mocked for component tests.

## Coverage

- Coverage reports are generated in the `coverage/` folder after running `npm run test:coverage`.

## Adding Tests

- Place new tests in the appropriate folder under `src/__tests__`.
- Use React Testing Library for UI/component tests.
- Use vi/jest mocks for API and store mocking.
# React + TypeScript + Vite

## Remote Kanban API (Lab)

This app fetches boards/columns/tasks from a remote endpoint on first load.

- Create a `.env` file (see `.env.example`)
- Set `VITE_KANBAN_BOARDS_URL` to an endpoint that returns either:
  - an array of boards: `[{ name, columns: [{ name, tasks: [...] }] }]`, or
  - an object: `{ boards: [...] }`

Quick mock option: MockAPI.io

- Create a project + a `boards` resource
- Seed it with items shaped like your `Board` type (nested `columns` and `tasks`)
  - You can use the sample data in `docs/mockapi/boards.seed.json`
- Use the generated endpoint URL as `VITE_KANBAN_BOARDS_URL` (example):
  - `https://<project>.mockapi.io/api/v1/boards`

Optional: set `VITE_API_DELAY_MS=1500` to test loading states.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
