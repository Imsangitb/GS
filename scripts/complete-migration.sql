-- Check if indexes exist and create them if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_addresses_user_id') THEN
        CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_addresses_is_default') THEN
        CREATE INDEX idx_user_addresses_is_default ON user_addresses(is_default);
    END IF;
END
$$;

-- Make sure Row Level Security is enabled
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Add policies only if they don't exist already
DO $$
BEGIN
    -- Check if select policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_addresses' AND policyname = 'user_addresses_select_policy') THEN
        CREATE POLICY user_addresses_select_policy ON user_addresses FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    -- Check if insert policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_addresses' AND policyname = 'user_addresses_insert_policy') THEN
        CREATE POLICY user_addresses_insert_policy ON user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- Check if update policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_addresses' AND policyname = 'user_addresses_update_policy') THEN
        CREATE POLICY user_addresses_update_policy ON user_addresses FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    -- Check if delete policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_addresses' AND policyname = 'user_addresses_delete_policy') THEN
        CREATE POLICY user_addresses_delete_policy ON user_addresses FOR DELETE USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Create default address management function and trigger if they don't exist
CREATE OR REPLACE FUNCTION set_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE user_addresses SET is_default = FALSE WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if trigger already exists and create it if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_default_address_trigger') THEN
        CREATE TRIGGER set_default_address_trigger
        BEFORE INSERT OR UPDATE ON user_addresses
        FOR EACH ROW EXECUTE FUNCTION set_default_address();
    END IF;
END
$$;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';