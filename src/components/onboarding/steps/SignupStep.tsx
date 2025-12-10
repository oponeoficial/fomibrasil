/**
 * FOMÍ - Signup Step (Tela 1)
 * Visual redesenhado com animações
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AtSign, Check, X, Loader2 } from 'lucide-react';
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
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Debounced username check
  useEffect(() => {
    if (data.username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    if (!USERNAME_REGEX.test(data.username)) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', data.username)
        .maybeSingle();

      setUsernameStatus(existing ? 'taken' : 'available');
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
    if (len < PASSWORD_MIN_LENGTH) return { label: 'Muito curta', color: 'text-red', bg: 'bg-red' };
    if (len < 12) return { label: 'Ok', color: 'text-amber-500', bg: 'bg-amber-500' };
    return { label: 'Forte', color: 'text-green-500', bg: 'bg-green-500' };
  };

  const strength = passwordStrength();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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

      <motion.div 
        className="space-y-5"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Nome completo */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-dark mb-2">
            Nome completo <span className="text-red">*</span>
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            placeholder="Seu nome completo"
            className="w-full p-4 border-2 border-gray/20 rounded-2xl text-base bg-white outline-none transition-all focus:border-red hover:border-gray/40"
          />
        </motion.div>

        {/* Username */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-dark mb-2">
            Nome de usuário <span className="text-red">*</span>
          </label>
          <div className="relative">
            <AtSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
            <input
              type="text"
              value={data.username}
              onChange={(e) => updateData({ username: e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '') })}
              placeholder="seunome"
              className={`
                w-full p-4 pl-11 pr-12 border-2 rounded-2xl text-base bg-white outline-none transition-all
                ${usernameStatus === 'taken' 
                  ? 'border-red focus:border-red' 
                  : usernameStatus === 'available'
                    ? 'border-green-500 focus:border-green-500'
                    : 'border-gray/20 focus:border-red hover:border-gray/40'
                }
              `}
            />
            {/* Status indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {usernameStatus === 'checking' && (
                <Loader2 size={18} className="text-gray animate-spin" />
              )}
              {usernameStatus === 'available' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <Check size={12} className="text-white" />
                </motion.div>
              )}
              {usernameStatus === 'taken' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-red flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </motion.div>
              )}
            </div>
          </div>
          <p className={`text-xs mt-2 ${usernameStatus === 'taken' ? 'text-red' : 'text-gray'}`}>
            {usernameStatus === 'taken' ? 'Esse username já está em uso' : USERNAME_HELP}
          </p>
        </motion.div>

        {/* Email */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-dark mb-2">
            E-mail <span className="text-red">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="seu@email.com"
            className={`
              w-full p-4 border-2 rounded-2xl text-base bg-white outline-none transition-all
              ${emailError 
                ? 'border-red focus:border-red' 
                : 'border-gray/20 focus:border-red hover:border-gray/40'
              }
            `}
          />
          {emailError && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red mt-2"
            >
              {emailError}
            </motion.p>
          )}
        </motion.div>

        {/* Senha */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-dark mb-2">
            Senha <span className="text-red">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => updateData({ password: e.target.value })}
              placeholder="Mínimo 8 caracteres"
              className="w-full p-4 pr-12 border-2 border-gray/20 rounded-2xl text-base bg-white outline-none transition-all focus:border-red hover:border-gray/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray hover:text-dark transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Password strength */}
          {strength && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 bg-gray/20 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${strength.bg}`}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: strength.label === 'Muito curta' ? '33%' 
                      : strength.label === 'Ok' ? '66%' 
                      : '100%' 
                  }}
                />
              </div>
              <span className={`text-xs font-medium ${strength.color}`}>
                {strength.label}
              </span>
            </div>
          )}
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red/10 border border-red/20"
          >
            <p className="text-sm text-red text-center">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}