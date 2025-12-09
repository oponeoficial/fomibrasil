/**
 * FOMÍ - Stores Index
 * 
 * Re-exporta tudo do store principal.
 * Mantido para compatibilidade de imports.
 */

export {
  useStore,
  useAuthStore,
  useAppStore,
  useOnboardingStore,
  selectAuth,
  selectUI,
  selectOnboarding,
} from '../store';

export type {
  Location,
  Preferences,
  OnboardingStep,
} from '../store';