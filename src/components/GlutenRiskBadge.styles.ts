import { makeStyles } from '@fluentui/react-components'
import { glutenBg, glutenFg } from '../styles/colors.ts'

export const useGlutenRiskBadgeStyles = makeStyles({
  badge: {
    backgroundColor: glutenBg,
    color: glutenFg,
  },
})
