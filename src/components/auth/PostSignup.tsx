import React, { useState } from 'react';
import { Users, Bell } from 'lucide-react';

interface PostSignupProps {
  onComplete: () => void;
}

type Step = 'friends' | 'notifications';

export const PostSignup: React.FC<PostSignupProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('friends');

  const handleFriendsConnect = () => {
    // TODO: Implementar conexão com contatos/redes sociais
    setStep('notifications');
  };

  const handleFriendsSkip = () => {
    setStep('notifications');
  };

  const handleNotificationsAllow = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
    }
    onComplete();
  };

  const handleNotificationsSkip = () => {
    onComplete();
  };

  if (step === 'friends') {
    return (
      <PermissionScreen
        icon={<Users size={64} color="var(--color-red)" strokeWidth={1.5} />}
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
      icon={<Bell size={64} color="var(--color-red)" strokeWidth={1.5} />}
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
  icon,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}) => {
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
      {/* Icon */}
      <div
        style={{
          width: '140px',
          height: '140px',
          backgroundColor: 'rgba(255, 59, 48, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--color-dark)',
          marginBottom: '12px',
        }}
      >
        {title}
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--color-gray)',
          marginBottom: '48px',
          maxWidth: '280px',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {/* Buttons */}
      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={onPrimary}
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
          {primaryLabel}
        </button>

        <button
          onClick={onSecondary}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: 'transparent',
            color: 'var(--color-gray)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
};