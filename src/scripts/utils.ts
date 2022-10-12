import iconv from 'iconv-lite'
import {
  GET_CHECKOUT,
  GET_REV_PARSE,
  GIT_ADD,
  GIT_BRANCH,
  GIT_COMMIT,
  GIT_DELETE_BRANCH,
  GIT_HEAD,
  GIT_LOG,
  GIT_MERGE,
  GIT_STATUS,
  GIT_VERSION
} from './commands'
import { exec, ExecException } from 'child_process'
import { ignoredFile, noChanges, notGit, nothingCommit } from './messagekey'
import { CODE } from './config'
import log from '../utils/log'

const encoding = 'cp936'
const binaryEncoding = 'binary'

export function decodeRes(str: string) {
  return iconv.decode(Buffer.from(str, binaryEncoding), encoding)
}

type ExecExceptions = [ExecException | null, string, string]

export function execSync(command: string): Promise<ExecExceptions> {
  return new Promise(resolve => {
    log.info(command)
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

export async function createBranchname(branchname: string, commitId?: string) {
  // git checkout -b branchname commitId
  return await execSync(`${GET_CHECKOUT} -b ${branchname} ${commitId}`)
}

export async function checkout(branchname: string) {
  return await execSync(`${GET_CHECKOUT} ${branchname}`)
}

export async function deleteBranch(branchname: string) {
  return await execSync(GIT_DELETE_BRANCH + branchname)
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
  } else if (ignoredFile.test(stderr)) {
    return [null, stdout, '']
  }
  return [err, stdout, stderr]
}

export async function gitAdd(dirPath: string): Promise<ExecExceptions> {
  return await execSync(GIT_ADD + dirPath)
}

export async function getCommit() {
  return await execSync(GIT_HEAD)
}

export async function gitCommit(message: string): Promise<ExecExceptions> {
  const [err, stdout, stderr] = await execSync(GIT_COMMIT + message)
  if (nothingCommit.test(stdout)) {
    // 没有更改 正常返回
    return [null, CODE.NOTHING_COMMIT, '']
  }

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

export async function getFirstCommitId(fileName: string) {
  const [err, stdout, stderr] = await execSync(GIT_LOG + fileName)
  if (err) throw new Error(stderr)
  const [_, id] = stdout.match(/(\S+)/) ?? []
  return id
}
