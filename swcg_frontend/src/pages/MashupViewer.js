import React, { useEffect, useState } from 'react';
import { createMashup } from '../services/api';
import { useFlowState } from '../hooks/useFlowState';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function MashupViewer() {
  /** Generates and displays the mashup image in a glamor prom shot frame. */
  const { state, setState } = useFlowState();
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const selfieId = state.selfie?.temp_id || state.match?.selfie_temp_id || null;
  const characterName = state.match?.character?.name;

  useEffect(() => {
    let cancelled = false;
    async function go() {
      if (!selfieId || !characterName || state.mashup?.mashup_url) return;
      try {
        setBusy(true);
        const res = await createMashup(selfieId, characterName);
        if (!cancelled) setState(prev => ({ ...prev, mashup: res }));
      } catch (e) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setBusy(false);
      }
    }
    go();
    return () => { cancelled = true; };
  }, [selfieId, characterName, state.mashup?.mashup_url, setState]);

  if (!characterName) {
    return (
      <div className="photo-card">
        <div>Please complete the quiz to get your character match.</div>
        <Link className="btn btn-neon" to="/">Take Quiz</Link>
      </div>
    );
  }
  if (!selfieId) {
    return (
      <div className="photo-card">
        <div>We need your selfie to glam it up!</div>
        <Link className="btn btn-neon" to="/selfie">Upload Selfie</Link>
      </div>
    );
  }

  const url = state.mashup?.mashup_url;

  return (
    <div className="photo-card">
      <div className="photo-frame" style={{ aspectRatio: '4/3' }}>
        {busy && <div style={{ padding: 24, textAlign: 'center' }}>Summoning retro glam… ✨</div>}
        {!busy && url && <img src={url} alt="Your 80s glam mashup" />}
      </div>
      {err && <div role="alert" style={{ color: '#ff9fbf' }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link className="btn" to="/reveal">Back to Match</Link>
        {url && <Link className="btn btn-neon" to="/share">Share the Glam ➜</Link>}
      </div>
    </div>
  );
}
