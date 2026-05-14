import React from 'react'
import { C, F } from '../theme'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info)
  }

  handleReload = () => {
    try {
      // Don't wipe their identity; just clear quiz/skip flags and reload.
      // If something corrupt in localStorage caused the crash, give them a way out.
      localStorage.removeItem('sdf-skip-quiz')
    } catch {}
    window.location.reload()
  }

  handleHardReset = () => {
    try {
      localStorage.removeItem('sdf-connect-user')
      localStorage.removeItem('sdf-skip-quiz')
      localStorage.removeItem('sdf-quiz-answers')
    } catch {}
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.icon}>⚠</div>
          <h2 style={styles.title}>Something went wrong</h2>
          <p style={styles.msg}>
            The app hit an unexpected error. Try reloading. If it keeps happening,
            tap "Start fresh" to clear local data and sign in again.
          </p>
          <button onClick={this.handleReload} style={styles.btnPrimary}>Reload</button>
          <button onClick={this.handleHardReset} style={styles.btnSecondary}>Start fresh</button>
        </div>
      </div>
    )
  }
}

const styles = {
  wrap: {
    minHeight: '100vh',
    background: C.dark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    maxWidth: 380,
    width: '100%',
    background: '#1A1A1A',
    border: '1px solid #2A2A2A',
    borderRadius: 18,
    padding: 28,
    textAlign: 'center',
  },
  icon: {
    fontSize: 36,
    marginBottom: 12,
  },
  title: {
    fontFamily: F.serif,
    fontSize: 22,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 8,
  },
  msg: {
    fontFamily: F.sans,
    fontSize: 14,
    color: '#bbb',
    lineHeight: 1.5,
    marginBottom: 20,
  },
  btnPrimary: {
    display: 'block',
    width: '100%',
    padding: '12px',
    borderRadius: 12,
    border: 'none',
    background: '#FDDA24',
    color: '#0F0F0F',
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: 8,
  },
  btnSecondary: {
    display: 'block',
    width: '100%',
    padding: '12px',
    borderRadius: 12,
    border: '1px solid #2A2A2A',
    background: 'transparent',
    color: '#aaa',
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  },
}
