import { Badge, mergeClasses } from '@fluentui/react-components'
import { useGlutenRiskBadgeStyles } from './GlutenRiskBadge.styles.ts'

interface GlutenRiskBadgeProps {
  className?: string
}

// The gluten-risk signal, shared by Catalog and Recipe detail so it reads
// identically wherever it appears (spec 012, AC3). Label text is fixed and
// must stay byte-identical — both pages' tests query it by exact text.
function GlutenRiskBadge({ className }: GlutenRiskBadgeProps) {
  const fluentStyles = useGlutenRiskBadgeStyles()

  return (
    <Badge appearance="tint" shape="rounded" className={mergeClasses(fluentStyles.badge, className)}>
      Gluténmentes termék szükséges
    </Badge>
  )
}

export default GlutenRiskBadge
