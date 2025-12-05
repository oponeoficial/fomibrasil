import { useNavigate } from 'react-router-dom';
import { Preferences as PreferencesComponent } from '../components/onboarding/Preferences';
import { useOnboardingStore } from '../stores';

export default function Preferences() {
  const navigate = useNavigate();
  const { setPreferences, completeOnboarding } = useOnboardingStore();

  const handleSaveToSupabase = async (prefs: {
    company: string[];
    mood: string[];
    restrictions: string[];
    budget: string | null;
  }) => {
    setPreferences(prefs);
    completeOnboarding();
    return { success: true };
  };

  return (
    <PreferencesComponent
      onComplete={() => navigate('/feed')}
      onSaveToSupabase={handleSaveToSupabase}
    />
  );
}