/**
 * FOMÍ - useOnboarding Hook
 * Gerencia estado e navegação do onboarding v2
 */

import { useState, useCallback, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import type { OnboardingStep, OnboardingData } from '../types';
import { STEP_ORDER, INITIAL_DATA } from '../types';
import {
  USERNAME_REGEX,
  PASSWORD_MIN_LENGTH,
  OCCASION_VALIDATION,
  PLACE_TYPE_VALIDATION,
  DECISION_STYLE_VALIDATION,
} from '../constants';

interface UseOnboardingReturn {
  step: OnboardingStep;
  stepIndex: number;
  totalSteps: number;
  data: OnboardingData;
  loading: boolean;
  error: string | null;
  canContinue: boolean;
  updateData: (partial: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: OnboardingStep) => void;
  submitSignup: () => Promise<boolean>;
  requestLocation: () => Promise<void>;
  resendEmail: () => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(false);

  const step = STEP_ORDER[stepIndex];
  const totalSteps = STEP_ORDER.length;

  const updateData = useCallback((partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setError(null);
  }, []);

  // Validação por step
  const canContinue = useMemo(() => {
    switch (step) {
      case 'signup':
        return (
          data.firstName.trim().length >= 3 &&
          USERNAME_REGEX.test(data.username) &&
          data.email.includes('@') &&
          data.email.includes('.') &&
          data.password.length >= PASSWORD_MIN_LENGTH
        );

      case 'profile':
        return (
          data.birthDate !== '' &&
          data.city.trim().length >= 2 &&
          data.neighborhood.trim().length >= 2
        );

      case 'cuisines':
        return true; // Opcional

      case 'occasions':
        return (
          data.occasions.length >= OCCASION_VALIDATION.min &&
          data.occasions.length <= OCCASION_VALIDATION.max
        );

      case 'style':
        return (
          data.frequency !== null &&
          data.placeTypes.length >= PLACE_TYPE_VALIDATION.min &&
          data.placeTypes.length <= PLACE_TYPE_VALIDATION.max &&
          data.decisionStyle.length >= DECISION_STYLE_VALIDATION.min &&
          data.decisionStyle.length <= DECISION_STYLE_VALIDATION.max
        );

      case 'restrictions':
        return data.restrictions.length > 0;

      case 'summary':
        return true;

      case 'email-confirm':
        return true;

      default:
        return false;
    }
  }, [step, data]);

  const nextStep = useCallback(() => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
      setError(null);
    }
  }, [stepIndex, totalSteps]);

  const prevStep = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      setError(null);
    }
  }, [stepIndex]);

  const goToStep = useCallback((targetStep: OnboardingStep) => {
    const index = STEP_ORDER.indexOf(targetStep);
    if (index >= 0) {
      setStepIndex(index);
      setError(null);
    }
  }, []);

  const submitSignup = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Verificar se username existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', data.username)
        .maybeSingle();

      if (existingUser) {
        setError('Esse nome de usuário já está em uso');
        setLoading(false);
        return false;
      }

      // 2. Criar conta no Supabase Auth
      // O trigger on_auth_user_created vai criar o perfil automaticamente
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.firstName,
            username: data.username,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return false;
      }

      if (!authData.user) {
        setError('Erro ao criar conta');
        setLoading(false);
        return false;
      }

      console.log('Usuário criado com sucesso:', authData.user.id);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Erro no signup:', err);
      setError('Erro ao criar conta. Tente novamente.');
      setLoading(false);
      return false;
    }
  }, [data]);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      updateData({ locationPermission: false });
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      updateData({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        locationPermission: true,
      });
    } catch {
      updateData({ locationPermission: false });
    }
  }, [updateData]);

  const resendEmail = useCallback(async () => {
    if (resendCooldown) return;

    setLoading(true);
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: data.email,
      });

      setResendCooldown(true);
      setTimeout(() => setResendCooldown(false), 60000);
    } catch {
      setError('Erro ao reenviar e-mail');
    } finally {
      setLoading(false);
    }
  }, [data.email, resendCooldown]);

  return {
    step,
    stepIndex,
    totalSteps,
    data,
    loading,
    error,
    canContinue,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    submitSignup,
    requestLocation,
    resendEmail,
  };
}

// ============================================================================
// HELPER: Toggle chip selection com validação min/max
// ============================================================================

export function toggleChipSelection(
  current: string[],
  chipId: string,
  validation?: { min: number; max: number }
): string[] {
  const isSelected = current.includes(chipId);

  if (isSelected) {
    return current.filter((id) => id !== chipId);
  }

  if (validation && current.length >= validation.max) {
    return current;
  }

  return [...current, chipId];
}

// ============================================================================
// HELPER: Toggle restrição com lógica especial do "none"
// ============================================================================

export function toggleRestriction(current: string[], chipId: string): string[] {
  if (chipId === 'none') {
    return ['none'];
  }

  const withoutNone = current.filter((id) => id !== 'none');

  if (withoutNone.includes(chipId)) {
    const result = withoutNone.filter((id) => id !== chipId);
    return result.length === 0 ? ['none'] : result;
  }

  return [...withoutNone, chipId];
}