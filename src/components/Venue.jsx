import { useEffect, useState } from 'react'
import { C, F, S } from '../theme'
import { mapsUrl } from '../data/schedule'

// =============================================================================
// Data — easy to edit
// =============================================================================

const levels = [
  { id: 'lower', code: 'Arcade + Terrace', label: 'Lower Levels', sub: 'Arcade + Terrace',   image: '/level-lower.jpg', accent: '#B7ACE8' },
  { id: 'lobby', code: 'Floor 1',        label: 'Lobby',         sub: 'Main level',          image: '/level-lobby.jpg', accent: '#2C4F7C' },
  { id: 'upper', code: 'Floors 2 + 24', label: 'Upper Levels', sub: 'Mezzanine + Crown',  image: '/level-upper.jpg', accent: '#F4C842' },
]

// Where each room is at the Fairmont. Used to show a small location hint
// next to each room badge in the categorized "Where things happen" sections.
const roomLocations = {
  'Gold Room':        'Lobby · Left side',
  'Green Room':       'Lobby · Left of entrance',
  'Garden Room':      'Lobby · Left of entrance',
  'Empire Room':      'Lobby · Far left',
  'Crystal Room':     'Lobby · Back left',
  'Fountain Room':    'Lobby · Back, near Roof Garden',
  'Intersect I':      'Arcade · One floor down',
  'Intersect II':     'Arcade · One floor down',
  'Intersect I/II':   'Arcade · One floor down',
  'Diplomat Club':    'Arcade · One floor down',
  'Crown Room':       'Floor 24 · Top floor',
  'Pavilion':         'Lobby Level',
  'Fairmont Penthouse': 'Penthouse Level',
  'Tonga Room':       'Terrace Level · 2 floors down',
}

const venueSections = [
  {
    id: 'general',
    title: 'General Sessions',
    subtitle: 'All-team gatherings',
    accent: '#002E5D', // navy
    items: [
      { label: 'Kickoff, Roundtable, Awards', room: 'Gold Room' },
    ],
  },
  {
    id: 'teams',
    title: 'Team Time',
    subtitle: 'Thursday morning',
    accent: '#00A7B5', // teal
    items: [
      { label: 'Engineering',          room: 'Gold Room' },
      { label: 'Product',              room: 'Green Room' },
      { label: 'Legal & Policy',       room: 'Garden Room' },
      { label: 'Office of the CEO',    room: 'Empire Room' },
      { label: 'Business Development', room: 'Crystal Room' },
      { label: 'Growth',               room: 'Fountain Room' },
      { label: 'Marketing',            room: 'Diplomat Club' },
      { label: 'Finance & Operations', room: 'Intersect I/II' },
      { label: 'People',               room: 'Crown Room' },
    ],
  },
  {
    id: 'objectives',
    title: 'Objectives',
    subtitle: 'Tuesday 2 PM breakouts',
    accent: '#FDDA24', // yellow
    items: [
      { label: 'Ramp Recruitment',             room: 'Garden Room' },
      { label: 'RWA & DeFi',                   room: 'Gold Room' },
      { label: 'Application Velocity',         room: 'Green Room' },
      { label: 'What does success look like?', room: 'Crystal Room' },
      { label: 'Performance',                  room: 'Intersect II' },
      { label: 'Faster and Safe',              room: 'Intersect I' },
    ],
  },
  {
    id: 'food',
    title: 'Food & Beverages',
    accent: '#B7ACE8', // lavender
    items: [
      { label: 'Breakfast & Lunch',         room: 'Pavilion' },
      { label: 'Refreshments',              room: 'Empire Room' },
      { label: 'Welcome Happy Hour (Mon)',  room: 'Fairmont Penthouse' },
      { label: 'Closing Celebration (Thu)', room: 'Tonga Room' },
    ],
  },
  {
    id: 'other',
    title: 'Other Activities',
    accent: '#D6D2C4', // tan
    items: [
      { label: 'AI Hackathon (Wed)',        room: 'Crystal + Fountain' },
      { label: 'Quarterly Ascension (Tue)', room: 'Gold Room' },
      { label: 'GIVE Volunteering (Wed)',   room: 'Gold + Green + Garden' },
      { label: 'Barcade (Tue evening)',     room: '449 Powell St' },
    ],
  },
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
          { name: 'Galinette', detail: 'Cozy French. Good for a date-night feel.', tag: 'French · $$' },
          { name: 'Chez Maman East', detail: 'Beloved French bistro (Potrero Hill).', tag: 'French · $$' },
          { name: 'Chez Maman West', detail: 'Sister spot to Chez Maman East. Classic French bistro in Hayes Valley.', tag: 'French · $$' },
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
        title: 'Mexican & Latin',
        items: [
          { name: 'La Taqueria', detail: 'James Beard-winning Mission burrito spot. Classic SF.', tag: 'Mexican · $' },
          { name: 'Nopalito', detail: 'Regional Mexican done beautifully. Inner Sunset.', tag: 'Mexican · $$' },
          { name: 'Loló', detail: 'Creative Mexican on Valencia. Vibrant room, fun cocktails.', tag: 'Mexican · $$' },
          { name: 'El Farolito', detail: 'Late-night Mission burrito institution.', tag: 'Mexican · $' },
        ],
      },
      {
        title: 'Indian',
        items: [
          { name: 'Besharam', detail: 'Heena Patel\'s Gujarati-inspired menu in the Dogpatch. Highly acclaimed.', tag: 'Indian · $$$' },
          { name: 'Copra', detail: 'Coastal South Indian. Modern, refined. Pacific Heights.', tag: 'South Indian · $$$' },
          { name: 'Babu Ji', detail: 'Modern Indian with a strong cocktail program. Mission.', tag: 'Indian · $$$' },
          { name: 'August 1 Five', detail: 'Modern Indian in Hayes Valley. Vibey dinner spot.', tag: 'Indian · $$' },
        ],
      },
      {
        title: 'Thai',
        items: [
          { name: 'Nari', detail: 'Pim Techamuanvivit\'s modern Thai project. Japantown. Excellent cocktails.', tag: 'Thai · $$$' },
          { name: 'Farmhouse Kitchen Thai', detail: 'Photogenic, popular Thai with a strong menu. Mission.', tag: 'Thai · $$' },
          { name: 'Marnee Thai', detail: 'Long-running neighborhood favorite. Inner Sunset.', tag: 'Thai · $$' },
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
          { name: 'Golden Sardine', detail: 'Highly-rated cocktail bar. 4.9 stars on Google.', tag: 'Cocktail bar' },
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
          { name: 'Amelie', detail: 'French-leaning wine bar with over 100 wines by the glass.', tag: 'French' },
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
    label: 'Coffee & Matcha',
    intro: 'Local favorites: beans, pour-overs, and matcha.',
    items: [
      { name: 'Laurel Court Café', detail: 'Inside the Fairmont. Grab-and-go.', tag: 'In hotel' },
      { name: 'Saint Frank Coffee', detail: 'Russian Hill, minutes from the hotel. Serious coffee program.', tag: '~5-min walk' },
      { name: 'Andytown Coffee Roasters', detail: 'Outer Sunset roaster known for the Snowy Plover (espresso + tonic + cream).', tag: 'Local favorite' },
      { name: 'Sightglass Coffee', detail: 'SoMa flagship. Beautiful, light-filled space.', tag: 'Roaster' },
      { name: 'Ritual Coffee Roasters', detail: 'OG SF third-wave roaster. Hayes Valley + Mission.', tag: 'Classic SF' },
      { name: 'Stonemill Matcha', detail: 'Dedicated matcha café in the Mission. Ceremonial-grade.', tag: 'Matcha' },
      { name: 'Réveille Coffee Co.', detail: 'Reliable espresso on Polk St.', tag: 'Espresso' },
      { name: 'Sextant Coffee', detail: 'Single-origin, calm atmosphere, good pour-overs.', tag: 'Pour-over' },
      { name: 'Caffe Trieste', detail: 'North Beach classic. Beat-era history.', tag: 'Historic' },
    ],
  },
  see: {
    label: 'See',
    intro: 'Iconic SF, within reach of the hotel.',
    items: [
      { name: 'Powell-Hyde Cable Car', detail: 'Catch it at California St. The original SF moving postcard.', tag: 'Right outside' },
      { name: 'Chinatown', detail: 'Walk down Powell into the largest Chinatown outside Asia.', tag: '5-min walk' },
      { name: 'Coit Tower & Telegraph Hill', detail: 'Stairs up through gardens and parrots to a killer view.', tag: '20-min walk' },
      { name: 'Lombard Street', detail: 'The famous crooked block. Best viewed from the bottom looking up.', tag: '12-min walk' },
      { name: 'Ferry Building', detail: 'Food hall on the water. Cable car down California gets you there.', tag: 'Cable car' },
      { name: 'Russian Hill', detail: 'Quiet streets, hidden stairways, great views.', tag: '15-min walk' },
      { name: 'Alcatraz', detail: 'Book the ferry ahead (cityexperiences.com/alcatraz). Sells out.', tag: 'Book ahead' },
      { name: 'Painted Ladies / Alamo Square', detail: "The pastel Victorians you've seen on TV.", tag: 'Cab over' },
      { name: 'Golden Gate Bridge', detail: 'Walk or bike across. Start from the south pavilion.', tag: 'Half-day' },
    ],
  },
}

// =============================================================================
// Component
// =============================================================================

export default function Venue({ initialTab, onConsumeInitialTab }) {
  const [mainTab, setMainTab] = useState(initialTab || 'venue')

  useEffect(() => {
    if (initialTab) {
      setMainTab(initialTab)
      onConsumeInitialTab?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTab])

  return (
    <div style={S.page}>
      <div style={styles.pageHeader}>
        <p style={styles.pageIntro}>
          Find your way around the Fairmont and explore San Francisco.
        </p>
      </div>

      <div style={styles.tabs}>
        <TabButton active={mainTab === 'venue'} onClick={() => setMainTab('venue')} label="Venue Guide" />
        <TabButton active={mainTab === 'explore'} onClick={() => setMainTab('explore')} label="Explore SF" />
      </div>

      <div style={{ padding: '20px 20px 40px' }}>
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
        background: active ? C.dark : 'transparent',
        color: active ? C.yellow : C.textFade,
      }}
    >
      {label}
    </button>
  )
}

// =============================================================================
// Venue Guide
// =============================================================================

function VenueGuide() {
  const [activeLevel, setActiveLevel] = useState('lobby')
  const [openSection, setOpenSection] = useState(null)

  const level = levels.find(l => l.id === activeLevel) || levels[2]

  return (
    <div>
      {/* Level selector */}
      <div style={styles.levelTabs}>
        {levels.map(l => {
          const isActive = l.id === activeLevel
          return (
            <button
              key={l.id}
              onClick={() => setActiveLevel(l.id)}
              style={{
                ...styles.levelTab,
                color: isActive ? C.dark : C.textFade,
                borderBottom: isActive ? `2px solid ${C.dark}` : '2px solid transparent',
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {l.label}
            </button>
          )
        })}
      </div>

      {/* Selected level image — static, no zoom (mobile zoom overlay was unreliable). */}
      <div style={styles.venueMapCard}>
        <img
          src={level.image}
          alt={`${level.label} level floor plan`}
          style={styles.venueMapImage}
          loading="lazy"
        />
      </div>

      {/* Where things happen — categorized accordion */}
      <h3 style={styles.sectionTitle}>Where things happen</h3>
      <div style={styles.sectionList}>
        {venueSections.map(s => {
          const isOpen = openSection === s.id
          return (
            <div
              key={s.id}
              style={{
                ...styles.section,
                borderLeft: s.accent ? `4px solid ${s.accent}` : styles.section.borderLeft,
              }}
            >
              <button
                onClick={() => setOpenSection(isOpen ? null : s.id)}
                style={styles.sectionHeader}
                aria-expanded={isOpen}
              >
                <div style={styles.sectionHeaderLeft}>
                  <span style={styles.sectionHeaderTitle}>{s.title}</span>
                  {s.subtitle && <span style={styles.sectionHeaderSubtitle}>{s.subtitle}</span>}
                </div>
                <span style={styles.sectionChevron}>{isOpen ? '–' : '+'}</span>
              </button>
              {isOpen && (
                <div style={styles.sectionItems}>
                  {s.items.map((item, i) => (
                    <div
                      key={item.label}
                      style={{
                        ...styles.sectionRow,
                        borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
                      }}
                    >
                      <div style={styles.sectionRowLabel}>{item.label}</div>
                      <div style={styles.sectionRowRight}>
                        <span style={styles.sectionRoomBadge}>{item.room}</span>
                        {roomLocations[item.room] && (
                          <span style={styles.sectionRoomLocation}>{roomLocations[item.room]}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
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
  pageHeader: {
    padding: '32px 20px 4px',
    maxWidth: 720,
  },
  pageTitle: {
    fontFamily: F.serif,
    fontSize: 32,
    fontWeight: 600,
    color: C.text,
    margin: 0,
    letterSpacing: '-0.01em',
    lineHeight: 1.1,
  },
  pageIntro: {
    fontFamily: F.sans,
    fontSize: 14,
    color: C.textFade,
    margin: '8px 0 0',
    lineHeight: 1.5,
    maxWidth: 540,
  },
  tabs: {
    display: 'flex',
    gap: 6,
    padding: '12px 20px',
    background: C.bg,
    borderBottom: `1px solid ${C.border}`,
  },
  tabButton: {
    flex: 1,
    padding: '10px 8px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.01em',
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
  // Level tabs — minimal text tabs with dark underline on active
  levelTabs: {
    display: 'flex',
    gap: 24,
    padding: '4px 0 20px',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  levelTab: {
    padding: '6px 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: F.sans,
    fontSize: 14,
    letterSpacing: '0.005em',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s, border-color 0.15s',
  },
  levelBadge: {
    display: 'inline-block',
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#fff',
    padding: '5px 12px',
    borderRadius: 999,
    marginBottom: 12,
  },
  levelBadgeYou: {
    fontWeight: 500,
    opacity: 0.85,
    textTransform: 'none',
    letterSpacing: '0.02em',
  },
  zoomTitle: {
    position: 'absolute',
    top: 'calc(env(safe-area-inset-top) + 24px)',
    left: 20,
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
    zIndex: 510,
  },
  // Floor plan card (level-specific)
  venueMapCard: {
    display: 'block',
    width: '100%',
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: 16,
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  },
  youHerePill: {
    position: 'absolute',
    top: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: C.navy,
    color: '#fff',
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '5px 12px',
    borderRadius: 999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 2,
  },
  venueMapImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: 10,
    maxHeight: 720,
    objectFit: 'contain',
  },
  // Zoomable map viewer
  zoomOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.92)',
    zIndex: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  zoomScroll: {
    flex: 1,
    width: '100%',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    touchAction: 'pinch-zoom',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 20,
  },
  zoomImage: {
    width: '180%',
    maxWidth: 'none',
    height: 'auto',
    display: 'block',
    touchAction: 'pinch-zoom',
  },
  zoomClose: {
    position: 'absolute',
    top: 'calc(env(safe-area-inset-top) + 16px)',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    background: 'rgba(255,255,255,0.18)',
    border: '1px solid rgba(255,255,255,0.24)',
    color: '#fff',
    fontSize: 24,
    fontWeight: 300,
    cursor: 'pointer',
    zIndex: 510,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  zoomHint: {
    position: 'absolute',
    bottom: 'calc(env(safe-area-inset-bottom) + 16px)',
    left: 16,
    right: 16,
    fontFamily: F.sans,
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    letterSpacing: '0.02em',
  },
  // Floor plan image (HUB / lobby) — legacy, may remove
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
  sectionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  section: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'none',
    border: 'none',
    padding: '14px 16px',
    cursor: 'pointer',
    textAlign: 'left',
    color: 'inherit',
  },
  sectionHeaderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  sectionHeaderTitle: {
    fontFamily: F.sans,
    fontSize: 15,
    fontWeight: 600,
    color: C.text,
    letterSpacing: '-0.005em',
  },
  sectionHeaderSubtitle: {
    fontFamily: F.sans,
    fontSize: 11,
    color: C.textFade,
    letterSpacing: '0.01em',
  },
  sectionChevron: {
    fontFamily: F.sans,
    fontSize: 22,
    fontWeight: 300,
    color: C.textFade,
    lineHeight: 1,
    flexShrink: 0,
    marginLeft: 12,
  },
  sectionItems: {
    padding: '0 16px 14px',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 10,
    paddingBottom: 10,
    borderTop: `1px solid ${C.border}`,
  },
  sectionRowLabel: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    color: C.text,
    flex: 1,
    minWidth: 0,
    lineHeight: 1.35,
    paddingTop: 3,
  },
  sectionRowRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 3,
    flexShrink: 0,
  },
  sectionRoomBadge: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 700,
    color: C.navy,
    background: C.lavender + '22',
    padding: '5px 10px',
    borderRadius: 8,
    whiteSpace: 'nowrap',
  },
  sectionRoomLocation: {
    fontFamily: F.sans,
    fontSize: 10,
    color: C.textMuted,
    textAlign: 'right',
    letterSpacing: '0.01em',
  },
  breakoutsCard: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderLeft: `4px solid ${C.yellow}`,
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 20,
  },
  breakoutsKicker: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: C.dark,
    marginBottom: 12,
  },
  breakoutsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    columnGap: 18,
    rowGap: 8,
  },
  breakoutRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  breakoutTopic: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    color: C.text,
    lineHeight: 1.35,
    flex: 1,
    minWidth: 0,
  },
  breakoutRoom: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 700,
    color: C.navy,
    background: C.lavender + '22',
    padding: '5px 10px',
    borderRadius: 8,
    flexShrink: 0,
    whiteSpace: 'nowrap',
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
  roomCardWhere: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 600,
    color: C.lavender,
    marginTop: 3,
    letterSpacing: '0.02em',
  },
  roomCardPurpose: {
    fontFamily: F.sans,
    fontSize: 11,
    color: C.textFade,
    marginTop: 4,
    lineHeight: 1.4,
  },
  roomCardTeam: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 600,
    color: C.teal,
    marginTop: 4,
    letterSpacing: '0.01em',
  },
  otherTeamList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  teamRoomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: '12px 14px',
  },
  teamRoomTeam: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 600,
    color: C.text,
  },
  teamRoomWhere: {
    fontFamily: F.sans,
    fontSize: 11,
    color: C.textMuted,
    marginTop: 2,
  },
  teamRoomRoom: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 700,
    color: C.navy,
    background: C.lavender + '22',
    padding: '5px 10px',
    borderRadius: 8,
    flexShrink: 0,
    whiteSpace: 'nowrap',
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
