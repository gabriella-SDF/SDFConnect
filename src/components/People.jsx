import { useState } from 'react'
import { C, F, S } from '../theme'

// Placeholder — will come from Supabase
const teams = [
  { name: 'Leadership', members: [
    { id: 3, name: 'Denelle Dixon', title: 'CEO' },
  ]},
  { name: 'Engineering', members: [
    { id: 5, name: 'Tomer Weller', title: 'Engineering' },
    { id: 7, name: 'Jose Luu', title: 'Engineering' },
    { id: 8, name: 'Nick Garcia', title: 'Engineering' },
    { id: 9, name: 'Nico Barry', title: 'Engineering' },
  ]},
  { name: 'Product', members: [
    { id: 6, name: 'Nicole Martinez', title: 'Product' },
  ]},
  { name: 'Marketing', members: [
    { id: 1, name: 'Gabriella Pellagatti', title: 'Content & Marketing' },
    { id: 2, name: 'Vivian Bui', title: 'Content & Marketing' },
  ]},
  { name: 'Operations', members: [
    { id: 4, name: 'Lisa Macnew', title: 'Operations' },
  ]},
  { name: 'People', members: [
    { id: 10, name: 'Destinee Agard', title: 'People' },
  ]},
]

const avatarColors = [C.navy, C.teal, C.lavender, '#E8A87C', '#85CDCA', '#C38D9E', C.yellow]

function getAvatarColor(id) {
  return avatarColors[id % avatarColors.length]
}

export default function People({ currentUser }) {
  const [search, setSearch] = useState('')
  const [selectedPerson, setSelectedPerson] = useState(null)

  const allMembers = teams.flatMap(t => t.members.map(m => ({ ...m, team: t.name })))
  const filteredTeams = search
    ? [{ name: 'Results', members: allMembers.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.team.toLowerCase().includes(search.toLowerCase())
      )}]
    : teams

  return (
    <div style={{ padding: '16px 20px 40px' }}>
      <h2 style={{ ...S.h2, marginBottom: 4 }}>People</h2>
      <p style={{ ...S.caption, marginBottom: 16 }}>~160 team members across all departments</p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or team..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* Team Sections */}
      {filteredTeams.map(team => (
        <div key={team.name} style={{ marginBottom: 24 }}>
          <div style={styles.teamHeader}>
            <span style={styles.teamName}>{team.name}</span>
            <span style={styles.teamCount}>{team.members.length}</span>
          </div>
          <div style={styles.memberGrid}>
            {team.members.map(member => (
              <button
                key={member.id}
                onClick={() => setSelectedPerson(member)}
                style={styles.memberCard}
              >
                <div style={{ ...styles.memberAvatar, background: getAvatarColor(member.id) }}>
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={styles.memberName}>{member.name}</div>
                <div style={styles.memberTitle}>{member.title}</div>
                {member.id === currentUser.id && (
                  <div style={styles.youBadge}>You</div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Profile Sheet */}
      {selectedPerson && (
        <div style={S.overlay} onClick={() => setSelectedPerson(null)}>
          <div style={S.sheet} onClick={e => e.stopPropagation()}>
            <div style={S.sheetHandle} />
            <div style={{ textAlign: 'center', paddingTop: 8 }}>
              <div style={{ ...styles.profileAvatar, background: getAvatarColor(selectedPerson.id) }}>
                {selectedPerson.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <h3 style={{ ...S.h2, marginTop: 12 }}>{selectedPerson.name}</h3>
              <p style={{ ...S.caption, marginTop: 4 }}>{selectedPerson.title}</p>
            </div>

            {/* Profile Questions — placeholder until Supabase */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { q: 'What are you working on?', a: 'Profile answers will be loaded from the database.' },
                { q: 'What are you reading?', a: '—' },
                { q: 'Fun fact', a: '—' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ ...S.label, marginBottom: 6, color: C.teal }}>{item.q}</div>
                  <div style={S.body}>{item.a}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedPerson(null)}
              style={{ ...S.btnSecondary, width: '100%', marginTop: 24 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
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
    marginBottom: 24,
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    background: C.border,
    padding: '2px 8px',
    borderRadius: 8,
  },
  memberGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  memberCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 14,
    background: C.card,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    cursor: 'pointer',
    position: 'relative',
    textAlign: 'center',
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
  memberName: {
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 500,
    color: C.text,
    lineHeight: 1.3,
  },
  memberTitle: {
    fontFamily: F.sans,
    fontSize: 10,
    color: C.textMuted,
    marginTop: 2,
  },
  youBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    fontFamily: F.sans,
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: '0.06em',
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
