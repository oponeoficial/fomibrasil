import React, { useState } from 'react';
import { Users, Bell } from 'lucide-react';

interface PostSignupProps {
  onComplete: () => void;
}

type Step = 'friends' | 'notifications';

export const PostSignup: React.FC<PostSignupProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('friends');

  const handleFriendsConnect = () => setStep('notifications');
  const handleFriendsSkip = () => setStep('notifications');

  const handleNotificationsAllow = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
    onComplete();
  };

  const handleNotificationsSkip = () => onComplete();

  if (step === 'friends') {
    return (
      <PermissionScreen
        icon={<Users size={64} className="text-red" strokeWidth={1.5} />}
        title="Conectar seus amigos?"
        description="Descubra os lugares que seus amigos amam e compartilhe suas descobertas."
        primaryLabel="Conectar"
        secondaryLabel="Pular"
        onPrimary={handleFriendsConnect}
        onSecondary={handleFriendsSkip}
      />
    );
  }

  return (
    <PermissionScreen
      icon={<Bell size={64} className="text-red" strokeWidth={1.5} />}
      title="Permitir notificações?"
      description="Te avisamos sobre novidades nos seus restaurantes salvos e recomendações personalizadas."
      primaryLabel="Permitir"
      secondaryLabel="Agora não"
      onPrimary={handleNotificationsAllow}
      onSecondary={handleNotificationsSkip}
    />
  );
};

interface PermissionScreenProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

const PermissionScreen: React.FC<PermissionScreenProps> = ({
  icon, title, description, primaryLabel, secondaryLabel, onPrimary, onSecondary,
}) => {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      {/* Icon */}
      <div className="w-[140px] h-[140px] bg-red/10 rounded-full flex items-center justify-center mb-8">
        {icon}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-display font-bold text-dark mb-3">
        {title}
      </h1>

      {/* Description */}
      <p className="text-base text-gray mb-12 max-w-[280px] leading-relaxed">
        {description}
      </p>

      {/* Buttons */}
      <div className="w-full max-w-[320px] flex flex-col gap-3">
        <button
          onClick={onPrimary}
          className="w-full py-4 px-6 bg-red text-white border-none rounded-md text-base font-semibold cursor-pointer shadow-[0_4px_15px_rgba(255,59,48,0.3)]"
        >
          {primaryLabel}
        </button>

        <button
          onClick={onSecondary}
          className="w-full py-4 px-6 bg-transparent text-gray border-none rounded-md text-base font-medium cursor-pointer"
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
};