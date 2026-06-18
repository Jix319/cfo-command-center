import { blockedCashEngine } from '../engines/blockedCash/calculator'
import { PROJECT_BLOCKED_BY_BILLS } from '../engines/blockedCash/sampleData'

export function useBlockedCash() {
  return blockedCashEngine.evaluate(PROJECT_BLOCKED_BY_BILLS)
}
