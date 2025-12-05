import React, { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginProps {
  onSuccess: () => void;
  onBack: () => void;
  onSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onBack, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (authError.message.includes('Invalid login')) {
        setError('E-mail ou senha incorretos');
      } else {
        setError('Erro ao entrar. Tente novamente.');
      }
      return;
    }

    if (data.user) {
      onSuccess();
    }
  };

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

    if (resetError) {
      setError('Erro ao enviar e-mail de recuperação');
    } else {
      setError(null);
      alert('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    }
  };

  const isFormValid = email && password;

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
        Bem-vindo de volta!
      </h1>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', textAlign: 'center', marginBottom: '32px' }}>
        Entre na sua conta
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-dark)', marginBottom: '8px' }}>
            E-mail
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
            Senha
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
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
        </div>

        {/* Forgot Password */}
        <button
          type="button"
          onClick={handleForgotPassword}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-red)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            textAlign: 'right',
            marginTop: '-8px',
          }}
        >
          Esqueceu a senha?
        </button>

        {/* Error */}
        {error && (
          <p style={{ color: 'var(--color-red)', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </p>
        )}

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
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Signup link */}
      <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', textAlign: 'center', marginTop: '24px' }}>
        Não tem uma conta?{' '}
        <button
          onClick={onSignup}
          style={{ background: 'none', border: 'none', color: 'var(--color-red)', fontWeight: 600, cursor: 'pointer' }}
        >
          Criar conta
        </button>
      </p>
    </div>
  );
};