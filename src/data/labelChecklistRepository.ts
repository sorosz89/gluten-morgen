const CHECKED_PRODUCTS_KEY = 'zero-gluten:label-checklist'

export interface LabelChecklistRepository {
  isChecked(product: string): boolean
  setChecked(product: string, checked: boolean): void
}

function readCheckedProducts(storage: Pick<Storage, 'getItem' | 'setItem'>): Record<string, true> {
  const raw = storage.getItem(CHECKED_PRODUCTS_KEY)
  if (!raw) return {}

  try {
    return JSON.parse(raw) as Record<string, true>
  } catch {
    return {}
  }
}

function writeCheckedProducts(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  products: Record<string, true>,
): void {
  storage.setItem(CHECKED_PRODUCTS_KEY, JSON.stringify(products))
}

export function createLabelChecklistRepository(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): LabelChecklistRepository {
  return {
    isChecked(product) {
      return readCheckedProducts(storage)[product] ?? false
    },
    setChecked(product, checked) {
      const products = readCheckedProducts(storage)
      if (checked) {
        products[product] = true
      } else {
        delete products[product]
      }
      writeCheckedProducts(storage, products)
    },
  }
}

export const labelChecklistRepository: LabelChecklistRepository =
  createLabelChecklistRepository(window.localStorage)
