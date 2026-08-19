-- 47 Say Ab Tak content schema
create table if not exists categories (
  id          serial primary key,
  slug        text not null unique,
  name        text not null,
  description text not null,
  icon        text not null,
  sort_order  integer not null default 0
);

create table if not exists guides (
  id               serial primary key,
  slug             text not null unique,
  category_id      integer not null references categories(id),
  title            text not null,
  summary          text not null,
  department       text not null,
  processing_time  text not null,
  biometric        text not null,
  difficulty       text not null,
  last_updated     text not null,
  disclaimer       text not null,
  sort_order       integer not null default 0
);

create table if not exists guide_documents (
  id        serial primary key,
  guide_id  integer not null references guides(id) on delete cascade,
  section   text not null,
  item      text not null,
  sort_order integer not null default 0
);

create table if not exists guide_steps (
  id          serial primary key,
  guide_id    integer not null references guides(id) on delete cascade,
  step_number integer not null,
  title       text not null,
  body        text not null
);

create table if not exists guide_mistakes (
  id        serial primary key,
  guide_id  integer not null references guides(id) on delete cascade,
  item      text not null,
  sort_order integer not null default 0
);

create table if not exists news_posts (
  id           serial primary key,
  slug         text not null unique,
  title        text not null,
  excerpt      text not null,
  body         text not null,
  tag          text not null,
  published_at text not null
);

create table if not exists timeline_events (
  id         serial primary key,
  year_label text not null,
  title      text not null,
  body       text not null,
  sort_order integer not null default 0
);

create table if not exists saved_checks (
  id         serial primary key,
  user_id    text not null,
  guide_slug text not null,
  item_key   text not null,
  created_at timestamptz not null default now(),
  unique (user_id, guide_slug, item_key)
);
create index if not exists saved_checks_user_idx on saved_checks (user_id);
