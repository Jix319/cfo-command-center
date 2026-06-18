# Liquidity Engine

## Purpose

The Liquidity Engine answers:

> Will the group have sufficient deployable cash to meet all obligations over
> the selected planning horizon?

It combines the Bank Position summary with forecast inflows, financial
obligations, and active credit facilities. It contains no UI, API, routing, or
operational workflow logic.

## Inputs

`LiquidityInput` supports:

- Bank Position summary
- Cash buckets
- Financial obligations
- Forecast cash inflows
- Credit facilities
- Planning horizons of Today, 7 Days, 15 Days, 30 Days, and 90 Days

Committed and probable inflows are included. Possible inflows are excluded
from the base liquidity forecast. Overdue obligations remain in scope.

## Outputs

The standard `FinanceResult<LiquiditySummary>` contains:

- Opening cash
- Expected inflows and outflows
- Projected closing cash before new borrowing
- Funding gap after available borrowing
- Liquidity coverage ratio
- Borrowing headroom
- Cash runway
- Green, Amber, or Red liquidity status
- Risks, opportunities, recommendations, decisions, and score

## Calculation Approach

- Opening cash uses available cash from the Bank Position Engine.
- Expected inflows and obligations are filtered to the selected horizon.
- Projected closing cash equals opening cash plus inflows less outflows.
- Borrowing headroom equals undrawn active credit facilities.
- Funding gap equals obligations not covered by cash, inflows, and headroom.
- Liquidity coverage compares total liquidity resources with obligations.
- Cash runway uses average daily forecast outflows and excludes new borrowing.

## Status Rules

- Red: funding gap, negative projected cash, or coverage below 1.0.
- Amber: coverage from 1.0 up to 1.2.
- Green: coverage of at least 1.2 with no funding gap or negative projected
  cash.

## Assumptions

- All amounts are normalized to one reporting currency.
- Monetary values use minor currency units.
- Forecast timing is represented by ISO date strings.
- Credit facilities are assumed drawable when active.
- Facility covenants, pricing, and drawdown processing are outside this
  engine.
- Cash buckets are accepted for downstream traceability but opening liquidity
  is sourced from the Bank Position summary to avoid double counting.
