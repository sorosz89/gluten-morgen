import { makeStyles, tokens } from '@fluentui/react-components'
import { glutenBg, glutenFg } from '../../styles/colors.ts'
import { shellColors } from '../../styles/shellColors.ts'
import { bpMedium, bpLarge, bpXLarge } from '../../styles/breakpoints.ts'

export const useShoppingStyles = makeStyles({
  familySize: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.3rem',
    marginBottom: '1.75rem',
    maxWidth: '160px',
    [`@media (min-width: ${bpMedium}px)`]: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: '0.6rem',
      maxWidth: 'none',
    },
  },
  // Off-card: this field sits directly on the dark/purple backdrop, not
  // inside a card — a required fix, not optional (flagged in the surface brief).
  familySizeLabel: {
    fontSize: tokens.fontSizeBase200,
    color: shellColors.offCardTextMuted,
  },
  familySizeInput: {
    width: '4.5rem',
    minHeight: '44px',
    padding: '0.4rem 0.6rem',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    fontSize: tokens.fontSizeBase300,
    fontVariantNumeric: 'tabular-nums',
    fontFamily: 'inherit',
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '1px',
    },
  },
  trips: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1.5rem',
  },
  trip: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow4,
    overflow: 'hidden',
  },
  tripHeader: {
    padding: '1.1rem 1.25rem 0.25rem',
  },
  categories: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    columnGap: '2rem',
    padding: '0.5rem 1.25rem 0.5rem',
    [`@media (min-width: ${bpLarge}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [`@media (min-width: ${bpXLarge}px)`]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
  category: {
    paddingTop: '1rem',
  },
  categoryHeading: {
    margin: '0 0 0.5rem',
    fontSize: tokens.fontSizeBase200,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: tokens.colorNeutralForeground3,
  },
  itemList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: '0.5rem',
    minHeight: '44px',
    padding: '0.3rem 0',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: tokens.colorNeutralStroke2,
    ':last-child': {
      borderBottomWidth: 0,
    },
  },
  checkbox: {
    width: '20px',
    height: '20px',
    flex: 'none',
    accentColor: tokens.colorBrandBackground,
  },
  itemName: {
    flex: '1 1 auto',
  },
  itemQuantity: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  badge: {
    display: 'inline-block',
    padding: '0.15rem 0.6rem',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: glutenBg,
    color: glutenFg,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  // Destructive-action isolation (donated by the dark-first-developer-console
  // counterweight, recorded on this page's surface brief): "Lista törlése"
  // gets its own row, away from the trip heading, and stays low-key until
  // deliberately focused rather than inviting a casual tap.
  tripFooter: {
    padding: '0.75rem 1.25rem 1.1rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  clearButton: {
    minHeight: '44px',
    padding: '0.5rem 1rem',
    borderRadius: tokens.borderRadiusCircular,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontFamily: 'inherit',
    cursor: 'pointer',
    ':hover': {
      border: `1px solid ${tokens.colorPaletteRedBorder2}`,
      color: tokens.colorPaletteRedForeground1,
      backgroundColor: tokens.colorPaletteRedBackground1,
    },
    ':focus-visible': {
      outline: `2px solid ${tokens.colorPaletteRedBorder2}`,
      outlineOffset: '1px',
    },
  },
})
