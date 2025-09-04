import { useEffect, useState } from 'react';

const KEY = 'swcg-flow-v1';

// PUBLIC_INTERFACE
export function useFlowState() {
  /** Manage quiz -> reveal -> selfie -> mashup -> share state persisted in localStorage. */
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {
        answers: [],
        match: null, // { character, witty_writeup, score_breakdown, selfie_temp_id? }
        selfie: null, // { temp_id, url } or { fileName }
        mashup: null, // { mashup_url, public_id }
      };
    } catch {
      return { answers: [], match: null, selfie: null, mashup: null };
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  function reset() {
    setState({ answers: [], match: null, selfie: null, mashup: null });
  }

  return { state, setState, reset };
}
