import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { shellColors } from './styles/shellColors.ts'

export { mergeClasses }

// A horizontal top nav bar spanning the full width, with the routed page
// below it. Replaces the earlier collapsible left-pane NavDrawer; the dark/
// purple shell palette carries over unchanged (utilityBarBg for the bar
// itself, the same nav-link color tiers for default/active items).
export const useAppStyles = makeStyles({
  appShell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    backgroundColor: shellColors.backdropBase,
  },
  navBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.6rem 1rem',
    backgroundColor: shellColors.utilityBarBg,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  navBarItems: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.25rem',
  },
  brand: {
    color: shellColors.navLinkDefault,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  },
  // Icon-only tap targets (labels dropped to keep the bar to one row down to
  // 360px — a visible label row would wrap or require horizontal scroll).
  navBarItem: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    minHeight: '44px',
    color: shellColors.navLinkDefault,
    textDecorationLine: 'none',
    borderBottomStyle: 'solid',
    borderBottomWidth: '3px',
    borderBottomColor: 'transparent',
    ':hover': {
      color: shellColors.navLinkActive,
    },
    ':focus-visible': {
      color: shellColors.navLinkActive,
      outlineColor: shellColors.navLinkActive,
    },
  },
  navBarItemActive: {
    color: shellColors.navLinkActive,
    borderBottomColor: shellColors.navLinkActive,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minWidth: 0,
  },
})
