import { createClient } from '@supabase/supabase-js';

const MONTH_SEGMENTS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&Aacute;/g, 'A')
    .replace(/&aacute;/g, 'a')
    .replace(/&Eacute;/g, 'E')
    .replace(/&eacute;/g, 'e')
    .replace(/&Iacute;/g, 'I')
    .replace(/&iacute;/g, 'i')
    .replace(/&Oacute;/g, 'O')
    .replace(/&oacute;/g, 'o')
    .replace(/&Uacute;/g, 'U')
    .replace(/&uacute;/g, 'u')
    .replace(/&Ntilde;/g, 'N')
    .replace(/&ntilde;/g, 'n')
    .replace(/&uuml;/g, 'u');
}

function htmlToPlainText(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\r/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

function formatUsccbPath(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}${dd}${yy}`;
}

function extractUsccbMain(html) {
  const start = html.search(/Reading\s+1/i);
  const end = html.search(/Lectionary for Mass/i);
  if (start !== -1 && end !== -1 && end > start) {
    return html.slice(start, end);
  }
  return html;
}

async function fetchUsccbReadings(date) {
  const path = formatUsccbPath(date);
  const url = `https://bible.usccb.org/bible/readings/${path}.cfm`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const html = await response.text();
  const main = extractUsccbMain(html);
  return {
    url,
    html,
    plainText: htmlToPlainText(main),
  };
}

async function fetchLaudesHtml(date) {
  const year = date.getFullYear();
  const month = MONTH_SEGMENTS[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const base = `https://liturgiadelashoras.github.io/sync/${year}/${month}/${day}`;
  const candidates = [`${base}/laudes.htm`, `${base}/1/laudes.htm`, `${base}/2/laudes.htm`, `${base}/3/laudes.htm`];

  for (const url of candidates) {
    const response = await fetch(url);
    if (response.ok) {
      return { url, html: await response.text() };
    }
  }

  return { url: candidates[0], html: null };
}

async function main() {
  const supabaseUrl = getEnv('SUPABASE_URL');
  const supabaseServiceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  let inserted = 0;
  let missingSource = 0;

  for (let i = 0; i < 365; i += 1) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    const result = await fetchLaudesHtml(current);
    const hasLaudesSource = Boolean(result && result.html);
    let fallbackReadings = null;
    if (!hasLaudesSource) {
      fallbackReadings = await fetchUsccbReadings(current);
    }

    if (!hasLaudesSource && !fallbackReadings) {
      missingSource += 1;
    }

    const hasAnySource = hasLaudesSource || Boolean(fallbackReadings);

    const payload = {
      prayer_date: formatDate(current),
      source_url: hasLaudesSource ? result.url : (fallbackReadings?.url ?? result.url),
      raw_html: hasLaudesSource
        ? result.html
        : (fallbackReadings?.html ?? '<!-- MISSING_SOURCE -->'),
      plain_text: hasLaudesSource
        ? htmlToPlainText(result.html)
        : fallbackReadings
          ? `[USCCB_DAILY_READINGS]\n${fallbackReadings.plainText}`
          : '[MISSING_SOURCE] Texto de Laudes no disponible en origen para esta fecha.',
      fetched_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('laudes_texts').upsert(payload, { onConflict: 'prayer_date' });
    if (error) {
      throw new Error(`Failed upsert for ${payload.prayer_date}: ${error.message}`);
    }

    inserted += 1;
    if (inserted % 25 === 0) {
      process.stdout.write(`Inserted ${inserted} rows...\n`);
    }
  }

  process.stdout.write(`Done. inserted=${inserted}, missing_source=${missingSource}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
