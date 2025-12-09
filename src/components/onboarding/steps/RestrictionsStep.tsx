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
    <div>
      <StepHeader
        title={content.title}
        subtitle={content.subtitle}
        showBack={!!onBack}
        onBack={onBack}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {RESTRICTION_OPTIONS.map((option) => {
          const isSelected = data.restrictions.includes(option.id);
          const isNone = option.id === 'none';

          const chipStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s',
            border: isSelected ? '2px solid #F97316' : '2px solid #E5E7EB',
            backgroundColor: isSelected ? '#F97316' : '#FFFFFF',
            color: isSelected ? '#FFFFFF' : '#374151',
            boxShadow: isSelected ? '0 4px 12px rgba(249, 115, 22, 0.3)' : 'none',
            cursor: 'pointer',
            gridColumn: isNone ? 'span 2' : 'auto',
          };

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleToggle(option.id)}
              style={chipStyle}
            >
              <span style={{ fontSize: '18px' }}>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}