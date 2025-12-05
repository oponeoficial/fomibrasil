import React, { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SignupProps {
  onSuccess: () => void;
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

  // Gerar username sugerido
  const generateUsername = (name: string) => {
    const base = name.toLowerCase().replace(/\s+/g, '').slice(0, 10);
    const random = Math.floor(Math.random() * 99);
    return `${base}${random}`;
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
      if (authError.message.includes('already registered')) {
        setError('Este e-mail já está cadastrado');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      return;
    }

    if (data.user) {
      onSuccess();
    }
  };

  const isFormValid = email && password.length >= 8 && name && username;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-cream)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginLeft: '-8px' }}
        >
          <ChevronLeft size={24} color="var(--color-dark)" />
        </button>
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <img src="/images/logo-fomi.png" alt="Fomí" style={{ width: '100px', height: 'auto' }} />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-dark)',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        Crie sua conta
      </h1>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', textAlign: 'center', marginBottom: '32px' }}>
        Para não perder nada
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-dark)', marginBottom: '8px' }}>
            Seu e-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '1rem',
              backgroundColor: '#fff',
              outline: 'none',
            }}
          />
        </div>

        {/* Password */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-dark)', marginBottom: '8px' }}>
            Crie uma senha
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              style={{
                width: '100%',
                padding: '14px 48px 14px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                backgroundColor: '#fff',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-gray)',
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginTop: '4px' }}>
            Mínimo de 8 caracteres
          </p>
        </div>

        {/* Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-dark)', marginBottom: '8px' }}>
            Como podemos te chamar?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Seu nome ou apelido"
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '1rem',
              backgroundColor: '#fff',
              outline: 'none',
            }}
          />
        </div>

        {/* Username */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-dark)', marginBottom: '8px' }}>
            Seu nome de perfil
          </label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-gray)',
                fontSize: '1rem',
              }}
            >
              @
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              style={{
                width: '100%',
                padding: '14px 16px 14px 32px',
                border: '1px solid #e0e0e0',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                backgroundColor: '#fff',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: 'var(--color-red)', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </p>
        )}

        {/* Terms */}
        <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', textAlign: 'center', lineHeight: 1.5 }}>
          Ao criar conta, você concorda com nossos{' '}
          <a href="#" style={{ color: 'var(--color-red)' }}>Termos de Uso</a> e{' '}
          <a href="#" style={{ color: 'var(--color-red)' }}>Política de Privacidade</a>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: isFormValid && !loading ? 'var(--color-red)' : 'var(--color-light-gray)',
            color: isFormValid && !loading ? '#fff' : 'var(--color-gray)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
            boxShadow: isFormValid && !loading ? '0 4px 15px rgba(255, 59, 48, 0.3)' : 'none',
          }}
        >
          {loading ? 'Criando conta...' : 'Explorar o Fomí'}
        </button>
      </form>

      {/* Login link */}
      <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', textAlign: 'center', marginTop: '24px' }}>
        Já tem uma conta?{' '}
        <button
          onClick={onLogin}
          style={{ background: 'none', border: 'none', color: 'var(--color-red)', fontWeight: 600, cursor: 'pointer' }}
        >
          Entrar
        </button>
      </p>
    </div>
  );
};