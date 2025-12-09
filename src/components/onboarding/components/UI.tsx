/**
 * FOMÍ - Onboarding UI Components
 * StepHeader, ProgressBar, StepContainer
 */

import { ChevronLeft } from 'lucide-react';

// ============================================================================
// PROGRESS BAR
// ============================================================================

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-orange-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ============================================================================
// STEP HEADER
// ============================================================================

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  stepIndex?: number;
  totalSteps?: number;
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
    <div className="space-y-4">
      {/* Top bar com voltar + progress */}
      <div className="flex items-center gap-4">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        {stepIndex !== undefined && totalSteps !== undefined && (
          <div className="flex-1">
            <ProgressBar current={stepIndex} total={totalSteps} />
          </div>
        )}
      </div>

      {/* Título e subtítulo */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
}

// ============================================================================
// STEP CONTAINER
// ============================================================================

interface StepContainerProps {
  children: React.ReactNode;
}

export function StepContainer({ children }: StepContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CTA BUTTON
// ============================================================================

interface CTAButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export function CTAButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  fullWidth = true,
}: CTAButtonProps) {
  const base = 'py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const width = fullWidth ? 'w-full' : '';
  
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${width} ${variants[variant]}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// ============================================================================
// FIXED FOOTER
// ============================================================================

interface FixedFooterProps {
  children: React.ReactNode;
}

export function FixedFooter({ children }: FixedFooterProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 shadow-lg">
      <div className="max-w-md mx-auto space-y-3">
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// INPUT FIELD
// ============================================================================

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'date';
  helper?: string;
  error?: string;
  required?: boolean;
  prefix?: string;
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  helper,
  error,
  required = false,
  prefix,
}: InputFieldProps) {
  const inputBase = 'w-full px-4 py-3 rounded-xl border-2 text-gray-900 transition-colors duration-200 focus:outline-none focus:border-orange-500';
  const inputPadding = prefix ? 'pl-8' : '';
  const inputBorder = error ? 'border-red-300' : 'border-gray-200';

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputBase} ${inputPadding} ${inputBorder}`}
        />
      </div>

      {helper && !error && (
        <p className="text-xs text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}