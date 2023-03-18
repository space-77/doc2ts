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

export async function createBranchname(branchname: string, commitId?: string) {
  return await git.checkout(['-b', branchname, commitId ?? ''])
}

export async function checkout(branchname: string) {
  return await git.checkout(branchname)
}

export async function status() {
  return await git.status()
}

export async function gitUpdate() {
  return await git.remote(['update', 'origin', '--p'])
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
  // if (!fs.existsSync(getRootFilePath(fileName))) return
  return await git.pull(remote, branch)
  // try {
  // } catch (error) {
  //   return Promise.reject((error as GitResponseError<PullFailedResult>).message)
  // }
  // const { hash } = latest ?? {}
  // if (!hash) return
  // const [, id] = hash.match(/(\S+)/) ?? []
  // return id
}

export async function gitPush(remote: string, branch: string, options?: TaskOptions) {
  return await git.push(remote, branch, options)
}

// export async function gitPush(remote: string, branch: string) {
//   return await git.push(remote, `${branch}:${branch}`)
// }
