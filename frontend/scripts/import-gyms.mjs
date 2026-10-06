import fs from 'fs';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const results = [];
const filePath = './Outscraper-20260306142950s9d_gym.csv';

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}. Please ensure the Outscraper CSV is in the root folder.`);
  process.exit(1);
}

console.log('🚀 Starting import from', filePath);

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (data) => {
    // Mapping Outscraper columns to our Supabase schema
    const gym = {
      name: data.name,
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude),
      address: data.address,
      rating: parseFloat(data.rating) || 0,
      open_now: data.working_hours ? data.working_hours.toLowerCase().includes('open') : true,
      trainer: 'Verified Master Trainer'
    };

    if (gym.name && !isNaN(gym.lat) && !isNaN(gym.lng)) {
      results.push(gym);
    }
  })
  .on('end', async () => {
    console.log(`📝 Parsed ${results.length} gyms. Uploading to Supabase...`);

    // Upload in batches of 50 to avoid timeouts
    const batchSize = 50;
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      const { error } = await supabase
        .from('gyms')
        .insert(batch);

      if (error) {
        console.error(`❌ Error uploading batch starting at index ${i}:`, error.message);
      } else {
        console.log(`✅ Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(results.length / batchSize)}`);
      }
    }

    console.log('🎉 Import complete!');
  });
