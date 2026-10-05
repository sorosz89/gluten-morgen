import { createLightTheme } from '@fluentui/react-components'
import type { BrandVariants, Theme } from '@fluentui/react-components'

// "Rozmaring" (rosemary) — the app's brand ramp, replacing Fluent's stock blue.
// Hand-generated (HSL hue 150, Fluent's own 16-step shade convention), anchored
// so shade80 (the primary interactive color) lands close to #2E7D4F.
const rozmaring: BrandVariants = {
  10: '#0b1e14',
  20: '#123021',
  30: '#183f2b',
  40: '#1d4e36',
  50: '#22593d',
  60: '#266445',
  70: '#2a6f4d',
  80: '#2d7652',
  90: '#35825c',
  100: '#3f9269',
  110: '#4fb080',
  120: '#78bf9c',
  130: '#9fd0b8',
  140: '#c2e0d1',
  150: '#deede6',
  160: '#eff6f2',
}

export const zeroGlutenTheme: Theme = createLightTheme(rozmaring)
