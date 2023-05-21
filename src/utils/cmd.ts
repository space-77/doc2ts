import iconv from 'iconv-lite'
import { exec } from 'child_process'

const encoding = 'cp936'
const binaryEncoding = 'binary'

export function decodeRes(str: string) {
  return iconv.decode(Buffer.from(str, binaryEncoding), encoding)
}

// type ExecExceptions = [ExecException | null, string, string]

export default function (command: string) {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: binaryEncoding }, (err, res) => {
      if (err) reject(err)
      else resolve(decodeRes(res).replace(/[\n\r?]+$/, ''))
    })
  })
}
