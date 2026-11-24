create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  lang text not null,
  source text not null,
  link text unique not null,
  title text not null,
  snippet text,
  image text,
  published_at timestamptz not null,
  cluster_id uuid not null,
  is_factcheck boolean default false,
  category text,
  title_en text, title_hi text,
  summary_en text, summary_hi text,
  breaking boolean default false,
  video_id text,
  processed boolean default false,
  created_at timestamptz default now()
);
create index if not exists stories_pub on stories (published_at desc);
create index if not exists stories_cluster on stories (cluster_id);
alter table stories enable row level security;
