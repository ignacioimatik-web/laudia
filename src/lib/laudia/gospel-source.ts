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
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function readEvangelizo(params: URLSearchParams): Promise<string> {
  const url = `https://feed.evangelizo.org/v2/reader.php?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al consultar Evangelizo: ${response.status}`);
  }
  return response.text();
}

export async function fetchDailyGospel(date: Date): Promise<GospelDayData> {
  const ymd = formatYmd(date);

  const base = new URLSearchParams({ date: ymd, lang: 'SP' });

  const liturgicalTitle = await readEvangelizo(new URLSearchParams({ ...Object.fromEntries(base), type: 'liturgic_t' }));
  const readingTitle = await readEvangelizo(new URLSearchParams({ ...Object.fromEntries(base), type: 'reading_lt', content: 'GSP' }));
  const text = await readEvangelizo(new URLSearchParams({ ...Object.fromEntries(base), type: 'reading', content: 'GSP' }));

  return {
    date: ymd,
    liturgicalTitle: normalizeReaderText(liturgicalTitle),
    readingTitle: normalizeReaderText(readingTitle),
    text: normalizeReaderText(text),
  };
}
