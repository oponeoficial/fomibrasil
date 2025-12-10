/**
 * FOMÍ - Onboarding v3 Orchestrator
 * Gerencia navegação com animações fluidas
 */

import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useOnboarding } from './hooks/useOnboarding';
import { StepContainer, FixedFooter, CTAButton, AnimatedStep } from './components/UI';

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
    direction,
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
      if (success) nextStep();
      return;
    }

    if (step === 'summary') {
      const success = await savePreferences();
      if (success) nextStep();
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

  // EmailConfirm tem layout próprio
  if (step === 'email-confirm') {
    return (
      <AnimatePresence mode="wait">
        <AnimatedStep key={step} direction={direction}>
          {renderStep()}
        </AnimatedStep>
      </AnimatePresence>
    );
  }

  const getButtonText = () => {
    switch (step) {
      case 'signup':
        return 'Criar conta e continuar';
      case 'summary':
        return 'Finalizar';
      default:
        return 'Continuar';
    }
  };

  return (
    <StepContainer>
      <AnimatePresence mode="wait">
        <AnimatedStep key={step} direction={direction}>
          {renderStep()}
        </AnimatedStep>
      </AnimatePresence>

      <FixedFooter>
        <CTAButton
          onClick={handleContinue}
          disabled={!canContinue}
          loading={loading}
        >
          {getButtonText()}
        </CTAButton>
      </FixedFooter>
    </StepContainer>
  );
}

export default Onboarding;