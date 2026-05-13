// Quiz questions for first-time onboarding.
// Edit chip options freely — they're saved as text and matched by equality.

export const quizQuestions = [
  {
    id: 'stellar_interests',
    title: 'Most fired up about (Stellar):',
    type: 'multi',
    options: ['Soroban', 'Payments', 'Anchors', 'Tooling', 'Wallets', 'Liquidity', 'Policy & GR', 'Ecosystem', 'Other'],
  },
  {
    id: 'most_yourself',
    title: "You're most yourself when...",
    type: 'multi',
    options: ['Outside', 'Cooking', 'Reading', 'At a show', 'Building something', 'In community', 'On long walks', 'Quiet at home', 'On the water'],
  },
  {
    id: 'vacation',
    title: 'Default vacation mode:',
    type: 'single',
    options: ['Adventure', 'Beach', 'City exploring', 'Food crawl', 'Mountains', 'Stay home', 'Off-grid'],
  },
  {
    id: 'thinking',
    title: 'Best thinking happens...',
    type: 'multi',
    options: ['Solo deep work', 'Out for a walk', 'Talking it out', 'Writing it down', 'In the shower', 'Late at night', 'Early morning'],
  },
  {
    id: 'best_rec',
    title: 'Best book, movie, or album you\'ve recommended this year:',
    type: 'text',
    placeholder: 'e.g., "Severance" or "Klara and the Sun"',
  },
  {
    id: 'ask_me_about',
    title: 'Ask me about...',
    type: 'text',
    placeholder: 'e.g., "Soroban dev tools, surfing, sourdough"',
    hint: 'Shows as your hook in the People tab.',
  },
]
