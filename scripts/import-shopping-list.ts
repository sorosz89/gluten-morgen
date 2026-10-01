import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { z } from 'zod'
import type { ShoppingTrip } from '../src/domain/shoppingList.ts'
import { shoppingListSchema } from '../src/domain/shoppingList.ts'
import { parseShoppingListMarkdown } from '../src/domain/shoppingListMarkdown.ts'

const SOURCE_FILE = 'gf-bevasarlolista-2het.md'

export function buildShoppingList(sourceDir: string): ShoppingTrip[] {
  const raw = readFileSync(path.join(sourceDir, SOURCE_FILE), 'utf-8')
  const trips = parseShoppingListMarkdown(raw)

  try {
    return shoppingListSchema.parse(trips)
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(`${SOURCE_FILE}: ${err.message}`, { cause: err })
    }
    throw err
  }
}

function main() {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const sourceDir = path.join(dirname, '..', 'data', 'source')
  const outFile = path.join(dirname, '..', 'src', 'data', 'shoppingList.json')

  try {
    const trips = buildShoppingList(sourceDir)
    writeFileSync(outFile, `${JSON.stringify(trips, null, 2)}\n`)
    console.log(`Imported ${trips.length} shopping trips into ${path.relative(process.cwd(), outFile)}`)
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
