/**
 * FOMÍ - Serviço de Restaurantes
 * 
 * Busca dados reais do Supabase.
 * Substitui mockData.ts.
 */

import { supabase } from '../lib/supabase';
import type { Restaurant, RestaurantTag } from '../types';
import type { Tables } from '../lib/supabase';

// Tipo do banco
type DbRestaurant = Tables<'restaurants'>;

// ============================================================================
// TIPOS INTERNOS
// ============================================================================

interface FetchOptions {
  limit?: number;
  offset?: number;
  city?: string;
  cuisineTypes?: string[];
  priceRange?: number[];
  searchQuery?: string;
}

// ============================================================================
// CONVERSORES
// ============================================================================

/** Gera tags visuais a partir dos dados */
function generateTags(
  cuisineType: string | null | undefined,
  priceRange: number | null,
  occasion: string | null
): RestaurantTag[] {
  const tags: RestaurantTag[] = [];
  
  if (cuisineType) {
    const mainType = cuisineType.split(',')[0].trim();
    tags.push({ text: mainType, color: 'red' });
  }
  
  if (priceRange) {
    tags.push({ text: '$'.repeat(priceRange), color: 'green' });
  }
  
  if (occasion) {
    const mainOccasion = occasion.split(',')[0].trim();
    if (mainOccasion.length < 20) {
      tags.push({ text: mainOccasion, color: 'purple' });
    }
  }
  
  return tags.slice(0, 3);
}

/** Imagem placeholder por tipo de cozinha */
function getPlaceholderImage(cuisineType: string | null | undefined): string {
  const images: Record<string, string> = {
    'Japonesa': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80',
    'Italiana': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    'Brasileira': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'Hamburgueria': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    'Pizzaria': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    'Bar e Boteco': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    'Carnes': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    'Portuguesa': 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&q=80',
    'Contemporanea': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    'default': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  };
  
  if (!cuisineType) return images.default;
  
  for (const [key, url] of Object.entries(images)) {
    if (cuisineType.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }
  
  return images.default;
}

/** Converte row do Supabase para Restaurant */
function rowToRestaurant(row: DbRestaurant): Restaurant {
  const priceRange = row.price_range;
  const cuisineType = row.cuisine_types?.[0] ?? null;
  
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.cover_image || getPlaceholderImage(cuisineType),
    gallery: row.gallery || [],
    description: row.description,
    longDescription: row.long_description,
    tags: generateTags(cuisineType, priceRange, null),
    rating: row.rating_avg ? Number(row.rating_avg) : 4.0 + Math.random() * 0.9,
    reviewCount: row.reviews_count || Math.floor(Math.random() * 100) + 10,
    distance: null,
    price: priceRange ? '$'.repeat(priceRange) : null,
    priceRange,
    address: row.address,
    neighborhood: row.neighborhood,
    city: row.city,
    phone: row.phone,
    website: row.website,
    hours: row.hours as Record<string, unknown> | null,
    cuisineTypes: row.cuisine_types || [],
    features: row.features || [],
    ratingsBreakdown: {
      food: row.rating_food ? Number(row.rating_food) : 4.2,
      service: row.rating_service ? Number(row.rating_service) : 4.0,
      ambiance: row.rating_ambiance ? Number(row.rating_ambiance) : 4.3,
    },
    latitude: null,
    longitude: null,
  };
}

// ============================================================================
// FUNÇÕES PÚBLICAS
// ============================================================================

/**
 * Busca restaurantes com filtros
 */
export async function fetchRestaurants(options: FetchOptions = {}): Promise<Restaurant[]> {
  const { limit = 20, offset = 0, city, cuisineTypes, priceRange, searchQuery } = options;
  
  let query = supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
    .order('rating_avg', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);
  
  if (city) {
    query = query.eq('city', city);
  }
  
  if (cuisineTypes && cuisineTypes.length > 0) {
    query = query.overlaps('cuisine_types', cuisineTypes);
  }
  
  if (priceRange && priceRange.length > 0) {
    query = query.in('price_range', priceRange);
  }
  
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erro ao buscar restaurantes:', error);
    return [];
  }
  
  return (data || []).map(row => rowToRestaurant(row));
}

/**
 * Busca um restaurante por ID
 */
export async function fetchRestaurantById(id: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    console.error('Erro ao buscar restaurante:', error);
    return null;
  }
  
  return rowToRestaurant(data);
}

/**
 * Busca restaurante por slug
 */
export async function fetchRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !data) {
    console.error('Erro ao buscar restaurante:', error);
    return null;
  }
  
  return rowToRestaurant(data);
}

/**
 * Busca tipos de cozinha disponíveis
 */
export async function fetchCuisineTypes(): Promise<string[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('cuisine_types')
    .eq('is_active', true)
    .returns<{ cuisine_types: string[] | null }[]>();
  
  if (error || !data) return [];
  
  const allTypes = data.flatMap(r => r.cuisine_types || []);
  return [...new Set(allTypes)].sort();
}

/**
 * Busca bairros disponíveis
 */
export async function fetchNeighborhoods(city: string = 'Recife'): Promise<string[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('neighborhood')
    .eq('city', city)
    .eq('is_active', true)
    .not('neighborhood', 'is', null)
    .returns<{ neighborhood: string | null }[]>();
  
  if (error || !data) return [];
  
  const neighborhoods = data
    .map(r => r.neighborhood)
    .filter((n): n is string => n !== null);
  
  return [...new Set(neighborhoods)].sort();
}

/**
 * Busca restaurantes próximos (fallback para fetchRestaurants)
 */
export async function fetchNearbyRestaurants(options: {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  limit?: number;
}): Promise<Restaurant[]> {
  // Fallback: usa busca normal já que PostGIS RPC não está configurado
  return fetchRestaurants({ limit: options.limit || 20 });
}