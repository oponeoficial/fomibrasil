import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { User } from '@supabase/supabase-js';
import type { Restaurant, TabId } from './types';

// ============================================================================
// TYPES
// ============================================================================

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
}

interface Preferences {
  company: string[];
  mood: string[];
  restrictions: string[];
  budget: string | null;
}

type OnboardingStep = 'welcome' | 'location' | 'preferences' | 'completed';

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface StoreState {
  // === AUTH ===
  user: User | null;
  loading: boolean;

  // === UI / APP ===
  activeTab: TabId;
  sidebarOpen: boolean;
  filterOpen: boolean;
  selectedRestaurant: Restaurant | null;
  savedRestaurants: number[];
  selectedFilters: string[];
  searchQuery: string;

  // === ONBOARDING (persisted) ===
  onboardingStep: OnboardingStep;
  onboardingLocation: Location | null;
  onboardingPreferences: Preferences;
}

interface StoreActions {
  // === AUTH ACTIONS ===
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isGuest: () => boolean;

  // === UI / APP ACTIONS ===
  setActiveTab: (tab: TabId) => void;
  setSidebarOpen: (open: boolean) => void;
  setFilterOpen: (open: boolean) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  toggleSavedRestaurant: (id: number) => void;
  setSelectedFilters: (filters: string[]) => void;
  toggleFilter: (filterId: string) => void;
  setSearchQuery: (query: string) => void;

  // === ONBOARDING ACTIONS ===
  setOnboardingStep: (step: OnboardingStep) => void;
  setOnboardingLocation: (location: Location) => void;
  setOnboardingPreferences: (prefs: Partial<Preferences>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

type Store = StoreState & StoreActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialPreferences: Preferences = {
  company: [],
  mood: [],
  restrictions: [],
  budget: null,
};

// ============================================================================
// MIGRATION: Migrar dados do localStorage antigo
// ============================================================================

const migrateOldOnboardingData = (): Partial<StoreState> | null => {
  try {
    const oldData = localStorage.getItem('fomi-onboarding');
    if (!oldData) return null;

    const parsed = JSON.parse(oldData);
    if (!parsed?.state) return null;

    const { step, location, preferences } = parsed.state;
    
    // Remover dados antigos após migração
    localStorage.removeItem('fomi-onboarding');
    
    console.log('[Fomi Store] Migrated onboarding data from old format');
    
    return {
      onboardingStep: step || 'welcome',
      onboardingLocation: location || null,
      onboardingPreferences: preferences || initialPreferences,
    };
  } catch {
    return null;
  }
};

// Executar migração antes de criar o store
const migratedData = migrateOldOnboardingData();

// ============================================================================
// UNIFIED STORE
// ============================================================================

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // ========== AUTH STATE ==========
      user: null,
      loading: true,

      // ========== UI / APP STATE ==========
      activeTab: 'home',
      sidebarOpen: false,
      filterOpen: false,
      selectedRestaurant: null,
      savedRestaurants: [],
      selectedFilters: [],
      searchQuery: '',

      // ========== ONBOARDING STATE (com migração) ==========
      onboardingStep: migratedData?.onboardingStep ?? 'welcome',
      onboardingLocation: migratedData?.onboardingLocation ?? null,
      onboardingPreferences: migratedData?.onboardingPreferences ?? initialPreferences,

      // ========== AUTH ACTIONS ==========
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      isGuest: () => get().user === null,

      // ========== UI / APP ACTIONS ==========
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

      // ========== ONBOARDING ACTIONS ==========
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
      // Persistir apenas dados de onboarding
      partialize: (state) => ({
        onboardingStep: state.onboardingStep,
        onboardingLocation: state.onboardingLocation,
        onboardingPreferences: state.onboardingPreferences,
      }),
    }
  )
);

// ============================================================================
// COMPATIBILITY HOOKS (mantém API antiga funcionando)
// ============================================================================

// Interfaces para os hooks de compatibilidade
interface AuthSlice {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  isGuest: () => boolean;
}

interface AppSlice {
  activeTab: TabId;
  sidebarOpen: boolean;
  filterOpen: boolean;
  selectedRestaurant: Restaurant | null;
  savedRestaurants: number[];
  selectedFilters: string[];
  searchQuery: string;
  setActiveTab: (tab: TabId) => void;
  setSidebarOpen: (open: boolean) => void;
  setFilterOpen: (open: boolean) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  toggleSavedRestaurant: (id: number) => void;
  setSelectedFilters: (filters: string[]) => void;
  toggleFilter: (filterId: string) => void;
  setSearchQuery: (query: string) => void;
}

interface OnboardingSlice {
  step: OnboardingStep;
  location: Location | null;
  preferences: Preferences;
  setStep: (step: OnboardingStep) => void;
  setLocation: (location: Location) => void;
  setPreferences: (prefs: Partial<Preferences>) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

// Seletores otimizados (definidos uma vez, reutilizados)
const authSelector = (state: Store): AuthSlice => ({
  user: state.user,
  loading: state.loading,
  setUser: state.setUser,
  setLoading: state.setLoading,
  isGuest: state.isGuest,
});

const appSelector = (state: Store): AppSlice => ({
  activeTab: state.activeTab,
  sidebarOpen: state.sidebarOpen,
  filterOpen: state.filterOpen,
  selectedRestaurant: state.selectedRestaurant,
  savedRestaurants: state.savedRestaurants,
  selectedFilters: state.selectedFilters,
  searchQuery: state.searchQuery,
  setActiveTab: state.setActiveTab,
  setSidebarOpen: state.setSidebarOpen,
  setFilterOpen: state.setFilterOpen,
  setSelectedRestaurant: state.setSelectedRestaurant,
  toggleSavedRestaurant: state.toggleSavedRestaurant,
  setSelectedFilters: state.setSelectedFilters,
  toggleFilter: state.toggleFilter,
  setSearchQuery: state.setSearchQuery,
});

const onboardingSelector = (state: Store): OnboardingSlice => ({
  step: state.onboardingStep,
  location: state.onboardingLocation,
  preferences: state.onboardingPreferences,
  setStep: state.setOnboardingStep,
  setLocation: state.setOnboardingLocation,
  setPreferences: state.setOnboardingPreferences,
  completeOnboarding: state.completeOnboarding,
  reset: state.resetOnboarding,
});

/**
 * @deprecated Use useStore directly. Mantido para compatibilidade.
 * Suporta: useAuthStore((s) => s.user) OU const { user } = useAuthStore()
 */
export function useAuthStore(): AuthSlice;
export function useAuthStore<T>(selector: (state: AuthSlice) => T): T;
export function useAuthStore<T>(selector?: (state: AuthSlice) => T) {
  const slice = useStore(useShallow(authSelector));
  return selector ? selector(slice) : slice;
}

/**
 * @deprecated Use useStore directly. Mantido para compatibilidade.
 * Suporta: useAppStore((s) => s.activeTab) OU const { activeTab } = useAppStore()
 */
export function useAppStore(): AppSlice;
export function useAppStore<T>(selector: (state: AppSlice) => T): T;
export function useAppStore<T>(selector?: (state: AppSlice) => T) {
  const slice = useStore(useShallow(appSelector));
  return selector ? selector(slice) : slice;
}

/**
 * @deprecated Use useStore directly. Mantido para compatibilidade.
 * Suporta: useOnboardingStore((s) => s.step) OU const { step } = useOnboardingStore()
 */
export function useOnboardingStore(): OnboardingSlice;
export function useOnboardingStore<T>(selector: (state: OnboardingSlice) => T): T;
export function useOnboardingStore<T>(selector?: (state: OnboardingSlice) => T) {
  const slice = useStore(useShallow(onboardingSelector));
  return selector ? selector(slice) : slice;
}

// ============================================================================
// TYPE EXPORTS (para uso externo)
// ============================================================================

export type { Location, Preferences, OnboardingStep };