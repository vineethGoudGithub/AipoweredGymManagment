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
    console.log('Fetching all files from ImageKit...')
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

    // Sort by createdAt ascending
    allFiles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    
    console.log(`Total files found: ${allFiles.length}`)
    
    // We want to keep the first 52.
    // The rest are the ones added by the automated script.
    const filesToKeep = allFiles.slice(0, 52)
    const filesToDelete = allFiles.slice(52)

    console.log(`Keeping the first ${filesToKeep.length} files.`)
    console.log(`Deleting ${filesToDelete.length} files...`)

    for (const file of filesToDelete) {
        process.stdout.write(`Deleting ${file.name} (ID: ${file.fileId})... `)
        await new Promise((res) => {
            imagekit.deleteFile(file.fileId, (err) => {
                if(err) console.log('Error:', err.message)
                else console.log('Deleted.')
                res()
            })
        })
    }
    
    console.log('\nCleanup complete! All extra files removed.')
}

cleanup().catch(console.error)
