import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const RAW_LIST = `
Lever Seated Shoulder Press
Lever Seated Twist
Lever Seated Squat Calf Raise on Leg Press Machine
Lever Lying T bar Row
Triceps Dip
Dumbbell Lunge
Lever Lying Leg Curl
Lever Kneeling Leg Curl plate loaded
Barbell Front Squat
Assisted Sit Up
Clap Push Up
Spinal Stretch on stability ball
Lever Incline Chest Press Chest
Barbell Full Squat Back POV
Cable standing hip extension
Barbell sumo squat Thighs
Dumbbell Plyo Squat
Lever Seated Hip Abduction
Cable hip abduction version 2
Cable Pushdown with rope attachment
Barbell Close Grip Bench Press
Cable Curl
EZ Barbell Seated Curls
Cable Overhead Triceps Extension rope attachment
Barbell Seated Overhead Triceps Extension
Barbell Lying extension
Dumbbell Seated Curl
Dumbbell Rear Lateral Raise
Dumbbell Front Raise
Dumbbell Side Lying One Hand Raise
Dumbbell Standing Overhead Press
Barbell Standing Wide Military Press
Barbell Standing Close Grip Military Press
Barbell Good Morning
Reverse Hyper on Flat Bench
Pelvic Tilt Into Bridge
45 degree hyperextension arms in front of chest
Dumbbell Romanian Deadlift
Walking Lunge Male
07391201 Sled 45° Leg Press
Sled 45° Leg Press Side POV
Sled 45° Leg Press Back POV
Weighted Sissy Squat
Hanging Straight Leg Raise
45 degree hyperextension arms in front of chest Side view
Barbell Full Squat Side POV
Cable Bar Lateral Pulldown
Cable Straight Arm Pulldown
Chin Up
Cable Seated Wide grip Row
Inverted Row
Wide Grip Pull Up
Lever Unilateral Row
Dumbbell Fly
Dumbbell Incline Fly
Cable Low Fly
Barbell Incline Bench Press
Smith Incline Bench Press
Barbell Wide Bench Press
Chest Dip
Dumbbell Pullover
Push up
Cable Wide Grip Rear Pulldown Behind Neck
Russian Twist with medicine ball
Dumbbell burpee
Push Press
Sumo Deadlift High Pull
Jumping Pull up
Jump Split
Barbell Standing Military Press without rack
Lying Leg Raise
Reverse plank
Triceps Dips Floor
Standing Behind Neck Press
Pull up
Jump Squat
Front Plank
Dumbbell Seated Shoulder Press
Dumbbell Reverse Fly
Dumbbell Lateral Raise
Dumbbell Incline Bench Press
Dumbbell Bent over Row
Close Grip Push up
Barbell Wide Grip Upright Row
Barbell Upright Row
Barbell Straight Leg Deadlift
Barbell Lunge
Barbell Full Squat
Barbell Deadlift
Barbell Clean and Press
Burpee
Power Clean
Dumbbell Decline Shrug
Barbell One Leg Squat
Dumbbell Incline One Arm Lateral Raise
Lever Gripless Shrug
Dumbbell Shrug
Lever Shrug plate loaded
Smith Shrug
Dumbbell Incline Shrug
Barbell Shrug
Triceps Press - Head Below Bench
Dumbbell Decline Fly
Dumbbell Cross Body Hammer Curl
Dumbbell Biceps Curl
Dumbbell Bench Seated Press
Dumbbell Bench Press
Dumbbell Around Pullover
Dumbbell Arnold Press II
Dumbbell Alternate Side Press
Barbell Curl
Lever Pec Deck Fly
Incline Twisting Sit up version 2
Barbell Bent Over Row
Barbell Bench Press
Barbell Alternate Biceps Curl
Assisted Parallel Close Grip Pull up
Assisted Chest Dip kneeling
Assisted Weighted Push-up
45 degree Bycicle Twisting Crunch
Suspension Supine Crunch
Suspension Fly
New style - FULL COLOR
Gym visual
Lever Reverse Hyperextension
video AR Gymvisual
Twisting Crunch arms straight
Hip Raise Bridge
Middle Back Stretch
Weighted Standing Twist
Side Bridge
Twist Sit up
Bent knee Lying Twist On Stability Ball
Weighted Lying Twist
Side Bend on stability ball
Russian Twist on stability ball arms straight
Bent knee Lying Twist
Seated Twist straight arm
Side Crunch version 2
Side Crunch
Sideways Lifts Vertical Turn straight legs
Spinal Stretch on stability ball
Seated Twist on stability ball
Barbell Seated Twist on stability ball
Hip Extension Stretch
Lying Hip Lift on stability ball
Standing Hip Extension bent knee
Kicks Leg Bent version 2
Kicks Leg Bent
Lying Alternate Hip Extension
Bridge Hip Abduction
Jack knife Floor
Weighted Leg Extension Crunch
Sit Up
Bycicle Twisting Crunch
Crunch on bench
Medicine Ball Sit up wall
V up
Crunch legs on stability ball
Crunch leg raise
Jack Split Crunches
Alternate Lying Floor Leg Raise
Cambered Bar Lying Row
Lever High Row plate loaded
Dumbbell Bent Over Row
Dumbbell Incline Row
Smith Narrow Row
Cable seated row
Barbell Incline Row
Barbell Pullover To Press
Cable Decline Seated Wide grip Row
Dumbbell Seated Kickback
Dumbbell Decline Triceps Extension
Dumbbell Standing Triceps Extension
Olympic Barbell Triceps Extension
Dumbbell Lying Extension across face
Dumbbell Kickback
Smith Leg Press
Sled Lying Squat
Sled 45 Leg Wide Press
Barbell Clean grip Front Squat
Smith Chair Squat
Barbell Side Split Squat version 2
Barbell Jefferson Squat
Dumbbell Bench Squat
Trap Bar Deadlift
Sled 45 Calf Press
Lever Standing Calf Raise
Barbell Seated Calf Raise
Dumbbell Standing Calf Raise
Sled Backward Angled Calf Raise
Weighted Front Raise
Dumbbell Standing Front Raise Above Head
Dumbbell Seated Alternate Front Raise
Dumbbell Front Raise version 2
Weighted Round Arm
Lever Chest Press plate loaded
Barbell Guillotine Bench Press
Dumbbell Incline Palm in Press
Dumbbell Lying Hammer Press
Lever Chest Press
Push Up Medicine Ball
Push up
Smith Decline Bench Press
Weighted Svend Press
Decline Push Up
Oblique Crunches Floor
Side Hip on parallel bars
Weighted Side Bend on stability ball
45 Side Bend
Barbell Side Bent version 2
Barbell Seated Twist
Lever Kneeling Twist
Dumbbell Standing Concentration Curl
Dumbbell Hammer Curl version 2
Barbell Seated Close grip Concentration Curl
Dumbbell Seated Preacher Curl
Dumbbell Prone Incline Curl
Lever Seated Leg Raise Crunch plate loaded
Reverse Crunch
Decline Crunch
3/4 Sit-up
EZ Barbell Curl
Dumbbell Incline Inner Biceps Curl
Dumbbell Concentration Curl
Dumbbell Alternate Biceps Curl
`

function inferMuscleGroup(name) {
  const n = name.toLowerCase()
  if (n.includes('chest') || n.includes('bench') || n.includes('fly') || n.includes('push up') || n.includes('dip') || n.includes('pec')) return 'Chest'
  if (n.includes('row') || n.includes('pull up') || n.includes('pulldown') || n.includes('back') || n.includes('deadlift') || n.includes('chin up') || n.includes('shrug')) return 'Back'
  if (n.includes('squat') || n.includes('lunge') || n.includes('leg') || n.includes('calf') || n.includes('press') || n.includes('hip') || n.includes('bridge') || n.includes('extension')) {
    if (n.includes('chest press') || n.includes('bench press') || n.includes('shoulder press')) return null // Filter out non-leg presses
    return 'Legs'
  }
  if (n.includes('shoulder') || n.includes('military') || n.includes('press') || n.includes('raise') || n.includes('lateral')) return 'Shoulders'
  if (n.includes('curl') || n.includes('triceps') || n.includes('biceps') || n.includes('arm')) return 'Arms'
  if (n.includes('crunch') || n.includes('sit up') || n.includes('twist') || n.includes('plank') || n.includes('core') || n.includes('abs') || n.includes('oblique')) return 'Core'
  return 'Other'
}

const names = RAW_LIST.trim().split('\n').filter(line => {
  const l = line.trim()
  return l && !l.includes('views') && !l.includes('years ago') && !l.includes('playing') && l !== 'true' && !l.match(/^\d+:\d+$/)
}).map(n => n.trim())

const exercises = names.map(name => {
  const muscleGroup = inferMuscleGroup(name) || 'Other'
  return {
    name,
    muscle_group: muscleGroup,
    difficulty_level: 'Intermediate',
    instructions: ['Watch the video for proper form demonstration.', 'Maintain a controlled tempo throughout the exercise.'],
    common_mistakes: ['Using momentum instead of muscle control.', 'Not following a full range of motion.'],
    pro_tip: 'Consistency and controlled form are the keys to long-term progress.',
    video_path: name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.mp4'
  }
})

async function seed() {
  console.log(`Seeding ${exercises.length} exercises...`)
  
  // Chunking because Supabase might have limits on bulk insert size
  const CHUNK_SIZE = 50
  for (let i = 0; i < exercises.length; i += CHUNK_SIZE) {
    const chunk = exercises.slice(i, i + CHUNK_SIZE)
    const { error } = await supabase.from('exercises').upsert(chunk, { onConflict: 'name' })
    if (error) {
      console.error(`Error seeding chunk ${i / CHUNK_SIZE + 1}:`, error)
    } else {
      console.log(`Successfully seeded chunk ${i / CHUNK_SIZE + 1}`)
    }
  }
  
  console.log('Seeding complete!')
}

seed()
