import fs from 'fs'
import { GitResponseError, PullFailedResult, simpleGit, TaskOptions } from 'simple-git'
import { getRootFilePath } from '../utils'

const options = {
  binary: 'git',
  trimmed: false,
  baseDir: process.cwd(),
  maxConcurrentProcesses: 6
}

const git = simpleGit(options)

export async function getBranchname() {
  const { current } = await git.branchLocal()
  return current
}

/**
 * @description 拉取远程分支
 */
export async function pullBranchname(branchname: string, featureBranch: string) {
  return await git.checkout(['-b', branchname, featureBranch])
}

/**
 * @description 创建新分支
 */
export async function createBranchname(branchname: string, commitId?: string) {
  if (commitId) {
    return await git.checkout(['-b', branchname, commitId])
  }
  return await git.checkout(['-b', branchname])
}

/**
 * @description 切换分支
 */
export async function checkout(branchname: string) {
  return await git.checkout(branchname)
}

export async function status() {
  return await git.status()
}

export async function gitUpdate(remote: string) {
  return await git.remote(['update', remote, '--p'])
}
export async function checkGit() {
  const { files } = await status()
  return files
}

export async function filesStatus(dirPath: string) {
  const { files } = await git.status([dirPath])
  return files
}

export async function hasFileChange(dirPath: string) {
  return await filesStatus(dirPath)
}

export async function gitAdd(dirPath: string[]) {
  return await git.add(dirPath)
}

export async function gitCommit(message: string, verify: string) {
  return await git.commit(message, [verify])
}

export async function gitMerge(branchname: string) {
  return await git.merge([branchname])
}

export async function getFirstCommitId(fileName: string) {
  if (!fs.existsSync(getRootFilePath(fileName))) return
  const { latest } = await git.log(['--pretty=oneline', '--reverse', fileName])
  const { hash } = latest ?? {}
  if (!hash) return
  const [, id] = hash.match(/(\S+)/) ?? []
  return id
}

export async function getBranchList() {
  return await git.branch()
}

export async function getrRemote() {
  return await git.remote(['-v'])
}

export async function gitPull(remote: string, branch: string) {
  return await git.pull(remote, branch)
}

export async function gitPush(remote: string, branch: string, options?: TaskOptions) {
  return await git.push(remote, branch, options)
}
