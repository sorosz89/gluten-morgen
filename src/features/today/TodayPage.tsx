import { anchorRepository } from '../../data/anchorRepository.ts'
import styles from './TodayPage.module.css'

function TodayPage() {
  const anchor = anchorRepository.getAnchor()

  if (!anchor) {
    return (
      <div className={styles.page}>
        <p>Add meg, melyik vasárnap kezdődik az 1. hét, hogy a Ma képernyő tudja, hol állunk a forgásban.</p>
      </div>
    )
  }

  return <div className={styles.page} />
}

export default TodayPage
