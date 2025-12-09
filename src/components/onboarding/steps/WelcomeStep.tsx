/**
 * FOMÍ - Welcome Step (Tela 0)
 */

import { STEP_CONTENT } from '../constants';
import { CTAButton } from '../components/UI';

interface WelcomeStepProps {
  onContinue: () => void;
  onLogin: () => void;
}

export function WelcomeStep({ onContinue, onLogin }: WelcomeStepProps) {
  const content = STEP_CONTENT.welcome;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Logo e ilustração */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-orange-500/30">
          <span className="text-4xl">🍽️</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          {content.title}
        </h1>

        <p className="text-gray-600 text-center max-w-xs">
          {content.subtitle}
        </p>
      </div>

      {/* CTAs */}
      <div className="p-6 space-y-3">
        <CTAButton onClick={onContinue} variant="primary">
          {content.cta}
        </CTAButton>

        <CTAButton onClick={onLogin} variant="outline">
          {content.secondaryCta}
        </CTAButton>
      </div>
    </div>
  );
}