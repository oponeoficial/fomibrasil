/**
 * FOMÍ - Onboarding v3 ChipSelector
 * Chips animados com ícones Lucide
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ChipOption, ChipValidation } from '../types';

// ============================================================================
// MULTI SELECT CHIPS
// ============================================================================

interface ChipSelectorProps {
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  validation?: ChipValidation;
  groups?: { id: string; label: string; icon?: React.ComponentType<{ size?: number; className?: string }> }[];
  columns?: 2 | 3;
}

export function ChipSelector({
  options,
  selected,
  onChange,
  validation,
  groups,
  columns = 2,
}: ChipSelectorProps) {
  const isValid = useMemo(() => {
    if (!validation) return true;
    return selected.length >= validation.min && selected.length <= validation.max;
  }, [selected, validation]);

  const handleToggle = (chipId: string) => {
    const isSelected = selected.includes(chipId);

    if (isSelected) {
      onChange(selected.filter((id) => id !== chipId));
    } else if (!validation || selected.length < validation.max) {
      onChange([...selected, chipId]);
    }
  };

  const renderChip = (option: ChipOption, index: number) => {
    const isSelected = selected.includes(option.id);
    const isDisabled = !isSelected && validation && selected.length >= validation.max;
    const Icon = option.icon;

    return (
      <motion.button
        key={option.id}
        type="button"
        onClick={() => !isDisabled && handleToggle(option.id)}
        disabled={isDisabled}
        className={`
          relative flex items-center gap-3 p-4 rounded-2xl text-left
          transition-all duration-300 border-2 w-full
          ${isSelected 
            ? 'bg-red text-white border-red shadow-lg shadow-red/20' 
            : 'bg-white text-dark border-gray/20 hover:border-red/30 hover:shadow-md'
          }
          ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
      >
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
          ${isSelected ? 'bg-white/20' : 'bg-red/10'}
        `}>
          <Icon 
            size={20} 
            className={isSelected ? 'text-white' : 'text-red'} 
          />
        </div>

        {/* Label */}
        <span className="font-medium text-sm leading-tight flex-1">
          {option.label}
        </span>

        {/* Selected indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white flex items-center justify-center"
            >
              <Check size={12} className="text-red" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  const gridClass = columns === 3 
    ? 'grid grid-cols-3 gap-3' 
    : 'grid grid-cols-2 gap-3';

  // Render with groups
  if (groups && groups.length > 0) {
    return (
      <div className="space-y-6">
        {/* Validation counter */}
        {validation && (
          <motion.div 
            className={`
              text-center text-sm font-medium py-2 px-4 rounded-full inline-flex mx-auto
              ${isValid ? 'bg-green-100 text-green-700' : 'bg-red/10 text-red'}
            `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {selected.length}/{validation.max} selecionados
          </motion.div>
        )}

        {groups.map((group) => {
          const groupOptions = options.filter((o) => o.group === group.id);
          if (groupOptions.length === 0) return null;

          const GroupIcon = group.icon;

          return (
            <motion.div 
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-3">
                {GroupIcon && <GroupIcon size={18} className="text-red" />}
                <h4 className="font-semibold text-dark text-sm">
                  {group.label}
                </h4>
              </div>
              <div className={gridClass}>
                {groupOptions.map((option, idx) => renderChip(option, idx))}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Render without groups
  return (
    <div className="space-y-4">
      {validation && (
        <motion.div 
          className={`
            text-center text-sm font-medium py-2 px-4 rounded-full
            ${isValid ? 'bg-green-100 text-green-700' : 'bg-red/10 text-red'}
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {validation.message} ({selected.length}/{validation.max})
        </motion.div>
      )}
      <div className={gridClass}>
        {options.map((option, idx) => renderChip(option, idx))}
      </div>
    </div>
  );
}

// ============================================================================
// SINGLE SELECT CHIPS
// ============================================================================

interface SingleSelectProps {
  options: ChipOption[];
  selected: string | null;
  onChange: (selected: string | null) => void;
}

export function SingleSelect({
  options,
  selected,
  onChange,
}: SingleSelectProps) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selected === option.id;
        const Icon = option.icon;

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => onChange(isSelected ? null : option.id)}
            className={`
              relative flex items-center gap-4 p-4 rounded-2xl w-full text-left
              transition-all duration-300 border-2
              ${isSelected 
                ? 'bg-red text-white border-red shadow-lg shadow-red/20' 
                : 'bg-white text-dark border-gray/20 hover:border-red/30 hover:shadow-md'
              }
            `}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Icon */}
            <div className={`
              flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
              ${isSelected ? 'bg-white/20' : 'bg-red/10'}
            `}>
              <Icon 
                size={24} 
                className={isSelected ? 'text-white' : 'text-red'} 
              />
            </div>

            {/* Label */}
            <span className="font-medium flex-1">
              {option.label}
            </span>

            {/* Radio indicator */}
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${isSelected 
                ? 'border-white bg-white' 
                : 'border-gray/30'
              }
            `}>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 rounded-full bg-red"
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ============================================================================
// RESTRICTION SELECTOR (Special logic for "none")
// ============================================================================

interface RestrictionSelectorProps {
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function RestrictionSelector({
  options,
  selected,
  onChange,
}: RestrictionSelectorProps) {
  const handleToggle = (chipId: string) => {
    if (chipId === 'none') {
      onChange(['none']);
      return;
    }

    const withoutNone = selected.filter((id) => id !== 'none');

    if (withoutNone.includes(chipId)) {
      const result = withoutNone.filter((id) => id !== chipId);
      onChange(result.length === 0 ? ['none'] : result);
    } else {
      onChange([...withoutNone, chipId]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option, index) => {
        const isSelected = selected.includes(option.id);
        const isNone = option.id === 'none';
        const Icon = option.icon;

        return (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => handleToggle(option.id)}
            className={`
              relative flex items-center gap-3 p-4 rounded-2xl text-left
              transition-all duration-300 border-2
              ${isNone ? 'col-span-2' : ''}
              ${isSelected 
                ? isNone
                  ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20'
                  : 'bg-red text-white border-red shadow-lg shadow-red/20' 
                : 'bg-white text-dark border-gray/20 hover:border-red/30 hover:shadow-md'
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
              ${isSelected 
                ? 'bg-white/20' 
                : isNone ? 'bg-green-100' : 'bg-red/10'
              }
            `}>
              <Icon 
                size={20} 
                className={isSelected ? 'text-white' : isNone ? 'text-green-600' : 'text-red'} 
              />
            </div>

            {/* Label */}
            <span className="font-medium text-sm flex-1">
              {option.label}
            </span>

            {/* Selected indicator */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5 rounded-full bg-white flex items-center justify-center"
                >
                  <Check size={12} className={isNone ? 'text-green-500' : 'text-red'} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}