import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'super_admin' | 'content_manager' | 'editor'
          first_name: string
          last_name: string
          avatar_url?: string
          created_at: string
          updated_at: string
          last_login?: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'super_admin' | 'content_manager' | 'editor'
          first_name: string
          last_name: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
          last_login?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'super_admin' | 'content_manager' | 'editor'
          first_name?: string
          last_name?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
          last_login?: string
        }
      }
      insights: {
        Row: {
          id: string
          title: string
          summary: string
          content: string
          author: string
          published_at?: string
          created_at: string
          updated_at: string
          status: 'draft' | 'published' | 'archived'
          featured: boolean
          image_url?: string
          meta_title?: string
          meta_description?: string
          keywords?: string[]
          categories?: string[]
          tags?: string[]
          slug: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          content: string
          author: string
          published_at?: string
          created_at?: string
          updated_at?: string
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          image_url?: string
          meta_title?: string
          meta_description?: string
          keywords?: string[]
          categories?: string[]
          tags?: string[]
          slug: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          content?: string
          author?: string
          published_at?: string
          created_at?: string
          updated_at?: string
          status?: 'draft' | 'published' | 'archived'
          featured?: boolean
          image_url?: string
          meta_title?: string
          meta_description?: string
          keywords?: string[]
          categories?: string[]
          tags?: string[]
          slug?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          title: string
          bio: string
          image_url?: string
          email: string
          phone?: string
          linkedin?: string
          specialties: string[]
          education: string[]
          experience: string
          order_index: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          bio: string
          image_url?: string
          email: string
          phone?: string
          linkedin?: string
          specialties?: string[]
          education?: string[]
          experience: string
          order_index?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          bio?: string
          image_url?: string
          email?: string
          phone?: string
          linkedin?: string
          specialties?: string[]
          education?: string[]
          experience?: string
          order_index?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          features: string[]
          icon: string
          color: string
          image_url?: string
          order_index: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          features?: string[]
          icon: string
          color: string
          image_url?: string
          order_index?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          features?: string[]
          icon?: string
          color?: string
          image_url?: string
          order_index?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          filename: string
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          alt_text?: string
          caption?: string
          tags?: string[]
          folder?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          filename: string
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          alt_text?: string
          caption?: string
          tags?: string[]
          folder?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          filename?: string
          original_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          alt_text?: string
          caption?: string
          tags?: string[]
          folder?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}