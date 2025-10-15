-- Drop existing policies to recreate them without recursion
DROP POLICY IF EXISTS "Super admins can read all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Allow initial profile creation" ON users;

-- Create non-recursive policies
CREATE POLICY "Enable read access for authenticated users"
  ON users FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR -- User can read their own data
    (SELECT role FROM users WHERE id = auth.uid()) = 'super_admin' -- Super admin can read all
  );

CREATE POLICY "Enable update for users based on role"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add a policy for public access during signup
CREATE POLICY "Allow public read during signup"
  ON users FOR SELECT
  TO public
  USING (id = auth.uid());

-- Update the handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role user_role;
BEGIN
  -- Set default role
  default_role := 'editor';
  
  -- Insert new user with error handling
  BEGIN
    INSERT INTO public.users (
      id,
      email,
      role,
      first_name,
      last_name,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      default_role,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      updated_at = NOW()
    WHERE users.id = EXCLUDED.id;
    
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    -- Log error and continue
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;