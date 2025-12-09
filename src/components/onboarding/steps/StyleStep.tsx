/**
 * FOMÍ - Style Step (Tela 5)
 * Frequência + Tipo de lugar + Estilo de decisão
 */

import type { OnboardingData } from '../types';
import {
  STEP_CONTENT,
  FREQUENCY_OPTIONS,
  PLACE_TYPE_OPTIONS,
  PLACE_TYPE_VALIDATION,
  DECISION_STYLE_OPTIONS,
  DECISION_STYLE_VALIDATION,
} from '../constants';
import { StepHeader } from '../components/UI';
import { ChipSelector, SingleSelect } from '../components/ChipSelector';

interface StyleStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  error: string | null;
}

export function StyleStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
}: StyleStepProps) {
  const content = STEP_CONTENT.style;

  return (
    <div className="space-y-8">
      <StepHeader
        title={content.title}
        subtitle={content.subtitle}
        showBack={!!onBack}
        onBack={onBack}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
      />

      {/* Seção 1: Frequência (seleção única) */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">
          {content.frequencyQuestion}
        </h3>
        <SingleSelect
          options={FREQUENCY_OPTIONS}
          selected={data.frequency}
          onChange={(v) => updateData({ frequency: v })}
        />
      </div>

      {/* Seção 2: Tipo de lugar (2-5) */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            {content.placeTypeQuestion}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {content.placeTypeHelper}
          </p>
        </div>
        <ChipSelector
          options={PLACE_TYPE_OPTIONS}
          selected={data.placeTypes}
          onChange={(v) => updateData({ placeTypes: v })}
          validation={PLACE_TYPE_VALIDATION}
          columns={2}
        />
      </div>

      {/* Seção 3: Estilo de decisão (1-2) */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">
          {content.decisionQuestion}
        </h3>
        <ChipSelector
          options={DECISION_STYLE_OPTIONS}
          selected={data.decisionStyle}
          onChange={(v) => updateData({ decisionStyle: v })}
          validation={DECISION_STYLE_VALIDATION}
          columns={2}
        />
      </div>
    </div>
  );
}