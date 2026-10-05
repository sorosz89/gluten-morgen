import {
  Hamburger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
} from '@fluentui/react-components'
import {
  ArrowSwapFilled,
  ArrowSwapRegular,
  BookOpenFilled,
  BookOpenRegular,
  bundleIcon,
  CalendarWeekStartFilled,
  CalendarWeekStartRegular,
  CartFilled,
  CartRegular,
  HomeFilled,
  HomeRegular,
  TagFilled,
  TagRegular,
} from '@fluentui/react-icons'
import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { mergeClasses, useAppStyles } from './App.styles.ts'
import CatalogPage from './features/catalog/CatalogPage.tsx'
import RecipeDetailPage from './features/catalog/RecipeDetailPage.tsx'
import LabelChecklistPage from './features/labelChecklist/LabelChecklistPage.tsx'
import LunchSwapPage from './features/lunchSwap/LunchSwapPage.tsx'
import SchedulePage from './features/schedule/SchedulePage.tsx'
import ShoppingPage from './features/shopping/ShoppingPage.tsx'
import TodayPage from './features/today/TodayPage.tsx'
import { bpXLarge } from './styles/breakpoints.ts'

const RecipesIcon = bundleIcon(BookOpenFilled, BookOpenRegular)
const TodayIcon = bundleIcon(HomeFilled, HomeRegular)
const ScheduleIcon = bundleIcon(CalendarWeekStartFilled, CalendarWeekStartRegular)
const ShoppingIcon = bundleIcon(CartFilled, CartRegular)
const LabelsIcon = bundleIcon(TagFilled, TagRegular)
const SwapIcon = bundleIcon(ArrowSwapFilled, ArrowSwapRegular)

const NAV_LINKS = [
  { to: '/', label: 'Receptek', Icon: RecipesIcon },
  { to: '/ma', label: 'Ma', Icon: TodayIcon },
  { to: '/heti-terv', label: 'Heti terv', Icon: ScheduleIcon },
  { to: '/bevasarlas', label: 'Lista', Icon: ShoppingIcon },
  { to: '/cimkek', label: 'Címkék', Icon: LabelsIcon },
  { to: '/csere', label: 'Csere', Icon: SwapIcon },
] as const

// Below this width the nav pane collapses to an overlay; at or above it,
// it stays open inline alongside the page content.
const COMPACT_QUERY = `(max-width: ${bpXLarge - 1}px)`

function useIsCompactViewport(): boolean {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(COMPACT_QUERY).matches
      : false,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQueryList = window.matchMedia(COMPACT_QUERY)
    const handleChange = (event: MediaQueryListEvent) => setIsCompact(event.matches)

    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  return isCompact
}

// NavItem's slot only supports rendering as a plain <a>, not an arbitrary
// component — so client-side routing is wired by hand: a normal left-click
// is intercepted and handed to the router, while modified clicks (new tab,
// new window, etc.) keep the browser's native anchor behavior.
function handleNavClick(event: MouseEvent, navigate: ReturnType<typeof useNavigate>, to: string) {
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  event.preventDefault()
  navigate(to)
}

function App() {
  const styles = useAppStyles()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isCompact = useIsCompactViewport()
  const [isNavOpen, setIsNavOpen] = useState(!isCompact)

  // Auto-collapse when the viewport shrinks past the breakpoint, and
  // auto-restore when it grows back — the behavior the brief asked for. A
  // manual toggle (desktop or mobile) can still override this in between.
  // Adjusting state during render (rather than in an effect) on a tracked
  // "previous prop" avoids an extra commit — see the React docs' "adjusting
  // state when a prop changes" recipe.
  const [prevIsCompact, setPrevIsCompact] = useState(isCompact)
  if (isCompact !== prevIsCompact) {
    setPrevIsCompact(isCompact)
    setIsNavOpen(!isCompact)
  }

  return (
    <div className={styles.appShell}>
      <NavDrawer
        open={isNavOpen}
        type={isCompact ? 'overlay' : 'inline'}
        position="start"
        selectedValue={pathname}
        className={styles.navDrawer}
        onNavItemSelect={() => {
          if (isCompact) {
            setIsNavOpen(false)
          }
        }}
      >
        <NavDrawerHeader className={styles.navHeader}>
          <Hamburger
            aria-label="Menü összecsukása"
            onClick={() => setIsNavOpen(false)}
            className={styles.hamburger}
          />
          <span className={styles.brand}>Zero Gluten</span>
        </NavDrawerHeader>
        <NavDrawerBody className={styles.navBody}>
          {NAV_LINKS.map(({ to, label, Icon }) => {
            const isActive = pathname === to
            return (
              <NavItem
                key={to}
                value={to}
                href={to}
                onClick={(event) => handleNavClick(event, navigate, to)}
                icon={<Icon filled={isActive} />}
                className={mergeClasses(styles.navItem, isActive && styles.navItemActive)}
              >
                {label}
              </NavItem>
            )
          })}
        </NavDrawerBody>
      </NavDrawer>

      <div className={styles.content}>
        {!isNavOpen && (
          <div className={styles.collapsedTopBar}>
            <Hamburger
              aria-label="Menü megnyitása"
              onClick={() => setIsNavOpen(true)}
              className={styles.hamburger}
            />
            <span className={styles.brand}>Zero Gluten</span>
          </div>
        )}
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/ma" element={<TodayPage />} />
          <Route path="/heti-terv" element={<SchedulePage />} />
          <Route path="/bevasarlas" element={<ShoppingPage />} />
          <Route path="/cimkek" element={<LabelChecklistPage />} />
          <Route path="/csere" element={<LunchSwapPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
