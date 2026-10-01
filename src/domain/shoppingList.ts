import { z } from 'zod'

export const shoppingUnitSchema = z.enum(['g', 'db'])
export type ShoppingUnit = z.infer<typeof shoppingUnitSchema>

export const shoppingItemSchema = z.object({
  name: z.string().min(1),
  amount: z.number(),
  amountQualifier: z.string().min(1).optional(),
  unit: shoppingUnitSchema,
  note: z.string().min(1).optional(),
  mustBeGlutenFree: z.boolean(),
})
export type ShoppingItem = z.infer<typeof shoppingItemSchema>

export const shoppingCategorySchema = z.object({
  heading: z.string().min(1),
  items: z.array(shoppingItemSchema).min(1),
})
export type ShoppingCategory = z.infer<typeof shoppingCategorySchema>

export const tripIdSchema = z.enum(['pantry', 'freshWeek1', 'freshWeek2'])
export type TripId = z.infer<typeof tripIdSchema>

export const shoppingTripSchema = z.object({
  id: tripIdSchema,
  label: z.string().min(1),
  categories: z.array(shoppingCategorySchema).min(1),
})
export type ShoppingTrip = z.infer<typeof shoppingTripSchema>

export const shoppingListSchema = z.array(shoppingTripSchema).length(3)
