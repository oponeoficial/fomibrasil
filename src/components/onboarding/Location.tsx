import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Loader2, AlertCircle, Building2 } from 'lucide-react';
import { useOnboardingStore } from '../../stores';

interface LocationProps {
  onComplete?: () => void;
  onSaveLocation?: (
    latitude: number,
    longitude: number,
    options?: { city?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  saving?: boolean;
}

type LocationStatus = 'idle' | 'requesting' | 'success' | 'denied' | 'error';

export const Location: React.FC<LocationProps> = ({
  onComplete,
  onSaveLocation,
  saving = false,
}) => {
  const navigate = useNavigate();
  const setStoreLocation = useOnboardingStore((s) => s.setLocation);

  const [status, setStatus] = useState<LocationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCity, setManualCity] = useState('');

  const handleComplete = onComplete ?? (() => navigate('/onboarding/preferences'));

  const handleSaveLocation =
    onSaveLocation ??
    (async (latitude: number, longitude: number, options?: { city?: string }) => {
      setStoreLocation({ latitude, longitude, city: options?.city });
      return { success: true };
    });

  const requestLocation = () => {
    setStatus('requesting');
    setErrorMessage('');

    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('Seu navegador não suporta geolocalização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await handleSaveLocation(latitude, longitude);
          if (result.success) {
            setStatus('success');
            setTimeout(() => handleComplete(), 800);
          } else {
            setStatus('error');
            setErrorMessage(result.error || 'Erro ao salvar localização.');
          }
        } catch {
          setStatus('error');
          setErrorMessage('Erro ao salvar localização.');
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatus('denied');
            setErrorMessage('Permissão negada. Insira sua cidade manualmente.');
            break;
          case error.POSITION_UNAVAILABLE:
            setStatus('error');
            setErrorMessage('Localização indisponível. Insira manualmente.');
            break;
          default:
            setStatus('error');
            setErrorMessage('Erro ao obter localização.');
        }
        setShowManualInput(true);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  };

  const handleManualSubmit = async () => {
    if (!manualCity.trim()) return;
    setStatus('requesting');

    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
      'são paulo': { lat: -23.5505, lng: -46.6333 },
      'rio de janeiro': { lat: -22.9068, lng: -43.1729 },
      'belo horizonte': { lat: -19.9167, lng: -43.9345 },
      'recife': { lat: -8.0476, lng: -34.877 },
      'salvador': { lat: -12.9714, lng: -38.5014 },
    };

    const cityKey = manualCity.toLowerCase().trim();
    const coords = cityCoordinates[cityKey] || { lat: -14.235, lng: -51.9253 };

    try {
      const result = await handleSaveLocation(coords.lat, coords.lng, { city: manualCity });
      if (result.success) {
        setStatus('success');
        setTimeout(() => handleComplete(), 800);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Erro ao salvar.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Erro ao salvar localização.');
    }
  };

  const isLoading = status === 'requesting' || saving;

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      {/* Ícone */}
      <div
        className={`w-[120px] h-[120px] rounded-full flex items-center justify-center mb-8 ${
          status === 'success' ? 'bg-green-500/15' : 'bg-red/10'
        }`}
      >
        {isLoading ? (
          <Loader2 size={48} className="text-red animate-spin" />
        ) : status === 'success' ? (
          <Navigation size={48} className="text-green-500" />
        ) : status === 'denied' || status === 'error' ? (
          <AlertCircle size={48} className="text-red" />
        ) : (
          <MapPin size={48} className="text-red" />
        )}
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold font-display text-dark mb-3">
        {status === 'success' ? 'Localização salva!' : 'Onde você está?'}
      </h1>

      {/* Descrição */}
      <p className="text-base text-gray max-w-[280px] mb-8 leading-relaxed">
        {status === 'success'
          ? 'Vamos encontrar os melhores restaurantes perto de você.'
          : 'Para te mostrar as melhores opções perto de você...'}
      </p>

      {/* Erro */}
      {errorMessage && (
        <div className="bg-red/10 text-red px-4 py-3 rounded-xl text-sm mb-6 max-w-[300px]">
          {errorMessage}
        </div>
      )}

      {/* Input manual */}
      {showManualInput ? (
        <div className="w-full max-w-[320px]">
          <input
            type="text"
            placeholder="Digite sua cidade..."
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            disabled={isLoading}
            className="w-full p-4 rounded-xl border border-black/10 text-base mb-3 outline-none"
          />
          <button
            onClick={handleManualSubmit}
            disabled={isLoading || !manualCity.trim()}
            className={`w-full p-4 rounded-xl border-none text-base font-semibold cursor-pointer flex items-center justify-center gap-2 ${
              manualCity.trim()
                ? 'bg-red text-white'
                : 'bg-gray/30 text-gray cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Building2 size={20} />
                Confirmar cidade
              </>
            )}
          </button>
        </div>
      ) : status !== 'success' ? (
        <div className="w-full max-w-[320px] flex flex-col gap-3">
          <button
            onClick={requestLocation}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-red text-white border-none rounded-xl text-base font-semibold cursor-pointer shadow-[0_4px_15px_rgba(255,59,48,0.3)] flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Obtendo localização...
              </>
            ) : (
              <>
                <Navigation size={20} />
                Usar minha localização
              </>
            )}
          </button>

          <button
            onClick={() => setShowManualInput(true)}
            disabled={isLoading}
            className="w-full py-3.5 bg-transparent text-gray border-none text-[0.95rem] cursor-pointer underline"
          >
            Inserir cidade manualmente
          </button>
        </div>
      ) : null}

      {/* Progress dots */}
      <div className="absolute bottom-12 flex gap-2">
        <div className="w-6 h-1 rounded-sm bg-red" />
        <div className="w-6 h-1 rounded-sm bg-black/10" />
      </div>
    </div>
  );
};

export default Location;