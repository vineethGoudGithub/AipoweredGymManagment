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

async function checkDuplicates() {
  const { data, error } = await supabase
    .from('exercises')
    .select('name')
  
  if (error) return console.error(error)

  const counts = {}
  data.forEach(e => {
    const low = e.name.toLowerCase().trim()
    counts[low] = (counts[low] || 0) + 1
  })

  console.log('Duplicate names (lowercase):')
  Object.entries(counts).forEach(([name, count]) => {
    if (count > 1) console.log(`- "${name}": ${count} occurrences`)
  })
}

checkDuplicates()
