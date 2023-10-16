import { join } from 'path'
import screenshot from 'screenshot-desktop'
import { mkdirSync, readFileSync } from 'fs'

const SCREENSHOT_FILE_DIR = join(__dirname, '../../../data/screenshots')

// make sure data/screenhots exists
mkdirSync(SCREENSHOT_FILE_DIR, { recursive: true })

export async function getScreenshot(): Promise<Uint8Array> {
    const now = Date.now()
    const filename = join(SCREENSHOT_FILE_DIR, `${now}.png`)
    const displays = await screenshot.listDisplays()

    // TODO: returning IMG doesnt work
    const img = await screenshot({
        format: 'png',
        filename,
        screen: displays[displays.length - 1].id,
    })

    console.log(typeof readFileSync(filename))
    return readFileSync(filename)
}
