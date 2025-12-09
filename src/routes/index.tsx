import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, ReactNode } from 'react';

// Loading component inline
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

// Onboarding - importa diretamente dos componentes
const Welcome = lazy(() => import('../components/onboarding/Welcome'));
const Location = lazy(() => import('../components/onboarding/Location'));
const Preferences = lazy(() => import('../components/onboarding/Preferences'));

// Auth - importa diretamente dos componentes
const Login = lazy(() => import('../components/auth/Login'));
const Signup = lazy(() => import('../components/auth/Signup'));

// App - mantém pages para componentes que precisam de lógica adicional
const Feed = lazy(() => import('../pages/Feed'));

// Saved - importa diretamente do componente
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
  { path: '/onboarding/location', element: withSuspense(Location) },
  { path: '/onboarding/preferences', element: withSuspense(Preferences) },

  // Auth
  { path: '/login', element: withSuspense(Login) },
  { path: '/signup', element: withSuspense(Signup) },

  // App
  { path: '/feed', element: withSuspense(Feed) },
  { path: '/saved', element: withSuspense(SavedRestaurants) },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
]);