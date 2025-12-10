/**
 * Script para preencher cover_image dos restaurantes com fotos do Google Places
 * 
 * Uso: npx ts-node scripts/fill-restaurant-covers.ts
 * Ou:  npx tsx scripts/fill-restaurant-covers.ts
 */

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = 'https://mqnrsxyfecsnbyaiopnl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbnJzeHlmZWNzbmJ5YWlvcG5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg5MjcwMiwiZXhwIjoyMDgwNDY4NzAyfQ.QSK-S64idCtfJl0giJvRuM_VkAyo1iZ06lsbcw8f4xA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Restaurant {
  id: string;
  name: string;
  city: string | null;
  cover_image: string | null;
}

async function fetchGooglePlacePhoto(name: string, city: string): Promise<string | null> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/google-places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        action: 'search',
        query: name,
        location: city,
      }),
    });

    const data = await response.json();

    if (data.success && data.data?.photo_url) {
      return data.data.photo_url;
    }

    return null;
  } catch (error) {
    console.error(`Erro ao buscar foto para ${name}:`, error);
    return null;
  }
}

async function main() {
  console.log('🍽️  Iniciando preenchimento de fotos dos restaurantes...\n');

  // 1. Buscar restaurantes sem cover_image
  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('id, name, city, cover_image')
    .is('cover_image', null);

  if (error) {
    console.error('❌ Erro ao buscar restaurantes:', error.message);
    return;
  }

  if (!restaurants || restaurants.length === 0) {
    console.log('✅ Todos os restaurantes já têm cover_image!');
    return;
  }

  console.log(`📋 Encontrados ${restaurants.length} restaurantes sem foto\n`);

  let successCount = 0;
  let failCount = 0;

  // 2. Para cada restaurante, buscar foto e atualizar
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i] as Restaurant;
    const city = restaurant.city || 'Recife';

    console.log(`[${i + 1}/${restaurants.length}] Buscando: ${restaurant.name}...`);

    // Buscar foto do Google
    const photoUrl = await fetchGooglePlacePhoto(restaurant.name, city);

    if (photoUrl) {
      // Atualizar no banco
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({ cover_image: photoUrl })
        .eq('id', restaurant.id);

      if (updateError) {
        console.log(`   ❌ Erro ao salvar: ${updateError.message}`);
        failCount++;
      } else {
        console.log(`   ✅ Foto salva!`);
        successCount++;
      }
    } else {
      console.log(`   ⚠️  Foto não encontrada`);
      failCount++;
    }

    // Delay para não sobrecarregar a API (500ms entre requests)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n========================================');
  console.log(`✅ Sucesso: ${successCount} restaurantes`);
  console.log(`❌ Falhas: ${failCount} restaurantes`);
  console.log('========================================\n');
}

main().catch(console.error);