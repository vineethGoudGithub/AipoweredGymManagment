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

async function check() {
  const { count, error } = await supabase
    .from('exercises')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error(error)
  }
  console.log(`Total exercises: ${count}`)
  
  const { data: exercises } = await supabase.from('exercises').select('id, name').order('name');
  console.log('Exercises:')
  exercises.forEach((ex, i) => console.log(`${i+1}. ${ex.name}`));
}

check()
