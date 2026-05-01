# F1 Hub

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
- Framer Motion

## Data Sources

- Jolpica API for season, schedule, standings, results, historical race data
- OpenF1 API for telemetry-style and session-based data such as team radio, laps, stints, weather, and race control
- Internal JSON / DB later for history content, rule changes, images, and fan profile data

## Documentation Map

Read in this order:

1. `docs/AI_AGENT_MASTER_BRIEF.md`
2. `docs/PRODUCT_REQUIREMENTS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/API_SOURCES.md`
5. `docs/UI_UX_BRIEF.md`
6. `docs/IMPLEMENTATION_PLAN.md`
7. `docs/ROLE_HANDOFFS.md`
8. `docs/DEPLOYMENT_RUNBOOK.md`

## Project Principles

- Atomic design: atoms → molecules → organisms → pages
- Feature-first architecture with shared design system
- RTK Query for remote server state
- Redux slices for UI/app state
- Reusable, typed, documented components
- Consistent loading, empty, and error states
- Accessibility and responsiveness are required, not optional

## Repo Setup

```bash
npm install
npm run dev
```

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
