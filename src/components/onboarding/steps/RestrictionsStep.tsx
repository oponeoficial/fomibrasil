/**
 * FOMÍ - Restrictions Step (Tela 6)
 * Restrições alimentares com lógica especial do "Não tenho"
 */

import type { OnboardingData } from '../types';
import { STEP_CONTENT, RESTRICTION_OPTIONS } from '../constants';
import { StepHeader } from '../components/UI';
import { toggleRestriction } from '../hooks/useOnboarding';

interface RestrictionsStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  error: string | null;
}

export function RestrictionsStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
}: RestrictionsStepProps) {
  const content = STEP_CONTENT.restrictions;

  const handleToggle = (chipId: string) => {
    const newRestrictions = toggleRestriction(data.restrictions, chipId);
    updateData({ restrictions: newRestrictions });
  };

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

      <div className="grid grid-cols-2 gap-2">
        {RESTRICTION_OPTIONS.map((option) => {
          const isSelected = data.restrictions.includes(option.id);
          const isNone = option.id === 'none';

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleToggle(option.id)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 border-2
                ${isNone ? 'col-span-2' : ''}
                ${isSelected
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                }
              `}
            >
              <span className="text-lg">{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}