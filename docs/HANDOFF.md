# Finance OS - HANDOFF

## Current Version
v0.6 Real Estate Control Tower

## Product Vision
Finance OS for Real Estate CFOs.

Purpose:
- Observe
- Analyze
- Decide
- Act

Focus Areas:
- Collections
- Treasury
- Liquidity
- Blocked Cash
- RERA
- Escrow
- Project Funding
- Landowner Exposure

## Architecture

Domain
↓
Engines
↓
Pages
↓
UI

Rules:
- Business logic belongs in engines.
- Pages orchestrate engine outputs.
- UI contains no finance logic.
- No backend.
- No APIs.
- No Redux.

## Completed PRs

PR-017 Treasury Command Center
PR-018 Shared Enterprise Dataset
PR-019 Import Centre
PR-020 Morning Brief
PR-021 Scenario Simulator
PR-022 Real Estate Control Tower
PR-023 Project Funding Simulator

## Core Engines

- Collections
- Liquidity
- Bank Position
- Blocked Cash
- Treasury
- Morning Brief
- Scenario Simulator
- Project Control
- Project Funding

## Current Technical Debt

Project Funding Simulator route integration pending verification.

## Immediate Next Priority

PR-023A Navigation

Then:

PR-024 RERA & Escrow Workbench
PR-025 Landowner Settlement Manager
PR-026 Portfolio CFO Cockpit

## Rules

Never duplicate engine calculations.

Always run:

npm run build
npm run lint
