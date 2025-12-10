import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  MessageCircle, 
  MapPin,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewWithDetails {
  id: string;
  title: string | null;
  text: string | null;
  rating_overall: number | null;
  rating_proposta: number | null;
  rating_comida: number | null;
  rating_apresentacao: number | null;
  rating_atendimento: number | null;
  photos: string[] | null;
  likes_count: number;
  created_at: string;
  user: {
    id: string;
    name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
  restaurant: {
    id: string;
    name: string;
    neighborhood: string | null;
    cover_image: string | null;
  };
}

export const ActivityFeed: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          title,
          text,
          rating_overall,
          rating_proposta,
          rating_comida,
          rating_apresentacao,
          rating_atendimento,
          photos,
          likes_count,
          created_at,
          profiles!reviews_user_id_fkey (
            id,
            name,
            avatar_url,
            username
          ),
          restaurants!reviews_restaurant_id_fkey (
            id,
            name,
            neighborhood,
            cover_image
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedReviews = (data || []).map((review: any) => ({
        ...review,
        user: review.profiles || { id: '', name: 'Usuário', avatar_url: null, username: null },
        restaurant: review.restaurants || { id: '', name: 'Restaurante', neighborhood: null, cover_image: null },
      }));

      setReviews(formattedReviews);
    } catch (err) {
      console.error('Erro ao buscar reviews:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="text-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-cream/95 backdrop-blur-md p-4 border-b border-black/5 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-display text-dark">Atividade</h1>
          <button
            onClick={() => fetchReviews(true)}
            disabled={refreshing}
            className="w-10 h-10 rounded-full border-none bg-black/5 cursor-pointer flex items-center justify-center"
          >
            <RefreshCw size={20} className={`text-dark ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Feed */}
      <div className="p-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📝</span>
            <h2 className="text-xl font-bold text-dark mb-2">Nenhum review ainda</h2>
            <p className="text-gray mb-6">Seja o primeiro a compartilhar uma experiência!</p>
            <button
              onClick={() => navigate('/new-review')}
              className="py-3 px-6 bg-red text-white border-none rounded-xl font-semibold cursor-pointer"
            >
              Criar Review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                onRestaurantClick={() => navigate(`/restaurant/${review.restaurant.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Card de Review
interface ReviewCardProps {
  review: ReviewWithDetails;
  onRestaurantClick: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onRestaurantClick }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(review.likes_count || 0);
  const [imageIndex, setImageIndex] = useState(0);

  const photos = review.photos || [];
  const hasPhotos = photos.length > 0;

  const handleLike = async () => {
    // Toggle visual imediato
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    // TODO: Implementar like no banco
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Header do Card */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-light-gray overflow-hidden">
          {review.user.avatar_url ? (
            <img 
              src={review.user.avatar_url} 
              alt={review.user.name || 'Usuário'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray">
              {(review.user.name || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-dark text-sm">
            {review.user.name || review.user.username || 'Usuário'}
          </p>
          <p className="text-xs text-gray">{formatTime(review.created_at)}</p>
        </div>
        {review.rating_overall && (
          <div className="flex items-center gap-1 bg-red/10 px-2.5 py-1 rounded-full">
            <Star size={14} fill="#FF3B30" className="text-red" />
            <span className="text-sm font-bold text-red">
              {typeof review.rating_overall === 'number' 
                ? review.rating_overall.toFixed(1) 
                : review.rating_overall}
            </span>
          </div>
        )}
      </div>

      {/* Restaurante */}
      <button 
        onClick={onRestaurantClick}
        className="w-full px-4 pb-3 flex items-center gap-2 text-left bg-transparent border-none cursor-pointer"
      >
        <MapPin size={14} className="text-red" />
        <span className="text-sm text-red font-medium">{review.restaurant.name}</span>
        {review.restaurant.neighborhood && (
          <span className="text-xs text-gray">• {review.restaurant.neighborhood}</span>
        )}
      </button>

      {/* Foto */}
      {hasPhotos && (
        <div className="relative">
          <img
            src={photos[imageIndex]}
            alt="Review"
            className="w-full aspect-square object-cover"
          />
          {photos.length > 1 && (
            <>
              {/* Indicadores */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === imageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              {/* Áreas de toque para navegação */}
              <div 
                className="absolute inset-y-0 left-0 w-1/3"
                onClick={() => setImageIndex(prev => prev > 0 ? prev - 1 : photos.length - 1)}
              />
              <div 
                className="absolute inset-y-0 right-0 w-1/3"
                onClick={() => setImageIndex(prev => prev < photos.length - 1 ? prev + 1 : 0)}
              />
            </>
          )}
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-4">
        {/* Título */}
        {review.title && (
          <h3 className="font-bold text-dark mb-2">{review.title}</h3>
        )}

        {/* Texto */}
        {review.text && (
          <p className="text-sm text-gray leading-relaxed mb-3 line-clamp-3">
            {review.text}
          </p>
        )}

        {/* Ratings breakdown */}
        {(review.rating_proposta || review.rating_comida || review.rating_apresentacao || review.rating_atendimento) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {review.rating_proposta && (
              <RatingBadge label="Proposta" value={review.rating_proposta} />
            )}
            {review.rating_comida && (
              <RatingBadge label="Comida" value={review.rating_comida} />
            )}
            {review.rating_apresentacao && (
              <RatingBadge label="Apresentação" value={review.rating_apresentacao} />
            )}
            {review.rating_atendimento && (
              <RatingBadge label="Atendimento" value={review.rating_atendimento} />
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-4 pt-2 border-t border-black/5">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
          >
            <Heart 
              size={20} 
              fill={liked ? '#FF3B30' : 'transparent'} 
              className={liked ? 'text-red' : 'text-gray'} 
            />
            <span className={`text-sm ${liked ? 'text-red font-medium' : 'text-gray'}`}>
              {likesCount > 0 ? likesCount : 'Curtir'}
            </span>
          </button>
          <button className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0">
            <MessageCircle size={20} className="text-gray" />
            <span className="text-sm text-gray">Comentar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Badge de rating individual
const RatingBadge: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center gap-1 bg-light-gray px-2 py-1 rounded-full">
    <span className="text-xs text-gray">{label}</span>
    <Star size={10} fill="#FFD60A" className="text-yellow-400" />
    <span className="text-xs font-medium text-dark">{value}</span>
  </div>
);

export default ActivityFeed;