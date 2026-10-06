import dotenv from 'dotenv'
import ImageKit from 'imagekit'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
})

async function check() {
    const res = await imagekit.listFiles({ limit: 10 })
    res.forEach(f => {
        console.log(`${f.name} | Type: ${f.fileType} | Size: ${(f.size/1024).toFixed(1)} KB | Thumbnail: ${f.thumbnailUrl ? 'Yes' : 'No'}`)
    })
}

check().catch(console.error)
