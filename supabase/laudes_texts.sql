create table if not exists public.laudes_texts (
  prayer_date date primary key,
  source_url text not null,
  raw_html text not null,
  plain_text text not null,
  fetched_at timestamptz not null default now()
);

create index if not exists laudes_texts_fetched_at_idx
  on public.laudes_texts (fetched_at desc);
