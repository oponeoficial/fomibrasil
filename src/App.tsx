import React, { useState, useEffect } from 'react';
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
  | 'feed'
  | 'login'
  | 'signup'
  | 'post-signup';

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Screen state
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

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
      
      // Se já está logado, vai direto pro feed
      if (session?.user) {
        setScreen('feed');
        setHasCompletedOnboarding(true);
      }
      
      // Checar se já fez onboarding (localStorage)
      const onboarded = localStorage.getItem('fomi_onboarded');
      if (onboarded) {
        setHasCompletedOnboarding(true);
        if (!session?.user) {
          setScreen('feed');
        }
      }
      
      setAuthLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      
      if (event === 'SIGNED_IN') {
        setScreen('post-signup');
      } else if (event === 'SIGNED_OUT') {
        setScreen('welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show signup banner after interactions
  useEffect(() => {
    if (!user && hasCompletedOnboarding && !bannerDismissed && interactionCount >= 3) {
      setShowSignupBanner(true);
    }
  }, [interactionCount, user, hasCompletedOnboarding, bannerDismissed]);

  const trackInteraction = () => {
    setInteractionCount((c) => c + 1);
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  const handleSaveRestaurant = (id: number) => {
    trackInteraction();
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
    setHasCompletedOnboarding(true);
    setScreen('feed');
  };

  const handleSignupSuccess = () => {
    setScreen('post-signup');
    setShowSignupBanner(false);
  };

  const handlePostSignupComplete = () => {
    setScreen('feed');
  };

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.username || 'Visitante';

  // Loading
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/images/logo-fomi.png" alt="Fomí" style={{ width: '120px', opacity: 0.5 }} />
      </div>
    );
  }

  // Render screens
  if (screen === 'welcome') {
    return (
      <Welcome
        onStart={() => setScreen('location')}
        onLogin={() => setScreen('login')}
      />
    );
  }

  if (screen === 'location') {
    return (
      <Location
        onLocationGranted={handleLocationGranted}
        onManualCity={() => setScreen('preferences')}
        onSkip={() => setScreen('preferences')}
      />
    );
  }

  if (screen === 'preferences') {
    return (
      <Preferences
        onComplete={handlePreferencesComplete}
        onBack={() => setScreen('location')}
      />
    );
  }

  if (screen === 'login') {
    return (
      <Login
        onSuccess={() => setScreen('feed')}
        onBack={() => setScreen('welcome')}
        onSignup={() => setScreen('signup')}
      />
    );
  }

  if (screen === 'signup') {
    return (
      <Signup
        onSuccess={handleSignupSuccess}
        onBack={() => setScreen('welcome')}
        onLogin={() => setScreen('login')}
      />
    );
  }

  if (screen === 'post-signup') {
    return <PostSignup onComplete={handlePostSignupComplete} />;
  }

  // Main Feed
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onFilterClick={() => setIsFilterOpen((prev) => !prev)}
        onNotificationsClick={() => {}}
        hasNotifications={true}
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
          if (section === 'logout') supabase.auth.signOut();
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
        {/* Hero */}
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

        {/* Sugestões baseadas nas preferências */}
        {userPreferences && (
          <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', marginBottom: '16px' }}>
            Baseado no que você nos contou, aqui estão algumas sugestões…
          </p>
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
      {showSignupBanner && !user && (
        <SignupBanner
          onSignup={() => setScreen('signup')}
          onDismiss={() => {
            setShowSignupBanner(false);
            setBannerDismissed(true);
          }}
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