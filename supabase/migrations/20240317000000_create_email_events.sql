
-- Safely handle enum types (only create if they don't exist)
DO $$ 
BEGIN
    -- Create email_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_status') THEN
        CREATE TYPE email_status AS ENUM ('unread', 'read', 'archived', 'deleted');
    END IF;

    -- Create email_thread_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'email_thread_status') THEN
        CREATE TYPE email_thread_status AS ENUM ('active', 'archived', 'deleted');
    END IF;
END
$$;

-- Fix email_logs foreign key constraint
ALTER TABLE IF EXISTS email_logs 
    DROP CONSTRAINT IF EXISTS email_logs_template_id_fkey;

ALTER TABLE IF EXISTS email_logs
    ADD CONSTRAINT email_logs_template_id_fkey 
    FOREIGN KEY (template_id) 
    REFERENCES email_templates(id)
    ON DELETE SET NULL;

-- Create email_events table
CREATE TABLE IF NOT EXISTS email_events (
  id uuid default gen_random_uuid() primary key,
  message_id text not null,
  event_type text not null,
  timestamp timestamptz not null,
  raw_data jsonb not null,
  created_at timestamptz default now() not null
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS email_events_message_id_idx ON email_events(message_id);
CREATE INDEX IF NOT EXISTS email_events_event_type_idx ON email_events(event_type);
CREATE INDEX IF NOT EXISTS email_events_timestamp_idx ON email_events(timestamp);

-- Add RLS policies
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view email events
create policy "Users can view email events"
  on email_events for select
  to authenticated
  using (true);

-- Only service role can insert email events
create policy "Service role can insert email events"
  on email_events for insert
  to service_role
  with check (true);

-- Ensure proper permissions
GRANT SELECT ON email_events TO authenticated;
GRANT INSERT ON email_events TO service_role;
