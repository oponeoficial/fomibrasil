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
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 90,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          maxWidth: '80vw',
          backgroundColor: 'var(--color-cream)',
          zIndex: 100,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? 'var(--shadow-card)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-red)',
                backgroundImage: userImage ? `url(${userImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}
            >
              {!userImage && userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-dark)' }}>{userName}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Ver perfil</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <X size={24} color="var(--color-dark)" />
          </button>
        </div>

        {/* Menu Sections */}
        <div style={{ flex: 1, padding: '16px 0' }}>
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
        <div style={{ padding: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <img src="/images/logo-fomi.png" alt="Fomí" style={{ height: '24px', marginBottom: '8px' }} />
          <p style={{ fontSize: '0.7rem', color: 'var(--color-gray)' }}>© 2025 Fomí. Todos os direitos reservados.</p>
        </div>
      </div>
    </>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '16px 20px 8px' }}>
    {children}
  </p>
);

const MenuItemButton: React.FC<{ item: MenuItem; onClick: () => void; isDestructive?: boolean }> = ({ item, onClick, isDestructive }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      width: '100%',
      padding: '12px 20px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      color: isDestructive ? 'var(--color-red)' : 'var(--color-dark)',
      fontSize: '0.95rem',
      transition: 'background-color 0.2s ease',
    }}
  >
    <span style={{ color: isDestructive ? 'var(--color-red)' : 'var(--color-gray)' }}>{item.icon}</span>
    <span>{item.label}</span>
  </button>
);