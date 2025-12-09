/**
 * FOMÍ - Layout Components (Unificado)
 * 
 * Substitui: Header.tsx, Sidebar.tsx, BottomNavigation.tsx, FilterPanel.tsx
 * LOC: ~220 (antes: ~290 em 4 arquivos)
 */

import React from 'react';
import {
  Menu, Bell, SlidersHorizontal, X, Search, ChevronDown,
  Home, Compass, PlusCircle, MessageCircle, User,
  Bookmark, Users, List, Target, Crown, Settings,
  HelpCircle, Share2, LogOut,
} from 'lucide-react';
import { TabId } from '../../types';

// ============================================================================
// DADOS ESTÁTICOS
// ============================================================================

const filterChips = [
  { id: 'solo', label: 'Sozinho', icon: '👤' },
  { id: 'couple', label: 'Casal', icon: '👥' },
  { id: 'friends', label: 'Amigos', icon: '🎉' },
  { id: 'family', label: 'Família', icon: '👨‍👩‍👧‍👦' },
  { id: 'romantic', label: 'Romântico', icon: '🕯️' },
  { id: 'casual', label: 'Casual', icon: '☕' },
  { id: 'italian', label: 'Italiana', icon: '🍝' },
  { id: 'japanese', label: 'Japonesa', icon: '🍣' },
  { id: 'burger', label: 'Hambúrguer', icon: '🍔' },
];

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  isAction?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Início', icon: <Home size={24} /> },
  { id: 'discover', label: 'Descobrir', icon: <Compass size={24} /> },
  { id: 'newreview', label: 'Avaliar', icon: <PlusCircle size={28} />, isAction: true },
  { id: 'activity', label: 'Atividade', icon: <MessageCircle size={24} /> },
  { id: 'profile', label: 'Perfil', icon: <User size={24} /> },
];

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: 'main' | 'social' | 'system';
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Início', icon: <Home size={20} />, section: 'main' },
  { id: 'search', label: 'Busca Avançada', icon: <Search size={20} />, section: 'main' },
  { id: 'saved', label: 'Restaurantes Salvos', icon: <Bookmark size={20} />, section: 'main' },
  { id: 'friends', label: 'Meus Amigos', icon: <Users size={20} />, section: 'main' },
  { id: 'lists', label: 'Minhas Listas', icon: <List size={20} />, section: 'main' },
  { id: 'foryou', label: 'Para Você', icon: <Target size={20} />, section: 'main' },
  { id: 'activity', label: 'Atividade', icon: <MessageCircle size={20} />, section: 'social' },
  { id: 'foodies', label: 'Foodies que sigo', icon: <Crown size={20} />, section: 'social' },
  { id: 'settings', label: 'Configurações', icon: <Settings size={20} />, section: 'system' },
  { id: 'help', label: 'Ajuda e Feedback', icon: <HelpCircle size={20} />, section: 'system' },
  { id: 'invite', label: 'Convidar Amigos', icon: <Share2 size={20} />, section: 'system' },
  { id: 'logout', label: 'Sair', icon: <LogOut size={20} />, section: 'system' },
];

// ============================================================================
// HEADER
// ============================================================================

interface HeaderProps {
  onMenuClick: () => void;
  onFilterClick: () => void;
  onNotificationsClick: () => void;
  hasNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onFilterClick,
  onNotificationsClick,
  hasNotifications = false,
}) => (
  <header className="fixed top-0 left-0 right-0 h-[60px] bg-cream/95 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-4 z-50">
    <button
      onClick={onMenuClick}
      className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center"
    >
      <Menu size={24} className="text-dark" />
    </button>

    <img src="/images/logo-fomi.png" alt="Fomí" className="h-[60px] object-contain" />

    <div className="flex items-center gap-1">
      <button
        onClick={onNotificationsClick}
        className="relative w-10 h-10 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center"
      >
        <Bell size={22} className="text-dark" />
        {hasNotifications && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red rounded-full border-2 border-cream" />
        )}
      </button>

      <button
        onClick={onFilterClick}
        className="w-10 h-10 rounded-full border-none bg-transparent cursor-pointer flex items-center justify-center"
      >
        <SlidersHorizontal size={22} className="text-dark" />
      </button>
    </div>
  </header>
);

// ============================================================================
// FILTER PANEL
// ============================================================================

interface FilterPanelProps {
  isExpanded: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isExpanded,
  onClose,
  selectedFilters,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => (
  <div
    className={`fixed top-[60px] left-0 right-0 z-40 bg-cream/98 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${
      isExpanded ? 'max-h-[300px] shadow-card' : 'max-h-0'
    }`}
  >
    <div className="p-4">
      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-soft mb-4">
        <Search size={20} className="text-gray" />
        <input
          type="text"
          placeholder="Buscar restaurantes, pratos ou bairros..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 border-none outline-none text-sm bg-transparent text-dark placeholder:text-gray"
        />
        {searchQuery && (
          <button onClick={() => onSearchChange('')} className="bg-transparent border-none cursor-pointer p-0">
            <X size={18} className="text-gray" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filterChips.map((chip) => {
          const isSelected = selectedFilters.includes(chip.id);
          return (
            <button
              key={chip.id}
              onClick={() => onFilterChange(chip.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-2 border-red bg-red/10 text-red font-semibold'
                  : 'border border-gray/30 bg-white text-dark font-normal'
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Close hint */}
      <div className="flex justify-center mt-2">
        <button
          onClick={onClose}
          className="bg-transparent border-none cursor-pointer flex items-center gap-1 text-gray text-xs"
        >
          <ChevronDown size={16} />
          <span>Fechar filtros</span>
        </button>
      </div>
    </div>
  </div>
);

// ============================================================================
// SIDEBAR
// ============================================================================

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userImage?: string;
  onNavigate: (section: string) => void;
}

// Sub-componentes privados
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[0.7rem] font-semibold text-gray uppercase tracking-wide px-5 pt-4 pb-2">
    {children}
  </p>
);

const MenuItemButton: React.FC<{
  item: MenuItem;
  onClick: () => void;
  isDestructive?: boolean;
}> = ({ item, onClick, isDestructive }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3.5 w-full px-5 py-3 bg-transparent border-none cursor-pointer text-left text-[0.95rem] transition-colors duration-200 hover:bg-black/5 ${
      isDestructive ? 'text-red' : 'text-dark'
    }`}
  >
    <span className={isDestructive ? 'text-red' : 'text-gray'}>{item.icon}</span>
    <span>{item.label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  userName,
  userImage,
  onNavigate,
}) => {
  const mainItems = menuItems.filter((i) => i.section === 'main');
  const socialItems = menuItems.filter((i) => i.section === 'social');
  const systemItems = menuItems.filter((i) => i.section === 'system');

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[280px] max-w-[80vw] bg-cream z-[100] transition-transform duration-300 ease-out flex flex-col overflow-y-auto ${
          isOpen ? 'translate-x-0 shadow-card' : '-translate-x-full shadow-none'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full bg-red bg-cover bg-center flex items-center justify-center text-white font-bold text-xl"
              style={userImage ? { backgroundImage: `url(${userImage})` } : {}}
            >
              {!userImage && userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-base text-dark">{userName}</p>
              <p className="text-xs text-gray">Ver perfil</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer p-2">
            <X size={24} className="text-dark" />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 py-4">
          <SectionTitle>Principal</SectionTitle>
          {mainItems.map((item) => (
            <MenuItemButton
              key={item.id}
              item={item}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
            />
          ))}

          <SectionTitle>Social</SectionTitle>
          {socialItems.map((item) => (
            <MenuItemButton
              key={item.id}
              item={item}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
            />
          ))}

          <SectionTitle>Sistema</SectionTitle>
          {systemItems.map((item) => (
            <MenuItemButton
              key={item.id}
              item={item}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              isDestructive={item.id === 'logout'}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/5 text-center">
          <img src="/images/logo-fomi.png" alt="Fomí" className="h-6 mb-2 mx-auto" />
          <p className="text-[0.7rem] text-gray">© 2025 Fomí. Todos os direitos reservados.</p>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// BOTTOM NAVIGATION
// ============================================================================

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => (
  <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-white/95 backdrop-blur-md border-t border-black/5 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0)] z-50">
    {navItems.map((item) => {
      const isActive = activeTab === item.id;

      if (item.isAction) {
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center justify-center gap-0.5 px-4 py-3 bg-red border-none rounded-full cursor-pointer text-white -translate-y-2.5 shadow-[0_4px_15px_rgba(255,59,48,0.4)] transition-transform duration-200 hover:scale-105"
          >
            {item.icon}
          </button>
        );
      }

      return (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 bg-transparent border-none cursor-pointer transition-colors duration-200 ${
            isActive ? 'text-red' : 'text-gray'
          }`}
        >
          {item.icon}
          <span className={`text-[0.65rem] ${isActive ? 'font-semibold' : 'font-normal'}`}>
            {item.label}
          </span>
        </button>
      );
    })}
  </nav>
);