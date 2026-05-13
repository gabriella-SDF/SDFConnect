// Compute compatibility score between two quiz profiles based on shared answers.

const MULTI_FIELDS = ['stellar_interests', 'most_yourself', 'thinking']
const SINGLE_FIELDS = ['vacation']

export function scoreMatch(a, b) {
  if (!a || !b) return 0
  let score = 0
  for (const f of MULTI_FIELDS) {
    const av = a[f] || []
    const bv = b[f] || []
    for (const v of av) if (bv.includes(v)) score++
  }
  for (const f of SINGLE_FIELDS) {
    if (a[f] && a[f] === b[f]) score++
  }
  return score
}

export function sharedTags(a, b) {
  if (!a || !b) return []
  const out = []
  for (const f of MULTI_FIELDS) {
    const av = a[f] || []
    const bv = b[f] || []
    for (const v of av) if (bv.includes(v) && !out.includes(v)) out.push(v)
  }
  for (const f of SINGLE_FIELDS) {
    if (a[f] && a[f] === b[f] && !out.includes(a[f])) out.push(a[f])
  }
  return out
}

export function topMatches(myProfile, profiles, employeesByUserId, employeesByEmail, n = 3) {
  if (!myProfile) return []
  const candidates = profiles
    .filter(p => p.user_id !== myProfile.user_id)
    .map(p => {
      const score = scoreMatch(myProfile, p)
      const emp = employeesByUserId?.get(p.user_id) || employeesByEmail?.get(p.email)
      return { profile: p, employee: emp, score, shared: sharedTags(myProfile, p) }
    })
    .filter(c => c.score > 0 && c.employee)
    .sort((a, b) => b.score - a.score)
  return candidates.slice(0, n)
}
