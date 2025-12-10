/**
 * FOMÍ - Tipos Unificados (Limpo)
 * 
 * Tipos de banco derivam de supabase.ts (auto-gerado).
 * Tipos de UI são definidos aqui.
 * 
 * REGRA: Nunca duplicar tipos. Sempre derivar ou re-exportar.
 */

// ============================================================================
// RE-EXPORTS DO SUPABASE
// ============================================================================

export type { Database, Json } from './supabase';

import type { Database } from './supabase';

type Tables = Database['public']['Tables'];

// Tipos de tabelas derivados
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
// TIPOS DE UI
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
  slug?: string;
  image: string | null;
  cover_image?: string | null;
  gallery?: string[];
  description?: string | null;
  longDescription?: string | null;
  tags?: RestaurantTag[];
  rating?: number;
  reviewCount?: number;
  distance?: string | null;
  price?: string | null;
  priceRange?: number | null;
  address?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  phone?: string | null;
  website?: string | null;
  hours?: Record<string, unknown> | null;
  cuisineTypes?: string[];
  features?: string[];
  ratingsBreakdown?: {
    proposta?: number;
    comida?: number;
    apresentacao?: number;
    atendimento?: number;
    food?: number;
    service?: number;
    ambiance?: number;
  };
  latitude?: number | null;
  longitude?: number | null;
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
// TIPOS DE FUNCTIONS (Supabase RPC)
// ============================================================================

export type NearbyRestaurant = Database['public']['Functions']['nearby_restaurants']['Returns'][number];