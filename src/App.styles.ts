import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import { shellColors } from './styles/shellColors.ts'
import { bpLarge } from './styles/breakpoints.ts'

export { mergeClasses }

// A two-row top nav bar (brand + current-page title, then a segmented icon
// control) spanning the full width, with the routed page below it.
// impeccable /live redesign, mobile-first: labels are now visible under each
// icon rather than icon-only, and the active route fills its segment with a
// background instead of a thin bottom border. Dark/purple shell palette
// carries over unchanged (utilityBarBg for the bar, the same nav-link color
// tiers for default/active items).
export const useAppStyles = makeStyles({
  appShell: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    backgroundColor: shellColors.backdropBase,
  },
  navBar: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: shellColors.utilityBarBg,
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  navRow1: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 1rem 0.3rem',
  },
  brand: {
    color: shellColors.navLinkDefault,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  },
  navPageTitle: {
    color: shellColors.navLinkActive,
    fontSize: '0.78rem',
    fontWeight: tokens.fontWeightSemibold,
  },
  navRow2: {
    display: 'flex',
    padding: '0 0.5rem 0.5rem',
    columnGap: '0.25rem',
    [`@media (min-width: ${bpLarge}px)`]: {
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%',
    },
  },
  // Each item is a full-width flex segment with a visible label under the
  // icon (icon-only was dropped for mobile-first legibility — a quick
  // glance beats guessing an icon's meaning with wet/busy hands). The
  // active segment fills with a background rather than a thin bottom
  // border, a stronger, easier-to-spot signal at a glance.
  navBarItem: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: '0.15rem',
    minHeight: '44px',
    padding: '0.3rem 0.2rem',
    borderRadius: '10px',
    color: shellColors.navLinkDefault,
    textDecorationLine: 'none',
    ':hover': {
      color: shellColors.navLinkActive,
    },
    ':focus-visible': {
      color: shellColors.navLinkActive,
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: shellColors.navLinkActive,
      outlineOffset: '-2px',
    },
  },
  navBarItemActive: {
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  navLabel: {
    fontSize: '0.6rem',
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: 'nowrap',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minWidth: 0,
  },
})
