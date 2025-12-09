/**
 * FOMÍ - Store Unificado (Limpo)
 * 
 * Estado global da aplicação usando Zustand.
 * 
 * USO: 
 *   import { useStore } from '@/store';
 *   const user = useStore(s => s.user);
 *   const { setUser, isGuest } = useStore();
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';
import type { Restaurant, TabId } from './types';

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface StoreState {
  // Auth
  user: User | null;
  loading: boolean;

  // UI
  activeTab: TabId;
  sidebarOpen: boolean;
  filterOpen: boolean;
  selectedRestaurant: Restaurant | null;
  savedRestaurants: string[];
  selectedFilters: string[];
  searchQuery: string;
}

interface StoreActions {
  // Auth
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isGuest: () => boolean;

  // UI
  setActiveTab: (tab: TabId) => void;
  setSidebarOpen: (open: boolean) => void;
  setFilterOpen: (open: boolean) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  toggleSavedRestaurant: (id: string) => void;
  setSelectedFilters: (filters: string[]) => void;
  toggleFilter: (filterId: string) => void;
  setSearchQuery: (query: string) => void;
}

type Store = StoreState & StoreActions;

// ============================================================================
// STORE
// ============================================================================

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // === AUTH STATE ===
      user: null,
      loading: true,

      // === UI STATE ===
      activeTab: 'home',
      sidebarOpen: false,
      filterOpen: false,
      selectedRestaurant: null,
      savedRestaurants: [],
      selectedFilters: [],
      searchQuery: '',

      // === AUTH ACTIONS ===
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      isGuest: () => get().user === null,

      // === UI ACTIONS ===
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setFilterOpen: (open) => set({ filterOpen: open }),
      setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),

      toggleSavedRestaurant: (id) =>
        set((state) => ({
          savedRestaurants: state.savedRestaurants.includes(id)
            ? state.savedRestaurants.filter((r) => r !== id)
            : [...state.savedRestaurants, id],
        })),

      setSelectedFilters: (filters) => set({ selectedFilters: filters }),

      toggleFilter: (filterId) =>
        set((state) => ({
          selectedFilters: state.selectedFilters.includes(filterId)
            ? state.selectedFilters.filter((f) => f !== filterId)
            : [...state.selectedFilters, filterId],
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'fomi-store',
      partialize: (state) => ({
        savedRestaurants: state.savedRestaurants,
      }),
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const selectAuth = (state: Store) => ({
  user: state.user,
  loading: state.loading,
  isGuest: state.isGuest,
});

export const selectUI = (state: Store) => ({
  activeTab: state.activeTab,
  sidebarOpen: state.sidebarOpen,
  filterOpen: state.filterOpen,
  selectedRestaurant: state.selectedRestaurant,
  savedRestaurants: state.savedRestaurants,
  selectedFilters: state.selectedFilters,
  searchQuery: state.searchQuery,
});

// ============================================================================
// ALIASES (compatibilidade - usar useStore diretamente)
// ============================================================================

export const useAuthStore = useStore;