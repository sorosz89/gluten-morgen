import { getBlockRecipeIds, type BlockNumber } from './rotation.ts'

export type ActiveSwaps = Partial<Record<BlockNumber, string>>

export const ALTERNATIVE_RECIPE_IDS = [
  'gf-alternativ-csirkes-rizses-egytal',
  'gf-alternativ-sertesszelet',
  'gf-alternativ-sult-csirke-rizs',
  'gf-alternativ-sult-lazac',
  'gf-alternativ-tonhalas-tesztasalata',
] as const

export function getActiveLunchId(block: BlockNumber, swaps: ActiveSwaps): string {
  return swaps[block] ?? getBlockRecipeIds(block).lunchId
}
