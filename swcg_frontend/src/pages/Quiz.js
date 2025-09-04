import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitQuiz } from '../services/api';
import { useFlowState } from '../hooks/useFlowState';

// Updated quiz questions mapped to backend answer_id format: q{n}_{a|b|c|d}
const QUESTIONS = [
  {
    id: 1,
    q: "When facing a challenge, you...",
    a: [
      { id: 'q1_a', label: 'A) Dive in headfirst, consequences be damned' },
      { id: 'q1_b', label: 'B) Analyze and make a strategic plan' },
      { id: 'q1_c', label: 'C) Look for help from friends' },
      { id: 'q1_d', label: 'D) Trust your instincts and hope for the best' },
    ],
  },
  {
    id: 2,
    q: "Your ideal Saturday night in a galaxy far, far away:",
    a: [
      { id: 'q2_a', label: 'A) Winning a heated game at a cantina' },
      { id: 'q2_b', label: 'B) Tinkering with gadgets or starships' },
      { id: 'q2_c', label: 'C) Rallying your squad for a cause' },
      { id: 'q2_d', label: 'D) Meditating under the twin moons' },
    ],
  },
  {
    id: 3,
    q: "If you had to pick a ride, you'd choose:",
    a: [
      { id: 'q3_a', label: 'A) A fast and flashy starfighter' },
      { id: 'q3_b', label: 'B) A trusty, heavily-modified freighter' },
      { id: 'q3_c', label: 'C) Whatever gets the job done/team transport' },
      { id: 'q3_d', label: 'D) Something rare, old, and full of surprises' },
    ],
  },
  {
    id: 4,
    q: "How would your friends describe you?",
    a: [
      { id: 'q4_a', label: 'A) Bold and daring' },
      { id: 'q4_b', label: 'B) Clever and resourceful' },
      { id: 'q4_c', label: 'C) Loyal and dependable' },
      { id: 'q4_d', label: 'D) Quirky and unpredictable' },
    ],
  },
  {
    id: 5,
    q: "When someone breaks the rules, you...",
    a: [
      { id: 'q5_a', label: 'A) Join in the mischief' },
      { id: 'q5_b', label: 'B) Figure out if it benefits you' },
      { id: 'q5_c', label: 'C) Try to restore order' },
      { id: 'q5_d', label: 'D) Enjoy the chaos' },
    ],
  },
];

// PUBLIC_INTERFACE
export default function Quiz() {
  /** Animated 5-question quiz with retro neon styling. */
  const { state, setState } = useFlowState();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(state.answers || []);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // if coming back, resume progress
    if (answers.length > 0) {
      setCurrent(Math.min(answers.length, QUESTIONS.length - 1));
    }
  }, []); // eslint-disable-line

  const progress = useMemo(() => ((answers.length / QUESTIONS.length) * 100), [answers.length]);

  function choose(answerId) {
    setErr(null);
    const q = QUESTIONS[current];
    const newAnswers = [...answers.filter(a => a.question_id !== q.id), { question_id: q.id, answer_id: answerId }];
    setAnswers(newAnswers);
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      // ready to submit
      onSubmit(newAnswers);
    }
  }

  async function onSubmit(payload) {
    try {
      setSubmitting(true);
      const result = await submitQuiz(payload, state.selfie?.temp_id || state.match?.selfie_temp_id || null);
      setState(prev => ({ ...prev, answers: payload, match: result }));
      nav('/reveal');
    } catch (e) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const q = QUESTIONS[current];

  return (
    <div className="quiz-container">
      <div className="quiz-progress" aria-label="Quiz progress">
        <div style={{ width: `${progress}%` }} />
      </div>

      <div className="question-card" style={{ opacity: submitting ? 0.6 : 1, pointerEvents: submitting ? 'none' : 'auto' }}>
        <div className="question-text">Q{q.id}. {q.q}</div>
        <div className="answer-grid">
          {q.a.map(opt => (
            <button key={opt.id} className="answer-btn" onClick={() => choose(opt.id)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {!!err && <div role="alert" style={{ color: '#ff9fbf' }}>{err}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn" onClick={() => setCurrent(Math.max(current - 1, 0))} disabled={current === 0 || submitting}>Back</button>
        <button className="btn btn-neon" onClick={() => {
          if (answers.length === QUESTIONS.length) onSubmit(answers);
        }} disabled={answers.length < QUESTIONS.length || submitting}>
          {submitting ? 'Matching…' : 'See My Match ➜'}
        </button>
      </div>
    </div>
  );
}
