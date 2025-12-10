/**
 * FOMÍ - Style Step (Tela 5)
 * Frequência + Tipo de lugar + Estilo de decisão
 */

import { motion } from 'framer-motion';
import type { OnboardingData } from '../types';
import {
  STEP_CONTENT,
  FREQUENCY_OPTIONS,
  PLACE_TYPE_OPTIONS,
  PLACE_TYPE_VALIDATION,
  DECISION_STYLE_OPTIONS,
  DECISION_STYLE_VALIDATION,
} from '../constants';
import { StepHeader, SectionTitle } from '../components/UI';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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

      <motion.div
        className="space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Seção 1: Frequência */}
        <motion.div variants={itemVariants}>
          <SectionTitle>{content.frequencyQuestion}</SectionTitle>
          <SingleSelect
            options={FREQUENCY_OPTIONS}
            selected={data.frequency}
            onChange={(v) => updateData({ frequency: v })}
          />
        </motion.div>

        {/* Seção 2: Tipo de lugar */}
        <motion.div variants={itemVariants}>
          <SectionTitle subtitle={content.placeTypeHelper}>
            {content.placeTypeQuestion}
          </SectionTitle>
          <ChipSelector
            options={PLACE_TYPE_OPTIONS}
            selected={data.placeTypes}
            onChange={(v) => updateData({ placeTypes: v })}
            validation={PLACE_TYPE_VALIDATION}
            columns={2}
          />
        </motion.div>

        {/* Seção 3: Estilo de decisão */}
        <motion.div variants={itemVariants}>
          <SectionTitle>{content.decisionQuestion}</SectionTitle>
          <ChipSelector
            options={DECISION_STYLE_OPTIONS}
            selected={data.decisionStyle}
            onChange={(v) => updateData({ decisionStyle: v })}
            validation={DECISION_STYLE_VALIDATION}
            columns={2}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}