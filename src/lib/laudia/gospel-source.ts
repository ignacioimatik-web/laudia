type GospelDayData = {
  date: string;
  liturgicalTitle: string;
  readingTitle: string;
  text: string;
};

function formatYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function normalizeReaderText(raw: string): string {
  const withoutTags = raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const textarea = document.createElement('textarea');
  textarea.innerHTML = withoutTags;
  return textarea.value;
}

async function readEvangelizo(params: URLSearchParams, signal?: AbortSignal): Promise<string> {
  const url = `https://feed.evangelizo.org/v2/reader.php?${params.toString()}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Error al consultar Evangelizo: ${response.status}`);
  }
  return response.text();
}

export async function fetchDailyGospel(date: Date): Promise<GospelDayData> {
  const ymd = formatYmd(date);
  const base = new URLSearchParams({ date: ymd, lang: 'SP' });
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);

  try {
    const [liturgicalTitle, readingTitle, text] = await Promise.all([
      readEvangelizo(new URLSearchParams({ ...Object.fromEntries(base), type: 'liturgic_t' }), controller.signal),
      readEvangelizo(new URLSearchParams({ ...Object.fromEntries(base), type: 'reading_lt', content: 'GSP' }), controller.signal),
      readEvangelizo(new URLSearchParams({ ...Object.fromEntries(base), type: 'reading', content: 'GSP' }), controller.signal),
    ]);

    return {
      date: ymd,
      liturgicalTitle: normalizeReaderText(liturgicalTitle),
      readingTitle: normalizeReaderText(readingTitle),
      text: normalizeReaderText(text),
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
