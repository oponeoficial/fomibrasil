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
      className={`fixed top-[60px] left-0 right-0 z-40 bg-cream/98 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${
        isExpanded ? 'max-h-[300px] shadow-card' : 'max-h-0'
      }`}
    >
      <div className="p-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-soft mb-4">
          <Search size={20} className="text-gray" />
          <input
            type="text"
            placeholder="Buscar restaurantes, pratos ou bairros..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 border-none outline-none text-sm bg-transparent text-dark placeholder:text-gray"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="bg-transparent border-none cursor-pointer p-0">
              <X size={18} className="text-gray" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filterChips.map((chip) => {
            const isSelected = selectedFilters.includes(chip.id);
            return (
              <button
                key={chip.id}
                onClick={() => onFilterChange(chip.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-2 border-red bg-red/10 text-red font-semibold'
                    : 'border border-gray/30 bg-white text-dark font-normal'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Close hint */}
        <div className="flex justify-center mt-2">
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer flex items-center gap-1 text-gray text-xs"
          >
            <ChevronDown size={16} />
            <span>Fechar filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};