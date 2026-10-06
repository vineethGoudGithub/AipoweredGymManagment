import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import util from 'util'
import ImageKit from 'imagekit'

const execPromise = util.promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
})

// Match the website's naming exactly
function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

async function getExistingFiles() {
  console.log('Building ImageKit cache...')
  let allFiles = []
  let hasMore = true
  let skip = 0
  
  while (hasMore) {
    const res = await new Promise((res, rej) => {
      imagekit.listFiles({ skip, limit: 100 }, (err, result) => {
        if (err) rej(err)
        else res(result)
      })
    })
    if (res.length > 0) {
      allFiles.push(...res)
      skip += 100
    } else {
      hasMore = false
    }
  }
  return new Set(allFiles.map(f => f.name))
}

async function processVideos() {
  const existingFiles = await getExistingFiles()
  console.log(`Verified ${existingFiles.size} videos in ImageKit.`)

  const linksPath = path.resolve(__dirname, '../links.txt')
  const links = fs.readFileSync(linksPath, 'utf8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('http'))

  const uniqueLinks = [...new Set(links)]
  
  // Starting from index 52 (the 53rd link)
  const linksToProcess = uniqueLinks.slice(52)
  console.log(`Starting bulk processing from link 53.`)

  let count = 0
  for (let i = 0; i < linksToProcess.length; i++) {
    const url = linksToProcess[i]
    const overallIndex = i + 53
    
    try {
      const { stdout: titleOut } = await execPromise(`yt-dlp --get-title --no-warnings "${url}"`, { maxBuffer: 1024 * 1024 * 5 })
      const title = titleOut.split('\n').filter(l => l.trim().length > 0).pop().trim()
      const slug = toSlug(title)
      const fileName = `${slug}.mp4`
      
      if (existingFiles.has(fileName)) {
        console.log(`[${overallIndex}/${uniqueLinks.length}] OK: "${title}" is already live.`)
        continue
      }

      console.log(`\n[${overallIndex}/${uniqueLinks.length}] Working on: "${title}"`)
      const filePath = path.resolve(__dirname, `../${fileName}`)

      // THE ORIGINAL WORKING COMMAND
      console.log(`   -> Downloading...`)
      await execPromise(`yt-dlp -f "best[ext=mp4]/best" -o "${filePath}" -q --no-warnings "${url}"`, { maxBuffer: 1024 * 1024 * 50 })

      if (!fs.existsSync(filePath)) throw new Error("File not found on disk after download.")

      // 3. Upload to ImageKit
      console.log(`   -> Uploading to ImageKit...`)
      const fileBuffer = fs.readFileSync(filePath)
      
      await new Promise((resolve, reject) => {
        imagekit.upload({
          file: fileBuffer,
          fileName: fileName,
          useUniqueFileName: false,
          folder: '/',
          overwriteFile: true
        }, (error, result) => {
          if (error) reject(error)
          else {
            console.log(`   -> Success!`)
            resolve(result)
          }
        })
      })

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      count++

    } catch (err) {
      console.error(`[${overallIndex}] ERROR:`, err.message || err)
    }
  }

  console.log(`\nProcessing finished. ${count} new videos added.`)
}

processVideos().catch(console.error)
