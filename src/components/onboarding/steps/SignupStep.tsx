/**
 * FOMÍ - Signup Step (Tela 1)
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { OnboardingData } from '../types';
import { STEP_CONTENT, USERNAME_REGEX, USERNAME_HELP, PASSWORD_MIN_LENGTH } from '../constants';
import { StepHeader, InputField } from '../components/UI';

interface SignupStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  error: string | null;
}

export function SignupStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
  error,
}: SignupStepProps) {
  const content = STEP_CONTENT.signup;
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Debounced username check
  useEffect(() => {
    if (data.username.length < 3) {
      setUsernameError(null);
      return;
    }

    if (!USERNAME_REGEX.test(data.username)) {
      setUsernameError('Use apenas letras, números, ponto e underline');
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', data.username)
        .maybeSingle();

      setCheckingUsername(false);
      setUsernameError(existing ? 'Esse username já está em uso' : null);
    }, 500);

    return () => clearTimeout(timer);
  }, [data.username]);

  // Email validation
  useEffect(() => {
    if (!data.email) {
      setEmailError(null);
      return;
    }

    if (!data.email.includes('@') || !data.email.includes('.')) {
      setEmailError('Digite um e-mail válido');
      return;
    }

    setEmailError(null);
  }, [data.email]);

  const passwordStrength = () => {
    const len = data.password.length;
    if (len === 0) return null;
    if (len < PASSWORD_MIN_LENGTH) return { label: 'Muito curta', color: 'text-red-500' };
    if (len < 12) return { label: 'Ok', color: 'text-yellow-500' };
    return { label: 'Forte', color: 'text-green-500' };
  };

  const strength = passwordStrength();

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

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Nome"
            value={data.firstName}
            onChange={(v) => updateData({ firstName: v })}
            placeholder="Seu primeiro nome"
            required
          />
          <InputField
            label="Sobrenome"
            value={data.lastName}
            onChange={(v) => updateData({ lastName: v })}
            placeholder="Seu sobrenome"
            required
          />
        </div>

        <InputField
          label="Nome de usuário"
          value={data.username}
          onChange={(v) => updateData({ username: v.toLowerCase().replace(/[^a-z0-9._]/g, '') })}
          placeholder="seunome"
          prefix="@"
          helper={checkingUsername ? 'Verificando...' : USERNAME_HELP}
          error={usernameError || undefined}
          required
        />

        <InputField
          label="E-mail"
          value={data.email}
          onChange={(v) => updateData({ email: v })}
          placeholder="seu@email.com"
          type="email"
          error={emailError || undefined}
          required
        />

        <div className="space-y-1">
          <InputField
            label="Senha"
            value={data.password}
            onChange={(v) => updateData({ password: v })}
            placeholder="Mínimo 8 caracteres"
            type="password"
            helper={`Mínimo ${PASSWORD_MIN_LENGTH} caracteres`}
            required
          />
          {strength && (
            <p className={`text-xs ${strength.color}`}>
              Força: {strength.label}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
}