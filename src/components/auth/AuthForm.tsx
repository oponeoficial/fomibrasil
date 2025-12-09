/**
 * FOMÍ - AuthForm (Login Only)
 * 
 * Signup agora acontece no final do Onboarding.
 * Este componente é apenas para login de usuários existentes.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AuthForm: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => navigate('/');
  const handleSignup = () => navigate('/onboarding');

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
    setLoading(true);

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
      
      const profileData = profile as { onboarding_completed?: boolean } | null;
      
      // Vai para onboarding apenas se onboarding_completed é explicitamente false
      // Usuários antigos (sem o campo ou com null) vão para feed
      if (profileData && profileData.onboarding_completed === false) {
        navigate('/onboarding');
      } else {
        navigate('/feed');
      }
    }
  };

  const isFormValid = email && password;

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
        Bem-vindo de volta!
      </h1>
      <p className="text-sm text-gray text-center mb-8">Entre na sua conta</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            E-mail
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
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
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
        </div>

        <button
          type="button"
          onClick={handleForgotPassword}
          className="bg-transparent border-none text-red text-sm cursor-pointer text-right -mt-2"
        >
          Esqueceu a senha?
        </button>

        {error && <p className="text-red text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-4 px-6 border-none rounded-md text-base font-semibold cursor-pointer flex items-center justify-center gap-2 ${
            isFormValid && !loading
              ? 'bg-red text-white shadow-[0_4px_15px_rgba(255,59,48,0.3)]'
              : 'bg-light-gray text-gray cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      {/* Switch to signup */}
      <p className="text-sm text-gray text-center mt-6">
        Não tem uma conta?{' '}
        <button
          onClick={handleSignup}
          className="bg-transparent border-none text-red font-semibold cursor-pointer"
        >
          Criar conta
        </button>
      </p>
    </div>
  );
};

// Export para compatibilidade com rotas
export const Login = AuthForm;

export default AuthForm;