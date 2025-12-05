import React, { useState, useEffect } from 'react';
import { Settings2 } from 'lucide-react';
import { Header } from './components/layout/Header';
import { FilterPanel } from './components/layout/FilterPanel';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { RestaurantCard } from './components/restaurant/RestaurantCard';
import { RestaurantDetails } from './components/restaurant/RestaurantDetails';
import { Welcome } from './components/onboarding/Welcome';
import { Location } from './components/onboarding/Location';
import { Preferences, UserPreferences } from './components/onboarding/Preferences';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { SignupBanner } from './components/auth/SignupBanner';
import { EmailConfirmation } from './components/auth/EmailConfirmation';
import { PostSignup } from './components/auth/PostSignup';
import { mockRestaurants } from './data/mockData';
import { getGreeting, getContextualMessage } from './utils/helpers';
import { Restaurant, TabId } from './types';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import './styles/index.css';

type AppScreen =
  | 'welcome'
  | 'location'
  | 'preferences'
  | 'guest-feed'
  | 'feed'
  | 'login'
  | 'signup'
  | 'email-confirmation'
  | 'post-signup';

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState(false);

  // Screen state
  const [screen, setScreen] = useState<AppScreen>('welcome');

  // App state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRestaurants, setSavedRestaurants] = useState<number[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Banner state
  const [showSignupBanner, setShowSignupBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        setScreen('feed');
      } else {
        const onboarded = localStorage.getItem('fomi_onboarded');
        const savedPrefs = localStorage.getItem('fomi_preferences');

        if (onboarded && savedPrefs) {
          setUserPreferences(JSON.parse(savedPrefs));
          setScreen('guest-feed');
        }
      }

      setAuthLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);

      if (event === 'SIGNED_IN' && session?.user) {
        setShowSignupBanner(false);
        
        // Se é novo usuário (acabou de confirmar email), vai para post-signup
        if (isNewUser) {
          setIsNewUser(false);
          setScreen('post-signup');
        } else {
          setScreen('feed');
        }
      } else if (event === 'SIGNED_OUT') {
        setScreen('welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, [isNewUser]);

  // Mostrar banner após interações
  useEffect(() => {
    if (screen === 'guest-feed' && !bannerDismissed && interactionCount >= 2) {
      setShowSignupBanner(true);
    }
  }, [interactionCount, screen, bannerDismissed]);

  const trackInteraction = () => {
    if (screen === 'guest-feed') {
      setInteractionCount((c) => c + 1);
    }
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  const handleSaveRestaurant = (id: number) => {
    trackInteraction();

    if (!user && screen === 'guest-feed') {
      setShowSignupBanner(true);
      return;
    }

    setSavedRestaurants((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    trackInteraction();
    setSelectedRestaurant(restaurant);
  };

  const handleLocationGranted = (coords: { latitude: number; longitude: number }) => {
    setUserLocation(coords);
    setScreen('preferences');
  };

  const handlePreferencesComplete = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    localStorage.setItem('fomi_onboarded', 'true');
    localStorage.setItem('fomi_preferences', JSON.stringify(prefs));
    setScreen('guest-feed');
  };

  const handleAdjustPreferences = () => {
    setScreen('preferences');
  };

  const handleSignupFromBanner = () => {
    setShowSignupBanner(false);
    setScreen('signup');
  };

  const handleDismissBanner = () => {
    setShowSignupBanner(false);
    setBannerDismissed(true);
  };

  const handleSignupSuccess = (email: string) => {
    setPendingEmail(email);
    setIsNewUser(true);
    setScreen('email-confirmation');
  };

  const handleEmailConfirmed = () => {
    setScreen('login');
  };

  const handleLoginSuccess = () => {
    // Se é novo usuário que acabou de confirmar email
    if (isNewUser) {
      setIsNewUser(false);
      setScreen('post-signup');
    } else {
      setScreen('feed');
    }
  };

  const handlePostSignupComplete = () => {
    setScreen('feed');
  };

  // Scroll tracking
  useEffect(() => {
    if (screen !== 'guest-feed' || bannerDismissed) return;

    const handleScroll = () => {
      if (window.scrollY > 300 && !showSignupBanner) {
        trackInteraction();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [screen, bannerDismissed, showSignupBanner]);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.username || 'Visitante';
  const isGuest = screen === 'guest-feed';

  // Loading
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/images/logo-fomi.png" alt="Fomí" style={{ width: '120px', opacity: 0.5 }} />
      </div>
    );
  }

  // Welcome
  if (screen === 'welcome') {
    return (
      <Welcome
        onStart={() => setScreen('location')}
        onLogin={() => setScreen('login')}
      />
    );
  }

  // Location
  if (screen === 'location') {
    return (
      <Location
        onLocationGranted={handleLocationGranted}
        onManualCity={() => setScreen('preferences')}
        onSkip={() => setScreen('preferences')}
      />
    );
  }

  // Preferences
  if (screen === 'preferences') {
    return (
      <Preferences
        onComplete={handlePreferencesComplete}
        onBack={() => setScreen('location')}
      />
    );
  }

  // Login
  if (screen === 'login') {
    return (
      <Login
        onSuccess={handleLoginSuccess}
        onBack={() => setScreen(userPreferences ? 'guest-feed' : 'welcome')}
        onSignup={() => setScreen('signup')}
      />
    );
  }

  // Signup
  if (screen === 'signup') {
    return (
      <Signup
        onSuccess={handleSignupSuccess}
        onBack={() => setScreen(userPreferences ? 'guest-feed' : 'welcome')}
        onLogin={() => setScreen('login')}
      />
    );
  }

  // Email Confirmation
  if (screen === 'email-confirmation') {
    return (
      <EmailConfirmation
        email={pendingEmail}
        onConfirm={handleEmailConfirmed}
      />
    );
  }

  // Post-Signup
  if (screen === 'post-signup') {
    return <PostSignup onComplete={handlePostSignupComplete} />;
  }

  // ========================================
  // FEED (Guest ou Logged)
  // ========================================
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onFilterClick={() => setIsFilterOpen((prev) => !prev)}
        onNotificationsClick={() => {}}
        hasNotifications={!isGuest}
      />

      <FilterPanel
        isExpanded={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userName={userName}
        onNavigate={(section) => {
          if (section === 'home') setActiveTab('home');
          if (section === 'logout') {
            if (user) {
              supabase.auth.signOut();
            } else {
              setScreen('welcome');
            }
          }
        }}
      />

      <main
        style={{
          paddingTop: 'calc(var(--header-height) + 16px)',
          paddingBottom: '90px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        {/* Cabeçalho para visitantes */}
        {isGuest && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              padding: '12px 16px',
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--color-dark)', fontWeight: 500 }}>
              Baseado no que você nos contou…
            </p>
            <button
              onClick={handleAdjustPreferences}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: 'var(--color-light-gray)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                color: 'var(--color-gray)',
                cursor: 'pointer',
              }}
            >
              <Settings2 size={14} />
              Ajustar
            </button>
          </div>
        )}

        {/* Hero - só para logados */}
        {!isGuest && (
          <div
            style={{
              position: 'relative',
              height: '180px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '24px',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
              alt="Restaurant ambiance"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px) brightness(0.7)' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '20px',
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '4px' }}>
                {getGreeting()}, {userName}
              </p>
              <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {getContextualMessage()}
              </h2>
            </div>
          </div>
        )}

        {/* Título para visitantes */}
        {isGuest && (
          <h2
            style={{
              fontSize: '1.25rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-dark)',
              marginBottom: '16px',
            }}
          >
            Aqui estão algumas sugestões…
          </h2>
        )}

        {/* Restaurant Feed */}
        <div>
          {mockRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onSelect={handleSelectRestaurant}
              onSave={handleSaveRestaurant}
              isSaved={savedRestaurants.includes(restaurant.id)}
            />
          ))}
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Signup Banner */}
      {showSignupBanner && isGuest && (
        <SignupBanner
          onSignup={handleSignupFromBanner}
          onDismiss={handleDismissBanner}
        />
      )}

      {/* Restaurant Details Modal */}
      {selectedRestaurant && (
        <RestaurantDetails
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onSave={handleSaveRestaurant}
          isSaved={savedRestaurants.includes(selectedRestaurant.id)}
        />
      )}
    </div>
  );
}