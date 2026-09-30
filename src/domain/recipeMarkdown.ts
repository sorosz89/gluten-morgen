import type { Ingredient, Macros, MealType, Recipe, StepGroup, Unit } from './recipe.ts'

export type Section = { heading: string; body: string }

// Headings that are never step sections. Everything else counts as a step
// group by elimination — this covers "Elkészítés", its variant-heading forms
// (e.g. "Elkészítés – hidegen"), and non-standard headings like "Pácolás"
// with no per-file special-casing.
const NON_STEP_HEADING_PREFIXES = [
  'Hozzávalók',
  'Előkészület',
  'Idő és eszközök',
  'Tipp',
  'Makró',
  'Gluténmentességi megjegyzés',
]

export class RecipeImportError extends Error {
  constructor(fileName: string, reason: string) {
    super(`${fileName}: ${reason}`)
    this.name = 'RecipeImportError'
  }
}

const UNIT_ALIASES: Record<string, Unit> = {
  g: 'g',
  kg: 'kg',
  db: 'db',
  gerezd: 'gerezd',
  evőkanál: 'evőkanál',
  tk: 'tk',
  teáskanál: 'tk',
}

const WATCHLIST = [
  'gluténmentes',
  'zab',
  'kenyér',
  'zsemle',
  'liszt',
  'sonka',
  'felvágott',
  'fehérjekoncentrátum',
  'protein por',
  'étcsoki',
  'mustár',
]

const QUANTITY_RE =
  /^(\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+(?:[.,]\d+)?)?)\s+(\S+)\s*(.*)$/

function parseAmount(quantityText: string): number {
  const firstNumber = /^\d+(?:[.,]\d+)?/.exec(quantityText)?.[0] ?? quantityText
  return Number(firstNumber.replace(',', '.'))
}

function isGlutenFree(name: string, note: string | undefined): boolean {
  const haystack = `${name} ${note ?? ''}`.toLowerCase()
  return WATCHLIST.some((term) => haystack.includes(term.toLowerCase()))
}

export function parseIngredientLine(rawLine: string, fileName: string): Ingredient {
  const hasBold = /\*\*/.test(rawLine)
  const clean = rawLine.replaceAll('**', '')

  const match = QUANTITY_RE.exec(clean)
  if (!match) {
    const name = clean.trim()
    return { amount: null, unit: null, name, mustBeGlutenFree: hasBold || isGlutenFree(name, undefined) }
  }

  const quantityText = match[1]!
  const unitToken = match[2]!
  const rest = match[3]!
  const unit = UNIT_ALIASES[unitToken]
  if (!unit) {
    throw new RecipeImportError(
      fileName,
      `unrecognized unit "${unitToken}" in ingredient line: "${rawLine}"`,
    )
  }

  const isRange = /[–-]/.test(quantityText)
  const amount = parseAmount(quantityText)

  const commaIndex = rest.indexOf(',')
  const name = (commaIndex === -1 ? rest : rest.slice(0, commaIndex)).trim()
  const note = commaIndex === -1 ? undefined : rest.slice(commaIndex + 1).trim()

  return {
    amount,
    ...(isRange ? { amountText: quantityText } : {}),
    unit,
    name,
    ...(note ? { note } : {}),
    mustBeGlutenFree: hasBold || isGlutenFree(name, note),
  }
}

export function splitSections(markdown: string): Section[] {
  const sections: Section[] = []
  let heading: string | null = null
  let bodyLines: string[] = []

  const flush = () => {
    if (heading !== null) {
      sections.push({ heading, body: bodyLines.join('\n').trim() })
    }
  }

  for (const line of markdown.split('\n')) {
    const headingMatch = /^##\s+(.+)$/.exec(line)
    if (headingMatch) {
      flush()
      heading = headingMatch[1]!.trim()
      bodyLines = []
    } else if (heading !== null) {
      bodyLines.push(line)
    }
  }
  flush()

  return sections
}

function parseSteps(body: string): string[] {
  const numberedLines = body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^\d+\.\s+/, '').trim())

  return numberedLines.length > 0 ? numberedLines : [body.trim()]
}

export function parseStepGroups(sections: Section[], fileName: string): StepGroup[] {
  const stepSections = sections.filter(
    (section) => !NON_STEP_HEADING_PREFIXES.some((prefix) => section.heading.startsWith(prefix)),
  )

  if (stepSections.length === 0) {
    throw new RecipeImportError(fileName, 'missing required step section (e.g. "Elkészítés")')
  }

  return stepSections.map((section) => ({
    heading: section.heading,
    steps: parseSteps(section.body),
  }))
}

export function classifyMealType(fileName: string): MealType {
  if (fileName.includes('reggeli')) return 'breakfast'
  if (fileName.includes('ebed')) return 'lunch'
  if (fileName.includes('vacsora')) return 'dinner'
  if (fileName.includes('alternativ')) return 'alternative'
  return 'extra'
}

const MACROS_RE =
  /^(\d+(?:[.,]\d+)?)\s*kcal\s*\|\s*(\d+(?:[.,]\d+)?)\s*g\s*fehérje\s*\|\s*(\d+(?:[.,]\d+)?)\s*g\s*szénhidrát\s*\|\s*(\d+(?:[.,]\d+)?)\s*mg\s*só\s*\|\s*(\d+(?:[.,]\d+)?)\s*g\s*zsír\s*\|\s*(\d+(?:[.,]\d+)?)\s*g\s*rost\s*$/

export function parseMacrosLine(line: string, fileName: string): Macros {
  const match = MACROS_RE.exec(line.trim())
  if (!match) {
    throw new RecipeImportError(fileName, `could not parse macros line: "${line}"`)
  }

  const toNumber = (text: string) => Number(text.replace(',', '.'))

  return {
    kcal: toNumber(match[1]!),
    proteinG: toNumber(match[2]!),
    carbsG: toNumber(match[3]!),
    saltMg: toNumber(match[4]!),
    fatG: toNumber(match[5]!),
    fiberG: toNumber(match[6]!),
  }
}

function parseTitle(raw: string): string {
  const firstLine = raw.split('\n')[0] ?? ''
  const withoutHash = firstLine.replace(/^#\s*/, '').trim()
  const parenIndex = withoutHash.indexOf(' (')
  return parenIndex === -1 ? withoutHash : withoutHash.slice(0, parenIndex).trim()
}

function extractParenthetical(heading: string): string {
  const match = /\(([^)]*)\)/.exec(heading)
  return match?.[1]?.trim() ?? ''
}

const SOURCE_LINE_RE = /^\*Forrás:\s*(.+?)\*$/

function parseTip(body: string): { tip?: string; source?: string } {
  const lines = body.split('\n')
  const sourceLineIndex = lines.findIndex((line) => SOURCE_LINE_RE.test(line.trim()))

  const source =
    sourceLineIndex === -1
      ? undefined
      : SOURCE_LINE_RE.exec(lines[sourceLineIndex]!.trim())?.[1]?.trim()

  const tip = lines
    .filter((_, index) => index !== sourceLineIndex)
    .join('\n')
    .trim()

  return {
    ...(tip ? { tip } : {}),
    ...(source ? { source } : {}),
  }
}

export function parseRecipeMarkdown(fileName: string, raw: string): Recipe {
  const id = fileName.replace(/\.md$/, '')
  const title = parseTitle(raw)
  const mealType = classifyMealType(fileName)
  const sections = splitSections(raw)

  const hozzavalokSection = sections.find((section) => section.heading.startsWith('Hozzávalók'))
  if (!hozzavalokSection) {
    throw new RecipeImportError(fileName, 'missing required section "Hozzávalók"')
  }
  const servingsLabel = extractParenthetical(hozzavalokSection.heading)
  const ingredients = hozzavalokSection.body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => parseIngredientLine(line.slice(2).trim(), fileName))

  const stepGroups = parseStepGroups(sections, fileName)

  const makroSection = sections.find((section) => section.heading.startsWith('Makró'))
  const macros = makroSection ? parseMacrosLine(makroSection.body, fileName) : undefined

  const tippSection = sections.find((section) => section.heading.startsWith('Tipp'))
  const { tip, source } = tippSection ? parseTip(tippSection.body) : {}

  const glutenNoteSection = sections.find((section) =>
    section.heading.startsWith('Gluténmentességi megjegyzés'),
  )
  const glutenFreeNote = glutenNoteSection?.body.trim() || undefined

  return {
    id,
    title,
    mealType,
    servingsLabel,
    ingredients,
    stepGroups,
    ...(tip ? { tip } : {}),
    ...(source ? { source } : {}),
    ...(macros ? { macros } : {}),
    ...(glutenFreeNote ? { glutenFreeNote } : {}),
  }
}
