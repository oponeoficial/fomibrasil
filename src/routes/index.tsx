import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, ReactNode } from 'react';

// Loading component inline (temporário)
const Loading = () => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: 'var(--color-cream)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <img src="/images/logo-fomi.png" alt="Fomí" style={{ width: '80px', opacity: 0.5 }} />
  </div>
);

// Lazy load pages
const Welcome = lazy(() => import('../pages/Welcome'));
const Location = lazy(() => import('../pages/Location'));
const Preferences = lazy(() => import('../pages/Preferences'));
const Feed = lazy(() => import('../pages/Feed'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Profile = lazy(() => import('../pages/Profile'));
const SavedRestaurants = lazy(() => import('../pages/SavedRestaurants'));

// Wrapper com Suspense
const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>): ReactNode => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Onboarding
  { path: '/', element: withSuspense(Welcome) },
  { path: '/onboarding/location', element: withSuspense(Location) },
  { path: '/onboarding/preferences', element: withSuspense(Preferences) },
  
  // Auth
  { path: '/login', element: withSuspense(Login) },
  { path: '/signup', element: withSuspense(Signup) },
  
  // App
  { path: '/feed', element: withSuspense(Feed) },
  { path: '/profile', element: withSuspense(Profile) },
  { path: '/saved', element: withSuspense(SavedRestaurants) },
  
  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
]);