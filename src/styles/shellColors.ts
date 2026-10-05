// Dark/purple dashboard shell — chrome and page-backdrop colors only.
// Deliberately hand-pinned hex, outside the Fluent theme (which stays light;
// see DESIGN.md's Theme Architecture section): this palette paints the nav
// and page background, never anything inside a white content card.
export const shellColors = {
  utilityBarBg: '#120f1c',
  headerBarBg: '#241a3f',
  navLinkDefault: '#b9aed6',
  navLinkTint: '#c7b6f5',
  navLinkActive: '#ffffff',
  blobViolet: '#5b21b6',
  blobMagenta: '#9333ea',
  blobIndigo: '#312e81',
  backdropBase: '#1b1430',
  // Off-card text colors — for the handful of labels/links that sit directly
  // on the dark backdrop rather than inside a white card.
  offCardText: '#e3dcf2',
  offCardTextMuted: '#cdbfe8',
  // A readable light green for "affirmative" accents (e.g. Today's "igen")
  // when off-card — distinct from the on-card brand token, which is tuned
  // for white surfaces and would under-contrast on the dark backdrop.
  offCardAccentGreen: '#9fd9b9',
} as const

export const pageBackdrop = {
  backgroundColor: shellColors.backdropBase,
  backgroundImage: [
    `radial-gradient(ellipse 900px 700px at 8% 95%, ${shellColors.blobViolet} 0%, ${shellColors.blobIndigo} 45%, transparent 72%)`,
    `radial-gradient(ellipse 800px 650px at 95% 2%, ${shellColors.blobMagenta} 0%, ${shellColors.headerBarBg} 50%, transparent 75%)`,
  ].join(', '),
  backgroundRepeat: 'no-repeat',
} as const
