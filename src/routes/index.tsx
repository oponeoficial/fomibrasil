import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, ReactNode } from 'react';

// Loading component
const Loading = () => (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: '#FDFEE7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <img src="/images/logo-fomi.png" alt="Fomí" style={{ width: '80px', opacity: 0.5 }} />
  </div>
);

// Onboarding
const Welcome = lazy(() => import('../components/onboarding/Welcome'));
const Onboarding = lazy(() => import('../components/onboarding/Onboarding'));

// Auth - usando wrappers do AuthForm unificado
const Login = lazy(() => import('../components/auth/AuthForm').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('../components/auth/AuthForm').then(m => ({ default: m.Signup })));

// App
const Feed = lazy(() => import('../pages/Feed'));

// Saved
const SavedRestaurants = lazy(() => import('../components/saved/SavedRestaurants'));

// Wrapper com Suspense
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>): ReactNode => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Onboarding
  { path: '/', element: withSuspense(Welcome) },
  { path: '/onboarding', element: withSuspense(Onboarding) },
  
  // Legacy routes - redirect to unified onboarding
  { path: '/onboarding/location', element: <Navigate to="/onboarding" replace /> },
  { path: '/onboarding/preferences', element: <Navigate to="/onboarding" replace /> },

  // Auth
  { path: '/login', element: withSuspense(Login) },
  { path: '/signup', element: withSuspense(Signup) },

  // App
  { path: '/feed', element: withSuspense(Feed) },
  { path: '/saved', element: withSuspense(SavedRestaurants) },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
]);