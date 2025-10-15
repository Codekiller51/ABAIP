/*
  # Initial Dashboard Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (enum: super_admin, content_manager, editor)
      - `first_name` (text)
      - `last_name` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_login` (timestamp, optional)

    - `insights`
      - `id` (uuid, primary key)
      - `title` (text)
      - `summary` (text)
      - `content` (text)
      - `author` (text)
      - `published_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `status` (enum: draft, published, archived)
      - `featured` (boolean)
      - `image_url` (text, optional)
      - `meta_title` (text, optional)
      - `meta_description` (text, optional)
      - `keywords` (text array, optional)
      - `categories` (text array, optional)
      - `tags` (text array, optional)
      - `slug` (text, unique)

    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `title` (text)
      - `bio` (text)
      - `image_url` (text, optional)
      - `email` (text)
      - `phone` (text, optional)
      - `linkedin` (text, optional)
      - `specialties` (text array)
      - `education` (text array)
      - `experience` (text)
      - `order_index` (integer)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `services`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `features` (text array)
      - `icon` (text)
      - `color` (text)
      - `image_url` (text, optional)
      - `order_index` (integer)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `media`
      - `id` (uuid, primary key)
      - `filename` (text)
      - `original_name` (text)
      - `file_path` (text)
      - `file_size` (integer)
      - `mime_type` (text)
      - `alt_text` (text, optional)
      - `caption` (text, optional)
      - `tags` (text array, optional)
      - `folder` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'content_manager', 'editor');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'editor',
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Insights table
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status content_status DEFAULT 'draft',
  featured boolean DEFAULT false,
  image_url text,
  meta_title text,
  meta_description text,
  keywords text[],
  categories text[],
  tags text[],
  slug text UNIQUE NOT NULL
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  bio text NOT NULL,
  image_url text,
  email text NOT NULL,
  phone text,
  linkedin text,
  specialties text[] DEFAULT '{}',
  education text[] DEFAULT '{}',
  experience text NOT NULL,
  order_index integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  features text[] DEFAULT '{}',
  icon text NOT NULL,
  color text NOT NULL,
  image_url text,
  order_index integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  alt_text text,
  caption text,
  tags text[],
  folder text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Insights policies
CREATE POLICY "Anyone can read published insights"
  ON insights
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all insights"
  ON insights
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Content managers can manage insights"
  ON insights
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role IN ('super_admin', 'content_manager', 'editor')
    )
  );

-- Team members policies
CREATE POLICY "Anyone can read active team members"
  ON team_members
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Content managers can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role IN ('super_admin', 'content_manager')
    )
  );

-- Services policies
CREATE POLICY "Anyone can read active services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Content managers can manage services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role IN ('super_admin', 'content_manager')
    )
  );

-- Media policies
CREATE POLICY "Anyone can read media"
  ON media
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage media"
  ON media
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role IN ('super_admin', 'content_manager', 'editor')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status);
CREATE INDEX IF NOT EXISTS idx_insights_featured ON insights(featured);
CREATE INDEX IF NOT EXISTS idx_insights_published_at ON insights(published_at);
CREATE INDEX IF NOT EXISTS idx_insights_slug ON insights(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();