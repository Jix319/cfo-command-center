# CFO Command Center - CTO Guide

This document is the permanent engineering policy for the repository. It changes rarely.

## 1. Product Definition

CFO Command Center is not a generic dashboard.

It is a CFO Operating System for observe / analyze / decide / act / report workflows.

Every feature should support one or more of those jobs.

## 2. Architectural Principles

### 2.1 Page Orchestrator Rule

Pages must orchestrate components, not implement features inline.

Good:

```text
Page -> Widget Components -> Shared Components
```

Bad:

```text
Page -> Large JSX block with business logic
```

### 2.2 Domain Folder Ownership

Use clear ownership by folder:

- `components/layout/` for shell and navigation
- `components/common/` for design system primitives
- `components/dashboard/` for dashboard-specific widgets
- `components/charts/` for reusable chart wrappers and chart implementations
- `pages/` for route-level composition
- `data/` for typed sample data or future static config
- `types/` for shared TypeScript contracts

### 2.3 Single Source of Truth

Avoid duplicated config.

Examples:
- Routes should come from one route registry.
- Navigation should map to the same registry.
- Shared chart wrapper should be used everywhere charts appear.

### 2.4 Reuse Before Create

Before introducing a new component, ask:
- Can an existing component handle this with props?
- Can this be extended safely?
- Can this be composed from `DashboardCard`, `SectionTitle`, `StatusBadge`, or `ActionButton`?

## 3. TypeScript Rules

- Keep TypeScript strict.
- Define explicit props interfaces.
- Prefer `ReactElement` return types for presentational components when practical.
- Avoid `any`.
- Avoid implicit `unknown`-to-`any` drift.
- Keep data contracts in `types/`.

## 4. UI Rules

- Tailwind only.
- No CSS framework additions.
- Maintain dark-mode compatibility.
- Use Lucide icons.
- Keep enterprise visual language:
  - restrained colors
  - strong hierarchy
  - minimal visual noise
  - subtle borders and shadows
  - compact spacing where appropriate

## 5. Routing Rules

- React Router is the application navigation layer.
- The sidebar should link to routes, not hardcoded states.
- Header title/breadcrumb should reflect the current route.
- New pages must be added through the central route registry.

## 6. Dashboard Rules

- `DashboardPage` stays as an orchestrator.
- KPIs belong in `components/dashboard/`.
- Operational widgets belong in `components/dashboard/`.
- Charts belong in `components/charts/`.
- Shared styling for charts must go through `ChartContainer`.

## 7. Chart Rules

- Use `ChartContainer` for every chart.
- Keep chart components thin and focused.
- Use typed sample data or typed service data.
- Do not embed business logic in chart renderers.
- Keep axis labels, tooltips, and grid styling consistent.

## 8. Data Rules

- Keep sample data in `data/`.
- Keep shape definitions in `types/`.
- Avoid hardcoding repeated values in component bodies.
- When a section needs multiple cards, drive it from arrays.

## 9. PR Discipline

Each PR must be:
- small enough to review
- one visible improvement
- buildable
- lint-clean
- easy to roll back

Avoid mixed-purpose PRs.

## 10. Copilot / Codex Rules

### 10.1 Prompt Discipline

- Give one implementation objective per prompt.
- Specify the exact files to create and modify.
- Tell the model not to scan the entire repository.
- Tell the model not to redesign architecture.
- Tell the model not to modify unrelated files.

### 10.2 Credit Discipline

- Use one coherent task per agent run.
- Prefer bundled work only when the work belongs to one domain.
- Do not waste runs on exploratory repo analysis.

### 10.3 Review Discipline

Before merge, verify:
- build passes
- lint passes
- UI renders correctly
- route behavior is correct
- files changed match scope
- handoff is updated

## 11. Stability Rules

Never change these lightly:
- layout shell pattern
- route registry architecture
- dashboard orchestrator pattern
- design system primitives
- chart wrapper standard
- TypeScript strictness
- Tailwind-only styling

## 12. Definition of Done

A change is done only when:
- implemented
- tested
- visually verified
- reviewed
- documented in HANDOFF.md
- committed and pushed

## 13. Future Direction

When the dashboard core is stable, move in this order:
1. Operational widgets
2. Treasury module
3. Collections module
4. Tables and filter components
5. Upload Centre
6. AI Assistant
7. Integrations
8. Board packs

## 14. Non-Negotiables

- No business logic in UI components.
- No duplicate primitives.
- No unreviewed architecture changes.
- No repository-wide scanning unless explicitly necessary.
- No merge before build and lint both pass.

**Last Updated**: 2026-06-18
