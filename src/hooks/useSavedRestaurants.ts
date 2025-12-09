/**
 * FOMÍ - Hook de Restaurantes Salvos (Limpo)
 * 
 * Usa tipos centralizados de types/index.ts
 * Derivados do schema Supabase.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { SavedList, SavedRestaurantRow, RestaurantTag } from '../types';

// Tipo para UI com campos parseados
export interface SavedRestaurant {
  id: string;
  restaurant_id: string;
  list_id: string;
  restaurant_name: string;
  restaurant_image: string | null;
  restaurant_address: string | null;
  restaurant_rating: number | null;
  restaurant_price: string | null;
  restaurant_latitude: number | null;
  restaurant_longitude: number | null;
  restaurant_tags: RestaurantTag[];
  personal_rating: number | null;
  personal_note: string | null;
  context_tags: string[];
  visited: boolean;
  visited_at: string | null;
  visit_count: number;
  reminder_enabled: boolean;
  created_at: string;
}

// Re-export para compatibilidade
export type { SavedList };

// Helper para chamadas RPC
const rpc = async (fnName: string, params: Record<string, unknown>) => {
  return supabase.rpc(fnName as never, params as never);
};

// Converter row do banco para UI
function toUI(row: SavedRestaurantRow): SavedRestaurant {
  return {
    id: row.id,
    restaurant_id: row.restaurant_id,
    list_id: row.list_id,
    restaurant_name: row.restaurant_name,
    restaurant_image: row.restaurant_image,
    restaurant_address: row.restaurant_address,
    restaurant_rating: row.restaurant_rating,
    restaurant_price: row.restaurant_price,
    restaurant_latitude: row.restaurant_latitude,
    restaurant_longitude: row.restaurant_longitude,
    restaurant_tags: (row.restaurant_tags as unknown as RestaurantTag[]) || [],
    personal_rating: row.personal_rating,
    personal_note: row.personal_note,
    context_tags: row.context_tags || [],
    visited: row.visited ?? false,
    visited_at: row.visited_at,
    visit_count: row.visit_count ?? 0,
    reminder_enabled: row.reminder_enabled ?? false,
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
        const { error: createError } = await rpc('create_default_lists_for_user', {
          p_user_id: userId,
        });

        if (createError) throw createError;

        const { data: newLists } = await supabase
          .from('saved_lists')
          .select('*')
          .eq('user_id', userId)
          .order('sort_order');

        setLists(newLists || []);
      } else {
        setLists(listsData);
      }

      // Carregar restaurantes salvos
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('saved_restaurants')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (restaurantsError) throw restaurantsError;
      setRestaurants((restaurantsData || []).map(toUI));
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

  const saveRestaurant = async (
    restaurantId: string,
    listType: string,
    restaurantData: {
      name: string;
      image?: string;
      address?: string;
      rating?: number;
      price?: string;
      latitude?: number;
      longitude?: number;
      tags?: { text: string; color: string }[];
      context_tags?: string[];
    }
  ) => {
    if (!userId) return { success: false, error: 'Usuário não logado' };

    try {
      const { data, error } = await rpc('save_restaurant', {
        p_user_id: userId,
        p_restaurant_id: restaurantId,
        p_list_type: listType,
        p_restaurant_data: restaurantData,
      });

      if (error) throw error;
      await loadData();
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao salvar:', err);
      return { success: false, error: 'Erro ao salvar restaurante' };
    }
  };

  const markAsVisited = async (savedId: string, rating: number, moveToFavorites = false) => {
    if (!userId) return { success: false };

    try {
      const { data, error } = await rpc('mark_as_visited', {
        p_user_id: userId,
        p_saved_id: savedId,
        p_rating: rating,
        p_move_to_favorites: moveToFavorites,
      });

      if (error) throw error;
      await loadData();
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao marcar como visitado:', err);
      return { success: false };
    }
  };

  const moveToList = async (savedId: string, newListId: string) => {
    if (!userId) return { success: false };

    try {
      const { error } = await rpc('move_restaurant_to_list', {
        p_user_id: userId,
        p_saved_id: savedId,
        p_new_list_id: newListId,
      });

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
      const { data, error } = await rpc('create_custom_list', {
        p_user_id: userId,
        p_name: name,
        p_icon: icon,
      });

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

  const toggleReminder = async (savedId: string, enabled: boolean, radius = 500) => {
    if (!userId) return { success: false };

    try {
      const { error } = await rpc('toggle_reminder', {
        p_user_id: userId,
        p_saved_id: savedId,
        p_enabled: enabled,
        p_radius: radius,
      });

      if (error) throw error;
      await loadData();
      return { success: true };
    } catch (err) {
      console.error('Erro ao toggle reminder:', err);
      return { success: false };
    }
  };

  const updateNote = async (savedId: string, note: string) => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase
        .from('saved_restaurants')
        .update({ personal_note: note } as never)
        .eq('id', savedId)
        .eq('user_id', userId);

      if (error) throw error;
      await loadData();
      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar nota:', err);
      return { success: false };
    }
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
    updateNote,
    getRestaurantsByList,
    getListCounts,
    reload: loadData,
  };
}