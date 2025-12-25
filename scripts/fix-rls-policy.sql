-- Drop existing policies
DROP POLICY IF EXISTS user_addresses_insert_policy ON user_addresses;
DROP POLICY IF EXISTS user_addresses_select_policy ON user_addresses;
DROP POLICY IF EXISTS user_addresses_update_policy ON user_addresses;
DROP POLICY IF EXISTS user_addresses_delete_policy ON user_addresses;

-- Make sure RLS is enabled
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Create improved policies
-- INSERT policy - Allow insert if the user_id matches the authenticated user ID
CREATE POLICY user_addresses_insert_policy ON user_addresses 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text OR auth.uid() = user_id);

-- SELECT policy - Allow select if the user_id matches the authenticated user ID
CREATE POLICY user_addresses_select_policy ON user_addresses 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text OR auth.uid() = user_id);

-- UPDATE policy - Allow update if the user_id matches the authenticated user ID
CREATE POLICY user_addresses_update_policy ON user_addresses 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text OR auth.uid() = user_id);

-- DELETE policy - Allow delete if the user_id matches the authenticated user ID
CREATE POLICY user_addresses_delete_policy ON user_addresses 
  FOR DELETE 
  USING (auth.uid()::text = user_id::text OR auth.uid() = user_id);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';