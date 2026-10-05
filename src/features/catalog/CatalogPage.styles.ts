import { makeStyles, tokens } from '@fluentui/react-components'
import { glutenBg, glutenFg, mealColors } from '../../styles/colors.ts'
import { shellColors } from '../../styles/shellColors.ts'
import { bpLarge, bpXLarge, bpXXLarge } from '../../styles/breakpoints.ts'

export const useCatalogStyles = makeStyles({
  search: {
    display: 'block',
    width: '100%',
    maxWidth: '420px',
    minHeight: '44px',
    marginBottom: '1.75rem',
    padding: '0.6rem 1rem',
    borderRadius: tokens.borderRadiusCircular,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    fontSize: tokens.fontSizeBase300,
    fontFamily: 'inherit',
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '1px',
    },
  },
  // Section headings and "no results" text sit directly on the dark/purple
  // backdrop, not inside a card — off-card color treatment required.
  noResults: {
    color: shellColors.offCardTextMuted,
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    marginBottom: '0.75rem',
    color: shellColors.offCardText,
  },
  cardList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '0.9rem',
    [`@media (min-width: ${bpLarge}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [`@media (min-width: ${bpXLarge}px)`]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [`@media (min-width: ${bpXXLarge}px)`]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
  // Card: left-edge status stripe (reversed from the prior round's top bar).
  card: {
    display: 'flex',
    height: '100%',
    textDecorationLine: 'none',
    color: 'inherit',
    borderRadius: tokens.borderRadiusXLarge,
    overflow: 'hidden',
    boxShadow: tokens.shadow4,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    transitionProperty: 'box-shadow, transform',
    transitionDuration: tokens.durationFast,
    transitionTimingFunction: tokens.curveEasyEase,
    ':hover': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-2px)',
    },
    ':focus-visible': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-2px)',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '1px',
    },
  },
  strip: {
    width: '6px',
    flex: 'none',
    alignSelf: 'stretch',
  },
  stripBreakfast: { backgroundColor: mealColors.breakfast.strip },
  stripLunch: { backgroundColor: mealColors.lunch.strip },
  stripDinner: { backgroundColor: mealColors.dinner.strip },
  stripNeutral: { backgroundColor: tokens.colorNeutralStroke1 },
  cardBody: {
    padding: '0.9rem 1rem 1.1rem',
    flex: '1 1 auto',
  },
  cardTitle: {
    margin: '0 0 0.3rem',
    fontWeight: tokens.fontWeightSemibold,
  },
  servings: {
    margin: '0 0 0.5rem',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  badge: {
    display: 'inline-block',
    marginTop: '0.3rem',
    padding: '0.15rem 0.6rem',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: glutenBg,
    color: glutenFg,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
})
