import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface OnboardingState {
  step: OnboardingStep;
  location: Location | null;
  preferences: Preferences;
  
  // Actions
  setStep: (step: OnboardingStep) => void;
  setLocation: (location: Location) => void;
  setPreferences: (prefs: Partial<Preferences>) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const initialPreferences: Preferences = {
  company: [],
  mood: [],
  restrictions: [],
  budget: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 'welcome',
      location: null,
      preferences: initialPreferences,
      
      setStep: (step) => set({ step }),
      setLocation: (location) => set({ location, step: 'preferences' }),
      setPreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs },
      })),
      completeOnboarding: () => set({ step: 'completed' }),
      reset: () => set({
        step: 'welcome',
        location: null,
        preferences: initialPreferences,
      }),
    }),
    {
      name: 'fomi-onboarding',
    }
  )
);