import { useState } from 'react'
import { C, F, S } from '../theme'

// Placeholder directory — will be replaced with Supabase data
const directory = [
  { id: 1, name: 'Gabriella Pellagatti', title: 'Content & Marketing', team: 'Marketing' },
  { id: 2, name: 'Vivian Bui', title: 'Content & Marketing', team: 'Marketing' },
  { id: 3, name: 'Denelle Dixon', title: 'CEO', team: 'Leadership' },
  { id: 4, name: 'Lisa Macnew', title: 'Operations', team: 'Operations' },
  { id: 5, name: 'Tomer Weller', title: 'Engineering', team: 'Engineering' },
  { id: 6, name: 'Nicole Martinez', title: 'Product', team: 'Product' },
  { id: 7, name: 'Jose Luu', title: 'Engineering', team: 'Engineering' },
  { id: 8, name: 'Nick Garcia', title: 'Engineering', team: 'Engineering' },
  { id: 9, name: 'Nico Barry', title: 'Engineering', team: 'Engineering' },
  { id: 10, name: 'Destinee Agard', title: 'People', team: 'People' },
]

export default function NamePicker({ onSelect }) {
  const [search, setSearch] = useState('')

  const filtered = directory.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.team.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        {/* Brand */}
        <div style={styles.brandBlock}>
          <div style={styles.brandLabel}>SDF CONNECT</div>
          <h1 style={styles.brandTitle}>Accelerate</h1>
          <p style={styles.brandSub}>May 18–22, 2026 · Fairmont San Francisco</p>
        </div>

        {/* Picker */}
        <div style={styles.pickerCard}>
          <p style={styles.pickerLabel}>Who are you?</p>
          <input
            type="text"
            placeholder="Search your name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.input}
            autoFocus
          />
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
                  <div style={styles.personTitle}>{person.title} · {person.team}</div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
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
    maxWidth: 400,
    width: '100%',
  },
  brandBlock: {
    textAlign: 'center',
    marginBottom: 40,
  },
  brandLabel: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.16em',
    color: C.yellow,
    marginBottom: 8,
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
  list: {
    maxHeight: 320,
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
