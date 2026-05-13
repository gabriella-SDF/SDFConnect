import { useEffect, useState, useMemo } from 'react'
import { C, F, S } from '../theme'
import { supabase } from '../lib/supabase'

const avatarColors = [C.navy, C.teal, C.lavender, '#E8A87C', '#85CDCA', '#C38D9E', C.yellow]
function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
function getAvatarColor(id) { return avatarColors[hashStr(String(id)) % avatarColors.length] }
function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function People({ currentUser, onSignOut }) {
  const [search, setSearch] = useState('')
  const [openTeams, setOpenTeams] = useState(new Set())
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error: dbError } = await supabase
        .from('employees')
        .select('id, first_name, last_name, department, email, title, location')
        .order('first_name', { ascending: true })
      if (cancelled) return
      if (dbError) {
        setError('Could not load directory.')
        setLoading(false)
        return
      }
      setEmployees(
        data.map(e => ({
          id: e.id,
          name: `${e.first_name} ${e.last_name}`,
          first_name: e.first_name,
          last_name: e.last_name,
          team: e.department || 'Other',
          title: e.title || '',
          email: e.email,
          location: e.location || '',
        }))
      )
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const teams = useMemo(() => {
    const grouped = new Map()
    for (const m of employees) {
      const t = m.team
      if (!grouped.has(t)) grouped.set(t, [])
      grouped.get(t).push(m)
    }
    return Array.from(grouped.entries())
      .map(([name, members]) => ({ name, members }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [employees])

  const toggleTeam = (name) => {
    setOpenTeams(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const searchResults = search
    ? employees.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.team.toLowerCase().includes(search.toLowerCase()) ||
        m.title.toLowerCase().includes(search.toLowerCase())
      )
    : null

  return (
    <div style={{ padding: '16px 20px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <h2 style={{ ...S.h2, marginBottom: 4 }}>People</h2>
          <p style={{ ...S.caption, marginBottom: 16 }}>
            {loading ? 'Loading…' : `${employees.length} team members`}
          </p>
        </div>
        {onSignOut && (
          <button
            onClick={() => {
              if (window.confirm('Sign out of SDF Connect?')) onSignOut()
            }}
            style={styles.signOut}
          >
            Sign out
          </button>
        )}
      </div>

      {error && <p style={{ ...S.caption, color: '#E74C3C', marginBottom: 12 }}>{error}</p>}

      <input
        type="text"
        placeholder="Search by name, team, or title..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={styles.search}
      />

      {searchResults && (
        <div>
          <p style={{ ...S.caption, marginBottom: 12 }}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </p>
          {searchResults.map(member => (
            <PersonRow
              key={member.id}
              member={member}
              subtitle={member.team}
              currentUser={currentUser}
              onSelect={setSelectedPerson}
            />
          ))}
          {searchResults.length === 0 && (
            <p style={{ ...S.caption, padding: 20, textAlign: 'center' }}>No one found.</p>
          )}
        </div>
      )}

      {!searchResults && !loading && teams.map(team => {
        const isOpen = openTeams.has(team.name)
        return (
          <div key={team.name} style={styles.teamSection}>
            <button onClick={() => toggleTeam(team.name)} style={styles.teamHeader}>
              <div style={styles.teamLeft}>
                <span style={{
                  ...styles.chevron,
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}>
                  ›
                </span>
                <span style={styles.teamName}>{team.name}</span>
              </div>
              <span style={styles.teamCount}>{team.members.length}</span>
            </button>

            {isOpen && (
              <div style={styles.teamMembers}>
                {team.members.map(member => (
                  <PersonRow
                    key={member.id}
                    member={member}
                    currentUser={currentUser}
                    onSelect={setSelectedPerson}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}

      {selectedPerson && (
        <div style={S.overlay} onClick={() => setSelectedPerson(null)}>
          <div style={S.sheet} onClick={e => e.stopPropagation()}>
            <div style={S.sheetHandle} />
            <div style={{ textAlign: 'center', paddingTop: 8 }}>
              <div style={{ ...styles.profileAvatar, background: getAvatarColor(selectedPerson.id) }}>
                {initials(selectedPerson.name)}
              </div>
              <h3 style={{ ...S.h2, marginTop: 12 }}>{selectedPerson.name}</h3>
              <p style={{ ...S.caption, marginTop: 4 }}>{selectedPerson.title}</p>
              <p style={{ ...S.caption, marginTop: 2, color: C.textMuted }}>
                {selectedPerson.team}{selectedPerson.location ? ` · ${selectedPerson.location}` : ''}
              </p>
            </div>

            <div style={{ marginTop: 24 }}>
              <a
                href={`mailto:${selectedPerson.email}`}
                style={{ ...S.btnPrimary, width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none' }}
              >
                Email {selectedPerson.first_name}
              </a>
            </div>

            <button
              onClick={() => setSelectedPerson(null)}
              style={{ ...S.btnSecondary, width: '100%', marginTop: 12 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PersonRow({ member, subtitle, currentUser, onSelect }) {
  const isYou = currentUser?.email === member.email
  return (
    <button onClick={() => onSelect(member)} style={styles.personRow}>
      <div style={{ ...styles.personAvatar, background: getAvatarColor(member.id) }}>
        {initials(member.name)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={styles.personName}>
          {member.name}
          {isYou && <span style={styles.youBadge}>You</span>}
        </div>
        <div style={styles.personTitle}>{subtitle || member.title}</div>
      </div>
      <span style={{ color: C.textMuted, fontSize: 18 }}>&rsaquo;</span>
    </button>
  )
}

const styles = {
  signOut: {
    background: 'none',
    border: `1px solid ${C.border}`,
    color: C.textFade,
    fontFamily: F.sans,
    fontSize: 12,
    padding: '6px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  search: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    background: C.card,
    color: C.text,
    fontFamily: F.sans,
    fontSize: 15,
    outline: 'none',
    marginBottom: 20,
  },
  teamSection: {
    marginBottom: 4,
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '14px 12px',
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    cursor: 'pointer',
    marginBottom: 4,
  },
  teamLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  chevron: {
    fontFamily: F.sans,
    fontSize: 22,
    fontWeight: 300,
    color: C.textFade,
    transition: 'transform 0.2s',
    lineHeight: 1,
    width: 16,
    textAlign: 'center',
  },
  teamName: {
    fontFamily: F.serif,
    fontSize: 16,
    fontWeight: 600,
    color: C.text,
  },
  teamCount: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.textMuted,
    background: C.bg,
    padding: '3px 10px',
    borderRadius: 10,
    fontWeight: 500,
  },
  teamMembers: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 4,
  },
  personRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '12px 12px',
    background: 'none',
    border: 'none',
    borderBottom: `1px solid ${C.border}`,
    cursor: 'pointer',
    textAlign: 'left',
  },
  personAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontSize: 14,
    fontWeight: 500,
    color: C.text,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  personTitle: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.textMuted,
    marginTop: 1,
  },
  youBadge: {
    fontFamily: F.sans,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: C.yellow,
    background: C.dark,
    padding: '2px 6px',
    borderRadius: 4,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: F.sans,
    fontSize: 24,
    fontWeight: 600,
    margin: '0 auto',
  },
}
