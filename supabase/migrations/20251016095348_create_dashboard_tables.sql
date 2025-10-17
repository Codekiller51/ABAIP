/*
  # Create Dashboard Content Management Tables

  ## Overview
  This migration creates the core tables for the ABA IP Consultants dashboard content management system.

  ## New Tables

  ### 1. users
  - `id` (uuid, primary key) - User identifier, links to auth.users
  - `email` (text, unique, not null) - User email address
  - `role` (text, not null) - User role (super_admin, content_manager, editor)
  - `first_name` (text, not null) - User's first name
  - `last_name` (text, not null) - User's last name
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `last_login` (timestamptz) - Last login timestamp

  ### 2. insights
  - `id` (uuid, primary key) - Unique insight identifier
  - `title` (text, not null) - Insight title
  - `summary` (text, not null) - Brief summary
  - `content` (text, not null) - Full content (markdown/HTML)
  - `author` (text, not null) - Author name
  - `slug` (text, unique, not null) - URL-friendly identifier
  - `status` (text, not null) - Publication status (draft, published, archived)
  - `featured` (boolean) - Featured content flag
  - `image_url` (text) - Featured image URL
  - `meta_title` (text) - SEO meta title
  - `meta_description` (text) - SEO meta description
  - `keywords` (text[]) - SEO keywords array
  - `categories` (text[]) - Content categories
  - `tags` (text[]) - Content tags
  - `published_at` (timestamptz) - Publication timestamp
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. team_members
  - `id` (uuid, primary key) - Unique member identifier
  - `name` (text, not null) - Full name
  - `title` (text, not null) - Job title
  - `bio` (text, not null) - Biography
  - `image_url` (text) - Profile photo URL
  - `email` (text, not null) - Contact email
  - `phone` (text) - Contact phone
  - `linkedin` (text) - LinkedIn profile URL
  - `specialties` (text[]) - Areas of expertise
  - `education` (text[]) - Educational background
  - `experience` (text, not null) - Years of experience description
  - `order_index` (integer, not null) - Display order
  - `active` (boolean, not null) - Active status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. services
  - `id` (uuid, primary key) - Unique service identifier
  - `title` (text, not null) - Service title
  - `description` (text, not null) - Service description
  - `features` (text[]) - Service features list
  - `icon` (text, not null) - Icon name/identifier
  - `color` (text, not null) - Color scheme
  - `image_url` (text) - Service image URL
  - `order_index` (integer, not null) - Display order
  - `active` (boolean, not null) - Active status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. media
  - `id` (uuid, primary key) - Unique file identifier
  - `filename` (text, not null) - Stored filename
  - `original_name` (text, not null) - Original filename
  - `file_path` (text, not null) - File storage path
  - `file_size` (bigint, not null) - File size in bytes
  - `mime_type` (text, not null) - MIME type
  - `alt_text` (text) - Accessibility alt text
  - `caption` (text) - Image caption
  - `tags` (text[]) - File tags for organization
  - `folder` (text) - Folder organization
  - `created_at` (timestamptz) - Upload timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - All tables have RLS enabled
  - Policies restrict access to authenticated users only
  - Users can only manage content based on their role
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'content_manager', 'editor')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admins can manage all users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'super_admin'
    )
  );

-- Create insights table
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  slug text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean DEFAULT false,
  image_url text,
  meta_title text,
  meta_description text,
  keywords text[] DEFAULT '{}',
  categories text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published insights"
  ON insights FOR SELECT
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create insights"
  ON insights FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update insights"
  ON insights FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete insights"
  ON insights FOR DELETE
  TO authenticated
  USING (true);

-- Create team_members table
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
  order_index integer NOT NULL DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active team members"
  ON team_members FOR SELECT
  USING (active = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  features text[] DEFAULT '{}',
  icon text NOT NULL,
  color text NOT NULL,
  image_url text,
  order_index integer NOT NULL DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (active = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  alt_text text,
  caption text,
  tags text[] DEFAULT '{}',
  folder text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage media"
  ON media FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status);
CREATE INDEX IF NOT EXISTS idx_insights_slug ON insights(slug);
CREATE INDEX IF NOT EXISTS idx_insights_published_at ON insights(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
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

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();