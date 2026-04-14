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
      {/* Hero — dark, seamless with header */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          {/* Greeting integrated into hero */}
          <div style={styles.greeting}>
            Hello, {user.name.split(' ')[0]}
          </div>

          {state.phase === 'pre' && (
            <>
              <div style={styles.countdownNumber}>{state.daysUntil}</div>
              <div style={styles.countdownUnit}>days to go</div>
              <div style={styles.yellowRule} />
              <div style={styles.heroDate}>May 18–22, 2026</div>
              <div style={styles.heroVenue}>Fairmont San Francisco</div>
            </>
          )}

          {state.phase === 'during' && todayData && (
            <>
              <div style={styles.countdownNumber}>{todayData.title}</div>
              <div style={styles.countdownUnit}>{todayData.theme}</div>
              {nowSession && (
                <div style={styles.nowBadge}>
                  <span style={styles.nowDot} />
                  NOW: {nowSession}
                </div>
              )}
              <div style={styles.yellowRule} />
              <div style={styles.heroDate}>May 18–22, 2026</div>
            </>
          )}

          {state.phase === 'post' && (
            <>
              <div style={styles.countdownNumber}>Done!</div>
              <div style={styles.countdownUnit}>Thanks for an amazing retreat</div>
              <div style={styles.yellowRule} />
            </>
          )}

          {/* Quick Links — inside the dark hero */}
          <div style={styles.quickGrid}>
            {[
              { label: 'Schedule', icon: '01', desc: '5 days', color: C.yellow, tab: 'schedule' },
              { label: 'People', icon: '02', desc: '~160', color: C.teal, tab: 'people' },
              { label: 'Q&A', icon: '03', desc: 'Anonymous', color: C.lavender, tab: 'engage' },
              { label: 'Venue', icon: '04', desc: 'Map', color: C.tan, tab: 'venue' },
            ].map(q => (
              <button
                key={q.label}
                onClick={() => onNavigate(q.tab)}
                style={styles.quickCard}
              >
                <div style={{ ...styles.quickNumber, color: q.color }}>{q.icon}</div>
                <div style={styles.quickLabel}>{q.label}</div>
                <div style={styles.quickDesc}>{q.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content — light */}
      <div style={styles.content}>
        {/* Today's Schedule Preview */}
        <div style={{ padding: '24px 20px 0' }}>
          <h3 style={{ ...S.h3, marginBottom: 12 }}>
            {state.phase === 'during' ? "Today's Schedule" : "Up Next — Tuesday"}
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
            View Full Schedule
          </button>
        </div>

        {/* Engagement Cards */}
        <div style={{ padding: '28px 20px 0' }}>
          <h3 style={{ ...S.h3, marginBottom: 12 }}>Get Involved</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Anonymous Q&A', desc: 'Ask anything during sessions', color: C.teal, tab: 'engage' },
              { label: 'Share a Testimonial', desc: 'Tell us what makes SDF special', color: C.lavender, tab: 'engage' },
              { label: 'Icebreaker Cards', desc: 'Conversation starters for breaks', color: C.navy, tab: 'engage' },
            ].map((card, i) => (
              <button
                key={i}
                onClick={() => onNavigate(card.tab)}
                style={styles.engageCard}
              >
                <div style={{ ...styles.engageDot, background: card.color }} />
                <div style={{ flex: 1 }}>
                  <div style={{ ...S.body, fontWeight: 600, fontSize: 14 }}>{card.label}</div>
                  <div style={{ ...S.caption, marginTop: 2 }}>{card.desc}</div>
                </div>
                <span style={{ color: C.textMuted, fontSize: 18 }}>&rsaquo;</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  hero: {
    background: C.dark,
    padding: '8px 20px 0',
    textAlign: 'center',
  },
  heroInner: {
    maxWidth: 480,
    margin: '0 auto',
  },
  greeting: {
    fontFamily: F.serif,
    fontSize: 16,
    fontWeight: 400,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  countdownNumber: {
    fontFamily: F.serif,
    fontSize: 88,
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },
  countdownUnit: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 500,
    color: '#666',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  yellowRule: {
    width: 48,
    height: 3,
    borderRadius: 2,
    background: C.yellow,
    margin: '20px auto',
  },
  heroDate: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    color: '#aaa',
    letterSpacing: '0.02em',
  },
  heroVenue: {
    fontFamily: F.sans,
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
  },
  nowDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    background: C.yellow,
    flexShrink: 0,
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
    padding: '28px 0 24px',
  },
  quickCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '14px 4px',
    background: C.darkCard,
    borderRadius: 14,
    border: `1px solid ${C.darkBorder}`,
    cursor: 'pointer',
  },
  quickNumber: {
    fontFamily: F.sans,
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1,
  },
  quickLabel: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '0.02em',
  },
  quickDesc: {
    fontFamily: F.sans,
    fontSize: 10,
    color: '#666',
  },
  content: {
    background: C.bg,
    borderRadius: '24px 24px 0 0',
    paddingBottom: 40,
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
    gap: 14,
    padding: '16px 18px',
    background: C.card,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  engageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
}
