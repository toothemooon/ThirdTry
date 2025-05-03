export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          is_admin: boolean
        }
        Insert: {
          id: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          is_admin?: boolean
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string | null
          excerpt: string | null
          cover_image: string | null
          published_at: string | null
          author_id: string
          is_published: boolean
          views: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content?: string | null
          excerpt?: string | null
          cover_image?: string | null
          published_at?: string | null
          author_id: string
          is_published?: boolean
          views?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string | null
          excerpt?: string | null
          cover_image?: string | null
          published_at?: string | null
          author_id?: string
          is_published?: boolean
          views?: number
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
        }
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
      comments: {
        Row: {
          id: string
          created_at: string
          post_id: string
          user_id: string
          content: string
          is_approved: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          post_id: string
          user_id: string
          content: string
          is_approved?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          post_id?: string
          user_id?: string
          content?: string
          is_approved?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
