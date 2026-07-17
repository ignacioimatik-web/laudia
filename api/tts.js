const MAX_TEXT_LENGTH = 1_900;
const DEEPGRAM_MODEL = 'aura-2-agustina-es';
const DEEPGRAM_SPEED = '1.20';

function parseText(body) {
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      return typeof parsed.text === 'string' ? parsed.text.trim() : '';
    } catch {
      return '';
    }
  }

  if (body && typeof body === 'object' && 'text' in body) {
    return typeof body.text === 'string' ? body.text.trim() : '';
  }

  return '';
}

function getHeader(request, name) {
  const value = request.headers?.[name] ?? request.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function isSameOriginRequest(request) {
  const origin = getHeader(request, 'origin');
  const host = getHeader(request, 'host');
  const fetchSite = getHeader(request, 'sec-fetch-site');

  if (fetchSite && fetchSite !== 'same-origin') return false;
  if (!origin || !host) return process.env.VERCEL !== '1';

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

module.exports = async function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store, max-age=0');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  response.setHeader('Vary', 'Origin');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  if (!isSameOriginRequest(request)) {
    response.status(403).json({ error: 'Origen no permitido.' });
    return;
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    response.status(503).json({ error: 'La voz no está configurada.' });
    return;
  }

  const text = parseText(request.body);
  if (!text) {
    response.status(400).json({ error: 'Falta el texto que se debe narrar.' });
    return;
  }
  if (text.length > MAX_TEXT_LENGTH) {
    response.status(413).json({ error: 'El fragmento de texto es demasiado largo.' });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const url = new URL('https://api.deepgram.com/v1/speak');
    url.searchParams.set('model', DEEPGRAM_MODEL);
    url.searchParams.set('encoding', 'mp3');
    url.searchParams.set('speed', DEEPGRAM_SPEED);
    url.searchParams.set('tag', 'laudia-prayer');

    const deepgramResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    if (!deepgramResponse.ok) {
      console.error('Deepgram TTS request failed', {
        status: deepgramResponse.status,
        requestId: deepgramResponse.headers.get('dg-request-id'),
      });
      response.status(deepgramResponse.status >= 500 ? 502 : deepgramResponse.status)
        .json({ error: 'No se pudo generar la voz en este momento.' });
      return;
    }

    const audio = Buffer.from(await deepgramResponse.arrayBuffer());
    if (audio.byteLength === 0) {
      response.status(502).json({ error: 'El servicio de voz devolvió un audio vacío.' });
      return;
    }

    response.setHeader('Content-Type', deepgramResponse.headers.get('content-type') ?? 'audio/mpeg');
    response.status(200).end(audio);
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    response.status(isTimeout ? 504 : 502).json({
      error: isTimeout
        ? 'La generación de voz ha tardado demasiado.'
        : 'No se pudo conectar con el servicio de voz.',
    });
  } finally {
    clearTimeout(timeout);
  }
};
