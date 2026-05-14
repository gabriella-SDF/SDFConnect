import { useState, useEffect } from 'react'
import { C, F, S } from './theme'
import { supabase } from './lib/supabase'
import { contacts } from './data/schedule'
import Home from './components/Home'
import Schedule from './components/Schedule'
import People from './components/People'
import Engage from './components/Engage'
import Venue from './components/Venue'
import NamePicker from './components/NamePicker'
import Onboarding from './components/Onboarding'

function IconSchedule() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  )
}
function IconEngage() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 0 1 12.5 3a8.4 8.4 0 0 1 8.5 8.4z" />
    </svg>
  )
}
function IconBridge() {
  // Golden Gate Bridge silhouette — two towers, cables, deck
  return (
    <svg width="24" height="22" viewBox="0 0 26 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="18" x2="24" y2="18" />
      <line x1="6" y1="18" x2="6" y2="3" />
      <line x1="20" y1="18" x2="20" y2="3" />
      <path d="M2 14 Q13 7 24 14" />
      <line x1="13" y1="10" x2="13" y2="18" strokeWidth="1.2" />
    </svg>
  )
}
function IconCableCar() {
  // Cable car body with wheels
  return (
    <svg width="24" height="22" viewBox="0 0 26 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="18" height="11" rx="1.5" />
      <line x1="4" y1="10" x2="22" y2="10" />
      <line x1="10" y1="5" x2="10" y2="10" />
      <line x1="16" y1="5" x2="16" y2="10" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="18" cy="18" r="1.5" />
    </svg>
  )
}
function IconPeople() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" />
      <circle cx="17" cy="9.5" r="2.3" />
      <path d="M14.5 20c.5-2 2-3.5 4.5-3.5s3.5 1.5 4 3.5" strokeOpacity="0.85" />
    </svg>
  )
}

const tabs = [
  { id: 'engage', label: 'Engage', Icon: IconEngage },
  { id: 'venue', label: 'Get Around', Icon: IconCableCar },
  { id: 'home', label: 'Home', Icon: IconBridge },
  { id: 'schedule', label: 'Schedule', Icon: IconSchedule },
  { id: 'people', label: 'People', Icon: IconPeople },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileChecked, setProfileChecked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showMyProfile, setShowMyProfile] = useState(false)
  const [openPersonId, setOpenPersonId] = useState(null)
  const [venueInitialTab, setVenueInitialTab] = useState(null)

  // Restore the user from localStorage on first load.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sdf-connect-user')
      if (saved) setUser(JSON.parse(saved))
    } catch {}
    setLoading(false)
  }, [])

  // Whenever user changes, look up their profile.
  useEffect(() => {
    if (!user?.id) {
      setProfile(null)
      setProfileChecked(false)
      return
    }
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      if (cancelled) return
      setProfile(data || null)
      setProfileChecked(true)
    })()
    return () => { cancelled = true }
  }, [user?.id])

  const refetchProfile = async () => {
    if (!user?.id) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    setProfile(data || null)
  }

  const handleSelectUser = (person) => {
    setUser(person)
    localStorage.setItem('sdf-connect-user', JSON.stringify(person))
  }

  const handleSignOut = () => {
    localStorage.removeItem('sdf-connect-user')
    setUser(null)
    setProfile(null)
    setProfileChecked(false)
    setTab('home')
  }

  if (loading) {
    return <div style={{ ...S.container, background: C.dark }} />
  }

  if (!user) {
    return <NamePicker onSelect={handleSelectUser} />
  }

  // First-time users see the quiz before main app
  // (escape hatch: localStorage flag set by the "Continue anyway" button on save errors)
  const skipQuizLocally = (() => {
    try { return localStorage.getItem('sdf-skip-quiz') === '1' } catch { return false }
  })()
  if (profileChecked && (!profile || !profile.completed_at) && !skipQuizLocally) {
    return (
      <Onboarding
        user={user}
        session={{ user: { id: user.id, email: user.email } }}
        onComplete={() => { refetchProfile() }}
        onSkipAll={() => { refetchProfile() }}
      />
    )
  }

  const goToPerson = (personId) => {
    setOpenPersonId(personId)
    setTab('people')
  }
  const goToExploreSF = () => {
    setVenueInitialTab('explore')
    setTab('venue')
  }

  const screen = {
    home: <Home user={user} profile={profile} onNavigate={setTab} onOpenPerson={goToPerson} onGoExplore={goToExploreSF} />,
    schedule: <Schedule onNavigate={setTab} />,
    people: <People currentUser={user} currentProfile={profile} onSignOut={handleSignOut} onEditProfile={() => setShowEditProfile(true)} initialPersonId={openPersonId} onConsumeInitialPerson={() => setOpenPersonId(null)} />,
    engage: <Engage user={user} />,
    venue: <Venue initialTab={venueInitialTab} onConsumeInitialTab={() => setVenueInitialTab(null)} />,
  }

  return (
    <div style={S.container}>
      {showEditProfile && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: C.dark }}>
          <Onboarding
            user={user}
            session={{ user: { id: user.id, email: user.email } }}
            initialProfile={profile}
            isEditing
            onComplete={() => { refetchProfile(); setShowEditProfile(false) }}
            onSkipAll={() => { setShowEditProfile(false) }}
          />
        </div>
      )}

      {showMyProfile && (
        <MyProfileSheet
          user={user}
          profile={profile}
          onClose={() => setShowMyProfile(false)}
          onEdit={() => { setShowMyProfile(false); setShowEditProfile(true) }}
          onSignOut={() => {
            if (window.confirm('Sign out of SDF Connect?')) {
              setShowMyProfile(false)
              handleSignOut()
            }
          }}
        />
      )}
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button
            onClick={() => setTab('home')}
            style={styles.logoBtn}
            aria-label="Go to Home"
          >
            <img src="/logo-white.png" alt="SDF Connect" style={{ height: 28, display: 'block' }} />
          </button>
          <button
            type="button"
            style={styles.avatar}
            onClick={() => setShowMyProfile(true)}
            title={user.name}
            aria-label="My profile"
          >
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={S.page}>
        {screen[tab]}
      </main>

      {/* Bottom Nav */}
      <nav style={styles.nav}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              ...styles.navBtn,
              color: tab === t.id ? C.yellow : '#666',
              borderTop: tab === t.id ? `2px solid ${C.yellow}` : '2px solid transparent',
            }}
          >
            <span style={{ lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 24 }}>
              <t.Icon />
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function MyProfileSheet({ user, profile, onClose, onEdit, onSignOut }) {
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  const chips = profile ? [
    ...(profile.stellar_interests || []),
    ...(profile.most_yourself || []),
    ...(profile.thinking || []),
    profile.vacation,
  ].filter(Boolean) : []
  const hasProfile = !!profile?.completed_at

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.sheet} onClick={e => e.stopPropagation()}>
        <div style={S.sheetHandle} />
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={mp.avatar}>{initials}</div>
          <h3 style={{ ...S.h2, marginTop: 12 }}>{user.name}</h3>
          {user.location && (
            <p style={{ ...S.caption, marginTop: 4 }}>{user.location}</p>
          )}
        </div>

        {profile?.ask_me_about && (
          <div style={mp.askMe}>
            <div style={mp.kicker}>Ask me about</div>
            <div style={mp.askMeText}>{profile.ask_me_about}</div>
          </div>
        )}

        {profile?.best_rec && (
          <div style={mp.field}>
            <div style={mp.kicker}>Recent rec</div>
            <div style={mp.fieldText}>{profile.best_rec}</div>
          </div>
        )}

        {chips.length > 0 && (
          <div style={mp.field}>
            <div style={mp.kicker}>My interests</div>
            <div style={mp.chipRow}>
              {chips.map((c, i) => <span key={i} style={mp.chip}>{c}</span>)}
            </div>
          </div>
        )}

        {!hasProfile && (
          <p style={{ ...S.caption, textAlign: 'center', marginTop: 20, fontStyle: 'italic' }}>
            You haven't filled in your profile yet.
          </p>
        )}

        {/* Need help — quick-call contacts */}
        <div style={mp.field}>
          <div style={mp.kicker}>Need help? Tap to call</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {contacts.map((c, i) => (
              <a
                key={i}
                href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}
                style={mp.contactRow}
              >
                <span style={{ fontFamily: F.sans, fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</span>
                <span style={{ fontFamily: F.sans, fontSize: 12, color: C.teal, fontWeight: 600 }}>{c.phone}</span>
              </a>
            ))}
          </div>
        </div>

        <button onClick={onEdit} style={{ ...S.btnPrimary, width: '100%', marginTop: 24 }}>
          {hasProfile ? 'Edit my answers' : 'Fill out my profile'}
        </button>
        <button onClick={onSignOut} style={{ ...mp.signOut, marginTop: 10 }}>
          Sign out
        </button>
        <button onClick={onClose} style={{ ...S.btnSecondary, width: '100%', marginTop: 10 }}>
          Close
        </button>
      </div>
    </div>
  )
}

const mp = {
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    background: C.navy,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: F.sans,
    fontSize: 24,
    fontWeight: 600,
    margin: '0 auto',
    letterSpacing: '0.02em',
  },
  askMe: {
    background: `linear-gradient(135deg, ${C.navy}, ${C.teal})`,
    color: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  field: {
    marginTop: 16,
  },
  kicker: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.14em',
    color: C.lavender,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  askMeText: {
    fontFamily: F.serif,
    fontSize: 17,
    fontWeight: 500,
    fontStyle: 'italic',
    lineHeight: 1.4,
  },
  fieldText: {
    fontFamily: F.sans,
    fontSize: 14,
    color: C.text,
    lineHeight: 1.5,
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 500,
    color: C.text,
    background: C.bg,
    padding: '5px 10px',
    borderRadius: 999,
    border: `1px solid ${C.border}`,
  },
  signOut: {
    width: '100%',
    background: 'none',
    border: `1px solid ${C.border}`,
    color: C.textFade,
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    padding: '12px',
    borderRadius: 12,
    cursor: 'pointer',
  },
  contactRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    background: C.bg,
    borderRadius: 10,
    textDecoration: 'none',
  },
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: C.dark,
    borderBottom: `1px solid ${C.darkBorder}`,
    padding: '0 20px',
    paddingTop: 'env(safe-area-inset-top)',
  },
  headerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    maxWidth: 480,
    margin: '0 auto',
  },
  logo: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.14em',
    color: C.yellow,
  },
  tagline: {
    fontFamily: F.serif,
    fontSize: 11,
    fontStyle: 'italic',
    color: '#888',
    marginTop: -1,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    background: C.navy,
    color: '#fff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
  logoBtn: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    maxWidth: 480,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    background: C.dark,
    borderTop: `1px solid ${C.darkBorder}`,
    paddingBottom: 'env(safe-area-inset-bottom)',
    zIndex: 100,
  },
  navBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '10px 0 8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: F.sans,
    transition: 'color 0.15s',
  },
}
