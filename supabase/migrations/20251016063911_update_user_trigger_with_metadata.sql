/*
  # Update User Creation Trigger to Extract Metadata

  ## Overview
  This migration updates the handle_new_user trigger function to automatically extract
  first_name, last_name, and role from raw_user_meta_data during user registration.

  ## Changes
  1. Update handle_new_user function to read from NEW.raw_user_meta_data
  2. Extract first_name, last_name, and role from the metadata
  3. Use default values if metadata fields are not present
  
  ## Important Notes
  - The trigger will now automatically populate user profiles with data passed during signup
  - Default values: first_name='', last_name='', role='editor'
  - The RegisterForm passes this data in the options.data object during signUp
*/

-- Update the function to handle new user creation with metadata extraction
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_first_name text;
  user_last_name text;
  user_role user_role;
BEGIN
  -- Extract values from raw_user_meta_data with defaults
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'editor');

  -- Insert user profile with extracted metadata
  INSERT INTO public.users (id, email, first_name, last_name, role, created_at, updated_at)
  VALUES (NEW.id, NEW.email, user_first_name, user_last_name, user_role, now(), now());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;