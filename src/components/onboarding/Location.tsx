import React, { useState } from 'react';
import { MapPin, Navigation, Loader2, AlertCircle, Building2 } from 'lucide-react';

interface LocationProps {
  onComplete: () => void;
  onSaveLocation: (
    latitude: number,
    longitude: number,
    options?: { city?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  saving?: boolean;
}

type LocationStatus = 'idle' | 'requesting' | 'success' | 'denied' | 'error';

export const Location: React.FC<LocationProps> = ({ onComplete, onSaveLocation, saving }) => {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCity, setManualCity] = useState('');

  const requestLocation = () => {
    console.log('Botão clicado - iniciando geolocalização...');
    setStatus('requesting');
    setErrorMessage('');

    if (!navigator.geolocation) {
      console.log('Geolocalização não suportada');
      setStatus('error');
      setErrorMessage('Seu navegador não suporta geolocalização.');
      return;
    }

    console.log('Chamando navigator.geolocation.getCurrentPosition...');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Posição obtida:', position.coords);
        const { latitude, longitude } = position.coords;

        try {
          console.log('Salvando localização no Supabase...');
          const result = await onSaveLocation(latitude, longitude);
          console.log('Resultado do save:', result);

          if (result.success) {
            setStatus('success');
            setTimeout(() => onComplete(), 800);
          } else {
            setStatus('error');
            setErrorMessage(result.error || 'Erro ao salvar localização.');
          }
        } catch (err) {
          console.error('Erro ao salvar:', err);
          setStatus('error');
          setErrorMessage('Erro ao salvar localização.');
        }
      },
      (error) => {
        console.error('Erro de geolocalização:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatus('denied');
            setErrorMessage('Permissão negada. Insira sua cidade manualmente.');
            setShowManualInput(true);
            break;
          case error.POSITION_UNAVAILABLE:
            setStatus('error');
            setErrorMessage('Localização indisponível. Insira manualmente.');
            setShowManualInput(true);
            break;
          case error.TIMEOUT:
            setStatus('error');
            setErrorMessage('Tempo esgotado. Insira manualmente.');
            setShowManualInput(true);
            break;
          default:
            setStatus('error');
            setErrorMessage('Erro ao obter localização.');
            setShowManualInput(true);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  const handleManualSubmit = async () => {
    if (!manualCity.trim()) return;

    setStatus('requesting');

    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
      'são paulo': { lat: -23.5505, lng: -46.6333 },
      'rio de janeiro': { lat: -22.9068, lng: -43.1729 },
      'belo horizonte': { lat: -19.9167, lng: -43.9345 },
      'recife': { lat: -8.0476, lng: -34.8770 },
      'salvador': { lat: -12.9714, lng: -38.5014 },
      'fortaleza': { lat: -3.7172, lng: -38.5433 },
      'brasília': { lat: -15.7801, lng: -47.9292 },
      'curitiba': { lat: -25.4284, lng: -49.2733 },
      'porto alegre': { lat: -30.0346, lng: -51.2177 },
      'manaus': { lat: -3.1190, lng: -60.0217 },
    };

    const cityKey = manualCity.toLowerCase().trim();
    const coords = cityCoordinates[cityKey] || { lat: -14.235, lng: -51.9253 };

    try {
      const result = await onSaveLocation(coords.lat, coords.lng, { city: manualCity });

      if (result.success) {
        setStatus('success');
        setTimeout(() => onComplete(), 800);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Erro ao salvar.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Erro ao salvar localização.');
    }
  };

  const isLoading = status === 'requesting' || saving;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      {/* Ícone */}
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: status === 'success' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 59, 48, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        {isLoading ? (
          <Loader2 size={48} color="var(--color-red)" className="spin" />
        ) : status === 'success' ? (
          <Navigation size={48} color="#34C759" />
        ) : status === 'denied' || status === 'error' ? (
          <AlertCircle size={48} color="var(--color-red)" />
        ) : (
          <MapPin size={48} color="var(--color-red)" />
        )}
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Título */}
      <h1
        style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          color: 'var(--color-dark)',
          marginBottom: '12px',
        }}
      >
        {status === 'success' ? 'Localização salva!' : 'Onde você está?'}
      </h1>

      {/* Descrição */}
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--color-gray)',
          maxWidth: '280px',
          marginBottom: '32px',
          lineHeight: 1.5,
        }}
      >
        {status === 'success'
          ? 'Vamos encontrar os melhores restaurantes perto de você.'
          : 'Para te mostrar as melhores opções perto de você...'}
      </p>

      {/* Erro */}
      {errorMessage && (
        <div
          style={{
            backgroundColor: 'rgba(255, 59, 48, 0.1)',
            color: 'var(--color-red)',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            marginBottom: '24px',
            maxWidth: '300px',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Input manual */}
      {showManualInput ? (
        <div style={{ width: '100%', maxWidth: '320px' }}>
          <input
            type="text"
            placeholder="Digite sua cidade..."
            value={manualCity}
            onChange={(e) => setManualCity(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.1)',
              fontSize: '1rem',
              marginBottom: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleManualSubmit}
            disabled={isLoading || !manualCity.trim()}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: manualCity.trim() ? 'var(--color-red)' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: manualCity.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="spin" />
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
        <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={requestLocation}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px 24px',
              backgroundColor: 'var(--color-red)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="spin" />
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
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'transparent',
              color: 'var(--color-gray)',
              border: 'none',
              fontSize: '0.95rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Inserir cidade manualmente
          </button>
        </div>
      ) : null}

      {/* Indicador de progresso */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <div style={{ width: '24px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--color-red)' }} />
        <div style={{ width: '24px', height: '4px', borderRadius: '2px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
      </div>
    </div>
  );
};