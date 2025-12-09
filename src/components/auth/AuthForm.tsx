/**
 * FOMÍ - AuthForm (Unificado)
 * 
 * Substitui Login.tsx e Signup.tsx
 * Atualizado: Signup redireciona para /onboarding
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
  onSuccess?: (email?: string) => void;
  onBack?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess, onBack }) => {
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  // Signup vai para onboarding, Login vai para feed
  const handleSuccess = onSuccess ?? (() => navigate(isSignup ? '/onboarding' : '/feed'));
  const handleBack = onBack ?? (() => navigate('/'));
  const handleSwitchMode = () => navigate(isSignup ? '/login' : '/signup');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Signup: gera username baseado no nome
  const generateUsername = (n: string) => {
    const base = n.toLowerCase().replace(/\s+/g, '').slice(0, 10);
    return `${base}${Math.floor(Math.random() * 99)}`;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!username || username === generateUsername(name)) {
      setUsername(generateUsername(value));
    }
  };

  // Login: forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Digite seu e-mail primeiro');
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) setError('Erro ao enviar e-mail de recuperação');
    else alert('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignup && password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    if (isSignup) {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
            full_name: name,
          },
        },
      });
      setLoading(false);

      if (authError) {
        setError(
          authError.message.includes('already registered')
            ? 'Este e-mail já está cadastrado'
            : 'Erro ao criar conta.'
        );
        return;
      }
      if (data.user) handleSuccess(email);
    } else {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);

      if (authError) {
        setError(
          authError.message.includes('Invalid login')
            ? 'E-mail ou senha incorretos'
            : 'Erro ao entrar. Tente novamente.'
        );
        return;
      }
      
      if (data.user) {
        // Verifica se onboarding foi completado
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        const onboardingCompleted = (profile as { onboarding_completed?: boolean } | null)?.onboarding_completed;
        
        if (profile && !onboardingCompleted) {
          navigate('/onboarding');
        } else {
          handleSuccess();
        }
      }
    }
  };

  // Validação
  const isFormValid = isSignup
    ? email && password.length >= 8 && name && username
    : email && password;

  // Config por modo
  const config = {
    login: {
      title: 'Bem-vindo de volta!',
      subtitle: 'Entre na sua conta',
      submitText: 'Entrar',
      loadingText: 'Entrando...',
      switchText: 'Não tem uma conta?',
      switchAction: 'Criar conta',
    },
    signup: {
      title: 'Crie sua conta',
      subtitle: 'Para não perder nada',
      submitText: 'Explorar o Fomí',
      loadingText: 'Criando conta...',
      switchText: 'Já tem uma conta?',
      switchAction: 'Entrar',
    },
  }[mode];

  return (
    <div className="min-h-screen bg-cream flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={handleBack} className="bg-transparent border-none cursor-pointer p-2 -ml-2">
          <ChevronLeft size={24} className="text-dark" />
        </button>
      </div>

      {/* Logo */}
      <div className="text-center mb-6">
        <img src="/images/logo-fomi.png" alt="Fomí" className="w-[100px] h-auto mx-auto" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-display font-bold text-dark text-center mb-2">
        {config.title}
      </h1>
      <p className="text-sm text-gray text-center mb-8">{config.subtitle}</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Signup: campos extras primeiro */}
        {isSignup && (
          <>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Como podemos te chamar?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Seu nome ou apelido"
                className="w-full p-3.5 border border-gray/30 rounded-lg text-base bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Seu nome de perfil
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray text-base">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full p-3.5 pl-8 border border-gray/30 rounded-lg text-base bg-white outline-none"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            {isSignup ? 'Seu e-mail' : 'E-mail'}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            className="w-full p-3.5 border border-gray/30 rounded-lg text-base bg-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            {isSignup ? 'Crie uma senha' : 'Senha'}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? 'Mínimo 8 caracteres' : 'Sua senha'}
              className="w-full p-3.5 pr-12 border border-gray/30 rounded-lg text-base bg-white outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {isSignup && <p className="text-xs text-gray mt-1">Mínimo de 8 caracteres</p>}
        </div>

        {/* Login: forgot password */}
        {!isSignup && (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="bg-transparent border-none text-red text-sm cursor-pointer text-right -mt-2"
          >
            Esqueceu a senha?
          </button>
        )}

        {error && <p className="text-red text-sm text-center">{error}</p>}

        {/* Signup: terms */}
        {isSignup && (
          <p className="text-xs text-gray text-center leading-relaxed">
            Ao criar conta, você concorda com nossos{' '}
            <a href="#" className="text-red">Termos de Uso</a> e{' '}
            <a href="#" className="text-red">Política de Privacidade</a>.
          </p>
        )}

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-4 px-6 border-none rounded-md text-base font-semibold cursor-pointer ${
            isFormValid && !loading
              ? 'bg-red text-white shadow-[0_4px_15px_rgba(255,59,48,0.3)]'
              : 'bg-light-gray text-gray cursor-not-allowed'
          }`}
        >
          {loading ? config.loadingText : config.submitText}
        </button>
      </form>

      {/* Switch mode */}
      <p className="text-sm text-gray text-center mt-6">
        {config.switchText}{' '}
        <button
          onClick={handleSwitchMode}
          className="bg-transparent border-none text-red font-semibold cursor-pointer"
        >
          {config.switchAction}
        </button>
      </p>
    </div>
  );
};

// Wrappers para compatibilidade com rotas
export const Login: React.FC = () => <AuthForm mode="login" />;
export const Signup: React.FC = () => <AuthForm mode="signup" />;

export default AuthForm;