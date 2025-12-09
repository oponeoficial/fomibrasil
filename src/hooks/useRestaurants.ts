/**
 * FOMÍ - Hook de Restaurantes
 * 
 * Gerencia estado de busca de restaurantes do Supabase.
 * Substitui uso de mockData.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchRestaurants, fetchNearbyRestaurants } from '../services/restaurants';
import type { Restaurant } from '../types';

interface UseRestaurantsOptions {
  /** Usar localização do usuário para busca */
  useLocation?: boolean;
  /** Latitude do usuário */
  latitude?: number;
  /** Longitude do usuário */
  longitude?: number;
  /** Cidade para filtrar */
  city?: string;
  /** Tipos de cozinha para filtrar */
  cuisineTypes?: string[];
  /** Faixas de preço para filtrar */
  priceRange?: number[];
  /** Query de busca */
  searchQuery?: string;
  /** Limite de resultados */
  limit?: number;
  /** Carregar automaticamente */
  autoLoad?: boolean;
}

interface UseRestaurantsReturn {
  /** Lista de restaurantes */
  restaurants: Restaurant[];
  /** Estado de carregamento */
  loading: boolean;
  /** Erro se houver */
  error: string | null;
  /** Recarregar dados */
  refresh: () => Promise<void>;
  /** Carregar mais (paginação) */
  loadMore: () => Promise<void>;
  /** Se há mais dados para carregar */
  hasMore: boolean;
}

export function useRestaurants(options: UseRestaurantsOptions = {}): UseRestaurantsReturn {
  const {
    useLocation = false,
    latitude,
    longitude,
    city = 'Recife',
    cuisineTypes,
    priceRange,
    searchQuery,
    limit = 20,
    autoLoad = true,
  } = options;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (reset: boolean = false) => {
    setLoading(true);
    setError(null);

    const currentOffset = reset ? 0 : offset;

    try {
      let data: Restaurant[];

      if (useLocation && latitude && longitude) {
  // Busca por proximidade
  data = await fetchNearbyRestaurants({
    latitude,
    longitude,
    limit,
  });
} else {
        // Busca normal com filtros
        data = await fetchRestaurants({
          limit,
          offset: currentOffset,
          city,
          cuisineTypes,
          priceRange,
          searchQuery,
        });
      }

      if (reset) {
        setRestaurants(data);
        setOffset(limit);
      } else {
        setRestaurants(prev => [...prev, ...data]);
        setOffset(prev => prev + limit);
      }

      setHasMore(data.length === limit);
    } catch (err) {
      console.error('Erro ao buscar restaurantes:', err);
      setError('Não foi possível carregar os restaurantes.');
    } finally {
      setLoading(false);
    }
  }, [useLocation, latitude, longitude, city, cuisineTypes, priceRange, searchQuery, limit, offset]);

  // Carrega inicialmente
  useEffect(() => {
    if (autoLoad) {
      fetchData(true);
    }
  }, [city, cuisineTypes?.join(','), priceRange?.join(','), searchQuery, useLocation, latitude, longitude]);

  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchData(false);
    }
  }, [loading, hasMore, fetchData]);

  return {
    restaurants,
    loading,
    error,
    refresh,
    loadMore,
    hasMore,
  };
}

/**
 * Hook simplificado para Feed principal
 * Usa cidade padrão Recife
 */
export function useFeedRestaurants(searchQuery?: string, filters?: string[]) {
  // Mapeia filtros para tipos de cozinha
  const cuisineTypes = filters?.filter(f => 
    ['italian', 'japanese', 'burger', 'brazilian', 'portuguese'].includes(f)
  ).map(f => {
    const mapping: Record<string, string> = {
      italian: 'Italiana',
      japanese: 'Japonesa',
      burger: 'Hamburgueria / Lanche',
      brazilian: 'Brasileira',
      portuguese: 'Portuguesa',
    };
    return mapping[f];
  }).filter(Boolean);

  return useRestaurants({
    city: 'Recife',
    searchQuery,
    cuisineTypes: cuisineTypes?.length ? cuisineTypes : undefined,
    autoLoad: true,
  });
}