import { makeStyles } from '@fluentui/react-components'

// No hand-pinned color here on purpose: `color="informative"` is Fluent's
// own neutral-gray badge tone (its `outline` default is brand green, which
// would collide with the brand/primary-action green reserved for in-card
// actions and links). Only `GlutenRiskBadge`'s solid orange is a hand-pinned,
// reserved color (see src/styles/colors.ts).
export const useGlutenCheckTagStyles = makeStyles({
  tag: {
    verticalAlign: 'middle',
  },
})
