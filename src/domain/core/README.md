# Finance Domain Framework

## Purpose

This folder defines the platform contracts shared by all finance engines.
Liquidity, Collections, RERA, Payments, Banking, Compliance, and Project
Health engines can implement these contracts without depending on React,
routing, APIs, or presentation concerns.

## Finance Engine Contract

Every engine implements `FinanceEngine<TInput, TOutput>` and provides:

- A stable engine identifier
- A human-readable name
- A version
- An `evaluate()` method

Every evaluation returns `FinanceResult<TOutput>`.

## Standard Result

The common result structure contains:

- Engine metadata and evaluation timestamp
- A summary and normalized score
- Business decisions
- Actionable recommendations
- Identified risks
- Cash or finance improvement opportunities
- Engine-specific output

The engine-specific output remains generic while the decision layer stays
consistent across the platform.

## Registry

`EngineRegistry` stores engines by stable identifier and supports typed
registration and retrieval. No engines are registered by default. Application
composition should create a registry and explicitly register the engines it
needs.

## Domain Boundaries

- `core/` defines engine and result contracts.
- `entities/` defines lightweight finance-domain records.
- `valueObjects/` defines reusable typed financial values.

This framework contains no business calculations or integration logic.
