import { mergeClasses } from '@fluentui/react-components'
import { mealTypeLabel } from '../domain/catalog.ts'
import type { MealType } from '../domain/recipe.ts'
import { useMealTypeChipStyles } from './MealTypeChip.styles.ts'

interface MealTypeChipProps {
  mealType: MealType
  className?: string
}

// `alternative`/`extra` have no color family of their own — they fall back
// to the `lunch` tint, the same fallback Today's own chip already uses.
const COLOR_CLASS_KEY: Record<MealType, 'breakfast' | 'lunch' | 'dinner'> = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  alternative: 'lunch',
  extra: 'lunch',
}

// The meal-type pill chip, shared by Catalog and Recipe detail so both read
// as the same component pattern already proven on Today (spec 012, AC6).
function MealTypeChip({ mealType, className }: MealTypeChipProps) {
  const fluentStyles = useMealTypeChipStyles()
  const colorClass = fluentStyles[COLOR_CLASS_KEY[mealType]]

  return (
    <span className={mergeClasses(fluentStyles.chip, colorClass, className)}>
      {mealTypeLabel(mealType)}
    </span>
  )
}

export default MealTypeChip
