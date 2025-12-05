import { useNavigate } from 'react-router-dom';
import { Location as LocationComponent } from '../components/onboarding/Location';
import { useOnboardingStore } from '../stores';

export default function Location() {
  const navigate = useNavigate();
  const setLocation = useOnboardingStore((s) => s.setLocation);

  const handleSaveLocation = async (
    latitude: number,
    longitude: number,
    options?: { city?: string }
  ) => {
    setLocation({ latitude, longitude, city: options?.city });
    return { success: true };
  };

  return (
    <LocationComponent
      onComplete={() => navigate('/onboarding/preferences')}
      onSaveLocation={handleSaveLocation}
    />
  );
}