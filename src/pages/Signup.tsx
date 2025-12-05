import { useNavigate } from 'react-router-dom';
import { Signup as SignupComponent } from '../components/auth/Signup';

export default function Signup() {
  const navigate = useNavigate();

  return (
    <SignupComponent
      onSuccess={() => navigate('/login')}
      onBack={() => navigate('/')}
      onLogin={() => navigate('/login')}
    />
  );
}