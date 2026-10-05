import { useState } from 'react'
import { lunchSwapRepository } from '../../data/lunchSwapRepository.ts'
import { recipes } from '../../data/recipes.ts'
import { shoppingList } from '../../data/shoppingList.ts'
import { shoppingListRepository } from '../../data/shoppingListRepository.ts'
import type { ActiveSwaps } from '../../domain/lunchSwap.ts'
import { ALTERNATIVE_RECIPE_IDS, getActiveLunchId } from '../../domain/lunchSwap.ts'
import { applyLunchSwaps, diffRemovedItems } from '../../domain/lunchShoppingMap.ts'
import { BLOCK_RECIPE_IDS } from '../../domain/rotation.ts'
import type { BlockNumber } from '../../domain/rotation.ts'
import { usePageBackdropStyles } from '../../styles/shell.ts'
import { useLunchSwapStyles } from './LunchSwapPage.styles.ts'
import styles from '../../styles/page.module.css'

const BLOCK_NUMBERS: BlockNumber[] = [1, 2, 3, 4]

const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]))
const alternatives = ALTERNATIVE_RECIPE_IDS.map((id) => recipesById.get(id)!)

function LunchSwapPage() {
  const fluentStyles = useLunchSwapStyles()
  const backdropStyles = usePageBackdropStyles()
  const [swaps, setSwaps] = useState<ActiveSwaps>(() => lunchSwapRepository.getSwaps())

  function handleChange(block: BlockNumber, value: string) {
    const recipeId = value === '' ? null : value
    const before = applyLunchSwaps(shoppingList, swaps, recipesById)

    lunchSwapRepository.setSwap(block, recipeId)
    const nextSwaps = lunchSwapRepository.getSwaps()
    const after = applyLunchSwaps(shoppingList, nextSwaps, recipesById)

    for (const { tripId, itemName } of diffRemovedItems(before, after)) {
      shoppingListRepository.setChecked(tripId, itemName, false)
    }

    setSwaps(nextSwaps)
  }

  return (
    <div className={backdropStyles.backdrop}>
      <div className={styles.page}>
        <div className={fluentStyles.blocks}>
          {BLOCK_NUMBERS.map((block) => {
            const defaultId = BLOCK_RECIPE_IDS[block].lunchId
            const defaultRecipe = recipesById.get(defaultId)!
            const activeRecipe = recipesById.get(getActiveLunchId(block, swaps))!
            const selectId = `lunch-swap-block-${block}`

            return (
              <section key={block} className={fluentStyles.block}>
                <h2 className={fluentStyles.blockHeading}>{block}. blokk</h2>
                <p className={fluentStyles.activeLunch}>Aktuális ebéd: {activeRecipe.title}</p>
                <div className={fluentStyles.field}>
                  <label className={fluentStyles.label} htmlFor={selectId}>
                    {block}. blokk ebédje
                  </label>
                  <select
                    id={selectId}
                    className={fluentStyles.select}
                    value={swaps[block] ?? ''}
                    onChange={(event) => handleChange(block, event.target.value)}
                  >
                    <option value="">Eredeti recept ({defaultRecipe.title})</option>
                    {alternatives.map((alternative) => (
                      <option key={alternative.id} value={alternative.id}>
                        {alternative.title}
                      </option>
                    ))}
                  </select>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LunchSwapPage
