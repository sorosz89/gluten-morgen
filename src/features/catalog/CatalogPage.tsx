import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recipes } from '../../data/recipes.ts'
import {
  groupRecipesByMealType,
  recipeHasGlutenRiskIngredient,
  recipeMatchesQuery,
} from '../../domain/catalog.ts'
import styles from './CatalogPage.module.css'

function CatalogPage() {
  const [query, setQuery] = useState('')
  const filteredRecipes = recipes.filter((recipe) => recipeMatchesQuery(recipe, query))
  const sections = groupRecipesByMealType(filteredRecipes)

  return (
    <div className={styles.page}>
      <input
        type="search"
        className={styles.search}
        placeholder="Keresés recept vagy hozzávaló alapján"
        aria-label="Keresés recept vagy hozzávaló alapján"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {sections.length === 0 && <p className={styles.noResults}>Nincs találat.</p>}
      {sections.map((section) => (
        <section key={section.mealType} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.label}</h2>
          <ul className={styles.cardList}>
            {section.recipes.map((recipe) => (
              <li key={recipe.id}>
                <Link to={`/recipes/${recipe.id}`} className={styles.card}>
                  <p className={styles.cardTitle}>{recipe.title}</p>
                  <p className={styles.servings}>{recipe.servingsLabel}</p>
                  {recipeHasGlutenRiskIngredient(recipe) && (
                    <span className={styles.badge}>Gluténmentes termék szükséges</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default CatalogPage
