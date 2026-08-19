-- 0003_user_vault_and_admin.sql
-- Encrypted User Document Vault and Admin Compliance Logs

create table if not exists user_documents (
  id serial primary key,
  user_id text not null,
  title text not null,
  category text not null,
  document_number_masked text not null,
  encrypted_data text not null,
  file_name text not null,
  file_size_bytes integer not null default 0,
  file_mime_type text not null,
  file_sha256 text not null,
  issue_date text,
  expiry_date text,
  notes text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_documents_user_idx on user_documents (user_id);
create index if not exists user_documents_expiry_idx on user_documents (expiry_date);

create table if not exists audit_logs (
  id serial primary key,
  actor_user_id text not null,
  actor_email text not null,
  action text not null,
  target_user_id text,
  details text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx on audit_logs (created_at desc);
