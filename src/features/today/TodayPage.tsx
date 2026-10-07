import { Button, Caption1, Field, Input, Subtitle1, Text } from '@fluentui/react-components'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import GlutenCheckTag from '../../components/GlutenCheckTag.tsx'
import GlutenRiskBadge from '../../components/GlutenRiskBadge.tsx'
import MealTypeChip from '../../components/MealTypeChip.tsx'
import { anchorRepository } from '../../data/anchorRepository.ts'
import { lunchSwapRepository } from '../../data/lunchSwapRepository.ts'
import { recipes } from '../../data/recipes.ts'
import { mealTypeLabel, recipeHasGlutenRiskIngredient, recipeNeedsLabelCheck } from '../../domain/catalog.ts'
import { getActiveLunchId } from '../../domain/lunchSwap.ts'
import type { MealType } from '../../domain/recipe.ts'
import { formatIsoDate, getBlockRecipeIds, getRotationDay, isSunday, parseIsoDate } from '../../domain/rotation.ts'
import { usePageBackdropStyles } from '../../styles/shell.ts'
import { mergeClasses, useTodayStyles } from './TodayPage.styles.ts'
import styles from '../../styles/page.module.css'

const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]))
const WEEKDAY_LABELS = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']

interface TodayPageProps {
  today?: Date
}

function TodayPage({ today = new Date() }: TodayPageProps = {}) {
  const fluentStyles = useTodayStyles()
  const backdropStyles = usePageBackdropStyles()
  const [anchorIso, setAnchorIso] = useState(() => anchorRepository.getAnchor())
  const [draftAnchor, setDraftAnchor] = useState(anchorIso ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isEditingAnchor, setIsEditingAnchor] = useState(() => !anchorRepository.getAnchor())

  function handleSave(event: FormEvent) {
    event.preventDefault()

    if (!draftAnchor || !isSunday(parseIsoDate(draftAnchor))) {
      setError('Válassz vasárnapot.')
      return
    }

    anchorRepository.setAnchor(draftAnchor)
    setAnchorIso(draftAnchor)
    setError(null)
    setIsEditingAnchor(false)
  }

  function handleEditClick() {
    setDraftAnchor(anchorIso ?? '')
    setError(null)
    setIsEditingAnchor(true)
  }

  return (
    <div className={backdropStyles.backdrop}>
      <div className={styles.page}>
        <Caption1 as="p" className={fluentStyles.dateLine}>
          {formatIsoDate(today)}, {WEEKDAY_LABELS[today.getDay()]}
        </Caption1>

        {!anchorIso && (
          <Text as="p" className={fluentStyles.setupPrompt}>
            Add meg, melyik vasárnap kezdődik az 1. hét, hogy a Ma képernyő tudja, hol állunk a forgásban.
          </Text>
        )}

        {anchorIso && <TodayMeals anchorIso={anchorIso} today={today} />}

        {isEditingAnchor ? (
          <form
            onSubmit={handleSave}
            className={mergeClasses(fluentStyles.anchorFormCard, fluentStyles.settingsHandoff)}
          >
            <Field label="Ciklus kezdete (vasárnap)">
              <Input
                type="date"
                value={draftAnchor}
                onChange={(_event, data) => setDraftAnchor(data.value)}
                className={fluentStyles.tapTarget44}
                input={{ className: fluentStyles.tapTarget44 }}
              />
            </Field>
            <Button type="submit" appearance="primary" className={fluentStyles.tapTarget44}>
              Mentés
            </Button>
            {error && (
              <Text role="alert" as="p">
                {error}
              </Text>
            )}
          </form>
        ) : (
          <Button
            type="button"
            appearance="subtle"
            onClick={handleEditClick}
            className={mergeClasses(fluentStyles.tapTarget44, fluentStyles.editButtonOffCard, fluentStyles.settingsHandoff)}
          >
            Ciklus kezdetének módosítása
          </Button>
        )}
      </div>
    </div>
  )
}

function TodayMeals({ anchorIso, today }: { anchorIso: string; today: Date }) {
  const fluentStyles = useTodayStyles()
  const { block, cookToday } = getRotationDay(parseIsoDate(anchorIso), today)
  const { breakfastId, dinnerId } = getBlockRecipeIds(block)
  const lunchId = getActiveLunchId(block, lunchSwapRepository.getSwaps())

  const meals: Array<{ mealType: MealType; recipe: ReturnType<typeof recipesById.get> }> = [
    { mealType: 'breakfast', recipe: recipesById.get(breakfastId) },
    { mealType: 'lunch', recipe: recipesById.get(lunchId) },
    { mealType: 'dinner', recipe: recipesById.get(dinnerId) },
  ]

  const railClassByType: Record<MealType, string> = {
    breakfast: fluentStyles.railBreakfast,
    lunch: fluentStyles.railLunch,
    dinner: fluentStyles.railDinner,
    alternative: fluentStyles.railLunch,
    extra: fluentStyles.railLunch,
  }

  return (
    <>
      <Subtitle1 as="p" block className={fluentStyles.cookStatus}>
        Kell főzni ma?{' '}
        <strong className={cookToday ? fluentStyles.cookStatusYes : undefined}>
          {cookToday ? 'igen' : 'nem'}
        </strong>
      </Subtitle1>
      <div className={fluentStyles.mealCards}>
        {meals.map(({ mealType, recipe }) =>
          recipe ? (
            <Link
              key={mealType}
              to={`/recipes/${recipe.id}`}
              className={fluentStyles.mealCard}
            >
              <div className={mergeClasses(fluentStyles.mealCardRail, railClassByType[mealType])} />
              <div className={fluentStyles.mealCardBody}>
                <MealTypeChip mealType={mealType} className={fluentStyles.mealChipSpacing} />
                <p className={fluentStyles.mealCardTitle}>{recipe.title}</p>
                {recipeHasGlutenRiskIngredient(recipe) && <GlutenRiskBadge />}
                {recipeNeedsLabelCheck(recipe) && <GlutenCheckTag />}
              </div>
            </Link>
          ) : (
            <Text key={mealType} role="alert" as="p" className={fluentStyles.mealError}>
              <Text weight="bold">{mealTypeLabel(mealType)}:</Text> a recept nem található.
            </Text>
          ),
        )}
      </div>
    </>
  )
}

export default TodayPage
