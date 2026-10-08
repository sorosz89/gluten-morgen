import { makeStyles, tokens } from '@fluentui/react-components'
import { shellColors } from '../../styles/shellColors.ts'
import { glutenBg, glutenFg, mealColors } from '../../styles/colors.ts'
import { bpXLarge } from '../../styles/breakpoints.ts'

// This page is a flowing, cardless document now (impeccable /generate demo,
// accepted variant "consolidated"): nothing but the gluten-risk badge and
// the glutenFreeNote callout carries a filled background — every other
// element sits directly on the dark/purple backdrop, using the shell's
// off-card light palette instead of the in-card neutral tokens the rest of
// the app's white cards use. A 6px meal-type accent (the same hue family as
// Catalog's/Today's left-edge card rail, the stripe width DESIGN.md's Shapes
// section documents) stands in for the removed card boundary on each major
// section, so the page keeps a sense of structure without a filled surface.
export const useRecipeDetailStyles = makeStyles({
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
    marginBottom: '1rem',
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
  // Shared accent treatment: a meal-type-colored left rule in place of a
  // card edge. `accentBreakfast`/`accentLunch`/`accentDinner` supply only
  // the color, merged alongside this on whichever wrapper needs it.
  accent: {
    borderLeftStyle: 'solid',
    borderLeftWidth: '6px',
    paddingLeft: '1rem',
  },
  accentBreakfast: { borderLeftColor: mealColors.breakfast.strip },
  accentLunch: { borderLeftColor: mealColors.lunch.strip },
  accentDinner: { borderLeftColor: mealColors.dinner.strip },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: '1rem',
    rowGap: '0.5rem',
    marginBottom: '1.5rem',
  },
  title: {
    flex: '1 1 100%',
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: tokens.fontWeightBold,
    color: shellColors.offCardText,
  },
  // `MealTypeChip`'s own `chip` style is `inline-block` (shrink-to-content);
  // no extra margin needed here since `header`'s own `columnGap`/`rowGap`
  // already space it from the title and the servings label beside it.
  chip: {
    display: 'inline-block',
  },
  servings: {
    color: shellColors.offCardTextMuted,
  },
  portion: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.6rem',
    marginLeft: 'auto',
  },
  portionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: tokens.borderRadiusCircular,
    border: '1px solid rgba(255, 255, 255, 0.35)',
    backgroundColor: 'transparent',
    color: shellColors.offCardText,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    cursor: 'pointer',
    ':disabled': {
      opacity: 0.35,
      cursor: 'not-allowed',
    },
    ':hover:not(:disabled)': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  portionCount: {
    minWidth: '4rem',
    textAlign: 'center',
    color: shellColors.offCardText,
    fontWeight: tokens.fontWeightSemibold,
  },
  macros: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '1.5rem',
    rowGap: '0.4rem',
    marginBottom: '2rem',
  },
  macrosCaption: {
    flex: '1 1 100%',
    margin: '0 0 0.2rem',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: shellColors.offCardTextMuted,
  },
  macrosList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '1.4rem',
    rowGap: '0.3rem',
  },
  macrosListItem: {
    display: 'flex',
    alignItems: 'baseline',
    columnGap: '0.3rem',
  },
  macrosValue: {
    fontWeight: tokens.fontWeightBold,
    color: shellColors.offCardText,
  },
  macrosLabel: {
    fontSize: '0.76rem',
    color: shellColors.offCardTextMuted,
  },
  twoColumn: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '2.25rem',
    [`@media (min-width: ${bpXLarge}px)`]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      columnGap: '3rem',
    },
  },
  ingredientsColumn: {
    [`@media (min-width: ${bpXLarge}px)`]: {
      flex: '0 0 300px',
    },
  },
  list: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  // `display: flex` + `columnGap` spaces the amount/name/note/badge run
  // uniformly (impeccable /live, accepted "inline, compact badge" direction)
  // instead of a manual `marginLeft` hack on the badge alone; `flexWrap`
  // lets the badge drop to its own line on narrow viewports rather than
  // overflowing the row.
  listItem: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: '0.5rem',
    padding: '0.55rem 0',
    color: shellColors.offCardText,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  ingredientAmount: {
    fontWeight: tokens.fontWeightBold,
  },
  ingredientNote: {
    color: shellColors.offCardTextMuted,
    fontSize: '0.85em',
  },
  // Color/shape for the gluten-risk signal lives in the shared
  // `GlutenRiskBadge` component — this page only places it. It, and
  // `glutenFreeNote` below, are the one deliberate exception to "no filled
  // background": the Always-Flagged Rule (constitution Principle 7) keeps
  // the safety signal boxed and unmissable regardless of the surrounding
  // page's own cardless treatment. Scaled down (not hidden, not shrunk in
  // text or color — those are pinned on the shared component) so it reads
  // as a lighter inline annotation rather than a second, equally-loud label
  // stacked under the ingredient text.
  badgeScale: {
    display: 'inline-flex',
    transform: 'scale(0.85)',
    transformOrigin: 'left center',
  },
  stepsColumn: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1.5rem',
    flex: '1 1 auto',
  },
  stepHeading: {
    margin: '0 0 0.5rem',
    color: shellColors.offCardText,
    fontSize: '1rem',
  },
  stepList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  stepListItem: {
    marginBottom: '0.25rem',
  },
  stepButton: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.6rem',
    width: '100%',
    minHeight: '44px',
    padding: '0.4rem 0.25rem',
    borderRadius: tokens.borderRadiusMedium,
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    color: shellColors.offCardText,
    font: 'inherit',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: shellColors.offCardAccentGreen,
      outlineOffset: '1px',
    },
  },
  stepNumberBadge: {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: tokens.borderRadiusCircular,
    fontSize: '11px',
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1,
    color: shellColors.offCardTextMuted,
    border: '1.5px solid rgba(255, 255, 255, 0.35)',
  },
  stepCheckIconDone: {
    flexShrink: 0,
    color: shellColors.offCardAccentGreen,
  },
  stepTextDone: {
    color: shellColors.offCardTextMuted,
    textDecorationLine: 'line-through',
  },
  tip: {
    margin: '1.75rem 0 1rem',
    color: shellColors.offCardText,
  },
  tipLabel: {
    display: 'block',
    marginBottom: '0.3rem',
    fontSize: '0.76rem',
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    color: shellColors.offCardTextMuted,
  },
  // Boxed in the same amber pair as the gluten-risk badge, plus a warning
  // icon, so the safety note is unambiguously higher-emphasis than the
  // neutral `tip` text above (spec 012, AC4 — never the lower-emphasis one).
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
})
