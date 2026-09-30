import { Route, Routes } from 'react-router-dom'
import CatalogPage from './features/catalog/CatalogPage.tsx'
import RecipeDetailPage from './features/catalog/RecipeDetailPage.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/recipes/:id" element={<RecipeDetailPage />} />
    </Routes>
  )
}

export default App
