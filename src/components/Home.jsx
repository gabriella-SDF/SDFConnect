import { useState, useEffect, useMemo } from 'react'
import { C, F, S, tagColors } from '../theme'
import { days, icebreakers, contacts, RETREAT_START, RETREAT_END, briefRoom, roomHint } from '../data/schedule'
import { supabase } from '../lib/supabase'
import { topMatches } from '../lib/matching'

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

function parseTime(str) {
  if (!str) return [0, 0]
  const [time, period] = str.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return [h, m]
}

function toMin(str) {
  const [h, m] = parseTime(str)
  return h * 60 + m
}

function getNowSession(sessions) {
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  for (const s of sessions) {
    if (!s.time) continue
    if (nowMin >= toMin(s.time) && nowMin < toMin(s.end)) return s
  }
  return null
}

function getNextSession(sessions) {
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  for (const s of sessions) {
    if (!s.time) continue
    if (toMin(s.time) > nowMin) return s
  }
  return null
}

function briefTime(t) {
  if (!t) return ''
  return t.replace(':00 ', '').replace(' AM', 'am').replace(' PM', 'pm').toLowerCase()
}

export default function Home({ user, profile, onNavigate, onOpenPerson, onGoExplore }) {
  const [state, setState] = useState(getRetreatState)
  const [matches, setMatches] = useState([])
  const [icebreakerIdx, setIcebreakerIdx] = useState(() =>
    Math.floor(Math.random() * icebreakers.length)
  )

  useEffect(() => {
    const interval = setInterval(() => setState(getRetreatState()), 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!profile) return
    let cancelled = false
    ;(async () => {
      const [{ data: profiles, error: e1 }, { data: employees, error: e2 }] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('employees').select('id, first_name, last_name, department, email, title'),
      ])
      if (cancelled) return
      if (e1 || e2 || !profiles || !employees) {
        if (e1 || e2) console.warn('Matches fetch failed:', e1?.message || e2?.message)
        return
      }
      const byEmail = new Map(employees.map(e => [e.email, e]))
      const top = topMatches(profile, profiles, null, byEmail, 5)
      setMatches(top)
    })()
    return () => { cancelled = true }
  }, [profile])

  const todayData = state.currentDay !== null ? days[state.currentDay] : null
  const previewDay = todayData || days.find(d => d.id === 'tue') || days[1]
  const nowSession = todayData ? getNowSession(todayData.sessions) : null
  const nextSession = todayData ? getNextSession(todayData.sessions) : null

  const shuffleIcebreaker = () => {
    let next
    do { next = Math.floor(Math.random() * icebreakers.length) } while (next === icebreakerIdx)
    setIcebreakerIdx(next)
  }

  return (
    <div>
      {/* Hero — SF skyline photo with dark overlay */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroInner}>
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
              <div style={styles.dayLabel}>{todayData.title}</div>
              <div style={styles.dayTheme}>{todayData.theme}</div>
              {nowSession && (
                <div style={styles.nowBadge}>
                  <span style={styles.nowDot} />
                  NOW: {nowSession.title}
                </div>
              )}
              {!nowSession && nextSession && (
                <div style={styles.nextBadge}>
                  Up next at {briefTime(nextSession.time)}: {nextSession.title}
                </div>
              )}
              <div style={styles.yellowRule} />
              <div style={styles.heroDate}>{todayData.label}</div>
            </>
          )}

          {state.phase === 'post' && (
            <>
              <div style={styles.countdownNumber}>Done!</div>
              <div style={styles.countdownUnit}>Thanks for an amazing retreat</div>
              <div style={styles.yellowRule} />
            </>
          )}
        </div>
      </div>

      {/* Content — light */}
      <div style={styles.content}>
        {/* Explore SF banner */}
        <div style={{ padding: '20px 20px 0' }}>
          <button onClick={onGoExplore} style={styles.exploreBanner}>
            <img src="/sf-hero.jpg" alt="San Francisco" style={styles.mapBannerImg} />
            <div style={styles.exploreBannerOverlay} />
            <div style={styles.mapBannerText}>
              <div style={styles.mapBannerKicker}>While you're in town</div>
              <div style={styles.mapBannerTitle}>Explore San Francisco →</div>
            </div>
          </button>
        </div>

        {/* Floor plan banner */}
        <div style={{ padding: '16px 20px 0' }}>
          <button onClick={() => onNavigate('venue')} style={styles.mapBanner}>
            <img src="/lobby-floorplan.jpg" alt="Lobby floor plan" style={styles.mapBannerImg} />
            <div style={styles.mapBannerOverlay} />
            <div style={styles.mapBannerText}>
              <div style={styles.mapBannerKicker}>The Fairmont · Lobby Level</div>
              <div style={styles.mapBannerTitle}>Find your way around →</div>
            </div>
          </button>
        </div>

        {/* Matches card */}
        {matches.length > 0 && (
          <div style={{ padding: '24px 20px 0' }}>
            <div style={styles.sectionHeader}>
              <h3 style={S.h3}>People to connect with</h3>
              <button onClick={() => onNavigate('people')} style={styles.linkBtn}>
                All people ›
              </button>
            </div>
            <div style={styles.matchesList}>
              {matches.map(m => (
                <button
                  key={m.profile.user_id}
                  onClick={() => onOpenPerson?.(m.employee.id)}
                  style={styles.matchCard}
                >
                  <div style={styles.matchAvatar}>
                    {m.employee.first_name[0]}{m.employee.last_name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.matchName}>
                      {m.employee.first_name} {m.employee.last_name}
                    </div>
                    <div style={styles.matchSub}>
                      {m.shared.slice(0, 2).join(', ')}
                      {m.shared.length > 2 && ` +${m.shared.length - 2}`}
                    </div>
                  </div>
                  <span style={styles.matchChevron}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Today's / Next Schedule — condensed */}
        <div style={{ padding: '20px 20px 0' }}>
          <div style={styles.sectionHeader}>
            <h3 style={S.h3}>
              {state.phase === 'during' ? "Today's schedule" : `Up next: ${previewDay.label.split(',')[0]}`}
            </h3>
            <button onClick={() => onNavigate('schedule')} style={styles.linkBtn}>
              Full schedule ›
            </button>
          </div>

          <div style={styles.scheduleList}>
            {previewDay.sessions.map((s, i) => {
              const isNow = nowSession && s.title === nowSession.title
              const room = briefRoom(s)
              const hint = roomHint(room)
              return (
                <div
                  key={i}
                  style={{
                    ...styles.briefRow,
                    background: isNow ? C.yellow + '14' : 'transparent',
                    borderLeft: isNow ? `3px solid ${C.yellow}` : '3px solid transparent',
                  }}
                >
                  <span style={styles.briefTime}>{briefTime(s.time) || '—'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={styles.briefTitle}>{s.title}</span>
                    {room && <span style={styles.briefRoom}>· {room}</span>}
                    {hint && <span style={styles.briefHint}>· {hint}</span>}
                  </div>
                  {isNow && <span style={styles.nowDotSmall} />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Points of contact — call/text any onsite lead */}
        <div style={{ padding: '24px 20px 0' }}>
          <div style={styles.sectionHeader}>
            <h3 style={S.h3}>Need help?</h3>
            <span style={styles.linkBtn}>Tap to call</span>
          </div>
          <div style={styles.contactList}>
            {contacts.map((c, i) => (
              <a
                key={i}
                href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}
                style={styles.contactCard}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.contactName}>{c.name}</div>
                  <div style={styles.contactRole}>{c.role}</div>
                </div>
                <div style={styles.contactPhone}>{c.phone}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Icebreaker card */}
        <div style={{ padding: '24px 20px 0' }}>
          <div style={styles.sectionHeader}>
            <h3 style={S.h3}>Icebreaker</h3>
            <button onClick={() => onNavigate('engage')} style={styles.linkBtn}>
              More cards ›
            </button>
          </div>
          <div style={styles.icebreakerCard}>
            <div style={styles.icebreakerKicker}>Conversation starter</div>
            <p style={styles.icebreakerText}>{icebreakers[icebreakerIdx]}</p>
            <button onClick={shuffleIcebreaker} style={styles.shuffleBtn}>
              Shuffle →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  hero: {
    position: 'relative',
    background: `linear-gradient(180deg, rgba(15,15,15,0.55) 0%, rgba(15,15,15,0.78) 60%, rgba(15,15,15,0.95) 100%), url('/sf-hero.jpg') center 30% / cover no-repeat, ${C.dark}`,
    padding: '32px 20px 36px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  heroInner: {
    position: 'relative',
    maxWidth: 480,
    margin: '0 auto',
  },
  greeting: {
    fontFamily: F.serif,
    fontSize: 16,
    fontWeight: 400,
    color: '#cfcfcf',
    fontStyle: 'italic',
    marginBottom: 28,
    textShadow: '0 1px 6px rgba(0,0,0,0.5)',
  },
  countdownNumber: {
    fontFamily: F.serif,
    fontSize: 88,
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1,
    letterSpacing: '-0.02em',
    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
  },
  countdownUnit: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 500,
    color: '#bbb',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  dayLabel: {
    fontFamily: F.serif,
    fontSize: 56,
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1.05,
    fontStyle: 'italic',
    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
  },
  dayTheme: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    color: '#cfcfcf',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginTop: 6,
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
    color: '#ddd',
    letterSpacing: '0.02em',
  },
  heroVenue: {
    fontFamily: F.sans,
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  nowBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: C.yellow,
    color: C.dark,
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.04em',
    padding: '8px 14px',
    borderRadius: 20,
    margin: '16px auto 0',
  },
  nextBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 500,
    padding: '8px 14px',
    borderRadius: 20,
    margin: '16px auto 0',
    backdropFilter: 'blur(4px)',
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    background: C.dark,
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
    paddingBottom: 40,
    marginTop: -16,
    position: 'relative',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: C.textFade,
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    padding: 0,
  },
  scheduleList: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    overflow: 'hidden',
  },
  briefRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderBottom: `1px solid ${C.border}`,
  },
  briefTime: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 600,
    color: C.textFade,
    width: 56,
    flexShrink: 0,
    letterSpacing: '0.02em',
  },
  briefTitle: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 500,
    color: C.text,
  },
  briefRoom: {
    fontFamily: F.sans,
    fontSize: 13,
    color: C.textFade,
    marginLeft: 6,
  },
  briefHint: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 600,
    color: C.navy,
    marginLeft: 4,
    letterSpacing: '0.02em',
  },
  mapBanner: {
    position: 'relative',
    display: 'block',
    width: '100%',
    height: 130,
    padding: 0,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    overflow: 'hidden',
    cursor: 'pointer',
    background: C.card,
    textAlign: 'left',
  },
  mapBannerImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  },
  mapBannerOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(0,46,93,0.85) 0%, rgba(0,46,93,0.55) 55%, rgba(0,46,93,0) 100%)',
  },
  exploreBanner: {
    position: 'relative',
    display: 'block',
    width: '100%',
    height: 130,
    padding: 0,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    overflow: 'hidden',
    cursor: 'pointer',
    background: C.card,
    textAlign: 'left',
  },
  exploreBannerOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(0,167,181,0.85) 0%, rgba(0,167,181,0.45) 55%, rgba(0,167,181,0) 100%)',
  },
  mapBannerText: {
    position: 'absolute',
    left: 18,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#fff',
  },
  mapBannerKicker: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
  },
  mapBannerTitle: {
    fontFamily: F.serif,
    fontSize: 19,
    fontWeight: 600,
    fontStyle: 'italic',
    color: '#fff',
    letterSpacing: '-0.01em',
  },
  matchesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  matchCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '12px 14px',
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    cursor: 'pointer',
    textAlign: 'left',
  },
  matchAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    background: C.lavender,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
    letterSpacing: '0.02em',
  },
  matchName: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 600,
    color: C.text,
  },
  matchSub: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.textFade,
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  matchChevron: {
    fontFamily: F.sans,
    fontSize: 20,
    fontWeight: 300,
    color: C.textMuted,
    flexShrink: 0,
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  contactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
  },
  contactName: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 600,
    color: C.text,
  },
  contactRole: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.textFade,
    marginTop: 2,
  },
  contactPhone: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    color: C.teal,
    flexShrink: 0,
  },
  icebreakerCard: {
    background: `linear-gradient(135deg, ${C.navy}, ${C.teal})`,
    borderRadius: 18,
    padding: 24,
    color: '#fff',
  },
  icebreakerKicker: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  icebreakerText: {
    fontFamily: F.serif,
    fontSize: 19,
    fontWeight: 500,
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
  shuffleBtn: {
    marginTop: 16,
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.25)',
    color: '#fff',
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    padding: '8px 14px',
    borderRadius: 20,
    cursor: 'pointer',
  },
}
