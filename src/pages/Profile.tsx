import { useNavigate } from 'react-router-dom';
import { Profile as ProfileComponent } from '../components/profile/Profile';
import { useAuthStore, useAppStore } from '../stores';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const savedRestaurants = useAppStore((s) => s.savedRestaurants);
  const isGuest = useAuthStore((s) => s.isGuest());

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <ProfileComponent
      user={user ? { name: user.user_metadata?.full_name || 'Usuário', email: user.email } : null}
      isGuest={isGuest}
      stats={{ reviews: 0, saved: savedRestaurants.length, visited: 0 }}
      onLogin={() => navigate('/login')}
      onSignup={() => navigate('/signup')}
      onLogout={handleLogout}
      onEditProfile={() => {}}
      onSettings={() => {}}
      onNavigateToSaved={() => navigate('/saved')}
    />
  );
}