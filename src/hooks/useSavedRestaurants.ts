/**
 * FOMÍ - Hook de Restaurantes Salvos
 * 
 * Versão atualizada: busca dados do restaurante via JOIN
 * (campos foram removidos de saved_restaurants)
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Tipo para as listas
export interface SavedList {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  is_system: boolean | null;
  system_type: string | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

// Tipo para UI
export interface SavedRestaurant {
  id: string;
  restaurant_id: string;
  list_id: string;
  restaurant_name: string;
  restaurant_image: string | null;
  restaurant_address: string | null;
  restaurant_rating: number | null;
  restaurant_price: string | null;
  visited: boolean;
  visited_at: string | null;
  visit_count: number;
  created_at: string;
}

// Tipo do banco após JOIN
interface SavedRestaurantRow {
  id: string;
  restaurant_id: string;
  list_id: string;
  visited: boolean | null;
  visited_at: string | null;
  visit_count: number | null;
  created_at: string | null;
  restaurants: {
    name: string;
    cover_image: string | null;
    address: string | null;
    rating_avg: number | null;
    price_range: number | null;
  } | null;
}

// Converter row do banco para UI
function toUI(row: SavedRestaurantRow): SavedRestaurant {
  const priceMap: Record<number, string> = {
    1: '$',
    2: '$$',
    3: '$$$',
    4: '$$$$',
  };

  return {
    id: row.id,
    restaurant_id: row.restaurant_id,
    list_id: row.list_id,
    restaurant_name: row.restaurants?.name || 'Restaurante',
    restaurant_image: row.restaurants?.cover_image || null,
    restaurant_address: row.restaurants?.address || null,
    restaurant_rating: row.restaurants?.rating_avg || null,
    restaurant_price: row.restaurants?.price_range 
      ? priceMap[row.restaurants.price_range] || null 
      : null,
    visited: row.visited ?? false,
    visited_at: row.visited_at,
    visit_count: row.visit_count ?? 0,
    created_at: row.created_at ?? new Date().toISOString(),
  };
}

export function useSavedRestaurants(userId: string | null) {
  const [lists, setLists] = useState<SavedList[]>([]);
  const [restaurants, setRestaurants] = useState<SavedRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!userId) {
      setLists([]);
      setRestaurants([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Carregar listas
      const { data: listsData, error: listsError } = await supabase
        .from('saved_lists')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order');

      if (listsError) throw listsError;

      // Se não tem listas, criar as padrão
      if (!listsData || listsData.length === 0) {
        const { error: createError } = await supabase.rpc(
          'create_default_lists_for_user' as never, 
          { p_user_id: userId } as never
        );

        if (createError) {
          console.warn('Erro ao criar listas padrão:', createError);
        }

        const { data: newLists } = await supabase
          .from('saved_lists')
          .select('*')
          .eq('user_id', userId)
          .order('sort_order');

        setLists(newLists || []);
      } else {
        setLists(listsData);
      }

      // Carregar restaurantes salvos com JOIN na tabela restaurants
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('saved_restaurants')
        .select(`
          id,
          restaurant_id,
          list_id,
          visited,
          visited_at,
          visit_count,
          created_at,
          restaurants (
            name,
            cover_image,
            address,
            rating_avg,
            price_range
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (restaurantsError) throw restaurantsError;

      const parsed = (restaurantsData || []).map((row) => toUI(row as unknown as SavedRestaurantRow));
      setRestaurants(parsed);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar restaurantes salvos');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveRestaurant = async (restaurantId: string, listId: string) => {
    if (!userId) return { success: false, error: 'Usuário não logado' };

    try {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('saved_restaurants')
        .select('id')
        .eq('user_id', userId)
        .eq('restaurant_id', restaurantId)
        .eq('list_id', listId)
        .maybeSingle();

      if (existing) {
        return { success: true, data: existing };
      }

      const { data, error } = await supabase
        .from('saved_restaurants')
        .insert({
          user_id: userId,
          restaurant_id: restaurantId,
          list_id: listId,
        })
        .select()
        .single();

      if (error) throw error;
      await loadData();
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao salvar:', err);
      return { success: false, error: 'Erro ao salvar restaurante' };
    }
  };

  const markAsVisited = async (savedId: string, rating?: number, moveToFavorites = false) => {
    if (!userId) return { success: false };

    try {
      // Atualizar como visitado
      const { error: updateError } = await supabase
        .from('saved_restaurants')
        .update({
          visited: true,
          visited_at: new Date().toISOString(),
          visit_count: 1, // Ou incrementar
        } as never)
        .eq('id', savedId)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Se moveToFavorites, mover para lista de favoritos
      if (moveToFavorites && rating && rating >= 4) {
        const favoritesList = lists.find(l => l.system_type === 'favorites');
        if (favoritesList) {
          await supabase
            .from('saved_restaurants')
            .update({ list_id: favoritesList.id } as never)
            .eq('id', savedId)
            .eq('user_id', userId);
        }
      }

      await loadData();
      return { success: true };
    } catch (err) {
      console.error('Erro ao marcar como visitado:', err);
      return { success: false };
    }
  };

  const moveToList = async (savedId: string, newListId: string) => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase
        .from('saved_restaurants')
        .update({ list_id: newListId } as never)
        .eq('id', savedId)
        .eq('user_id', userId);

      if (error) throw error;
      await loadData();
      return { success: true };
    } catch (err) {
      console.error('Erro ao mover:', err);
      return { success: false };
    }
  };

  const createList = async (name: string, icon = '📁') => {
    if (!userId) return { success: false };

    try {
      const { data, error } = await supabase
        .from('saved_lists')
        .insert({
          user_id: userId,
          name,
          icon,
          is_system: false,
          sort_order: lists.length + 1,
        })
        .select()
        .single();

      if (error) throw error;
      await loadData();
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao criar lista:', err);
      return { success: false };
    }
  };

  const deleteList = async (listId: string) => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase
        .from('saved_lists')
        .delete()
        .eq('id', listId)
        .eq('user_id', userId)
        .eq('is_system', false);

      if (error) throw error;
      await loadData();
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar lista:', err);
      return { success: false };
    }
  };

  const removeRestaurant = async (savedId: string) => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase
        .from('saved_restaurants')
        .delete()
        .eq('id', savedId)
        .eq('user_id', userId);

      if (error) throw error;
      await loadData();
      return { success: true };
    } catch (err) {
      console.error('Erro ao remover:', err);
      return { success: false };
    }
  };

  const toggleReminder = async (savedId: string, enabled: boolean) => {
    // Reminders foram removidos da tabela simplificada
    // Implementar se necessário no futuro
    console.warn('toggleReminder: funcionalidade removida na simplificação');
    return { success: true };
  };

  const getRestaurantsByList = (listId: string) => {
    return restaurants.filter((r) => r.list_id === listId);
  };

  const getListCounts = () => {
    const counts: Record<string, number> = {};
    restaurants.forEach((r) => {
      counts[r.list_id] = (counts[r.list_id] || 0) + 1;
    });
    return counts;
  };

  const isRestaurantSaved = (restaurantId: string) => {
    return restaurants.some(r => r.restaurant_id === restaurantId);
  };

  const getRestaurantLists = (restaurantId: string): string[] => {
    return restaurants
      .filter(r => r.restaurant_id === restaurantId)
      .map(r => r.list_id);
  };

  return {
    lists,
    restaurants,
    loading,
    error,
    saveRestaurant,
    markAsVisited,
    moveToList,
    createList,
    deleteList,
    removeRestaurant,
    toggleReminder,
    getRestaurantsByList,
    getListCounts,
    isRestaurantSaved,
    getRestaurantLists,
    reload: loadData,
  };
}
