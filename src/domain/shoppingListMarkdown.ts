import { isGlutenFree } from './recipeMarkdown.ts'
import type { ShoppingItem, ShoppingTrip, ShoppingUnit, TripId } from './shoppingList.ts'

interface RawSection {
  heading: string
  body: string
}

function splitSections(markdown: string, headingRe: RegExp): RawSection[] {
  const sections: RawSection[] = []
  let heading: string | null = null
  let bodyLines: string[] = []

  const flush = () => {
    if (heading !== null) {
      sections.push({ heading, body: bodyLines.join('\n').trim() })
    }
  }

  for (const line of markdown.split('\n')) {
    const match = headingRe.exec(line)
    if (match) {
      flush()
      heading = match[1]!.trim()
      bodyLines = []
    } else if (heading !== null) {
      bodyLines.push(line)
    }
  }
  flush()

  return sections
}

const TRIP_HEADING_RE = /^##\s+(.+)$/
const CATEGORY_HEADING_RE = /^###\s+(.+)$/

const TRIP_LABELS: Record<TripId, string> = {
  pantry: '1. Kamra & fagyasztó',
  freshWeek1: '2. heti bevásárlás (friss)',
  freshWeek2: '3. heti bevásárlás (friss)',
}

function classifyTrip(heading: string): TripId | null {
  if (heading.startsWith('1.')) return 'pantry'
  if (heading.startsWith('2.')) return 'freshWeek1'
  if (heading.startsWith('3.')) return 'freshWeek2'
  return null
}

const UNIT_ALIASES: Record<string, ShoppingUnit> = { g: 'g', db: 'db' }

// "+ 1000 g pörköltnek való hús a fagyasztóból kiolvasztva (lásd fent)" —
// the leading "+" is literal line text ("plus, from the freezer"), not a
// different bullet marker, and this shape puts amount+unit before the name.
const FREEZER_REMINDER_RE = /^\+\s*(\d+(?:[.,]\d+)?)\s+(\S+)\s+(.*)$/

// "tojás (M-es): kb. 17 db (...)" — the document's usual "name: amount unit
// [note]" shape.
const NAMED_ITEM_RE = /^(.+?):\s*(kb\.\s*)?(\d+(?:[.,]\d+)?)\s*(\S+)\s*(.*)$/

function resolveUnit(token: string, rawLine: string): ShoppingUnit {
  const unit = UNIT_ALIASES[token]
  if (!unit) {
    throw new Error(`unrecognized unit "${token}" in shopping item line: "${rawLine}"`)
  }
  return unit
}

function parseItemLine(rawLine: string): ShoppingItem {
  const freezerMatch = FREEZER_REMINDER_RE.exec(rawLine)
  if (freezerMatch) {
    const [, amountText, unitToken, name] = freezerMatch
    return {
      name: name!.trim(),
      amount: Number(amountText!.replace(',', '.')),
      unit: resolveUnit(unitToken!, rawLine),
      mustBeGlutenFree: isGlutenFree(name!.trim(), undefined),
    }
  }

  const namedMatch = NAMED_ITEM_RE.exec(rawLine)
  if (!namedMatch) {
    throw new Error(`could not parse shopping item line: "${rawLine}"`)
  }

  const [, namePart, qualifier, amountText, unitToken, rest] = namedMatch
  const name = namePart!.trim()
  const note = rest!.trim()

  return {
    name,
    amount: Number(amountText!.replace(',', '.')),
    ...(qualifier ? { amountQualifier: qualifier.trim() } : {}),
    unit: resolveUnit(unitToken!, rawLine),
    ...(note ? { note } : {}),
    mustBeGlutenFree: isGlutenFree(name, note || undefined),
  }
}

export function parseShoppingListMarkdown(raw: string): ShoppingTrip[] {
  const tripSections = splitSections(raw, TRIP_HEADING_RE)
  const trips: ShoppingTrip[] = []

  for (const section of tripSections) {
    const id = classifyTrip(section.heading)
    if (!id) continue // the trailing "check once" section is not a trip

    const categorySections = splitSections(section.body, CATEGORY_HEADING_RE)
    const categories = categorySections.map((categorySection) => ({
      heading: categorySection.heading,
      items: categorySection.body
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('- '))
        .map((line) => parseItemLine(line.slice(2).trim())),
    }))

    trips.push({ id, label: TRIP_LABELS[id], categories })
  }

  return trips
}
