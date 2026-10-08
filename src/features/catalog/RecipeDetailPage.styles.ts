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
  // `MealTypeChip`'s own `chip` style is `inline-block` (shrink-to-content);
  // only margin is added here — a `display` override would stretch it to
  // the page's full width, since a block-level span's width is auto.
  // `marginTop` separates it from the title above — the title's own
  // `marginBottom` (0.25rem) alone read as too tight against the chip.
  // `alignSelf: flex-start` opts it out of the header widget zone's default
  // flex `stretch`, which would otherwise widen the pill to the full column
  // the same way a `display` override would.
  mealTypeChipSpacing: {
    marginTop: '0.75rem',
    marginBottom: '0.4rem',
    alignSelf: 'flex-start',
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
  // `alignItems: stretch` at desktop widths so the ingredients and steps
  // columns match each other's height — the ingredients list is almost
  // always shorter, and left short it reads as misaligned against the
  // steps card beside it.
  twoColumn: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1.5rem',
    [`@media (min-width: ${bpXLarge}px)`]: {
      flexDirection: 'row',
      alignItems: 'stretch',
      columnGap: '2.5rem',
    },
  },
  // `display: flex` + `flexDirection: column` lets the ingredients `<ul>`
  // grow to fill the stretched column height via `flex: 1` on the list
  // itself, instead of staying at its own content size.
  ingredientsColumn: {
    [`@media (min-width: ${bpXLarge}px)`]: {
      display: 'flex',
      flexDirection: 'column',
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
  // Plain opaque card, same recipe as every other card in the app
  // (Today's meal card, Catalog's recipe card): no reason for this page's
  // cards to carry their own bespoke glass treatment.
  stepCard: {
    borderRadius: tokens.borderRadiusXLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    padding: '1rem 1.25rem 1.1rem',
  },
  // Same plain card as `stepCard` — see its comment.
  list: {
    listStyleType: 'none',
    margin: '0 0 1rem',
    padding: 0,
    borderRadius: tokens.borderRadiusXLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    overflow: 'hidden',
    // Fills the stretched `ingredientsColumn` height (desktop only, where
    // `twoColumn` applies `alignItems: stretch`) and spaces its rows evenly
    // across that height instead of leaving empty space at the bottom.
    [`@media (min-width: ${bpXLarge}px)`]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: 1,
      marginBottom: 0,
    },
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
  // Weight-only differentiation so the quantity reads distinctly from the
  // ingredient name without a layout change to the existing flowing list.
  ingredientAmount: {
    fontWeight: tokens.fontWeightBold,
  },
  // Muted and smaller so a prep instruction ("NE sima", "megmosva...") reads
  // as a secondary annotation, not part of the ingredient's own name.
  ingredientNote: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  stepHeading: {
    marginBottom: '0.5rem',
  },
  // `listStyleType: none` drops the browser's own decimal markers — paired
  // with the numbered `stepNumberBadge` circle below, native numerals and
  // the step's own indicator used to compete for the same meaning.
  stepList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  stepListItem: {
    marginBottom: '0.3rem',
  },
  // Single marker for "which step, done or not": shows the step number until
  // checked off, then yields to `stepCheckIconDone`'s filled checkmark.
  // No `marginTop` — the badge and the step text are both exactly one line
  // tall and share the same flex-start origin, so an added offset (like the
  // check icons' own 0.15rem nudge) misaligns this badge instead of centering it.
  stepNumberBadge: {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22px',
    height: '22px',
    borderRadius: tokens.borderRadiusCircular,
    fontSize: '12px',
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1,
    color: tokens.colorNeutralForeground3,
    border: `1.5px solid ${tokens.colorNeutralStroke1}`,
  },
  // Each step is a real tappable button (44px tall, full-width) so marking
  // it done works one-handed while cooking — not a decorative checkbox.
  // `alignItems: center` centers the number/check badge against the full
  // height of the step text, including steps that wrap to two lines.
  stepButton: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.6rem',
    width: '100%',
    minHeight: '44px',
    padding: '0.45rem 0.4rem',
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
  // Small uppercase eyebrow so a tip reads as advice, not a stray paragraph —
  // distinct from `glutenFreeNote`'s icon treatment, which is reserved for
  // the safety signal.
  tipLabel: {
    display: 'block',
    marginBottom: '0.3rem',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    color: tokens.colorNeutralForeground3,
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
  // The header widget panel merges the title/portion-control widget and the
  // macros widget into one plain card (same recipe as `stepCard`/`list`
  // above) with an internal split, rather than on the dark backdrop —
  // in-card neutral tokens, not the off-card shell palette the rest of this
  // page's loose text uses. One widget can't drift out of sync with itself,
  // which is the point: the two used to be a bare-backdrop text stack beside
  // a separate card of a different size.
  headerWidgetPanel: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '1.75rem',
    padding: '1.1rem 1.25rem 1.25rem',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow4,
    [`@media (min-width: ${bpXLarge}px)`]: {
      gridTemplateColumns: '1fr 1fr',
      columnGap: '1.75rem',
    },
  },
  headerWidgetZone: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0,
  },
  // Hairline (not a colored accent) separating the two zones at desktop
  // width only, where they sit side by side.
  headerWidgetZoneDivider: {
    [`@media (min-width: ${bpXLarge}px)`]: {
      borderInlineEndWidth: '1px',
      borderInlineEndStyle: 'solid',
      borderInlineEndColor: tokens.colorNeutralStroke2,
      paddingInlineEnd: '1.75rem',
    },
  },
  widgetTitle: {
    marginBottom: '0.25rem',
    color: tokens.colorNeutralForeground1,
  },
  widgetServings: {
    display: 'block',
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '0.5rem',
    color: tokens.colorNeutralForeground1,
  },
  widgetPortionCount: {
    minWidth: '4.5rem',
    textAlign: 'center',
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  macrosCaption: {
    marginBottom: '0.4rem',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  // Two columns by default — three is too tight for longer labels
  // ("szénhidrát") once the card itself has shrunk to a 360px viewport.
  macrosList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    columnGap: '1rem',
    rowGap: '0.7rem',
    [`@media (min-width: ${bpXLarge}px)`]: {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
  macrosListItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  macrosValue: {
    fontWeight: tokens.fontWeightBold,
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground1,
  },
  macrosLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
})
