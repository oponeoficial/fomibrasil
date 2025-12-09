/**
 * FOMÍ - Store Unificado
 * 
 * Estado global da aplicação usando Zustand.
 * Persistência apenas para dados de onboarding.
 * 
 * USO: 
 *   import { useStore } from '@/store';
 *   const user = useStore(s => s.user);
 *   const { setUser, isGuest } = useStore();
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@supabase/supabase-js';
import type { Restaurant, TabId, UserLocation, UserPreferences, OnboardingStep } from './types';

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
  savedRestaurants: string[]; // IDs dos restaurantes salvos localmente
  selectedFilters: string[];
  searchQuery: string;

  // Onboarding (persistido)
  onboardingStep: OnboardingStep;
  onboardingLocation: UserLocation | null;
  onboardingPreferences: UserPreferences;
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

  // Onboarding
  setOnboardingStep: (step: OnboardingStep) => void;
  setOnboardingLocation: (location: UserLocation) => void;
  setOnboardingPreferences: (prefs: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

type Store = StoreState & StoreActions;

// ============================================================================
// INITIAL VALUES
// ============================================================================

const initialPreferences: UserPreferences = {
  company: [],
  mood: [],
  restrictions: [],
  budget: null,
};

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

      // === ONBOARDING STATE ===
      onboardingStep: 'welcome',
      onboardingLocation: null,
      onboardingPreferences: initialPreferences,

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

      // === ONBOARDING ACTIONS ===
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      setOnboardingLocation: (location) =>
        set({ onboardingLocation: location, onboardingStep: 'preferences' }),

      setOnboardingPreferences: (prefs) =>
        set((state) => ({
          onboardingPreferences: { ...state.onboardingPreferences, ...prefs },
        })),

      completeOnboarding: () => set({ onboardingStep: 'completed' }),

      resetOnboarding: () =>
        set({
          onboardingStep: 'welcome',
          onboardingLocation: null,
          onboardingPreferences: initialPreferences,
        }),
    }),
    {
      name: 'fomi-store',
      partialize: (state) => ({
        onboardingStep: state.onboardingStep,
        onboardingLocation: state.onboardingLocation,
        onboardingPreferences: state.onboardingPreferences,
        savedRestaurants: state.savedRestaurants,
      }),
    }
  )
);

// ============================================================================
// SELECTORS (para uso com shallow comparison)
// ============================================================================

/** Selector para dados de auth */
export const selectAuth = (state: Store) => ({
  user: state.user,
  loading: state.loading,
  isGuest: state.isGuest,
});

/** Selector para UI state */
export const selectUI = (state: Store) => ({
  activeTab: state.activeTab,
  sidebarOpen: state.sidebarOpen,
  filterOpen: state.filterOpen,
  selectedRestaurant: state.selectedRestaurant,
  savedRestaurants: state.savedRestaurants,
  selectedFilters: state.selectedFilters,
  searchQuery: state.searchQuery,
});

/** Selector para onboarding */
export const selectOnboarding = (state: Store) => ({
  step: state.onboardingStep,
  location: state.onboardingLocation,
  preferences: state.onboardingPreferences,
});

// ============================================================================
// HOOKS DE COMPATIBILIDADE (para migração gradual)
// ============================================================================

/**
 * Hook de compatibilidade para código legado.
 * DEPRECATED: Use useStore diretamente.
 * 
 * @example
 * // Antigo (ainda funciona):
 * const user = useAuthStore(s => s.user);
 * 
 * // Novo (preferido):
 * const user = useStore(s => s.user);
 */
export const useAuthStore = useStore;
export const useAppStore = useStore;
export const useOnboardingStore = useStore;

// Type exports para compatibilidade
export type { UserLocation as Location, UserPreferences as Preferences, OnboardingStep };