import { useState } from 'react'
import { C, F, S } from '../theme'
import { icebreakers, testimonialPrompts } from '../data/schedule'
import { supabase } from '../lib/supabase'

export default function Engage({ user }) {
  const [subTab, setSubTab] = useState('icebreaker')
  const [question, setQuestion] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [testimonialText, setTestimonialText] = useState('')
  const [testimonialSent, setTestimonialSent] = useState(false)
  const [testimonialSubmitting, setTestimonialSubmitting] = useState(false)
  const [icebreakerIdx, setIcebreakerIdx] = useState(
    Math.floor(Math.random() * icebreakers.length)
  )

  // Simple per-browser rate limit: one submission per 30 sec per kind.
  const checkRateLimit = (kind) => {
    try {
      const key = `sdf-last-${kind}`
      const last = parseInt(localStorage.getItem(key) || '0', 10)
      const now = Date.now()
      if (now - last < 30000) {
        const wait = Math.ceil((30000 - (now - last)) / 1000)
        setError(`Please wait ${wait}s before submitting again.`)
        return false
      }
      localStorage.setItem(key, String(now))
      return true
    } catch {
      return true
    }
  }

  const handleSubmitQuestion = async () => {
    if (!question.trim() || submitting) return
    if (!checkRateLimit('question')) return
    setSubmitting(true)
    setError('')
    const { error: dbError } = await supabase
      .from('questions')
      .insert({ body: question.trim() })
    setSubmitting(false)
    if (dbError) {
      setError('Could not submit. Please try again.')
      return
    }
    setSubmitted(true)
    setQuestion('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleSubmitTestimonial = async () => {
    if (!testimonialText.trim() || testimonialSubmitting) return
    if (!checkRateLimit('testimonial')) return
    setTestimonialSubmitting(true)
    setError('')
    const { error: dbError } = await supabase
      .from('testimonials')
      .insert({
        body: testimonialText.trim(),
        prompt: testimonialPrompts[testimonialIdx],
        author_name: user.name,
      })
    setTestimonialSubmitting(false)
    if (dbError) {
      setError('Could not submit. Please try again.')
      return
    }
    setTestimonialSent(true)
    setTestimonialText('')
    setTimeout(() => {
      setTestimonialSent(false)
      setTestimonialIdx((testimonialIdx + 1) % testimonialPrompts.length)
    }, 3000)
  }

  const shuffleIcebreaker = () => {
    let next
    do { next = Math.floor(Math.random() * icebreakers.length) } while (next === icebreakerIdx)
    setIcebreakerIdx(next)
  }

  const subTabs = [
    { id: 'icebreaker', label: 'Icebreakers' },
    { id: 'testimonial', label: 'Testimonials' },
    { id: 'qa', label: 'Q&A' },
  ]

  return (
    <div>
      {/* Sub-tabs */}
      <div style={styles.subTabs}>
        {subTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            style={{
              ...styles.subTab,
              background: subTab === t.id ? C.dark : 'transparent',
              color: subTab === t.id ? C.yellow : C.textFade,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 20px 40px' }}>
        {/* Anonymous Q&A */}
        {subTab === 'qa' && (
          <div>
            <h2 style={S.h2}>Anonymous Q&A</h2>
            <p style={{ ...S.body, color: C.textFade, margin: '8px 0 24px' }}>
              Ask anything during sessions. Your identity is never recorded. No name, no IP, no device ID.
            </p>

            <div style={S.card}>
              <textarea
                placeholder="Type your question..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
                rows={4}
                style={styles.textarea}
              />
              <button
                onClick={handleSubmitQuestion}
                disabled={!question.trim() || submitting}
                style={{
                  ...S.btnPrimary,
                  width: '100%',
                  marginTop: 12,
                  opacity: question.trim() && !submitting ? 1 : 0.4,
                }}
              >
                {submitted ? '✓ Submitted!' : submitting ? 'Submitting…' : 'Submit Anonymously'}
              </button>
              {error && subTab === 'qa' && (
                <p style={{ ...S.caption, color: '#ff6b6b', marginTop: 8, textAlign: 'center' }}>{error}</p>
              )}
            </div>

            <div style={styles.privacyNote}>
              <span style={{ fontSize: 14 }}>🔒</span>
              <span>Questions are visible to organizers and leadership only. No identifying information is collected.</span>
            </div>
          </div>
        )}

        {/* Testimonials */}
        {subTab === 'testimonial' && (
          <div>
            <h2 style={S.h2}>Share a Testimonial</h2>
            <p style={{ ...S.body, color: C.textFade, margin: '8px 0 24px' }}>
              Help us capture what makes SDF special. Your response may be used for a photo testimonial at the retreat.
            </p>

            <div style={styles.promptCard}>
              <div style={styles.promptNumber}>
                {String(testimonialIdx + 1).padStart(2, '0')}/{String(testimonialPrompts.length).padStart(2, '0')}
              </div>
              <h3 style={styles.promptText}>
                {testimonialPrompts[testimonialIdx]}
              </h3>
            </div>

            <div style={{ ...S.card, marginTop: 16 }}>
              <textarea
                placeholder="Your response..."
                value={testimonialText}
                onChange={e => setTestimonialText(e.target.value)}
                rows={4}
                style={styles.textarea}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => setTestimonialIdx((testimonialIdx + 1) % testimonialPrompts.length)}
                  style={{ ...S.btnSecondary, flex: 1 }}
                >
                  Skip →
                </button>
                <button
                  onClick={handleSubmitTestimonial}
                  disabled={!testimonialText.trim() || testimonialSubmitting}
                  style={{
                    ...S.btnPrimary,
                    flex: 2,
                    opacity: testimonialText.trim() && !testimonialSubmitting ? 1 : 0.4,
                  }}
                >
                  {testimonialSent ? '✓ Thank you!' : testimonialSubmitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
              {error && subTab === 'testimonial' && (
                <p style={{ ...S.caption, color: '#ff6b6b', marginTop: 8, textAlign: 'center' }}>{error}</p>
              )}
            </div>

            <p style={{ ...S.caption, marginTop: 12, textAlign: 'center' }}>
              Submitting as {user.name}. We may follow up for a photo at the retreat.
            </p>
          </div>
        )}

        {/* Icebreakers */}
        {subTab === 'icebreaker' && (
          <div>
            <h2 style={S.h2}>Icebreaker Cards</h2>
            <p style={{ ...S.body, color: C.textFade, margin: '8px 0 24px' }}>
              Pull up a card during breaks, meals, or whenever you meet someone new.
            </p>

            <div style={styles.icebreakerCard}>
              <div style={styles.icebreakerIcon}>🎲</div>
              <h3 style={styles.icebreakerText}>
                {icebreakers[icebreakerIdx]}
              </h3>
            </div>

            <button
              onClick={shuffleIcebreaker}
              style={{ ...S.btnPrimary, width: '100%', marginTop: 20 }}
            >
              Shuffle to Next Card
            </button>

            <p style={{ ...S.caption, marginTop: 16, textAlign: 'center' }}>
              {icebreakers.length} cards in the deck
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  subTabs: {
    display: 'flex',
    gap: 6,
    padding: '12px 20px',
    position: 'sticky',
    top: 56,
    zIndex: 50,
    background: C.bg,
    borderBottom: `1px solid ${C.border}`,
  },
  subTab: {
    flex: 1,
    padding: '10px 8px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.01em',
    transition: 'all 0.15s',
  },
  textarea: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    background: C.bg,
    fontFamily: F.sans,
    fontSize: 15,
    color: C.text,
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.5,
  },
  privacyNote: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    padding: 14,
    background: C.teal + '10',
    borderRadius: 10,
    fontFamily: F.sans,
    fontSize: 12,
    color: C.textFade,
    lineHeight: 1.5,
  },
  promptCard: {
    background: C.dark,
    borderRadius: 20,
    padding: 32,
    textAlign: 'center',
  },
  promptNumber: {
    fontFamily: F.sans,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: C.yellow,
    marginBottom: 16,
  },
  promptText: {
    fontFamily: F.serif,
    fontSize: 22,
    fontWeight: 500,
    color: '#fff',
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
  icebreakerCard: {
    background: `linear-gradient(135deg, ${C.navy}, ${C.teal})`,
    borderRadius: 24,
    padding: 40,
    textAlign: 'center',
    minHeight: 240,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icebreakerIcon: {
    fontSize: 40,
    marginBottom: 20,
  },
  icebreakerText: {
    fontFamily: F.serif,
    fontSize: 24,
    fontWeight: 500,
    color: '#fff',
    lineHeight: 1.4,
  },
}
