import React from 'react';

interface WelcomeProps {
  onStart: () => void;
  onLogin: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center p-6 text-center relative overflow-hidden">
      {/* Textura bege sutil */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradiente */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,248,240,0.8)_0%,transparent_60%),radial-gradient(ellipse_at_50%_100%,rgba(245,235,220,0.5)_0%,transparent_50%)]" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[320px] mt-[15vh]">
        {/* Logo */}
        <div className="mb-6">
          <img src="/images/logo-fomi.png" alt="Fomí" className="w-[180px] h-auto" />
        </div>

        {/* Tagline */}
        <p className="text-lg text-dark mb-0 max-w-[300px] leading-relaxed font-normal">
          A rede social onde pessoas descobrem e compartilham experiências gastronômicas!
        </p>
      </div>

      {/* Botões */}
      <div className="relative z-10 w-full max-w-[320px] mt-auto mb-12 flex flex-col gap-4">
        <button
          onClick={onStart}
          className="w-full py-4 px-6 bg-red text-white border-none rounded-md text-base font-semibold cursor-pointer shadow-[0_4px_15px_rgba(255,59,48,0.3)]"
        >
          Começar minha jornada gastronômica
        </button>

        <button
          onClick={onLogin}
          className="w-full py-4 px-6 bg-transparent text-dark border border-dark rounded-md text-base font-medium cursor-pointer"
        >
          Voltar para a minha comunidade
        </button>
      </div>
    </div>
  );
};