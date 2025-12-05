import { useNavigate } from 'react-router-dom';
import { Login as LoginComponent } from '../components/auth/Login';

export default function Login() {
  const navigate = useNavigate();

  return (
    <LoginComponent
      onSuccess={() => navigate('/feed')}
      onBack={() => navigate('/')}
      onSignup={() => navigate('/signup')}
    />
  );
}