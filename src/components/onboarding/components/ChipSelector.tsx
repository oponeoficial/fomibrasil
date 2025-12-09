/**
 * FOMÍ - ChipSelector Component
 * Seleção de chips com validação min/max e grupos opcionais
 */

import { useMemo } from 'react';
import type { ChipOption, ChipValidation } from '../types';

interface ChipSelectorProps {
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  validation?: ChipValidation;
  groups?: { id: string; label: string }[];
  columns?: 2 | 3;
  showEmoji?: boolean;
}

export function ChipSelector({
  options,
  selected,
  onChange,
  validation,
  groups,
  columns = 2,
  showEmoji = true,
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

  const renderChip = (option: ChipOption) => {
    const isSelected = selected.includes(option.id);
    const isDisabled = !isSelected && validation && selected.length >= validation.max;

    return (
      <button
        key={option.id}
        type="button"
        onClick={() => handleToggle(option.id)}
        disabled={isDisabled}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
          transition-all duration-200 border-2
          ${isSelected
            ? 'bg-orange-500 text-white border-orange-500 shadow-md'
            : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {showEmoji && <span className="text-lg">{option.emoji}</span>}
        <span className="truncate">{option.label}</span>
      </button>
    );
  };

  const gridClass = columns === 3
    ? 'grid grid-cols-2 sm:grid-cols-3 gap-2'
    : 'grid grid-cols-2 gap-2';

  // Renderizar com grupos
  if (groups && groups.length > 0) {
    return (
      <div className="space-y-6">
        {validation && (
          <p className={`text-sm text-center ${isValid ? 'text-gray-500' : 'text-orange-500'}`}>
            {validation.message} ({selected.length}/{validation.max})
          </p>
        )}

        {groups.map((group) => {
          const groupOptions = options.filter((o) => o.group === group.id);
          if (groupOptions.length === 0) return null;

          return (
            <div key={group.id}>
              <h4 className="text-sm font-semibold text-gray-600 mb-3">{group.label}</h4>
              <div className={gridClass}>
                {groupOptions.map(renderChip)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Renderizar sem grupos
  return (
    <div className="space-y-4">
      {validation && (
        <p className={`text-sm text-center ${isValid ? 'text-gray-500' : 'text-orange-500'}`}>
          {validation.message} ({selected.length}/{validation.max})
        </p>
      )}
      <div className={gridClass}>
        {options.map(renderChip)}
      </div>
    </div>
  );
}

// ============================================================================
// SINGLE SELECT VARIANT
// ============================================================================

interface SingleSelectProps {
  options: ChipOption[];
  selected: string | null;
  onChange: (selected: string | null) => void;
  showEmoji?: boolean;
}

export function SingleSelect({
  options,
  selected,
  onChange,
  showEmoji = true,
}: SingleSelectProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((option) => {
        const isSelected = selected === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(isSelected ? null : option.id)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              transition-all duration-200 border-2 text-left
              ${isSelected
                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
              }
            `}
          >
            {showEmoji && <span className="text-lg">{option.emoji}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}