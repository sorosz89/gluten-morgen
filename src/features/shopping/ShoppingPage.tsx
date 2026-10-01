import { shoppingList } from '../../data/shoppingList.ts'
import { shoppingListRepository } from '../../data/shoppingListRepository.ts'
import type { ShoppingItem } from '../../domain/shoppingList.ts'
import styles from './ShoppingPage.module.css'

function formatQuantity(item: ShoppingItem, familySize: number): string {
  const amount = item.amount * familySize
  const qualifier = item.amountQualifier ? `${item.amountQualifier} ` : ''
  return `${qualifier}${amount} ${item.unit}`
}

function ShoppingPage() {
  const familySize = shoppingListRepository.getFamilySize()

  return (
    <div className={styles.page}>
      {shoppingList.map((trip) => (
        <section key={trip.id} className={styles.trip}>
          <h2>{trip.label}</h2>
          {trip.categories.map((category) => (
            <div key={category.heading} className={styles.category}>
              <h3>{category.heading}</h3>
              <ul className={styles.itemList}>
                {category.items.map((item) => (
                  <li key={item.name} className={styles.item}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQuantity}>{formatQuantity(item, familySize)}</span>
                    {item.mustBeGlutenFree && (
                      <span className={styles.badge}>Gluténmentes termék szükséges</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

export default ShoppingPage
