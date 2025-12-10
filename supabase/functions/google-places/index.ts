// supabase/functions/google-places/index.ts
// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Buscar restaurante por nome/endereço
async function searchPlace(query: string, location?: string) {
  const searchQuery = location ? `${query} ${location}` : query;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&type=restaurant&language=pt-BR&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK" && data.results.length > 0) {
    return data.results[0];
  }
  return null;
}

// Buscar detalhes completos pelo place_id
async function getPlaceDetails(placeId: string) {
  const fields = [
    "place_id",
    "name",
    "formatted_address",
    "formatted_phone_number",
    "international_phone_number",
    "website",
    "url",
    "rating",
    "user_ratings_total",
    "price_level",
    "photos",
    "opening_hours",
    "reviews",
    "geometry",
    "types",
  ].join(",");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&language=pt-BR&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK") {
    return data.result;
  }
  return null;
}

// Gerar URL da foto
function getPhotoUrl(photoReference: string, maxWidth = 800): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, query, location, place_id } = await req.json();

    if (!GOOGLE_API_KEY) {
      throw new Error("Google API key not configured");
    }

    let result = null;

    switch (action) {
      case "search": {
        if (!query) {
          throw new Error("Query is required for search");
        }
        const place = await searchPlace(query, location);
        if (place) {
          result = {
            place_id: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            total_ratings: place.user_ratings_total,
            price_level: place.price_level,
            is_open: place.opening_hours?.open_now,
            location: place.geometry?.location,
            photo_url: place.photos?.[0]
              ? getPhotoUrl(place.photos[0].photo_reference)
              : null,
          };
        }
        break;
      }

      case "details": {
        if (!place_id) {
          throw new Error("place_id is required for details");
        }
        const details = await getPlaceDetails(place_id);
        if (details) {
          result = {
            place_id: details.place_id,
            name: details.name,
            address: details.formatted_address,
            phone: details.formatted_phone_number,
            phone_international: details.international_phone_number,
            website: details.website,
            google_maps_url: details.url,
            rating: details.rating,
            total_ratings: details.user_ratings_total,
            price_level: details.price_level,
            is_open: details.opening_hours?.open_now,
            hours: details.opening_hours?.weekday_text,
            location: details.geometry?.location,
            types: details.types,
            photos: details.photos?.slice(0, 10).map((p: { photo_reference: string }) => ({
              url: getPhotoUrl(p.photo_reference),
              url_large: getPhotoUrl(p.photo_reference, 1600),
            })),
            reviews: details.reviews?.slice(0, 5).map((r: { author_name: string; rating: number; text: string; time: number; profile_photo_url: string }) => ({
              author: r.author_name,
              rating: r.rating,
              text: r.text,
              time: r.time,
              photo: r.profile_photo_url,
            })),
          };
        }
        break;
      }

      case "search_and_details": {
        if (!query) {
          throw new Error("Query is required");
        }
        const place = await searchPlace(query, location);
        if (place) {
          const details = await getPlaceDetails(place.place_id);
          if (details) {
            result = {
              place_id: details.place_id,
              name: details.name,
              address: details.formatted_address,
              phone: details.formatted_phone_number,
              phone_international: details.international_phone_number,
              website: details.website,
              google_maps_url: details.url,
              rating: details.rating,
              total_ratings: details.user_ratings_total,
              price_level: details.price_level,
              is_open: details.opening_hours?.open_now,
              hours: details.opening_hours?.weekday_text,
              location: details.geometry?.location,
              types: details.types,
              photos: details.photos?.slice(0, 10).map((p: { photo_reference: string }) => ({
                url: getPhotoUrl(p.photo_reference),
                url_large: getPhotoUrl(p.photo_reference, 1600),
              })),
              reviews: details.reviews?.slice(0, 5).map((r: { author_name: string; rating: number; text: string; time: number; profile_photo_url: string }) => ({
                author: r.author_name,
                rating: r.rating,
                text: r.text,
                time: r.time,
                photo: r.profile_photo_url,
              })),
            };
          }
        }
        break;
      }

      default:
        throw new Error("Invalid action. Use: search, details, or search_and_details");
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    const error = err as Error;
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});