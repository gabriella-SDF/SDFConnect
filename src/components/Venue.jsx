import { useEffect, useState } from 'react'
import { C, F, S } from '../theme'
import { days, hubRoomForSession, mapsUrl } from '../data/schedule'

// =============================================================================
// Data — easy to edit
// =============================================================================

const hubRooms = [
  { id: 'gold', name: 'Gold Room', purpose: 'General Sessions · Oracle Hunt · Awards' },
  { id: 'green', name: 'Green Room', purpose: 'Breakouts · Product team time' },
  { id: 'garden', name: 'Garden Room', purpose: 'Breakouts · People team time' },
  { id: 'empire', name: 'Empire Room', purpose: 'Breakouts · Office of CEO' },
  { id: 'crystal', name: 'Crystal Room', purpose: 'AI Hackathon · BD team time' },
  { id: 'fountain', name: 'Fountain Room', purpose: 'AI Hackathon · Growth team' },
]

const upRooms = [
  { name: 'Crown', detail: 'Yoga · Penthouse Happy Hour' },
  { name: 'Pavilion + Registration', detail: 'Breakfast · Check-in · Swag' },
]

const downRooms = [
  { name: 'Arcade', detail: 'Intersect I/II · Diplomat Club' },
  { name: 'Terrace', detail: 'Tonga Room · Vanderbilt · Spa' },
]

const sfPicks = {
  eat: {
    label: 'Eat',
    intro: 'From quick bites to special-occasion dinners.',
    groups: [
      {
        title: 'Italian & Pizza',
        items: [
          { name: 'Seven Hills', detail: 'Classic Russian Hill Italian.', tag: 'Italian · $$$$' },
          { name: 'Che Fico', detail: 'Trendy Italian on Divisadero. Reservations essential.', tag: 'Italian · $$$' },
          { name: "Tony's Pizza Napoletana", detail: 'North Beach pizza institution. Try the Margherita or Classica.', tag: 'Pizza · 15-min walk' },
          { name: 'Flour + Water Pizzeria', detail: 'Well-regarded Italian pizza in the Mission.', tag: 'Pizza · $$' },
          { name: 'Golden Boy Pizza', detail: 'Chicago-style slices in North Beach. Late-night staple.', tag: 'Pizza · $' },
        ],
      },
      {
        title: 'French',
        items: [
          { name: 'Galinette', detail: 'Cozy French. Date-night vibes.', tag: 'French · $$' },
          { name: 'Chez Maman East', detail: 'Beloved French bistro (Potrero Hill).', tag: 'French · $$' },
          { name: 'Chez Maman West', detail: 'Sister spot — classic French bistro (Hayes Valley).', tag: 'French · $$' },
          { name: 'Zazie', detail: 'Beloved Cole Valley spot. Known for brunch.', tag: 'Brunch · French' },
        ],
      },
      {
        title: 'Japanese & Chinese',
        items: [
          { name: "Mister Jiu's", detail: 'Modern Chinese in Chinatown. Book ahead.', tag: 'Chinese · $$$$' },
          { name: 'Robin', detail: 'High-end omakase in Hayes Valley.', tag: 'Omakase · $$$$' },
          { name: 'Z & Y Restaurant', detail: 'Acclaimed Sichuan in Chinatown.', tag: 'Sichuan · 7-min walk' },
          { name: 'Ace Wasabi', detail: 'Popular sushi spot in the Marina.', tag: 'Sushi · $$' },
        ],
      },
      {
        title: 'American & Classic SF',
        items: [
          { name: 'Sons & Daughters', detail: 'Michelin-starred tasting menu, intimate room.', tag: 'Tasting · 3-min walk' },
          { name: 'State Bird Provisions', detail: 'James Beard winner with dim-sum-style service.', tag: 'New American · $$$$' },
          { name: 'Pearl 6101', detail: 'Acclaimed neighborhood spot in the Outer Richmond.', tag: 'New American · $$$$' },
          { name: 'House of Prime Rib', detail: 'A San Francisco institution. Book well ahead.', tag: 'Classic SF · $$$' },
          { name: "Leo's Oyster Bar", detail: 'Iconic oyster bar in FiDi.', tag: 'Seafood · $$$' },
        ],
      },
      {
        title: 'Californian & Mediterranean',
        items: [
          { name: 'Foreign Cinema', detail: 'Californian-Mediterranean classic in the Mission.', tag: 'Californian · $$$' },
          { name: 'Liholiho Yacht Club', detail: 'Inventive Hawaiian–Californian on Sutter St.', tag: 'New SF · $$' },
          { name: 'Beit Rima', detail: 'Fresh Mediterranean. Multiple locations around the city.', tag: 'Middle Eastern · $$' },
        ],
      },
    ],
  },
  drinks: {
    label: 'Drinks',
    intro: 'Cocktail, wine, and beer destinations across SF.',
    groups: [
      {
        title: 'Cocktail Bars & Lounges',
        items: [
          { name: 'Top of the Mark', detail: 'Iconic SF cocktails & 360° views. Right across the street.', tag: 'View · Cocktails' },
          { name: 'Golden Sardine', detail: 'Highly-rated cocktail bar — 4.9 stars.', tag: 'Cocktail bar' },
          { name: 'Friends Only', detail: 'Bar and lounge with a chic atmosphere.', tag: 'Bar / lounge · $$$' },
          { name: 'Peacekeeper', detail: 'New American bar with a neighborhood feel.', tag: 'Bar · $$' },
          { name: 'Back to Back', detail: 'Easygoing bar and restaurant.', tag: 'Bar · $$' },
          { name: 'Woods Cole Valley', detail: 'Local brewery in Cole Valley.', tag: 'Brewery · $$' },
        ],
      },
      {
        title: 'Wine Bars',
        items: [
          { name: 'Bar Sprezzatura', detail: 'Italian wine bar with refined small plates.', tag: 'Italian · $$$' },
          { name: 'Amelie', detail: 'French-leaning wine bar — over 100 wines by the glass.', tag: 'French' },
          { name: 'Bon Délire', detail: 'French-inspired wine bar.', tag: 'French' },
          { name: 'Bodega North Beach', detail: 'Easygoing wine bar in North Beach.', tag: '$ · North Beach' },
          { name: 'Arcana', detail: 'Intimate wine bar with an eclectic by-the-glass list.', tag: 'Intimate' },
          { name: 'Buddy', detail: 'Natural wine focus with a thoughtful snack menu.', tag: 'Natural wine' },
          { name: 'Key Klub', detail: 'Lively wine bar with New American small plates.', tag: '$$' },
          { name: "GiGi's", detail: 'Stylish wine bar in an intimate setting.', tag: '$$$' },
        ],
      },
    ],
  },
  coffee: {
    label: 'Coffee',
    intro: 'Where to caffeinate before the day starts.',
    items: [
      { name: 'Laurel Court Café', detail: 'Inside the Fairmont — grab-and-go.', tag: 'In hotel' },
      { name: 'Réveille Coffee Co.', detail: 'Reliable espresso on Polk St.', tag: 'Espresso' },
      { name: 'Sextant Coffee', detail: 'Single-origin, calm vibe, good pour-overs.', tag: 'Pour-over' },
      { name: 'Caffe Trieste', detail: 'North Beach classic. Beat-era history.', tag: 'Historic' },
    ],
  },
  see: {
    label: 'See',
    intro: 'Iconic SF, within reach of the hotel.',
    items: [
      { name: 'Powell-Hyde Cable Car', detail: 'Catch it at California St — the original SF moving postcard.', tag: 'Right outside' },
      { name: 'Chinatown', detail: 'Walk down Powell into the largest Chinatown outside Asia.', tag: '5-min walk' },
      { name: 'Coit Tower & Telegraph Hill', detail: 'Stairs up through gardens and parrots to a killer view.', tag: '20-min walk' },
      { name: 'Lombard Street', detail: 'The famous crooked block — best from the bottom looking up.', tag: '12-min walk' },
      { name: 'Ferry Building', detail: 'Food hall on the water. Cable car down California gets you there.', tag: 'Cable car' },
      { name: 'Russian Hill', detail: 'Quiet streets, hidden stairways, great views.', tag: '15-min walk' },
      { name: 'Alcatraz', detail: 'Book the ferry ahead (cityexperiences.com/alcatraz). Sells out.', tag: 'Book ahead' },
      { name: 'Painted Ladies / Alamo Square', detail: "The pastel Victorians you've seen on TV.", tag: 'Cab over' },
      { name: 'Golden Gate Bridge', detail: 'Walk or bike across — start from the south pavilion.', tag: 'Half-day' },
    ],
  },
}

// =============================================================================
// Component
// =============================================================================

export default function Venue() {
  const [mainTab, setMainTab] = useState('venue')

  return (
    <div style={S.page}>
      <div style={styles.banner}>
        <h2 style={styles.bannerTitle}>Get Around</h2>
        <p style={styles.bannerSub}>The Fairmont · San Francisco</p>
      </div>

      <div style={styles.tabs}>
        <TabButton active={mainTab === 'venue'} onClick={() => setMainTab('venue')} label="Venue Guide" />
        <TabButton active={mainTab === 'explore'} onClick={() => setMainTab('explore')} label="Explore SF" />
      </div>

      <div style={{ padding: '4px 20px 32px' }}>
        {mainTab === 'venue' && <VenueGuide />}
        {mainTab === 'explore' && <ExploreSF />}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tabButton,
        color: active ? '#fff' : C.textFade,
        background: active ? C.navy : 'transparent',
      }}
    >
      {label}
    </button>
  )
}

// =============================================================================
// Venue Guide
// =============================================================================

function parseTime(str) {
  if (!str) return null
  const [time, period] = str.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function findLiveHubRooms() {
  const now = new Date()
  const today = days.find(d => d.date === now.toISOString().slice(0, 10))
  if (!today) return {}
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const live = {}
  for (const s of today.sessions) {
    const start = parseTime(s.time)
    const end = parseTime(s.end)
    if (start == null || end == null) continue
    if (nowMin >= start && nowMin < end) {
      const text = (s.location || '').toLowerCase()
      const roomNames = ['gold', 'green', 'garden', 'empire', 'crystal', 'fountain']
      for (const r of roomNames) {
        if (new RegExp(`\\b${r}\\b`).test(text)) {
          live[r] = s.title
        }
      }
    }
  }
  return live
}

function VenueGuide() {
  const [liveRooms, setLiveRooms] = useState(findLiveHubRooms)

  useEffect(() => {
    const id = setInterval(() => setLiveRooms(findLiveHubRooms()), 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      {/* UP — thin row */}
      <FloorMarker label="UP" sub="Above Lobby" rooms={upRooms} />
      <Connector direction="down" />

      {/* HUB — floor plan image as the visual anchor */}
      <div style={styles.floorCard}>
        <div style={styles.floorBadge}>
          <span style={styles.youHereDot} />
          You are here · Lobby Level
        </div>
        <img
          src="/lobby-floorplan.jpg"
          alt="Fairmont Lobby Level floor plan showing key rooms"
          style={styles.floorImage}
          loading="lazy"
        />
        <p style={styles.floorCaption}>Most sessions happen on this level.</p>
      </div>

      <Connector direction="down" />

      {/* DOWN */}
      <FloorMarker label="DOWN" sub="Below Lobby" rooms={downRooms} />

      {/* Hub room reference */}
      <h3 style={styles.sectionTitle}>Where things happen</h3>
      <div style={styles.roomGrid}>
        {hubRooms.map(r => {
          const live = liveRooms[r.id]
          return (
            <div
              key={r.id}
              style={{
                ...styles.roomCard,
                borderColor: live ? C.yellow : C.border,
                background: live ? '#FFFCEC' : C.card,
              }}
            >
              <div style={styles.roomCardName}>{r.name}</div>
              {live ? (
                <div style={styles.roomCardLive}>
                  <span style={styles.liveDot} />
                  <span style={styles.liveText}>{live}</span>
                </div>
              ) : (
                <div style={styles.roomCardPurpose}>{r.purpose}</div>
              )}
            </div>
          )
        })}
      </div>

      <p style={styles.footerNote}>
        All hub rooms are on the same level. Pavilion is one floor up; Tonga Room is on the Terrace Level, two floors down.
      </p>
    </div>
  )
}

function FloorMarker({ label, sub, rooms }) {
  return (
    <div style={styles.floorRow}>
      <div style={styles.floorRowHeader}>
        <span style={styles.floorRowLabel}>{label}</span>
        <span style={styles.floorRowSub}>{sub}</span>
      </div>
      <div style={styles.floorRowRooms}>
        {rooms.map((r, i) => (
          <div key={i} style={styles.floorRowRoom}>
            <span style={styles.floorRowRoomName}>{r.name}</span>
            <span style={styles.floorRowRoomDetail}>{r.detail}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Connector({ direction }) {
  return (
    <div style={styles.connector}>
      <span style={styles.connectorArrow}>{direction === 'down' ? '↓' : '↑'}</span>
    </div>
  )
}

// =============================================================================
// Explore SF
// =============================================================================

function GroupSheet({ group, onClose }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.sheet} onClick={e => e.stopPropagation()}>
        <div style={S.sheetHandle} />
        <div style={{ paddingTop: 4 }}>
          <h3 style={{ ...S.h2, marginBottom: 4 }}>{group.title}</h3>
          <p style={{ ...S.caption, marginBottom: 16 }}>{group.items.length} places</p>
          <div>
            {group.items.map((item, i) => <PickCard key={i} item={item} />)}
          </div>
          <button onClick={onClose} style={{ ...S.btnSecondary, width: '100%', marginTop: 16 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function PickCard({ item }) {
  return (
    <a
      href={mapsUrl(`${item.name} San Francisco`)}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.pickCard}
    >
      <div style={styles.pickHeader}>
        <div style={styles.pickName}>{item.name}</div>
        {item.tag && <span style={styles.pickTag}>{item.tag}</span>}
      </div>
      <div style={styles.pickDetail}>{item.detail}</div>
      <div style={styles.pickDirections}>Get directions →</div>
    </a>
  )
}

function ExploreSF() {
  const order = ['eat', 'drinks', 'coffee', 'see']
  const [active, setActive] = useState('eat')
  const [openGroup, setOpenGroup] = useState(null)
  const current = sfPicks[active]

  return (
    <div>
      {/* Map of the Fairmont area */}
      <div style={styles.mapEmbedWrap}>
        <iframe
          title="Fairmont San Francisco neighborhood map"
          src="https://www.google.com/maps?q=Fairmont+San+Francisco,+950+Mason+St&z=15&output=embed"
          style={styles.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          href={mapsUrl('Fairmont San Francisco, 950 Mason St')}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.mapEmbedLink}
        >
          Open in Maps →
        </a>
      </div>

      <div style={styles.chips}>
        {order.map(id => (
          <button
            key={id}
            onClick={() => setActive(id)}
            style={{
              ...styles.chip,
              background: active === id ? C.lavender + '24' : C.card,
              borderColor: active === id ? C.lavender : C.border,
              color: active === id ? C.text : C.textFade,
            }}
          >
            {sfPicks[id].label}
          </button>
        ))}
      </div>

      <div style={styles.sectionIntroWrap}>
        <h3 style={styles.sectionIntroTitle}>{current.label}</h3>
        <p style={styles.sectionIntroSub}>{current.intro}</p>
      </div>

      <div>
        {current.groups ? (
          current.groups.map((g, gi) => (
            <button
              key={gi}
              onClick={() => setOpenGroup(g)}
              style={styles.groupCard}
            >
              <div style={styles.groupCardContent}>
                <div style={styles.groupCardTitle}>{g.title}</div>
                <div style={styles.groupCardPreview}>
                  {g.items.slice(0, 3).map(it => it.name).join(' · ')}
                  {g.items.length > 3 && ` · +${g.items.length - 3} more`}
                </div>
                <div style={styles.groupCardCount}>{g.items.length} places</div>
              </div>
              <span style={styles.groupCardChevron}>›</span>
            </button>
          ))
        ) : (
          current.items.map((item, i) => <PickCard key={i} item={item} />)
        )}
        <p style={styles.exploreNote}>
          Picks curated for the Fairmont area. Have a favorite missing? Tell an organizer.
        </p>
      </div>

      {openGroup && (
        <GroupSheet group={openGroup} onClose={() => setOpenGroup(null)} />
      )}
    </div>
  )
}

// =============================================================================
// Styles
// =============================================================================

const styles = {
  banner: {
    background: C.navy,
    color: '#fff',
    padding: '16px 20px 14px',
  },
  bannerTitle: {
    fontFamily: F.serif,
    fontSize: 24,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  bannerSub: {
    fontFamily: F.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    margin: '3px 0 0',
    letterSpacing: '0.02em',
  },
  tabs: {
    display: 'flex',
    gap: 8,
    padding: '12px 20px 12px',
    background: C.bg,
  },
  tabButton: {
    flex: 1,
    padding: '10px 14px',
    border: 'none',
    borderRadius: 999,
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'all 0.15s',
  },
  // Floor marker rows (UP / DOWN)
  floorRow: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: '12px 14px',
  },
  floorRowHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
  },
  floorRowLabel: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.18em',
    color: C.navy,
  },
  floorRowSub: {
    fontFamily: F.sans,
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: '0.04em',
  },
  floorRowRooms: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  floorRowRoom: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  floorRowRoomName: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 600,
    color: C.text,
  },
  floorRowRoomDetail: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.textFade,
  },
  // Floor plan image (HUB / lobby)
  floorCard: {
    background: '#FFFCF4',
    border: `2px solid ${C.lavender}`,
    borderRadius: 18,
    padding: 14,
    boxShadow: `0 4px 16px ${C.lavender}22`,
  },
  floorBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: C.navy,
    background: C.lavender + '24',
    padding: '6px 12px',
    borderRadius: 999,
    marginBottom: 12,
  },
  youHereDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    background: C.lavender,
  },
  floorImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: 10,
  },
  floorCaption: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.textFade,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Connector between floors
  connector: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4px 0',
  },
  connectorArrow: {
    fontFamily: F.sans,
    fontSize: 18,
    color: C.textMuted,
    fontWeight: 600,
  },
  // Hub room grid
  sectionTitle: {
    fontFamily: F.serif,
    fontSize: 18,
    fontWeight: 600,
    color: C.text,
    marginTop: 24,
    marginBottom: 12,
  },
  roomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
  },
  roomCard: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: '12px 14px',
  },
  roomCardName: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 700,
    color: C.text,
  },
  roomCardPurpose: {
    fontFamily: F.sans,
    fontSize: 11,
    color: C.textFade,
    marginTop: 3,
    lineHeight: 1.4,
  },
  roomCardLive: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    background: '#E74C3C',
    flexShrink: 0,
    animation: 'pulse 2s infinite',
  },
  liveText: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 600,
    color: C.dark,
  },
  footerNote: {
    fontFamily: F.sans,
    fontSize: 11,
    color: C.textMuted,
    marginTop: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  // Explore SF
  mapEmbedWrap: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    border: `1px solid ${C.border}`,
    marginBottom: 16,
    background: C.bg,
  },
  mapEmbed: {
    width: '100%',
    height: '100%',
    border: 0,
    display: 'block',
  },
  mapEmbedLink: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    background: '#fff',
    color: C.navy,
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: 999,
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    border: `1px solid ${C.border}`,
  },
  sectionIntroWrap: {
    margin: '6px 0 12px',
  },
  groupHeader: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.16em',
    color: C.textFade,
    textTransform: 'uppercase',
    margin: '4px 4px 8px',
  },
  groupCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '16px 18px',
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    cursor: 'pointer',
    textAlign: 'left',
    marginTop: 10,
  },
  groupCardContent: {
    flex: 1,
    minWidth: 0,
  },
  groupCardTitle: {
    fontFamily: F.serif,
    fontSize: 18,
    fontWeight: 600,
    color: C.text,
    lineHeight: 1.25,
  },
  groupCardPreview: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.textFade,
    marginTop: 6,
    lineHeight: 1.45,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  groupCardCount: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 600,
    color: C.lavender,
    marginTop: 6,
    letterSpacing: '0.04em',
  },
  groupCardChevron: {
    fontFamily: F.sans,
    fontSize: 24,
    fontWeight: 300,
    color: C.textMuted,
    flexShrink: 0,
  },
  sectionIntroTitle: {
    fontFamily: F.serif,
    fontSize: 22,
    fontWeight: 600,
    color: C.text,
    margin: 0,
    fontStyle: 'italic',
  },
  sectionIntroSub: {
    fontFamily: F.sans,
    fontSize: 13,
    color: C.textFade,
    margin: '4px 0 0',
    lineHeight: 1.45,
  },
  chips: {
    display: 'flex',
    gap: 8,
    paddingBottom: 12,
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  chip: {
    padding: '8px 14px',
    borderRadius: 999,
    border: `1px solid ${C.border}`,
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    background: C.card,
  },
  pickCard: {
    display: 'block',
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
  },
  pickDirections: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 600,
    color: C.lavender,
    marginTop: 10,
    letterSpacing: '0.02em',
  },
  pickHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  pickName: {
    fontFamily: F.serif,
    fontSize: 17,
    fontWeight: 600,
    color: C.text,
    lineHeight: 1.25,
  },
  pickTag: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 600,
    color: C.navy,
    background: C.lavender + '24',
    padding: '4px 9px',
    borderRadius: 999,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    letterSpacing: '0.02em',
  },
  pickDetail: {
    fontFamily: F.sans,
    fontSize: 13,
    color: C.textFade,
    lineHeight: 1.5,
  },
  exploreNote: {
    fontFamily: F.sans,
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
    marginTop: 18,
    fontStyle: 'italic',
  },
}
