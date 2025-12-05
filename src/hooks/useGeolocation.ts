import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { NearbyRestaurant } from '../types/database';

interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GeoState {
  position: GeoPosition | null;
  loading: boolean;
  error: GeolocationPositionError | Error | null;
  permissionStatus: PermissionState | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes cache
};

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  
  const [state, setState] = useState<GeoState>({
    position: null,
    loading: true,
    error: null,
    permissionStatus: null,
  });

  // Check permission status
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setState(prev => ({ ...prev, permissionStatus: result.state }));
        result.onchange = () => {
          setState(prev => ({ ...prev, permissionStatus: result.state }));
        };
      });
    }
  }, []);

  // Get current position
  const getCurrentPosition = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: new Error('Geolocation not supported'),
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
          loading: false,
          error: null,
          permissionStatus: 'granted',
        });
      },
      (error) => {
        setState(prev => ({ ...prev, loading: false, error }));
      },
      opts
    );
  }, [opts.enableHighAccuracy, opts.timeout, opts.maximumAge]);

  // Initial fetch
  useEffect(() => {
    getCurrentPosition();
  }, []);

  // Watch position (continuous updates)
  const watchPosition = useCallback(() => {
    if (!('geolocation' in navigator)) return null;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState(prev => ({
          ...prev,
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
          error: null,
        }));
      },
      (error) => {
        setState(prev => ({ ...prev, error }));
      },
      opts
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [opts.enableHighAccuracy, opts.timeout, opts.maximumAge]);

  return {
    ...state,
    getCurrentPosition,
    watchPosition,
    isSupported: 'geolocation' in navigator,
  };
}

// Hook for nearby restaurants
interface NearbyOptions {
  radiusKm?: number;
  limit?: number;
}

export function useNearbyRestaurants(options: NearbyOptions = {}) {
  const { radiusKm = 5, limit = 20 } = options;
  const { position, loading: geoLoading, error: geoError } = useGeolocation();

  const [restaurants, setRestaurants] = useState<NearbyRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNearby = useCallback(async () => {
    if (!position) return;

    setLoading(true);
    setError(null);

    const { data, error: dbError } = await supabase.rpc('nearby_restaurants', {
      user_lat: position.latitude,
      user_lng: position.longitude,
      radius_km: radiusKm,
      limit_count: limit,
    });

    if (dbError) {
      setError(new Error(dbError.message));
      setLoading(false);
      return;
    }

    setRestaurants(data || []);
    setLoading(false);
  }, [position, radiusKm, limit]);

  useEffect(() => {
    if (position && !geoLoading) {
      fetchNearby();
    }
  }, [position, geoLoading, fetchNearby]);

  return {
    restaurants,
    loading: geoLoading || loading,
    error: geoError || error,
    position,
    refetch: fetchNearby,
  };
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}