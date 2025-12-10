/**
 * Modal para selecionar em qual lista salvar o restaurante
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Loader2, Heart, Bookmark, MapPin, Sparkles } from 'lucide-react';
import { useSavedLists, SavedList } from '../../hooks/useSavedLists';

// Ícones disponíveis para listas
const AVAILABLE_ICONS = [
  { id: '❤️', icon: '❤️' },
  { id: '⭐', icon: '⭐' },
  { id: '🔥', icon: '🔥' },
  { id: '📍', icon: '📍' },
  { id: '🍽️', icon: '🍽️' },
  { id: '🎉', icon: '🎉' },
  { id: '💼', icon: '💼' },
  { id: '🌙', icon: '🌙' },
  { id: '☕', icon: '☕' },
  { id: '🍕', icon: '🍕' },
  { id: '🍺', icon: '🍺' },
  { id: '🥂', icon: '🥂' },
];

interface SaveToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantName: string;
  onSaved?: () => void;
}

export const SaveToListModal: React.FC<SaveToListModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  restaurantName,
  onSaved,
}) => {
  const { lists, loading, createList, saveToList, removeFromList, getRestaurantLists } = useSavedLists();
  
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [initialLists, setInitialLists] = useState<string[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListIcon, setNewListIcon] = useState('❤️');
  const [creatingList, setCreatingList] = useState(false);

  // Carregar listas em que o restaurante já está
  useEffect(() => {
    if (isOpen && restaurantId) {
      setLoadingLists(true);
      getRestaurantLists(restaurantId).then(listIds => {
        setSelectedLists(listIds);
        setInitialLists(listIds);
        setLoadingLists(false);
      });
    }
  }, [isOpen, restaurantId]);

  // Toggle seleção de lista
  const toggleList = (listId: string) => {
    setSelectedLists(prev => 
      prev.includes(listId)
        ? prev.filter(id => id !== listId)
        : [...prev, listId]
    );
  };

  // Criar nova lista
  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    setCreatingList(true);
    const newList = await createList(newListName.trim(), newListIcon);
    
    if (newList) {
      setSelectedLists(prev => [...prev, newList.id]);
      setNewListName('');
      setNewListIcon('❤️');
      setShowCreateNew(false);
    }
    
    setCreatingList(false);
  };

  // Salvar alterações
  const handleSave = async () => {
    setSaving(true);

    // Listas para adicionar
    const toAdd = selectedLists.filter(id => !initialLists.includes(id));
    // Listas para remover
    const toRemove = initialLists.filter(id => !selectedLists.includes(id));

    // Executar operações
    await Promise.all([
      ...toAdd.map(listId => saveToList(restaurantId, listId)),
      ...toRemove.map(listId => removeFromList(restaurantId, listId)),
    ]);

    setSaving(false);
    onSaved?.();
    onClose();
  };

  // Verificar se houve mudanças
  const hasChanges = JSON.stringify(selectedLists.sort()) !== JSON.stringify(initialLists.sort());

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/50 flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-white rounded-t-3xl max-h-[85vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray/10">
            <div>
              <h2 className="text-lg font-bold text-dark">Salvar em lista</h2>
              <p className="text-sm text-gray truncate max-w-[250px]">{restaurantName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-light-gray flex items-center justify-center"
            >
              <X size={20} className="text-dark" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {loading || loadingLists ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="text-red animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {/* Listas existentes */}
                {lists.map(list => (
                  <ListItem
                    key={list.id}
                    list={list}
                    selected={selectedLists.includes(list.id)}
                    onToggle={() => toggleList(list.id)}
                  />
                ))}

                {/* Criar nova lista */}
                {showCreateNew ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-light-gray rounded-2xl space-y-4"
                  >
                    <input
                      type="text"
                      value={newListName}
                      onChange={e => setNewListName(e.target.value)}
                      placeholder="Nome da lista"
                      className="w-full p-3 bg-white border-2 border-gray/20 rounded-xl text-base outline-none focus:border-red"
                      autoFocus
                    />

                    {/* Seletor de ícone */}
                    <div>
                      <p className="text-sm text-gray mb-2">Escolha um ícone</p>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_ICONS.map(({ id, icon }) => (
                          <button
                            key={id}
                            onClick={() => setNewListIcon(icon)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                              newListIcon === icon
                                ? 'bg-red text-white scale-110'
                                : 'bg-white hover:bg-gray/10'
                            }`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCreateNew(false)}
                        className="flex-1 py-3 bg-white rounded-xl text-dark font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleCreateList}
                        disabled={!newListName.trim() || creatingList}
                        className="flex-1 py-3 bg-red rounded-xl text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {creatingList ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            <Plus size={18} />
                            Criar
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setShowCreateNew(true)}
                    className="w-full p-4 border-2 border-dashed border-gray/30 rounded-2xl flex items-center justify-center gap-2 text-gray hover:border-red hover:text-red transition-colors"
                  >
                    <Plus size={20} />
                    <span className="font-medium">Criar nova lista</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray/10 bg-white">
            <button
              onClick={handleSave}
              disabled={saving || (!hasChanges && selectedLists.length === initialLists.length)}
              className="w-full py-4 bg-red text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Salvando...
                </>
              ) : selectedLists.length === 0 ? (
                'Remover de todas as listas'
              ) : (
                <>
                  <Heart size={20} fill="white" />
                  Salvar em {selectedLists.length} lista{selectedLists.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componente de item da lista
interface ListItemProps {
  list: SavedList;
  selected: boolean;
  onToggle: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ list, selected, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
        selected
          ? 'bg-red/10 border-2 border-red'
          : 'bg-light-gray border-2 border-transparent hover:border-gray/20'
      }`}
      whileTap={{ scale: 0.98 }}
    >
      {/* Ícone */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
        selected ? 'bg-red/20' : 'bg-white'
      }`}>
        {list.icon}
      </div>

      {/* Info */}
      <div className="flex-1 text-left">
        <p className={`font-semibold ${selected ? 'text-red' : 'text-dark'}`}>
          {list.name}
        </p>
        <p className="text-sm text-gray">
          {list.restaurant_count || 0} restaurante{(list.restaurant_count || 0) !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Checkbox */}
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        selected
          ? 'bg-red border-red'
          : 'border-gray/30'
      }`}>
        {selected && <Check size={14} className="text-white" />}
      </div>
    </motion.button>
  );
};

export default SaveToListModal;