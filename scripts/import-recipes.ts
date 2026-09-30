import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { z } from 'zod'
import type { Recipe } from '../src/domain/recipe.ts'
import { recipeSchema } from '../src/domain/recipe.ts'
import { RecipeImportError, parseRecipeMarkdown } from '../src/domain/recipeMarkdown.ts'

const NON_RECIPE_FILES = new Set(['gf-etrend-attekintes.md', 'gf-bevasarlolista-2het.md'])

export function buildRecipes(sourceDir: string): Recipe[] {
  const fileNames = readdirSync(sourceDir)
    .filter((name) => name.endsWith('.md') && !NON_RECIPE_FILES.has(name))
    .sort()

  return fileNames.map((fileName) => {
    const raw = readFileSync(path.join(sourceDir, fileName), 'utf-8')
    const candidate = parseRecipeMarkdown(fileName, raw)

    try {
      return recipeSchema.parse(candidate)
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new RecipeImportError(fileName, err.message)
      }
      throw err
    }
  })
}

function main() {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const sourceDir = path.join(dirname, '..', 'data', 'source')
  const outFile = path.join(dirname, '..', 'src', 'data', 'recipes.json')

  try {
    const recipes = buildRecipes(sourceDir)
    writeFileSync(outFile, `${JSON.stringify(recipes, null, 2)}\n`)
    console.log(`Imported ${recipes.length} recipes into ${path.relative(process.cwd(), outFile)}`)
  } catch (err) {
    console.error(err instanceof RecipeImportError ? err.message : err)
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
