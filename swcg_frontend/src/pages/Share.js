import React, { useState } from 'react';
import { shareResult } from '../services/api';
import { useFlowState } from '../hooks/useFlowState';

// PUBLIC_INTERFACE
export default function Share() {
  /** Share screen for Facebook, Twitter, and SMS (via backend). */
  const { state } = useFlowState();
  const [busy, setBusy] = useState(false);
  const [smsNumber, setSmsNumber] = useState('');
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState(null);

  const imageUrl = state.mashup?.mashup_url;
  const pageUrl = process.env.REACT_APP_SITE_URL ? `${process.env.REACT_APP_SITE_URL}/share` : null;
  if (!imageUrl) {
    return (
      <div className="photo-card">
        <div>Generate a mashup first to share your glam!</div>
      </div>
    );
  }

  async function share(channel) {
    try {
      setBusy(true);
      setErr(null);
      setStatus(null);
      const res = await shareResult(channel, { image_url: imageUrl, page_url: pageUrl });
      if (res.link) {
        window.open(res.link, '_blank', 'noopener');
      }
      setStatus(res.status || 'ok');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function sendSMS() {
    try {
      setBusy(true);
      setErr(null);
      setStatus(null);
      const res = await shareResult('sms', { target_phone_e164: smsNumber, image_url: imageUrl, page_url: pageUrl });
      setStatus(res.status || 'ok');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="photo-card">
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ fontWeight: 600 }}>Share your 80s glam moment</div>
        <div className="share-grid">
          <button className="share-btn" disabled={busy} onClick={() => share('facebook')}>Share on Facebook</button>
          <button className="share-btn" disabled={busy} onClick={() => share('twitter')}>Share on Twitter</button>
          <div className="share-btn" style={{ display: 'grid', gap: 8 }}>
            <div>Send via SMS</div>
            <input
              placeholder="+15555555555"
              value={smsNumber}
              onChange={(e) => setSmsNumber(e.target.value)}
              style={{
                padding: 8,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                color: 'inherit'
              }}
            />
            <button className="btn btn-neon" disabled={busy || !smsNumber} onClick={sendSMS}>Send SMS</button>
          </div>
        </div>
        {status && <div style={{ color: '#b6ffb6' }}>Status: {status}</div>}
        {err && <div role="alert" style={{ color: '#ff9fbf' }}>{err}</div>}
      </div>
    </div>
  );
}
