import type { FinanceEngine } from './FinanceEngine'
import type { FinanceResult } from './FinanceResult'

interface RegisteredFinanceEngine {
  id: string
  name: string
  version: string
  evaluate: (input: unknown) => FinanceResult<unknown>
}

export class EngineRegistry {
  private readonly engines = new Map<string, RegisteredFinanceEngine>()

  register<TInput, TOutput>(
    engine: FinanceEngine<TInput, TOutput>,
  ): EngineRegistry {
    if (this.engines.has(engine.id)) {
      throw new Error(`Finance engine "${engine.id}" is already registered.`)
    }

    this.engines.set(engine.id, {
      id: engine.id,
      name: engine.name,
      version: engine.version,
      evaluate: (input: unknown): FinanceResult<unknown> =>
        engine.evaluate(input as TInput),
    })

    return this
  }

  has(engineId: string): boolean {
    return this.engines.has(engineId)
  }

  get<TInput, TOutput>(
    engineId: string,
  ): FinanceEngine<TInput, TOutput> | undefined {
    const engine = this.engines.get(engineId)

    if (!engine) {
      return undefined
    }

    return {
      id: engine.id,
      name: engine.name,
      version: engine.version,
      evaluate: (input: TInput): FinanceResult<TOutput> =>
        engine.evaluate(input) as FinanceResult<TOutput>,
    }
  }

  getRequired<TInput, TOutput>(
    engineId: string,
  ): FinanceEngine<TInput, TOutput> {
    const engine = this.get<TInput, TOutput>(engineId)

    if (!engine) {
      throw new Error(`Finance engine "${engineId}" is not registered.`)
    }

    return engine
  }

  list(): ReadonlyArray<{
    id: string
    name: string
    version: string
  }> {
    return Array.from(this.engines.values(), ({ id, name, version }) => ({
      id,
      name,
      version,
    }))
  }
}
