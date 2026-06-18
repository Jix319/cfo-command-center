# CFO Command Center - Handoff Document

## 1. Project Objective

Build an enterprise-grade CFO Command Center dashboard application as a React + Vite + TypeScript web application. The product is a CFO Operating System: a BI/analytics shell with an extensible component architecture, dark mode support, and Tailwind CSS styling.

The application is intentionally modular. Every feature should map to one of these jobs:

- Observe
- Analyze
- Decide
- Act
- Report

## 2. Current Architecture

- **Frontend Framework**: React 19 with TypeScript 6
- **Build Tool**: Vite 8.0.12
- **Styling**: Tailwind CSS v4.3.1 with PostCSS
- **UI Icons**: Lucide React v1.21.0
- **Component State**: Props-based (no Redux/Zustand)
- **Routing**: `react-router-dom` v7.18.0 implemented
- **Data Visualization**: Recharts v3.8.1 implemented for dashboard charts
- **Dark Mode**: Enabled by default via `class="dark"` on `<html>` in `index.html`
- **Entry Point**: `src/main.tsx` → `App.tsx` → `Layout.tsx`

## 3. Folder Structure

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── DashboardCard.tsx
│   │   └── index.ts
│   ├── common/
│   │   ├── MetricCard.tsx
│   │   ├── SectionTitle.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── ActionButton.tsx
│   │   └── EmptyState.tsx
│   ├── dashboard/
│   │   ├── ExecutiveKPIs.tsx
│   │   ├── KPIGrid.tsx
│   │   ├── KPIStatCard.tsx
│   │   ├── CriticalAlertsWidget.tsx
│   │   ├── UpcomingPaymentsWidget.tsx
│   │   └── RecentApprovalsWidget.tsx
│   └── charts/
│       ├── ChartContainer.tsx
│       ├── SalesTrendChart.tsx
│       └── CashFlowChart.tsx
├── pages/
│   ├── DashboardPage.tsx
│   ├── ProjectsPage.tsx
│   ├── SalesPage.tsx
│   ├── CollectionsPage.tsx
│   ├── TreasuryPage.tsx
│   ├── CompliancePage.tsx
│   ├── ReportsPage.tsx
│   ├── UploadPage.tsx
│   └── SettingsPage.tsx
├── config/
│   └── routes.ts
├── data/
│   ├── dashboardMetrics.ts
│   ├── chartData.ts
│   └── dashboardWidgets.ts
├── types/
│   ├── dashboard.ts
│   └── chart.ts
├── services/
├── hooks/
├── utils/
├── constants/
└── styles/
```

## 4. Implemented Components

### Layout Components (`src/components/layout/`)

- **Layout.tsx**
  - Main shell component that composes Sidebar, Header, and routed content
  - Uses route outlet pattern
  - Full viewport height, dark mode enabled
  - Main structure: sidebar (fixed 280px) + flex-1 main area

- **Sidebar.tsx**
  - Navigation sidebar with 280px width, dark background
  - Logo and subtitle
  - Navigation items with Lucide icons
  - Route-aware active state
  - Footer status section (Financial Controller, Online indicator)

- **Header.tsx**
  - Fixed height header with title and breadcrumb
  - Search box
  - Current date display
  - Notification bell icon
  - User avatar placeholder
  - Route-aware title support

- **DashboardCard.tsx**
  - Reusable card wrapper for dashboard sections
  - Accepts `title`, `children`, `className`
  - Used as a general-purpose dashboard shell card

### Common Design System Components (`src/components/common/`)

- **MetricCard.tsx**
  - KPI/metric display component
  - Supports icon, change indicator, and trend direction

- **SectionTitle.tsx**
  - Section header with optional action area

- **StatusBadge.tsx**
  - Status indicator badge with success/warning/error/info variants

- **ActionButton.tsx**
  - Reusable button with primary/secondary/ghost variants

- **EmptyState.tsx**
  - Empty state placeholder for no-data views

### Dashboard Components (`src/components/dashboard/`)

- **ExecutiveKPIs.tsx**
  - Renders the executive KPI section

- **KPIGrid.tsx**
  - Responsive grid wrapper for KPI cards

- **KPIStatCard.tsx**
  - Specialized KPI card presentation

- **CriticalAlertsWidget.tsx**
  - Operational alerts widget

- **UpcomingPaymentsWidget.tsx**
  - Operational payments widget

- **RecentApprovalsWidget.tsx**
  - Operational approvals widget

### Chart Components (`src/components/charts/`)

- **ChartContainer.tsx**
  - Standard wrapper for dashboard charts
  - Provides consistent title, subtitle, spacing, and card styling

- **SalesTrendChart.tsx**
  - Responsive Recharts line chart for sales trend

- **CashFlowChart.tsx**
  - Responsive Recharts area chart for cash flow

## 5. Pages Implemented

### DashboardPage.tsx

The dashboard now follows a structured layout:

- Executive KPI section
- Sales Trend chart
- Cash Flow chart
- Operational widgets section

`DashboardPage` is intentionally an orchestrator. It should not contain business logic.

### Routed Pages

The following pages exist as dedicated route targets:

- Projects
- Sales
- Collections
- Treasury
- Compliance
- Reports
- Upload
- Settings

These are the base for module-specific expansion.

## 6. Data and Types

### Data Files

- `src/data/dashboardMetrics.ts`
- `src/data/chartData.ts`
- `src/data/dashboardWidgets.ts`

These contain typed sample data only. No API integration yet.

### Types

- `src/types/dashboard.ts`
- `src/types/chart.ts`

These define the structures used by dashboard cards, metrics, and chart datasets.

## 7. Route System

Routing is implemented through a centralized route registry in `src/config/routes.ts`.

The sidebar, header, and page routing should all remain aligned with this route source of truth.

## 8. Completed Pull Requests

| PR | Title | Summary |
|----|-------|---------|
| PR-001 | Foundation | Application shell and base layout |
| PR-002 | Professional Shell | Enhanced shell styling and layout polish |
| PR-003 | Sidebar | Reusable sidebar component |
| PR-004 | Header | Reusable header component |
| PR-005 | Dashboard Framework | 12-column dashboard grid and card structure |
| PR-006 | Design System | MetricCard, SectionTitle, StatusBadge, ActionButton, EmptyState |
| PR-007 | Routing Foundation | React Router, route registry, routed layout, route-aware sidebar/header |
| PR-008 | Executive KPI Dashboard | KPI section with typed dashboard metrics |
| PR-009 | Executive Charts | ChartContainer plus sales and cash flow charts |

## 9. Current Build Status

- `npm run build` ✅ passes
- `npm run lint` ✅ passes

## 10. Known Issues / Technical Debt

| Issue | Location | Severity | Notes |
|-------|----------|----------|-------|
| Empty module pages | `src/pages/*` | Low | Most routed pages are placeholders |
| No backend integration | `services/` | Medium | Data is still sample data only |
| No form layer | `components/form/` | Low | Not created yet |
| No error boundary | `App.tsx` | Medium | Should be added before heavier feature work |
| No theme toggle | `Header.tsx` | Low | Dark mode is still forced by default |
| No lazy loading | Routes | Medium | Bundle splitting should be introduced later |

## 11. Coding Conventions Followed

- File naming: PascalCase for components
- Default exports for pages and named exports for shared components
- Type interfaces named `ComponentNameProps`
- Tailwind utility-first styling only
- Strong TypeScript typing throughout
- Reuse shared components before creating new ones
- No business logic in UI components
- Keep page components as orchestrators
- Every chart should use `ChartContainer`
- Every widget should use the design system where practical

## 12. Next Priority

### PR-010 — Operational Dashboard Widgets

Primary target:
- Replace the remaining operational placeholder cards with live-style widgets
- Keep DashboardPage as an orchestrator
- Reuse existing design system components
- Preserve the current dashboard hierarchy

Potential follow-up:
- Treasury module foundation
- Collections module foundation
- Shared table component
- Upload Centre
- AI Assistant

## 13. AI Development Rules

- Never redesign the architecture without explicit direction.
- Never scan the whole repository unless absolutely necessary.
- Only modify the files listed in the implementation task.
- Prefer extension over replacement.
- Reuse existing design system and chart wrapper components.
- Keep TypeScript strict.
- Use Tailwind only.
- Build and lint must pass before merge.
- Update this handoff after every approved PR.

**Last Updated**: 2026-06-18
**Ready for Handoff**: ✅ YES

## PR-010 — Operational Dashboard Widgets

Completed

- Critical Alerts widget
- Upcoming Payments widget
- Recent Approvals widget
- Typed widget data
- Widget type definitions
- Dashboard operational section completed

Current Dashboard

Executive KPIs

↓

Sales Trend

↓

Cash Flow

↓

Operational Widgets