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

async function fixClassifications() {
  const fixes = [
    { name: 'Dumbbell Standing Overhead Press', group: 'Shoulders' },
    { name: 'Barbell Standing Wide Military Press', group: 'Shoulders' },
    { name: 'Barbell Standing Close Grip Military Press', group: 'Shoulders' },
    { name: 'Barbell Standing Military Press without rack', group: 'Shoulders' },
    { name: 'Dumbbell Standing Triceps Extension', group: 'Arms' },
    { name: 'Lever Standing Calf Raise', group: 'Legs' }, // Correct
    { name: 'Dumbbell Standing Calf Raise', group: 'Legs' }, // Correct
    { name: 'Standing Behind Neck Press', group: 'Shoulders' }, // Corrected already but confirming
  ]

  for (const fix of fixes) {
    const { error } = await supabase
      .from('exercises')
      .update({ muscle_group: fix.group })
      .eq('name', fix.name)
    
    if (error) console.error(`Error fixing ${fix.name}:`, error)
    else console.log(`Fixed ${fix.name} -> ${fix.group}`)
  }
}

fixClassifications()
