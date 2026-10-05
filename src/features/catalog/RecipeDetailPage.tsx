import { Link, Navigate, useParams } from 'react-router-dom'
import { recipes } from '../../data/recipes.ts'
import { mealTypeLabel } from '../../domain/catalog.ts'
import type { Ingredient } from '../../domain/recipe.ts'
import { usePageBackdropStyles } from '../../styles/shell.ts'
import { useRecipeDetailStyles } from './RecipeDetailPage.styles.ts'
import styles from '../../styles/page.module.css'

function formatIngredientLine(ingredient: Ingredient): string {
  const amountLabel = ingredient.amountText ?? ingredient.amount
  const parts = [amountLabel, ingredient.unit, ingredient.name].filter(
    (part): part is string | number => part !== null && part !== undefined,
  )
  const line = parts.join(' ')
  return ingredient.note ? `${line} (${ingredient.note})` : line
}

function RecipeDetailPage() {
  const fluentStyles = useRecipeDetailStyles()
  const backdropStyles = usePageBackdropStyles()
  const { id } = useParams()
  const recipe = recipes.find((candidate) => candidate.id === id)

  if (!recipe) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={backdropStyles.backdrop}>
      <div className={styles.page}>
        <Link to="/" className={fluentStyles.backLink}>
          Vissza a receptekhez
        </Link>
        <h1 className={fluentStyles.title}>{recipe.title}</h1>
        <span className={fluentStyles.mealType}>{mealTypeLabel(recipe.mealType)}</span>
        <span className={fluentStyles.servings}>{recipe.servingsLabel}</span>

        <div className={fluentStyles.twoColumn}>
          <div className={fluentStyles.ingredientsColumn}>
            <ul className={fluentStyles.list} aria-label="Hozzávalók">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className={fluentStyles.listItem}>
                  {formatIngredientLine(ingredient)}
                  {ingredient.mustBeGlutenFree && (
                    <span className={fluentStyles.badge}>Gluténmentes termék szükséges</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={fluentStyles.stepsColumn}>
            {recipe.stepGroups.map((stepGroup, index) => (
              <section key={index} className={fluentStyles.stepCard}>
                <h2 className={fluentStyles.stepHeading}>{stepGroup.heading}</h2>
                <ol className={fluentStyles.stepList}>
                  {stepGroup.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className={fluentStyles.stepListItem}>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>

        {recipe.tip && <p className={fluentStyles.tip}>{recipe.tip}</p>}

        {recipe.macros && (
          <ul className={fluentStyles.list} aria-label="Makrók">
            <li className={fluentStyles.listItem}>{recipe.macros.kcal} kcal</li>
            <li className={fluentStyles.listItem}>{recipe.macros.proteinG} g fehérje</li>
            <li className={fluentStyles.listItem}>{recipe.macros.carbsG} g szénhidrát</li>
            <li className={fluentStyles.listItem}>{recipe.macros.saltMg} mg só</li>
            <li className={fluentStyles.listItem}>{recipe.macros.fatG} g zsír</li>
            <li className={fluentStyles.listItem}>{recipe.macros.fiberG} g rost</li>
          </ul>
        )}

        {recipe.glutenFreeNote && <p className={fluentStyles.glutenFreeNote}>{recipe.glutenFreeNote}</p>}

        {recipe.source && <p className={fluentStyles.source}>Forrás: {recipe.source}</p>}
      </div>
    </div>
  )
}

export default RecipeDetailPage
