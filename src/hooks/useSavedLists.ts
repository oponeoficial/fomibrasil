/**
 * Hook para gerenciar listas de restaurantes salvos
 * Versão otimizada - queries em paralelo
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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
  restaurant_count?: number;
}

interface UseSavedListsResult {
  lists: SavedList[];
  loading: boolean;
  error: string | null;
  createList: (name: string, icon: string) => Promise<SavedList | null>;
  saveToList: (restaurantId: string, listId: string) => Promise<boolean>;
  removeFromList: (restaurantId: string, listId: string) => Promise<boolean>;
  getRestaurantLists: (restaurantId: string) => Promise<string[]>;
  isInAnyList: (restaurantId: string) => Promise<boolean>;
  refetch: () => void;
}

// Cache simples para evitar re-fetches
let cachedLists: SavedList[] | null = null;
let cacheUserId: string | null = null;

export function useSavedLists(): UseSavedListsResult {
  const [lists, setLists] = useState<SavedList[]>(cachedLists || []);
  const [loading, setLoading] = useState(!cachedLists);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async (forceRefresh = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLists([]);
        setLoading(false);
        return;
      }

      // Usar cache se disponível e não forçar refresh
      if (!forceRefresh && cachedLists && cacheUserId === user.id) {
        setLists(cachedLists);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Query única: buscar listas com contagem usando subquery
      const { data, error: fetchError } = await supabase
        .from('saved_lists')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      // Buscar contagem separadamente (mais rápido que join)
      const { data: counts } = await supabase
        .from('saved_restaurants')
        .select('list_id')
        .eq('user_id', user.id);

      const countMap: Record<string, number> = {};
      counts?.forEach((item: { list_id: string }) => {
        countMap[item.list_id] = (countMap[item.list_id] || 0) + 1;
      });

      const listsWithCount: SavedList[] = (data || []).map((list: SavedList) => ({
        ...list,
        restaurant_count: countMap[list.id] || 0,
      }));

      // Atualizar cache
      cachedLists = listsWithCount;
      cacheUserId = user.id;

      setLists(listsWithCount);
    } catch (err) {
      console.error('Erro ao buscar listas:', err);
      setError('Erro ao carregar listas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const createList = async (name: string, icon: string): Promise<SavedList | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('saved_lists')
        .insert({
          user_id: user.id,
          name,
          icon,
          is_system: false,
          sort_order: lists.length + 1,
        })
        .select()
        .single();

      if (error) throw error;

      const newList: SavedList = { 
        ...(data as SavedList), 
        restaurant_count: 0 
      };
      
      const updatedLists = [...lists, newList];
      setLists(updatedLists);
      cachedLists = updatedLists;
      
      return newList;
    } catch (err) {
      console.error('Erro ao criar lista:', err);
      return null;
    }
  };

  const saveToList = async (restaurantId: string, listId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('saved_restaurants')
        .insert({
          user_id: user.id,
          restaurant_id: restaurantId,
          list_id: listId,
        });

      // Ignorar erro de duplicata
      if (error && !error.message.includes('duplicate')) throw error;

      // Atualizar contagem local
      const updatedLists = lists.map(list => 
        list.id === listId 
          ? { ...list, restaurant_count: (list.restaurant_count || 0) + 1 }
          : list
      );
      setLists(updatedLists);
      cachedLists = updatedLists;

      return true;
    } catch (err) {
      console.error('Erro ao salvar em lista:', err);
      return false;
    }
  };

  const removeFromList = async (restaurantId: string, listId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('saved_restaurants')
        .delete()
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId)
        .eq('list_id', listId);

      if (error) throw error;

      // Atualizar contagem local
      const updatedLists = lists.map(list => 
        list.id === listId 
          ? { ...list, restaurant_count: Math.max((list.restaurant_count || 1) - 1, 0) }
          : list
      );
      setLists(updatedLists);
      cachedLists = updatedLists;

      return true;
    } catch (err) {
      console.error('Erro ao remover de lista:', err);
      return false;
    }
  };

  const getRestaurantLists = async (restaurantId: string): Promise<string[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('saved_restaurants')
        .select('list_id')
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId);

      if (error) throw error;

      return data?.map((item: { list_id: string }) => item.list_id) || [];
    } catch (err) {
      console.error('Erro ao buscar listas do restaurante:', err);
      return [];
    }
  };

  const isInAnyList = async (restaurantId: string): Promise<boolean> => {
    const restaurantLists = await getRestaurantLists(restaurantId);
    return restaurantLists.length > 0;
  };

  return {
    lists,
    loading,
    error,
    createList,
    saveToList,
    removeFromList,
    getRestaurantLists,
    isInAnyList,
    refetch: () => fetchLists(true),
  };
}

// Função para limpar cache (usar no logout)
export function clearSavedListsCache() {
  cachedLists = null;
  cacheUserId = null;
}