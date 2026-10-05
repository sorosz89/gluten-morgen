import { makeStyles, tokens } from '@fluentui/react-components'
import { shellColors } from '../../styles/shellColors.ts'

export const useLabelChecklistStyles = makeStyles({
  // Off-card: sits directly on the dark/purple backdrop — required fix.
  summary: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '1rem',
    color: shellColors.offCardText,
  },
  shell: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow4,
    overflow: 'hidden',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    minHeight: '44px',
    padding: '0.3rem 1rem',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: tokens.colorNeutralStroke2,
    ':last-child': {
      borderBottomWidth: 0,
    },
  },
  itemName: {
    flex: '1 1 auto',
  },
})
