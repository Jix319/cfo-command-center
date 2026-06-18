# Blocked Cash Engine

## Purpose

The Blocked Cash Engine determines how much of a project's requested RERA
withdrawal is currently withdrawable, how much is blocked, why it is blocked,
and the actions required to unlock it.

The engine contains pure TypeScript business logic and has no dependency on
React, APIs, routing, or application state.

## Inputs

`ProjectWithdrawalPosition` models the finance position used for evaluation:

- Project name
- RERA balance
- Booked expenses
- Pending vendor bills
- Architect certificate status
- CA certificate status
- Requested withdrawal
- Approved withdrawal

All monetary values are represented as numbers in the application's base
currency.

## Rules

Rules are defined independently in `rules.ts` and expose a reusable
`evaluate()` contract.

Current eligibility rules require:

- All vendor bills to be booked.
- An approved architect certificate.
- An approved CA certificate.
- The approved withdrawal not to exceed the available RERA balance.

The calculator also limits withdrawal to the lower of the requested amount,
approved amount, and RERA balance.

## Outputs

`evaluateProject()` returns:

- Withdrawable amount
- Blocked amount
- Blocked reasons
- Recommended actions
- Confidence level

Confidence is high when all eligibility rules pass, medium when one rule
fails, and low when multiple rules fail.

## Future SAP Integration

Future SAP integration can map project balances, booked costs, open vendor
items, and approval records into `ProjectWithdrawalPosition`. Certificate
statuses may come from a document workflow or compliance system.

The integration layer should remain outside this engine. It should normalize
SAP data before calling `evaluateProject()` so the calculation and rules stay
deterministic, testable, and independent of external systems.
