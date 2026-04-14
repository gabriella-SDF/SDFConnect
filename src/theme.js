// SDF Connect: Accelerate — Design Tokens
// Based on Stellar Development Foundation Brand Guidelines 2026

export const C = {
  // Primary
  yellow: '#FDDA24',
  black: '#0F0F0F',
  light: '#F6F7F8',

  // Secondary
  tan: '#D6D2C4',
  lavender: '#B7ACE8',
  teal: '#00A7B5',
  navy: '#002E5D',

  // Functional
  bg: '#F6F7F8',
  card: '#FFFFFF',
  border: '#E2E2E2',
  text: '#0F0F0F',
  textFade: '#6B6E6B',
  textMuted: '#9B9B9B',
  success: '#2ECC71',
  error: '#E74C3C',

  // Dark surfaces
  dark: '#0F0F0F',
  darkCard: '#1A1A1A',
  darkBorder: '#2A2A2A',
  darkText: '#F6F7F8',
}

export const F = {
  serif: "'Lora', Georgia, serif",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
}

// Reusable style fragments
export const S = {
  // Cards
  card: {
    background: C.card,
    borderRadius: 16,
    padding: 20,
    border: `1px solid ${C.border}`,
  },
  darkCard: {
    background: C.darkCard,
    borderRadius: 16,
    padding: 20,
    border: `1px solid ${C.darkBorder}`,
  },

  // Typography
  h1: {
    fontFamily: F.serif,
    fontSize: 32,
    fontWeight: 600,
    lineHeight: 1.2,
    color: C.text,
  },
  h2: {
    fontFamily: F.serif,
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 1.3,
    color: C.text,
  },
  h3: {
    fontFamily: F.serif,
    fontSize: 18,
    fontWeight: 500,
    lineHeight: 1.4,
    color: C.text,
  },
  body: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
    color: C.text,
  },
  caption: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.4,
    color: C.textFade,
    letterSpacing: '0.02em',
  },
  label: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: C.textFade,
  },

  // Buttons
  btnPrimary: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 600,
    background: C.yellow,
    color: C.black,
    border: 'none',
    borderRadius: 12,
    padding: '14px 28px',
    cursor: 'pointer',
    letterSpacing: '0.01em',
    transition: 'opacity 0.15s',
  },
  btnSecondary: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 500,
    background: 'transparent',
    color: C.text,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: '12px 24px',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },

  // Layout
  container: {
    maxWidth: 480,
    margin: '0 auto',
    width: '100%',
    minHeight: '100vh',
  },
  page: {
    background: C.bg,
    minHeight: '100vh',
    paddingBottom: 100,
  },

  // Bottom sheet
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,15,15,0.5)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 999,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  sheet: {
    background: C.card,
    borderRadius: '20px 20px 0 0',
    padding: '12px 24px 32px',
    paddingBottom: 'calc(32px + env(safe-area-inset-bottom))',
    maxWidth: 480,
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    background: C.border,
    margin: '0 auto 16px',
  },
}

// Tag colors for schedule items
export const tagColors = {
  keynote: { bg: '#FDDA24', text: '#0F0F0F' },
  breakout: { bg: '#00A7B5', text: '#FFFFFF' },
  social: { bg: '#B7ACE8', text: '#0F0F0F' },
  meal: { bg: '#D6D2C4', text: '#0F0F0F' },
  break: { bg: '#E2E2E2', text: '#6B6E6B' },
  activity: { bg: '#002E5D', text: '#FFFFFF' },
  workshop: { bg: '#0F0F0F', text: '#FDDA24' },
  team: { bg: '#00A7B5', text: '#FFFFFF' },
}
