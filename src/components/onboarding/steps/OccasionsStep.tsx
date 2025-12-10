/**
 * FOMÍ - Occasions Step (Tela 4)
 * O que "ativa" o usuário a sair para comer
 */

import type { OnboardingData } from '../types';
import { 
  STEP_CONTENT, 
  OCCASION_OPTIONS, 
  OCCASION_VALIDATION,
  OCCASION_GROUPS 
} from '../constants';
import { StepHeader } from '../components/UI';
import { ChipSelector } from '../components/ChipSelector';

interface OccasionsStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  error: string | null;
}

export function OccasionsStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
}: OccasionsStepProps) {
  const content = STEP_CONTENT.occasions;

  const handleChange = (selected: string[]) => {
    updateData({ occasions: selected });
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

      <ChipSelector
        options={OCCASION_OPTIONS}
        selected={data.occasions}
        onChange={handleChange}
        validation={OCCASION_VALIDATION}
        groups={OCCASION_GROUPS}
        columns={2}
      />
    </div>
  );
}