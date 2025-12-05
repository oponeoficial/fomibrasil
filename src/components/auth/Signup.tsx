import React, { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SignupProps {
  onSuccess: (email: string) => void;
  onBack: () => void;
  onLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSuccess, onBack, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);
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
      setError(authError.message.includes('already registered') ? 'Este e-mail já está cadastrado' : 'Erro ao criar conta.');
      return;
    }

    if (data.user) onSuccess(email);
  };

  const isFormValid = email && password.length >= 8 && name && username;

  return (
    <div className="min-h-screen bg-cream flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="bg-transparent border-none cursor-pointer p-2 -ml-2">
          <ChevronLeft size={24} className="text-dark" />
        </button>
      </div>

      {/* Logo */}
      <div className="text-center mb-6">
        <img src="/images/logo-fomi.png" alt="Fomí" className="w-[100px] h-auto mx-auto" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-display font-bold text-dark text-center mb-2">Crie sua conta</h1>
      <p className="text-sm text-gray text-center mb-8">Para não perder nada</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">Seu e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            className="w-full p-3.5 border border-gray/30 rounded-lg text-base bg-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">Crie uma senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
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
          <p className="text-xs text-gray mt-1">Mínimo de 8 caracteres</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">Como podemos te chamar?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Seu nome ou apelido"
            className="w-full p-3.5 border border-gray/30 rounded-lg text-base bg-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">Seu nome de perfil</label>
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

        {error && <p className="text-red text-sm text-center">{error}</p>}

        <p className="text-xs text-gray text-center leading-relaxed">
          Ao criar conta, você concorda com nossos{' '}
          <a href="#" className="text-red">Termos de Uso</a> e{' '}
          <a href="#" className="text-red">Política de Privacidade</a>.
        </p>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-4 px-6 border-none rounded-md text-base font-semibold cursor-pointer ${
            isFormValid && !loading
              ? 'bg-red text-white shadow-[0_4px_15px_rgba(255,59,48,0.3)]'
              : 'bg-light-gray text-gray cursor-not-allowed'
          }`}
        >
          {loading ? 'Criando conta...' : 'Explorar o Fomí'}
        </button>
      </form>

      {/* Login link */}
      <p className="text-sm text-gray text-center mt-6">
        Já tem uma conta?{' '}
        <button onClick={onLogin} className="bg-transparent border-none text-red font-semibold cursor-pointer">
          Entrar
        </button>
      </p>
    </div>
  );
};