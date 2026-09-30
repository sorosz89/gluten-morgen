import { Link, Navigate, useParams } from 'react-router-dom'
import { recipes } from '../../data/recipes.ts'
import { mealTypeLabel } from '../../domain/catalog.ts'
import type { Ingredient } from '../../domain/recipe.ts'
import styles from './RecipeDetailPage.module.css'

function formatIngredientLine(ingredient: Ingredient): string {
  const amountLabel = ingredient.amountText ?? ingredient.amount
  const parts = [amountLabel, ingredient.unit, ingredient.name].filter(
    (part): part is string | number => part !== null && part !== undefined,
  )
  const line = parts.join(' ')
  return ingredient.note ? `${line} (${ingredient.note})` : line
}

function RecipeDetailPage() {
  const { id } = useParams()
  const recipe = recipes.find((candidate) => candidate.id === id)

  if (!recipe) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        Vissza a receptekhez
      </Link>
      <h1>{recipe.title}</h1>
      <p className={styles.mealType}>{mealTypeLabel(recipe.mealType)}</p>
      <p className={styles.servings}>{recipe.servingsLabel}</p>

      <ul className={styles.ingredientList} aria-label="Hozzávalók">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {formatIngredientLine(ingredient)}
            {ingredient.mustBeGlutenFree && (
              <span className={styles.badge}>Gluténmentes termék szükséges</span>
            )}
          </li>
        ))}
      </ul>

      {recipe.stepGroups.map((stepGroup, index) => (
        <section key={index}>
          <h2>{stepGroup.heading}</h2>
          <ol className={styles.stepList}>
            {stepGroup.steps.map((step, stepIndex) => (
              <li key={stepIndex}>{step}</li>
            ))}
          </ol>
        </section>
      ))}

      {recipe.tip && <p className={styles.tip}>{recipe.tip}</p>}

      {recipe.macros && (
        <ul className={styles.macrosList} aria-label="Makrók">
          <li>{recipe.macros.kcal} kcal</li>
          <li>{recipe.macros.proteinG} g fehérje</li>
          <li>{recipe.macros.carbsG} g szénhidrát</li>
          <li>{recipe.macros.saltMg} mg só</li>
          <li>{recipe.macros.fatG} g zsír</li>
          <li>{recipe.macros.fiberG} g rost</li>
        </ul>
      )}

      {recipe.glutenFreeNote && <p className={styles.glutenFreeNote}>{recipe.glutenFreeNote}</p>}

      {recipe.source && <p className={styles.source}>Forrás: {recipe.source}</p>}
    </div>
  )
}

export default RecipeDetailPage
