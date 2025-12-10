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

// Layout
const AppLayout = lazy(() => import('../components/layout/AppLayout'));

// Onboarding
const Welcome = lazy(() => import('../components/onboarding/Welcome'));
const Onboarding = lazy(() => import('../components/onboarding'));

// Auth
const Login = lazy(() => import('../components/auth/AuthForm'));

// App Pages
const Feed = lazy(() => import('../pages/Feed'));
const SavedRestaurants = lazy(() => import('../components/saved/SavedRestaurants'));
const RestaurantPage = lazy(() => import('../pages/RestaurantPage'));
const NewReview = lazy(() => import('../components/review/NewReview'));
const ActivityFeed = lazy(() => import('../components/activity/ActivityFeed'));

// Wrapper com Suspense
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>): ReactNode => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // ========================================
  // Rotas SEM navegação inferior
  // ========================================
  
  // Onboarding
  { path: '/', element: withSuspense(Welcome) },
  { path: '/onboarding', element: withSuspense(Onboarding) },
  
  // Legacy routes - redirect to new flow
  { path: '/onboarding/location', element: <Navigate to="/onboarding" replace /> },
  { path: '/onboarding/preferences', element: <Navigate to="/onboarding" replace /> },
  { path: '/signup', element: <Navigate to="/onboarding" replace /> },

  // Auth
  { path: '/login', element: withSuspense(Login) },

  // ========================================
  // Rotas COM navegação inferior (AppLayout)
  // ========================================
  {
    element: withSuspense(AppLayout),
    children: [
      { path: '/feed', element: withSuspense(Feed) },
      { path: '/saved', element: withSuspense(SavedRestaurants) },
      { path: '/restaurant/:id', element: withSuspense(RestaurantPage) },
      { path: '/new-review', element: withSuspense(NewReview) },
      { path: '/activity', element: withSuspense(ActivityFeed) },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
]);