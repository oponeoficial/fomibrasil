/**
 * FOMÍ - Email Confirm Step (Tela 8)
 * Confirmação de e-mail com reenvio
 */

import { Mail, RefreshCw } from 'lucide-react';
import { STEP_CONTENT } from '../constants';
import { CTAButton } from '../components/UI';

interface EmailConfirmStepProps {
  email: string;
  onResend: () => Promise<void>;
  onSkip: () => void;
  onFinish: () => void;
  loading: boolean;
}

export function EmailConfirmStep({
  email,
  onResend,
  onSkip,
  loading,
}: EmailConfirmStepProps) {
  const content = STEP_CONTENT.emailConfirm;

  const openEmailApp = () => {
    // Tentar abrir app de e-mail genérico
    window.open('mailto:', '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        {/* Ícone */}
        <div style={{ 
          width: '80px', 
          height: '80px', 
          backgroundColor: '#FFEDD5', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: '24px' 
        }}>
          <Mail style={{ width: '40px', height: '40px', color: '#F97316' }} />
        </div>

        {/* Título */}
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: '16px' }}>
          {content.title}
        </h1>

        {/* Texto */}
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <p style={{ color: '#6B7280', marginBottom: '8px' }}>
            Enviamos um e-mail para
          </p>
          <p style={{ fontWeight: 600, color: '#111827', marginBottom: '8px' }}>{email}</p>
          <p style={{ color: '#6B7280' }}>
            Abra o e-mail e clique em "Confirmar minha conta" pra começar a usar a FOMÍ de verdade.
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <CTAButton onClick={openEmailApp} variant="primary">
          {content.cta}
        </CTAButton>

        <CTAButton 
          onClick={onResend} 
          variant="outline"
          loading={loading}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            {content.resendCta}
          </span>
        </CTAButton>

        <button
          type="button"
          onClick={onSkip}
          style={{ 
            width: '100%', 
            textAlign: 'center', 
            fontSize: '14px', 
            color: '#6B7280', 
            padding: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {content.skipCta}
        </button>
      </div>
    </div>
  );
}