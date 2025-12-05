import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { FilterPanel } from './components/layout/FilterPanel';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { RestaurantCard } from './components/restaurant/RestaurantCard';
import { RestaurantDetails } from './components/restaurant/RestaurantDetails';
import { mockRestaurants } from './data/mockData';
import { getGreeting, getContextualMessage } from './utils/helpers';
import { Restaurant, TabId } from './types';
import './styles/index.css';

export default function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>('home');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [savedRestaurants, setSavedRestaurants] = useState<number[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [userName] = useState('Carlos');

    const handleFilterChange = (filterId: string) => {
        setSelectedFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(id => id !== filterId)
                : [...prev, filterId]
        );
    };

    const handleSaveRestaurant = (id: number) => {
        setSavedRestaurants(prev =>
            prev.includes(id)
                ? prev.filter(r => r !== id)
                : [...prev, id]
        );
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
            {/* Header */}
            <Header
                onMenuClick={() => setIsSidebarOpen(true)}
                onFilterClick={() => setIsFilterOpen(prev => !prev)}
                onNotificationsClick={() => { }}
                hasNotifications={true}
            />

            {/* Filter Panel */}
            <FilterPanel
                isExpanded={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userName={userName}
                onNavigate={(section) => {
                    if (section === 'home') setActiveTab('home');
                }}
            />

            {/* Main Content */}
            <main
                style={{
                    paddingTop: 'calc(var(--header-height) + 16px)',
                    paddingBottom: '90px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                }}
            >
                {/* Hero Greeting */}
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
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'blur(2px) brightness(0.7)',
                        }}
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
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '4px' }}>{getGreeting()}, {userName}</p>
                        <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{getContextualMessage()}</h2>
                    </div>
                </div>

                {/* Restaurant Feed */}
                <div>
                    {mockRestaurants.map(restaurant => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onSelect={setSelectedRestaurant}
                            onSave={handleSaveRestaurant}
                            isSaved={savedRestaurants.includes(restaurant.id)}
                        />
                    ))}
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

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
