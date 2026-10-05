import { mergeClasses } from '@fluentui/react-components'
import { Link } from 'react-router-dom'
import { anchorRepository } from '../../data/anchorRepository.ts'
import { lunchSwapRepository } from '../../data/lunchSwapRepository.ts'
import { recipes } from '../../data/recipes.ts'
import { mealTypeLabel, recipeHasGlutenRiskIngredient } from '../../domain/catalog.ts'
import { getActiveLunchId } from '../../domain/lunchSwap.ts'
import { formatIsoDate, getBlockRecipeIds, getSchedule, parseIsoDate } from '../../domain/rotation.ts'
import type { BlockNumber, ScheduleDay } from '../../domain/rotation.ts'
import { usePageBackdropStyles } from '../../styles/shell.ts'
import { useScheduleStyles } from './SchedulePage.styles.ts'
import styles from '../../styles/page.module.css'

const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]))

const WEEKDAY_LABELS = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']

function mealChipClass(fluentStyles: ReturnType<typeof useScheduleStyles>, mealType: string): string {
  if (mealType === 'breakfast') return fluentStyles.mealChipBreakfast
  if (mealType === 'dinner') return fluentStyles.mealChipDinner
  return fluentStyles.mealChipLunch
}

interface SchedulePageProps {
  today?: Date
}

function SchedulePage({ today = new Date() }: SchedulePageProps = {}) {
  const fluentStyles = useScheduleStyles()
  const backdropStyles = usePageBackdropStyles()
  const anchorIso = anchorRepository.getAnchor()

  return (
    <div className={backdropStyles.backdrop}>
      <div className={styles.page}>
        {!anchorIso && (
          <>
            <p className={fluentStyles.emptyState}>Nincs beállítva a ciklus kezdete.</p>
            <Link to="/ma" className={fluentStyles.anchorLink}>
              Állítsd be a Ma oldalon, hogy a heti terv tudja, hol állunk a forgásban.
            </Link>
          </>
        )}

        {anchorIso && <ScheduleDays anchorIso={anchorIso} today={today} />}
      </div>
    </div>
  )
}

function ScheduleDays({ anchorIso, today }: { anchorIso: string; today: Date }) {
  const fluentStyles = useScheduleStyles()
  const schedule = getSchedule(parseIsoDate(anchorIso), today)

  return (
    <ul className={fluentStyles.dayList}>
      {schedule.map((day) => (
        <ScheduleDayRow key={formatIsoDate(day.date)} day={day} />
      ))}
    </ul>
  )
}

function ScheduleDayRow({ day }: { day: ScheduleDay }) {
  const fluentStyles = useScheduleStyles()
  const weekday = WEEKDAY_LABELS[day.date.getDay()]

  return (
    <li className={mergeClasses(fluentStyles.day, day.cookToday && fluentStyles.dayWide)}>
      <div className={mergeClasses(fluentStyles.dayHeader, day.cookToday && fluentStyles.dayHeaderWide)}>
        <span className={fluentStyles.weekday}>{formatIsoDate(day.date)}</span>
        <span className={fluentStyles.weekday}>{weekday}</span>
        <span className={fluentStyles.secondary}>{day.block}. blokk</span>
        <span className={fluentStyles.secondary}>
          {day.dayInBlock}. nap / {day.blockLength}
        </span>
        {day.isLastDayOfBlock && <span className={fluentStyles.lastDay}>Utolsó nap</span>}
        <span className={mergeClasses(fluentStyles.secondary, day.cookToday && fluentStyles.cookYes)}>
          Kell főzni: {day.cookToday ? 'igen' : 'nem'}
        </span>
      </div>

      {day.cookToday && <BlockMeals block={day.block} />}
    </li>
  )
}

function BlockMeals({ block }: { block: BlockNumber }) {
  const fluentStyles = useScheduleStyles()
  const { breakfastId, dinnerId } = getBlockRecipeIds(block)
  const lunchId = getActiveLunchId(block, lunchSwapRepository.getSwaps())
  const breakfast = recipesById.get(breakfastId)!
  const lunch = recipesById.get(lunchId)!
  const dinner = recipesById.get(dinnerId)!

  return (
    <ul className={fluentStyles.mealList}>
      {[breakfast, lunch, dinner].map((recipe) => (
        <li key={recipe.id}>
          <Link to={`/recipes/${recipe.id}`} className={fluentStyles.mealLink}>
            <span className={mergeClasses(fluentStyles.mealChip, mealChipClass(fluentStyles, recipe.mealType))}>
              {mealTypeLabel(recipe.mealType)}
            </span>
            <span>{recipe.title}</span>
            {recipeHasGlutenRiskIngredient(recipe) && (
              <span className={fluentStyles.glutenBadge}>Gluténmentes termék szükséges</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default SchedulePage
