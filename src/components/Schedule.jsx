import { useState } from 'react'
import { C, F, S, tagColors } from '../theme'
import { days, briefRoom, roomHint, externalAddress, mapsUrl } from '../data/schedule'

export default function Schedule({ onNavigate }) {
  const [selectedDay, setSelectedDay] = useState(1)
  const [openSession, setOpenSession] = useState(null)

  const day = days[selectedDay]

  return (
    <div>
      {/* Floor plan banner */}
      <button
        onClick={() => onNavigate && onNavigate('venue')}
        style={styles.mapBanner}
      >
        <img src="/lobby-floorplan.jpg" alt="Lobby floor plan" style={styles.mapBannerImg} />
        <div style={styles.mapBannerText}>
          <div style={styles.mapBannerTitle}>Lobby level map</div>
          <div style={styles.mapBannerSub}>Tap to find your way →</div>
        </div>
      </button>

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
          <span style={styles.themeBadge}>{day.theme}</span>
        </div>
        {day.description && (
          <p style={{ ...S.body, color: C.textFade, marginTop: 8, fontSize: 13 }}>
            {day.description}
          </p>
        )}
      </div>

      {/* Sessions — compact rows */}
      <div style={styles.sessions}>
        {day.sessions.map((session, i) => {
          const tag = tagColors[session.tag] || tagColors.break
          const room = briefRoom(session)
          return (
            <button
              key={i}
              onClick={() => setOpenSession(session)}
              style={styles.sessionRow}
            >
              <div style={styles.timeCol}>
                <div style={styles.time}>{session.time || '—'}</div>
                {session.end && <div style={styles.timeEnd}>{session.end}</div>}
              </div>
              <div style={styles.sessionContent}>
                <div style={styles.sessionTopLine}>
                  <span style={{ ...styles.tag, background: tag.bg, color: tag.text }}>
                    {session.tag}
                  </span>
                  {session.optional && (
                    <span style={styles.optionalBadge}>Optional</span>
                  )}
                </div>
                <div style={styles.sessionTitle}>{session.title}</div>
                {room && (
                  <div style={styles.roomLine}>
                    📍 {room}
                    {roomHint(room) && (
                      <span style={styles.roomHint}> · {roomHint(room)}</span>
                    )}
                  </div>
                )}
              </div>
              <span style={styles.chevron}>›</span>
            </button>
          )
        })}
      </div>

      {/* Session detail sheet */}
      {openSession && (
        <SessionSheet
          session={openSession}
          onClose={() => setOpenSession(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  )
}

function SessionSheet({ session, onClose, onNavigate }) {
  const tag = tagColors[session.tag] || tagColors.break
  const fullLocation = session.location || ''
  const address = externalAddress(fullLocation)
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.sheet} onClick={e => e.stopPropagation()}>
        <div style={S.sheetHandle} />
        <div style={{ paddingTop: 4 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <span style={{ ...styles.tag, background: tag.bg, color: tag.text }}>{session.tag}</span>
            {session.optional && <span style={styles.optionalBadge}>Optional</span>}
          </div>

          <h3 style={{ ...S.h2, marginBottom: 6 }}>{session.title}</h3>

          <div style={styles.sheetTime}>
            {session.time}{session.end ? ` – ${session.end}` : ''}
          </div>

          {fullLocation && (
            <div style={styles.sheetLocation}>
              <span style={{ marginRight: 6 }}>📍</span>
              <span>{fullLocation}</span>
            </div>
          )}

          {session.description && (
            <p style={styles.sheetDescription}>{session.description}</p>
          )}

          {session.speakers && session.speakers.length > 0 && (
            <div>
              <div style={{ ...S.label, marginBottom: 6, color: C.teal }}>Speakers</div>
              <div style={styles.speakersWrap}>
                {session.speakers.map((s, i) => (
                  <span key={i} style={styles.speakerChip}>{s}</span>
                ))}
              </div>
            </div>
          )}

          <div style={styles.sheetActions}>
            {address && (
              <a
                href={mapsUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...S.btnPrimary, flex: 1, textAlign: 'center', textDecoration: 'none' }}
              >
                Get directions
              </a>
            )}
            {!address && fullLocation && onNavigate && (
              <button
                onClick={() => { onNavigate('venue'); onClose() }}
                style={{ ...S.btnPrimary, flex: 1 }}
              >
                Find it on map
              </button>
            )}
            <button
              onClick={onClose}
              style={{ ...S.btnSecondary, flex: fullLocation ? 1 : 2 }}
            >
              Close
            </button>
          </div>
        </div>
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
    gap: 6,
  },
  sessionRow: {
    display: 'flex',
    gap: 12,
    padding: '12px 14px',
    background: C.card,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    cursor: 'pointer',
    textAlign: 'left',
    alignItems: 'center',
    width: '100%',
  },
  timeCol: {
    width: 56,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  sessionContent: {
    flex: 1,
    minWidth: 0,
  },
  sessionTopLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
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
    fontSize: 14,
    fontWeight: 600,
    color: C.text,
    lineHeight: 1.3,
  },
  roomLine: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.teal,
    marginTop: 3,
  },
  roomHint: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 600,
    color: C.navy,
  },
  mapBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    margin: 0,
    padding: 10,
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 0,
    borderBottom: `1px solid ${C.border}`,
    cursor: 'pointer',
    textAlign: 'left',
  },
  mapBannerImg: {
    width: 90,
    height: 60,
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: 8,
    flexShrink: 0,
  },
  mapBannerText: {
    flex: 1,
    minWidth: 0,
  },
  mapBannerTitle: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 700,
    color: C.text,
  },
  mapBannerSub: {
    fontFamily: F.sans,
    fontSize: 11,
    color: C.lavender,
    marginTop: 2,
    fontWeight: 600,
  },
  chevron: {
    fontFamily: F.sans,
    fontSize: 20,
    fontWeight: 300,
    color: C.textMuted,
    flexShrink: 0,
  },
  // Sheet
  sheetTime: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 500,
    color: C.text,
    marginBottom: 10,
  },
  sheetLocation: {
    display: 'flex',
    alignItems: 'flex-start',
    fontFamily: F.sans,
    fontSize: 14,
    color: C.teal,
    marginBottom: 16,
    padding: '12px 14px',
    background: C.teal + '10',
    borderRadius: 10,
  },
  sheetDescription: {
    fontFamily: F.sans,
    fontSize: 14,
    color: C.text,
    lineHeight: 1.55,
    marginBottom: 20,
    whiteSpace: 'pre-line',
  },
  speakersWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 20,
  },
  speakerChip: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 500,
    color: C.navy,
    background: C.navy + '14',
    padding: '5px 12px',
    borderRadius: 10,
  },
  sheetActions: {
    display: 'flex',
    gap: 8,
    marginTop: 8,
  },
}
