/**
 * Hook para buscar dados do Google Places
 * Retorna fotos, endereço, telefone, website, horários
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GooglePlacePhoto {
  url: string;
  url_large: string;
}

interface GooglePlaceData {
  place_id: string;
  name: string;
  address: string;
  phone: string | null;
  phone_international: string | null;
  website: string | null;
  google_maps_url: string | null;
  is_open: boolean | null;
  hours: string[] | null;
  location: { lat: number; lng: number } | null;
  types: string[] | null;
  photos: GooglePlacePhoto[] | null;
}

interface UseGooglePlacesResult {
  data: GooglePlaceData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGooglePlaces(
  restaurantName: string,
  city?: string
): UseGooglePlacesResult {
  const [data, setData] = useState<GooglePlaceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaceData = async () => {
    if (!restaurantName) return;

    setLoading(true);
    setError(null);

    try {
      const location = city || 'Recife';
      
      const { data: response, error: fnError } = await supabase.functions.invoke(
        'google-places',
        {
          body: {
            action: 'search_and_details',
            query: restaurantName,
            location,
          },
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (response?.success && response?.data) {
        setData(response.data);
      } else {
        setError(response?.error || 'Restaurante não encontrado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar dados';
      setError(errorMessage);
      console.error('useGooglePlaces error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaceData();
  }, [restaurantName, city]);

  return {
    data,
    loading,
    error,
    refetch: fetchPlaceData,
  };
}