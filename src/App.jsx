import { useState, useEffect } from 'react'
import { C, F, S } from './theme'
import { supabase } from './lib/supabase'
import Home from './components/Home'
import Schedule from './components/Schedule'
import People from './components/People'
import Engage from './components/Engage'
import Venue from './components/Venue'
import NamePicker from './components/NamePicker'
import Onboarding from './components/Onboarding'

const tabs = [
  { id: 'home', label: 'Home', icon: '◆' },
  { id: 'schedule', label: 'Schedule', icon: '▦' },
  { id: 'engage', label: 'Engage', icon: '✦' },
  { id: 'venue', label: 'Get Around', icon: '⌖' },
  { id: 'people', label: 'People', icon: '●●' },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileChecked, setProfileChecked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showEditProfile, setShowEditProfile] = useState(false)

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

  const screen = {
    home: <Home user={user} profile={profile} onNavigate={setTab} />,
    schedule: <Schedule onNavigate={setTab} />,
    people: <People currentUser={user} currentProfile={profile} onSignOut={handleSignOut} onEditProfile={() => setShowEditProfile(true)} />,
    engage: <Engage user={user} />,
    venue: <Venue />,
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
            onClick={() => setTab('people')}
            title={user.name}
            aria-label="Open People"
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
            <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
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
