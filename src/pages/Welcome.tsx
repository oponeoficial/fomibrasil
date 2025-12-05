import { useNavigate } from 'react-router-dom';
import { Welcome as WelcomeComponent } from '../components/onboarding/Welcome';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <WelcomeComponent
      onStart={() => navigate('/onboarding/location')}
      onLogin={() => navigate('/login')}
    />
  );
}