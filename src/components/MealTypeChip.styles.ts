import { makeStyles, tokens } from '@fluentui/react-components'
import { mealColors } from '../styles/colors.ts'

export const useMealTypeChipStyles = makeStyles({
  chip: {
    display: 'inline-block',
    padding: '0.15rem 0.6rem',
    borderRadius: tokens.borderRadiusCircular,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  breakfast: {
    backgroundColor: mealColors.breakfast.bg,
    color: mealColors.breakfast.fg,
  },
  lunch: {
    backgroundColor: mealColors.lunch.bg,
    color: mealColors.lunch.fg,
  },
  dinner: {
    backgroundColor: mealColors.dinner.bg,
    color: mealColors.dinner.fg,
  },
})
