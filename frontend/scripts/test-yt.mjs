import { exec } from 'child_process'
import util from 'util'
const execPromise = util.promisify(exec)

async function test() {
  console.log('Testing yt-dlp...')
  try {
    const { stdout } = await execPromise(`yt-dlp --get-title --no-warnings "https://www.youtube.com/watch?v=qeHtqtNtngo"`)
    console.log('Output:', stdout)
  } catch (err) {
    console.error('Error:', err)
  }
}
test()
