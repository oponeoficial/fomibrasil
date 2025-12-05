import React, { useState, useEffect } from 'react';
import { Settings2 } from 'lucide-react';
import { Header } from './components/layout/Header';
import { FilterPanel } from './components/layout/FilterPanel';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { RestaurantCard } from './components/restaurant/RestaurantCard';
import { RestaurantDetails } from './components/restaurant/RestaurantDetails';
import { Profile } from './components/profile/Profile';
import { Welcome } from './components/onboarding/Welcome';
import { Location } from './components/onboarding/Location';
import { Preferences } from './components/onboarding/Preferences';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { SignupBanner } from './components/auth/SignupBanner';
import { EmailConfirmation } from './components/auth/EmailConfirmation';
import { PostSignup } from './components/auth/PostSignup';
import { mockRestaurants } from './data/mockData';
import { getGreeting, getContextualMessage } from './utils/helpers';
import { Restaurant, TabId } from './types';
import { supabase } from './lib/supabase';
import { useLeadOnboarding, LeadPreferences } from './hooks/useLeadOnboarding';
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

  // Lead Onboarding hook (Supabase)
  const lead = useLeadOnboarding();

  // App state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRestaurants, setSavedRestaurants] = useState<number[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Banner state
  const [showSignupBanner, setShowSignupBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  // Preferências locais (para o componente Preferences)
  const [localPrefs, setLocalPrefs] = useState<LeadPreferences>({
    company: [],
    mood: [],
    restrictions: [],
    budget: null,
  });

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        setScreen('feed');
      } else if (lead.initialized) {
        // Verificar se lead já completou onboarding
        if (lead.leadData.onboardingCompleted) {
          setScreen('guest-feed');
          setLocalPrefs(lead.leadData.preferences);
        }
      }

      setAuthLoading(false);
    };

    if (lead.initialized) {
      checkAuth();
    }
  }, [lead.initialized, lead.leadData.onboardingCompleted]);

  // Auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);

      if (event === 'SIGNED_IN' && session?.user) {
        setShowSignupBanner(false);

        // Converter lead para usuário (migra dados para profiles)
        await lead.convertToUser(session.user.id);

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
  }, [isNewUser, lead]);

  // Timer para mostrar banner após 3 segundos no guest-feed
  useEffect(() => {
    if (screen === 'guest-feed' && !bannerDismissed && !showSignupBanner) {
      const timer = setTimeout(() => {
        setShowSignupBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen, bannerDismissed, showSignupBanner]);

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

  // ========================================
  // ONBOARDING HANDLERS
  // ========================================

  // Welcome: Iniciar onboarding
  const handleStartOnboarding = async () => {
    console.log('Iniciando onboarding...');
    const result = await lead.initLead();
    console.log('Lead criado:', result);
    setScreen('location');
  };

  // Location: Salvar localização no Supabase
  const handleSaveLocation = async (
    latitude: number,
    longitude: number,
    options?: { city?: string }
  ) => {
    console.log('handleSaveLocation chamado:', { latitude, longitude, options });
    const result = await lead.saveLocation({
      latitude,
      longitude,
      city: options?.city,
    });
    console.log('Resultado saveLocation:', result);
    return result;
  };

  // Location: Concluída
  const handleLocationComplete = () => {
    setScreen('preferences');
  };

  // Preferences: Salvar todas as preferências de uma vez no Supabase
  const handleSaveAllPreferences = async (prefs: LeadPreferences) => {
    console.log('=== handleSaveAllPreferences ===');
    console.log('Preferências recebidas:', prefs);
    
    try {
      const result = await lead.savePreferences(prefs, 'completed');
      console.log('Resultado do save:', result);
      return result;
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      return { success: false };
    }
  };

  // Preferences: Concluídas
  const handlePreferencesComplete = () => {
    setScreen('guest-feed');
  };

  const handleAdjustPreferences = () => {
    setScreen('preferences');
  };

  // ========================================
  // AUTH HANDLERS
  // ========================================

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

  // ========================================
  // RENDER
  // ========================================

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.username || 'Visitante';
  const isGuest = screen === 'guest-feed';

  // Loading
  if (authLoading || !lead.initialized) {
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
        onStart={handleStartOnboarding}
        onLogin={() => setScreen('login')}
      />
    );
  }

  // Location
  if (screen === 'location') {
    return (
      <Location
        onComplete={handleLocationComplete}
        onSaveLocation={handleSaveLocation}
        saving={lead.saving}
      />
    );
  }

  // Preferences
  if (screen === 'preferences') {
    return (
      <Preferences
        onComplete={(prefs) => {
          setLocalPrefs(prefs);
          handlePreferencesComplete();
        }}
        onSaveToSupabase={handleSaveAllPreferences}
        saving={lead.saving}
      />
    );
  }

  // Login
  if (screen === 'login') {
    return (
      <Login
        onSuccess={handleLoginSuccess}
        onBack={() => setScreen(lead.leadData.onboardingCompleted ? 'guest-feed' : 'welcome')}
        onSignup={() => setScreen('signup')}
      />
    );
  }

  // Signup
  if (screen === 'signup') {
    return (
      <Signup
        onSuccess={handleSignupSuccess}
        onBack={() => setScreen(lead.leadData.onboardingCompleted ? 'guest-feed' : 'welcome')}
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
          paddingLeft: activeTab === 'profile' ? '0' : '16px',
          paddingRight: activeTab === 'profile' ? '0' : '16px',
        }}
      >
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <Profile
            user={user ? { name: userName, email: user.email } : null}
            isGuest={isGuest}
            stats={{ reviews: 0, saved: savedRestaurants.length, visited: 0 }}
            onLogin={() => setScreen('login')}
            onSignup={() => setScreen('signup')}
            onLogout={async () => {
              await supabase.auth.signOut();
              setScreen('welcome');
            }}
            onEditProfile={() => {}}
            onSettings={() => {}}
          />
        )}

        {/* HOME TAB - Feed de Restaurantes */}
        {activeTab === 'home' && (
          <>
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
          </>
        )}

        {/* Placeholder para outras abas */}
        {activeTab !== 'home' && activeTab !== 'profile' && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '60vh',
            color: 'var(--color-gray)',
            textAlign: 'center',
            padding: '20px',
          }}>
            <span style={{ fontSize: '3rem', marginBottom: '16px' }}>🚧</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-dark)' }}>
              Em breve!
            </h3>
            <p style={{ fontSize: '0.9rem' }}>
              Esta seção está sendo desenvolvida.
            </p>
          </div>
        )}
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