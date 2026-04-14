import { useState, useEffect } from 'react'
import { C, F, S } from './theme'
import Home from './components/Home'
import Schedule from './components/Schedule'
import People from './components/People'
import Engage from './components/Engage'
import Venue from './components/Venue'
import NamePicker from './components/NamePicker'

const tabs = [
  { id: 'home', label: 'Home', icon: '◆' },
  { id: 'schedule', label: 'Schedule', icon: '▦' },
  { id: 'people', label: 'People', icon: '●●' },
  { id: 'engage', label: 'Engage', icon: '✦' },
  { id: 'venue', label: 'Venue', icon: '⌖' },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('sdf-connect-user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleSelectUser = (person) => {
    setUser(person)
    localStorage.setItem('sdf-connect-user', JSON.stringify(person))
  }

  if (!user) {
    return <NamePicker onSelect={handleSelectUser} />
  }

  const screen = {
    home: <Home user={user} onNavigate={setTab} />,
    schedule: <Schedule />,
    people: <People currentUser={user} />,
    engage: <Engage user={user} />,
    venue: <Venue />,
  }

  return (
    <div style={S.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <img src="/logo-white.png" alt="SDF Connect" style={{ height: 28 }} />
          <div
            style={styles.avatar}
            onClick={() => setTab('people')}
            title={user.name}
          >
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
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
