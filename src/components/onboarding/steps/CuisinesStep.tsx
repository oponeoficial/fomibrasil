/**
 * FOMÍ - Cuisines Step (Tela 3)
 * Filtro negativo - cozinhas que o usuário NÃO curte
 */

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
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
    <div>
      <StepHeader
        title={content.title}
        subtitle={content.subtitle}
        showBack={!!onBack}
        onBack={onBack}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
      />

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6"
      >
        <Info size={20} className="text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">{content.helper}</p>
      </motion.div>

      <ChipSelector
        options={CUISINE_OPTIONS}
        selected={data.dislikedCuisines}
        onChange={handleChange}
        columns={2}
      />

      {data.dislikedCuisines.length > 0 && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray text-center mt-6"
        >
          {data.dislikedCuisines.length} cozinha(s) que você vai evitar
        </motion.p>
      )}
    </div>
  );
}