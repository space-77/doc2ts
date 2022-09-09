//  TODO 切换到 doc 分支后，被 .gitignore 忽略的文件肯能会重现导致 commit 异常
//  解决：只操作代码存放文件夹【待测试】

//  TODO doc2ts-config.ts 文件 内容可能不是最新的
//  解决：切换到 doc 分支前，复制 当前分支的 doc2ts-config.ts 内容到内存，等待分支切换成功后，把内容覆盖到 当前分支的 doc2ts-config.ts 文件

import fs from 'fs-extra'
import { Doc2TsConfig } from '../types/type'
import { CONFIG_PATH } from '../common/config'
import { getConfig, getRootFilePath } from '../utils'
import { CODE, GIT_BRANCHNAME } from './config'
import { checkGit, checkout, getBranchname, getCommitId, getGitVersion, gitAdd, gitCommit, gitStatus } from './utils'
import { notBranch } from './messagekey'
import Doc2Ts from '../index'

// async function loadConfig() {
//   // 检测是不是使用 git 管理的代码
//   const [err, stdout, stderr] = await checkGit()
//   if (err) throw new Error(stderr)
//   if (stdout === CODE.NOT_GIT) return CODE.NOT_GIT

//   // 读取 配置文件
//   const config = await getConfig(CONFIG_PATH)
//   console.log(config.outDir)

//   // 复制 切换分支前的 doc2ts-config.ts 文件内容到 内存
//   const doc2tsConfigContent = fs.readFileSync(getRootFilePath(CONFIG_PATH))
//   console.log(doc2tsConfigContent)
// }

// async function name() {
//   // 切换分支到 doc 分支
//   const [err, stdout, stderr] = await checkout(config.gitConfig?.branchname ?? GIT_BRANCHNAME)
// }

// async function start() {
//   try {
//     loadConfig()
//   } catch (error) {
//     console.error(error)
//   }
// }

class Status {
  config!: Doc2TsConfig
  originalBranchname!: string
  doc2tsConfigContent!: Buffer

  constructor() {
    this.init()
  }

  async init() {
    try {
      let res: any

      // 读取配置信息以及检测 git 是否能用
      res = await this.loadConfig()
      if (res === CODE.NOT_GIT) return

      // 获取当前分支并保留
      await this.getBranch()

      // 切换到 doc 分支
      res = await this.checkout2Doc()
      if (res === CODE.NOT_GIT) return

      // 生成接口信息
      // new Doc2Ts()


      // 切换源分支

      // 合并 doc 分支代码

      // console.log(res)
    } catch (error) {
      console.error(error)
    }
  }

  async loadConfig() {
    // 检测是不是使用 git 管理的代码
    const [err, stdout, stderr] = await checkGit()
    if (err) throw new Error(stderr)
    if (stdout === CODE.NOT_GIT) return CODE.NOT_GIT

    // 读取 配置文件
    this.config = await getConfig(CONFIG_PATH)
    // console.log(config.outDir)

    // 复制 切换分支前的 doc2ts-config.ts 文件内容到 内存
    this.doc2tsConfigContent = fs.readFileSync(getRootFilePath(CONFIG_PATH))
    // console.log(doc2tsConfigContent)
  }

  async checkout2Doc() {
    const { gitConfig } = this.config
    const [err, stdout, stderr] = await checkout(gitConfig?.branchname ?? GIT_BRANCHNAME)
    if (notBranch.test(stderr)) return this.initBranchname()
    if (err) throw new Error(stderr)
  }

  async getBranch() {
    const [err, branchname, stderr] = await getBranchname()
    if (err) throw new Error(stderr)
    this.originalBranchname = branchname
  }

  async initBranchname() {
    const { gitConfig } = this.config
    const [err, stdout, stderr] = await checkout(`-b ${gitConfig?.branchname ?? GIT_BRANCHNAME}`)
    console.log(err, stdout, stderr)
    // if (notBranch.test(stdout)) return this.initBranchname()
    // console.log(err, stdout, stderr)
  }
}

new Status()

// ~(async () => {
//   // const [err, version, stderr] = await getGitVersion()
//   // if (err) throw new Error(stderr)
//   // console.log(version)

//   // const [err, id, stderr] = await getCommitId()
//   // if (err) throw new Error(stderr)
//   // console.log(id)

//   // const [err, res, stderr] = await checkout('test1')
//   // console.log(err, res, stderr)

//   // const [err, res, stderr] = await gitStatus('src/common/')
//   // console.log(err, res, stderr)

//   const [err, res, stderr] = await gitAdd('src/common/')
//   console.log(err, res, stderr)

//   // const [err, res, stderr] = await gitCommit(`${CODE.COMMIT_TYPE}${CODE.COMMIT_MESSAGE}`)
//   // console.log(err, res, stderr)
// })()
