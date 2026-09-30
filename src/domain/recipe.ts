import { z } from 'zod'

export const mealTypeSchema = z.enum([
  'breakfast',
  'lunch',
  'dinner',
  'alternative',
  'extra',
])
export type MealType = z.infer<typeof mealTypeSchema>

// Complete real unit vocabulary across all 18 recipe files — no speculative members.
export const UNITS = ['g', 'kg', 'db', 'gerezd', 'evőkanál', 'tk'] as const
export const unitSchema = z.enum(UNITS)
export type Unit = z.infer<typeof unitSchema>

export const ingredientSchema = z
  .object({
    amount: z.number().nullable(),
    amountText: z.string().min(1).optional(),
    unit: unitSchema.nullable(),
    name: z.string().min(1),
    note: z.string().min(1).optional(),
    mustBeGlutenFree: z.boolean(),
  })
  .refine((ingredient) => (ingredient.amount === null) === (ingredient.unit === null), {
    message: 'amount and unit must both be present or both be null',
  })
export type Ingredient = z.infer<typeof ingredientSchema>

export const stepGroupSchema = z.object({
  heading: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
})
export type StepGroup = z.infer<typeof stepGroupSchema>

export const macrosSchema = z.object({
  kcal: z.number(),
  proteinG: z.number(),
  carbsG: z.number(),
  saltMg: z.number(),
  fatG: z.number(),
  fiberG: z.number(),
})
export type Macros = z.infer<typeof macrosSchema>

export const recipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  mealType: mealTypeSchema,
  servingsLabel: z.string().min(1),
  ingredients: z.array(ingredientSchema).min(1),
  stepGroups: z.array(stepGroupSchema).min(1),
  tip: z.string().min(1).optional(),
  source: z.string().min(1).optional(),
  macros: macrosSchema.optional(),
  glutenFreeNote: z.string().min(1).optional(),
})
export type Recipe = z.infer<typeof recipeSchema>
