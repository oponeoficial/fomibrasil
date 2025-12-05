import React from 'react';
import { X } from 'lucide-react';

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
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
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

      {/* Content */}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '4px' }}>
          Quer salvar seus favoritos?
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>
          Crie sua conta em 30 segundos.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onSignup}
        style={{
          padding: '10px 16px',
          backgroundColor: 'var(--color-red)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Continuar
      </button>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          padding: '4px',
          cursor: 'pointer',
          color: 'var(--color-gray)',
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
};