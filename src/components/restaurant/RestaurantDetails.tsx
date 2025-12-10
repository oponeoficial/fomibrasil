import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus,
  Share2, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  Navigation,
  Loader2,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import { Restaurant } from '../../types';
import { useGooglePlaces } from '../../hooks/useGooglePlaces';
import { SaveToListModal } from './SaveToListModal';
import { supabase } from '../../lib/supabase';

interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onClose: () => void;
  onSave?: (id: string | number) => void;
  isSaved?: boolean;
}

export const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ 
  restaurant, 
  onClose,
}) => {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSavedToAnyList, setIsSavedToAnyList] = useState(false);
  const [isInWantToGo, setIsInWantToGo] = useState(false);
  const [savingWantToGo, setSavingWantToGo] = useState(false);
  
  // Buscar dados do Google Places
  const { data: googleData, loading: googleLoading } = useGooglePlaces(
    restaurant.name,
    restaurant.city || 'Recife'
  );

  // Verificar se está salvo em alguma lista e na lista "Quero ir"
  useEffect(() => {
    let mounted = true;

    const checkSavedStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !mounted) return;

        // Verificar se está em alguma lista
        const { data: saved } = await supabase
          .from('saved_restaurants')
          .select('list_id, saved_lists!inner(system_type)')
          .eq('user_id', user.id)
          .eq('restaurant_id', restaurant.id);

        if (mounted && saved && saved.length > 0) {
          setIsSavedToAnyList(true);
          // Verificar se está na lista "Quero ir" (want_to_go)
          const inWantToGo = saved.some((s: { saved_lists: { system_type: string | null } }) => 
            s.saved_lists?.system_type === 'want_to_go'
          );
          setIsInWantToGo(inWantToGo);
        }
      } catch (err) {
        console.error('Erro ao verificar status:', err);
      }
    };

    checkSavedStatus();
    return () => { mounted = false; };
  }, [restaurant.id]);

  // Usar fotos do Google se disponíveis, senão usar as do banco
  const googlePhotos = googleData?.photos?.map(p => p.url).filter((url): url is string => !!url) || [];
  const restaurantGallery = restaurant.gallery?.filter((url): url is string => !!url) || [];
  const fallbackImage = restaurant.image || '/placeholder-restaurant.jpg';
  
  const gallery: string[] = googlePhotos.length > 0 
    ? googlePhotos 
    : restaurantGallery.length > 0 
      ? restaurantGallery 
      : [fallbackImage];

  // Dados combinados (Google + banco local)
  const address = googleData?.address || restaurant.address;
  const phone = googleData?.phone || restaurant.phone;
  const website = googleData?.website || restaurant.website;
  const hours = googleData?.hours;
  const isOpen = googleData?.is_open;
  const googleMapsUrl = googleData?.google_maps_url;

  const handleOpenMaps = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  const handleCall = () => {
    if (phone) {
      window.open(`tel:${phone.replace(/\D/g, '')}`, '_self');
    }
  };

  const handleOpenWebsite = () => {
    if (website) {
      window.open(website, '_blank');
    }
  };

  const handleWantToGo = async () => {
    if (savingWantToGo) return;
    
    setSavingWantToGo(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Faça login para salvar restaurantes');
        return;
      }

      if (isInWantToGo) {
        // Remover da lista "Quero ir"
        const { data: wantToGoList } = await supabase
          .from('saved_lists')
          .select('id')
          .eq('user_id', user.id)
          .eq('system_type', 'want_to_go')
          .single();

        if (wantToGoList) {
          await supabase
            .from('saved_restaurants')
            .delete()
            .eq('user_id', user.id)
            .eq('restaurant_id', restaurant.id)
            .eq('list_id', wantToGoList.id);
        }
        setIsInWantToGo(false);
      } else {
        // Adicionar à lista "Quero ir"
        const { data: existingList } = await supabase
          .from('saved_lists')
          .select('id')
          .eq('user_id', user.id)
          .eq('system_type', 'want_to_go')
          .single();

        let listId = existingList?.id;

        // Se não existir, criar
        if (!listId) {
          const { data: newList } = await supabase
            .from('saved_lists')
            .insert({
              user_id: user.id,
              name: 'Quero ir',
              icon: '🏃',
              is_system: true,
              system_type: 'want_to_go',
              sort_order: 1,
            })
            .select('id')
            .single();
          listId = newList?.id;
        }

        if (listId) {
          await supabase
            .from('saved_restaurants')
            .upsert({
              user_id: user.id,
              restaurant_id: restaurant.id,
              list_id: listId,
            }, { onConflict: 'user_id,restaurant_id,list_id' });
        }
        setIsInWantToGo(true);
        setIsSavedToAnyList(true);
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setSavingWantToGo(false);
    }
  };

  const handleSaved = () => {
    setIsSavedToAnyList(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-cream overflow-y-auto animate-slideUp">
        {/* Gallery */}
        <div className="relative h-[280px]">
          {googleLoading ? (
            <div className="w-full h-full bg-gray/10 flex items-center justify-center">
              <Loader2 size={32} className="text-gray animate-spin" />
            </div>
          ) : (
            <img
              src={gallery[galleryIndex] || '/placeholder-restaurant.jpg'}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          )}

          {/* Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-black/50 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 border-none flex items-center justify-center cursor-pointer text-white"
          >
            <X size={24} />
          </button>

          {/* Gallery Navigation */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={() => setGalleryIndex(prev => prev > 0 ? prev - 1 : gallery.length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border-none flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setGalleryIndex(prev => prev < gallery.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border-none flex items-center justify-center cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.slice(0, 10).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${i === galleryIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Open/Closed Badge */}
          {typeof isOpen === 'boolean' && (
            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isOpen ? 'bg-green-500 text-white' : 'bg-red text-white'
            }`}>
              {isOpen ? 'Aberto agora' : 'Fechado'}
            </div>
          )}
        </div>

        {/* Header */}
        <div className="p-4 bg-white border-b border-black/5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold font-display text-dark flex-1 pr-2">{restaurant.name}</h1>
            <div className="flex gap-2">
              {/* Botão + para adicionar em listas */}
              <button
                onClick={() => setShowSaveModal(true)}
                className={`w-10 h-10 rounded-full border-none flex items-center justify-center cursor-pointer transition-all ${
                  isSavedToAnyList 
                    ? 'bg-red text-white' 
                    : 'bg-light-gray text-dark'
                }`}
              >
                <Plus size={20} className={isSavedToAnyList ? 'rotate-45' : ''} />
              </button>
              <button className="w-10 h-10 rounded-full bg-light-gray border-none flex items-center justify-center cursor-pointer">
                <Share2 size={20} className="text-dark" />
              </button>
            </div>
          </div>

          {/* Ratings - usando dados do FOMÍ */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star size={14} fill="#FFD60A" className="text-yellow-400" />
              <span className="font-semibold">{restaurant.rating}</span>
              <span className="text-gray">({restaurant.reviewCount})</span>
            </div>
            <span className="text-gray">•</span>
            <span className="text-dark">{restaurant.price}</span>
            {restaurant.distance && (
              <>
                <span className="text-gray">•</span>
                <span className="text-dark">{restaurant.distance}</span>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 pb-[180px]">
          {/* Quick Actions */}
          <div className="flex gap-2 mb-5">
            {phone && (
              <button
                onClick={handleCall}
                className="flex-1 py-3 px-4 bg-light-gray rounded-xl flex items-center justify-center gap-2 text-dark text-sm font-medium"
              >
                <Phone size={18} />
                Ligar
              </button>
            )}
            {website && (
              <button
                onClick={handleOpenWebsite}
                className="flex-1 py-3 px-4 bg-light-gray rounded-xl flex items-center justify-center gap-2 text-dark text-sm font-medium"
              >
                <Globe size={18} />
                Site
              </button>
            )}
            <button
              onClick={handleOpenMaps}
              className="flex-1 py-3 px-4 bg-light-gray rounded-xl flex items-center justify-center gap-2 text-dark text-sm font-medium"
            >
              <Navigation size={18} />
              Rota
            </button>
          </div>

          {/* Info Items */}
          <div className="flex flex-col gap-3 mb-5">
            {address && (
              <InfoItem 
                icon={<MapPin size={18} />} 
                text={address}
                onClick={handleOpenMaps}
              />
            )}
            
            {/* Horários */}
            {hours && Array.isArray(hours) && hours.length > 0 ? (
              <HoursDropdown hours={hours} isOpen={isOpen ?? null} />
            ) : restaurant.hours ? (
              <InfoItem icon={<Clock size={18} />} text={String(restaurant.hours)} />
            ) : null}
            
            {phone && (
              <InfoItem 
                icon={<Phone size={18} />} 
                text={phone}
                onClick={handleCall}
              />
            )}
            
            {website && (
              <InfoItem 
                icon={<Globe size={18} />} 
                text={website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                onClick={handleOpenWebsite}
                suffix={<ExternalLink size={14} className="text-gray" />}
              />
            )}
          </div>

          {/* Features */}
          {restaurant.features && Array.isArray(restaurant.features) && restaurant.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {restaurant.features.map((feature, i) => (
                <span key={i} className="px-3 py-2 bg-light-gray rounded-full text-xs text-dark">
                  {typeof feature === 'string' ? feature : String(feature)}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {(restaurant.longDescription || restaurant.description) && (
            <div className="mb-5">
              <h3 className="text-base font-semibold mb-2 text-dark">Sobre</h3>
              <p className="text-sm leading-relaxed text-gray">
                {restaurant.longDescription || restaurant.description}
              </p>
            </div>
          )}
        </div>

        {/* Sticky Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-black/5">
          <div className="flex gap-3">
            {/* Botão Quero ir */}
            <button 
              onClick={handleWantToGo}
              disabled={savingWantToGo}
              className={`flex-1 py-4 border-2 rounded-xl text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all ${
                isInWantToGo
                  ? 'bg-red border-red text-white'
                  : 'bg-white border-red text-red'
              }`}
            >
              {savingWantToGo ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Bookmark size={20} fill={isInWantToGo ? 'white' : 'none'} />
                  {isInWantToGo ? 'Quero ir ✓' : 'Quero ir'}
                </>
              )}
            </button>
            
            {/* Botão Ver no Maps */}
            <button 
              onClick={handleOpenMaps}
              className="flex-1 py-4 bg-red text-white border-none rounded-xl text-base font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,59,48,0.3)]"
            >
              <MapPin size={20} />
              Ver no Maps
            </button>
          </div>
        </div>
      </div>

      {/* Modal de salvar em lista */}
      <SaveToListModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        onSaved={handleSaved}
      />
    </>
  );
};

// Componente InfoItem
interface InfoItemProps {
  icon: React.ReactNode;
  text: string | null | undefined;
  onClick?: () => void;
  suffix?: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, text, onClick, suffix }) => {
  const displayText = typeof text === 'object' ? JSON.stringify(text) : String(text || '');
  
  if (!displayText) return null;
  
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 text-dark text-sm ${onClick ? 'cursor-pointer hover:text-red transition-colors' : ''}`}
    >
      <span className="text-gray">{icon}</span>
      <span className="flex-1">{displayText}</span>
      {suffix}
    </div>
  );
};

// Componente para horários expansíveis
interface HoursDropdownProps {
  hours: string[] | null | undefined;
  isOpen?: boolean | null;
}

const HoursDropdown: React.FC<HoursDropdownProps> = ({ hours, isOpen }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!hours || !Array.isArray(hours) || hours.length === 0) {
    return null;
  }
  
  const validHours = hours.filter(h => typeof h === 'string');
  if (validHours.length === 0) return null;
  
  const today = new Date().getDay();
  const daysMap = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const todayName = daysMap[today];
  
  const todayHours = validHours.find(h => h.toLowerCase().includes(todayName)) || validHours[0];

  return (
    <div className="flex flex-col">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 text-dark text-sm cursor-pointer"
      >
        <span className="text-gray"><Clock size={18} /></span>
        <span className="flex-1">
          {todayHours}
          {typeof isOpen === 'boolean' && (
            <span className={`ml-2 text-xs font-medium ${isOpen ? 'text-green-500' : 'text-red'}`}>
              • {isOpen ? 'Aberto' : 'Fechado'}
            </span>
          )}
        </span>
        <ChevronRight 
          size={16} 
          className={`text-gray transition-transform ${expanded ? 'rotate-90' : ''}`} 
        />
      </div>
      
      {expanded && (
        <div className="mt-2 ml-8 flex flex-col gap-1">
          {validHours.map((hour, i) => (
            <span key={i} className="text-xs text-gray">{hour}</span>
          ))}
        </div>
      )}
    </div>
  );
};