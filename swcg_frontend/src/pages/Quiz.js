import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitQuiz } from '../services/api';
import { useFlowState } from '../hooks/useFlowState';

// Mock quiz questions mapped to 4 choices producing answer_id strings
const QUESTIONS = [
  { id: 1, q: "Choose your cosmic vibe:", a: [
    { id: 'rebellious', label: 'Rebellious Spark ✨' },
    { id: 'mysterious', label: 'Mysterious Aura 🌌' },
    { id: 'witty', label: 'Witty Banter 😏' },
    { id: 'steadfast', label: 'Steadfast Soul 🛰️' },
  ]},
  { id: 2, q: "Pick a neon snack for hyperspace:", a: [
    { id: 'blue_milk', label: 'Blue Milkshake 🥤' },
    { id: 'cantina_chips', label: 'Cantina Chips 🍟' },
    { id: 'carbonite_ice', label: 'Carbonite Ice 🍧' },
    { id: 'binary_biscuits', label: 'Binary Biscuits 🍪' },
  ]},
  { id: 3, q: "Your theme song in the 80s charts:", a: [
    { id: 'power_ballad', label: 'Power Ballad 🎤' },
    { id: 'synthwave', label: 'Synthwave 🚀' },
    { id: 'funk_groove', label: 'Funk Groove 🪩' },
    { id: 'epic_score', label: 'Epic Score 🎬' },
  ]},
  { id: 4, q: "Pick a glam accessory:", a: [
    { id: 'cape', label: 'Flowing Cape 🦸' },
    { id: 'neon_saber', label: 'Neon Saber ⚡' },
    { id: 'glitter_helmet', label: 'Glitter Helmet 🪐' },
    { id: 'vintage_boots', label: 'Vintage Boots 👢' },
  ]},
  { id: 5, q: "Choose your star path:", a: [
    { id: 'destiny', label: 'Destiny Caller ✨' },
    { id: 'rogue', label: 'Rogue Adventurer 🏴‍☠️' },
    { id: 'guardian', label: 'Guardian of Vibes 🛡️' },
    { id: 'oracle', label: 'Cosmic Oracle 🔮' },
  ]},
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
