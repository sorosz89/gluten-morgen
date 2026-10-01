import { useState } from 'react'
import { lunchSwapRepository } from '../../data/lunchSwapRepository.ts'
import { recipes } from '../../data/recipes.ts'
import type { ActiveSwaps } from '../../domain/lunchSwap.ts'
import { ALTERNATIVE_RECIPE_IDS, getActiveLunchId } from '../../domain/lunchSwap.ts'
import { BLOCK_RECIPE_IDS } from '../../domain/rotation.ts'
import type { BlockNumber } from '../../domain/rotation.ts'
import styles from './LunchSwapPage.module.css'

const BLOCK_NUMBERS: BlockNumber[] = [1, 2, 3, 4]

const recipesById = new Map(recipes.map((recipe) => [recipe.id, recipe]))
const alternatives = ALTERNATIVE_RECIPE_IDS.map((id) => recipesById.get(id)!)

function LunchSwapPage() {
  const [swaps, setSwaps] = useState<ActiveSwaps>(() => lunchSwapRepository.getSwaps())

  function handleChange(block: BlockNumber, value: string) {
    const recipeId = value === '' ? null : value
    lunchSwapRepository.setSwap(block, recipeId)
    setSwaps(lunchSwapRepository.getSwaps())
  }

  return (
    <div className={styles.page}>
      {BLOCK_NUMBERS.map((block) => {
        const defaultId = BLOCK_RECIPE_IDS[block].lunchId
        const defaultRecipe = recipesById.get(defaultId)!
        const activeRecipe = recipesById.get(getActiveLunchId(block, swaps))!
        const selectId = `lunch-swap-block-${block}`

        return (
          <section key={block} className={styles.block}>
            <h2 className={styles.blockHeading}>{block}. blokk</h2>
            <p className={styles.activeLunch}>Aktuális ebéd: {activeRecipe.title}</p>
            <label htmlFor={selectId}>{block}. blokk ebédje</label>
            <select
              id={selectId}
              className={styles.select}
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
          </section>
        )
      })}
    </div>
  )
}

export default LunchSwapPage
