import React from 'react';

interface SignupBannerProps {
  onSignup: () => void;
  onDismiss: () => void;
}

export const SignupBanner: React.FC<SignupBannerProps> = ({ onSignup, onDismiss }) => {
  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white rounded-lg p-5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] z-[60] animate-slideUp">
      {/* Texto principal */}
      <p className="text-base font-semibold text-dark mb-1">
        Quer salvar seus favoritos e ver onde seus amigos vão?
      </p>
      <p className="text-sm text-gray mb-4">
        Crie sua conta em 30 segundos.
      </p>

      {/* Botões */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSignup}
          className="flex-1 py-3.5 px-5 bg-red text-white border-none rounded-md text-[0.95rem] font-semibold cursor-pointer shadow-[0_4px_15px_rgba(255,59,48,0.3)]"
        >
          Continuar
        </button>

        <button
          onClick={onDismiss}
          className="bg-transparent border-none text-gray text-sm cursor-pointer p-2"
        >
          Mais tarde
        </button>
      </div>
    </div>
  );
};