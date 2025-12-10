import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RestaurantDetails } from '../components/restaurant/RestaurantDetails';
import { Restaurant } from '../types';

const RestaurantPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Mapear para o tipo Restaurant
        const mapped: Restaurant = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          longDescription: data.long_description,
          image: data.cover_image || '/placeholder-restaurant.jpg',
          cover_image: data.cover_image,
          gallery: data.gallery || [],
          rating: data.rating_avg || 0,
          reviewCount: data.reviews_count || 0,
          price: data.price_range ? '$'.repeat(data.price_range) : '$$',
          priceRange: data.price_range || 2,
          distance: '',
          address: data.address || `${data.neighborhood || ''}, ${data.city || ''}`.replace(/^, |, $/g, ''),
          neighborhood: data.neighborhood,
          city: data.city,
          hours: null,
          phone: data.phone || '',
          website: data.website || '',
          features: data.features || [],
          cuisineTypes: data.cuisine_types || [],
          tags: (data.cuisine_types || []).map((cuisine: string, i: number) => ({
            text: cuisine,
            color: (['red', 'green', 'blue', 'orange', 'purple'] as const)[i % 5],
          })),
          ratingsBreakdown: {
            proposta: data.rating_proposta || 0,
            comida: data.rating_comida || 0,
            apresentacao: data.rating_apresentacao || 0,
            atendimento: data.rating_atendimento || 0,
          },
        };

        setRestaurant(mapped);

        // Verificar se está salvo
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: saved } = await supabase
            .from('saved_restaurants')
            .select('id')
            .eq('user_id', user.id)
            .eq('restaurant_id', id)
            .limit(1);

          setIsSaved(Array.isArray(saved) && saved.length > 0);
        }
      } catch (err) {
        console.error('Erro ao buscar restaurante:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleSave = async () => {
    // TODO: Abrir modal de listas
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="text-red animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <span className="text-6xl mb-4">🍽️</span>
        <h2 className="text-xl font-bold mb-2 text-dark">Restaurante não encontrado</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 py-3 px-6 bg-red text-white rounded-xl font-semibold"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <RestaurantDetails
      restaurant={restaurant}
      onClose={() => navigate(-1)}
      onSave={handleSave}
      isSaved={isSaved}
    />
  );
};

export default RestaurantPage;