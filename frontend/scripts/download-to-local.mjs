import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const TARGET_DIR = path.resolve(__dirname, '../public/videos/exercises')

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true })
}

function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

async function processVideos() {
  const linksPath = path.resolve(__dirname, '../links.txt')
  if (!fs.existsSync(linksPath)) {
    console.error('links.txt not found!')
    return
  }

  const links = fs.readFileSync(linksPath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('http'))

  const uniqueLinks = [...new Set(links)]
  console.log(`Found ${uniqueLinks.length} unique links in links.txt.`)

  let count = 0
  for (let i = 0; i < uniqueLinks.length; i++) {
    const url = uniqueLinks[i]
    
    try {
      // 1. Get Title
      const { stdout: titleOut } = await execPromise(`yt-dlp --get-title --no-warnings "${url}"`, { maxBuffer: 1024 * 1024 * 5 })
      const title = titleOut.split('\n').filter(l => l.trim().length > 0).pop().trim()
      const slug = toSlug(title)
      const fileName = `${slug}.mp4`
      const filePath = path.join(TARGET_DIR, fileName)
      
      if (fs.existsSync(filePath)) {
        console.log(`[${i+1}/${uniqueLinks.length}] Skipping "${title}" - already downloaded.`)
        continue
      }

      console.log(`\n[${i+1}/${uniqueLinks.length}] Downloading: "${title}"`)
      
      // 2. Download - Using format 18/22/best to ensure browser compatibility without ffmpeg
      // We download directly to the public folder
      await execPromise(`yt-dlp -f "18/22/best[ext=mp4]" -o "${filePath}" -q --no-warnings "${url}"`, { maxBuffer: 1024 * 1024 * 50 })

      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        console.log(`   -> Successfully saved: ${fileName} (${(stats.size / 1024).toFixed(1)} KB)`)
        count++
      } else {
        console.error(`   -> Failed to save file for ${title}`)
      }

    } catch (err) {
      console.error(`[${i+1}/${uniqueLinks.length}] Error processing ${url}:`, err.message || err)
    }
  }

  console.log(`\nAll done! Downloaded ${count} new videos to ${TARGET_DIR}`)
}

processVideos().catch(console.error)
