import { makeStyles, tokens } from '@fluentui/react-components'
import { bpMedium } from '../../styles/breakpoints.ts'

export const useLunchSwapStyles = makeStyles({
  blocks: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.9rem',
  },
  block: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow4,
    padding: '1rem 1.25rem 1.25rem',
  },
  blockHeading: {
    margin: '0 0 0.3rem',
  },
  activeLunch: {
    margin: '0 0 0.75rem',
    color: tokens.colorNeutralForeground3,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.3rem',
    [`@media (min-width: ${bpMedium}px)`]: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: '0.75rem',
    },
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  select: {
    display: 'block',
    width: '100%',
    minHeight: '44px',
    padding: '0.5rem 0.75rem',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
    fontFamily: 'inherit',
    [`@media (min-width: ${bpMedium}px)`]: {
      width: 'auto',
      flex: '1 1 auto',
    },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: tokens.colorBrandStroke1,
      outlineOffset: '1px',
    },
  },
})
