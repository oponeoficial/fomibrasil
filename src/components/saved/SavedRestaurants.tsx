import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  ChevronLeft,
  Plus,
  Star,
  Send,
  Trash2,
  X,
  Filter,
  Loader2,
  MoreVertical,
  Edit3,
} from 'lucide-react';
import { useSavedRestaurants, SavedRestaurant, SavedList } from '../../hooks/useSavedRestaurants';
import { useAuthStore } from '../../store';

interface SavedRestaurantsProps {
  userId?: string | null;
  onBack?: () => void;
  onRestaurantClick?: (restaurantId: string) => void;
}

type SortOption = 'recent' | 'rating' | 'visits';

const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'recent', label: 'Mais recentes' },
  { id: 'rating', label: 'Maior nota' },
  { id: 'visits', label: 'Mais visitados' },
];

const emojiOptions = ['📁', '🏃', '❤️', '⭐', '🍕', '🍣', '🍔', '🥗', '☕', '🍷', '🎉', '💼', '✈️', '🏠', '🔥', '🌙', '🎂', '🥂'];

export const SavedRestaurants: React.FC<SavedRestaurantsProps> = ({
  userId: userIdProp,
  onBack,
  onRestaurantClick,
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const userId = userIdProp ?? user?.id ?? null;
  const handleBack = onBack ?? (() => navigate('/feed'));
  const handleRestaurantClick = onRestaurantClick ?? ((id: string) => navigate(`/restaurant/${id}`));

  const {
    lists,
    loading,
    markAsVisited,
    createList,
    deleteList,
    removeRestaurant,
    getRestaurantsByList,
    getListCounts,
    reload,
  } = useSavedRestaurants(userId);

  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<SavedList | null>(null);
  const [showListOptions, setShowListOptions] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<SavedRestaurant | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListIcon, setNewListIcon] = useState('📁');
  const [editListName, setEditListName] = useState('');
  const [editListIcon, setEditListIcon] = useState('📁');

  const counts = getListCounts();

  useEffect(() => {
    if (lists.length > 0 && !activeListId) {
      const wantToGo = lists.find((l) => l.system_type === 'want_to_go');
      setActiveListId(wantToGo?.id || lists[0].id);
    }
  }, [lists, activeListId]);

  const activeList = lists.find((l) => l.id === activeListId);
  const activeRestaurants = activeListId ? getRestaurantsByList(activeListId) : [];

  const sortedRestaurants = [...activeRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.restaurant_rating || 0) - (a.restaurant_rating || 0);
      case 'visits':
        return b.visit_count - a.visit_count;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    await createList(newListName, newListIcon);
    setNewListName('');
    setNewListIcon('📁');
    setShowCreateModal(false);
  };

  const handleEditList = async () => {
    if (!showEditModal || !editListName.trim()) return;
    
    // Atualizar lista via Supabase diretamente
    const { supabase } = await import('../../lib/supabase');
    await supabase
      .from('saved_lists')
      .update({ name: editListName, icon: editListIcon })
      .eq('id', showEditModal.id);
    
    await reload();
    setShowEditModal(null);
  };

  const handleDeleteList = async (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list?.is_system) {
      alert('Não é possível excluir listas do sistema');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta lista? Os restaurantes salvos nela serão removidos.')) {
      await deleteList(listId);
      setShowListOptions(null);
      // Se a lista ativa foi excluída, selecionar outra
      if (activeListId === listId) {
        const remaining = lists.filter(l => l.id !== listId);
        setActiveListId(remaining[0]?.id || null);
      }
    }
  };

  const handleRating = async (rating: number) => {
    if (!showRatingModal) return;
    await markAsVisited(showRatingModal.id, rating, rating >= 4);
    setShowRatingModal(null);
  };

  const openEditModal = (list: SavedList) => {
    setEditListName(list.name);
    setEditListIcon(list.icon || '📁');
    setShowEditModal(list);
    setShowListOptions(null);
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="text-red animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!userId) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
        <span className="text-6xl mb-4">🔒</span>
        <h2 className="text-xl font-bold mb-2 text-dark">Faça login para acessar</h2>
        <p className="text-gray mb-6">
          Seus restaurantes salvos estarão disponíveis após o login.
        </p>
        <button
          onClick={handleBack}
          className="py-3 px-6 bg-red text-white border-none rounded-xl font-semibold cursor-pointer"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 bg-cream/95 backdrop-blur-md p-4 border-b border-black/5 z-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full border-none bg-black/5 cursor-pointer flex items-center justify-center"
          >
            <ChevronLeft size={24} className="text-dark" />
          </button>
          <h1 className="text-xl font-bold font-display text-dark">Restaurantes Salvos</h1>
          <div className="flex items-center gap-2">
            {/* Botão Editar - só aparece se lista ativa não é sistema */}
            {activeList && !activeList.is_system && (
              <button
                onClick={() => openEditModal(activeList)}
                className="w-10 h-10 rounded-full border-none bg-black/5 cursor-pointer flex items-center justify-center"
              >
                <Edit3 size={18} className="text-dark" />
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-10 h-10 rounded-full border-none bg-red cursor-pointer flex items-center justify-center shadow-[0_2px_8px_rgba(255,59,48,0.3)]"
            >
              <Plus size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {lists.map((list) => (
            <div key={list.id} className="relative">
              <button
                onClick={() => setActiveListId(list.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (!list.is_system) setShowListOptions(list.id);
                }}
                className={`flex items-center gap-1.5 py-2.5 px-4 rounded-full border-none text-sm whitespace-nowrap cursor-pointer shadow-sm transition-all ${
                  activeListId === list.id
                    ? 'bg-red text-white font-semibold'
                    : 'bg-white text-dark font-normal'
                }`}
              >
                <span>{list.icon || '📁'}</span>
                <span>{list.name}</span>
                {counts[list.id] > 0 && (
                  <span
                    className={`py-0.5 px-2 rounded-xl text-xs ${
                      activeListId === list.id ? 'bg-white/30' : 'bg-light-gray'
                    }`}
                  >
                    {counts[list.id]}
                  </span>
                )}
                {/* Botão de opções para listas não-sistema */}
                {!list.is_system && activeListId === list.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowListOptions(showListOptions === list.id ? null : list.id);
                    }}
                    className="ml-1 p-0.5 rounded-full hover:bg-white/20"
                  >
                    <MoreVertical size={14} />
                  </button>
                )}
              </button>

              {/* Dropdown de opções da lista */}
              <AnimatePresence>
                {showListOptions === list.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg z-50 overflow-hidden min-w-[150px]"
                  >
                    <button
                      onClick={() => openEditModal(list)}
                      className="flex items-center gap-2 w-full py-3 px-4 text-left text-sm text-dark hover:bg-light-gray"
                    >
                      <Edit3 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="flex items-center gap-2 w-full py-3 px-4 text-left text-sm text-red hover:bg-red/10"
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </header>

      {/* Fechar dropdown ao clicar fora */}
      {showListOptions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowListOptions(null)} 
        />
      )}

      {/* Sort Bar */}
      <div className="flex items-center justify-between p-3 px-4 bg-white border-b border-black/5 relative">
        <p className="text-sm text-gray">
          {sortedRestaurants.length}{' '}
          {sortedRestaurants.length === 1 ? 'restaurante' : 'restaurantes'}
        </p>
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="flex items-center gap-1.5 py-2 px-3 bg-light-gray border-none rounded-lg text-sm text-dark cursor-pointer"
        >
          <Filter size={14} />
          {sortOptions.find((o) => o.id === sortBy)?.label}
        </button>

        {showSortMenu && (
          <div className="absolute right-4 top-[50px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-20 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSortBy(option.id);
                  setShowSortMenu(false);
                }}
                className={`block w-full py-3 px-5 border-none text-left text-sm cursor-pointer ${
                  sortBy === option.id ? 'bg-red/10 text-red' : 'bg-transparent text-dark'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Restaurant List */}
      <div className="p-4">
        {sortedRestaurants.length === 0 ? (
          <div className="text-center py-16 px-5 text-gray">
            <span className="text-5xl block mb-4">{activeList?.icon || '📭'}</span>
            <p className="text-base font-medium mb-2 text-dark">
              Nenhum restaurante aqui ainda
            </p>
            <p className="text-sm">
              {activeList?.system_type === 'want_to_go'
                ? 'Salve restaurantes que quer experimentar!'
                : 'Adicione restaurantes a esta lista.'}
            </p>
          </div>
        ) : (
          sortedRestaurants.map((restaurant) => (
            <SwipeableRestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              listType={activeList?.system_type || null}
              onClick={() => handleRestaurantClick(restaurant.restaurant_id)}
              onMarkVisited={() => setShowRatingModal(restaurant)}
              onDelete={() => removeRestaurant(restaurant.id)}
            />
          ))
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div
          onClick={() => setShowRatingModal(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-[320px] text-center"
          >
            <h3 className="text-xl font-bold mb-2 text-dark">O que achou?</h3>
            <p className="text-sm text-gray mb-5">{showRatingModal.restaurant_name}</p>
            <div className="flex justify-center gap-2 mb-4">
              {[
                { r: 1, e: '😞' },
                { r: 2, e: '😕' },
                { r: 3, e: '😐' },
                { r: 4, e: '😊' },
                { r: 5, e: '🤩' },
              ].map(({ r, e }) => (
                <button
                  key={r}
                  onClick={() => handleRating(r)}
                  className="w-[52px] h-[52px] rounded-xl border-none bg-light-gray text-3xl cursor-pointer hover:scale-110 transition-transform"
                >
                  {e}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray">⭐ 4-5 = Favoritos • ⭐ 1-2 = Remove</p>
          </div>
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-[320px]"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-dark">Nova Lista</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-transparent border-none cursor-pointer"
              >
                <X size={20} className="text-gray" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray mb-2">Escolha um ícone</p>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewListIcon(emoji)}
                    className={`w-10 h-10 rounded-xl text-xl cursor-pointer border-2 ${
                      newListIcon === emoji
                        ? 'border-red bg-red/10'
                        : 'border-transparent bg-light-gray'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm text-gray mb-2">Nome da lista</p>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Ex: Com a Equipe do Trabalho"
                className="w-full p-3 px-4 rounded-xl border border-black/10 text-base outline-none"
              />
            </div>

            <button
              onClick={handleCreateList}
              disabled={!newListName.trim()}
              className={`w-full py-3.5 border-none rounded-xl text-base font-semibold cursor-pointer ${
                newListName.trim()
                  ? 'bg-red text-white'
                  : 'bg-light-gray text-gray cursor-not-allowed'
              }`}
            >
              Criar Lista
            </button>
          </div>
        </div>
      )}

      {/* Edit List Modal */}
      {showEditModal && (
        <div
          onClick={() => setShowEditModal(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-[320px]"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-dark">Editar Lista</h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="bg-transparent border-none cursor-pointer"
              >
                <X size={20} className="text-gray" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray mb-2">Escolha um ícone</p>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setEditListIcon(emoji)}
                    className={`w-10 h-10 rounded-xl text-xl cursor-pointer border-2 ${
                      editListIcon === emoji
                        ? 'border-red bg-red/10'
                        : 'border-transparent bg-light-gray'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm text-gray mb-2">Nome da lista</p>
              <input
                type="text"
                value={editListName}
                onChange={(e) => setEditListName(e.target.value)}
                placeholder="Nome da lista"
                className="w-full p-3 px-4 rounded-xl border border-black/10 text-base outline-none"
              />
            </div>

            <button
              onClick={handleEditList}
              disabled={!editListName.trim()}
              className={`w-full py-3.5 border-none rounded-xl text-base font-semibold cursor-pointer ${
                editListName.trim()
                  ? 'bg-red text-white'
                  : 'bg-light-gray text-gray cursor-not-allowed'
              }`}
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Swipeable Restaurant Card
interface SwipeableCardProps {
  restaurant: SavedRestaurant;
  listType: string | null;
  onClick: () => void;
  onMarkVisited: () => void;
  onDelete: () => void;
}

const SwipeableRestaurantCard: React.FC<SwipeableCardProps> = ({
  restaurant,
  listType,
  onClick,
  onMarkVisited,
  onDelete,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      setShowDelete(true);
    } else {
      setShowDelete(false);
    }
  };

  const handleDelete = async () => {
    await onDelete();
  };

  return (
    <div ref={constraintsRef} className="relative mb-3 overflow-hidden rounded-2xl">
      {/* Delete background */}
      <div className="absolute inset-0 bg-red flex items-center justify-end px-6 rounded-2xl">
        <button 
          onClick={handleDelete}
          className="flex flex-col items-center text-white"
        >
          <Trash2 size={24} />
          <span className="text-xs mt-1">Excluir</span>
        </button>
      </div>

      {/* Card content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: showDelete ? -100 : 0 }}
        className="relative bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex"
      >
        {/* Image */}
        <div
          onClick={onClick}
          className="w-[100px] min-h-[100px] bg-light-gray bg-cover bg-center cursor-pointer relative rounded-l-2xl"
          style={{
            backgroundImage: restaurant.restaurant_image
              ? `url(${restaurant.restaurant_image})`
              : 'none',
          }}
        />

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div onClick={onClick} className="cursor-pointer">
            <h3 className="text-base font-semibold text-dark mb-1">
              {restaurant.restaurant_name}
            </h3>

            <div className="flex items-center gap-2 mb-1.5">
              {restaurant.restaurant_rating ? (
                <div className="flex items-center gap-1">
                  <Star size={12} fill="#FF3B30" className="text-red" />
                  <span className="text-sm font-medium text-dark">
                    {restaurant.restaurant_rating.toFixed(1)}
                  </span>
                </div>
              ) : null}

              {restaurant.restaurant_price && (
                <span className="text-sm text-gray">{restaurant.restaurant_price}</span>
              )}
            </div>

            {restaurant.restaurant_address && (
              <p className="text-xs text-gray truncate">{restaurant.restaurant_address}</p>
            )}
          </div>

          {/* Action Button */}
          {listType === 'want_to_go' && !restaurant.visited && (
            <button
              onClick={onMarkVisited}
              className="mt-2 py-2 px-3 bg-red/10 text-red border-none rounded-lg text-xs font-semibold cursor-pointer"
            >
              Já fui! Avaliar
            </button>
          )}
        </div>
      </motion.div>

      {/* Tap to close swipe */}
      {showDelete && (
        <div 
          className="absolute inset-y-0 left-0 right-[100px] z-10"
          onClick={() => setShowDelete(false)}
        />
      )}
    </div>
  );
};

export default SavedRestaurants;