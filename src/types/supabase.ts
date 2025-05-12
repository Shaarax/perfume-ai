export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          id: number
          name: string
          country: string | null
        }
        Insert: {
          id?: number
          name: string
          country?: string | null
        }
        Update: {
          id?: number
          name?: string
          country?: string | null
        }
      }
      perfumes: {
        Row: {
          id: number
          name: string
          brand_id: number | null
          release_year: number | null
          gender: 'male' | 'female' | 'unisex' | null
          price: number | null
          image_url: string | null
          description: string | null
        }
        Insert: {
          id?: number
          name: string
          brand_id?: number | null
          release_year?: number | null
          gender?: 'male' | 'female' | 'unisex' | null
          price?: number | null
          image_url?: string | null
          description?: string | null
        }
        Update: {
          id?: number
          name?: string
          brand_id?: number | null
          release_year?: number | null
          gender?: 'male' | 'female' | 'unisex' | null
          price?: number | null
          image_url?: string | null
          description?: string | null
        }
      }
      notes: {
        Row: {
          id: number
          name: string
          note_type: 'top' | 'middle' | 'base' | null
        }
        Insert: {
          id?: number
          name: string
          note_type?: 'top' | 'middle' | 'base' | null
        }
        Update: {
          id?: number
          name?: string
          note_type?: 'top' | 'middle' | 'base' | null
        }
      }
      perfume_notes: {
        Row: {
          id: number
          perfume_id: number
          note_id: number
        }
        Insert: {
          id?: number
          perfume_id: number
          note_id: number
        }
        Update: {
          id?: number
          perfume_id?: number
          note_id?: number
        }
      }
      perfumers: {
        Row: {
          id: number
          name: string
          bio: string | null
          image_url: string | null
        }
        Insert: {
          id?: number
          name: string
          bio?: string | null
          image_url?: string | null
        }
        Update: {
          id?: number
          name?: string
          bio?: string | null
          image_url?: string | null
        }
      }
      perfume_perfumers: {
        Row: {
          id: number
          perfume_id: number
          perfumer_id: number
        }
        Insert: {
          id?: number
          perfume_id: number
          perfumer_id: number
        }
        Update: {
          id?: number
          perfume_id?: number
          perfumer_id?: number
        }
      }
      clone_relationships: {
        Row: {
          id: number
          original_perfume_id: number
          clone_perfume_id: number
          similarity_score: number | null
        }
        Insert: {
          id?: number
          original_perfume_id: number
          clone_perfume_id: number
          similarity_score?: number | null
        }
        Update: {
          id?: number
          original_perfume_id?: number
          clone_perfume_id?: number
          similarity_score?: number | null
        }
      }
      performance_metrics: {
        Row: {
          id: number
          perfume_id: number
          longevity: 'poor' | 'moderate' | 'long' | 'very long' | null
          sillage: 'soft' | 'moderate' | 'heavy' | 'enormous' | null
          overall_rating: number | null
        }
        Insert: {
          id?: number
          perfume_id: number
          longevity?: 'poor' | 'moderate' | 'long' | 'very long' | null
          sillage?: 'soft' | 'moderate' | 'heavy' | 'enormous' | null
          overall_rating?: number | null
        }
        Update: {
          id?: number
          perfume_id?: number
          longevity?: 'poor' | 'moderate' | 'long' | 'very long' | null
          sillage?: 'soft' | 'moderate' | 'heavy' | 'enormous' | null
          overall_rating?: number | null
        }
      }
      season_tags: {
        Row: {
          id: number
          perfume_id: number
          season: 'spring' | 'summer' | 'fall' | 'winter' | null
        }
        Insert: {
          id?: number
          perfume_id: number
          season?: 'spring' | 'summer' | 'fall' | 'winter' | null
        }
        Update: {
          id?: number
          perfume_id?: number
          season?: 'spring' | 'summer' | 'fall' | 'winter' | null
        }
      }
      occasion_tags: {
        Row: {
          id: number
          perfume_id: number
          occasion: 'casual' | 'formal' | 'date' | 'office' | 'party' | null
        }
        Insert: {
          id?: number
          perfume_id: number
          occasion?: 'casual' | 'formal' | 'date' | 'office' | 'party' | null
        }
        Update: {
          id?: number
          perfume_id?: number
          occasion?: 'casual' | 'formal' | 'date' | 'office' | 'party' | null
        }
      }
      mood_tags: {
        Row: {
          id: number
          perfume_id: number
          mood: 'romantic' | 'energizing' | 'relaxing' | 'mysterious' | null
        }
        Insert: {
          id?: number
          perfume_id: number
          mood?: 'romantic' | 'energizing' | 'relaxing' | 'mysterious' | null
        }
        Update: {
          id?: number
          perfume_id?: number
          mood?: 'romantic' | 'energizing' | 'relaxing' | 'mysterious' | null
        }
      }
      reviews: {
        Row: {
          id: number
          perfume_id: number
          source: string | null
          review_text: string | null
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: number
          perfume_id: number
          source?: string | null
          review_text?: string | null
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          perfume_id?: number
          source?: string | null
          review_text?: string | null
          rating?: number | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: number
          user_id: string
          perfume_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          perfume_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          perfume_id?: number
          created_at?: string
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
  }
} 