import { treasuryEngine } from '../engines/treasury/calculator'
import { TREASURY_SAMPLE_INPUT } from '../engines/treasury/sampleData'
import type { TreasuryResult } from '../engines/treasury/types'

export function useTreasury(): TreasuryResult {
  return treasuryEngine.evaluate(TREASURY_SAMPLE_INPUT)
}
