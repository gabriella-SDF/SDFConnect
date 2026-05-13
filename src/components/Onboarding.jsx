import { useState } from 'react'
import { C, F, S } from '../theme'
import { supabase } from '../lib/supabase'
import { quizQuestions } from '../data/quiz'

export default function Onboarding({ user, session, onComplete, onSkipAll, initialProfile, isEditing }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(() => {
    if (!initialProfile) return {}
    return {
      stellar_interests: initialProfile.stellar_interests || [],
      most_yourself: initialProfile.most_yourself || [],
      vacation: initialProfile.vacation || null,
      thinking: initialProfile.thinking || [],
      best_rec: initialProfile.best_rec || '',
      ask_me_about: initialProfile.ask_me_about || '',
    }
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const q = quizQuestions[step]
  const total = quizQuestions.length
  const isLast = step === total - 1

  const setAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const toggleMulti = (id, value) => {
    const current = answers[id] || []
    if (current.includes(value)) {
      setAnswer(id, current.filter(v => v !== value))
    } else {
      setAnswer(id, [...current, value])
    }
  }

  const canAdvance = () => {
    if (q.type === 'multi') return (answers[q.id] || []).length > 0
    if (q.type === 'single') return !!answers[q.id]
    if (q.type === 'text') return true // text is always optional
    return true
  }

  const handleNext = () => {
    if (isLast) {
      submitProfile()
    } else {
      setStep(step + 1)
    }
  }

  const handleSkipQuestion = () => {
    if (isLast) {
      submitProfile()
    } else {
      setStep(step + 1)
    }
  }

  const submitProfile = async () => {
    setSubmitting(true)
    setError('')
    const payload = {
      user_id: session.user.id,
      email: session.user.email,
      stellar_interests: answers.stellar_interests || [],
      most_yourself: answers.most_yourself || [],
      vacation: answers.vacation || null,
      thinking: answers.thinking || [],
      best_rec: (answers.best_rec || '').trim() || null,
      ask_me_about: (answers.ask_me_about || '').trim() || null,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' })
    setSubmitting(false)
    if (dbError) {
      setError(dbError.message || 'Could not save. Please try again.')
      return
    }
    onComplete?.()
  }

  const handleSkipAll = async () => {
    setSubmitting(true)
    setError('')
    const payload = {
      user_id: session.user.id,
      email: session.user.email,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' })
    setSubmitting(false)
    if (dbError) {
      setError(dbError.message || 'Could not skip. Please try again.')
      return
    }
    onSkipAll?.()
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={handleSkipAll} style={styles.skipAllBtn} disabled={submitting}>
            {isEditing ? 'Cancel' : 'Skip for now'}
          </button>
        </div>

        {/* Progress */}
        <div style={styles.progressBar}>
          {quizQuestions.map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.progressDot,
                background: i <= step ? C.yellow : 'rgba(255,255,255,0.18)',
                width: i === step ? 28 : 6,
              }}
            />
          ))}
        </div>

        {/* Welcome line on first step */}
        {step === 0 && !isEditing && (
          <p style={styles.welcomeLine}>
            Welcome, {user.first_name}. Quick setup so we can match you with people to connect with.
          </p>
        )}
        {step === 0 && isEditing && (
          <p style={styles.welcomeLine}>
            Update your profile answers.
          </p>
        )}

        {/* Question */}
        <div style={styles.questionBlock}>
          <div style={styles.questionNumber}>
            {String(step + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <h2 style={styles.questionTitle}>{q.title}</h2>
          {q.hint && <p style={styles.questionHint}>{q.hint}</p>}

          {q.type === 'multi' && (
            <div style={styles.chipWrap}>
              {q.options.map(opt => {
                const selected = (answers[q.id] || []).includes(opt)
                return (
                  <button
                    key={opt}
                    onClick={() => toggleMulti(q.id, opt)}
                    style={{
                      ...styles.chip,
                      background: selected ? C.yellow : 'rgba(255,255,255,0.06)',
                      color: selected ? C.dark : '#fff',
                      borderColor: selected ? C.yellow : 'rgba(255,255,255,0.16)',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {q.type === 'single' && (
            <div style={styles.chipWrap}>
              {q.options.map(opt => {
                const selected = answers[q.id] === opt
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswer(q.id, opt)}
                    style={{
                      ...styles.chip,
                      background: selected ? C.yellow : 'rgba(255,255,255,0.06)',
                      color: selected ? C.dark : '#fff',
                      borderColor: selected ? C.yellow : 'rgba(255,255,255,0.16)',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {q.type === 'text' && (
            <textarea
              value={answers[q.id] || ''}
              onChange={e => setAnswer(q.id, e.target.value)}
              placeholder={q.placeholder}
              rows={3}
              maxLength={140}
              style={styles.textInput}
              autoFocus
            />
          )}
        </div>

        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorTitle}>Something went wrong</div>
            <div style={styles.errorMsg}>{error}</div>
            <button
              onClick={() => {
                try { localStorage.setItem('sdf-skip-quiz', '1') } catch {}
                onSkipAll?.()
              }}
              style={styles.errorBypass}
            >
              Continue anyway →
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={styles.backBtn} disabled={submitting}>
              ← Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button
            onClick={handleNext}
            disabled={submitting}
            style={{
              ...styles.nextBtn,
              opacity: submitting ? 0.5 : 1,
            }}
          >
            {submitting ? 'Saving…' : isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: C.dark,
    color: '#fff',
    padding: 24,
    paddingTop: 'calc(env(safe-area-inset-top) + 24px)',
    paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
    display: 'flex',
    flexDirection: 'column',
  },
  inner: {
    maxWidth: 460,
    width: '100%',
    margin: '0 auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 18,
  },
  skipAllBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontFamily: F.sans,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
  progressBar: {
    display: 'flex',
    gap: 5,
    marginBottom: 22,
    alignItems: 'center',
  },
  progressDot: {
    height: 6,
    borderRadius: 3,
    transition: 'width 0.25s, background 0.25s',
  },
  welcomeLine: {
    fontFamily: F.serif,
    fontSize: 18,
    fontStyle: 'italic',
    color: '#ccc',
    marginBottom: 24,
    lineHeight: 1.4,
  },
  questionBlock: {
    flex: 1,
  },
  questionNumber: {
    fontFamily: F.sans,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.18em',
    color: C.yellow,
    marginBottom: 14,
  },
  questionTitle: {
    fontFamily: F.serif,
    fontSize: 26,
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1.25,
    marginBottom: 8,
    letterSpacing: '-0.01em',
  },
  questionHint: {
    fontFamily: F.sans,
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  chipWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  chip: {
    padding: '10px 16px',
    borderRadius: 999,
    border: '1px solid',
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    letterSpacing: '0.01em',
  },
  textInput: {
    width: '100%',
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    fontFamily: F.sans,
    fontSize: 15,
    lineHeight: 1.5,
    outline: 'none',
    resize: 'vertical',
    minHeight: 80,
  },
  error: {
    fontFamily: F.sans,
    fontSize: 13,
    color: '#ff6b6b',
    marginTop: 12,
  },
  errorBox: {
    marginTop: 18,
    padding: 16,
    background: 'rgba(255,107,107,0.10)',
    border: '1px solid rgba(255,107,107,0.35)',
    borderRadius: 12,
  },
  errorTitle: {
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 700,
    color: '#ff6b6b',
    marginBottom: 6,
    letterSpacing: '0.02em',
  },
  errorMsg: {
    fontFamily: F.sans,
    fontSize: 12,
    color: '#ffb3b3',
    lineHeight: 1.5,
    marginBottom: 12,
  },
  errorBypass: {
    background: '#fff',
    color: C.dark,
    border: 'none',
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 600,
    padding: '10px 16px',
    borderRadius: 999,
    cursor: 'pointer',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    paddingTop: 12,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    padding: '10px 0',
  },
  skipBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.18)',
    color: '#bbb',
    fontFamily: F.sans,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    padding: '10px 16px',
    borderRadius: 999,
  },
  nextBtn: {
    background: C.yellow,
    border: 'none',
    color: C.dark,
    fontFamily: F.sans,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    padding: '12px 22px',
    borderRadius: 999,
    letterSpacing: '0.02em',
  },
}
