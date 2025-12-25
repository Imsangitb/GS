-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the user_addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  apartment TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipCode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default ON user_addresses(is_default);

-- Enable Row Level Security
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY user_addresses_select_policy ON user_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_addresses_insert_policy ON user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_addresses_update_policy ON user_addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY user_addresses_delete_policy ON user_addresses FOR DELETE USING (auth.uid() = user_id);

-- Create function for default address management
CREATE OR REPLACE FUNCTION set_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE user_addresses SET is_default = FALSE WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER set_default_address_trigger
BEFORE INSERT OR UPDATE ON user_addresses
FOR EACH ROW EXECUTE FUNCTION set_default_address();

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';