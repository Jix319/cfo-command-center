# CFO Command Center

Enterprise-grade CFO Operating System built with React, Vite, TypeScript, Tailwind CSS, Lucide React, React Router, and Recharts.

## What it is

CFO Command Center is a modular finance operations shell designed to surface:
- executive KPIs
- cash and liquidity signals
- collections status
- approvals
- charts
- operational widgets

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Recharts
- Lucide React

## Current State

Implemented:
- App shell
- Sidebar
- Header
- Routed layout
- Executive KPI dashboard
- Executive charts
- Operational dashboard widgets foundation
- Shared design system

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Architecture Notes

- Pages orchestrate widgets.
- Widgets compose shared components.
- Business logic should stay outside UI where possible.
- Reusable primitives live in `src/components/common/`.
- Dashboard-specific widgets live in `src/components/dashboard/`.
- Charts live in `src/components/charts/`.
- Route definitions should come from `src/config/routes.ts`.

## Documentation

- `HANDOFF.md` — current implementation state
- `CTO_GUIDE.md` — permanent engineering rules
- `ROADMAP.md` — future feature plan
- `PROJECT_CONTEXT.md` — product vision and usage goals

## Build Status

Current build is expected to pass cleanly.

**Last Updated**: 2026-06-18
