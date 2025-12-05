import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Plus, Star, Bell, BellOff, Send, Trash2, Check, X, Filter, Loader2 } from 'lucide-react';
import { useSavedRestaurants, SavedRestaurant, SavedList } from '../../hooks/useSavedRestaurants';

interface SavedRestaurantsProps {
  userId: string | null;
  onBack: () => void;
  onRestaurantClick: (restaurantId: string) => void;
}

type SortOption = 'recent' | 'nearest' | 'rating' | 'visits';

const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'recent', label: 'Mais recentes' },
  { id: 'nearest', label: 'Mais perto' },
  { id: 'rating', label: 'Maior nota' },
  { id: 'visits', label: 'Mais visitados' },
];

const emojiOptions = ['📁', '🍕', '🍣', '🍔', '🥗', '☕', '🍷', '🎉', '💼', '✈️', '🏠', '❤️'];

export const SavedRestaurants: React.FC<SavedRestaurantsProps> = ({ userId, onBack, onRestaurantClick }) => {
  const {
    lists, loading, markAsVisited, createList, removeRestaurant,
    toggleReminder, getRestaurantsByList, getListCounts,
  } = useSavedRestaurants(userId);

  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState<SavedRestaurant | null>(null);
  const [contextMenu, setContextMenu] = useState<{ restaurant: SavedRestaurant; x: number; y: number } | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListIcon, setNewListIcon] = useState('📁');

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counts = getListCounts();

  useEffect(() => {
    if (lists.length > 0 && !activeListId) {
      const toTry = lists.find(l => l.system_type === 'to_try');
      setActiveListId(toTry?.id || lists[0].id);
    }
  }, [lists, activeListId]);

  const activeList = lists.find(l => l.id === activeListId);
  const activeRestaurants = activeListId ? getRestaurantsByList(activeListId) : [];

  const sortedRestaurants = [...activeRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return (b.personal_rating || b.restaurant_rating || 0) - (a.personal_rating || a.restaurant_rating || 0);
      case 'visits': return b.visit_count - a.visit_count;
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleTouchStart = (restaurant: SavedRestaurant, e: React.TouchEvent) => {
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      setContextMenu({ restaurant, x: touch.clientX, y: touch.clientY });
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    await createList(newListName, newListIcon);
    setNewListName('');
    setNewListIcon('📁');
    setShowCreateModal(false);
  };

  const handleRating = async (rating: number) => {
    if (!showRatingModal) return;
    await markAsVisited(showRatingModal.id, rating, rating >= 4);
    setShowRatingModal(null);
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
        <p className="text-gray mb-6">Seus restaurantes salvos estarão disponíveis após o login.</p>
        <button onClick={onBack} className="py-3 px-6 bg-red text-white border-none rounded-xl font-semibold cursor-pointer">
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
          <button onClick={onBack} className="w-10 h-10 rounded-full border-none bg-black/5 cursor-pointer flex items-center justify-center">
            <ChevronLeft size={24} className="text-dark" />
          </button>
          <h1 className="text-xl font-bold font-display text-dark">Restaurantes Salvos</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-10 h-10 rounded-full border-none bg-red cursor-pointer flex items-center justify-center shadow-[0_2px_8px_rgba(255,59,48,0.3)]"
          >
            <Plus size={20} className="text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`flex items-center gap-1.5 py-2.5 px-4 rounded-full border-none text-sm whitespace-nowrap cursor-pointer shadow-sm transition-all ${
                activeListId === list.id
                  ? 'bg-red text-white font-semibold'
                  : 'bg-white text-dark font-normal'
              }`}
            >
              <span>{list.icon}</span>
              <span>{list.name}</span>
              {counts[list.id] > 0 && (
                <span className={`py-0.5 px-2 rounded-xl text-xs ${
                  activeListId === list.id ? 'bg-white/30' : 'bg-light-gray'
                }`}>
                  {counts[list.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Sort Bar */}
      <div className="flex items-center justify-between p-3 px-4 bg-white border-b border-black/5 relative">
        <p className="text-sm text-gray">
          {sortedRestaurants.length} {sortedRestaurants.length === 1 ? 'restaurante' : 'restaurantes'}
        </p>
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="flex items-center gap-1.5 py-2 px-3 bg-light-gray border-none rounded-lg text-sm text-dark cursor-pointer"
        >
          <Filter size={14} />
          {sortOptions.find(o => o.id === sortBy)?.label}
        </button>

        {showSortMenu && (
          <div className="absolute right-4 top-[50px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-20 overflow-hidden">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => { setSortBy(option.id); setShowSortMenu(false); }}
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
            <p className="text-base font-medium mb-2 text-dark">Nenhum restaurante aqui ainda</p>
            <p className="text-sm">
              {activeList?.system_type === 'to_try' ? 'Salve restaurantes que quer experimentar!' : 'Adicione restaurantes a esta lista.'}
            </p>
          </div>
        ) : (
          sortedRestaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              listType={activeList?.system_type || null}
              onClick={() => onRestaurantClick(restaurant.restaurant_id)}
              onMarkVisited={() => setShowRatingModal(restaurant)}
              onTouchStart={(e) => handleTouchStart(restaurant, e)}
              onTouchEnd={handleTouchEnd}
            />
          ))
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div onClick={() => setShowRatingModal(null)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-[320px] text-center">
            <h3 className="text-xl font-bold mb-2 text-dark">O que achou?</h3>
            <p className="text-sm text-gray mb-5">{showRatingModal.restaurant_name}</p>
            <div className="flex justify-center gap-2 mb-4">
              {[{ r: 1, e: '😞' }, { r: 2, e: '😕' }, { r: 3, e: '😐' }, { r: 4, e: '😊' }, { r: 5, e: '🤩' }].map(({ r, e }) => (
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

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div onClick={() => setContextMenu(null)} className="fixed inset-0 z-[199]" />
          <div
            className="fixed bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] z-[200] overflow-hidden min-w-[180px]"
            style={{ left: Math.min(contextMenu.x, window.innerWidth - 200), top: Math.min(contextMenu.y, window.innerHeight - 180) }}
          >
            <button
              onClick={async () => { await toggleReminder(contextMenu.restaurant.id, !contextMenu.restaurant.reminder_enabled); setContextMenu(null); }}
              className="flex items-center gap-3 w-full py-3.5 px-4 bg-transparent border-none border-b border-black/5 text-left text-sm text-dark cursor-pointer"
            >
              {contextMenu.restaurant.reminder_enabled ? <BellOff size={18} /> : <Bell size={18} />}
              {contextMenu.restaurant.reminder_enabled ? 'Desativar lembrete' : 'Definir lembrete'}
            </button>
            <button
              onClick={() => { if (navigator.share) navigator.share({ title: contextMenu.restaurant.restaurant_name, text: `Vamos aqui? ${contextMenu.restaurant.restaurant_name}` }); setContextMenu(null); }}
              className="flex items-center gap-3 w-full py-3.5 px-4 bg-transparent border-none border-b border-black/5 text-left text-sm text-dark cursor-pointer"
            >
              <Send size={18} />
              Convidar amigo
            </button>
            <button
              onClick={async () => { await removeRestaurant(contextMenu.restaurant.id); setContextMenu(null); }}
              className="flex items-center gap-3 w-full py-3.5 px-4 bg-transparent border-none text-left text-sm text-red cursor-pointer"
            >
              <Trash2 size={18} />
              Remover
            </button>
          </div>
        </>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div onClick={() => setShowCreateModal(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-[320px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-dark">Nova Lista</h3>
              <button onClick={() => setShowCreateModal(false)} className="bg-transparent border-none cursor-pointer">
                <X size={20} className="text-gray" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray mb-2">Escolha um ícone</p>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setNewListIcon(emoji)}
                    className={`w-10 h-10 rounded-xl text-xl cursor-pointer ${
                      newListIcon === emoji
                        ? 'border-2 border-red bg-red/10'
                        : 'border-2 border-transparent bg-light-gray'
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
                onChange={e => setNewListName(e.target.value)}
                placeholder="Ex: Com a Equipe do Trabalho"
                className="w-full p-3 px-4 rounded-xl border border-black/10 text-base outline-none"
              />
            </div>

            <button
              onClick={handleCreateList}
              disabled={!newListName.trim()}
              className={`w-full py-3.5 border-none rounded-xl text-base font-semibold cursor-pointer ${
                newListName.trim() ? 'bg-red text-white' : 'bg-light-gray text-gray cursor-not-allowed'
              }`}
            >
              Criar Lista
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Restaurant Card Sub-component
interface RestaurantCardProps {
  restaurant: SavedRestaurant;
  listType: string | null;
  onClick: () => void;
  onMarkVisited: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant, listType, onClick, onMarkVisited, onTouchStart, onTouchEnd,
}) => {
  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      className="flex bg-white rounded-2xl overflow-hidden mb-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      {/* Image */}
      <div
        onClick={onClick}
        className="w-[100px] min-h-[100px] bg-light-gray bg-cover bg-center cursor-pointer relative"
        style={{ backgroundImage: restaurant.restaurant_image ? `url(${restaurant.restaurant_image})` : 'none' }}
      >
        {restaurant.reminder_enabled && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red flex items-center justify-center">
            <Bell size={12} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div onClick={onClick} className="cursor-pointer">
          <h3 className="text-base font-semibold text-dark mb-1">{restaurant.restaurant_name}</h3>

          <div className="flex items-center gap-2 mb-1.5">
            {restaurant.personal_rating ? (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray">Minha nota:</span>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={12}
                    fill={i <= restaurant.personal_rating! ? '#FFD60A' : 'transparent'}
                    color={i <= restaurant.personal_rating! ? '#FFD60A' : '#ddd'}
                  />
                ))}
              </div>
            ) : restaurant.restaurant_rating && (
              <div className="flex items-center gap-1">
                <Star size={12} fill="#FFD60A" color="#FFD60A" />
                <span className="text-sm text-dark">{restaurant.restaurant_rating}</span>
              </div>
            )}
            {restaurant.restaurant_price && (
              <span className="text-sm text-gray">{restaurant.restaurant_price}</span>
            )}
          </div>

          {restaurant.context_tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {restaurant.context_tags.map((tag, i) => (
                <span key={i} className="py-0.5 px-2 bg-red/10 rounded-md text-[0.7rem] text-red">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {restaurant.personal_note && (
            <p className="text-xs text-gray italic mt-1">"{restaurant.personal_note}"</p>
          )}
        </div>

        {listType === 'to_try' && !restaurant.visited && (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkVisited(); }}
            className="mt-2 py-2 px-3 bg-red text-white border-none rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check size={16} />
            Já fui!
          </button>
        )}

        {listType === 'favorites' && restaurant.visit_count > 0 && (
          <p className="text-xs text-gray mt-1">Visitado {restaurant.visit_count}x</p>
        )}
      </div>
    </div>
  );
};