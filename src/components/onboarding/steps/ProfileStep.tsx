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
}: ProfileStepProps) {
  const content = STEP_CONTENT.profile;

  const handleGenderChange = (selected: string[]) => {
    updateData({ gender: selected[0] || null });
  };

  const handleLocationRequest = async () => {
    await onRequestLocation();
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

      <div className="space-y-5">
        {/* Data de nascimento */}
        <InputField
          label="Data de nascimento"
          value={data.birthDate}
          onChange={(v) => updateData({ birthDate: v })}
          type="date"
          required
        />

        {/* Gênero */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Gênero <span className="text-gray-400">(opcional)</span>
          </label>
          <ChipSelector
            options={GENDER_OPTIONS}
            selected={data.gender ? [data.gender] : []}
            onChange={handleGenderChange}
            columns={2}
          />
        </div>

        {/* Cidade */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Em que cidade você mora hoje? <span className="text-orange-500">*</span>
          </label>
          <select
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-orange-500"
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
        <div className="bg-orange-50 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {content.locationTitle}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {content.locationText}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
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
              className="text-sm text-gray-500 hover:text-gray-700 w-full text-center"
            >
              Agora não
            </button>
          )}
        </div>
      </div>
    </div>
  );
}