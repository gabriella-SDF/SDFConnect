import { C, F, S } from '../theme'

const venueSpots = [
  { name: 'Fairmont Rooftop', purpose: 'Welcome Happy Hour (Mon)', floor: 'Top Floor' },
  { name: 'Pavilion', purpose: 'Breakfast & Main Sessions', floor: 'Main Level' },
  { name: 'Crown Room', purpose: 'Morning Yoga (Wed)', floor: 'Top Floor' },
  { name: 'Tonga Room', purpose: 'Closing Celebration (Thu)', floor: 'Lower Level' },
  { name: 'Breakout Rooms', purpose: 'Objectives Breakout Sessions', floor: 'Conference Level' },
  { name: 'Swag Store', purpose: 'Open during lunch breaks', floor: 'Near Pavilion' },
]

export default function Venue() {
  return (
    <div style={{ padding: '16px 20px 40px' }}>
      <h2 style={{ ...S.h2, marginBottom: 4 }}>Venue</h2>
      <p style={{ ...S.caption, marginBottom: 20 }}>Fairmont San Francisco · 950 Mason St</p>

      {/* Map */}
      <div style={styles.mapContainer}>
        <iframe
          title="Fairmont San Francisco"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.6!2d-122.4106!3d37.7924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808e0e0f0c0d%3A0x0!2sFairmont%20San%20Francisco!5e0!3m2!1sen!2sus!4v1"
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: 16 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Venue Locations */}
      <h3 style={{ ...S.h3, marginTop: 24, marginBottom: 12 }}>Key Locations</h3>
      <div style={styles.spotList}>
        {venueSpots.map((spot, i) => (
          <div key={i} style={styles.spotCard}>
            <div style={styles.spotIcon}>📍</div>
            <div style={{ flex: 1 }}>
              <div style={styles.spotName}>{spot.name}</div>
              <div style={styles.spotPurpose}>{spot.purpose}</div>
            </div>
            <div style={styles.spotFloor}>{spot.floor}</div>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <h3 style={{ ...S.h3, marginTop: 24, marginBottom: 12 }}>Good to Know</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: '🏨', title: 'Address', detail: '950 Mason St, San Francisco, CA 94108' },
          { icon: '🚕', title: 'From SFO', detail: '~30 min by car, BART to Powell then cable car' },
          { icon: '📶', title: 'WiFi', detail: 'Network and password will be shared at check-in' },
          { icon: '☕', title: 'Nearby Coffee', detail: 'Lobby café + multiple spots on Powell St' },
        ].map((info, i) => (
          <div key={i} style={styles.infoRow}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{info.icon}</span>
            <div>
              <div style={{ ...S.body, fontWeight: 600, fontSize: 13 }}>{info.title}</div>
              <div style={S.caption}>{info.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  mapContainer: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    border: `1px solid ${C.border}`,
    background: C.border,
  },
  spotList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  spotCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    background: C.card,
    borderRadius: 12,
    border: `1px solid ${C.border}`,
  },
  spotIcon: {
    fontSize: 20,
    flexShrink: 0,
  },
  spotName: {
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 600,
    color: C.text,
  },
  spotPurpose: {
    fontFamily: F.sans,
    fontSize: 12,
    color: C.textFade,
    marginTop: 2,
  },
  spotFloor: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 500,
    color: C.teal,
    background: C.teal + '14',
    padding: '4px 10px',
    borderRadius: 8,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    background: C.card,
    borderRadius: 12,
    border: `1px solid ${C.border}`,
  },
}
