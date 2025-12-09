/**
 * FOMÍ - Signup Step (Tela 1)
 * Visual consistente com AuthForm
 */

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { OnboardingData } from '../types';
import { STEP_CONTENT, USERNAME_REGEX, USERNAME_HELP, PASSWORD_MIN_LENGTH } from '../constants';
import { StepHeader } from '../components/UI';

interface SignupStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  error: string | null;
}

export function SignupStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
  error,
}: SignupStepProps) {
  const content = STEP_CONTENT.signup;
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Debounced username check
  useEffect(() => {
    if (data.username.length < 3) {
      setUsernameError(null);
      return;
    }

    if (!USERNAME_REGEX.test(data.username)) {
      setUsernameError('Use apenas letras, números, ponto e underline');
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', data.username)
        .maybeSingle();

      setCheckingUsername(false);
      setUsernameError(existing ? 'Esse username já está em uso' : null);
    }, 500);

    return () => clearTimeout(timer);
  }, [data.username]);

  // Email validation
  useEffect(() => {
    if (!data.email) {
      setEmailError(null);
      return;
    }

    if (!data.email.includes('@') || !data.email.includes('.')) {
      setEmailError('Digite um e-mail válido');
      return;
    }

    setEmailError(null);
  }, [data.email]);

  const passwordStrength = () => {
    const len = data.password.length;
    if (len === 0) return null;
    if (len < PASSWORD_MIN_LENGTH) return { label: 'Muito curta', color: '#EF4444' };
    if (len < 12) return { label: 'Ok', color: '#CA8A04' };
    return { label: 'Forte', color: '#16A34A' };
  };

  const strength = passwordStrength();

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#1F2937',
    marginBottom: '8px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    fontSize: '16px',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    color: '#111827',
  };

  const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#EF4444',
  };

  return (
    <div>
      <StepHeader
        title={content.title}
        subtitle={content.subtitle}
        showBack={!!onBack}
        onBack={onBack}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Nome completo */}
        <div>
          <label style={labelStyle}>
            Nome completo <span style={{ color: '#F97316' }}>*</span>
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            placeholder="Seu nome completo"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#F97316'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>

        {/* Username */}
        <div>
          <label style={labelStyle}>
            Nome de usuário <span style={{ color: '#F97316' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>@</span>
            <input
              type="text"
              value={data.username}
              onChange={(e) => updateData({ username: e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '') })}
              placeholder="seunome"
              style={{ ...inputStyle, paddingLeft: '32px', borderColor: usernameError ? '#EF4444' : '#E5E7EB' }}
              onFocus={(e) => e.target.style.borderColor = '#F97316'}
              onBlur={(e) => e.target.style.borderColor = usernameError ? '#EF4444' : '#E5E7EB'}
            />
          </div>
          <p style={{ fontSize: '12px', color: usernameError ? '#EF4444' : '#6B7280', marginTop: '4px' }}>
            {checkingUsername ? 'Verificando...' : usernameError || USERNAME_HELP}
          </p>
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>
            E-mail <span style={{ color: '#F97316' }}>*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="seu@email.com"
            style={emailError ? inputErrorStyle : inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#F97316'}
            onBlur={(e) => e.target.style.borderColor = emailError ? '#EF4444' : '#E5E7EB'}
          />
          {emailError && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>{emailError}</p>}
        </div>

        {/* Senha */}
        <div>
          <label style={labelStyle}>
            Senha <span style={{ color: '#F97316' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => updateData({ password: e.target.value })}
              placeholder="Mínimo 8 caracteres"
              style={{ ...inputStyle, paddingRight: '48px' }}
              onFocus={(e) => e.target.style.borderColor = '#F97316'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: '#9CA3AF' 
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>Mínimo {PASSWORD_MIN_LENGTH} caracteres</p>
            {strength && (
              <p style={{ fontSize: '12px', color: strength.color }}>
                {strength.label}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p style={{ 
          fontSize: '14px', 
          color: '#EF4444', 
          textAlign: 'center', 
          backgroundColor: '#FEF2F2', 
          padding: '12px', 
          borderRadius: '8px',
          marginTop: '16px',
        }}>
          {error}
        </p>
      )}
    </div>
  );
}