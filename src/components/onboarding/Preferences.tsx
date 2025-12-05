import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface PreferencesProps {
  onComplete: (preferences: UserPreferences) => void;
  onBack: () => void;
}

export interface UserPreferences {
  company: string[];
  mood: string[];
  restrictions: string[];
  budget: string | null;
}

const STEPS = [
  {
    title: 'Com quem você costuma sair?',
    subtitle: 'Selecione quantos quiser',
    key: 'company' as const,
    multiple: true,
    options: [
      { id: 'solo', icon: '👤', label: 'Sozinho' },
      { id: 'couple', icon: '👥', label: 'Casal' },
      { id: 'friends', icon: '🎉', label: 'Amigos' },
      { id: 'family', icon: '👨‍👩‍👧‍👦', label: 'Família' },
    ],
  },
  {
    title: 'Que clima você busca?',
    subtitle: 'Toque nos que combinam com você',
    key: 'mood' as const,
    multiple: true,
    options: [
      { id: 'fine-dining', icon: '🍷', label: 'Sofisticado', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80' },
      { id: 'casual', icon: '🍺', label: 'Descontraído', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&q=80' },
      { id: 'cozy', icon: '☕', label: 'Aconchegante', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&q=80' },
      { id: 'lively', icon: '🎊', label: 'Animado', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&q=80' },
    ],
  },
  {
    title: 'Alguma restrição alimentar?',
    subtitle: 'Toque nos que se aplicam',
    key: 'restrictions' as const,
    multiple: true,
    options: [
      { id: 'gluten', icon: '🌾', label: 'Glúten' },
      { id: 'lactose', icon: '🥛', label: 'Lactose' },
      { id: 'seafood', icon: '🦐', label: 'Frutos do mar' },
      { id: 'vegan', icon: '🌱', label: 'Vegano' },
      { id: 'none', icon: '❌', label: 'Nenhuma' },
    ],
  },
  {
    title: 'Qual sua faixa de preço usual?',
    subtitle: 'Por pessoa, em média',
    key: 'budget' as const,
    multiple: false,
    options: [
      { id: 'budget-50', icon: '💵', label: 'Até R$ 50' },
      { id: 'budget-100', icon: '💳', label: 'R$ 50 – R$ 100' },
      { id: 'budget-150', icon: '💎', label: 'R$ 100+' },
      { id: 'budget-varies', icon: '🔄', label: 'Varia muito' },
    ],
  },
];

export const Preferences: React.FC<PreferencesProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    company: [],
    mood: [],
    restrictions: [],
    budget: null,
  });

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const handleSelect = (optionId: string) => {
    const key = currentStep.key;

    if (currentStep.multiple) {
      setPreferences((prev) => {
        const current = prev[key] as string[];
        if (optionId === 'none') {
          return { ...prev, [key]: ['none'] };
        }
        const filtered = current.filter((id) => id !== 'none');
        if (filtered.includes(optionId)) {
          return { ...prev, [key]: filtered.filter((id) => id !== optionId) };
        }
        return { ...prev, [key]: [...filtered, optionId] };
      });
    } else {
      setPreferences((prev) => ({ ...prev, [key]: optionId }));
    }
  };

  const isSelected = (optionId: string): boolean => {
    const value = preferences[currentStep.key];
    if (Array.isArray(value)) {
      return value.includes(optionId);
    }
    return value === optionId;
  };

  const canProceed = (): boolean => {
    const value = preferences[currentStep.key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null;
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(preferences);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
    } else {
      setStep((s) => s - 1);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-cream)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={handleBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginLeft: '-8px' }}
        >
          <ChevronLeft size={24} color="var(--color-dark)" />
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>
            {step + 1} de {STEPS.length}
          </span>
        </div>
        <div style={{ width: '40px' }} />
      </div>

      {/* Progress Bar */}
      <div style={{ height: '4px', backgroundColor: 'var(--color-light-gray)', borderRadius: '2px', marginBottom: '32px' }}>
        <div
          style={{
            height: '100%',
            width: `${((step + 1) / STEPS.length) * 100}%`,
            backgroundColor: 'var(--color-red)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-dark)',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        {currentStep.title}
      </h1>
      <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', textAlign: 'center', marginBottom: '32px' }}>
        {currentStep.subtitle}
      </p>

      {/* Options */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: currentStep.key === 'mood' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
          gap: '12px',
          flex: 1,
        }}
      >
        {currentStep.options.map((option) => {
          const selected = isSelected(option.id);
          const hasImage = 'image' in option && option.image;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: hasImage ? '0' : '20px 16px',
                backgroundColor: selected ? 'rgba(255, 59, 48, 0.1)' : '#fff',
                border: selected ? '2px solid var(--color-red)' : '2px solid transparent',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                minHeight: hasImage ? '120px' : '100px',
                position: 'relative',
              }}
            >
              {hasImage ? (
                <>
                  <img
                    src={option.image}
                    alt={option.label}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'cover',
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-dark)', padding: '8px' }}>
                    {option.icon} {option.label}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '2rem' }}>{option.icon}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-dark)' }}>
                    {option.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <button
        onClick={handleNext}
        disabled={!canProceed()}
        style={{
          width: '100%',
          padding: '16px 24px',
          backgroundColor: canProceed() ? 'var(--color-red)' : 'var(--color-light-gray)',
          color: canProceed() ? '#fff' : 'var(--color-gray)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: canProceed() ? 'pointer' : 'not-allowed',
          marginTop: '24px',
          boxShadow: canProceed() ? '0 4px 15px rgba(255, 59, 48, 0.3)' : 'none',
        }}
      >
        {isLastStep ? 'Ver sugestões' : 'Continuar'}
      </button>
    </div>
  );
};