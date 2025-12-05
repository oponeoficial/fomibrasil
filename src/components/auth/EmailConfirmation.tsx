import React from 'react';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailConfirmationProps {
  email: string;
  onConfirm: () => void;
}

export const EmailConfirmation: React.FC<EmailConfirmationProps> = ({ email, onConfirm }) => {
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
      {/* Ícone */}
      <div
        style={{
          width: '120px',
          height: '120px',
          backgroundColor: 'rgba(52, 199, 89, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          position: 'relative',
        }}
      >
        <Mail size={56} color="#34C759" strokeWidth={1.5} />
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: '#34C759',
            borderRadius: '50%',
            padding: '4px',
          }}
        >
          <CheckCircle size={24} color="#fff" />
        </div>
      </div>

      {/* Título */}
      <h1
        style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-dark)',
          marginBottom: '12px',
        }}
      >
        Verifique seu e-mail
      </h1>

      {/* Descrição */}
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--color-gray)',
          marginBottom: '8px',
          maxWidth: '300px',
          lineHeight: 1.5,
        }}
      >
        Enviamos um link de confirmação para:
      </p>

      {/* Email */}
      <p
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-dark)',
          marginBottom: '24px',
        }}
      >
        {email}
      </p>

      {/* Instrução */}
      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--color-gray)',
          marginBottom: '40px',
          maxWidth: '280px',
          lineHeight: 1.5,
        }}
      >
        Clique no link do e-mail para ativar sua conta. Depois, volte aqui para entrar.
      </p>

      {/* Dica */}
      <div
        style={{
          backgroundColor: 'rgba(255, 149, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px',
          maxWidth: '300px',
        }}
      >
        <p style={{ fontSize: '0.85rem', color: 'var(--color-orange)' }}>
          💡 Não encontrou? Verifique a pasta de spam.
        </p>
      </div>

      {/* Botão */}
      <button
        onClick={onConfirm}
        style={{
          width: '100%',
          maxWidth: '320px',
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
        Entendido
      </button>
    </div>
  );
};