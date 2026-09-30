import { recipes } from '../../data/recipes.ts'
import { groupRecipesByMealType, recipeHasGlutenRiskIngredient } from '../../domain/catalog.ts'
import styles from './CatalogPage.module.css'

function CatalogPage() {
  const sections = groupRecipesByMealType(recipes)

  return (
    <div className={styles.page}>
      {sections.map((section) => (
        <section key={section.mealType} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.label}</h2>
          <ul className={styles.cardList}>
            {section.recipes.map((recipe) => (
              <li key={recipe.id} className={styles.card}>
                <p className={styles.cardTitle}>{recipe.title}</p>
                <p className={styles.servings}>{recipe.servingsLabel}</p>
                {recipeHasGlutenRiskIngredient(recipe) && (
                  <span className={styles.badge}>Gluténmentes termék szükséges</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default CatalogPage
