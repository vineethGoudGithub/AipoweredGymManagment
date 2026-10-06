import { createClient } from '@supabase/supabase-js'
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
})

function toSlug(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

async function start() {
    console.log('1. Fetching desired exercises from Supabase...')
    const { data: exercises, error } = await supabase.from('exercises').select('name, video_path')
    if (error) {
       console.error("Supabase error:", error);
       process.exit(1)
    }
    
    // Create a Set of all needed video filenames (slugs)
    const neededFiles = new Set()
    for (const ex of exercises) {
        if(ex.video_path) {
            // Strip leading slash for matching
            neededFiles.add(ex.video_path.replace(/^\//, ''))
        }
    }
    console.log(`We have ${neededFiles.size} unique videos needed for our Database.`)

    console.log('2. Fetching videos list from YouTube channel...')
    const channelUrl = 'https://www.youtube.com/@gymvisual8018/videos'
    const command = 'yt-dlp --flat-playlist --print "%(title)s|%(id)s" "https://www.youtube.com/@gymvisual8018/videos"'
    
    const { stdout } = await execPromise(command, { maxBuffer: 1024 * 1024 * 50 })
    const channelVideos = stdout.split('\n').filter(l => l.trim().length > 0)
    console.log(`Found ${channelVideos.length} total videos on the channel.`)

    // We'll keep a local cache of already uploaded files on ImageKit to avoid API limit hits
    const cacheFile = path.resolve(__dirname, '../imagekit_uploaded.json')
    let uploadedSet = new Map()
    
    // First let's check local downloaded cache from our last manual run just to be safe
    const localDownCacheFile = path.resolve(__dirname, '../downloaded_cache.json')
    if (fs.existsSync(localDownCacheFile)) {
        const localD = JSON.parse(fs.readFileSync(localDownCacheFile))
        localD.forEach(v => uploadedSet.add(v))
    }

    if (fs.existsSync(cacheFile)) {
        const ikCached = JSON.parse(fs.readFileSync(cacheFile))
        // Cache as Map name -> size
        ikCached.forEach(f => uploadedSet.set(f.name, f.size || 0))
    } else {
        console.log('Fetching files list from ImageKit to build cache (might take a second)...')
        let hasMore = true
        let skip = 0
        while (hasMore) {
           const res = await new Promise((res, rej) => {
               imagekit.listFiles({ skip, limit: 100 }, (err, result) => {
                   if(err) rej(err)
                   else res(result)
               })
           })
           if (res.length > 0) {
               res.forEach(f => uploadedSet.set(f.name, f.size || 0))
               skip += 100
           } else {
               hasMore = false
           }
        }
        const cacheArr = []
        uploadedSet.forEach((v, k) => cacheArr.push({ name: k, size: v }))
        fs.writeFileSync(cacheFile, JSON.stringify(cacheArr))
        console.log(`Retrieved ${uploadedSet.size} videos currently on ImageKit.`)
    }

    let downloadedCount = 0;
    
    // Now loop channel videos, if it matches a slug we need but don't have, download & upload
    for (const line of channelVideos) {
        if (!line.includes('|')) continue;
        const [title, id] = line.split('|')
        const url = `https://www.youtube.com/watch?v=${id}`
        const rawSlug = toSlug(title)
        const targetFileName = `${rawSlug}.mp4`

        if (!neededFiles.has(targetFileName)) {
            continue; 
        }

        const existingSize = uploadedSet.get(targetFileName)
        // If it exists and is > 200KB, it's probably good
        if (existingSize && existingSize > 200 * 1024) {
            continue;
        }
        
        if (existingSize) {
           console.log(`\n[!] Video ${targetFileName} is too small (${(existingSize/1024).toFixed(1)} KB), re-downloading...`)
        } else {
           console.log(`\n[+] Found missing video: "${title}" => ${targetFileName}`)
        }

        const filePath = path.resolve(__dirname, `../${targetFileName}`)

        try {
            if (!fs.existsSync(filePath)) {
                console.log(`  -> Downloading from YouTube (preferring merged MP4)...`)
                // Use format 18/22/best to skip ffmpeg merging and get a compatible MP4
                await execPromise(`yt-dlp -f "18/22/bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${filePath}" -q --no-warnings "${url}"`, { maxBuffer: 1024 * 1024 * 50 })
            }

            console.log(`  -> Uploading to ImageKit...`)
            const fileBuffer = fs.readFileSync(filePath)
            await new Promise((resolve, reject) => {
                imagekit.upload({
                    file: fileBuffer,
                    fileName: targetFileName,
                    useUniqueFileName: false,
                    folder: '/',
                    overwriteFile: true
                }, (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })
            })

            console.log(`  -> Successfully linked in ImageKit: ${targetFileName}`)
            try { fs.unlinkSync(filePath) } catch(e){} // Cleanup
            
            uploadedSet.set(targetFileName, fileBuffer.length)
            const cacheArr = []
            uploadedSet.forEach((v, k) => cacheArr.push({ name: k, size: v }))
            fs.writeFileSync(cacheFile, JSON.stringify(cacheArr))
            downloadedCount++;

        } catch (err) {
            console.error(`Failed on ${targetFileName}:`, err.message || err)
        }
    }
    
    console.log(`\nAll done! Successfully downloaded and uploaded ${downloadedCount} new missing videos!`)
}

start().catch(e => console.error("Fatal Error:", e))
