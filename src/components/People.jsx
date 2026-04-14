import { useState } from 'react'
import { C, F, S } from '../theme'

// Placeholder — will come from Supabase
// `role: 'lead'` marks the team lead, shown at top with hierarchy indent for others
const teams = [
  { name: 'Leadership', members: [
    { id: 3, name: 'Denelle Dixon', title: 'CEO & Executive Director', role: 'lead' },
  ]},
  { name: 'Engineering', members: [
    { id: 5, name: 'Tomer Weller', title: 'VP Engineering', role: 'lead' },
    { id: 7, name: 'Jose Luu', title: 'Engineering' },
    { id: 8, name: 'Nick Garcia', title: 'Engineering' },
    { id: 9, name: 'Nico Barry', title: 'CTO', role: 'lead' },
  ]},
  { name: 'Product', members: [
    { id: 6, name: 'Nicole Martinez', title: 'Product Lead', role: 'lead' },
  ]},
  { name: 'Marketing', members: [
    { id: 1, name: 'Gabriella Pellagatti', title: 'Content & Marketing' },
    { id: 2, name: 'Vivian Bui', title: 'Content & Marketing' },
  ]},
  { name: 'Operations', members: [
    { id: 4, name: 'Lisa Macnew', title: 'Head of Operations', role: 'lead' },
  ]},
  { name: 'People', members: [
    { id: 10, name: 'Destinee Agard', title: 'People Team' },
  ]},
]

const avatarColors = [C.navy, C.teal, C.lavender, '#E8A87C', '#85CDCA', '#C38D9E', C.yellow]
function getAvatarColor(id) { return avatarColors[id % avatarColors.length] }

export default function People({ currentUser }) {
  const [search, setSearch] = useState('')
  const [openTeams, setOpenTeams] = useState(new Set())
  const [selectedPerson, setSelectedPerson] = useState(null)

  const toggleTeam = (name) => {
    setOpenTeams(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  // If searching, show flat results. Otherwise show accordion.
  const allMembers = teams.flatMap(t => t.members.map(m => ({ ...m, team: t.name })))
  const searchResults = search
    ? allMembers.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.team.toLowerCase().includes(search.toLowerCase()) ||
        m.title.toLowerCase().includes(search.toLowerCase())
      )
    : null

  return (
    <div style={{ padding: '16px 20px 40px' }}>
      <h2 style={{ ...S.h2, marginBottom: 4 }}>People</h2>
      <p style={{ ...S.caption, marginBottom: 16 }}>~160 team members across all departments</p>

      <input
        type="text"
        placeholder="Search by name, team, or title..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* Search results — flat list */}
      {searchResults && (
        <div>
          <p style={{ ...S.caption, marginBottom: 12 }}>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</p>
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

      {/* Team accordions */}
      {!searchResults && teams.map(team => {
        const isOpen = openTeams.has(team.name)
        const leads = team.members.filter(m => m.role === 'lead')
        const others = team.members.filter(m => m.role !== 'lead')

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
                {/* Leads first */}
                {leads.map(member => (
                  <PersonRow
                    key={member.id}
                    member={member}
                    isLead
                    currentUser={currentUser}
                    onSelect={setSelectedPerson}
                  />
                ))}
                {/* Reports indented */}
                {others.map(member => (
                  <PersonRow
                    key={member.id}
                    member={member}
                    indented={leads.length > 0}
                    currentUser={currentUser}
                    onSelect={setSelectedPerson}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}

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
              {selectedPerson.role === 'lead' && (
                <span style={styles.leadBadgeLarge}>Team Lead</span>
              )}
            </div>

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

function PersonRow({ member, isLead, indented, subtitle, currentUser, onSelect }) {
  return (
    <button
      onClick={() => onSelect(member)}
      style={{
        ...styles.personRow,
        paddingLeft: indented ? 36 : 12,
      }}
    >
      <div style={{ ...styles.personAvatar, background: getAvatarColor(member.id) }}>
        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={styles.personName}>
          {member.name}
          {member.id === currentUser?.id && <span style={styles.youBadge}>You</span>}
        </div>
        <div style={styles.personTitle}>{subtitle || member.title}</div>
      </div>
      {isLead && <span style={styles.leadBadge}>Lead</span>}
      <span style={{ color: C.textMuted, fontSize: 18 }}>&rsaquo;</span>
    </button>
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
  leadBadge: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 600,
    color: C.teal,
    background: C.teal + '18',
    padding: '3px 8px',
    borderRadius: 6,
    flexShrink: 0,
  },
  leadBadgeLarge: {
    display: 'inline-block',
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 600,
    color: C.teal,
    background: C.teal + '18',
    padding: '4px 12px',
    borderRadius: 8,
    marginTop: 8,
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
