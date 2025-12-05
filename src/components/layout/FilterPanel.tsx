import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const filterChips = [
  { id: 'solo', label: 'Sozinho', icon: '👤' },
  { id: 'couple', label: 'Casal', icon: '👥' },
  { id: 'friends', label: 'Amigos', icon: '🎉' },
  { id: 'family', label: 'Família', icon: '👨‍👩‍👧‍👦' },
  { id: 'romantic', label: 'Romântico', icon: '🕯️' },
  { id: 'casual', label: 'Casual', icon: '☕' },
  { id: 'italian', label: 'Italiana', icon: '🍝' },
  { id: 'japanese', label: 'Japonesa', icon: '🍣' },
  { id: 'burger', label: 'Hambúrguer', icon: '🍔' },
];

interface FilterPanelProps {
  isExpanded: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isExpanded,
  onClose,
  selectedFilters,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: 'rgba(255, 248, 240, 0.98)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isExpanded ? 'var(--shadow-card)' : 'none',
        maxHeight: isExpanded ? '300px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      }}
    >
      <div style={{ padding: '16px' }}>
        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-full)',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-soft)',
            marginBottom: '16px',
          }}
        >
          <Search size={20} color="var(--color-gray)" />
          <input
            type="text"
            placeholder="Buscar restaurantes, pratos ou bairros..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              backgroundColor: 'transparent',
              color: 'var(--color-dark)',
            }}
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} color="var(--color-gray)" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {filterChips.map((chip) => {
            const isSelected = selectedFilters.includes(chip.id);
            return (
              <button
                key={chip.id}
                onClick={() => onFilterChange(chip.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '2px solid var(--color-red)' : '1px solid #e0e0e0',
                  backgroundColor: isSelected ? 'rgba(255, 59, 48, 0.1)' : '#fff',
                  color: isSelected ? 'var(--color-red)' : 'var(--color-dark)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 600 : 400,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Close hint */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--color-gray)',
              fontSize: '0.75rem',
            }}
          >
            <ChevronDown size={16} />
            <span>Fechar filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};