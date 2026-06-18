# Bank Position Engine

## Purpose

The Bank Position Engine answers one CFO question:

> How much cash does the group actually have available today?

It evaluates bank balances, account restrictions, and committed OD, CC, and
DLOD headroom. It does not evaluate invoices, collections performance, RERA
certification, GST compliance, payment scheduling, or dashboard concerns.

## Inputs

`BankPositionInput` contains:

- Group reporting currency and as-of date
- Domain `LegalEntity` and `Project` references
- Domain `BankAccount` records paired with current balances and account
  purposes
- Account restrictions, including RERA, liens, lender, statutory, internal,
  and legal restrictions
- Domain `CreditFacility` records classified as OD, CC, or DLOD

All monetary values must be normalized into the reporting currency before
evaluation. The engine rejects mixed-currency input.

## Outputs

The engine returns the standard domain `FinanceResult<BankPositionSummary>`
with:

- Total bank balance
- Available cash
- Restricted cash
- Total borrowing capacity
- OD, CC, and DLOD availability
- Net deployable cash
- Aggregated cash buckets
- Score, risks, opportunities, recommendations, decisions, and evaluation
  metadata

## Calculation Approach

- Total bank balance is the net sum of account balances.
- Available cash is positive bank balances less restricted cash.
- Inherently restricted Escrow, RERA70, GST, and TRA accounts are treated as
  fully restricted.
- Explicit restrictions use their stated restricted amount. A restriction
  without an amount restricts the full positive account balance.
- Borrowing capacity is active sanctioned OD, CC, and DLOD limits less current
  utilization.
- Net deployable cash is available cash plus borrowing capacity.
- Cash buckets group accounts into operating, restricted, escrow, borrowed,
  and collection views. Restricted cash is an overlay and may include accounts
  represented in another purpose bucket.
- The 0–100 score combines available cash ratio, restricted cash ratio,
  borrowing headroom, and OD utilization.

## Future SAP Integration

An SAP adapter can map bank GL balances, house banks, company codes, projects,
and loan records into `BankPositionInput`. Currency conversion and source-data
reconciliation must occur before calling the engine.

## Future Bank API Integration

Bank API adapters can provide intraday account balances, liens, and facility
utilization. The adapter should normalize bank-specific payloads into the
engine input without introducing API concerns into the calculator.

## Known Assumptions

- Monetary values use minor currency units.
- Input contains one reporting currency.
- Positive balances represent cash held; negative balances reduce total bank
  balance.
- Available borrowing capacity is deployable but is not counted as bank cash.
- Facility pricing, covenants, and drawdown timing are outside this engine.
- Account restrictions are assumed current as of the supplied evaluation date.
