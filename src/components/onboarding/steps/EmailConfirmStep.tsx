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
  onFinish,
  loading,
}: EmailConfirmStepProps) {
  const content = STEP_CONTENT.emailConfirm;

  const openEmailApp = () => {
    // Tentar abrir app de e-mail genérico
    window.open('mailto:', '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Ícone */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-10 h-10 text-orange-500" />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
          {content.title}
        </h1>

        {/* Texto */}
        <div className="text-center space-y-2 max-w-xs">
          <p className="text-gray-600">
            Enviamos um e-mail para
          </p>
          <p className="font-semibold text-gray-900">{email}</p>
          <p className="text-gray-600">
            Abra o e-mail e clique em "Confirmar minha conta" pra começar a usar a FOMÍ de verdade.
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="p-6 space-y-3">
        <CTAButton onClick={openEmailApp} variant="primary">
          {content.cta}
        </CTAButton>

        <CTAButton 
          onClick={onResend} 
          variant="outline"
          loading={loading}
        >
          <span className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            {content.resendCta}
          </span>
        </CTAButton>

        <button
          type="button"
          onClick={onSkip}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
        >
          {content.skipCta}
        </button>
      </div>
    </div>
  );
}