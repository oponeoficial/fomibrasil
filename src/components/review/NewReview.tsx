import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Camera, 
  Image as ImageIcon, 
  Search, 
  Star,
  Loader2,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store';

interface Restaurant {
  id: string;
  name: string;
  neighborhood: string | null;
  cover_image: string | null;
}

const RATING_CATEGORIES = [
  { key: 'proposta', label: 'Proposta', weight: '33.33%', description: 'Conceito e proposta do restaurante' },
  { key: 'comida', label: 'Comida', weight: '33.33%', description: 'Sabor e qualidade dos pratos' },
  { key: 'apresentacao', label: 'Apresentação', weight: '22.22%', description: 'Visual dos pratos e ambiente' },
  { key: 'atendimento', label: 'Atendimento', weight: '11.11%', description: 'Serviço e hospitalidade' },
];

export const NewReview: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [ratings, setRatings] = useState({
    proposta: 0,
    comida: 0,
    apresentacao: 0,
    atendimento: 0,
  });

  // UI state
  const [showRestaurantSearch, setShowRestaurantSearch] = useState(false);
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Buscar restaurantes
  useEffect(() => {
    const searchRestaurants = async () => {
      if (restaurantSearch.length < 2) {
        setRestaurants([]);
        return;
      }

      setSearchLoading(true);
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('id, name, neighborhood, cover_image')
          .ilike('name', `%${restaurantSearch}%`)
          .limit(10);

        if (!error && data) {
          setRestaurants(data);
        }
      } catch (err) {
        console.error('Erro ao buscar restaurantes:', err);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounce = setTimeout(searchRestaurants, 300);
    return () => clearTimeout(debounce);
  }, [restaurantSearch]);

  // Upload de foto
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('review-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('review-photos')
        .getPublicUrl(fileName);

      setPhotos(prev => [...prev, publicUrl]);
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      alert('Erro ao fazer upload da foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Remover foto
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Publicar review
  const handlePublish = async () => {
    if (!user) {
      alert('Faça login para publicar');
      return;
    }

    if (!selectedRestaurant) {
      alert('Selecione um restaurante');
      return;
    }

    if (!title.trim()) {
      alert('Adicione um título');
      return;
    }

    const hasAllRatings = Object.values(ratings).every(r => r > 0);
    if (!hasAllRatings) {
      alert('Dê nota para todas as categorias');
      return;
    }

    setPublishing(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          restaurant_id: selectedRestaurant.id,
          title: title.trim(),
          text: description.trim() || null,
          rating_proposta: ratings.proposta,
          rating_comida: ratings.comida,
          rating_apresentacao: ratings.apresentacao,
          rating_atendimento: ratings.atendimento,
          photos: photos.length > 0 ? photos : null,
        } as never);

      if (error) throw error;

      // Sucesso - ir para aba de atividade
      navigate('/activity');
    } catch (err) {
      console.error('Erro ao publicar:', err);
      alert('Erro ao publicar review');
    } finally {
      setPublishing(false);
    }
  };

  // Calcular nota geral
  const overallRating = (
    (ratings.proposta * 0.3333) +
    (ratings.comida * 0.3333) +
    (ratings.apresentacao * 0.2222) +
    (ratings.atendimento * 0.1111)
  ).toFixed(1);

  const canPublish = selectedRestaurant && title.trim() && Object.values(ratings).every(r => r > 0);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 bg-cream/95 backdrop-blur-md p-4 border-b border-black/5 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full border-none bg-black/5 cursor-pointer flex items-center justify-center"
          >
            <X size={24} className="text-dark" />
          </button>
          <h1 className="text-xl font-bold font-display text-dark">Novo Review</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <div className="p-4 pb-32">
        {/* Selecionar Restaurante */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-dark mb-2">
            Restaurante *
          </label>
          
          {selectedRestaurant ? (
            <div 
              onClick={() => setShowRestaurantSearch(true)}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-red cursor-pointer"
            >
              {selectedRestaurant.cover_image && (
                <img 
                  src={selectedRestaurant.cover_image} 
                  alt={selectedRestaurant.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-dark">{selectedRestaurant.name}</p>
                {selectedRestaurant.neighborhood && (
                  <p className="text-xs text-gray flex items-center gap-1">
                    <MapPin size={12} />
                    {selectedRestaurant.neighborhood}
                  </p>
                )}
              </div>
              <ChevronDown size={20} className="text-gray" />
            </div>
          ) : (
            <button
              onClick={() => setShowRestaurantSearch(true)}
              className="w-full p-4 bg-white rounded-xl border-2 border-dashed border-gray/30 text-gray flex items-center justify-center gap-2 hover:border-red hover:text-red transition-colors"
            >
              <Search size={20} />
              Buscar restaurante
            </button>
          )}
        </div>

        {/* Título */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-dark mb-2">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Experiência incrível!"
            className="w-full p-4 bg-white rounded-xl border-2 border-transparent focus:border-red outline-none text-base"
            maxLength={100}
          />
          <p className="text-xs text-gray mt-1 text-right">{title.length}/100</p>
        </div>

        {/* Descrição */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-dark mb-2">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Conte como foi sua experiência..."
            className="w-full p-4 bg-white rounded-xl border-2 border-transparent focus:border-red outline-none text-base resize-none"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray mt-1 text-right">{description.length}/500</p>
        </div>

        {/* Fotos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-dark mb-2">
            Fotos
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img 
                  src={photo} 
                  alt={`Foto ${index + 1}`}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red rounded-full flex items-center justify-center text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {photos.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-gray/30 flex flex-col items-center justify-center gap-1 text-gray hover:border-red hover:text-red transition-colors flex-shrink-0"
              >
                {uploadingPhoto ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <Camera size={24} />
                    <span className="text-xs">Adicionar</span>
                  </>
                )}
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Notas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-dark">
              Avaliação *
            </label>
            {Object.values(ratings).some(r => r > 0) && (
              <div className="flex items-center gap-1 bg-red/10 px-3 py-1 rounded-full">
                <Star size={14} fill="#FF3B30" className="text-red" />
                <span className="text-sm font-bold text-red">{overallRating}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {RATING_CATEGORIES.map((category) => (
              <RatingRow
                key={category.key}
                label={category.label}
                weight={category.weight}
                description={category.description}
                value={ratings[category.key as keyof typeof ratings]}
                onChange={(value) => setRatings(prev => ({ ...prev, [category.key]: value }))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Botão Publicar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-black/5">
        <button
          onClick={handlePublish}
          disabled={!canPublish || publishing}
          className={`w-full py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 ${
            canPublish
              ? 'bg-red text-white shadow-[0_4px_15px_rgba(255,59,48,0.3)]'
              : 'bg-gray/20 text-gray cursor-not-allowed'
          }`}
        >
          {publishing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Publicando...
            </>
          ) : (
            'Publicar'
          )}
        </button>
      </div>

      {/* Modal de busca de restaurante */}
      {showRestaurantSearch && (
        <div className="fixed inset-0 z-50 bg-cream">
          <header className="sticky top-0 bg-cream/95 backdrop-blur-md p-4 border-b border-black/5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRestaurantSearch(false)}
                className="w-10 h-10 rounded-full border-none bg-black/5 cursor-pointer flex items-center justify-center"
              >
                <X size={24} className="text-dark" />
              </button>
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
                <input
                  type="text"
                  value={restaurantSearch}
                  onChange={(e) => setRestaurantSearch(e.target.value)}
                  placeholder="Buscar restaurante..."
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-transparent focus:border-red outline-none"
                  autoFocus
                />
              </div>
            </div>
          </header>

          <div className="p-4">
            {searchLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="text-red animate-spin" />
              </div>
            ) : restaurants.length > 0 ? (
              <div className="space-y-2">
                {restaurants.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      setShowRestaurantSearch(false);
                      setRestaurantSearch('');
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-light-gray transition-colors text-left"
                  >
                    {restaurant.cover_image ? (
                      <img 
                        src={restaurant.cover_image} 
                        alt={restaurant.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-light-gray flex items-center justify-center">
                        <MapPin size={20} className="text-gray" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-dark">{restaurant.name}</p>
                      {restaurant.neighborhood && (
                        <p className="text-xs text-gray">{restaurant.neighborhood}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : restaurantSearch.length >= 2 ? (
              <p className="text-center text-gray py-8">
                Nenhum restaurante encontrado
              </p>
            ) : (
              <p className="text-center text-gray py-8">
                Digite pelo menos 2 caracteres para buscar
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de linha de rating
interface RatingRowProps {
  label: string;
  weight: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

const RatingRow: React.FC<RatingRowProps> = ({ label, weight, description, value, onChange }) => {
  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-medium text-dark">{label}</span>
          <span className="text-xs text-gray ml-2">({weight})</span>
        </div>
        {value > 0 && (
          <span className="text-sm font-bold text-red">{value}/5</span>
        )}
      </div>
      <p className="text-xs text-gray mb-3">{description}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="flex-1 py-2 rounded-lg transition-all"
          >
            <Star
              size={24}
              fill={star <= value ? '#FF3B30' : 'transparent'}
              className={star <= value ? 'text-red mx-auto' : 'text-gray/30 mx-auto'}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewReview;