import React from 'react';

interface SignupBannerProps {
  onSignup: () => void;
  onDismiss: () => void;
}

export const SignupBanner: React.FC<SignupBannerProps> = ({ onSignup, onDismiss }) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '16px',
        right: '16px',
        backgroundColor: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        zIndex: 60,
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Texto principal */}
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '4px' }}>
        Quer salvar seus favoritos e ver onde seus amigos vão?
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '16px' }}>
        Crie sua conta em 30 segundos.
      </p>

      {/* Botões */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onSignup}
          style={{
            flex: 1,
            padding: '14px 20px',
            backgroundColor: 'var(--color-red)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
          }}
        >
          Continuar
        </button>

        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          Mais tarde
        </button>
      </div>
    </div>
  );
};