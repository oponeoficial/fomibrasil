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

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#F9FAFB',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '24px',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
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

      {/* Resumo */}
      <div style={cardStyle}>
        <h4 style={{ fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Seu perfil</h4>

        <div>
          <div style={rowStyle}>
            <span style={{ color: '#6B7280' }}>Cidade / Bairro</span>
            <span style={{ color: '#111827', fontWeight: 500 }}>
              {data.city}, {data.neighborhood}
            </span>
          </div>

          {dislikedLabels.length > 0 && (
            <div style={rowStyle}>
              <span style={{ color: '#6B7280' }}>Não curte</span>
              <span style={{ color: '#111827', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
                {dislikedLabels.join(', ')}
                {data.dislikedCuisines.length > 3 && ` +${data.dislikedCuisines.length - 3}`}
              </span>
            </div>
          )}

          {occasionLabels.length > 0 && (
            <div style={{ ...rowStyle, marginBottom: 0 }}>
              <span style={{ color: '#6B7280' }}>Ocasiões</span>
              <span style={{ color: '#111827', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
                {occasionLabels.join(', ')}
                {data.occasions.length > 3 && ` +${data.occasions.length - 3}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Toggles de consentimento */}
      <div style={{ marginBottom: '24px' }}>
        {/* Notificações */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '16px' }}>
          <div style={{ paddingTop: '2px' }}>
            <input
              type="checkbox"
              checked={data.notificationsEnabled}
              onChange={(e) => updateData({ notificationsEnabled: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: '#F97316' }}
            />
          </div>
          <div>
            <span style={{ fontWeight: 500, color: '#111827', display: 'block' }}>{content.notificationLabel}</span>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>{content.notificationHelper}</p>
          </div>
        </label>

        {/* Beta tester */}
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
          <div style={{ paddingTop: '2px' }}>
            <input
              type="checkbox"
              checked={data.betaTesterEnabled}
              onChange={(e) => updateData({ betaTesterEnabled: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: '#F97316' }}
            />
          </div>
          <span style={{ fontWeight: 500, color: '#111827' }}>{content.betaLabel}</span>
        </label>
      </div>

      {/* Aviso do e-mail */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '12px', 
        backgroundColor: '#EFF6FF', 
        borderRadius: '12px', 
        padding: '16px' 
      }}>
        <Info style={{ width: '20px', height: '20px', color: '#3B82F6', flexShrink: 0 }} />
        <p style={{ fontSize: '14px', color: '#1D4ED8' }}>{content.emailWarning}</p>
      </div>
    </div>
  );
}