/**
 * FOMÍ - Restrictions Step (Tela 6)
 * Restrições alimentares
 */

import type { OnboardingData } from '../types';
import { STEP_CONTENT, RESTRICTION_OPTIONS } from '../constants';
import { StepHeader } from '../components/UI';
import { RestrictionSelector } from '../components/ChipSelector';

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

  const handleChange = (selected: string[]) => {
    updateData({ restrictions: selected });
  };

  return (
    <div>
      <StepHeader
        title={content.title}
        subtitle={content.subtitle}
        showBack={!!onBack}
        onBack={onBack}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
      />

      <RestrictionSelector
        options={RESTRICTION_OPTIONS}
        selected={data.restrictions}
        onChange={handleChange}
      />
    </div>
  );
}