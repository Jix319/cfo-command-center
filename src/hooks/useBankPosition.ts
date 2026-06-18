import { bankPositionEngine } from '../engines/bankPosition/calculator'
import { BANK_POSITION_SAMPLE_INPUT } from '../engines/bankPosition/sampleData'
import type { ScoreBand } from '../domain/core/Score'

export interface FinanceHealth {
  score: number
  trend: 'stable'
  status: ScoreBand
}

function getFinanceHealthStatus(score: number): ScoreBand {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'moderate'
  if (score >= 30) return 'weak'
  return 'critical'
}

export function useBankPosition() {
  return bankPositionEngine.evaluate(BANK_POSITION_SAMPLE_INPUT)
}

export function useFinanceHealth(
  blockedCashScore: number,
  bankPositionScore: number,
  liquidityScore: number,
): FinanceHealth {
  const score = Math.round(
    (blockedCashScore + bankPositionScore + liquidityScore) / 3,
  )

  return {
    score,
    trend: 'stable',
    status: getFinanceHealthStatus(score),
  }
}
