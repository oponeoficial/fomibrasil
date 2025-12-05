import React from 'react';

interface WelcomeProps {
  onStart: () => void;
  onLogin: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart, onLogin }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Textura bege sutil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }}
      />

      {/* Gradiente sutil para dar profundidade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(255, 248, 240, 0.8) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(245, 235, 220, 0.5) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Conteúdo */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '320px',
          marginTop: '15vh',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '24px' }}>
          <img
            src="/images/logo-fomi.png"
            alt="Fomí"
            style={{
              width: '180px',
              height: 'auto',
            }}
          />
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--color-dark)',
            marginBottom: '0',
            maxWidth: '300px',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          A rede social onde pessoas descobrem e compartilham experiências gastronômicas!
        </p>
      </div>

      {/* Botões - fixos na parte inferior */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '320px',
          marginTop: 'auto',
          marginBottom: '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: 'var(--color-red)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
          }}
        >
          Começar minha jornada gastronômica
        </button>

        <button
          onClick={onLogin}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: 'transparent',
            color: 'var(--color-dark)',
            border: '1px solid var(--color-dark)',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Voltar para a minha comunidade
        </button>
      </div>
    </div>
  );
};