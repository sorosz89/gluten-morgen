import { shoppingListSchema } from '../domain/shoppingList.ts'
import type { ShoppingTrip } from '../domain/shoppingList.ts'
import raw from './shoppingList.json' with { type: 'json' }

export const shoppingList: ShoppingTrip[] = shoppingListSchema.parse(raw)
