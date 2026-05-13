import { useEffect, useMemo, useState } from 'react'
import { C, F, S } from '../theme'
import { supabase } from '../lib/supabase'

export default function NamePicker({ onSelect }) {
  const [search, setSearch] = useState('')
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error: dbError } = await supabase
        .from('employees')
        .select('id, first_name, last_name, department, email, location')
        .order('first_name', { ascending: true })
      if (cancelled) return
      if (dbError) {
        setError('Could not load directory. Try again in a moment.')
        setLoading(false)
        return
      }
      setEmployees(
        (data || []).map(e => ({
          id: e.id,
          name: `${e.first_name} ${e.last_name}`,
          first_name: e.first_name,
          last_name: e.last_name,
          team: e.department || 'Other',
          email: e.email,
          location: e.location || '',
        }))
      )
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    if (!search) return employees
    const q = search.toLowerCase()
    return employees.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.team && p.team.toLowerCase().includes(q))
    )
  }, [search, employees])

  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        <div style={styles.brandBlock}>
          <img src="/logo-white.png" alt="SDF Connect" style={{ height: 40, marginBottom: 16 }} />
          <h1 style={styles.brandTitle}>Accelerate</h1>
          <p style={styles.brandSub}>May 18–22, 2026 · Fairmont San Francisco</p>
        </div>

        <div style={styles.pickerCard}>
          <p style={styles.pickerLabel}>Who are you?</p>
          <input
            type="text"
            placeholder="Search your name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.input}
            autoFocus
            autoCapitalize="off"
            autoComplete="off"
          />

          {loading && <p style={styles.helper}>Loading directory…</p>}
          {error && <p style={{ ...styles.helper, color: '#ff6b6b' }}>{error}</p>}

          <div style={styles.list}>
            {filtered.map(person => (
              <button
                key={person.id}
                onClick={() => onSelect(person)}
                style={styles.personBtn}
              >
                <div style={styles.personAvatar}>
                  {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={styles.personName}>{person.name}</div>
                  <div style={styles.personTitle}>{person.location || person.team}</div>
                </div>
              </button>
            ))}
            {!loading && filtered.length === 0 && (
              <p style={{ ...S.caption, padding: 20, textAlign: 'center' }}>
                No one found. Check spelling or ask an organizer.
              </p>
            )}
          </div>
        </div>
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
  pickerCard: {
    background: C.darkCard,
    borderRadius: 20,
    padding: 24,
    border: `1px solid ${C.darkBorder}`,
  },
  pickerLabel: {
    fontFamily: F.serif,
    fontSize: 18,
    color: '#fff',
    marginBottom: 16,
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
  helper: {
    fontFamily: F.sans,
    fontSize: 13,
    color: '#999',
    padding: 16,
    textAlign: 'center',
  },
  list: {
    maxHeight: 360,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  personBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    padding: '12px 8px',
    background: 'none',
    border: 'none',
    borderBottom: `1px solid ${C.darkBorder}`,
    cursor: 'pointer',
    textAlign: 'left',
  },
  personAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    background: C.navy,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0,
  },
  personName: {
    fontFamily: F.sans,
    fontSize: 15,
    fontWeight: 500,
    color: '#fff',
  },
  personTitle: {
    fontFamily: F.sans,
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
}
