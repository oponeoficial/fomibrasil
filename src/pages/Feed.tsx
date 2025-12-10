/**
 * FOMÍ - Feed Page (Refatorado)
 * 
 * Usa dados reais do Supabase.
 * Migrado de inline styles para Tailwind.
 * Atualizado para usar Layout unificado.
 */

import { useNavigate } from 'react-router-dom';
import { Settings2, Loader2 } from 'lucide-react';
// Layout unificado - import de arquivo único
import { Header, Sidebar, FilterPanel } from '../components/layout/Layout';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { RestaurantDetails } from '../components/restaurant/RestaurantDetails';
import { Profile } from '../components/profile/Profile';
import { useFeedRestaurants } from '../hooks/useRestaurants';
import { getGreeting, getContextualMessage } from '../utils/helpers';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';

export default function Feed() {
  const navigate = useNavigate();

  // Store state
  const user = useStore((s) => s.user);
  const isGuest = useStore((s) => s.isGuest());
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);
  const filterOpen = useStore((s) => s.filterOpen);
  const setFilterOpen = useStore((s) => s.setFilterOpen);
  const selectedRestaurant = useStore((s) => s.selectedRestaurant);
  const setSelectedRestaurant = useStore((s) => s.setSelectedRestaurant);
  const savedRestaurants = useStore((s) => s.savedRestaurants);
  const toggleSavedRestaurant = useStore((s) => s.toggleSavedRestaurant);
  const selectedFilters = useStore((s) => s.selectedFilters);
  const toggleFilter = useStore((s) => s.toggleFilter);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  // Busca restaurantes reais
  const { restaurants, loading, error, refresh } = useFeedRestaurants(
    searchQuery,
    selectedFilters
  );

  const userName = user?.user_metadata?.full_name || 'Visitante';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream font-sans">
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
          if (section === 'activity') navigate('/activity');
          if (section === 'logout') handleLogout();
        }}
      />

      <main
        className={`pt-[calc(60px+16px)] pb-[90px] ${
          activeTab === 'profile' ? 'px-0' : 'px-4'
        }`}
      >
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
            {/* Banner de preferências para guests */}
            {isGuest && (
              <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-2xl shadow-soft">
                <p className="text-sm text-dark font-medium">
                  Baseado no que você nos contou…
                </p>
                <button
                  onClick={() => navigate('/onboarding/preferences')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-light-gray rounded-full text-xs text-gray font-medium"
                >
                  <Settings2 size={14} />
                  Ajustar
                </button>
              </div>
            )}

            {/* Greeting para usuários logados */}
            {!isGuest && (
              <div className="mb-4">
                <p className="text-sm text-gray mb-1">
                  {getGreeting()}, {userName.split(' ')[0]}!
                </p>
                <h2 className="text-xl font-display font-bold text-dark">
                  {getContextualMessage()}
                </h2>
              </div>
            )}

            {/* Título para guests */}
            {isGuest && (
              <h2 className="text-xl font-display font-bold text-dark mb-4">
                Aqui estão algumas sugestões…
              </h2>
            )}

            {/* Loading state */}
            {loading && restaurants.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="text-red animate-spin mb-4" />
                <p className="text-gray text-sm">Carregando restaurantes...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-4xl mb-4">😕</span>
                <p className="text-dark font-semibold mb-2">Ops! Algo deu errado</p>
                <p className="text-gray text-sm mb-4">{error}</p>
                <button
                  onClick={refresh}
                  className="px-4 py-2 bg-red text-white rounded-lg text-sm font-medium"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && restaurants.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-4xl mb-4">🍽️</span>
                <p className="text-dark font-semibold mb-2">
                  Nenhum restaurante encontrado
                </p>
                <p className="text-gray text-sm">
                  {searchQuery
                    ? 'Tente ajustar sua busca'
                    : 'Volte mais tarde para novas sugestões'}
                </p>
              </div>
            )}

            {/* Restaurant list */}
            <div>
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelect={() => setSelectedRestaurant(restaurant)}
                />
              ))}
            </div>

            {/* Loading more indicator */}
            {loading && restaurants.length > 0 && (
              <div className="flex justify-center py-4">
                <Loader2 size={24} className="text-red animate-spin" />
              </div>
            )}
          </>
        )}

        {/* Placeholder para outras tabs */}
        {activeTab !== 'home' && activeTab !== 'profile' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-5">
            <span className="text-5xl mb-4">🚧</span>
            <h3 className="text-lg font-semibold text-dark mb-2">Em breve!</h3>
            <p className="text-sm text-gray">Esta seção está sendo desenvolvida.</p>
          </div>
        )}
      </main>

      {/* Restaurant Details Modal */}
      {selectedRestaurant && (
        <RestaurantDetails
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </div>
  );
}