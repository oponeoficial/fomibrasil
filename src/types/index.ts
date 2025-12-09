/**
 * FOMÍ - Tipos Unificados
 * 
 * Este arquivo centraliza TODOS os tipos do sistema.
 * Tipos de banco derivam de supabase.ts (auto-gerado).
 * Tipos de UI são definidos localmente.
 * 
 * REGRA: Nunca duplicar tipos. Sempre derivar ou re-exportar.
 */

// ============================================================================
// RE-EXPORTS DO SUPABASE (tipos de banco)
// ============================================================================

export type { Database, Json } from './supabase';

// Tipos de tabelas (derivados do schema)
import type { Database } from './supabase';

type Tables = Database['public']['Tables'];

export type Profile = Tables['profiles']['Row'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type ProfileUpdate = Tables['profiles']['Update'];

export type DbRestaurant = Tables['restaurants']['Row'];
export type DbRestaurantInsert = Tables['restaurants']['Insert'];

export type Review = Tables['reviews']['Row'];
export type ReviewInsert = Tables['reviews']['Insert'];

export type SavedList = Tables['saved_lists']['Row'];
export type SavedListInsert = Tables['saved_lists']['Insert'];

export type SavedRestaurantRow = Tables['saved_restaurants']['Row'];
export type SavedRestaurantInsert = Tables['saved_restaurants']['Insert'];

// ============================================================================
// TIPOS DE UI (não existem no banco)
// ============================================================================

/** Tabs da navegação inferior */
export type TabId = 'home' | 'discover' | 'newreview' | 'activity' | 'profile';

/** Tag visual de restaurante */
export interface RestaurantTag {
  text: string;
  color: 'red' | 'green' | 'purple' | 'orange' | 'blue';
}

/** 
 * Restaurante para exibição no Feed/Cards
 * Combina dados do banco com campos calculados
 */
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  gallery: string[];
  description: string | null;
  longDescription: string | null;
  tags: RestaurantTag[];
  rating: number;
  reviewCount: number;
  distance: string | null;
  price: string | null;
  priceRange: number | null;
  address: string;
  neighborhood: string | null;
  city: string;
  phone: string | null;
  website: string | null;
  hours: Record<string, unknown> | null;
  cuisineTypes: string[];
  features: string[];
  ratingsBreakdown: {
    food: number;
    service: number;
    ambiance: number;
  };
  latitude: number | null;
  longitude: number | null;
}

/** Review para exibição */
export interface DisplayReview {
  id: string;
  user: string;
  userImage: string | null;
  rating: number;
  text: string | null;
  date: string;
  tags: string[];
  likes: number;
}

// ============================================================================
// TIPOS DE ONBOARDING
// ============================================================================

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
}

export interface UserPreferences {
  company: string[];
  mood: string[];
  restrictions: string[];
  budget: string | null;
}

export type OnboardingStep = 'welcome' | 'location' | 'preferences' | 'completed';

// ============================================================================
// TIPOS DE FILTRO
// ============================================================================

export type FilterCategoryType = 'who' | 'mood' | 'occasion' | 'cuisine' | 'price' | 'distance';

export interface FilterOption {
  id: string;
  label: string;
  icon?: string;
}

export interface FilterChip {
  id: string;
  label: string;
  icon: string;
  category: FilterCategoryType;
}

// ============================================================================
// TIPOS DE SAVED RESTAURANTS (UI)
// ============================================================================

export interface SavedRestaurant {
  id: string;
  restaurantId: string;
  listId: string;
  restaurantName: string;
  restaurantImage: string | null;
  restaurantAddress: string | null;
  restaurantRating: number | null;
  restaurantPrice: string | null;
  restaurantLatitude: number | null;
  restaurantLongitude: number | null;
  restaurantTags: RestaurantTag[];
  personalRating: number | null;
  personalNote: string | null;
  contextTags: string[];
  visited: boolean;
  visitedAt: string | null;
  visitCount: number;
  reminderEnabled: boolean;
  createdAt: string;
}

// ============================================================================
// HELPER: Converter DB → UI
// ============================================================================

/** Converte restaurante do banco para formato de UI */
export function dbToRestaurant(db: DbRestaurant, distance?: string): Restaurant {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    image: db.cover_image,
    gallery: db.gallery || [],
    description: db.description,
    longDescription: db.long_description,
    tags: parseTags(db.cuisine_types, db.price_range),
    rating: db.rating_avg || 0,
    reviewCount: db.reviews_count || 0,
    distance: distance || null,
    price: priceRangeToString(db.price_range),
    priceRange: db.price_range,
    address: db.address,
    neighborhood: db.neighborhood,
    city: db.city,
    phone: db.phone,
    website: db.website,
    hours: db.hours as Record<string, unknown> | null,
    cuisineTypes: db.cuisine_types || [],
    features: db.features || [],
    ratingsBreakdown: {
      food: db.rating_food || 0,
      service: db.rating_service || 0,
      ambiance: db.rating_ambiance || 0,
    },
    latitude: null, // PostGIS location seria parseado aqui se necessário
    longitude: null,
  };
}

/** Gera tags visuais a partir de dados do banco */
function parseTags(cuisineTypes: string[] | null, priceRange: number | null): RestaurantTag[] {
  const tags: RestaurantTag[] = [];
  
  // Primeira cuisine type como tag principal
  if (cuisineTypes && cuisineTypes.length > 0) {
    tags.push({ text: cuisineTypes[0], color: 'red' });
  }
  
  // Price range
  if (priceRange) {
    tags.push({ 
      text: '$'.repeat(priceRange), 
      color: 'green' 
    });
  }
  
  return tags;
}

/** Converte price_range numérico para string */
function priceRangeToString(range: number | null): string | null {
  if (!range) return null;
  return '$'.repeat(range);
}
// ============================================================================
// TIPOS DE FUNCTIONS (Supabase RPC)
// ============================================================================

/** Resultado da função nearby_restaurants */
export type NearbyRestaurant = Database['public']['Functions']['nearby_restaurants']['Returns'][number];
