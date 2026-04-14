import { useState } from 'react'
import { C, F, S, tagColors } from '../theme'
import { days } from '../data/schedule'

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(1) // default to Tuesday

  const day = days[selectedDay]

  return (
    <div>
      {/* Day Selector */}
      <div style={styles.daySelector}>
        {days.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setSelectedDay(i)}
            style={{
              ...styles.dayBtn,
              background: selectedDay === i ? C.yellow : 'transparent',
              color: selectedDay === i ? C.black : C.textFade,
              fontWeight: selectedDay === i ? 600 : 400,
            }}
          >
            <span style={styles.dayBtnLabel}>{d.date.split('-')[2]}</span>
            <span style={styles.dayBtnSub}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}</span>
          </button>
        ))}
      </div>

      {/* Day Header */}
      <div style={styles.dayHeader}>
        <h2 style={S.h2}>{day.label}</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
          <span style={{ ...styles.themeBadge }}>{day.theme}</span>
        </div>
        {day.description && (
          <p style={{ ...S.body, color: C.textFade, marginTop: 8, fontSize: 13 }}>
            {day.description}
          </p>
        )}
      </div>

      {/* Sessions */}
      <div style={styles.sessions}>
        {day.sessions.map((session, i) => {
          const tag = tagColors[session.tag] || tagColors.break
          return (
            <div key={i} style={styles.sessionCard}>
              <div style={styles.timeCol}>
                <div style={styles.time}>{session.time || '—'}</div>
                {session.end && <div style={styles.timeEnd}>{session.end}</div>}
              </div>
              <div style={styles.sessionContent}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ ...styles.tag, background: tag.bg, color: tag.text }}>
                    {session.tag}
                  </span>
                  {session.optional && (
                    <span style={styles.optionalBadge}>Optional</span>
                  )}
                </div>
                <h4 style={styles.sessionTitle}>{session.title}</h4>
                {session.location && (
                  <div style={styles.location}>📍 {session.location}</div>
                )}
                {session.description && (
                  <p style={styles.description}>{session.description}</p>
                )}
                {session.speakers && session.speakers.length > 0 && (
                  <div style={styles.speakers}>
                    {session.speakers.map((s, j) => (
                      <span key={j} style={styles.speakerChip}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  daySelector: {
    display: 'flex',
    gap: 6,
    padding: '16px 20px',
    background: C.bg,
    position: 'sticky',
    top: 56,
    zIndex: 50,
    borderBottom: `1px solid ${C.border}`,
  },
  dayBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '10px 4px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    fontFamily: F.sans,
    transition: 'all 0.15s',
  },
  dayBtnLabel: {
    fontSize: 18,
    fontWeight: 'inherit',
    lineHeight: 1,
  },
  dayBtnSub: {
    fontSize: 10,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  dayHeader: {
    padding: '20px 20px 4px',
  },
  themeBadge: {
    fontFamily: F.serif,
    fontSize: 13,
    fontStyle: 'italic',
    color: C.teal,
  },
  sessions: {
    padding: '12px 20px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  sessionCard: {
    display: 'flex',
    gap: 14,
    padding: 16,
    background: C.card,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
  },
  timeCol: {
    width: 56,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  time: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 600,
    color: C.text,
    whiteSpace: 'nowrap',
  },
  timeEnd: {
    fontFamily: F.sans,
    fontSize: 10,
    color: C.textMuted,
    marginTop: 2,
  },
  tag: {
    fontFamily: F.sans,
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '3px 8px',
    borderRadius: 4,
  },
  optionalBadge: {
    fontFamily: F.sans,
    fontSize: 9,
    fontWeight: 500,
    color: C.textMuted,
    border: `1px solid ${C.border}`,
    padding: '2px 6px',
    borderRadius: 4,
  },
  sessionTitle: {
    fontFamily: F.sans,
    fontSize: 15,
    fontWeight: 600,
    color: C.text,
    marginBottom: 4,
  },
  location: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.teal,
    marginBottom: 4,
  },
  description: {
    fontFamily: F.sans,
    fontSize: 13,
    color: C.textFade,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  speakers: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  speakerChip: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 500,
    color: C.navy,
    background: C.navy + '14',
    padding: '4px 10px',
    borderRadius: 8,
  },
}
