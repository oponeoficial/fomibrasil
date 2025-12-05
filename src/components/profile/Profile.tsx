import React from 'react';
import { 
  Settings, 
  Heart, 
  Star, 
  MapPin, 
  Edit3, 
  ChevronRight,
  LogOut,
  HelpCircle,
  Bell,
  Shield,
  Users
} from 'lucide-react';

interface ProfileProps {
  user: {
    name: string;
    email?: string;
    avatar?: string;
  } | null;
  isGuest: boolean;
  stats: {
    reviews: number;
    saved: number;
    visited: number;
  };
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onNavigateToSaved?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  user,
  isGuest,
  stats,
  onLogin,
  onSignup,
  onLogout,
  onEditProfile,
  onSettings,
  onNavigateToSaved,
}) => {
  const menuItems = [
    { id: 'saved', icon: <Heart size={20} />, label: 'Restaurantes Salvos', value: stats.saved },
    { id: 'reviews', icon: <Star size={20} />, label: 'Minhas Avaliações', value: stats.reviews },
    { id: 'visited', icon: <MapPin size={20} />, label: 'Lugares Visitados', value: stats.visited },
    { id: 'friends', icon: <Users size={20} />, label: 'Amigos', value: null },
  ];

  const settingsItems = [
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notificações' },
    { id: 'privacy', icon: <Shield size={20} />, label: 'Privacidade' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Configurações' },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Ajuda' },
  ];

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Profile Header */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '0 0 24px 24px',
          padding: '24px',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        {isGuest ? (
          // Guest View
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-light-gray)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '2rem' }}>👤</span>
            </div>
            <h2
              style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                color: 'var(--color-dark)',
                marginBottom: '8px',
              }}
            >
              Visitante
            </h2>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-gray)',
                marginBottom: '20px',
              }}
            >
              Crie uma conta para salvar seus favoritos e muito mais!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={onSignup}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'var(--color-red)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
                }}
              >
                Criar Conta
              </button>
              <button
                onClick={onLogin}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-red)',
                  border: '2px solid var(--color-red)',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Entrar
              </button>
            </div>
          </div>
        ) : (
          // Logged User View
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-red)',
                  backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                {!user?.avatar && user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-dark)',
                    marginBottom: '4px',
                  }}
                >
                  {user?.name || 'Usuário'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>
                  {user?.email || ''}
                </p>
              </div>
              <button
                onClick={onEditProfile}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-light-gray)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Edit3 size={18} color="var(--color-gray)" />
              </button>
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <StatItem value={stats.reviews} label="Avaliações" />
              <StatItem value={stats.saved} label="Salvos" />
              <StatItem value={stats.visited} label="Visitados" />
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      {!isGuest && (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            margin: '0 16px 16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              value={item.value}
              showBorder={index < menuItems.length - 1}
              onClick={item.id === 'saved' ? onNavigateToSaved : undefined}
            />
          ))}
        </div>
      )}

      {/* Settings Items */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          margin: '0 16px 16px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        {settingsItems.map((item, index) => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            showBorder={index < settingsItems.length - 1}
            onClick={item.id === 'settings' ? onSettings : undefined}
          />
        ))}
      </div>

      {/* Logout */}
      {!isGuest && (
        <div
          style={{
            margin: '0 16px',
          }}
        >
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#fff',
              border: 'none',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--color-red)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <LogOut size={20} />
            Sair da Conta
          </button>
        </div>
      )}

      {/* App Version */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-gray)',
          marginTop: '24px',
        }}
      >
        Fomí v1.0.0
      </p>
    </div>
  );
};

// Sub-components
const StatItem: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <p
      style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: 'var(--color-dark)',
        fontFamily: 'var(--font-display)',
      }}
    >
      {value}
    </p>
    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>{label}</p>
  </div>
);

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: number | null;
  showBorder?: boolean;
  onClick?: () => void;
}> = ({ icon, label, value, showBorder = true, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: showBorder ? '1px solid rgba(0,0,0,0.05)' : 'none',
      cursor: 'pointer',
      textAlign: 'left',
    }}
  >
    <span style={{ color: 'var(--color-gray)' }}>{icon}</span>
    <span style={{ flex: 1, fontSize: '0.95rem', color: 'var(--color-dark)' }}>{label}</span>
    {value !== null && value !== undefined && (
      <span
        style={{
          padding: '4px 10px',
          backgroundColor: 'var(--color-light-gray)',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--color-dark)',
        }}
      >
        {value}
      </span>
    )}
    <ChevronRight size={18} color="var(--color-gray)" />
  </button>
);