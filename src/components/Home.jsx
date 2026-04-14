import { useState, useEffect } from 'react'
import { C, F, S, tagColors } from '../theme'
import { days, RETREAT_START, RETREAT_END } from '../data/schedule'

function getRetreatState() {
  const now = new Date()
  const msPerDay = 86400000

  if (now < RETREAT_START) {
    const diff = Math.ceil((RETREAT_START - now) / msPerDay)
    return { phase: 'pre', daysUntil: diff, currentDay: null }
  }
  if (now > RETREAT_END) {
    return { phase: 'post', daysUntil: 0, currentDay: null }
  }
  const dayIndex = Math.floor((now - RETREAT_START) / msPerDay)
  return { phase: 'during', daysUntil: 0, currentDay: dayIndex }
}

function getNowSession(sessions) {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const nowMin = h * 60 + m

  for (const s of sessions) {
    if (!s.time) continue
    const [startH, startM] = parseTime(s.time)
    const [endH, endM] = parseTime(s.end)
    const start = startH * 60 + startM
    const end = endH * 60 + endM
    if (nowMin >= start && nowMin < end) return s.title
  }
  return null
}

function parseTime(str) {
  if (!str) return [0, 0]
  const [time, period] = str.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return [h, m]
}

export default function Home({ user, onNavigate }) {
  const [state, setState] = useState(getRetreatState)

  useEffect(() => {
    const interval = setInterval(() => setState(getRetreatState()), 60000)
    return () => clearInterval(interval)
  }, [])

  const todayData = state.currentDay !== null ? days[state.currentDay] : null
  const nowSession = todayData ? getNowSession(todayData.sessions) : null

  return (
    <div>
      {/* Hero — dark */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <img src="/logo-white.png" alt="SDF Connect" style={{ height: 32, marginBottom: 12 }} />

          {state.phase === 'pre' && (
            <>
              <div style={styles.countdownNumber}>{state.daysUntil}</div>
              <div style={styles.countdownLabel}>days to go</div>
            </>
          )}

          {state.phase === 'during' && todayData && (
            <>
              <div style={styles.countdownNumber}>{todayData.title}</div>
              <div style={styles.countdownLabel}>{todayData.theme}</div>
              {nowSession && (
                <div style={styles.nowBadge}>
                  <span style={styles.nowDot} />
                  NOW: {nowSession}
                </div>
              )}
            </>
          )}

          {state.phase === 'post' && (
            <>
              <div style={styles.countdownNumber}>Done!</div>
              <div style={styles.countdownLabel}>Thanks for an amazing retreat</div>
            </>
          )}

          <div style={styles.heroDate}>May 18–22, 2026 · Fairmont San Francisco</div>
        </div>
      </div>

      {/* Content — light */}
      <div style={styles.content}>
        {/* Greeting */}
        <div style={{ padding: '24px 20px 0' }}>
          <h2 style={S.h2}>Welcome, {user.name.split(' ')[0]}</h2>
          <p style={{ ...S.caption, marginTop: 4 }}>
            {state.phase === 'pre' && "Here's what's coming up at the retreat."}
            {state.phase === 'during' && "Here's what's happening today."}
            {state.phase === 'post' && "Hope you had an incredible time!"}
          </p>
        </div>

        {/* Quick Links */}
        <div style={styles.quickGrid}>
          {[
            { label: 'Schedule', icon: '▦', color: C.teal, tab: 'schedule' },
            { label: 'People', icon: '●●', color: C.navy, tab: 'people' },
            { label: 'Q&A', icon: '?', color: C.lavender, tab: 'engage' },
            { label: 'Venue Map', icon: '⌖', color: C.tan, tab: 'venue' },
          ].map(q => (
            <button
              key={q.label}
              onClick={() => onNavigate(q.tab)}
              style={{ ...styles.quickCard, background: q.color + '18' }}
            >
              <span style={{ fontSize: 24 }}>{q.icon}</span>
              <span style={{ ...S.caption, color: C.text, fontWeight: 600 }}>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Today's Schedule Preview or Next Day Preview */}
        <div style={{ padding: '0 20px' }}>
          <h3 style={{ ...S.h3, marginBottom: 12 }}>
            {state.phase === 'during' ? "Today's Schedule" : "Up Next"}
          </h3>
          {(todayData || days[1]).sessions.slice(0, 5).map((s, i) => {
            const tag = tagColors[s.tag] || tagColors.break
            const isNow = s.title === nowSession
            return (
              <div
                key={i}
                style={{
                  ...styles.sessionRow,
                  borderLeft: isNow ? `3px solid ${C.yellow}` : '3px solid transparent',
                  background: isNow ? C.yellow + '10' : 'transparent',
                }}
              >
                <div style={styles.sessionTime}>{s.time || '—'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...styles.tag, background: tag.bg, color: tag.text }}>{s.tag}</span>
                    <span style={styles.sessionTitle}>{s.title}</span>
                  </div>
                  {s.location && <div style={S.caption}>{s.location}</div>}
                </div>
                {isNow && <span style={styles.nowDotSmall} />}
              </div>
            )
          })}
          <button
            onClick={() => onNavigate('schedule')}
            style={{ ...S.btnSecondary, width: '100%', marginTop: 12 }}
          >
            View Full Schedule →
          </button>
        </div>

        {/* Engagement Cards */}
        <div style={{ padding: '28px 20px 0' }}>
          <h3 style={{ ...S.h3, marginBottom: 12 }}>Get Involved</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => onNavigate('engage')} style={styles.engageCard}>
              <span style={{ fontSize: 28 }}>💬</span>
              <div>
                <div style={{ ...S.body, fontWeight: 600 }}>Anonymous Q&A</div>
                <div style={S.caption}>Ask anything during sessions — completely anonymous</div>
              </div>
            </button>
            <button onClick={() => onNavigate('engage')} style={styles.engageCard}>
              <span style={{ fontSize: 28 }}>✨</span>
              <div>
                <div style={{ ...S.body, fontWeight: 600 }}>Share a Testimonial</div>
                <div style={S.caption}>Tell us what makes SDF special to you</div>
              </div>
            </button>
            <button onClick={() => onNavigate('engage')} style={styles.engageCard}>
              <span style={{ fontSize: 28 }}>🎲</span>
              <div>
                <div style={{ ...S.body, fontWeight: 600 }}>Icebreaker Cards</div>
                <div style={S.caption}>Conversation starters for breaks and meals</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  hero: {
    background: C.dark,
    padding: '40px 20px 48px',
    textAlign: 'center',
  },
  heroInner: {
    maxWidth: 480,
    margin: '0 auto',
  },
  heroLabel: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.16em',
    color: C.yellow,
    marginBottom: 20,
  },
  countdownNumber: {
    fontFamily: F.serif,
    fontSize: 72,
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1,
    marginBottom: 4,
  },
  countdownLabel: {
    fontFamily: F.serif,
    fontSize: 18,
    fontStyle: 'italic',
    color: '#aaa',
    marginBottom: 16,
  },
  heroDate: {
    fontFamily: F.sans,
    fontSize: 12,
    color: '#666',
    letterSpacing: '0.02em',
  },
  nowBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: C.yellow + '20',
    color: C.yellow,
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    padding: '8px 16px',
    borderRadius: 20,
    margin: '16px auto 0',
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    background: C.yellow,
    animation: 'pulse 2s infinite',
  },
  nowDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    background: C.yellow,
    flexShrink: 0,
  },
  content: {
    background: C.bg,
    borderRadius: '24px 24px 0 0',
    marginTop: -20,
    paddingBottom: 40,
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    padding: '20px 20px 24px',
  },
  quickCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: 20,
    borderRadius: 16,
    border: 'none',
    cursor: 'pointer',
  },
  sessionRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 8px',
    borderRadius: 8,
    marginBottom: 2,
  },
  sessionTime: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 500,
    color: C.textFade,
    width: 64,
    flexShrink: 0,
    paddingTop: 1,
  },
  sessionTitle: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 500,
    color: C.text,
  },
  tag: {
    fontFamily: F.sans,
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '3px 8px',
    borderRadius: 4,
    flexShrink: 0,
  },
  engageCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    background: C.card,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
}
