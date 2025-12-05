import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Sidebar } from '../components/layout/Sidebar';
import { FilterPanel } from '../components/layout/FilterPanel';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { RestaurantDetails } from '../components/restaurant/RestaurantDetails';
import { Profile } from '../components/profile/Profile';
import { mockRestaurants } from '../data/mockData';
import { getGreeting, getContextualMessage } from '../utils/helpers';
import { useAuthStore, useAppStore } from '../stores';
import { supabase } from '../lib/supabase';
import type { Restaurant } from '../types';

export default function Feed() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest());
  
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    filterOpen,
    setFilterOpen,
    selectedRestaurant,
    setSelectedRestaurant,
    savedRestaurants,
    toggleSavedRestaurant,
    selectedFilters,
    toggleFilter,
    searchQuery,
    setSearchQuery,
  } = useAppStore();

  const userName = user?.user_metadata?.full_name || 'Visitante';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onFilterClick={() => setFilterOpen(!filterOpen)}
        onNotificationsClick={() => {}}
        hasNotifications={!isGuest}
      />

      <FilterPanel
        isExpanded={filterOpen}
        onClose={() => setFilterOpen(false)}
        selectedFilters={selectedFilters}
        onFilterChange={toggleFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        onNavigate={(section) => {
          if (section === 'home') setActiveTab('home');
          if (section === 'saved') navigate('/saved');
          if (section === 'logout') handleLogout();
        }}
      />

      <main style={{
        paddingTop: 'calc(var(--header-height) + 16px)',
        paddingBottom: '90px',
        paddingLeft: activeTab === 'profile' ? '0' : '16px',
        paddingRight: activeTab === 'profile' ? '0' : '16px',
      }}>
        {activeTab === 'profile' && (
          <Profile
            user={user ? { name: userName, email: user.email } : null}
            isGuest={isGuest}
            stats={{ reviews: 0, saved: savedRestaurants.length, visited: 0 }}
            onLogin={() => navigate('/login')}
            onSignup={() => navigate('/signup')}
            onLogout={handleLogout}
            onEditProfile={() => {}}
            onSettings={() => {}}
            onNavigateToSaved={() => navigate('/saved')}
          />
        )}

        {activeTab === 'home' && (
          <>
            {isGuest && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                padding: '12px 16px',
                backgroundColor: '#fff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-soft)',
              }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-dark)', fontWeight: 500 }}>
                  Baseado no que você nos contou…
                </p>
                <button
                  onClick={() => navigate('/onboarding/preferences')}
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

            {!isGuest && (
              <div style={{
                position: 'relative',
                height: '180px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: '24px',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Restaurant ambiance"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px) brightness(0.7)' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px',
                }}>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '4px' }}>
                    {getGreeting()}, {userName}
                  </p>
                  <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                    {getContextualMessage()}
                  </h2>
                </div>
              </div>
            )}

            {isGuest && (
              <h2 style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-dark)',
                marginBottom: '16px',
              }}>
                Aqui estão algumas sugestões…
              </h2>
            )}

            <div>
              {mockRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelect={() => setSelectedRestaurant(restaurant)}
                  onSave={() => toggleSavedRestaurant(restaurant.id)}
                  isSaved={savedRestaurants.includes(restaurant.id)}
                />
              ))}
            </div>
          </>
        )}

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
            <p style={{ fontSize: '0.9rem' }}>Esta seção está sendo desenvolvida.</p>
          </div>
        )}
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {selectedRestaurant && (
        <RestaurantDetails
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onSave={() => toggleSavedRestaurant(selectedRestaurant.id)}
          isSaved={savedRestaurants.includes(selectedRestaurant.id)}
        />
      )}
    </div>
  );
}