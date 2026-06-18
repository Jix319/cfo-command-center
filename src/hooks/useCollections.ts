import { collectionsEngine } from '../engines/collections/calculator'
import { COLLECTIONS_SAMPLE_INPUT } from '../engines/collections/sampleData'

export function useCollections() {
  return collectionsEngine.evaluate(COLLECTIONS_SAMPLE_INPUT)
}
