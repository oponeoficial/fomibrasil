/**
 * FOMÍ - AuthForm (Login by Username ou Email)
 * 
 * Padrão: Login usando username
 * Alternativa: Botão para entrar com e-mail
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type LoginMode = 'username' | 'email';

// Helper para chamar RPC não tipada
async function getEmailByUsername(username: string): Promise<string | null> {
  const { data, error } = await supabase.rpc(
    'get_email_by_username' as never,
    { p_username: username } as never
  );
  
  if (error || !data) return null;
  return data as string;
}

export const AuthForm: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [mode, setMode] = useState<LoginMode>('username');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => navigate('/');
  const handleSignup = () => navigate('/onboarding');

  // Normalizar username
  const handleUsernameChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9._]/g, '');
    setUsername(normalized);
  };

  // Alternar modo
  const toggleMode = () => {
    setMode(mode === 'username' ? 'email' : 'username');
    setError(null);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let loginEmail = email;

      // Se modo username, buscar email primeiro
      if (mode === 'username') {
        const foundEmail = await getEmailByUsername(username);

        if (!foundEmail) {
          setError('Usuário não encontrado');
          setLoading(false);
          return;
        }

        loginEmail = foundEmail;
      }

      // Fazer login com email + senha
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (authError) {
        setError(
          authError.message.includes('Invalid login')
            ? mode === 'username' 
              ? 'Usuário ou senha incorretos'
              : 'E-mail ou senha incorretos'
            : 'Erro ao entrar. Tente novamente.'
        );
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const profile = userProfile as { onboarding_completed?: boolean } | null;

        if (profile?.onboarding_completed === false) {
          navigate('/onboarding');
        } else {
          navigate('/feed');
        }
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password (só funciona com email)
  const handleForgotPassword = async () => {
    if (mode === 'username') {
      setError('Para recuperar senha, use o login por e-mail');
      return;
    }
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

  const isFormValid = mode === 'username' 
    ? username.length >= 3 && password.length >= 8
    : email.includes('@') && password.length >= 8;

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
        {/* Campo de login (username ou email) + botão de alternar */}
        <div>
          {mode === 'username' ? (
            <>
              <label className="block text-sm font-medium text-dark mb-2">
                Nome de usuário
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="seunome"
                  className="w-full p-3.5 pl-8 border border-gray/30 rounded-lg text-base bg-white outline-none"
                />
              </div>
              <button
                type="button"
                onClick={toggleMode}
                className="bg-transparent border-none text-gray text-sm cursor-pointer mt-2 underline"
              >
                Entrar com e-mail
              </button>
            </>
          ) : (
            <>
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
              <button
                type="button"
                onClick={toggleMode}
                className="bg-transparent border-none text-gray text-sm cursor-pointer mt-2 underline"
              >
                Entrar com @usuário
              </button>
            </>
          )}
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

        {mode === 'email' && (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="bg-transparent border-none text-red text-sm cursor-pointer text-right -mt-2"
          >
            Esqueceu a senha?
          </button>
        )}

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

export const Login = AuthForm;
export default AuthForm;