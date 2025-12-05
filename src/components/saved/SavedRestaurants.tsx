import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Plus, Star, Bell, BellOff, Send, Trash2, Check, X, Filter, Loader2 
} from 'lucide-react';
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

export const SavedRestaurants: React.FC<SavedRestaurantsProps> = ({
  userId,
  onBack,
  onRestaurantClick,
}) => {
  const {
    lists,
    loading,
    markAsVisited,
    createList,
    removeRestaurant,
    toggleReminder,
    getRestaurantsByList,
    getListCounts,
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

  // Definir lista ativa inicial
  useEffect(() => {
    if (lists.length > 0 && !activeListId) {
      const toTry = lists.find(l => l.system_type === 'to_try');
      setActiveListId(toTry?.id || lists[0].id);
    }
  }, [lists, activeListId]);

  const activeList = lists.find(l => l.id === activeListId);
  const activeRestaurants = activeListId ? getRestaurantsByList(activeListId) : [];

  // Ordenar restaurantes
  const sortedRestaurants = [...activeRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.personal_rating || b.restaurant_rating || 0) - (a.personal_rating || a.restaurant_rating || 0);
      case 'visits':
        return b.visit_count - a.visit_count;
      case 'nearest':
        return 0; // TODO: implementar com geolocalização
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Long press handlers
  const handleTouchStart = (restaurant: SavedRestaurant, e: React.TouchEvent) => {
    const touch = e.touches[0];
    longPressTimer.current = setTimeout(() => {
      setContextMenu({ restaurant, x: touch.clientX, y: touch.clientY });
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // Criar nova lista
  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    await createList(newListName, newListIcon);
    setNewListName('');
    setNewListIcon('📁');
    setShowCreateModal(false);
  };

  // Avaliar
  const handleRating = async (rating: number) => {
    if (!showRatingModal) return;
    await markAsVisited(showRatingModal.id, rating, rating >= 4);
    setShowRatingModal(null);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color="var(--color-red)" className="animate-spin" />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
      </div>
    );
  }

  // Not logged in
  if (!userId) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</span>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-dark)' }}>Faça login para acessar</h2>
        <p style={{ color: 'var(--color-gray)', marginBottom: '24px' }}>Seus restaurantes salvos estarão disponíveis após o login.</p>
        <button onClick={onBack} style={{ padding: '12px 24px', backgroundColor: 'var(--color-red)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(255, 248, 240, 0.95)', backdropFilter: 'blur(12px)', padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button onClick={onBack} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={24} color="var(--color-dark)" />
          </button>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-dark)' }}>Restaurantes Salvos</h1>
          <button onClick={() => setShowCreateModal(true)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-red)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255, 59, 48, 0.3)' }}>
            <Plus size={20} color="#fff" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '20px', border: 'none',
                backgroundColor: activeListId === list.id ? 'var(--color-red)' : '#fff',
                color: activeListId === list.id ? '#fff' : 'var(--color-dark)',
                fontSize: '0.9rem', fontWeight: activeListId === list.id ? 600 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s ease',
              }}
            >
              <span>{list.icon}</span>
              <span>{list.name}</span>
              {counts[list.id] > 0 && (
                <span style={{ backgroundColor: activeListId === list.id ? 'rgba(255,255,255,0.3)' : 'var(--color-light-gray)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>
                  {counts[list.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Sort Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'relative' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>{sortedRestaurants.length} {sortedRestaurants.length === 1 ? 'restaurante' : 'restaurantes'}</p>
        <button onClick={() => setShowSortMenu(!showSortMenu)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: 'var(--color-light-gray)', border: 'none', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--color-dark)', cursor: 'pointer' }}>
          <Filter size={14} />
          {sortOptions.find(o => o.id === sortBy)?.label}
        </button>

        {/* Sort Dropdown */}
        {showSortMenu && (
          <div style={{ position: 'absolute', right: '16px', top: '50px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 20, overflow: 'hidden' }}>
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => { setSortBy(option.id); setShowSortMenu(false); }}
                style={{ display: 'block', width: '100%', padding: '12px 20px', backgroundColor: sortBy === option.id ? 'rgba(255, 59, 48, 0.1)' : 'transparent', border: 'none', textAlign: 'left', fontSize: '0.9rem', color: sortBy === option.id ? 'var(--color-red)' : 'var(--color-dark)', cursor: 'pointer' }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Restaurant List */}
      <div style={{ padding: '16px' }}>
        {sortedRestaurants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-gray)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>{activeList?.icon || '📭'}</span>
            <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '8px', color: 'var(--color-dark)' }}>Nenhum restaurante aqui ainda</p>
            <p style={{ fontSize: '0.85rem' }}>{activeList?.system_type === 'to_try' ? 'Salve restaurantes que quer experimentar!' : 'Adicione restaurantes a esta lista.'}</p>
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
        <div onClick={() => setShowRatingModal(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-dark)' }}>O que achou?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray)', marginBottom: '20px' }}>{showRatingModal.restaurant_name}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              {[{ r: 1, e: '😞' }, { r: 2, e: '😕' }, { r: 3, e: '😐' }, { r: 4, e: '😊' }, { r: 5, e: '🤩' }].map(({ r, e }) => (
                <button key={r} onClick={() => handleRating(r)} style={{ width: '52px', height: '52px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--color-light-gray)', fontSize: '1.8rem', cursor: 'pointer' }}>
                  {e}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>⭐ 4-5 = Favoritos • ⭐ 1-2 = Remove</p>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div onClick={() => setContextMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
          <div style={{ position: 'fixed', left: Math.min(contextMenu.x, window.innerWidth - 200), top: Math.min(contextMenu.y, window.innerHeight - 180), backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: 200, overflow: 'hidden', minWidth: '180px' }}>
            <button onClick={async () => { await toggleReminder(contextMenu.restaurant.id, !contextMenu.restaurant.reminder_enabled); setContextMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'left', fontSize: '0.9rem', color: 'var(--color-dark)', cursor: 'pointer' }}>
              {contextMenu.restaurant.reminder_enabled ? <BellOff size={18} /> : <Bell size={18} />}
              {contextMenu.restaurant.reminder_enabled ? 'Desativar lembrete' : 'Definir lembrete'}
            </button>
            <button onClick={() => { if (navigator.share) navigator.share({ title: contextMenu.restaurant.restaurant_name, text: `Vamos aqui? ${contextMenu.restaurant.restaurant_name}` }); setContextMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)', textAlign: 'left', fontSize: '0.9rem', color: 'var(--color-dark)', cursor: 'pointer' }}>
              <Send size={18} />
              Convidar amigo
            </button>
            <button onClick={async () => { await removeRestaurant(contextMenu.restaurant.id); setContextMenu(null); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px 16px', backgroundColor: 'transparent', border: 'none', textAlign: 'left', fontSize: '0.9rem', color: 'var(--color-red)', cursor: 'pointer' }}>
              <Trash2 size={18} />
              Remover
            </button>
          </div>
        </>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div onClick={() => setShowCreateModal(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark)' }}>Nova Lista</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--color-gray)" /></button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '8px' }}>Escolha um ícone</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {emojiOptions.map(emoji => (
                  <button key={emoji} onClick={() => setNewListIcon(emoji)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: newListIcon === emoji ? '2px solid var(--color-red)' : '2px solid transparent', backgroundColor: newListIcon === emoji ? 'rgba(255, 59, 48, 0.1)' : 'var(--color-light-gray)', fontSize: '1.2rem', cursor: 'pointer' }}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '8px' }}>Nome da lista</p>
              <input type="text" value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="Ex: Com a Equipe do Trabalho" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button onClick={handleCreateList} disabled={!newListName.trim()} style={{ width: '100%', padding: '14px', backgroundColor: newListName.trim() ? 'var(--color-red)' : 'var(--color-light-gray)', color: newListName.trim() ? '#fff' : 'var(--color-gray)', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: newListName.trim() ? 'pointer' : 'not-allowed' }}>
              Criar Lista
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// RESTAURANT CARD
// ========================================

interface RestaurantCardProps {
  restaurant: SavedRestaurant;
  listType: string | null;
  onClick: () => void;
  onMarkVisited: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, listType, onClick, onMarkVisited, onTouchStart, onTouchEnd }) => {
  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd} style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Image */}
      <div onClick={onClick} style={{ width: '100px', minHeight: '100px', backgroundColor: 'var(--color-light-gray)', backgroundImage: restaurant.restaurant_image ? `url(${restaurant.restaurant_image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', position: 'relative' }}>
        {restaurant.reminder_enabled && (
          <div style={{ position: 'absolute', top: '8px', left: '8px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={12} color="#fff" />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: '4px' }}>{restaurant.restaurant_name}</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            {restaurant.personal_rating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray)' }}>Minha nota:</span>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={12} fill={i <= restaurant.personal_rating! ? '#FFD60A' : 'transparent'} color={i <= restaurant.personal_rating! ? '#FFD60A' : '#ddd'} />
                ))}
              </div>
            ) : restaurant.restaurant_rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={12} fill="#FFD60A" color="#FFD60A" />
                <span style={{ fontSize: '0.85rem', color: 'var(--color-dark)' }}>{restaurant.restaurant_rating}</span>
              </div>
            )}
            {restaurant.restaurant_price && <span style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>{restaurant.restaurant_price}</span>}
          </div>

          {/* Context Tags */}
          {restaurant.context_tags.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {restaurant.context_tags.map((tag, i) => (
                <span key={i} style={{ padding: '2px 8px', backgroundColor: 'rgba(255, 59, 48, 0.1)', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--color-red)' }}>{tag}</span>
              ))}
            </div>
          )}

          {/* Personal Note */}
          {restaurant.personal_note && <p style={{ fontSize: '0.8rem', color: 'var(--color-gray)', fontStyle: 'italic', marginTop: '4px' }}>"{restaurant.personal_note}"</p>}
        </div>

        {/* Action Button - "Para Experimentar" */}
        {listType === 'to_try' && !restaurant.visited && (
          <button onClick={(e) => { e.stopPropagation(); onMarkVisited(); }} style={{ marginTop: '8px', padding: '8px 12px', backgroundColor: 'var(--color-red)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Check size={16} />
            Já fui!
          </button>
        )}

        {/* Visit Count for Favorites */}
        {listType === 'favorites' && restaurant.visit_count > 0 && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginTop: '4px' }}>Visitado {restaurant.visit_count}x</p>
        )}
      </div>
    </div>
  );
};