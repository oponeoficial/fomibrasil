import React from 'react';
import { useNavigate } from 'react-router-dom';

interface WelcomeProps {
  onStart?: () => void;
  onLogin?: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart, onLogin }) => {
  const navigate = useNavigate();

  const handleStart = onStart ?? (() => navigate('/onboarding/location'));
  const handleLogin = onLogin ?? (() => navigate('/login'));

  return (
    <div className="min-h-[100dvh] bg-cream flex flex-col items-center px-6 pt-16 pb-10">
      {/* Logo centralizada */}
      <div className="mb-auto">
        <img src="/images/logo-fomi.png" alt="Fomí" className="w-44 h-auto" />
      </div>

      {/* Content centralizado */}
      <div className="flex flex-col items-center text-center mb-auto">
        <h1 className="text-3xl font-bold text-dark leading-tight mb-14">
          Bem-vindo à <span className="text-red">FOMÍ</span>
        </h1>

        <p className="text-lg font-medium text-dark mb-9 leading-relaxed max-w-[300px]">
          A comunidade de quem curte comer bem e leva isso a sério.
        </p>

        <p className="text-base text-gray leading-relaxed max-w-[300px]">
          Aqui você descobre onde comer bem, com indicações reais de gente que tem a mesma paixão que você, eu e todos da fomí.
        </p>
      </div>

      {/* CTAs */}
      <div className="w-full max-w-[320px] space-y-4">
        <button
          onClick={handleStart}
          className="w-full h-14 bg-red text-white font-semibold text-base rounded-lg shadow-[0_4px_15px_rgba(255,59,48,0.3)] active:scale-[0.98] transition-transform"
        >
          Vem largar essa fomí de comer bem
        </button>

        <button
          onClick={handleLogin}
          className="w-full h-12 bg-transparent text-dark font-medium text-base border border-dark rounded-lg active:opacity-70 transition-opacity"
        >
          Já tenho conta
        </button>
      </div>
    </div>
  );
};

export default Welcome;