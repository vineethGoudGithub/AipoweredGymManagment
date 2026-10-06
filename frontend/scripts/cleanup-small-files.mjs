import dotenv from 'dotenv'
import path from 'path'
import ImageKit from 'imagekit'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
})

async function cleanup() {
    console.log('Fetching files from ImageKit...')
    let allFiles = []
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
            allFiles.push(...res)
            skip += 100
        } else {
            hasMore = false
        }
    }

    const smallFiles = allFiles.filter(f => f.size < 200 * 1024)
    console.log(`Found ${smallFiles.length} corrupted/small files out of ${allFiles.length} total.`)

    for (const file of smallFiles) {
        process.stdout.write(`Deleting ${file.name} (${(file.size/1024).toFixed(1)} KB)... `)
        await new Promise((res) => {
            imagekit.deleteFile(file.fileId, (err) => {
                if(err) console.log('Error:', err.message)
                else console.log('Deleted.')
                res()
            })
        })
    }
    
    console.log('\nCleanup complete! All corrupted files removed from ImageKit.')
}

cleanup().catch(console.error)
