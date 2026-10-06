import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanupAndStandardize() {
  console.log('Finding duplicates for "dumbbell bent over row"...')
  const { data: dups } = await supabase
    .from('exercises')
    .select('*')
    .ilike('name', 'dumbbell bent over row')

  if (dups && dups.length > 1) {
    console.log(`Found ${dups.length} duplicates. Keeping the first one (${dups[0].id})...`)
    for (let i = 1; i < dups.length; i++) {
        await supabase.from('exercises').delete().eq('id', dups[i].id)
    }
  }

  console.log('Fetching all exercises for final standardization...')
  const { data: exercises } = await supabase.from('exercises').select('*')

  for (const exercise of exercises) {
    const lowerName = exercise.name.toLowerCase().trim()
    const videoPath = lowerName.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.mp4'
    
    await supabase
      .from('exercises')
      .update({ name: lowerName, video_path: videoPath })
      .eq('id', exercise.id)
  }

  console.log('All 224+ exercises standardized!')
}

cleanupAndStandardize()
