import type { ActiveSwaps } from '../domain/lunchSwap.ts'
import type { BlockNumber } from '../domain/rotation.ts'

const ACTIVE_SWAPS_KEY = 'zero-gluten:lunch-swaps'

export interface LunchSwapRepository {
  getSwaps(): ActiveSwaps
  setSwap(block: BlockNumber, recipeId: string | null): void
}

function readSwaps(storage: Pick<Storage, 'getItem' | 'setItem'>): ActiveSwaps {
  const raw = storage.getItem(ACTIVE_SWAPS_KEY)
  if (!raw) return {}

  try {
    return JSON.parse(raw) as ActiveSwaps
  } catch {
    return {}
  }
}

function writeSwaps(storage: Pick<Storage, 'getItem' | 'setItem'>, swaps: ActiveSwaps): void {
  storage.setItem(ACTIVE_SWAPS_KEY, JSON.stringify(swaps))
}

export function createLunchSwapRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): LunchSwapRepository {
  return {
    getSwaps() {
      return readSwaps(storage)
    },
    setSwap(block, recipeId) {
      const swaps = readSwaps(storage)
      if (recipeId === null) {
        delete swaps[block]
      } else {
        swaps[block] = recipeId
      }
      writeSwaps(storage, swaps)
    },
  }
}

export const lunchSwapRepository: LunchSwapRepository = createLunchSwapRepository(window.localStorage)
