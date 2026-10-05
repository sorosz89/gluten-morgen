// Shared, hand-pinned colors that sit outside the Fluent theme's own token set.
// Each is reserved for exactly one job — see DESIGN.md's palette-role documentation.

// The gluten-risk-ingredient signal. Candidate B, confirmed with the user:
// deliberately outside the breakfast-gold family so it can never be confused
// with a meal-type card accent. Never read from Fluent's own color="warning"/
// "severe" token — pinned here explicitly, per constitution Principle 7.
export const glutenBg = '#fbe0cc'
export const glutenFg = '#8a3b00'

// Data-series hues, one per meal type (breakfast/lunch/dinner), reused for
// Shopping's trip grouping. Applied as a tinted card header strip or small
// icon badge — never a colored border, never a full saturated fill.
export const mealColors = {
  breakfast: { bg: '#fbefd9', fg: '#8a6416', strip: '#d9a33e' },
  lunch: { bg: '#e1f1ef', fg: '#1f5a54', strip: '#2f8c82' },
  dinner: { bg: '#f1e7f1', fg: '#5c3a5e', strip: '#8b5a8c' },
} as const
