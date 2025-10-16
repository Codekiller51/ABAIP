/*
  # Remove User Trigger and Enable Application-Based User Creation

  ## Overview
  This migration removes the automatic trigger-based user creation and enables
  the application to directly insert user data after authentication. This is a
  simpler, more reliable approach when using Supabase authentication.

  ## Changes Made
  
  1. **Remove Trigger System**
     - Drop the `handle_new_user` trigger from auth.users
     - Drop the `handle_new_user()` function
  
  2. **Update RLS Policies**
     - Add policy to allow authenticated users to insert their own user record
     - Keep existing policies for SELECT and UPDATE operations
  
  ## Security
  - RLS remains enabled on the users table
  - Users can only insert a record with their own auth.uid()
  - Users can only view and update their own data
  
  ## Important Notes
  - The application must insert user data immediately after signup
  - This approach avoids trigger-related errors and race conditions
  - Simpler to debug and maintain than trigger-based approaches
*/

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create new INSERT policy that allows users to create their own profile
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure other policies exist (idempotent)
DO $$
BEGIN
  -- Check and create SELECT policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Check and create UPDATE policy if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data"
      ON users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;
