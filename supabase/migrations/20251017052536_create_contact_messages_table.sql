/*
  # Create contact_messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, required) - Name of the person submitting the form
      - `email` (text, required) - Email address of the submitter
      - `company` (text, optional) - Company name
      - `phone` (text, optional) - Phone number
      - `subject` (text, required) - Subject/service of interest
      - `message` (text, required) - Message content
      - `is_read` (boolean, default false) - Track read/unread status
      - `created_at` (timestamptz) - Submission timestamp
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for authenticated users to view all contact messages
    - Add policy for authenticated users to update contact messages (mark as read)
    - Public users (unauthenticated) can insert contact messages
  
  3. Indexes
    - Create index on created_at for faster sorting
    - Create index on is_read for filtering
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public (unauthenticated) users to insert contact messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all contact messages
CREATE POLICY "Authenticated users can view all contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update contact messages (e.g., mark as read)
CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete contact messages
CREATE POLICY "Authenticated users can delete contact messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);