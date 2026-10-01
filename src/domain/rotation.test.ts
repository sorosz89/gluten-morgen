import { describe, expect, it } from 'vitest'
import { recipes } from '../data/recipes.ts'
import {
  BLOCK_RECIPE_IDS,
  formatIsoDate,
  getRotationDay,
  getSchedule,
  parseIsoDate,
} from './rotation.ts'

describe('getRotationDay', () => {
  it('AC2: block 1, cook today, on the anchor Sunday itself (2026-10-04)', () => {
    const anchor = parseIsoDate('2026-10-04')
    expect(getRotationDay(anchor, parseIsoDate('2026-10-04'))).toEqual({
      block: 1,
      cookToday: true,
    })
  })

  it('AC3: block 1, no cook, on the last day of block 1 (2026-10-06, Tuesday)', () => {
    const anchor = parseIsoDate('2026-10-04')
    expect(getRotationDay(anchor, parseIsoDate('2026-10-06'))).toEqual({
      block: 1,
      cookToday: false,
    })
  })

  it('AC4: block 2, cook today, on the following Wednesday (2026-10-07)', () => {
    const anchor = parseIsoDate('2026-10-04')
    expect(getRotationDay(anchor, parseIsoDate('2026-10-07'))).toEqual({
      block: 2,
      cookToday: true,
    })
  })

  it('AC5: wraps back to block 1, cook today, 14 days after the anchor (2026-10-18)', () => {
    const anchor = parseIsoDate('2026-10-04')
    expect(getRotationDay(anchor, parseIsoDate('2026-10-18'))).toEqual({
      block: 1,
      cookToday: true,
    })
  })
})

describe('getSchedule', () => {
  it('AC1: returns 7 days starting today with the right block/cook-day pattern', () => {
    const anchor = parseIsoDate('2026-10-04')
    const schedule = getSchedule(anchor, parseIsoDate('2026-10-04'))

    expect(
      schedule.map((day) => ({
        date: formatIsoDate(day.date),
        block: day.block,
        cookToday: day.cookToday,
      })),
    ).toEqual([
      { date: '2026-10-04', block: 1, cookToday: true },
      { date: '2026-10-05', block: 1, cookToday: false },
      { date: '2026-10-06', block: 1, cookToday: false },
      { date: '2026-10-07', block: 2, cookToday: true },
      { date: '2026-10-08', block: 2, cookToday: false },
      { date: '2026-10-09', block: 2, cookToday: false },
      { date: '2026-10-10', block: 2, cookToday: false },
    ])
  })

  it('AC3: flags 2026-10-06 as day 3 of 3, the last day of block 1 (3-day block)', () => {
    const anchor = parseIsoDate('2026-10-04')
    const schedule = getSchedule(anchor, parseIsoDate('2026-10-04'))
    const day = schedule.find((entry) => formatIsoDate(entry.date) === '2026-10-06')!

    expect(day).toMatchObject({
      block: 1,
      dayInBlock: 3,
      blockLength: 3,
      isLastDayOfBlock: true,
    })
  })

  it('AC4: flags 2026-10-10 as day 4 of 4, the last day of block 2 (4-day block)', () => {
    const anchor = parseIsoDate('2026-10-04')
    const schedule = getSchedule(anchor, parseIsoDate('2026-10-04'))
    const day = schedule.find((entry) => formatIsoDate(entry.date) === '2026-10-10')!

    expect(day).toMatchObject({
      block: 2,
      dayInBlock: 4,
      blockLength: 4,
      isLastDayOfBlock: true,
    })
  })

  it('wraps across the 14-day cycle boundary inside a single 7-day window', () => {
    const anchor = parseIsoDate('2026-10-04')
    const schedule = getSchedule(anchor, parseIsoDate('2026-10-16'))
    const day = schedule.find((entry) => formatIsoDate(entry.date) === '2026-10-18')!

    expect(day).toMatchObject({
      block: 1,
      cookToday: true,
      dayInBlock: 1,
      blockLength: 3,
      isLastDayOfBlock: false,
    })
  })
})

describe('BLOCK_RECIPE_IDS', () => {
  it('every mapped id exists in the real recipe data with the expected mealType', () => {
    const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]))

    for (const { breakfastId, lunchId, dinnerId } of Object.values(BLOCK_RECIPE_IDS)) {
      expect(byId.get(breakfastId)?.mealType).toBe('breakfast')
      expect(byId.get(lunchId)?.mealType).toBe('lunch')
      expect(byId.get(dinnerId)?.mealType).toBe('dinner')
    }
  })
})
