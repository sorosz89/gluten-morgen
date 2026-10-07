import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { mealColors } from '../../styles/colors.ts'
import { shellColors } from '../../styles/shellColors.ts'
import { bpXLarge } from '../../styles/breakpoints.ts'

const fadeIn = {
  from: { opacity: 0, transform: 'translateY(-4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
}

export const useTodayStyles = makeStyles({
  // Text that sits directly on the dark/purple backdrop, not inside a card.
  dateLine: {
    color: shellColors.offCardTextMuted,
  },
  setupPrompt: {
    color: shellColors.offCardText,
  },
  cookStatus: {
    marginBottom: '1.25rem',
    color: shellColors.offCardText,
  },
  cookStatusYes: {
    color: shellColors.offCardAccentGreen,
  },

  mealCards: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '0.9rem',
    marginBottom: '1.5rem',
    [`@media (min-width: ${bpXLarge}px)`]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
  // Meal cards: left-edge status stripe (reversed from the prior round's
  // top head-band) — the meal-type label now lives as a chip in the body.
  mealCard: {
    display: 'flex',
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
  mealCardRail: {
    width: '6px',
    flex: 'none',
    alignSelf: 'stretch',
  },
  railBreakfast: { backgroundColor: mealColors.breakfast.strip },
  railLunch: { backgroundColor: mealColors.lunch.strip },
  railDinner: { backgroundColor: mealColors.dinner.strip },
  mealCardBody: {
    padding: '0.9rem 1rem 1.1rem',
    minHeight: '44px',
    flex: '1 1 auto',
  },
  // Color/shape for the meal-type chip and the gluten-risk badge now live in
  // their shared components (`MealTypeChip`, `GlutenRiskBadge`) — this page
  // only places them. No `display` override here: the shared chip's own
  // `inline-block` must not be clobbered to `block`, which would stretch it
  // to the card body's full width (the bug spec 012 introduced on Catalog
  // and Recipe Detail, fixed in the same polish pass that unified Today).
  mealChipSpacing: {
    marginBottom: '0.5rem',
  },
  mealCardTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '0.6rem',
  },
  mealError: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '44px',
    borderRadius: tokens.borderRadiusXLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    padding: '0.9rem 1rem',
    margin: 0,
  },

  // PRODUCT.md's 44x44px minimum tap target is a hard invariant. Fluent's
  // default/large control sizes don't reliably clear it on their own, so it
  // is enforced explicitly rather than trusted to the library's defaults.
  tapTarget44: {
    minHeight: '44px',
  },

  // The anchor-edit form is boxed in its own white card so every Fluent
  // control inside it (Field, Input, Button) keeps its already-proven
  // light-surface contrast — no per-component dark-mode override needed.
  anchorFormCard: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    columnGap: '0.5rem',
    rowGap: '0.5rem',
    marginTop: '1.5rem',
    padding: '1rem 1.25rem',
    borderRadius: tokens.borderRadiusXLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
  },
  // The collapsed edit affordance stays off-card, so its text needs the
  // off-card color treatment rather than Fluent's default subtle-button gray.
  editButtonOffCard: {
    color: shellColors.offCardTextMuted,
    ':hover': {
      color: shellColors.offCardText,
    },
    ':focus-visible': {
      color: shellColors.offCardText,
      outlineColor: shellColors.offCardText,
    },
  },

  // The one signature move on this page: the rotation-anchor edit affordance
  // animates in on mount (collapse <-> expanded form) using Fluent's own
  // motion tokens, rather than snapping instantly like every other element
  // on this page. See the Today surface brief for why.
  settingsHandoff: {
    animationDuration: tokens.durationNormal,
    animationTimingFunction: tokens.curveEasyEase,
    animationName: fadeIn,
    animationFillMode: 'backwards',
  },
})

export { mergeClasses }
