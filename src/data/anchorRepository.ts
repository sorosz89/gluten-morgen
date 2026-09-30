const ANCHOR_KEY = 'zero-gluten:cycle-anchor'

export interface AnchorRepository {
  getAnchor(): string | null
  setAnchor(anchor: string): void
}

export function createAnchorRepository(storage: Pick<Storage, 'getItem' | 'setItem'>): AnchorRepository {
  return {
    getAnchor() {
      return storage.getItem(ANCHOR_KEY)
    },
    setAnchor(anchor) {
      storage.setItem(ANCHOR_KEY, anchor)
    },
  }
}

export const anchorRepository: AnchorRepository = createAnchorRepository(window.localStorage)
