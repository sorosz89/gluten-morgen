import { Badge, mergeClasses } from '@fluentui/react-components'
import { Warning16Regular } from '@fluentui/react-icons'
import { useGlutenCheckTagStyles } from './GlutenCheckTag.styles.ts'

interface GlutenCheckTagProps {
  className?: string
}

// A lighter-weight sibling to `GlutenRiskBadge`: shown when a recipe carries
// gluten-safety guidance (a `glutenFreeNote`) without any ingredient flagged
// `mustBeGlutenFree`, so that guidance isn't invisible at the list level.
// Deliberately neutral/outline, never the reserved orange risk color — the
// two signals read as different strengths of the same family, not the same
// meaning twice.
function GlutenCheckTag({ className }: GlutenCheckTagProps) {
  const fluentStyles = useGlutenCheckTagStyles()

  return (
    <Badge
      appearance="outline"
      color="informative"
      shape="rounded"
      icon={<Warning16Regular />}
      className={mergeClasses(fluentStyles.tag, className)}
    >
      Ellenőrizd a címkét
    </Badge>
  )
}

export default GlutenCheckTag
