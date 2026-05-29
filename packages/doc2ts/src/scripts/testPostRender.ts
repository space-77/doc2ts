import fs from 'fs'
import path from 'path'

const CONFIG_FILE_PATH = path.join(process.cwd(), './text.txt')

fs.writeFileSync(CONFIG_FILE_PATH, 'test')


