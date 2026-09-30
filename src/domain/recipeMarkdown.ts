import type { Ingredient, StepGroup, Unit } from './recipe.ts'

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
