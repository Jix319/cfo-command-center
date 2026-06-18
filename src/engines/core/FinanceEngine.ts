import type { FinanceResult } from './FinanceResult'

export interface FinanceEngine<TInput, TOutput> {
  readonly id: string
  readonly name: string
  readonly version: string
  evaluate(input: TInput): FinanceResult<TOutput>
}
