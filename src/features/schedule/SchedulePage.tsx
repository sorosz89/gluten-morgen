import { Link } from 'react-router-dom'
import { anchorRepository } from '../../data/anchorRepository.ts'
import { recipes } from '../../data/recipes.ts'
import { mealTypeLabel, recipeHasGlutenRiskIngredient } from '../../domain/catalog.ts'
import { formatIsoDate, getBlockRecipeIds, getSchedule, parseIsoDate } from '../../domain/rotation.ts'
import type { BlockNumber, ScheduleDay } from '../../domain/rotation.ts'
import styles from './SchedulePage.module.css'

const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]))

const WEEKDAY_LABELS = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']

interface SchedulePageProps {
  today?: Date
}

function SchedulePage({ today = new Date() }: SchedulePageProps = {}) {
  const anchorIso = anchorRepository.getAnchor()

  return (
    <div className={styles.page}>
      {!anchorIso && (
        <>
          <p>Nincs beállítva a ciklus kezdete.</p>
          <Link to="/ma" className={styles.anchorLink}>
            Állítsd be a Ma oldalon, hogy a heti terv tudja, hol állunk a forgásban.
          </Link>
        </>
      )}

      {anchorIso && <ScheduleDays anchorIso={anchorIso} today={today} />}
    </div>
  )
}

function ScheduleDays({ anchorIso, today }: { anchorIso: string; today: Date }) {
  const schedule = getSchedule(parseIsoDate(anchorIso), today)

  return (
    <ul className={styles.dayList}>
      {schedule.map((day) => (
        <ScheduleDayRow key={formatIsoDate(day.date)} day={day} />
      ))}
    </ul>
  )
}

function ScheduleDayRow({ day }: { day: ScheduleDay }) {
  const weekday = WEEKDAY_LABELS[day.date.getDay()]

  return (
    <li className={styles.day}>
      <div className={styles.dayHeader}>
        <span className={styles.date}>{formatIsoDate(day.date)}</span>
        <span className={styles.weekday}>{weekday}</span>
        <span className={styles.block}>{day.block}. blokk</span>
        <span className={styles.dayInBlock}>
          {day.dayInBlock}. nap / {day.blockLength}
        </span>
        {day.isLastDayOfBlock && <span className={styles.lastDay}>Utolsó nap</span>}
        <span className={styles.cookFlag}>Kell főzni: {day.cookToday ? 'igen' : 'nem'}</span>
      </div>

      {day.cookToday && <BlockMeals block={day.block} />}
    </li>
  )
}

function BlockMeals({ block }: { block: BlockNumber }) {
  const { breakfastId, lunchId, dinnerId } = getBlockRecipeIds(block)
  const breakfast = recipesById.get(breakfastId)!
  const lunch = recipesById.get(lunchId)!
  const dinner = recipesById.get(dinnerId)!

  return (
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
  )
}

export default SchedulePage
