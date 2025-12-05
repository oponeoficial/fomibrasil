// Types
export * from './types';
export * from './types/database';

// Layout Components
export { Header } from './components/layout/Header';
export { Sidebar } from './components/layout/Sidebar';
export { BottomNavigation } from './components/layout/BottomNavigation';
export { FilterPanel } from './components/layout/FilterPanel';

// Common Components
export { Button } from './components/common/Button';
export { Logo, LogoIllustration } from './components/common/Logo';

// Restaurant Components
export { RestaurantCard } from './components/restaurant/RestaurantCard';
export { RestaurantDetails } from './components/restaurant/RestaurantDetails';

// Auth Components
export { Login } from './components/auth/Login';
export { Signup } from './components/auth/Signup';
export { SignupBanner } from './components/auth/SignupBanner';
export { EmailConfirmation } from './components/auth/EmailConfirmation';
export { PostSignup } from './components/auth/PostSignup';

// Onboarding Components
export { Welcome } from './components/onboarding/Welcome';
export { Location } from './components/onboarding/Location';
export { Preferences } from './components/onboarding/Preferences';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useGeolocation, useNearbyRestaurants } from './hooks/useGeolocation';

// Lib
export { supabase } from './lib/supabase';

// Data
export { mockRestaurants, filterChips } from './data/mockData';

// Utils
export { getGreeting, getContextualMessage } from './utils/helpers';