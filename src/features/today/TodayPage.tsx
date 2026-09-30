import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { anchorRepository } from '../../data/anchorRepository.ts'
import { recipes } from '../../data/recipes.ts'
import { mealTypeLabel, recipeHasGlutenRiskIngredient } from '../../domain/catalog.ts'
import { getBlockRecipeIds, getRotationDay, isSunday, parseIsoDate } from '../../domain/rotation.ts'
import styles from './TodayPage.module.css'

const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]))

interface TodayPageProps {
  today?: Date
}

function TodayPage({ today = new Date() }: TodayPageProps = {}) {
  const [anchorIso, setAnchorIso] = useState(() => anchorRepository.getAnchor())
  const [draftAnchor, setDraftAnchor] = useState(anchorIso ?? '')
  const [error, setError] = useState<string | null>(null)

  function handleSave(event: FormEvent) {
    event.preventDefault()

    if (!draftAnchor || !isSunday(parseIsoDate(draftAnchor))) {
      setError('Válassz vasárnapot.')
      return
    }

    anchorRepository.setAnchor(draftAnchor)
    setAnchorIso(draftAnchor)
    setError(null)
  }

  return (
    <div className={styles.page}>
      {!anchorIso && (
        <p>Add meg, melyik vasárnap kezdődik az 1. hét, hogy a Ma képernyő tudja, hol állunk a forgásban.</p>
      )}

      {anchorIso && <TodayMeals anchorIso={anchorIso} today={today} />}

      <form onSubmit={handleSave} className={styles.anchorForm}>
        <label htmlFor="anchor-input">Ciklus kezdete (vasárnap)</label>
        <input
          id="anchor-input"
          type="date"
          value={draftAnchor}
          onChange={(event) => setDraftAnchor(event.target.value)}
        />
        <button type="submit">Mentés</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  )
}

function TodayMeals({ anchorIso, today }: { anchorIso: string; today: Date }) {
  const { block, cookToday } = getRotationDay(parseIsoDate(anchorIso), today)
  const { breakfastId, lunchId, dinnerId } = getBlockRecipeIds(block)
  const breakfast = recipesById.get(breakfastId)!
  const lunch = recipesById.get(lunchId)!
  const dinner = recipesById.get(dinnerId)!

  return (
    <>
      <p>
        Kell főzni ma? <strong>{cookToday ? 'igen' : 'nem'}</strong>
      </p>
      <ul className={styles.mealList}>
        {[breakfast, lunch, dinner].map((recipe) => (
          <li key={recipe.id}>
            <Link to={`/recipes/${recipe.id}`} className={styles.mealLink}>
              <span className={styles.mealType}>{mealTypeLabel(recipe.mealType)}:</span>
              <span>{recipe.title}</span>
              {recipeHasGlutenRiskIngredient(recipe) && (
                <span className={styles.badge}>Gluténmentes termék szükséges</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default TodayPage
