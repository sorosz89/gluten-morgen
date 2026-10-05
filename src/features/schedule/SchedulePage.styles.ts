import { makeStyles, tokens } from '@fluentui/react-components'
import { glutenBg, glutenFg, mealColors } from '../../styles/colors.ts'
import { shellColors } from '../../styles/shellColors.ts'
import { bpXLarge } from '../../styles/breakpoints.ts'

export const useScheduleStyles = makeStyles({
  // Off-card: the empty-state prompt and its link sit directly on the dark/
  // purple backdrop when no anchor is set — a required fix, not optional.
  emptyState: {
    color: shellColors.offCardText,
  },
  anchorLink: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '44px',
    color: shellColors.offCardTextMuted,
    ':hover': {
      color: shellColors.offCardText,
    },
  },
  dayList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.9rem',
  },
  day: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow4,
    padding: '0.9rem 1.1rem 1rem',
  },
  dayHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: '0.6rem',
    rowGap: '0.3rem',
    [`@media (min-width: ${bpXLarge}px)`]: {
      alignItems: 'flex-start',
    },
  },
  weekday: {
    fontWeight: tokens.fontWeightSemibold,
  },
  secondary: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  cookYes: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  lastDay: {
    display: 'inline-block',
    padding: '0.15rem 0.6rem',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  glutenBadge: {
    display: 'inline-block',
    padding: '0.15rem 0.6rem',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: glutenBg,
    color: glutenFg,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  // Days expand into a 2-region layout at wide widths: header fields on the
  // left, meal list inline on the right, instead of stacking the meals below.
  dayWide: {
    [`@media (min-width: ${bpXLarge}px)`]: {
      display: 'flex',
      alignItems: 'flex-start',
      columnGap: '1.5rem',
    },
  },
  dayHeaderWide: {
    [`@media (min-width: ${bpXLarge}px)`]: {
      flex: '0 0 220px',
    },
  },
  mealList: {
    listStyle: 'none',
    margin: '0.6rem 0 0',
    padding: 0,
    [`@media (min-width: ${bpXLarge}px)`]: {
      margin: 0,
      flex: '1 1 auto',
    },
  },
  mealLink: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: '0.5rem',
    minHeight: '44px',
    padding: '0.4rem 0',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: tokens.colorNeutralStroke2,
    color: 'inherit',
    textDecorationLine: 'none',
    ':last-child': {
      borderBottomWidth: 0,
    },
    ':hover': {
      textDecorationLine: 'underline',
    },
    ':focus-visible': {
      textDecorationLine: 'underline',
    },
  },
  mealChipBreakfast: {
    backgroundColor: mealColors.breakfast.bg,
    color: mealColors.breakfast.fg,
  },
  mealChipLunch: {
    backgroundColor: mealColors.lunch.bg,
    color: mealColors.lunch.fg,
  },
  mealChipDinner: {
    backgroundColor: mealColors.dinner.bg,
    color: mealColors.dinner.fg,
  },
  mealChip: {
    display: 'inline-block',
    padding: '0.15rem 0.6rem',
    borderRadius: tokens.borderRadiusCircular,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
})
