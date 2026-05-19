import { useState } from 'react'
import { C, F } from '../theme'

// Shared retreat password. Same as Wi-Fi for convenience.
// Client-side only — not real security, just a soft gate against random URL discovery.
const APP_PASSWORD = 'ultimate-supreme-connect'

export default function PasswordGate({ onUnlock }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const normalized = pw.trim().toLowerCase()
    if (normalized === APP_PASSWORD) {
      try { localStorage.setItem('sdf-connect-authed', '1') } catch {}
      onUnlock?.()
    } else {
      setError(true)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        <div style={styles.brandBlock}>
          <img src="/logo-white.png" alt="SDF Connect" style={{ height: 40, marginBottom: 16 }} />
          <h1 style={styles.brandTitle}>Accelerate</h1>
          <p style={styles.brandSub}>May 18–22, 2026 · Fairmont San Francisco</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <p style={styles.label}>Enter the retreat password</p>
          <p style={styles.helper}>Same as the Fairmont Wi-Fi password.</p>
          <input
            type="text"
            placeholder="retreat password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(false) }}
            style={{ ...styles.input, borderColor: error ? '#ff6b6b' : C.darkBorder }}
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
          />
          {error && (
            <p style={styles.errorText}>That password doesn't match. Check with an organizer.</p>
          )}
          <button type="submit" disabled={!pw.trim()} style={styles.button}>
            Continue →
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: C.dark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  inner: {
    maxWidth: 420,
    width: '100%',
  },
  brandBlock: {
    textAlign: 'center',
    marginBottom: 40,
  },
  brandTitle: {
    fontFamily: F.serif,
    fontSize: 48,
    fontWeight: 600,
    color: '#fff',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  brandSub: {
    fontFamily: F.sans,
    fontSize: 13,
    color: '#888',
    letterSpacing: '0.02em',
  },
  card: {
    background: C.darkCard,
    borderRadius: 20,
    padding: 24,
    border: `1px solid ${C.darkBorder}`,
  },
  label: {
    fontFamily: F.serif,
    fontSize: 18,
    color: '#fff',
    margin: '0 0 6px',
  },
  helper: {
    fontFamily: F.sans,
    fontSize: 12,
    color: '#888',
    margin: '0 0 16px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: `1px solid ${C.darkBorder}`,
    background: '#111',
    color: '#fff',
    fontFamily: F.sans,
    fontSize: 15,
    outline: 'none',
    marginBottom: 8,
  },
  errorText: {
    fontFamily: F.sans,
    fontSize: 12,
    color: '#ff6b6b',
    margin: '0 0 12px',
  },
  button: {
    width: '100%',
    background: C.yellow,
    color: C.dark,
    border: 'none',
    borderRadius: 12,
    padding: '14px 16px',
    fontFamily: F.sans,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
    letterSpacing: '0.01em',
  },
}
