// SDF Connect: Accelerate — May 18-22, 2026
// Fairmont San Francisco

export const RETREAT_START = new Date('2026-05-18T00:00:00-07:00')
export const RETREAT_END = new Date('2026-05-22T23:59:59-07:00')

// Short, glanceable room label for use on Home/Schedule rows.
// Falls back gracefully when location is empty, multi-room, or off-site.
export function briefRoom(session) {
  if (!session) return ''
  if (session.tag === 'breakout') return 'Breakout rooms'
  if (session.tag === 'team') return 'By team'
  if (!session.location) return ''
  let r = session.location
    .replace(/^Fairmont\s*[—–-]\s*/i, '')
    .replace(/^The Fairmont\s*[—–-]?\s*/i, '')
  if (r.includes('·')) r = r.split('·')[0].trim()
  if (r.length > 32) r = r.slice(0, 30) + '…'
  return r
}

// Match a session location to a primary hub room name (Gold, Green, etc.)
export function hubRoomForSession(session) {
  if (!session?.location) return null
  const text = session.location.toLowerCase()
  const rooms = ['gold', 'green', 'garden', 'empire', 'crystal', 'fountain']
  return rooms.find(r => new RegExp(`\\b${r}\\b`).test(text)) || null
}

// Returns a real-world address if the session is at a navigable place,
// or null for in-hotel rooms where directions don't apply.
const FAIRMONT_ADDRESS = 'Fairmont San Francisco, 950 Mason St, San Francisco, CA 94108'
export function externalAddress(location) {
  if (!location) return null
  const m = location.match(/(\d+\s+[\w\s.]+(?:St|Street|Ave|Avenue|Blvd|Boulevard|Rd|Road)[\w\s,]*)/i)
  if (m) return m[1].trim()
  if (/fairmont|penthouse|tonga|crown room/i.test(location)) return FAIRMONT_ADDRESS
  return null
}

// Open in Google Maps (works on iOS & Android — opens native app if installed).
export function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

// Short, glanceable level/direction hint for a room.
// Empty string for hub/lobby-level rooms — no hint needed.
export function roomHint(room) {
  if (!room) return ''
  const r = room.toLowerCase()
  if (/penthouse/.test(r)) return '↑ Penthouse'
  if (/crown/.test(r)) return '↑ Top floor'
  if (/gold foyer|mezzanine|registration/.test(r)) return '↑ 1 floor up'
  if (/intersect|diplomat/.test(r)) return '↓ 1 floor down'
  if (/tonga|vanderbilt|terrace|spa/.test(r)) return '↓ 2 floors down'
  if (/powell st|barcade|off[- ]site/.test(r)) return 'Off-site'
  return ''
}

export const days = [
  {
    id: 'mon',
    date: '2026-05-18',
    dayNum: 0,
    label: 'Monday, May 18',
    title: 'Travel Day',
    theme: 'Arrivals & Welcome',
    description: 'Travel day for non-Bay Area employees.',
    sessions: [
      { time: '5:30 PM', end: '8:30 PM', title: 'Welcome Happy Hour', tag: 'social', location: 'Fairmont Penthouse', description: 'Kick off the retreat with drinks at the Fairmont Penthouse.' },
    ],
  },
  {
    id: 'tue',
    date: '2026-05-19',
    dayNum: 1,
    label: 'Tuesday, May 19',
    title: 'Day 1',
    theme: 'Setting the Pace',
    description: "Day 1 is all about setting the pace. Centered around our theme of Accelerate, the day brings together executive presentations, guest speakers, and a deep dive into our objectives. The full team gets the vision, context, and energy to hit the ground running for the retreat and the year ahead.",
    sessions: [
      { time: '8:00 AM', end: '9:00 AM', title: 'Breakfast', tag: 'meal', location: 'Pavilion' },
      { time: '8:00 AM', end: '9:00 AM', title: 'Check-in + Swag Pick Up', tag: 'meal', location: 'Gold Room Foyer' },
      { time: '9:00 AM', end: '9:15 AM', title: 'Housekeeping', tag: 'keynote', location: 'Gold Room', description: "We'll kick things off with a quick overview of the week: what to expect, how the days are structured, and a few surprises we'll let speak for themselves.", speakers: ['Lisa Macnew'] },
      { time: '9:15 AM', end: '9:30 AM', title: 'SDF Connect Kickoff', tag: 'keynote', location: 'Gold Room', description: 'Denelle opens the retreat, centering the week around our theme of Accelerate.', speakers: ['Denelle Dixon'] },
      { time: '9:30 AM', end: '10:30 AM', title: 'Executive Roundtable', tag: 'keynote', location: 'Gold Room', description: "A candid conversation with leadership covering where we are, where we're placing our bets, and what we're building toward.", speakers: ['Denelle Dixon'] },
      { time: '10:30 AM', end: '11:00 AM', title: 'Break Time', tag: 'break', location: 'Gold Room', description: 'Opportunity to check emails and mingle cross-functionally.' },
      { time: '11:00 AM', end: '11:45 AM', title: 'Fireside Chat', tag: 'keynote', location: 'Gold Room', description: 'Denelle Dixon + Guest Speaker.', speakers: ['Denelle Dixon'] },
      { time: '11:45 AM', end: '1:00 PM', title: 'Lunch', tag: 'meal', location: 'Pavilion' },
      { time: '1:00 PM', end: '2:00 PM', title: 'Objectives Opening', tag: 'keynote', location: 'Gold Room', description: "The three objective owners walk through each objective covering current metrics, what's been learned, and what's next." },
      { time: '2:00 PM', end: '3:00 PM', title: 'Objective Breakouts', tag: 'breakout', location: 'Breakout rooms', description: "Three concurrent breakout sessions, one per objective. You'll head to the group you signed up for." },
      { time: '3:00 PM', end: '3:30 PM', title: 'Break + Mingle', tag: 'break', location: '' },
      { time: '3:30 PM', end: '4:30 PM', title: 'Quarterly Ascension', tag: 'activity', location: 'Gold Room', description: 'Our ecosystem team walks us through x402 in a fun and interactive game.' },
      { time: '4:30 PM', end: '6:00 PM', title: 'Work Time', tag: 'break', location: '' },
      { time: '6:00 PM', end: '9:00 PM', title: 'Barcade at Golden Gate Taproom', tag: 'social', location: '449 Powell St, San Francisco', description: "We're closing out Day 1 at a nearby Barcade. Just an 8-minute walk from the hotel, and a great way to unwind and keep the energy going." },
    ],
  },
  {
    id: 'wed',
    date: '2026-05-20',
    dayNum: 2,
    label: 'Wednesday, May 20',
    title: 'Day 2',
    theme: "What's Next: AI & Innovation",
    description: "Day 2 shifts the focus to what's next. With a dedicated block on AI and product adoption, the day is designed to explore how emerging technology is reshaping the way we build, grow, and reach users, and what that means for how we Accelerate.",
    sessions: [
      { time: '8:00 AM', end: '9:00 AM', title: 'Breakfast', tag: 'meal', location: 'Pavilion' },
      { time: '8:00 AM', end: '9:00 AM', title: 'Check-in + Swag Pick Up', tag: 'meal', location: 'Gold Room Foyer' },
      { time: '9:00 AM', end: '9:15 AM', title: 'Housekeeping + Volunteer Explanation', tag: 'keynote', location: 'Gold Room' },
      { time: '9:15 AM', end: '10:00 AM', title: 'Guest Speaker', tag: 'keynote', location: 'Gold Room' },
      { time: '10:00 AM', end: '10:15 AM', title: 'Stretch Break', tag: 'break', location: 'Gold Room' },
      { time: '10:15 AM', end: '11:45 AM', title: 'AI Hackathon', tag: 'workshop', location: 'Crystal + Fountain Room', description: "We're dedicating a full block to AI. We'll kick things off together in the Gold Room with instructions and context, then break into small cross-functional groups to tackle a real problem together. Check the back of your nametag to see what group you're in." },
      { time: '11:45 AM', end: '12:45 PM', title: 'Lunch', tag: 'meal', location: 'Pavilion' },
      { time: '12:45 PM', end: '1:45 PM', title: 'AI Hackathon (cont.)', tag: 'workshop', location: 'Crystal + Fountain Room', description: 'Continue working with your AI groups and submit your final responses. The top three teams will present on Day 3.' },
      { time: '1:45 PM', end: '2:15 PM', title: 'Break + Transition Time', tag: 'break', location: 'Gold Room', description: 'Join us back in the Gold Room at 2:15 PM to kick off our volunteer experience with GIVE and DreamOp. You\'ll meet the students before breaking into your groups for the session.' },
      { time: '2:15 PM', end: '5:00 PM', title: 'GIVE: Stellar Connect-US', tag: 'activity', location: 'Gold · Green · Garden', description: "We're partnering with GIVE and DreamOp to bring in future leaders to hear from SDF employees through panels and 1:1 discussions. Breakout groups will be facilitated by DreamOp." },
      { time: '5:00 PM', end: '6:00 PM', title: 'Work Time', tag: 'break', location: '' },
      { time: '6:00 PM', end: '8:00 PM', title: 'Team Dinners', tag: 'social', location: '', description: 'Dinner with your team.' },
    ],
  },
  {
    id: 'thu',
    date: '2026-05-21',
    dayNum: 3,
    label: 'Thursday, May 21',
    title: 'Day 3',
    theme: 'People & Celebration',
    description: 'Day 3 is all about the people. We wrap up SDF Connect: Accelerate with quality team time, team presentations, and the Stellar Awards. A chance to celebrate the work, the wins, and the individuals who made it all possible.',
    sessions: [
      { time: '8:00 AM', end: '9:00 AM', title: 'Breakfast', tag: 'meal', location: 'Pavilion' },
      { time: '9:00 AM', end: '12:00 PM', title: 'Team Time', tag: 'team', location: 'Meeting Assignments (ask your manager)', description: 'Departments break out into team meetings to connect and collaborate.' },
      { time: '12:00 PM', end: '1:00 PM', title: 'Lunch', tag: 'meal', location: 'Pavilion' },
      { time: '1:00 PM', end: '1:30 PM', title: 'The Jolt', tag: 'social', location: 'Gold Room', description: "Consider this your post-lunch recharge. We're bringing in a little surprise to get the energy back in the room." },
      { time: '1:30 PM', end: '2:15 PM', title: 'AI Presentations', tag: 'keynote', location: 'Gold Room', description: 'Winners from the hackathon will be selected using Claude and invited to present their AI problem and solution to the group.' },
      { time: '2:15 PM', end: '2:30 PM', title: 'Stretch Break', tag: 'break', location: 'Gold Room' },
      { time: '2:30 PM', end: '3:00 PM', title: 'Stellar Scoreboard Winners', tag: 'social', location: 'Gold Room', description: "We'll reveal the winning department from our team competition, three days in the making." },
      { time: '3:00 PM', end: '3:30 PM', title: 'Stellar Awards', tag: 'social', location: 'Gold Room' },
      { time: '3:30 PM', end: '4:00 PM', title: 'Q&A + Wrap-up', tag: 'keynote', location: 'Gold Room' },
      { time: '4:00 PM', end: '4:30 PM', title: 'Team Photos', tag: 'social', location: '' },
      { time: '6:00 PM', end: '10:00 PM', title: 'Tonga Room', tag: 'social', location: 'Fairmont, Terrace Level', description: "We'll close out the week with a celebration at the famous Tonga Room, conveniently inside the Fairmont." },
    ],
  },
  {
    id: 'fri',
    date: '2026-05-22',
    dayNum: 4,
    label: 'Friday, May 22',
    title: 'Travel Day',
    theme: 'Safe Travels',
    sessions: [
      { time: '', end: '', title: 'Travel Day for Non-Bay Area Employees', tag: 'activity', location: '', description: 'Safe travels home! See you next time.' },
    ],
  },
]

export const icebreakers = [
  "What's the most unexpected skill you bring to SDF?",
  "If Stellar existed in a fantasy world, what would your role be?",
  "What's one thing you've learned from a coworker that changed how you work?",
  "What would your TED Talk be about (work-related or not)?",
  "If you could swap teams for a week, which team would you join?",
  "What's the bravest thing you've done at work?",
  "What song would be your walk-on music at a company all-hands?",
  "What's a project you're secretly proud of that no one knows about?",
  "If you had unlimited budget for one work experiment, what would you try?",
  "What's the best meal you've had in San Francisco?",
  "What were you doing before you joined SDF?",
  "What's one thing about your team that other teams don't know?",
  "If you could add one feature to Stellar overnight, what would it be?",
  "What's the weirdest rabbit hole you've gone down for work?",
  "What's your hot take on the future of crypto?",
  "Who at SDF would you want on your pub quiz team and why?",
  "What's the best piece of advice you've gotten at SDF?",
  "What does 'Accelerate' mean to you personally?",
]

export const contacts = [
  { name: 'Vivian Bui',     role: 'Primary Onsite Lead', phone: '(916) 600-4181' },
  { name: 'Destinee Agard', role: 'Primary Onsite Lead', phone: '(917) 544-5572' },
  { name: 'Lisa Macnew',    role: 'Onsite Lead',         phone: '(415) 509-7328' },
  { name: 'Lauren Roche',   role: 'Fairmont Contact',    phone: '(203) 506-9560' },
]

export const testimonialPrompts = [
  "What's your favorite thing about working at SDF?",
  "Describe a moment at SDF that made you proud.",
  "What makes SDF different from anywhere else you've worked?",
  "What's one word that describes the SDF culture?",
  "Who at SDF has had the biggest impact on your growth?",
  "What are you most excited about for Stellar's future?",
  "What would you tell someone considering joining SDF?",
  "What's a win from this year that deserves more recognition?",
]
