import React from 'react';
import { X, Home, Search, Bookmark, Users, List, Target, MessageCircle, Crown, Settings, HelpCircle, Share2, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userImage?: string;
  onNavigate: (section: string) => void;
}

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

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userName, userImage, onNavigate }) => {
  const mainItems = menuItems.filter(i => i.section === 'main');
  const socialItems = menuItems.filter(i => i.section === 'social');
  const systemItems = menuItems.filter(i => i.section === 'system');

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
          {mainItems.map(item => (
            <MenuItemButton key={item.id} item={item} onClick={() => { onNavigate(item.id); onClose(); }} />
          ))}

          <SectionTitle>Social</SectionTitle>
          {socialItems.map(item => (
            <MenuItemButton key={item.id} item={item} onClick={() => { onNavigate(item.id); onClose(); }} />
          ))}

          <SectionTitle>Sistema</SectionTitle>
          {systemItems.map(item => (
            <MenuItemButton key={item.id} item={item} onClick={() => { onNavigate(item.id); onClose(); }} isDestructive={item.id === 'logout'} />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/5 text-center">
          <img src="/images/logo-fomi.png" alt="Fomí" className="h-6 mb-2" />
          <p className="text-[0.7rem] text-gray">© 2025 Fomí. Todos os direitos reservados.</p>
        </div>
      </div>
    </>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[0.7rem] font-semibold text-gray uppercase tracking-wide px-5 pt-4 pb-2">
    {children}
  </p>
);

const MenuItemButton: React.FC<{ item: MenuItem; onClick: () => void; isDestructive?: boolean }> = ({ item, onClick, isDestructive }) => (
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