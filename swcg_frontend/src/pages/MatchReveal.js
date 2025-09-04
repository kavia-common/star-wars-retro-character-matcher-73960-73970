import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFlowState } from '../hooks/useFlowState';

// PUBLIC_INTERFACE
export default function MatchReveal() {
  /** Shows matched character info and witty write-up in an 80s photo card frame. */
  const { state } = useFlowState();
  const nav = useNavigate();
  const match = state.match;

  if (!match) {
    return (
      <div className="photo-card">
        <div>No match yet. Take the quiz first!</div>
        <Link className="btn btn-neon" to="/">Go to Quiz</Link>
      </div>
    );
  }

  const name = match.character?.name || 'Your Star Twin';
  const traits = match.character?.traits || [];
  const write = match.witty_writeup || 'A dazzling presence in the neon galaxy!';
  // Placeholder character card image (could be enhanced later)
  const placeholder = `https://dummyimage.com/800x500/110022/ff77ff&text=${encodeURIComponent(name)}`;

  return (
    <div className="photo-card">
      <div className="photo-frame">
        <img src={placeholder} alt={`${name} card`} />
      </div>
      <div>
        <h2 style={{ margin: '8px 0', color: 'var(--accent)' }}>{name}</h2>
        <div style={{ color: 'var(--muted)' }}>Traits: {traits.join(' • ') || 'mysterious glam'}</div>
      </div>
      <div style={{ lineHeight: 1.6 }}>{write}</div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn" onClick={() => nav('/selfie')}>Upload a Selfie 📸</button>
        {state.selfie?.temp_id && <button className="btn btn-neon" onClick={() => nav('/mashup')}>Generate Mashup 🚀</button>}
      </div>
    </div>
  );
}
