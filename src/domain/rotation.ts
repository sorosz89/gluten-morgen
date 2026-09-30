export type BlockNumber = 1 | 2 | 3 | 4

export interface RotationDay {
  block: BlockNumber
  cookToday: boolean
}

interface BlockRecipeIds {
  breakfastId: string
  lunchId: string
  dinnerId: string
}

export const BLOCK_RECIPE_IDS: Record<BlockNumber, BlockRecipeIds> = {
  1: {
    breakfastId: 'gf-reggeli-joghurtos-magmix',
    lunchId: 'gf-ebed-gulyasleves',
    dinnerId: 'gf-vacsora-sonkas-tukortojas',
  },
  2: {
    breakfastId: 'gf-reggeli-gorogjoghurtos-banan-muffin',
    lunchId: 'gf-ebed-husos-zoldseges-passata',
    dinnerId: 'gf-vacsora-melegszendvics',
  },
  3: {
    breakfastId: 'gf-reggeli-turos-epres-suti',
    lunchId: 'gf-ebed-savanyu-lencseleves',
    dinnerId: 'gf-vacsora-sajtos-szendvics',
  },
  4: {
    breakfastId: 'gf-reggeli-proteines-zabkasa',
    lunchId: 'gf-ebed-paradicsomos-husgomboc',
    dinnerId: 'gf-vacsora-tojasos-avokado-salata',
  },
}

// Day offset (0-13) from the anchor Sunday -> which block that day belongs to.
// Blocks are pinned to real weekdays: 1 = Sun-Tue, 2 = Wed-Sat, 3 = Sun-Tue
// (week 2), 4 = Wed-Sat (week 2). See spec 003's "Data & rules" table.
const OFFSET_TO_BLOCK: BlockNumber[] = [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4]

// Offsets that are a block's first day - the bulk-cooking day.
const COOK_OFFSETS = new Set([0, 3, 7, 10])

const DAY_MS = 24 * 60 * 60 * 1000

function toUtcDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS)
}

export function getRotationDay(anchor: Date, today: Date): RotationDay {
  const diffDays = toUtcDayNumber(today) - toUtcDayNumber(anchor)
  const offset = ((diffDays % 14) + 14) % 14
  const block = OFFSET_TO_BLOCK[offset]!
  return { block, cookToday: COOK_OFFSETS.has(offset) }
}

export function getBlockRecipeIds(block: BlockNumber): BlockRecipeIds {
  return BLOCK_RECIPE_IDS[block]
}

export function isSunday(date: Date): boolean {
  return date.getDay() === 0
}

export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year!, month! - 1, day!)
}

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
