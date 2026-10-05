import { makeStyles, tokens } from '@fluentui/react-components'
import { glutenBg, glutenFg } from '../../styles/colors.ts'
import { shellColors } from '../../styles/shellColors.ts'
import { bpXLarge } from '../../styles/breakpoints.ts'

export const useRecipeDetailStyles = makeStyles({
  // This page is mostly a flowing document, not a card grid — several
  // elements sit directly on the dark/purple backdrop (not surveyed as such
  // in the initial plan; fixed here after checking the actual rendered page,
  // not assumed from the plan's table). Dense content (the step-by-step
  // instructions) gets boxed in its own card instead, since recoloring many
  // nested list items individually would be more error-prone than boxing.
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
    marginBottom: '0.5rem',
    color: shellColors.offCardTextMuted,
    textDecorationLine: 'none',
    ':hover': {
      color: shellColors.offCardText,
      textDecorationLine: 'underline',
    },
    ':focus-visible': {
      color: shellColors.offCardText,
      textDecorationLine: 'underline',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '1px',
    },
  },
  title: {
    marginBottom: '0.25rem',
    color: shellColors.offCardText,
  },
  mealType: {
    display: 'block',
    color: shellColors.offCardTextMuted,
    marginBottom: '0.1rem',
  },
  servings: {
    display: 'block',
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '1.25rem',
    color: shellColors.offCardText,
  },
  twoColumn: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1.5rem',
    [`@media (min-width: ${bpXLarge}px)`]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: '2.5rem',
    },
  },
  ingredientsColumn: {
    [`@media (min-width: ${bpXLarge}px)`]: {
      flex: '0 0 320px',
    },
  },
  stepsColumn: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1.25rem',
    flex: '1 1 auto',
  },
  // Each step group is its own card — the steps are dense, real content that
  // needs a light surface, not individually-recolored text on the backdrop.
  stepCard: {
    borderRadius: tokens.borderRadiusXLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    padding: '1rem 1.25rem 1.1rem',
  },
  list: {
    listStyleType: 'none',
    margin: '0 0 1rem',
    padding: 0,
    borderRadius: tokens.borderRadiusXLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    overflow: 'hidden',
  },
  listItem: {
    padding: '0.6rem 1rem',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: tokens.colorNeutralStroke2,
    ':last-child': {
      borderBottomWidth: 0,
    },
  },
  badge: {
    display: 'inline-block',
    marginLeft: '0.5rem',
    padding: '0.15rem 0.6rem',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: glutenBg,
    color: glutenFg,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  stepHeading: {
    marginBottom: '0.5rem',
  },
  stepList: {
    margin: 0,
    paddingLeft: '1.25rem',
  },
  stepListItem: {
    marginBottom: '0.5rem',
  },
  // "tip" already carries its own light surface (colorNeutralBackground2) —
  // unchanged, needs no off-card color treatment.
  tip: {
    marginBottom: '1rem',
    padding: '0.9rem 1rem',
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  glutenFreeNote: {
    marginBottom: '1rem',
    color: shellColors.offCardText,
  },
  source: {
    marginBottom: '1rem',
    color: shellColors.offCardTextMuted,
  },
})
