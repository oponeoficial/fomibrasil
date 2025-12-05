import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react';

interface UserPreferences {
  company: string[];
  mood: string[];
  restrictions: string[];
  budget: string | null;
}

interface PreferencesProps {
  onComplete: (preferences: UserPreferences) => void;
  onSaveToSupabase: (preferences: UserPreferences) => Promise<{ success: boolean }>;
  saving?: boolean;
}

type Step = 'company' | 'mood' | 'restrictions' | 'budget';

const steps: Step[] = ['company', 'mood', 'restrictions', 'budget'];

const stepTitles: Record<Step, string> = {
  company: 'Com quem você costuma sair?',
  mood: 'Que tipo de ambiente você prefere?',
  restrictions: 'Alguma restrição alimentar?',
  budget: 'Qual sua faixa de preço preferida?',
};

const companyOptions = [
  { id: 'solo', label: 'Sozinho(a)', icon: '👤' },
  { id: 'couple', label: 'Casal', icon: '👥' },
  { id: 'friends', label: 'Amigos', icon: '🎉' },
  { id: 'family', label: 'Família', icon: '👨‍👩‍👧‍👦' },
];

const moodOptions = [
  { id: 'romantic', label: 'Romântico', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80' },
  { id: 'casual', label: 'Casual', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80' },
  { id: 'lively', label: 'Animado', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=80' },
  { id: 'quiet', label: 'Tranquilo', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80' },
];

const restrictionOptions = [
  { id: 'gluten', label: 'Sem Glúten', icon: '🌾' },
  { id: 'lactose', label: 'Sem Lactose', icon: '🥛' },
  { id: 'seafood', label: 'Sem Frutos do Mar', icon: '🦐' },
  { id: 'vegan', label: 'Vegano', icon: '🌱' },
  { id: 'none', label: 'Nenhuma', icon: '✅' },
];

const budgetOptions = [
  { id: 'low', label: 'Até R$ 50', subtitle: 'por pessoa', icon: '💰' },
  { id: 'medium', label: 'R$ 50 - 100', subtitle: 'por pessoa', icon: '💰💰' },
  { id: 'high', label: 'Acima de R$ 100', subtitle: 'por pessoa', icon: '💰💰💰' },
  { id: 'varies', label: 'Depende da ocasião', subtitle: '', icon: '🎲' },
];

export const Preferences: React.FC<PreferencesProps> = ({
  onComplete,
  onSaveToSupabase,
  saving,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado local de todas as preferências
  const [preferences, setPreferences] = useState<UserPreferences>({
    company: [],
    mood: [],
    restrictions: [],
    budget: null,
  });

  const step = steps[currentStep];

  const toggleSelection = (field: 'company' | 'mood' | 'restrictions', value: string) => {
    setPreferences(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const selectBudget = (value: string) => {
    setPreferences(prev => ({ ...prev, budget: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 'company': return preferences.company.length > 0;
      case 'mood': return preferences.mood.length > 0;
      case 'restrictions': return preferences.restrictions.length > 0;
      case 'budget': return preferences.budget !== null;
      default: return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Último passo - salvar tudo no Supabase
      setIsSaving(true);
      console.log('Salvando todas as preferências:', preferences);
      
      try {
        const result = await onSaveToSupabase(preferences);
        console.log('Resultado do save:', result);
        
        if (result.success) {
          onComplete(preferences);
        }
      } catch (error) {
        console.error('Erro ao salvar preferências:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isLoading = saving || isSaving;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-cream)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: currentStep === 0 ? 'transparent' : 'rgba(0,0,0,0.05)',
            cursor: currentStep === 0 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentStep === 0 ? 0 : 1,
          }}
        >
          <ChevronLeft size={24} color="var(--color-dark)" />
        </button>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: i <= currentStep ? 'var(--color-red)' : 'rgba(0,0,0,0.1)',
                transition: 'background-color 0.3s ease',
              }}
            />
          ))}
        </div>

        <div style={{ width: '40px' }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '0 24px', paddingBottom: '120px' }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: 'var(--color-dark)',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          {stepTitles[step]}
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--color-gray)',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          {step === 'company' && 'Selecione uma ou mais opções'}
          {step === 'mood' && 'Escolha os ambientes que mais combinam com você'}
          {step === 'restrictions' && 'Selecione se houver alguma'}
          {step === 'budget' && 'Isso nos ajuda a encontrar lugares ideais'}
        </p>

        {/* Company Step */}
        {step === 'company' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {companyOptions.map(option => {
              const isSelected = preferences.company.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection('company', option.id)}
                  style={{
                    position: 'relative',
                    padding: '20px',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid var(--color-red)' : '2px solid transparent',
                    backgroundColor: isSelected ? 'rgba(255, 59, 48, 0.1)' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{option.icon}</span>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'var(--color-red)' : 'var(--color-dark)',
                  }}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Check size={12} color="#fff" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Mood Step */}
        {step === 'mood' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {moodOptions.map(option => {
              const isSelected = preferences.mood.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection('mood', option.id)}
                  style={{
                    position: 'relative',
                    height: '140px',
                    borderRadius: '16px',
                    border: isSelected ? '3px solid var(--color-red)' : '3px solid transparent',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    padding: 0,
                    background: 'none',
                  }}
                >
                  <img
                    src={option.image}
                    alt={option.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '12px',
                  }}>
                    <span style={{
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}>
                      {option.label}
                    </span>
                  </div>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Check size={14} color="#fff" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Restrictions Step */}
        {step === 'restrictions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {restrictionOptions.map(option => {
              const isSelected = preferences.restrictions.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection('restrictions', option.id)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid var(--color-red)' : '2px solid transparent',
                    backgroundColor: isSelected ? 'rgba(255, 59, 48, 0.1)' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>
                  <span style={{
                    flex: 1,
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'var(--color-red)' : 'var(--color-dark)',
                  }}>
                    {option.label}
                  </span>
                  {isSelected && <Check size={20} color="var(--color-red)" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Budget Step */}
        {step === 'budget' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {budgetOptions.map(option => {
              const isSelected = preferences.budget === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => selectBudget(option.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid var(--color-red)' : '2px solid transparent',
                    backgroundColor: isSelected ? 'rgba(255, 59, 48, 0.1)' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? 'var(--color-red)' : 'var(--color-dark)',
                      marginBottom: option.subtitle ? '2px' : 0,
                    }}>
                      {option.label}
                    </p>
                    {option.subtitle && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>
                        {option.subtitle}
                      </p>
                    )}
                  </div>
                  {isSelected && <Check size={20} color="var(--color-red)" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 24px 32px',
        backgroundColor: 'var(--color-cream)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
      }}>
        <button
          onClick={handleNext}
          disabled={!canProceed() || isLoading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            border: 'none',
            backgroundColor: canProceed() ? 'var(--color-red)' : 'rgba(0,0,0,0.1)',
            color: canProceed() ? '#fff' : 'var(--color-gray)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: canProceed() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: canProceed() ? '0 4px 15px rgba(255, 59, 48, 0.3)' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Salvando...
            </>
          ) : (
            <>
              {currentStep === steps.length - 1 ? 'Ver Recomendações' : 'Continuar'}
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};