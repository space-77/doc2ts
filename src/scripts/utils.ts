import iconv from 'iconv-lite'
import { GET_CHECKOUT, GET_REV_PARSE, GIT_VERSION } from './commands'
import { exec, ExecException } from 'child_process'

const encoding = 'cp936'
const binaryEncoding = 'binary'

export function decodeRes(str: string) {
  return iconv.decode(Buffer.from(str, binaryEncoding), encoding)
}

type ExecExceptions = [ExecException | null, string, string]

export function execSync(command: string): Promise<ExecExceptions> {
  return new Promise(resolve => {
    exec(command, { encoding: binaryEncoding }, (err, stdout, stderr) => {
      resolve([
        JSON.parse(decodeRes(JSON.stringify(err))),
        decodeRes(stdout).replace(/[\n\r?]+$/, ''),
        decodeRes(stderr)
      ])
    })
  })
}

/**
 * @desc 获取 当前 git 版本
 */
export async function getGitVersion(): Promise<ExecExceptions> {
  const [err, stdout, stderr] = await execSync(GIT_VERSION)

  const [_, version] = stdout.match(/(\d+\.\d+\.\d+)/) ?? []
  return [err, version, stderr]
}

export async function getCommitId() {
  return await execSync(GET_REV_PARSE)
}

export async function checkout(branchname: string) {
  return await execSync(GET_CHECKOUT + branchname)
}
