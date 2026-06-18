import type { FinanceEngine } from './FinanceEngine'

export interface RegisteredEngineDescriptor {
  id: string
  name: string
  version: string
}

type RegisteredFinanceEngine = FinanceEngine<unknown, unknown>

export class EngineRegistry {
  private readonly engines = new Map<string, RegisteredFinanceEngine>()

  register<TInput, TOutput>(
    engine: FinanceEngine<TInput, TOutput>,
  ): EngineRegistry {
    if (this.engines.has(engine.id)) {
      throw new Error(`Finance engine "${engine.id}" is already registered.`)
    }

    this.engines.set(engine.id, engine as RegisteredFinanceEngine)
    return this
  }

  unregister(engineId: string): boolean {
    return this.engines.delete(engineId)
  }

  has(engineId: string): boolean {
    return this.engines.has(engineId)
  }

  get<TInput, TOutput>(
    engineId: string,
  ): FinanceEngine<TInput, TOutput> | undefined {
    return this.engines.get(engineId) as
      | FinanceEngine<TInput, TOutput>
      | undefined
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

  list(): RegisteredEngineDescriptor[] {
    return Array.from(this.engines.values(), ({ id, name, version }) => ({
      id,
      name,
      version,
    }))
  }
}
