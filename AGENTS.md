# Repository Guidelines

## Project Structure & Module Organization
Source routes live under `app/`, where each directory (for example `app/base64` or `app/ipcalc`) is a self-contained tool page using the Next.js App Router. Reusable UI such as `Navigation`, `LanguageSwitcher`, and every tool widget stays in `components/`, while shared context (currently `contexts/LanguageContext.tsx`) centralizes localization strings consumed via the `@/*` TypeScript path alias. Global styling and Tailwind tokens are configured through `app/globals.css` and `tailwind.config.ts`, and metadata or deployment tweaks reside in `SEO_GUIDE.md`, `next.config.js`, and `vercel.json`. Keep new assets colocated with the feature folder so feature-specific logic, styling, and copy review together.

## Build, Test, and Development Commands
- `npm run dev` – start the Next 15 dev server at `http://localhost:3000` with hot reload; ideal for building or adjusting a single tool page.
- `npm run build` – generate the optimized production bundle; run before shipping config or localization updates.
- `npm start` – serve the compiled bundle locally to sanity-check production behavior (routing, metadata, i18n).
- `npm run lint` – execute `next lint` with the repo ESLint rules; ensures TypeScript strictness and accessible JSX.

## Coding Style & Naming Conventions
TypeScript is strict-mode (`tsconfig.json`) with React 18 function components. Use 2-space indentation, trailing commas, and favor const/arrow components. File names match intent: route folders are lowercase (e.g., `app/qrcode`), shared components use `PascalCase.tsx`, hooks or helpers use camelCase. Tailwind classes should remain inlined on JSX elements; extract into small components if chains exceed three logical groups to preserve readability. Prefer native Web APIs or `crypto-js` utilities already included. Whenever a feature needs translations, extend the dictionaries in `LanguageContext` and reference the new keys via `useLanguage().t`.

## Testing Guidelines
Automated tests are limited to linting, so treat `npm run lint` as required pre-commit verification. For each tool, perform manual smoke tests: validate base/URL encoders with known sample strings, verify numeric converters with boundary data, and double-check formatters with malformed input. When adding a visual component, confirm both light/dark modes and responsive layouts using mobile and desktop widths in the dev server.

## Commit & Pull Request Guidelines
Existing history favors short, imperative commit subjects (“Update image URLs…”, “Add MyBatis tool…”). Continue that pattern, referencing the primary area first (`Add PasswordGenerator tool section`). PRs should summarize the feature, list affected routes or components, and link any tracked issue. Include before/after screenshots for UI changes and describe manual verification steps (commands run, tools exercised) so reviewers can reproduce the validation quickly.




너가 작성하는 모든 코드에 백엔드 출신이 내가 봐도 이해할 수 있는 수준의 자세한 문법과 로직의 주석을 작성해야한다.