/**
 * FOMÍ - Onboarding v2 Orchestrator
 * Gerencia navegação entre steps
 */

import { useNavigate } from 'react-router-dom';
import { useOnboarding } from './hooks/useOnboarding';
import { StepContainer, FixedFooter, CTAButton } from './components/UI';

// Steps
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
    savePreferences,
    requestLocation,
  } = useOnboarding();

  const handleContinue = async () => {
    if (step === 'signup') {
      const success = await submitSignup();
      if (success) {
        nextStep();
      }
      return;
    }

    if (step === 'summary') {
      const success = await savePreferences();
      if (success) {
        nextStep();
      }
      return;
    }

    nextStep();
  };

  const handleFinish = () => {
    navigate('/login');
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
            onFinish={handleFinish}
          />
        );

      default:
        return null;
    }
  };

  if (step === 'email-confirm') {
    return renderStep();
  }

  return (
    <StepContainer>
      {renderStep()}

      <FixedFooter>
        {error && (
          <p className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-lg">
            {error}
          </p>
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