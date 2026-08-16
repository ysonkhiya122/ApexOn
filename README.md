# ApexOn

A modern Formula 1 fan platform built as a product-first frontend application using React 19, TypeScript, Redux Toolkit, and RTK Query.

## Vision

Build a dynamic, user-focused Formula 1 platform for:

- beginners learning the sport,
- regular viewers following the season,
- hardcore fans exploring detailed race, rules, standings, history, audio, and interactive fan experiences.

This is not just a project demo. It is being designed as a scalable product.

## Core Goals

- Deliver a polished F1-themed UI/UX
- Fetch and present F1 data dynamically and efficiently
- Keep architecture clean, modular, and scalable
- Support both informational and interactive fan experiences
- Be frontend-first now, full-stack-ready later

## Main Pages

- Home
- About
- Rules / Regulations
- Results
- Schedule

## Planned Extended Features

- AI chat assistant
- Team radio playback
- Quiz, trivia, and game experiences
- Fan profile / personalization
- Backend caching and internal APIs in later phases

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit
- RTK Query
- Tailwind CSS
- Vitest (unit tests)
- ESLint + Prettier

## Data Sources

- Jolpica API for season, schedule, standings, results, historical race data
- OpenF1 API for telemetry-style and session-based data such as team radio, laps, stints, weather, and race control
- Internal JSON / DB later for history content, rule changes, images, and fan profile data

## Project Principles

- Atomic design: atoms → molecules → organisms → pages
- Feature-first architecture with shared design system
- RTK Query for remote server state
- Redux slices for UI/app state
- Reusable, typed, documented components
- Consistent loading, empty, and error states
- Accessibility and responsiveness are required, not optional

## Repo Setup

Requires Node 22+.

```bash
npm install
cp .env.example .env   # optional — sane defaults are baked in
npm run dev
```

## Scripts

| Script                  | Purpose                            |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Vite dev server                    |
| `npm run build`         | Typecheck then production build    |
| `npm run preview`       | Serve the production build locally |
| `npm run typecheck`     | `tsc --noEmit`                     |
| `npm run lint`          | ESLint (TS, react-hooks, jsx-a11y) |
| `npm run test`          | Vitest unit tests                  |
| `npm run test:coverage` | Tests with a V8 coverage report    |
| `npm run format`        | Prettier write                     |
| `npm run validate`      | Everything CI runs, in one command |

## Project Structure

```
src/
  app/          App shell, router, route path constants
  components/   Shared design system (atoms / molecules / organisms)
  modules/      Feature modules — each owns its pages and components
  store/        Redux store, slices, and RTK Query services
  services/api/ Adapters + normalized types (raw API -> view models)
  utils/        Pure helpers (season, leaderboard, timeline)
  locales/      Translation catalogues (en, es, fr, de)
```

**Data flow rule:** raw API payloads never reach components. RTK Query
`transformResponse` runs the adapters in `services/api/adapters`, and components
consume only the normalized types in `services/api/types/normalized.types.ts`.

## Seasons

Never hardcode a year. Import from `src/utils/season.ts`:

- `CURRENT_SEASON_TOKEN` (`'current'`) — resolved server-side by Jolpica, for live views
- `CURRENT_SEASON` — the calendar year as a string, for UI defaults
- `seasonOptions()` — descending list back to 1950 for year pickers

## Environment

Both API base URLs have working defaults; override via `.env` if you proxy them.
See `.env.example`.

## Continuous Integration

`.github/workflows/ci.yml` runs typecheck, lint, format check, tests, and a
production build on every push and pull request, and posts gzip bundle sizes to
the run summary.

## Working Style

- Every major feature must map to a documented requirement
- Every API integration must be wrapped in a service layer
- Every new feature should update docs if it changes structure or scope
- Do not introduce hidden patterns or undocumented shortcuts

## Current Scope

Frontend-first.
Backend caching, asset storage, auth, and fan persistence are later phases.

## Ownership

This repository is intended to be understandable by:

- engineering team
- UI/UX team
- deployment team
- QA team
- AI coding agents

All implementation should follow the documents in `/docs`.
