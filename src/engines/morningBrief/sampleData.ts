import { blockedCashEngine } from '../blockedCash/calculator'
import { PROJECT_BLOCKED_BY_BILLS } from '../blockedCash/sampleData'
import { collectionsEngine } from '../collections/calculator'
import { COLLECTIONS_SAMPLE_INPUT } from '../collections/sampleData'
import { liquidityEngine } from '../liquidity/calculator'
import { LIQUIDITY_SAMPLE_INPUT } from '../liquidity/sampleData'
import { treasuryEngine } from '../treasury/calculator'
import { TREASURY_SAMPLE_INPUT } from '../treasury/sampleData'
import type { MorningBriefInput } from './types'

const treasury = treasuryEngine.evaluate(TREASURY_SAMPLE_INPUT)
const collections = collectionsEngine.evaluate(COLLECTIONS_SAMPLE_INPUT)
const blockedCash = blockedCashEngine.evaluate(PROJECT_BLOCKED_BY_BILLS)
const liquidity = liquidityEngine.evaluate(LIQUIDITY_SAMPLE_INPUT)

export const MORNING_BRIEF_SAMPLE_INPUT: MorningBriefInput = {
  generatedAt: TREASURY_SAMPLE_INPUT.asOfDate,
  treasury,
  collections,
  blockedCash,
  liquidity,
}
