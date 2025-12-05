export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: unknown | null;
          city: string | null;
          preferences: Record<string, unknown>;
          followers_count: number;
          following_count: number;
          reviews_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          preferences?: Record<string, unknown>;
        };
        Update: {
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          preferences?: Record<string, unknown>;
        };
      };
      restaurants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          long_description: string | null;
          location: unknown;
          address: string;
          city: string;
          neighborhood: string | null;
          phone: string | null;
          website: string | null;
          hours: Record<string, unknown>;
          price_range: number | null;
          cuisine_types: string[];
          features: string[];
          cover_image: string | null;
          gallery: string[];
          rating_avg: number;
          rating_food: number;
          rating_service: number;
          rating_ambiance: number;
          reviews_count: number;
          saves_count: number;
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['restaurants']['Row'], 'id' | 'created_at' | 'updated_at' | 'rating_avg' | 'rating_food' | 'rating_service' | 'rating_ambiance' | 'reviews_count' | 'saves_count'>;
        Update: Partial<Database['public']['Tables']['restaurants']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          rating_overall: number;
          rating_food: number | null;
          rating_service: number | null;
          rating_ambiance: number | null;
          text: string | null;
          tags: string[];
          photos: string[];
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          restaurant_id: string;
          rating_overall: number;
          rating_food?: number | null;
          rating_service?: number | null;
          rating_ambiance?: number | null;
          text?: string | null;
          tags?: string[];
          photos?: string[];
        };
        Update: Partial<Omit<Database['public']['Tables']['reviews']['Insert'], 'user_id' | 'restaurant_id'>>;
      };
      saved_restaurants: {
        Row: {
          id: string;
          user_id: string;
          restaurant_id: string;
          list_name: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          restaurant_id: string;
          list_name?: string;
        };
        Update: {
          list_name?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
        };
        Update: never;
      };
      review_likes: {
        Row: {
          id: string;
          user_id: string;
          review_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          review_id: string;
        };
        Update: never;
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          type: 'review' | 'save' | 'follow' | 'like';
          reference_id: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: 'review' | 'save' | 'follow' | 'like';
          reference_id: string;
          metadata?: Record<string, unknown>;
        };
        Update: never;
      };
    };
    Functions: {
      nearby_restaurants: {
        Args: {
          user_lat: number;
          user_lng: number;
          radius_km?: number;
          limit_count?: number;
        };
        Returns: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          address: string;
          cover_image: string | null;
          price_range: number | null;
          cuisine_types: string[];
          rating_avg: number;
          reviews_count: number;
          distance_km: number;
        }[];
      };
    };
  };
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Restaurant = Database['public']['Tables']['restaurants']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type SavedRestaurant = Database['public']['Tables']['saved_restaurants']['Row'];
export type Follow = Database['public']['Tables']['follows']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
export type NearbyRestaurant = Database['public']['Functions']['nearby_restaurants']['Returns'][number];