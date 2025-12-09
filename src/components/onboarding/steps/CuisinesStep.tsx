/**
 * FOMÍ - Cuisines Step (Tela 3)
 * Filtro negativo - cozinhas que o usuário NÃO curte
 */

import type { OnboardingData } from '../types';
import { STEP_CONTENT, CUISINE_OPTIONS } from '../constants';
import { StepHeader } from '../components/UI';
import { ChipSelector } from '../components/ChipSelector';

interface CuisinesStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  error: string | null;
}

export function CuisinesStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
}: CuisinesStepProps) {
  const content = STEP_CONTENT.cuisines;

  const handleChange = (selected: string[]) => {
    updateData({ dislikedCuisines: selected });
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

      <p className="text-sm text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
        {content.helper}
      </p>

      <ChipSelector
        options={CUISINE_OPTIONS}
        selected={data.dislikedCuisines}
        onChange={handleChange}
        columns={2}
      />

      {data.dislikedCuisines.length > 0 && (
        <p className="text-sm text-gray-500 text-center">
          {data.dislikedCuisines.length} cozinha(s) selecionada(s)
        </p>
      )}
    </div>
  );
}