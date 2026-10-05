import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { shellColors } from './styles/shellColors.ts'

export { mergeClasses }

// Fluent 2's own left-pane Nav pattern: an always-on-top-level flex row with
// the NavDrawer as one child and the routed page as the other. The dark/
// purple shell palette carries over unchanged from the old two-tier top bar
// (utilityBarBg for the brand/header row, headerBarBg for the link list) —
// only the orientation and the component primitives changed.
export const useAppStyles = makeStyles({
  appShell: {
    display: 'flex',
    minHeight: '100dvh',
    backgroundColor: shellColors.backdropBase,
  },
  navDrawer: {
    backgroundColor: shellColors.headerBarBg,
    borderRightStyle: 'none',
  },
  navHeader: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.6rem',
    padding: '0.6rem 0.9rem',
    backgroundColor: shellColors.utilityBarBg,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  navBody: {
    paddingTop: '0.5rem',
    rowGap: '0.15rem',
  },
  brand: {
    color: shellColors.navLinkDefault,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  },
  hamburger: {
    flexShrink: 0,
    color: shellColors.navLinkDefault,
    ':hover': {
      color: shellColors.navLinkActive,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    ':hover:active': {
      color: shellColors.navLinkActive,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    ':focus-visible': {
      color: shellColors.navLinkActive,
    },
  },
  navItem: {
    minHeight: '44px',
    marginInline: '0.5rem',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: 'transparent',
    color: shellColors.navLinkDefault,
    fontWeight: tokens.fontWeightSemibold,
    ':hover': {
      color: shellColors.navLinkActive,
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
    },
    ':hover:active': {
      color: shellColors.navLinkActive,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    ':focus-visible': {
      color: shellColors.navLinkActive,
    },
  },
  navItemActive: {
    color: shellColors.navLinkActive,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: `inset 3px 0 0 0 ${shellColors.navLinkActive}`,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minWidth: 0,
  },
  collapsedTopBar: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.6rem',
    padding: '0.5rem 0.9rem',
    backgroundColor: shellColors.utilityBarBg,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
})
