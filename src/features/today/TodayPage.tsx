import { Link } from 'react-router-dom'
import { anchorRepository } from '../../data/anchorRepository.ts'
import { recipes } from '../../data/recipes.ts'
import { mealTypeLabel, recipeHasGlutenRiskIngredient } from '../../domain/catalog.ts'
import { getBlockRecipeIds, getRotationDay, parseIsoDate } from '../../domain/rotation.ts'
import styles from './TodayPage.module.css'

const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]))

interface TodayPageProps {
  today?: Date
}

function TodayPage({ today = new Date() }: TodayPageProps = {}) {
  const anchorIso = anchorRepository.getAnchor()

  if (!anchorIso) {
    return (
      <div className={styles.page}>
        <p>Add meg, melyik vasárnap kezdődik az 1. hét, hogy a Ma képernyő tudja, hol állunk a forgásban.</p>
      </div>
    )
  }

  const { block, cookToday } = getRotationDay(parseIsoDate(anchorIso), today)
  const { breakfastId, lunchId, dinnerId } = getBlockRecipeIds(block)
  const breakfast = recipesById.get(breakfastId)!
  const lunch = recipesById.get(lunchId)!
  const dinner = recipesById.get(dinnerId)!

  return (
    <div className={styles.page}>
      <p>
        Kell főzni ma? <strong>{cookToday ? 'igen' : 'nem'}</strong>
      </p>
      <ul className={styles.mealList}>
        {[breakfast, lunch, dinner].map((recipe) => (
          <li key={recipe.id}>
            {mealTypeLabel(recipe.mealType)}: <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
            {recipeHasGlutenRiskIngredient(recipe) && (
              <span className={styles.badge}>Gluténmentes termék szükséges</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodayPage
