import { createClient } from '@supabase/supabase-js';

const MONTH_SEGMENTS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function htmlToPlainText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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

  return null;
}

async function main() {
  const supabase = createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

  const { data: rows, error } = await supabase
    .from('laudes_texts')
    .select('prayer_date,plain_text')
    .like('plain_text', '[MISSING_SOURCE]%')
    .order('prayer_date', { ascending: true });

  if (error) {
    throw new Error(`Failed loading missing rows: ${error.message}`);
  }

  if (!rows || rows.length === 0) {
    process.stdout.write('No rows marked as missing.\n');
    return;
  }

  let filled = 0;
  for (const row of rows) {
    const date = new Date(`${row.prayer_date}T00:00:00`);
    const source = await fetchLaudesHtml(date);
    if (!source) continue;

    const { error: updateError } = await supabase
      .from('laudes_texts')
      .update({
        source_url: source.url,
        raw_html: source.html,
        plain_text: htmlToPlainText(source.html),
        fetched_at: new Date().toISOString(),
      })
      .eq('prayer_date', row.prayer_date);

    if (updateError) {
      throw new Error(`Failed updating ${row.prayer_date}: ${updateError.message}`);
    }

    filled += 1;
  }

  process.stdout.write(`Done. checked=${rows.length}, filled=${filled}\n`);
}

main().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
