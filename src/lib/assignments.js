// Retreat assignment helpers — used by People profile, Home, and My Profile sheets.

export const teamRoomMap = {
  'Business Development': 'Crystal Room',
  'Engineering': 'Gold Room',
  'Finance and Operations': 'Intersect I / II',
  'Finance & Operations': 'Intersect I / II',
  'Growth': 'Fountain Room',
  'Legal and Policy': 'Garden Room',
  'Legal & Policy': 'Garden Room',
  'Marketing': 'Diplomat Club',
  'Office of the CEO': 'Empire Room',
  'People': 'Crown Room',
  'Product': 'Green Room',
}

// "Objective 1 - Topic 2: RWA & DeFi with Ada and Punia" → "RWA & DeFi with Ada and Punia"
export function formatObjective(o) {
  if (!o) return ''
  const m = o.match(/Objective\s+\d+\s*-\s*Topics?[^:]*:\s*(.+)/i)
  if (m) return m[1].trim()
  return o
}

// Maps each Objective + Topic to its breakout room (Tue 2-3 PM).
// `Topics?` so we match both "Topic 1" and "Topics 2" (source data has both spellings).
export function objectiveRoom(o) {
  if (!o) return null
  if (/Objective\s*1/i.test(o)) {
    if (/Topics?\s*1/i.test(o)) return 'Garden Room'
    if (/Topics?\s*2/i.test(o)) return 'Gold Room'
    if (/Topics?\s*3/i.test(o)) return 'Green Room'
  }
  if (/Objective\s*2/i.test(o)) return 'Crystal Room'
  if (/Objective\s*3/i.test(o)) {
    if (/Topics?\s*1/i.test(o)) return 'Intersect II'
    if (/Topics?\s*2/i.test(o)) return 'Intersect I'
  }
  return null
}
