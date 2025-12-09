/**
 * FOMÍ - Email Confirm Step (Tela 8)
 * Confirmação de e-mail - tela final
 */

import { Mail } from 'lucide-react';
import { STEP_CONTENT } from '../constants';
import { CTAButton } from '../components/UI';

interface EmailConfirmStepProps {
  email: string;
  onResend?: () => Promise<void>;
  onSkip?: () => void;
  onFinish: () => void;
  loading?: boolean;
}

export function EmailConfirmStep({
  email,
  onFinish,
}: EmailConfirmStepProps) {
  const content = STEP_CONTENT.emailConfirm;

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
            Confirme seu e-mail e faça login para começar a usar a FOMÍ.
          </p>
        </div>
      </div>

      {/* CTA único */}
      <div style={{ padding: '24px' }}>
        <CTAButton onClick={onFinish} variant="primary">
          Ir para login
        </CTAButton>
      </div>
    </div>
  );
}