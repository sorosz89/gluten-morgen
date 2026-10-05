import { mergeClasses } from '@fluentui/react-components'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recipes } from '../../data/recipes.ts'
import {
  groupRecipesByMealType,
  recipeHasGlutenRiskIngredient,
  recipeMatchesQuery,
} from '../../domain/catalog.ts'
import { usePageBackdropStyles } from '../../styles/shell.ts'
import { useCatalogStyles } from './CatalogPage.styles.ts'
import styles from '../../styles/page.module.css'

function stripClass(fluentStyles: ReturnType<typeof useCatalogStyles>, mealType: string): string {
  if (mealType === 'breakfast') return fluentStyles.stripBreakfast
  if (mealType === 'lunch') return fluentStyles.stripLunch
  if (mealType === 'dinner') return fluentStyles.stripDinner
  return fluentStyles.stripNeutral
}

function CatalogPage() {
  const fluentStyles = useCatalogStyles()
  const backdropStyles = usePageBackdropStyles()
  const [query, setQuery] = useState('')
  const filteredRecipes = recipes.filter((recipe) => recipeMatchesQuery(recipe, query))
  const sections = groupRecipesByMealType(filteredRecipes)

  return (
    <div className={backdropStyles.backdrop}>
      <div className={styles.page}>
        <input
          type="search"
          className={fluentStyles.search}
          placeholder="Keresés recept vagy hozzávaló"
          aria-label="Keresés recept vagy hozzávaló alapján"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {sections.length === 0 && <p className={fluentStyles.noResults}>Nincs találat.</p>}
        {sections.map((section) => (
          <section key={section.mealType} className={fluentStyles.section}>
            <h2 className={fluentStyles.sectionTitle}>{section.label}</h2>
            <ul className={fluentStyles.cardList}>
              {section.recipes.map((recipe) => (
                <li key={recipe.id}>
                  <Link to={`/recipes/${recipe.id}`} className={fluentStyles.card}>
                    <div className={mergeClasses(fluentStyles.strip, stripClass(fluentStyles, section.mealType))} />
                    <div className={fluentStyles.cardBody}>
                      <p className={fluentStyles.cardTitle}>{recipe.title}</p>
                      <p className={fluentStyles.servings}>{recipe.servingsLabel}</p>
                      {recipeHasGlutenRiskIngredient(recipe) && (
                        <span className={fluentStyles.badge}>Gluténmentes termék szükséges</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export default CatalogPage
