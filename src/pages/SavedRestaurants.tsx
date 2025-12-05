import { useNavigate } from 'react-router-dom';
import { SavedRestaurants as SavedComponent } from '../components/saved/SavedRestaurants';
import { useAuthStore } from '../stores';

export default function SavedRestaurants() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <SavedComponent
      userId={user?.id || null}
      onBack={() => navigate('/feed')}
      onRestaurantClick={(id) => console.log('Restaurant clicked:', id)}
    />
  );
}