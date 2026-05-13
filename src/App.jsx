import { useState, useEffect } from 'react'
import { C, F, S } from './theme'
import { supabase } from './lib/supabase'
import Home from './components/Home'
import Schedule from './components/Schedule'
import People from './components/People'
import Engage from './components/Engage'
import Venue from './components/Venue'
import SignIn from './components/SignIn'

const tabs = [
  { id: 'home', label: 'Home', icon: '◆' },
  { id: 'schedule', label: 'Schedule', icon: '▦' },
  { id: 'engage', label: 'Engage', icon: '✦' },
  { id: 'venue', label: 'Get Around', icon: '⌖' },
  { id: 'people', label: 'People', icon: '●●' },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session?.user?.email) {
      setUser(null)
      return
    }
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, first_name, last_name, department, email, title, location')
        .eq('email', session.user.email.toLowerCase())
        .maybeSingle()
      if (cancelled) return
      if (error || !data) {
        setAuthError(
          `${session.user.email} isn't in the retreat directory yet. Please contact an organizer.`
        )
        await supabase.auth.signOut()
        return
      }
      setAuthError('')
      setUser({
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        first_name: data.first_name,
        last_name: data.last_name,
        title: data.title,
        team: data.department,
        email: data.email,
        location: data.location,
      })
    })()
    return () => { cancelled = true }
  }, [session])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setTab('home')
  }

  if (loading) {
    return <div style={{ ...S.container, background: C.dark }} />
  }

  if (!session || !user) {
    return (
      <>
        {authError && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            padding: '12px 20px', background: '#ff6b6b', color: '#fff',
            fontFamily: F.sans, fontSize: 13, textAlign: 'center', zIndex: 200,
          }}>
            {authError}
          </div>
        )}
        <SignIn />
      </>
    )
  }

  const screen = {
    home: <Home user={user} onNavigate={setTab} />,
    schedule: <Schedule onNavigate={setTab} />,
    people: <People currentUser={user} onSignOut={handleSignOut} />,
    engage: <Engage user={user} />,
    venue: <Venue />,
  }

  return (
    <div style={S.container}>
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
