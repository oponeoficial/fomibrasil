/**
 * FOMÍ - Onboarding UI Components
 * Visual consistente com AuthForm
 */

import { ChevronLeft, Loader2 } from 'lucide-react';

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
    <div className="w-full h-1 bg-gray/20 rounded-full overflow-hidden">
      <div
        className="h-full bg-red transition-all duration-300"
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
  showLogo?: boolean;
}

export function StepHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  stepIndex,
  totalSteps,
  showLogo = false,
}: StepHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Top bar com voltar + progress */}
      <div className="flex items-center gap-4">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="bg-transparent border-none cursor-pointer p-2 -ml-2"
          >
            <ChevronLeft size={24} className="text-dark" />
          </button>
        ) : (
          <div className="w-8" />
        )}

        {stepIndex !== undefined && totalSteps !== undefined && (
          <div className="flex-1">
            <ProgressBar current={stepIndex} total={totalSteps} />
          </div>
        )}
      </div>

      {/* Logo opcional */}
      {showLogo && (
        <div className="text-center">
          <img src="/images/logo-fomi.png" alt="Fomí" className="w-[100px] h-auto mx-auto" />
        </div>
      )}

      {/* Título e subtítulo */}
      <div className="space-y-2">
        <h1 className="text-2xl font-display font-bold text-dark">{title}</h1>
        {subtitle && <p className="text-sm text-gray">{subtitle}</p>}
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
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto p-6">
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
  const base = 'py-4 px-6 border-none rounded-md text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200';
  const width = fullWidth ? 'w-full' : '';
  
  const variants = {
    primary: disabled || loading
      ? 'bg-light-gray text-gray cursor-not-allowed'
      : 'bg-red text-white shadow-[0_4px_15px_rgba(255,59,48,0.3)] hover:bg-red/90',
    secondary: 'bg-light-gray text-dark hover:bg-gray/20',
    outline: 'bg-transparent text-red border-2 border-red hover:bg-red/5',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${width} ${variants[variant]}`}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Carregando...
        </>
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
    <div className="sticky bottom-0 bg-cream border-t border-gray/10 p-4">
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
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark">
        {label}
        {required && <span className="text-red ml-1">*</span>}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-3.5 border rounded-lg text-base bg-white outline-none transition-colors ${prefix ? 'pl-8' : ''} ${error ? 'border-red' : 'border-gray/30 focus:border-red'}`}
        />
      </div>

      {helper && !error && (
        <p className="text-xs text-gray">{helper}</p>
      )}
      {error && (
        <p className="text-xs text-red">{error}</p>
      )}
    </div>
  );
}

// ============================================================================
// SELECT FIELD
// ============================================================================

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  required = false,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-dark">
        {label}
        {required && <span className="text-red ml-1">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3.5 border border-gray/30 rounded-lg text-base bg-white outline-none focus:border-red appearance-none cursor-pointer"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}