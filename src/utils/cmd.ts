import iconv from 'iconv-lite'
import { execSync } from 'child_process'

const encoding = 'cp936'
const binaryEncoding = 'binary'

export function decodeRes(str: string) {
  return iconv.decode(Buffer.from(str, binaryEncoding), encoding)
}

// type ExecExceptions = [ExecException | null, string, string]

export default function(command: string) {
  const res = execSync(command, { encoding: binaryEncoding })
  // JSON.parse(decodeRes(JSON.stringify(err))),
  return decodeRes(res).replace(/[\n\r?]+$/, '')
  // decodeRes(stderr)
  // return new Promise(resolve => {
  // })
}
