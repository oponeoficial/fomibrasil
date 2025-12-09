/**
 * FOMÍ - Onboarding v2 Orchestrator
 * Gerencia navegação entre steps
 */

import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useOnboarding } from './hooks/useOnboarding';
import { StepContainer, FixedFooter, CTAButton } from './components/UI';

// Steps
import { WelcomeStep } from './steps/WelcomeStep';
import { SignupStep } from './steps/SignupStep';
import { ProfileStep } from './steps/ProfileStep';
import { CuisinesStep } from './steps/CuisinesStep';
import { OccasionsStep } from './steps/OccasionsStep';
import { StyleStep } from './steps/StyleStep';
import { RestrictionsStep } from './steps/RestrictionsStep';
import { SummaryStep } from './steps/SummaryStep';
import { EmailConfirmStep } from './steps/EmailConfirmStep';

export function Onboarding() {
  const navigate = useNavigate();
  const {
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
    submitSignup,
    requestLocation,
    resendEmail,
  } = useOnboarding();

  const handleContinue = async () => {
    // Tratamento especial para signup
    if (step === 'signup') {
      const success = await submitSignup();
      if (success) {
        nextStep();
      }
      return;
    }

    // Tratamento especial para summary (salvar preferências antes de avançar)
    if (step === 'summary') {
      await savePreferences();
      nextStep();
      return;
    }

    // Outros steps apenas avançam
    nextStep();
  };

  const savePreferences = async () => {
    // Salvar preferências no perfil do usuário
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from('profiles').update({
        birth_date: data.birthDate,
        gender: data.gender,
        city: data.city,
        neighborhood: data.neighborhood,
        latitude: data.latitude,
        longitude: data.longitude,
        disliked_cuisines: data.dislikedCuisines,
        preferred_occasions: data.occasions,
        dining_frequency: data.frequency,
        place_types: data.placeTypes,
        decision_style: data.decisionStyle,
        dietary_restrictions: data.restrictions,
        notifications_enabled: data.notificationsEnabled,
        beta_tester: data.betaTesterEnabled,
        onboarding_completed: true,
      } as never).eq('id', user.id);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSkipEmail = () => {
    navigate('/feed');
  };

  const handleFinish = () => {
    navigate('/feed');
  };

  const renderStep = () => {
    const commonProps = {
      data,
      updateData,
      stepIndex,
      totalSteps,
      onBack: stepIndex > 0 ? prevStep : undefined,
      error,
    };

    switch (step) {
      case 'welcome':
        return (
          <WelcomeStep
            onContinue={nextStep}
            onLogin={handleLogin}
          />
        );

      case 'signup':
        return <SignupStep {...commonProps} />;

      case 'profile':
        return (
          <ProfileStep
            {...commonProps}
            onRequestLocation={requestLocation}
          />
        );

      case 'cuisines':
        return <CuisinesStep {...commonProps} />;

      case 'occasions':
        return <OccasionsStep {...commonProps} />;

      case 'style':
        return <StyleStep {...commonProps} />;

      case 'restrictions':
        return <RestrictionsStep {...commonProps} />;

      case 'summary':
        return <SummaryStep {...commonProps} />;

      case 'email-confirm':
        return (
          <EmailConfirmStep
            email={data.email}
            onResend={resendEmail}
            onSkip={handleSkipEmail}
            onFinish={handleFinish}
            loading={loading}
          />
        );

      default:
        return null;
    }
  };

  // Welcome não tem footer padrão
  if (step === 'welcome' || step === 'email-confirm') {
    return renderStep();
  }

  return (
    <StepContainer>
      {renderStep()}

      <FixedFooter>
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
        <CTAButton
          onClick={handleContinue}
          disabled={!canContinue}
          loading={loading}
        >
          {step === 'signup' ? 'Criar conta e continuar' : 'Continuar'}
        </CTAButton>
      </FixedFooter>
    </StepContainer>
  );
}

export default Onboarding;