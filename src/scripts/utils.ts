import fs from 'fs'
import { simpleGit } from 'simple-git'
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

export async function checkGit() {
  const { files } = await git.status()
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
  return await git.commit(['-m', message, verify])
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
