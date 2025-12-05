import { create } from 'zustand';
import type { Restaurant, TabId } from '../types';

interface AppState {
  // Navigation
  activeTab: TabId;
  sidebarOpen: boolean;
  filterOpen: boolean;
  
  // Restaurant
  selectedRestaurant: Restaurant | null;
  savedRestaurants: number[];
  
  // Filters
  selectedFilters: string[];
  searchQuery: string;
  
  // Actions
  setActiveTab: (tab: TabId) => void;
  setSidebarOpen: (open: boolean) => void;
  setFilterOpen: (open: boolean) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  toggleSavedRestaurant: (id: number) => void;
  setSelectedFilters: (filters: string[]) => void;
  toggleFilter: (filterId: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  activeTab: 'home',
  sidebarOpen: false,
  filterOpen: false,
  selectedRestaurant: null,
  savedRestaurants: [],
  selectedFilters: [],
  searchQuery: '',
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setFilterOpen: (open) => set({ filterOpen: open }),
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  
  toggleSavedRestaurant: (id) => set((state) => ({
    savedRestaurants: state.savedRestaurants.includes(id)
      ? state.savedRestaurants.filter((r) => r !== id)
      : [...state.savedRestaurants, id],
  })),
  
  setSelectedFilters: (filters) => set({ selectedFilters: filters }),
  
  toggleFilter: (filterId) => set((state) => ({
    selectedFilters: state.selectedFilters.includes(filterId)
      ? state.selectedFilters.filter((f) => f !== filterId)
      : [...state.selectedFilters, filterId],
  })),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
}));