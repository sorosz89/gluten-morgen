import { Link, Route, Routes } from 'react-router-dom'
import styles from './App.module.css'
import CatalogPage from './features/catalog/CatalogPage.tsx'
import RecipeDetailPage from './features/catalog/RecipeDetailPage.tsx'
import SchedulePage from './features/schedule/SchedulePage.tsx'
import ShoppingPage from './features/shopping/ShoppingPage.tsx'
import TodayPage from './features/today/TodayPage.tsx'

function App() {
  return (
    <>
      <nav className={styles.nav}>
        <Link to="/">Receptek</Link>
        <Link to="/ma">Ma</Link>
        <Link to="/heti-terv">Heti terv</Link>
        <Link to="/bevasarlas">Lista</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/ma" element={<TodayPage />} />
        <Route path="/heti-terv" element={<SchedulePage />} />
        <Route path="/bevasarlas" element={<ShoppingPage />} />
      </Routes>
    </>
  )
}

export default App
