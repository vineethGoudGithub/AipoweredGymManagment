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

function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric except -
    .replace(/-+/g, '-')            // Replace multiple - with single -
}

async function standardizeExercises() {
  console.log('Fetching all exercises...')
  const { data: exercises, error: fetchError } = await supabase
    .from('exercises')
    .select('*')

  if (fetchError) {
    console.error('Error fetching exercises:', fetchError)
    return
  }

  console.log(`Processing ${exercises.length} exercises...`)

  for (const exercise of exercises) {
    // Standardize the display name to lowercase (as requested)
    const lowerName = exercise.name.toLowerCase().trim()
    
    // Create the video path (slug + .mp4)
    const videoPath = toSlug(exercise.name) + '.mp4'

    const { error: updateError } = await supabase
      .from('exercises')
      .update({
        name: lowerName,
        video_path: videoPath
      })
      .eq('id', exercise.id)

    if (updateError) {
      console.error(`Error updating exercise ${exercise.id}:`, updateError)
    }
  }

  console.log('Standardization complete!')
}

standardizeExercises()
