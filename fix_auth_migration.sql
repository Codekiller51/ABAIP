/*
  # Fix Users Table Authentication Link

  ## Overview
  This migration fixes the users table to properly link with Supabase's auth.users table.

  ## Changes
  1. Drop the existing users table and recreate it with proper foreign key to auth.users
  2. Update the id column to reference auth.users instead of auto-generating UUIDs
  3. Recreate all policies with the correct structure
  4. Create trigger to auto-create user profiles on signup

  ## Important Notes
  - The users table will now properly sync with Supabase authentication
  - User records will be created automatically when users sign up
  - The id field now references auth.users(id) as a foreign key
*/

-- Drop existing users table and recreate with proper auth linkage
DROP TABLE IF EXISTS users CASCADE;

-- Create users table that extends auth.users
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'editor',
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Super admins can read all users
CREATE POLICY "Super admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'super_admin'
    )
  );

-- Recreate trigger for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, created_at, updated_at)
  VALUES (NEW.id, NEW.email, '', '', now(), now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Re-insert sample team member (if needed)
INSERT INTO team_members (name, title, bio, email, specialties, education, experience, order_index, active)
VALUES (
  'Angela M. Malando',
  'Managing Partner',
  'Experienced legal professional with a robust background in intellectual property management, corporate liability, and environmental laws. Demonstrates expertise in legal research, drafting, and analysis, with a strong focus on international law and alternative dispute resolution.',
  'angela@abaip.co.tz',
  ARRAY['Patent Law', 'Technology Licensing', 'IP Strategy'],
  ARRAY['Masters in IP', 'Post-Graduate Diploma in Legal Practice', 'LLB'],
  '10+ years',
  1,
  true
)
ON CONFLICT DO NOTHING;
