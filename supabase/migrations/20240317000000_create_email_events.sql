
create table if not exists email_events (
  id uuid default gen_random_uuid() primary key,
  message_id text not null,
  event_type text not null,
  timestamp timestamptz not null,
  raw_data jsonb not null,
  created_at timestamptz default now() not null
);

-- Add indexes for common queries
create index if not exists email_events_message_id_idx on email_events(message_id);
create index if not exists email_events_event_type_idx on email_events(event_type);
create index if not exists email_events_timestamp_idx on email_events(timestamp);

-- Add RLS policies
alter table email_events enable row level security;

-- Only authenticated users can view email events
create policy "Users can view email events"
  on email_events for select
  to authenticated
  using (true);

-- Only service role can insert email events
create policy "Service role can insert email events"
  on email_events for insert
  to service_role
  using (true);
