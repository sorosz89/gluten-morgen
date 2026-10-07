import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CheckmarkCircle20Filled, Circle20Regular, Warning16Filled } from '@fluentui/react-icons'
import GlutenRiskBadge from '../../components/GlutenRiskBadge.tsx'
import MealTypeChip from '../../components/MealTypeChip.tsx'
import { recipePortionsRepository } from '../../data/recipePortionsRepository.ts'
import { recipes } from '../../data/recipes.ts'
import type { Ingredient } from '../../domain/recipe.ts'
import {
  DEFAULT_PORTION_COUNT,
  MAX_PORTION_COUNT,
  MIN_PORTION_COUNT,
  parseBaseCount,
  scaleIngredient,
} from '../../domain/recipeScaling.ts'
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
  const [count, setCount] = useState<number>(
    () => recipePortionsRepository.getPortions(id ?? '') ?? DEFAULT_PORTION_COUNT,
  )
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => new Set())
  // A new recipe id (navigating from one detail page straight to another)
  // must start with a clean checklist rather than carrying over the
  // previous recipe's checked steps — adjusted during render on a tracked
  // "previous id", the same pattern App.tsx uses for its compact-viewport
  // reset, to avoid an extra effect-driven commit.
  const [checklistId, setChecklistId] = useState(id)
  if (id !== checklistId) {
    setChecklistId(id)
    setCheckedSteps(new Set())
  }

  // Keep the screen awake while a recipe is open — the product's own stated
  // context is cooking with wet/busy hands, where the screen timing out
  // mid-step is a real interruption. Best-effort: silently does nothing on
  // browsers without the Wake Lock API (including jsdom in tests).
  useEffect(() => {
    if (!recipe || !('wakeLock' in navigator)) return

    let sentinel: WakeLockSentinel | undefined
    let cancelled = false

    navigator.wakeLock
      .request('screen')
      .then((lock) => {
        if (cancelled) {
          lock.release()
          return
        }
        sentinel = lock
      })
      .catch(() => {
        // Permission denied or unsupported in this context — no-op.
      })

    return () => {
      cancelled = true
      sentinel?.release()
    }
  }, [recipe])

  if (!recipe) {
    return <Navigate to="/" replace />
  }

  const recipeId = recipe.id

  function updateCount(next: number) {
    const clamped = Math.min(MAX_PORTION_COUNT, Math.max(MIN_PORTION_COUNT, next))
    setCount(clamped)
    recipePortionsRepository.setPortions(recipeId, clamped)
  }

  function toggleStep(stepKey: string) {
    setCheckedSteps((previous) => {
      const next = new Set(previous)
      if (next.has(stepKey)) {
        next.delete(stepKey)
      } else {
        next.add(stepKey)
      }
      return next
    })
  }

  const factor = count / parseBaseCount(recipe.servingsLabel)
  const scaledIngredients = recipe.ingredients.map((ingredient) => scaleIngredient(ingredient, factor))

  return (
    <div className={backdropStyles.backdrop}>
      <div className={styles.page}>
        <Link to="/" className={fluentStyles.backLink}>
          Vissza a receptekhez
        </Link>
        <h1 className={fluentStyles.title}>{recipe.title}</h1>
        <MealTypeChip mealType={recipe.mealType} className={fluentStyles.mealTypeChipSpacing} />
        <span className={fluentStyles.servings}>{recipe.servingsLabel}</span>

        {recipe.glutenFreeNote && (
          <p className={fluentStyles.glutenFreeNote}>
            <Warning16Filled className={fluentStyles.glutenFreeNoteIcon} aria-hidden="true" />
            {recipe.glutenFreeNote}
          </p>
        )}

        <div className={fluentStyles.portionControl}>
          <button
            type="button"
            className={fluentStyles.portionButton}
            onClick={() => updateCount(count - 1)}
            disabled={count <= MIN_PORTION_COUNT}
            aria-label="Adag csökkentése"
          >
            −
          </button>
          <span className={fluentStyles.portionCount}>{count} adag</span>
          <button
            type="button"
            className={fluentStyles.portionButton}
            onClick={() => updateCount(count + 1)}
            disabled={count >= MAX_PORTION_COUNT}
            aria-label="Adag növelése"
          >
            +
          </button>
        </div>

        <div className={fluentStyles.twoColumn}>
          <div className={fluentStyles.ingredientsColumn}>
            <ul className={fluentStyles.list} aria-label="Hozzávalók">
              {scaledIngredients.map((ingredient, index) => (
                <li key={index} className={fluentStyles.listItem}>
                  {formatIngredientLine(ingredient)}
                  {ingredient.mustBeGlutenFree && (
                    <GlutenRiskBadge className={fluentStyles.badgeSpacing} />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={fluentStyles.stepsColumn}>
            {recipe.stepGroups.map((stepGroup, groupIndex) => (
              <section key={groupIndex} className={fluentStyles.stepCard}>
                <h2 className={fluentStyles.stepHeading}>{stepGroup.heading}</h2>
                <ol className={fluentStyles.stepList}>
                  {stepGroup.steps.map((step, stepIndex) => {
                    const stepKey = `${groupIndex}-${stepIndex}`
                    const isDone = checkedSteps.has(stepKey)
                    return (
                      <li key={stepIndex} className={fluentStyles.stepListItem}>
                        <button
                          type="button"
                          className={fluentStyles.stepButton}
                          aria-pressed={isDone}
                          onClick={() => toggleStep(stepKey)}
                        >
                          {isDone ? (
                            <CheckmarkCircle20Filled className={fluentStyles.stepCheckIconDone} />
                          ) : (
                            <Circle20Regular className={fluentStyles.stepCheckIcon} />
                          )}
                          <span className={isDone ? fluentStyles.stepTextDone : undefined}>{step}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </section>
            ))}
          </div>
        </div>

        {recipe.tip && <p className={fluentStyles.tip}>{recipe.tip}</p>}

        {recipe.macros && (
          <>
            <p className={fluentStyles.macrosCaption}>Tápérték (adagonként)</p>
            <ul className={fluentStyles.macrosList} aria-label="Makrók">
              <li className={fluentStyles.macrosListItem}>{recipe.macros.kcal} kcal</li>
              <li className={fluentStyles.macrosListItem}>{recipe.macros.proteinG} g fehérje</li>
              <li className={fluentStyles.macrosListItem}>{recipe.macros.carbsG} g szénhidrát</li>
              <li className={fluentStyles.macrosListItem}>{recipe.macros.saltMg} mg só</li>
              <li className={fluentStyles.macrosListItem}>{recipe.macros.fatG} g zsír</li>
              <li className={fluentStyles.macrosListItem}>{recipe.macros.fiberG} g rost</li>
            </ul>
          </>
        )}

        {recipe.source && <p className={fluentStyles.source}>Forrás: {recipe.source}</p>}
      </div>
    </div>
  )
}

export default RecipeDetailPage
