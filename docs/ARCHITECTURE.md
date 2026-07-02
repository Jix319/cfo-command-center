# Finance OS - ARCHITECTURE

## Core Principle

Business Logic → Engines

Pages → Orchestrate

Components → Display

## Major Folders

src/demo
Shared enterprise sample data

src/engines
All finance calculations

src/components
Presentation layer

src/pages
Route orchestration

src/config
Routing and navigation

## Engine Inventory

bankPosition

blockedCash

collections

liquidity

treasury

morningBrief

scenarioSimulator

projectControl

projectFunding

## Rules

Do not place business logic in pages.

Do not place business logic in components.

Prefer consuming engine outputs instead of recalculating.
