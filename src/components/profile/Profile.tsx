import React from 'react';
import { Settings, Heart, Star, MapPin, Edit3, ChevronRight, LogOut, HelpCircle, Bell, Shield, Users } from 'lucide-react';

interface ProfileProps {
  user: { name: string; email?: string; avatar?: string } | null;
  isGuest: boolean;
  stats: { reviews: number; saved: number; visited: number };
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
  onSettings: () => void;
  onNavigateToSaved?: () => void;
}

const menuItems = [
  { id: 'saved', icon: <Heart size={20} />, label: 'Restaurantes Salvos', hasValue: true },
  { id: 'reviews', icon: <Star size={20} />, label: 'Minhas Avaliações', hasValue: true },
  { id: 'visited', icon: <MapPin size={20} />, label: 'Lugares Visitados', hasValue: true },
  { id: 'friends', icon: <Users size={20} />, label: 'Amigos', hasValue: false },
];

const settingsItems = [
  { id: 'notifications', icon: <Bell size={20} />, label: 'Notificações' },
  { id: 'privacy', icon: <Shield size={20} />, label: 'Privacidade' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Configurações' },
  { id: 'help', icon: <HelpCircle size={20} />, label: 'Ajuda' },
];

export const Profile: React.FC<ProfileProps> = ({
  user, isGuest, stats, onLogin, onSignup, onLogout, onEditProfile, onSettings, onNavigateToSaved,
}) => {
  const getStatValue = (id: string) => {
    if (id === 'saved') return stats.saved;
    if (id === 'reviews') return stats.reviews;
    if (id === 'visited') return stats.visited;
    return null;
  };

  return (
    <div className="pb-24">
      {/* Profile Header */}
      <div className="bg-white rounded-b-3xl p-6 mb-4 shadow-soft">
        {isGuest ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-light-gray mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <h2 className="text-xl font-bold font-display text-dark mb-2">Visitante</h2>
            <p className="text-sm text-gray mb-5">Crie uma conta para salvar seus favoritos e muito mais!</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onSignup}
                className="py-3 px-6 bg-red text-white border-none rounded-xl text-[0.95rem] font-semibold cursor-pointer shadow-[0_4px_15px_rgba(255,59,48,0.3)]"
              >
                Criar Conta
              </button>
              <button
                onClick={onLogin}
                className="py-3 px-6 bg-transparent text-red border-2 border-red rounded-xl text-[0.95rem] font-semibold cursor-pointer"
              >
                Entrar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4">
              <div
                className="w-[72px] h-[72px] rounded-full bg-red bg-cover bg-center flex items-center justify-center text-white text-3xl font-bold"
                style={{ backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none' }}
              >
                {!user?.avatar && user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold font-display text-dark mb-1">{user?.name || 'Usuário'}</h2>
                <p className="text-sm text-gray">{user?.email || ''}</p>
              </div>
              <button
                onClick={onEditProfile}
                className="w-10 h-10 rounded-full bg-light-gray border-none cursor-pointer flex items-center justify-center"
              >
                <Edit3 size={18} className="text-gray" />
              </button>
            </div>

            <div className="flex justify-around mt-6 pt-5 border-t border-black/5">
              {[
                { value: stats.reviews, label: 'Avaliações' },
                { value: stats.saved, label: 'Salvos' },
                { value: stats.visited, label: 'Visitados' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-dark font-display">{stat.value}</p>
                  <p className="text-xs text-gray">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      {!isGuest && (
        <div className="bg-white rounded-2xl mx-4 mb-4 overflow-hidden shadow-soft">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={item.id === 'saved' ? onNavigateToSaved : undefined}
              className={`w-full p-4 flex items-center gap-3 bg-transparent border-none cursor-pointer text-left ${
                index < menuItems.length - 1 ? 'border-b border-black/5' : ''
              }`}
            >
              <span className="text-gray">{item.icon}</span>
              <span className="flex-1 text-[0.95rem] text-dark">{item.label}</span>
              {item.hasValue && (
                <span className="py-1 px-2.5 bg-light-gray rounded-xl text-xs font-semibold text-dark">
                  {getStatValue(item.id)}
                </span>
              )}
              <ChevronRight size={18} className="text-gray" />
            </button>
          ))}
        </div>
      )}

      {/* Settings Items */}
      <div className="bg-white rounded-2xl mx-4 mb-4 overflow-hidden shadow-soft">
        {settingsItems.map((item, index) => (
          <button
            key={item.id}
            onClick={item.id === 'settings' ? onSettings : undefined}
            className={`w-full p-4 flex items-center gap-3 bg-transparent border-none cursor-pointer text-left ${
              index < settingsItems.length - 1 ? 'border-b border-black/5' : ''
            }`}
          >
            <span className="text-gray">{item.icon}</span>
            <span className="flex-1 text-[0.95rem] text-dark">{item.label}</span>
            <ChevronRight size={18} className="text-gray" />
          </button>
        ))}
      </div>

      {/* Logout */}
      {!isGuest && (
        <div className="mx-4">
          <button
            onClick={onLogout}
            className="w-full p-4 bg-white border-none rounded-2xl flex items-center justify-center gap-2 text-red text-base font-semibold cursor-pointer shadow-soft"
          >
            <LogOut size={20} />
            Sair da Conta
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray mt-6">Fomí v1.0.0</p>
    </div>
  );
};