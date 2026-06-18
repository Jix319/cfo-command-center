# Blocked Cash Engine

## Purpose

The Blocked Cash Engine determines how much of a project's requested RERA
withdrawal is currently withdrawable, how much is blocked, why it is blocked,
and the actions required to unlock it.

The engine implements the shared `FinanceEngine` contract and contains pure
TypeScript business logic with no dependency on React, APIs, routing, or
application state.

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

`evaluateProject()` and `blockedCashEngine.evaluate()` return the shared
`FinanceResult` structure containing:

- A blocked cash output with withdrawable amount, blocked amount, blocked
  reasons, and recommended actions
- A withdrawal decision
- Structured recommendations
- Structured financial risks
- A normalized score and confidence level

The exported `blockedCashEngine` can be registered in `EngineRegistry` beside
future liquidity, collections, payment, and compliance engines.

## Future SAP Integration

Future SAP integration can map project balances, booked costs, open vendor
items, and approval records into `ProjectWithdrawalPosition`. Certificate
statuses may come from a document workflow or compliance system.

The integration layer should remain outside this engine. It should normalize
SAP data before calling `evaluateProject()` so the calculation and rules stay
deterministic, testable, and independent of external systems.
