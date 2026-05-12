import { useState } from 'react'
import { C, F, S } from '../theme'
import { supabase } from '../lib/supabase'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [stage, setStage] = useState('input') // 'input' | 'sent'
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const trimmed = email.trim().toLowerCase()
    setError('')
    if (!trimmed) return
    if (!trimmed.endsWith('@stellar.org')) {
      setError('Please use your @stellar.org email.')
      return
    }
    setSubmitting(true)
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: window.location.origin,
        shouldCreateUser: true,
      },
    })
    setSubmitting(false)
    if (authError) {
      setError(authError.message || 'Could not send link. Please try again.')
      return
    }
    setStage('sent')
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        <div style={styles.brandBlock}>
          <img src="/logo-white.png" alt="SDF Connect" style={{ height: 40, marginBottom: 16 }} />
          <h1 style={styles.brandTitle}>Accelerate</h1>
          <p style={styles.brandSub}>May 18–22, 2026 · Fairmont San Francisco</p>
        </div>

        {stage === 'input' && (
          <form onSubmit={handleSubmit} style={styles.card}>
            <p style={styles.label}>Sign in</p>
            <p style={styles.helper}>
              Enter your @stellar.org email — we'll send you a one-tap sign-in link.
            </p>
            <input
              type="email"
              placeholder="you@stellar.org"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              autoFocus
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button
              type="submit"
              disabled={submitting || !email.trim()}
              style={{
                ...styles.button,
                opacity: submitting || !email.trim() ? 0.5 : 1,
              }}
            >
              {submitting ? 'Sending…' : 'Send sign-in link'}
            </button>
          </form>
        )}

        {stage === 'sent' && (
          <div style={styles.card}>
            <div style={styles.checkIcon}>✓</div>
            <p style={styles.label}>Check your email</p>
            <p style={styles.helper}>
              We sent a sign-in link to <strong style={{ color: '#fff' }}>{email.trim().toLowerCase()}</strong>.
              Tap it from your phone to open the app — you'll stay signed in after that.
            </p>
            <button
              type="button"
              onClick={() => { setStage('input'); setError('') }}
              style={styles.linkButton}
            >
              Use a different email
            </button>
          </div>
        )}
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
    maxWidth: 400,
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
    padding: 28,
    border: `1px solid ${C.darkBorder}`,
  },
  label: {
    fontFamily: F.serif,
    fontSize: 22,
    color: '#fff',
    marginBottom: 8,
  },
  helper: {
    fontFamily: F.sans,
    fontSize: 14,
    color: '#999',
    lineHeight: 1.5,
    marginBottom: 20,
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
    marginBottom: 12,
  },
  error: {
    fontFamily: F.sans,
    fontSize: 13,
    color: '#ff6b6b',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: 'none',
    background: C.yellow,
    color: C.dark,
    fontFamily: F.sans,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: C.yellow,
    fontFamily: F.sans,
    fontSize: 13,
    cursor: 'pointer',
    padding: '8px 0 0',
    textDecoration: 'underline',
  },
  checkIcon: {
    fontFamily: F.sans,
    fontSize: 32,
    color: C.yellow,
    marginBottom: 12,
  },
}
