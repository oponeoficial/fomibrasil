import React from 'react';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailConfirmationProps {
  email: string;
  onConfirm: () => void;
}

export const EmailConfirmation: React.FC<EmailConfirmationProps> = ({ email, onConfirm }) => {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      {/* Ícone */}
      <div className="w-[120px] h-[120px] bg-green-500/10 rounded-full flex items-center justify-center mb-8 relative">
        <Mail size={56} className="text-green-500" strokeWidth={1.5} />
        <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1">
          <CheckCircle size={24} className="text-white" />
        </div>
      </div>

      {/* Título */}
      <h1 className="text-2xl font-display font-bold text-dark mb-3">
        Verifique seu e-mail
      </h1>

      {/* Descrição */}
      <p className="text-base text-gray mb-2 max-w-[300px] leading-relaxed">
        Enviamos um link de confirmação para:
      </p>

      {/* Email */}
      <p className="text-base font-semibold text-dark mb-6">
        {email}
      </p>

      {/* Instrução */}
      <p className="text-sm text-gray mb-10 max-w-[280px] leading-relaxed">
        Clique no link do e-mail para ativar sua conta. Depois, volte aqui para entrar.
      </p>

      {/* Dica */}
      <div className="bg-orange/10 py-3 px-4 rounded-md mb-8 max-w-[300px]">
        <p className="text-sm text-orange">
          💡 Não encontrou? Verifique a pasta de spam.
        </p>
      </div>

      {/* Botão */}
      <button
        onClick={onConfirm}
        className="w-full max-w-[320px] py-4 px-6 bg-red text-white border-none rounded-md text-base font-semibold cursor-pointer shadow-[0_4px_15px_rgba(255,59,48,0.3)]"
      >
        Entendido
      </button>
    </div>
  );
};