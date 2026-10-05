import { makeStyles } from '@fluentui/react-components'
import { pageBackdrop } from './shellColors.ts'

// Shared across every page: the dark/purple gradient backdrop. One hook, one
// place, same "one hex, one place" discipline as colors.ts — every page's
// outermost wrapper applies this class instead of redeclaring the gradient.
export const usePageBackdropStyles = makeStyles({
  backdrop: {
    ...pageBackdrop,
    minHeight: '100dvh',
  },
})
