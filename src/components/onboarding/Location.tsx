import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationProps {
  onLocationGranted: (coords: { latitude: number; longitude: number }) => void;
  onManualCity: () => void;
  onSkip: () => void;
}

export const Location: React.FC<LocationProps> = ({ onLocationGranted, onManualCity, onSkip }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Seu navegador não suporta geolocalização');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        onLocationGranted({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Permissão negada. Você pode inserir sua cidade manualmente.');
        } else {
          setError('Não foi possível obter sua localização.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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
      {/* Ilustração */}
      <div
        style={{
          width: '200px',
          height: '200px',
          backgroundColor: 'rgba(255, 59, 48, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        <MapPin size={80} color="var(--color-red)" strokeWidth={1.5} />
      </div>

      {/* Título */}
      <h1
        style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-dark)',
          marginBottom: '12px',
        }}
      >
        Onde você está?
      </h1>

      {/* Subtítulo */}
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--color-gray)',
          marginBottom: '40px',
          maxWidth: '280px',
          lineHeight: 1.5,
        }}
      >
        Para te mostrar as melhores opções perto de você…
      </p>

      {/* Erro */}
      {error && (
        <p style={{ color: 'var(--color-red)', fontSize: '0.9rem', marginBottom: '16px' }}>
          {error}
        </p>
      )}

      {/* Botões */}
      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button
          onClick={requestLocation}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: 'var(--color-red)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
          }}
        >
          <Navigation size={20} />
          {loading ? 'Localizando...' : 'Usar minha localização'}
        </button>

        <button
          onClick={onManualCity}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Inserir cidade manualmente
        </button>

        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-gray)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginTop: '16px',
          }}
        >
          Pular por agora
        </button>
      </div>
    </div>
  );
};