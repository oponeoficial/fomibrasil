import React from 'react';

interface WelcomeProps {
  onStart: () => void;
  onLogin: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart, onLogin }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '40px' }}>
        <img
          src="/images/logo-fomi.png"
          alt="Fomí"
          style={{
            width: '180px',
            height: 'auto',
          }}
        />
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: '1.25rem',
          color: 'var(--color-dark)',
          marginBottom: '60px',
          maxWidth: '280px',
          lineHeight: 1.5,
        }}
      >
        Encontre o restaurante perfeito para cada momento.
      </p>

      {/* Botões */}
      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: 'var(--color-red)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
          }}
        >
          Começar a explorar
        </button>

        <button
          onClick={onLogin}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: 'transparent',
            color: 'var(--color-dark)',
            border: '1px solid var(--color-dark)',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Já tenho uma conta
        </button>
      </div>
    </div>
  );
};