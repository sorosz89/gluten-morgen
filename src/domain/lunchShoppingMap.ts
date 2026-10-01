import type { ActiveSwaps } from './lunchSwap.ts'
import { getActiveLunchId } from './lunchSwap.ts'
import type { Recipe } from './recipe.ts'
import { BLOCK_RECIPE_IDS } from './rotation.ts'
import type { BlockNumber } from './rotation.ts'
import type { ShoppingItem, ShoppingTrip, ShoppingUnit, TripId } from './shoppingList.ts'

export type ShoppingPlacement = 'pantry' | 'fresh'

export interface ShoppingContribution {
  recipeId: string
  ingredientName: string // exact `name` field as stored in recipes.json
  placement: ShoppingPlacement
  category: string // existing category heading in that trip
  shoppingItemName: string // clean name to merge into, or create as a new item
}

const PANTRY = 'pantry'
const FRESH = 'fresh'

// "zsír" (the 4 rotation lunch recipes) and "zsiradék"/"olívaolaj" (the shopping
// list and the 5 alternatives) are the same purchasable cooking-fat product, by
// product decision — see plan.md.
const ZSIRADEK_ROW = (recipeId: string, ingredientName: string): ShoppingContribution => ({
  recipeId,
  ingredientName,
  placement: PANTRY,
  category: 'Száraz áru, konzerv, egyéb',
  shoppingItemName: 'zsiradék (kókuszzsír / sertészsír / sütésre alkalmas olaj)',
})

export const LUNCH_SHOPPING_MAP: ShoppingContribution[] = [
  // Gulyásleves (block 1 default)
  {
    recipeId: 'gf-ebed-gulyasleves',
    ingredientName: 'pörköltnek való sovány hús',
    placement: PANTRY,
    category: 'Hús, tojás',
    shoppingItemName: 'pörköltnek való sovány hús',
  },
  {
    recipeId: 'gf-ebed-gulyasleves',
    ingredientName: 'burgonya',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'burgonya',
  },
  {
    recipeId: 'gf-ebed-gulyasleves',
    ingredientName: 'leveszöldség',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'leveszöldség',
  },
  {
    recipeId: 'gf-ebed-gulyasleves',
    ingredientName: 'vöröshagyma',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'vöröshagyma',
  },
  {
    recipeId: 'gf-ebed-gulyasleves',
    ingredientName: 'paradicsom',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'paradicsom',
  },
  ZSIRADEK_ROW('gf-ebed-gulyasleves', 'zsír (kókuszzsír'),
  {
    recipeId: 'gf-ebed-gulyasleves',
    ingredientName: 'gluténmentes kenyér (a levesbetéthez)',
    placement: PANTRY,
    category: 'Gluténmentes speciális termékek',
    shoppingItemName: 'gluténmentes kenyér/zsemle',
  },

  // Húsos zöldséges passata (block 2 default)
  {
    recipeId: 'gf-ebed-husos-zoldseges-passata',
    ingredientName: 'darált hús (10% zsírtartalom alatt – sertés',
    placement: PANTRY,
    category: 'Hús, tojás',
    shoppingItemName: 'darált hús',
  },
  {
    recipeId: 'gf-ebed-husos-zoldseges-passata',
    ingredientName: 'paradicsom passata / passzírozott paradicsom',
    placement: PANTRY,
    category: 'Száraz áru, konzerv, egyéb',
    shoppingItemName: 'paradicsom passata',
  },
  {
    recipeId: 'gf-ebed-husos-zoldseges-passata',
    ingredientName: 'sárgarépa',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'sárgarépa',
  },
  {
    recipeId: 'gf-ebed-husos-zoldseges-passata',
    ingredientName: 'cukkini',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'cukkini',
  },
  {
    recipeId: 'gf-ebed-husos-zoldseges-passata',
    ingredientName: 'csicseriborsó (konzerv',
    placement: PANTRY,
    category: 'Száraz áru, konzerv, egyéb',
    shoppingItemName: 'csicseriborsó (konzerv)',
  },
  ZSIRADEK_ROW('gf-ebed-husos-zoldseges-passata', 'zsír'),

  // Savanyú lencseleves (block 3 default)
  {
    recipeId: 'gf-ebed-savanyu-lencseleves',
    ingredientName: 'pörköltnek való sovány hús',
    placement: PANTRY,
    category: 'Hús, tojás',
    shoppingItemName: 'pörköltnek való sovány hús',
  },
  {
    recipeId: 'gf-ebed-savanyu-lencseleves',
    ingredientName: 'száraz lencse',
    placement: PANTRY,
    category: 'Száraz áru, konzerv, egyéb',
    shoppingItemName: 'lencse (száraz)',
  },
  {
    recipeId: 'gf-ebed-savanyu-lencseleves',
    ingredientName: 'leveszöldség',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'leveszöldség',
  },
  {
    recipeId: 'gf-ebed-savanyu-lencseleves',
    ingredientName: 'burgonya',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'burgonya',
  },
  {
    recipeId: 'gf-ebed-savanyu-lencseleves',
    ingredientName: 'tejföl (12%) (csere: vegán tejföl)',
    placement: FRESH,
    category: 'Tejtermékek',
    shoppingItemName: 'tejföl (12%)',
  },
  ZSIRADEK_ROW('gf-ebed-savanyu-lencseleves', 'zsír'),
  {
    recipeId: 'gf-ebed-savanyu-lencseleves',
    ingredientName: 'gluténmentes kenyér (a tálaláshoz)',
    placement: PANTRY,
    category: 'Gluténmentes speciális termékek',
    shoppingItemName: 'gluténmentes kenyér/zsemle',
  },

  // Paradicsomos húsgombóc (block 4 default)
  // Note: "M-es tojás" (50 g) is deliberately NOT mapped — the shopping list's only
  // egg item ("tojás (M-es)") is counted in db, an incompatible unit with no safe
  // arithmetic merge. See lunchShoppingMap.test.ts's completeness test.
  {
    recipeId: 'gf-ebed-paradicsomos-husgomboc',
    ingredientName: 'darált hús (10% zsírtartalom alatt)',
    placement: PANTRY,
    category: 'Hús, tojás',
    shoppingItemName: 'darált hús',
  },
  {
    recipeId: 'gf-ebed-paradicsomos-husgomboc',
    ingredientName: 'gluténmentes (GM) zabpehely (kötőanyagként)',
    placement: PANTRY,
    category: 'Gluténmentes speciális termékek',
    shoppingItemName: 'gluténmentes (GM) zabpehely',
  },
  {
    recipeId: 'gf-ebed-paradicsomos-husgomboc',
    ingredientName: 'vöröshagyma',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'vöröshagyma',
  },
  {
    recipeId: 'gf-ebed-paradicsomos-husgomboc',
    ingredientName: 'paradicsom passata',
    placement: PANTRY,
    category: 'Száraz áru, konzerv, egyéb',
    shoppingItemName: 'paradicsom passata',
  },
  {
    recipeId: 'gf-ebed-paradicsomos-husgomboc',
    ingredientName: 'rizs (csak ez',
    placement: PANTRY,
    category: 'Száraz áru, konzerv, egyéb',
    shoppingItemName: 'rizs',
  },
  ZSIRADEK_ROW('gf-ebed-paradicsomos-husgomboc', 'zsír'),

  // [Alternatíva] Csirkés rizses egytálétel zöldségekkel
  {
    recipeId: 'gf-alternativ-csirkes-rizses-egytal',
    ingredientName: 'csirkemell',
    placement: FRESH,
    category: 'Hús, hal, tojás',
    shoppingItemName: 'csirkemell',
  },
  {
    recipeId: 'gf-alternativ-csirkes-rizses-egytal',
    ingredientName: 'rizs',
    placement: PANTRY,
    category: 'Száraz áru, konzerv, egyéb',
    shoppingItemName: 'rizs',
  },
  {
    recipeId: 'gf-alternativ-csirkes-rizses-egytal',
    ingredientName: 'sárgarépa',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'sárgarépa',
  },
  {
    recipeId: 'gf-alternativ-csirkes-rizses-egytal',
    ingredientName: 'fagyasztott zöldborsó',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'fagyasztott zöldborsó',
  },
  {
    recipeId: 'gf-alternativ-csirkes-rizses-egytal',
    ingredientName: 'piros paprika',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'piros paprika',
  },
  {
    recipeId: 'gf-alternativ-csirkes-rizses-egytal',
    ingredientName: 'vöröshagyma',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'vöröshagyma',
  },
  ZSIRADEK_ROW('gf-alternativ-csirkes-rizses-egytal', 'zsiradék'),

  // [Alternatíva] Fokhagymás-citromos sertésszelet burgonyapürével és sárgarépával
  {
    recipeId: 'gf-alternativ-sertesszelet',
    ingredientName: 'sertésszelet',
    placement: FRESH,
    category: 'Hús, hal, tojás',
    shoppingItemName: 'sertésszelet',
  },
  {
    recipeId: 'gf-alternativ-sertesszelet',
    ingredientName: 'burgonya',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'burgonya',
  },
  {
    recipeId: 'gf-alternativ-sertesszelet',
    ingredientName: 'sárgarépa',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'sárgarépa',
  },
  {
    recipeId: 'gf-alternativ-sertesszelet',
    ingredientName: 'vaj (a püréhez)',
    placement: FRESH,
    category: 'Tejtermékek',
    shoppingItemName: 'vaj',
  },
  ZSIRADEK_ROW('gf-alternativ-sertesszelet', 'zsiradék (olívaolaj'),
  {
    recipeId: 'gf-alternativ-sertesszelet',
    ingredientName: 'tej (a püréhez)',
    placement: FRESH,
    category: 'Tejtermékek',
    shoppingItemName: 'tej',
  },

  // [Alternatíva] Sült csirkemell rizzsel és sült zöldségekkel
  {
    recipeId: 'gf-alternativ-sult-csirke-rizs',
    ingredientName: 'csirkemell',
    placement: FRESH,
    category: 'Hús, hal, tojás',
    shoppingItemName: 'csirkemell',
  },
  {
    recipeId: 'gf-alternativ-sult-csirke-rizs',
    ingredientName: 'rizs',
    placement: PANTRY,
    category: 'Száraz áru, konzerv, egyéb',
    shoppingItemName: 'rizs',
  },
  {
    recipeId: 'gf-alternativ-sult-csirke-rizs',
    ingredientName: 'sárgarépa',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'sárgarépa',
  },
  {
    recipeId: 'gf-alternativ-sult-csirke-rizs',
    ingredientName: 'cukkini',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'cukkini',
  },
  ZSIRADEK_ROW(
    'gf-alternativ-sult-csirke-rizs',
    'zsiradék (olívaolaj vagy más sütésre alkalmas olaj – a csirkéhez és a zöldségekhez elosztva)',
  ),

  // [Alternatíva] Sült lazacfilé citromos burgonyapürével és gőzölt brokkolival
  {
    recipeId: 'gf-alternativ-sult-lazac',
    ingredientName: 'lazacfilé',
    placement: FRESH,
    category: 'Hús, hal, tojás',
    shoppingItemName: 'lazacfilé',
  },
  {
    recipeId: 'gf-alternativ-sult-lazac',
    ingredientName: 'burgonya',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'burgonya',
  },
  {
    recipeId: 'gf-alternativ-sult-lazac',
    ingredientName: 'brokkoli',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'brokkoli',
  },
  {
    recipeId: 'gf-alternativ-sult-lazac',
    ingredientName: 'vaj (a püréhez)',
    placement: FRESH,
    category: 'Tejtermékek',
    shoppingItemName: 'vaj',
  },
  ZSIRADEK_ROW('gf-alternativ-sult-lazac', 'zsiradék (olívaolaj'),
  {
    recipeId: 'gf-alternativ-sult-lazac',
    ingredientName: 'tej (a püréhez)',
    placement: FRESH,
    category: 'Tejtermékek',
    shoppingItemName: 'tej',
  },
  {
    recipeId: 'gf-alternativ-sult-lazac',
    ingredientName: 'citrom (leve + esetleg karikák a tálaláshoz)',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'citrom',
  },

  // [Alternatíva] Tonhalas gluténmentes tésztasaláta zöldségekkel
  {
    recipeId: 'gf-alternativ-tonhalas-tesztasalata',
    ingredientName: 'gluténmentes tészta (rizs-',
    placement: PANTRY,
    category: 'Gluténmentes speciális termékek',
    shoppingItemName: 'gluténmentes tészta',
  },
  {
    recipeId: 'gf-alternativ-tonhalas-tesztasalata',
    ingredientName: 'tonhalkonzerv',
    placement: PANTRY,
    category: 'Száraz áru, konzerv, egyéb',
    shoppingItemName: 'tonhalkonzerv',
  },
  {
    recipeId: 'gf-alternativ-tonhalas-tesztasalata',
    ingredientName: 'paradicsom',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'paradicsom',
  },
  {
    recipeId: 'gf-alternativ-tonhalas-tesztasalata',
    ingredientName: 'uborka',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'uborka',
  },
  {
    recipeId: 'gf-alternativ-tonhalas-tesztasalata',
    ingredientName: 'piros vagy zöld paprika',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'piros vagy zöld paprika',
  },
  {
    recipeId: 'gf-alternativ-tonhalas-tesztasalata',
    ingredientName: 'lilahagyma vagy vöröshagyma',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'lilahagyma vagy vöröshagyma',
  },
  ZSIRADEK_ROW('gf-alternativ-tonhalas-tesztasalata', 'olívaolaj'),
  {
    recipeId: 'gf-alternativ-tonhalas-tesztasalata',
    ingredientName: 'citromlé',
    placement: FRESH,
    category: 'Zöldség, gyümölcs',
    shoppingItemName: 'citromlé',
  },
]

// A pantry bulk-meat line that is also pre-split into a fresh trip's
// "+ N g ... a fagyasztóból kiolvasztva" reminder line (spec 004) moves together:
// subtracting/adding a block's recipe share also subtracts/adds the same amount
// from that block's own reminder line.
const PANTRY_FREEZER_REMINDER: Record<string, string> = {
  'pörköltnek való sovány hús': 'pörköltnek való hús a fagyasztóból kiolvasztva (lásd fent)',
  'darált hús': 'darált hús a fagyasztóból kiolvasztva (lásd fent)',
}
const FREEZER_REMINDER_CATEGORY = 'Hús, hal, tojás'

export function resolveTripId(placement: ShoppingPlacement, block: BlockNumber): TripId {
  if (placement === 'pantry') return 'pantry'
  return block === 1 || block === 2 ? 'freshWeek1' : 'freshWeek2'
}

function adjustShoppingItem(
  trips: ShoppingTrip[],
  tripId: TripId,
  categoryHeading: string,
  itemName: string,
  delta: number,
  unit: ShoppingUnit,
  mustBeGlutenFree: boolean,
): ShoppingTrip[] {
  return trips.map((trip) => {
    if (trip.id !== tripId) return trip

    const categoryIndex = trip.categories.findIndex((category) => category.heading === categoryHeading)
    if (categoryIndex === -1) {
      throw new Error(`Unknown shopping category "${categoryHeading}" in trip "${tripId}"`)
    }
    const category = trip.categories[categoryIndex]!
    const itemIndex = category.items.findIndex((item) => item.name === itemName)

    let nextItems: ShoppingItem[]
    if (itemIndex === -1) {
      if (delta <= 0) {
        throw new Error(`Cannot remove missing shopping item "${itemName}" in trip "${tripId}"`)
      }
      nextItems = [...category.items, { name: itemName, amount: delta, unit, mustBeGlutenFree }]
    } else {
      const item = category.items[itemIndex]!
      const nextAmount = item.amount + delta
      nextItems =
        nextAmount <= 0
          ? category.items.filter((_, index) => index !== itemIndex)
          : category.items.map((existing, index) =>
              index === itemIndex ? { ...existing, amount: nextAmount } : existing,
            )
    }

    const nextCategories =
      nextItems.length === 0
        ? trip.categories.filter((_, index) => index !== categoryIndex)
        : trip.categories.map((existing, index) =>
            index === categoryIndex ? { ...existing, items: nextItems } : existing,
          )

    return { ...trip, categories: nextCategories }
  })
}

function applyRecipeDelta(
  trips: ShoppingTrip[],
  recipeId: string,
  block: BlockNumber,
  recipesById: Map<string, Recipe>,
  sign: 1 | -1,
): ShoppingTrip[] {
  const recipe = recipesById.get(recipeId)
  if (!recipe) {
    throw new Error(`Unknown recipe id "${recipeId}"`)
  }

  let nextTrips = trips

  for (const row of LUNCH_SHOPPING_MAP) {
    if (row.recipeId !== recipeId) continue

    const ingredient = recipe.ingredients.find((candidate) => candidate.name === row.ingredientName)
    if (!ingredient || ingredient.amount === null || ingredient.unit === null) {
      throw new Error(`Missing ingredient "${row.ingredientName}" on recipe "${recipeId}"`)
    }

    const unit = ingredient.unit as ShoppingUnit
    const delta = ingredient.amount * sign
    const tripId = resolveTripId(row.placement, block)

    nextTrips = adjustShoppingItem(
      nextTrips,
      tripId,
      row.category,
      row.shoppingItemName,
      delta,
      unit,
      ingredient.mustBeGlutenFree,
    )

    const reminderName = row.placement === PANTRY ? PANTRY_FREEZER_REMINDER[row.shoppingItemName] : undefined
    if (reminderName) {
      const reminderTripId = resolveTripId(FRESH, block)
      nextTrips = adjustShoppingItem(
        nextTrips,
        reminderTripId,
        FREEZER_REMINDER_CATEGORY,
        reminderName,
        delta,
        unit,
        ingredient.mustBeGlutenFree,
      )
    }
  }

  return nextTrips
}

export function applyLunchSwaps(
  base: ShoppingTrip[],
  swaps: ActiveSwaps,
  recipesById: Map<string, Recipe>,
): ShoppingTrip[] {
  let trips = base

  for (const block of [1, 2, 3, 4] as const) {
    const defaultId = BLOCK_RECIPE_IDS[block].lunchId
    const activeId = getActiveLunchId(block, swaps)
    if (activeId === defaultId) continue

    trips = applyRecipeDelta(trips, defaultId, block, recipesById, -1)
    trips = applyRecipeDelta(trips, activeId, block, recipesById, 1)
  }

  return trips
}

export function diffRemovedItems(
  before: ShoppingTrip[],
  after: ShoppingTrip[],
): { tripId: TripId; itemName: string }[] {
  const afterKeys = new Set<string>()
  for (const trip of after) {
    for (const category of trip.categories) {
      for (const item of category.items) {
        afterKeys.add(`${trip.id} ${item.name}`)
      }
    }
  }

  const removed: { tripId: TripId; itemName: string }[] = []
  for (const trip of before) {
    for (const category of trip.categories) {
      for (const item of category.items) {
        if (!afterKeys.has(`${trip.id} ${item.name}`)) {
          removed.push({ tripId: trip.id, itemName: item.name })
        }
      }
    }
  }
  return removed
}
