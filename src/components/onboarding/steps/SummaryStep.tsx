/**
 * FOMÍ - Summary Step (Tela 7)
 * Resumo do perfil + consentimentos
 */

import { Info } from 'lucide-react';
import type { OnboardingData } from '../types';
import { 
  STEP_CONTENT, 
  CUISINE_OPTIONS, 
  OCCASION_OPTIONS 
} from '../constants';
import { StepHeader } from '../components/UI';

interface SummaryStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  error: string | null;
}

export function SummaryStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
}: SummaryStepProps) {
  const content = STEP_CONTENT.summary;

  // Mapear IDs para labels
  const dislikedLabels = data.dislikedCuisines
    .map((id) => CUISINE_OPTIONS.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .slice(0, 3);

  const occasionLabels = data.occasions
    .map((id) => OCCASION_OPTIONS.find((o) => o.id === id)?.label)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <StepHeader
        title={content.title}
        subtitle={content.subtitle}
        showBack={!!onBack}
        onBack={onBack}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
      />

      {/* Resumo */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
        <h4 className="font-semibold text-gray-900">Seu perfil</h4>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Cidade / Bairro</span>
            <span className="text-gray-900 font-medium">
              {data.city}, {data.neighborhood}
            </span>
          </div>

          {dislikedLabels.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Não curte</span>
              <span className="text-gray-900 font-medium text-right">
                {dislikedLabels.join(', ')}
                {data.dislikedCuisines.length > 3 && ` +${data.dislikedCuisines.length - 3}`}
              </span>
            </div>
          )}

          {occasionLabels.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Ocasiões</span>
              <span className="text-gray-900 font-medium text-right">
                {occasionLabels.join(', ')}
                {data.occasions.length > 3 && ` +${data.occasions.length - 3}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Toggles de consentimento */}
      <div className="space-y-4">
        {/* Notificações */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="pt-0.5">
            <input
              type="checkbox"
              checked={data.notificationsEnabled}
              onChange={(e) => updateData({ notificationsEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
          </div>
          <div>
            <span className="font-medium text-gray-900">{content.notificationLabel}</span>
            <p className="text-sm text-gray-500">{content.notificationHelper}</p>
          </div>
        </label>

        {/* Beta tester */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="pt-0.5">
            <input
              type="checkbox"
              checked={data.betaTesterEnabled}
              onChange={(e) => updateData({ betaTesterEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
          </div>
          <span className="font-medium text-gray-900">{content.betaLabel}</span>
        </label>
      </div>

      {/* Aviso do e-mail */}
      <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">{content.emailWarning}</p>
      </div>
    </div>
  );
}