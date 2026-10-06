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

async function checkExercises() {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .ilike('name', '%stand%')
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Exercises found matching "stand":')
    data.forEach(e => {
      console.log(`- Name: "${e.name}", Group: "${e.muscle_group}", Video: "${e.video_path}"`)
    })
  }
}

checkExercises()
