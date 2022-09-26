import iconv from 'iconv-lite'
import { GET_CHECKOUT, GET_REV_PARSE, GIT_ADD, GIT_BRANCH, GIT_COMMIT, GIT_MERGE, GIT_STATUS, GIT_VERSION } from './commands'
import { exec, ExecException } from 'child_process'
import { noChanges, notGit, nothingCommit } from './messagekey'
import { CODE } from './config'

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
// originalBranchname
export async function getBranchname() {
  return await execSync(GIT_BRANCH)
}

export async function checkout(branchname: string) {
  return await execSync(GET_CHECKOUT + branchname)
}

export async function checkGit(): Promise<ExecExceptions> {
  const [err, stdout, stderr] = await execSync(GIT_STATUS)
  if (notGit.test(stdout)) {
    // 不是 git 管理的仓库
    return [null, CODE.NOT_GIT, '']
  }
  return [err, stdout, stderr]
}

export async function gitStatus(dirPath: string): Promise<ExecExceptions> {
  const [err, stdout, stderr] = await execSync(GIT_STATUS + dirPath)
  if (nothingCommit.test(stdout)) {
    // 没有更改 正常返回
    return [null, CODE.NOTHING_COMMIT, '']
  }
  return [err, stdout, stderr]
}

export async function gitAdd(dirPath: string): Promise<ExecExceptions> {
  return await execSync(GIT_ADD + dirPath)
}

export async function gitCommit(message: string): Promise<ExecExceptions> {
  const [err, stdout, stderr] = await execSync(GIT_COMMIT + message)
  if (err) {
    if (noChanges.test(stdout)) {
      // 没有更改 正常返回
      return [null, CODE.NOTHING_COMMIT, stderr]
    }
  }

  return [err, stdout, stderr]
}

export async function gitMerge(branchname: string): Promise<ExecExceptions> {
  return await execSync(GIT_MERGE + branchname)
}