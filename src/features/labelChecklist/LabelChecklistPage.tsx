import { Checkbox, Text } from '@fluentui/react-components'
import { useState } from 'react'
import { labelChecklistRepository } from '../../data/labelChecklistRepository.ts'
import { LABEL_CHECKLIST_PRODUCTS } from '../../domain/labelChecklist.ts'
import { usePageBackdropStyles } from '../../styles/shell.ts'
import { useLabelChecklistStyles } from './LabelChecklistPage.styles.ts'
import styles from '../../styles/page.module.css'

function initialCheckedState(): Record<string, boolean> {
  const state: Record<string, boolean> = {}
  for (const product of LABEL_CHECKLIST_PRODUCTS) {
    state[product] = labelChecklistRepository.isChecked(product)
  }
  return state
}

function LabelChecklistPage() {
  const fluentStyles = useLabelChecklistStyles()
  const backdropStyles = usePageBackdropStyles()
  const [checkedState, setCheckedState] = useState(initialCheckedState)

  function toggleChecked(product: string) {
    const nextChecked = !checkedState[product]
    labelChecklistRepository.setChecked(product, nextChecked)
    setCheckedState((previous) => ({ ...previous, [product]: nextChecked }))
  }

  const remaining = LABEL_CHECKLIST_PRODUCTS.filter((product) => !checkedState[product]).length

  return (
    <div className={backdropStyles.backdrop}>
      <div className={styles.page}>
        <Text as="p" className={fluentStyles.summary}>
          {remaining === 0 ? 'Minden termék ellenőrizve' : `${remaining} maradt`}
        </Text>
        <div className={fluentStyles.shell}>
          {LABEL_CHECKLIST_PRODUCTS.map((product) => (
            <label key={product} className={fluentStyles.item}>
              <Checkbox
                checked={checkedState[product] ?? false}
                onChange={() => toggleChecked(product)}
                aria-label={product}
              />
              <span className={fluentStyles.itemName}>{product}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LabelChecklistPage
