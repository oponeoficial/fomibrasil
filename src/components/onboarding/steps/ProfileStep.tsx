/**
 * FOMÍ - Profile Step (Tela 2)
 */

import { MapPin } from 'lucide-react';
import type { OnboardingData } from '../types';
import { STEP_CONTENT, GENDER_OPTIONS, CITIES } from '../constants';
import { StepHeader, InputField, CTAButton } from '../components/UI';
import { ChipSelector } from '../components/ChipSelector';

interface ProfileStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  onRequestLocation: () => Promise<void>;
  error: string | null;
}

export function ProfileStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
  onRequestLocation,
  error,
}: ProfileStepProps) {
  const content = STEP_CONTENT.profile;

  const handleGenderChange = (selected: string[]) => {
    updateData({ gender: selected[0] || null });
  };

  const handleLocationRequest = async () => {
    await onRequestLocation();
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '8px',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontSize: '16px',
    outline: 'none',
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Data de nascimento */}
        <InputField
          label="Data de nascimento"
          value={data.birthDate}
          onChange={(v) => updateData({ birthDate: v })}
          type="date"
          required
        />

        {/* Gênero */}
        <div>
          <label style={labelStyle}>
            Gênero <span style={{ color: '#9CA3AF' }}>(opcional)</span>
          </label>
          <ChipSelector
            options={GENDER_OPTIONS}
            selected={data.gender ? [data.gender] : []}
            onChange={handleGenderChange}
            columns={2}
          />
        </div>

        {/* Cidade */}
        <div>
          <label style={labelStyle}>
            Em que cidade você mora hoje? <span style={{ color: '#F97316' }}>*</span>
          </label>
          <select
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = '#F97316'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          >
            <option value="">Selecione sua cidade</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Bairro */}
        <InputField
          label="Em qual bairro você mais sai para comer?"
          value={data.neighborhood}
          onChange={(v) => updateData({ neighborhood: v })}
          placeholder="Ex.: Boa Viagem"
          required
        />

        {/* Permissão de localização */}
        <div style={{ 
          backgroundColor: '#FFF7ED', 
          borderRadius: '16px', 
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#FFEDD5', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <MapPin style={{ width: '20px', height: '20px', color: '#F97316' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 600, color: '#111827', fontSize: '16px' }}>
                {content.locationTitle}
              </h4>
              <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                {content.locationText}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <CTAButton
              onClick={handleLocationRequest}
              variant={data.locationPermission ? 'secondary' : 'primary'}
              fullWidth
            >
              {data.locationPermission ? '✓ Localização ativada' : 'Permitir localização'}
            </CTAButton>
          </div>

          {!data.locationPermission && (
            <button
              type="button"
              onClick={() => updateData({ locationPermission: false })}
              style={{ 
                fontSize: '14px', 
                color: '#6B7280', 
                width: '100%', 
                textAlign: 'center', 
                marginTop: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Agora não
            </button>
          )}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: '14px', color: '#EF4444', textAlign: 'center', marginTop: '16px' }}>{error}</p>
      )}
    </div>
  );
}