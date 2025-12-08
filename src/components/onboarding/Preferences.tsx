import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react';
import { useOnboardingStore } from '../../stores';

interface UserPreferences {
  company: string[];
  mood: string[];
  restrictions: string[];
  budget: string | null;
}

interface PreferencesProps {
  onComplete?: (preferences: UserPreferences) => void;
  onSaveToSupabase?: (preferences: UserPreferences) => Promise<{ success: boolean }>;
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
  saving = false,
}) => {
  const navigate = useNavigate();
  const { setPreferences: setStorePreferences, completeOnboarding } = useOnboardingStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    company: [],
    mood: [],
    restrictions: [],
    budget: null,
  });

  const step = steps[currentStep];

  const handleComplete = onComplete ?? (() => navigate('/feed'));

  const handleSaveToSupabase =
    onSaveToSupabase ??
    (async (prefs: UserPreferences) => {
      setStorePreferences(prefs);
      completeOnboarding();
      return { success: true };
    });

  const toggleSelection = (field: 'company' | 'mood' | 'restrictions', value: string) => {
    setPreferences((prev) => {
      const current = prev[field];
      return current.includes(value)
        ? { ...prev, [field]: current.filter((v) => v !== value) }
        : { ...prev, [field]: [...current, value] };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 'company':
        return preferences.company.length > 0;
      case 'mood':
        return preferences.mood.length > 0;
      case 'restrictions':
        return preferences.restrictions.length > 0;
      case 'budget':
        return preferences.budget !== null;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSaving(true);
      try {
        const result = await handleSaveToSupabase(preferences);
        if (result.success) handleComplete(preferences);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const isLoading = saving || isSaving;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => currentStep > 0 && setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 0}
          className={`w-10 h-10 rounded-full border-none flex items-center justify-center ${
            currentStep === 0 ? 'opacity-0 cursor-default' : 'bg-black/5 cursor-pointer'
          }`}
        >
          <ChevronLeft size={24} className="text-dark" />
        </button>

        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i <= currentStep ? 'bg-red' : 'bg-black/10'
              }`}
            />
          ))}
        </div>

        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-[120px]">
        <h1 className="text-3xl font-bold font-display text-dark mb-2 text-center">
          {stepTitles[step]}
        </h1>
        <p className="text-sm text-gray text-center mb-8">
          {step === 'company' && 'Selecione uma ou mais opções'}
          {step === 'mood' && 'Escolha os ambientes que mais combinam com você'}
          {step === 'restrictions' && 'Selecione se houver alguma'}
          {step === 'budget' && 'Isso nos ajuda a encontrar lugares ideais'}
        </p>

        {/* Company Step */}
        {step === 'company' && (
          <div className="grid grid-cols-2 gap-3">
            {companyOptions.map((option) => {
              const isSelected = preferences.company.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection('company', option.id)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-2 shadow-sm transition-all ${
                    isSelected ? 'border-red bg-red/10' : 'border-transparent bg-white'
                  }`}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span className={`text-sm ${isSelected ? 'font-semibold text-red' : 'text-dark'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Mood Step */}
        {step === 'mood' && (
          <div className="grid grid-cols-2 gap-3">
            {moodOptions.map((option) => {
              const isSelected = preferences.mood.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection('mood', option.id)}
                  className={`relative h-[140px] rounded-2xl overflow-hidden cursor-pointer p-0 bg-transparent border-[3px] ${
                    isSelected ? 'border-red' : 'border-transparent'
                  }`}
                >
                  <img src={option.image} alt={option.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <span className="text-white font-semibold text-[0.95rem]">{option.label}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Restrictions Step */}
        {step === 'restrictions' && (
          <div className="flex flex-col gap-3">
            {restrictionOptions.map((option) => {
              const isSelected = preferences.restrictions.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection('restrictions', option.id)}
                  className={`p-4 px-5 rounded-xl border-2 cursor-pointer flex items-center gap-3 shadow-sm transition-all ${
                    isSelected ? 'border-red bg-red/10' : 'border-transparent bg-white'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span
                    className={`flex-1 text-left text-base ${
                      isSelected ? 'font-semibold text-red' : 'text-dark'
                    }`}
                  >
                    {option.label}
                  </span>
                  {isSelected && <Check size={20} className="text-red" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Budget Step */}
        {step === 'budget' && (
          <div className="flex flex-col gap-3">
            {budgetOptions.map((option) => {
              const isSelected = preferences.budget === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setPreferences((prev) => ({ ...prev, budget: option.id }))}
                  className={`p-5 rounded-xl border-2 cursor-pointer flex items-center gap-4 shadow-sm transition-all ${
                    isSelected ? 'border-red bg-red/10' : 'border-transparent bg-white'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-base ${
                        isSelected ? 'font-semibold text-red' : 'font-medium text-dark'
                      }`}
                    >
                      {option.label}
                    </p>
                    {option.subtitle && <p className="text-xs text-gray">{option.subtitle}</p>}
                  </div>
                  {isSelected && <Check size={20} className="text-red" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-8 bg-cream border-t border-black/5">
        <button
          onClick={handleNext}
          disabled={!canProceed() || isLoading}
          className={`w-full p-4 rounded-[14px] border-none text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all ${
            canProceed()
              ? 'bg-red text-white shadow-[0_4px_15px_rgba(255,59,48,0.3)]'
              : 'bg-black/10 text-gray cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
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
    </div>
  );
};

export default Preferences;