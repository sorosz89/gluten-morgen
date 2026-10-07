import { makeStyles, tokens } from '@fluentui/react-components'
import { shellColors } from '../../styles/shellColors.ts'
import { glutenBg, glutenFg } from '../../styles/colors.ts'
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
  // `MealTypeChip`'s own `chip` style is `inline-block` (shrink-to-content);
  // only margin is added here — a `display` override would stretch it to
  // the page's full width, since a block-level span's width is auto.
  mealTypeChipSpacing: {
    marginBottom: '0.4rem',
  },
  servings: {
    display: 'block',
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '0.5rem',
    color: shellColors.offCardText,
  },
  portionControl: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.75rem',
    marginBottom: '1.25rem',
  },
  portionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: tokens.borderRadiusCircular,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'pointer',
    ':disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
    ':hover:not(:disabled)': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  portionCount: {
    minWidth: '4.5rem',
    textAlign: 'center',
    fontWeight: tokens.fontWeightSemibold,
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
  // Color/shape for the gluten-risk signal now live in the shared
  // `GlutenRiskBadge` component — this page only places it.
  badgeSpacing: {
    marginLeft: '0.5rem',
  },
  stepHeading: {
    marginBottom: '0.5rem',
  },
  stepList: {
    margin: 0,
    paddingLeft: '1.25rem',
  },
  stepListItem: {
    marginBottom: '0.3rem',
  },
  // Each step is a real tappable button (44px tall, full-width) so marking
  // it done works one-handed while cooking — not a decorative checkbox.
  stepButton: {
    display: 'flex',
    alignItems: 'flex-start',
    columnGap: '0.6rem',
    width: '100%',
    minHeight: '44px',
    padding: '0.3rem 0.4rem',
    borderRadius: tokens.borderRadiusMedium,
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    color: 'inherit',
    font: 'inherit',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '1px',
    },
  },
  stepCheckIcon: {
    flexShrink: 0,
    marginTop: '0.15rem',
    color: tokens.colorNeutralStroke1,
  },
  stepCheckIconDone: {
    flexShrink: 0,
    marginTop: '0.15rem',
    color: tokens.colorPaletteGreenForeground1,
  },
  stepTextDone: {
    color: tokens.colorNeutralForeground3,
    textDecorationLine: 'line-through',
  },
  // "tip" already carries its own light surface (colorNeutralBackground2) —
  // unchanged, needs no off-card color treatment.
  tip: {
    marginBottom: '1rem',
    padding: '0.9rem 1rem',
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  // Boxed in the same amber pair as the gluten-risk badge, plus a warning
  // icon, so the safety note is unambiguously higher-emphasis than the
  // neutral `tip` box above (spec 012, AC4 — never the lower-emphasis one).
  glutenFreeNote: {
    display: 'flex',
    alignItems: 'flex-start',
    columnGap: '0.5rem',
    marginBottom: '1rem',
    padding: '0.9rem 1rem',
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: glutenBg,
    color: glutenFg,
  },
  glutenFreeNoteIcon: {
    flexShrink: 0,
    marginTop: '0.2rem',
  },
  source: {
    marginBottom: '1rem',
    color: shellColors.offCardTextMuted,
  },
  // Macros are reference info, not a second shopping list — a plain-text
  // caption plus unbordered rows (no card shape) keeps them visually
  // distinct from the ingredient list's bordered, shop-from-this card.
  macrosCaption: {
    marginBottom: '0.4rem',
    color: shellColors.offCardTextMuted,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  macrosList: {
    listStyleType: 'none',
    margin: '0 0 1rem',
    padding: 0,
  },
  macrosListItem: {
    padding: '0.3rem 0',
    color: shellColors.offCardText,
  },
})
