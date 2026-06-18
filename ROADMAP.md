# CFO Command Center - Roadmap

## Phase 1 — Foundation ✅
Completed:
- App shell
- Sidebar
- Header
- Dashboard framework
- Design system
- Routing foundation

## Phase 2 — Dashboard Experience ✅ / In Progress
Completed:
- Executive KPI Dashboard
- Executive charts

Next:
- Operational dashboard widgets
- Dashboard polish
- Better empty states
- Better loading states

## Phase 3 — Core Modules
Build each business module as a routed page with its own widgets and subcomponents.

### Treasury
- Cash position
- Bank balances
- Rolling forecast
- Debt schedule
- Liquidity view

### Collections
- Receivables aging
- DSO view
- Collector queue
- Promises to pay
- Escalations

### Sales
- Sales pipeline
- Closings
- Booking trends
- Target vs actual
- Channel performance

### Projects
- Project status
- Budget vs actual
- Cost-to-complete
- Milestone tracking
- Variance analysis

### Compliance
- GST / statutory trackers
- Filing calendar
- Exceptions
- Approvals
- Audit trail

## Phase 4 — Core Platform Features
- Shared table component
- Shared form inputs
- Date picker
- Filter bar
- Empty and error states
- Toast / notification system
- Theme toggle
- Mobile navigation refinement

## Phase 5 — Data and Integration Layer
- API service layer
- Typed endpoints
- Loading and error handling
- Mock data isolation
- Bank statement import flow
- Upload center backend hooks

## Phase 6 — Intelligence Layer
- AI assistant panel
- Document Q&A
- Upload processing pipeline
- Insight generation
- Board pack drafting

## Phase 7 — Enterprise Expansion
- ERP integrations
- SAP / Oracle / Tally connectors
- Approval workflows
- Role-based access
- Audit logging
- Export and scheduling

## Release Planning

### Current milestone
- v0.3.0: Dashboard core with routing, KPI section, charts, and operational widgets

### Next milestone
- v0.4.0: Core operational widgets and Treasury foundation

### Later milestones
- v0.5.0: Collections and Sales foundations
- v0.6.0: Tables, filters, and form primitives
- v0.7.0: Upload Centre and intelligence features
- v1.0.0: First production-ready CFO Operating System release

## Prioritization Rules

Prioritize work that:
- improves the CFO daily workflow
- creates reusable primitives
- reduces duplication
- strengthens the architecture
- makes the product visibly more useful

Avoid work that:
- adds one-off UI
- duplicates existing components
- introduces unnecessary abstractions
- expands scope inside a single PR without a strong reason

**Last Updated**: 2026-06-18
