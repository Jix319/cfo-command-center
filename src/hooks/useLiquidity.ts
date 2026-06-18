import { liquidityEngine } from '../engines/liquidity/calculator'
import { LIQUIDITY_SAMPLE_INPUT } from '../engines/liquidity/sampleData'

export function useLiquidity() {
  return liquidityEngine.evaluate(LIQUIDITY_SAMPLE_INPUT)
}
