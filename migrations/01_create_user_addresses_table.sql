-- Create user_addresses table for storing shipping addresses

-- Enable UUID extension if not already enabled
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

-- Create indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default ON user_addresses(is_default);

-- Create an RLS policy for user addresses
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Users can only read their own addresses
CREATE POLICY user_addresses_select_policy
  ON user_addresses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own addresses
CREATE POLICY user_addresses_insert_policy
  ON user_addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own addresses
CREATE POLICY user_addresses_update_policy
  ON user_addresses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own addresses
CREATE POLICY user_addresses_delete_policy
  ON user_addresses
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to ensure only one default address per user
CREATE OR REPLACE FUNCTION set_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE user_addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to ensure only one default address
CREATE TRIGGER set_default_address_trigger
BEFORE INSERT OR UPDATE ON user_addresses
FOR EACH ROW
EXECUTE FUNCTION set_default_address();
