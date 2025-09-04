import React, { useRef, useState } from 'react';
import { uploadSelfie } from '../services/api';
import { useFlowState } from '../hooks/useFlowState';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function SelfieUpload() {
  /** Selfie upload with camera or file selection, preview, and backend upload. */
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const { setState } = useFlowState();
  const nav = useNavigate();

  function onPick() {
    fileRef.current?.click();
  }
  function onChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview({ file: f, url });
  }

  async function onUpload() {
    if (!preview?.file) return;
    try {
      setBusy(true);
      setErr(null);
      const res = await uploadSelfie(preview.file); // expect { temp_id, url } or compatible
      setState(prev => ({ ...prev, selfie: res || { temp_id: res?.temp_id, url: res?.url } }));
      nav('/mashup');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="upload-area">
      <div className="upload-drop">
        <div style={{ marginBottom: 8 }}>Snap a neon selfie or choose a file</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={onPick}>Choose File</button>
          <input
            type="file"
            accept="image/*"
            capture="user"
            ref={fileRef}
            onChange={onChange}
            style={{ display: 'none' }}
          />
          {preview?.url && <button className="btn btn-neon" onClick={onUpload} disabled={busy}>{busy ? 'Uploading…' : 'Upload & Continue ➜'}</button>}
        </div>
      </div>

      {preview?.url && (
        <div className="photo-card">
          <div className="photo-frame">
            <img className="preview-img" src={preview.url} alt="preview" />
          </div>
          <div style={{ color: 'var(--muted)' }}>Looking stellar! Ready to glam it up.</div>
        </div>
      )}

      {!!err && <div role="alert" style={{ color: '#ff9fbf' }}>{err}</div>}
    </div>
  );
}
