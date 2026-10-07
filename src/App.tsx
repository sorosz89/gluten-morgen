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

  const routes = (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      <Route path="/ma" element={<TodayPage />} />
      <Route path="/heti-terv" element={<SchedulePage />} />
      <Route path="/bevasarlas" element={<ShoppingPage />} />
      <Route path="/cimkek" element={<LabelChecklistPage />} />
      <Route path="/csere" element={<LunchSwapPage />} />
    </Routes>
  )

  return (
    <div className={styles.appShell}>
      <nav className={styles.navBar}>
        <span className={styles.brand}>Zero Gluten</span>
        <div className={styles.navBarItems}>
          {NAV_LINKS.map(({ to, label, Icon }) => {
            const isActive = pathname === to
            return (
              <a
                key={to}
                href={to}
                onClick={(event) => handleNavClick(event, navigate, to)}
                aria-label={label}
                className={mergeClasses(styles.navBarItem, isActive && styles.navBarItemActive)}
              >
                <Icon filled={isActive} />
              </a>
            )
          })}
        </div>
      </nav>
      <div className={styles.content}>{routes}</div>
    </div>
  )
}

export default App
