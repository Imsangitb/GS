-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create or modify user_addresses table with all fields needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_addresses') THEN
    CREATE TABLE user_addresses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      firstname TEXT,
      lastname TEXT,
      email TEXT,
      phone TEXT,
      address TEXT NOT NULL,
      apartment TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zipcode TEXT NOT NULL,
      country TEXT DEFAULT 'India',
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
    CREATE INDEX idx_user_addresses_is_default ON user_addresses(is_default);

    -- Enable Row Level Security
    ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

    -- Create security policies
    CREATE POLICY user_addresses_select_policy ON user_addresses FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY user_addresses_insert_policy ON user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY user_addresses_update_policy ON user_addresses FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY user_addresses_delete_policy ON user_addresses FOR DELETE USING (auth.uid() = user_id);

    RAISE NOTICE 'Created user_addresses table with all fields';
  ELSE
    -- If table exists but missing required columns, add them
    BEGIN
      IF NOT EXISTS (SELECT FROM information_schema.columns 
                     WHERE table_name = 'user_addresses' AND column_name = 'firstname') THEN
        ALTER TABLE user_addresses ADD COLUMN firstname TEXT;
        RAISE NOTICE 'Added firstname column';
      END IF;

      IF NOT EXISTS (SELECT FROM information_schema.columns 
                     WHERE table_name = 'user_addresses' AND column_name = 'lastname') THEN
        ALTER TABLE user_addresses ADD COLUMN lastname TEXT;
        RAISE NOTICE 'Added lastname column';
      END IF;

      IF NOT EXISTS (SELECT FROM information_schema.columns 
                     WHERE table_name = 'user_addresses' AND column_name = 'email') THEN
        ALTER TABLE user_addresses ADD COLUMN email TEXT;
        RAISE NOTICE 'Added email column';
      END IF;

      IF NOT EXISTS (SELECT FROM information_schema.columns 
                     WHERE table_name = 'user_addresses' AND column_name = 'phone') THEN
        ALTER TABLE user_addresses ADD COLUMN phone TEXT;
        RAISE NOTICE 'Added phone column';
      END IF;

      IF NOT EXISTS (SELECT FROM information_schema.columns 
                     WHERE table_name = 'user_addresses' AND column_name = 'country') THEN
        ALTER TABLE user_addresses ADD COLUMN country TEXT DEFAULT 'India';
        RAISE NOTICE 'Added country column';
      END IF;

      -- Fix zipCode to zipcode if needed
      IF EXISTS (SELECT FROM information_schema.columns 
                WHERE table_name = 'user_addresses' AND column_name = 'zipCode') AND
         NOT EXISTS (SELECT FROM information_schema.columns 
                    WHERE table_name = 'user_addresses' AND column_name = 'zipcode') THEN
        ALTER TABLE user_addresses RENAME COLUMN "zipCode" TO zipcode;
        RAISE NOTICE 'Renamed zipCode to zipcode';
      END IF;
    EXCEPTION
      WHEN others THEN
        RAISE NOTICE 'Error updating existing table: %', SQLERRM;
    END;
  END IF;
END
$$;

-- Create default address management function and trigger
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

-- Make sure Row Level Security is enabled
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist
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

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';