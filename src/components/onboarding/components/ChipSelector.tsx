/**
 * FOMÍ - ChipSelector Component
 * Seleção de chips com validação min/max e grupos opcionais
 * Visual vibrante com cores sólidas
 */

import { useMemo } from 'react';
import type { ChipOption, ChipValidation } from '../types';

// Cores da paleta Fomí
const COLORS = {
  primary: '#F97316',      // Laranja vibrante
  primaryLight: '#FFF7ED', // Laranja claro (fundo selecionado suave)
  white: '#FFFFFF',
  dark: '#1F2937',
  gray: '#6B7280',
  grayLight: '#E5E7EB',
  grayBg: '#F9FAFB',
  error: '#EF4444',
};

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

    const chipStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '14px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      transition: 'all 0.2s',
      border: isSelected ? `2px solid ${COLORS.primary}` : `2px solid ${COLORS.grayLight}`,
      backgroundColor: isSelected ? COLORS.primary : COLORS.white,
      color: isSelected ? COLORS.white : COLORS.dark,
      boxShadow: isSelected ? '0 4px 12px rgba(249, 115, 22, 0.3)' : 'none',
      opacity: isDisabled ? 0.5 : 1,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      width: '100%',
      textAlign: 'left' as const,
    };

    return (
      <button
        key={option.id}
        type="button"
        onClick={() => !isDisabled && handleToggle(option.id)}
        disabled={isDisabled}
        style={chipStyle}
      >
        {showEmoji && <span style={{ fontSize: '18px' }}>{option.emoji}</span>}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {option.label}
        </span>
      </button>
    );
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: columns === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
    gap: '10px',
  };

  const validationStyle: React.CSSProperties = {
    fontSize: '14px',
    textAlign: 'center',
    color: isValid ? COLORS.gray : COLORS.error,
    marginBottom: '16px',
    fontWeight: 500,
  };

  // Renderizar com grupos
  if (groups && groups.length > 0) {
    return (
      <div>
        {validation && (
          <p style={validationStyle}>
            {validation.message} ({selected.length}/{validation.max})
          </p>
        )}

        {groups.map((group) => {
          const groupOptions = options.filter((o) => o.group === group.id);
          if (groupOptions.length === 0) return null;

          return (
            <div key={group.id} style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: COLORS.dark, marginBottom: '12px' }}>
                {group.label}
              </h4>
              <div style={gridStyle}>
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
    <div>
      {validation && (
        <p style={validationStyle}>
          {validation.message} ({selected.length}/{validation.max})
        </p>
      )}
      <div style={gridStyle}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {options.map((option) => {
        const isSelected = selected === option.id;

        const chipStyle: React.CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 500,
          transition: 'all 0.2s',
          border: isSelected ? `2px solid ${COLORS.primary}` : `2px solid ${COLORS.grayLight}`,
          backgroundColor: isSelected ? COLORS.primary : COLORS.white,
          color: isSelected ? COLORS.white : COLORS.dark,
          boxShadow: isSelected ? '0 4px 12px rgba(249, 115, 22, 0.3)' : 'none',
          cursor: 'pointer',
          textAlign: 'left' as const,
          width: '100%',
        };

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(isSelected ? null : option.id)}
            style={chipStyle}
          >
            {showEmoji && <span style={{ fontSize: '18px' }}>{option.emoji}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}