/**
 * FOMÍ - App Layout
 * 
 * Layout compartilhado que mantém a navegação inferior
 * fixa em todas as telas do app.
 */

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation } from './Layout';
import { TabId } from '../../types';
import { useStore } from '../../store';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setActiveTab = useStore((s) => s.setActiveTab);
  const activeTab = useStore((s) => s.activeTab);

  // Determinar tab ativa baseado na rota atual
  const getActiveTab = (): TabId => {
    const path = location.pathname;
    if (path === '/activity') return 'activity';
    if (path === '/new-review') return 'newreview';
    // Para /feed, usar o activeTab do store (pode ser home, profile, discover)
    if (path === '/feed' || path.startsWith('/restaurant') || path === '/saved') {
      return activeTab;
    }
    return 'home';
  };

  // Handler para navegação das tabs
  const handleTabChange = (tab: TabId) => {
    switch (tab) {
      case 'home':
        setActiveTab('home');
        navigate('/feed');
        break;
      case 'newreview':
        navigate('/new-review');
        break;
      case 'activity':
        navigate('/activity');
        break;
      case 'profile':
        setActiveTab('profile');
        navigate('/feed');
        break;
      case 'discover':
        setActiveTab('discover');
        navigate('/feed');
        break;
      default:
        navigate('/feed');
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Conteúdo da página atual */}
      <Outlet />
      
      {/* Navegação fixa embaixo */}
      <BottomNavigation 
        activeTab={getActiveTab()} 
        onTabChange={handleTabChange} 
      />
    </div>
  );
};

export default AppLayout;