/**
 * FOMÍ - Onboarding v3 UI Components
 * Redesign com animações e visual premium
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';

// ============================================================================
// ANIMATED CONTAINER
// ============================================================================

interface StepContainerProps {
  children: ReactNode;
}

export function StepContainer({ children }: StepContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-32">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// ANIMATED STEP WRAPPER
// ============================================================================

interface AnimatedStepProps {
  children: ReactNode;
  direction?: 'forward' | 'backward';
}

export function AnimatedStep({ children, direction = 'forward' }: AnimatedStepProps) {
  const variants = {
    enter: (dir: string) => ({
      x: dir === 'forward' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: string) => ({
      x: dir === 'forward' ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// PROGRESS DOTS
// ============================================================================

interface ProgressDotsProps {
  current: number;
  total: number;
  onDotClick?: (index: number) => void;
}

export function ProgressDots({ current, total, onDotClick }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;
        const isPast = index < current;

        return (
          <motion.button
            key={index}
            type="button"
            onClick={() => onDotClick?.(index)}
            disabled={!onDotClick || index > current}
            className={`
              rounded-full transition-all duration-300
              ${isActive 
                ? 'w-8 h-2 bg-red' 
                : isPast 
                  ? 'w-2 h-2 bg-red/50 cursor-pointer hover:bg-red/70' 
                  : 'w-2 h-2 bg-gray/30'
              }
              ${!onDotClick || index > current ? 'cursor-default' : 'cursor-pointer'}
            `}
            whileHover={isPast ? { scale: 1.2 } : {}}
            whileTap={isPast ? { scale: 0.9 } : {}}
            layout
          />
        );
      })}
    </div>
  );
}

// ============================================================================
// PROGRESS BAR (Alternative)
// ============================================================================

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="w-full h-1 bg-gray/20 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-red to-orange-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

// ============================================================================
// STEP HEADER
// ============================================================================

interface StepHeaderProps {
  title: string;
  subtitle: string;
  showBack?: boolean;
  onBack?: () => void;
  stepIndex: number;
  totalSteps: number;
}

export function StepHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  stepIndex,
  totalSteps,
}: StepHeaderProps) {
  return (
    <div className="mb-8">
      {/* Navigation + Progress */}
      <div className="flex items-center justify-between mb-6">
        {showBack ? (
          <motion.button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray/10 transition-colors"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={24} className="text-dark" />
          </motion.button>
        ) : (
          <div className="w-10" />
        )}

        <ProgressDots current={stepIndex} total={totalSteps} />

        <div className="w-10" />
      </div>

      {/* Title + Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-2xl font-display font-bold text-dark mb-2">
          {title}
        </h1>
        <p className="text-gray text-base leading-relaxed">
          {subtitle}
        </p>
      </motion.div>
    </div>
  );
}

// ============================================================================
// FIXED FOOTER
// ============================================================================

interface FixedFooterProps {
  children: ReactNode;
}

export function FixedFooter({ children }: FixedFooterProps) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col gap-3 max-w-lg mx-auto">
        {children}
      </div>
    </motion.div>
  );
}

// ============================================================================
// CTA BUTTON
// ============================================================================

interface CTAButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function CTAButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
}: CTAButtonProps) {
  const baseClasses = 'w-full py-4 px-6 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-all duration-300';
  
  const variantClasses = {
    primary: disabled || loading
      ? 'bg-gray/20 text-gray cursor-not-allowed'
      : 'bg-red text-white shadow-lg shadow-red/30 hover:shadow-xl hover:shadow-red/40 hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white text-dark border-2 border-gray/20 hover:border-red/30 hover:bg-red/5',
    ghost: 'bg-transparent text-gray hover:text-dark hover:bg-gray/10',
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]}`}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          <span>Carregando...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

// ============================================================================
// INPUT FIELD
// ============================================================================

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'date';
  placeholder?: string;
  required?: boolean;
  error?: string;
  prefix?: ReactNode;
}

export function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  prefix,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark">
        {label}
        {required && <span className="text-red ml-1">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full p-4 ${prefix ? 'pl-10' : ''} 
            border-2 rounded-xl text-base bg-white
            transition-all duration-200
            outline-none
            ${error 
              ? 'border-red/50 focus:border-red' 
              : 'border-gray/20 focus:border-red hover:border-gray/40'
            }
          `}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ============================================================================
// SECTION TITLE
// ============================================================================

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
}

export function SectionTitle({ children, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-dark">{children}</h3>
      {subtitle && <p className="text-sm text-gray mt-1">{subtitle}</p>}
    </div>
  );
}

// ============================================================================
// INFO CARD
// ============================================================================

interface InfoCardProps {
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success';
}

export function InfoCard({ children, variant = 'info' }: InfoCardProps) {
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl border ${variantClasses[variant]}`}
    >
      {children}
    </motion.div>
  );
}