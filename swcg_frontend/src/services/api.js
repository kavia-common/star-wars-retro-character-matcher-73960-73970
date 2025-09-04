const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Simple fetch wrappers with JSON and error handling
async function http(method, path, { json, formData, headers } = {}) {
  const opts = { method, headers: headers || {} };
  if (json) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(json);
  }
  if (formData) {
    // Let browser set content-type with boundary
    opts.body = formData;
  }
  const res = await fetch(`${API_BASE}${path}`, opts);
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  if (!res.ok) {
    const errText = isJson ? JSON.stringify(await res.json()).slice(0, 500) : await res.text();
    throw new Error(`API error ${res.status}: ${errText}`);
  }
  return isJson ? res.json() : res.text();
}

// PUBLIC_INTERFACE
export async function getCharacterTraits() {
  /** Fetch catalog of characters and traits from backend. */
  return http('GET', '/characters/traits');
}

// PUBLIC_INTERFACE
export async function submitQuiz(answers, selfieTempId = null) {
  /** Submit quiz answers, optionally with selfie temp id. */
  return http('POST', '/quiz/submit', { json: { answers, selfie_temp_id: selfieTempId } });
}

// PUBLIC_INTERFACE
export async function uploadSelfie(file) {
  /** Upload selfie file via multipart/form-data, returns { temp_id, url } or similar. */
  const fd = new FormData();
  fd.append('file', file);
  return http('POST', '/selfie/upload', { formData: fd });
}

// PUBLIC_INTERFACE
export async function createMashup(selfieTempId, characterName) {
  /** Request mashup image generation for given selfie and character name. */
  return http('POST', '/image/mashup', { json: { selfie_temp_id: selfieTempId, character_name: characterName } });
}

// PUBLIC_INTERFACE
export async function shareResult(channel, { message = null, target_phone_e164 = null, image_url, page_url = null }) {
  /** Ask backend to generate social link or send SMS. */
  return http('POST', '/share', { json: { channel, message, target_phone_e164, image_url, page_url } });
}
