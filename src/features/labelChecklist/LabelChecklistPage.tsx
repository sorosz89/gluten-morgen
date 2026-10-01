import { useState } from 'react'
import { labelChecklistRepository } from '../../data/labelChecklistRepository.ts'
import { LABEL_CHECKLIST_PRODUCTS } from '../../domain/labelChecklist.ts'
import styles from './LabelChecklistPage.module.css'

function initialCheckedState(): Record<string, boolean> {
  const state: Record<string, boolean> = {}
  for (const product of LABEL_CHECKLIST_PRODUCTS) {
    state[product] = labelChecklistRepository.isChecked(product)
  }
  return state
}

function LabelChecklistPage() {
  const [checkedState, setCheckedState] = useState(initialCheckedState)

  function toggleChecked(product: string) {
    const nextChecked = !checkedState[product]
    labelChecklistRepository.setChecked(product, nextChecked)
    setCheckedState((previous) => ({ ...previous, [product]: nextChecked }))
  }

  return (
    <div className={styles.page}>
      <ul className={styles.itemList}>
        {LABEL_CHECKLIST_PRODUCTS.map((product) => (
          <li key={product} className={styles.item}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={checkedState[product] ?? false}
              onChange={() => toggleChecked(product)}
              aria-label={product}
            />
            <span className={styles.itemName}>{product}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LabelChecklistPage
