-- Enable Realtime for the orders table
-- This ensures that Supabase sends change events for this table

-- Check if the publication exists, and if not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

-- Add the orders table to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Ensure replication is set to FULL so that old values (like created_at) are sent on DELETE
ALTER TABLE orders REPLICA IDENTITY FULL;
