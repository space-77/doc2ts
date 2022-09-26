//  TODO 切换到 doc 分支后，被 .gitignore 忽略的文件肯能会重现导致 commit 异常
//  解决：只操作代码存放文件夹【待测试】

//  TODO doc2ts-config.ts 文件 内容可能不是最新的
//  解决：切换到 doc 分支前，复制 当前分支的 doc2ts-config.ts 内容到内存，等待分支切换成功后，把内容覆盖到 当前分支的 doc2ts-config.ts 文件

import fs from 'fs-extra'
import Doc2Ts from '../doc2TsCore/index'
import { notBranch, replacedLF } from './messagekey'
import { CONFIG_PATH } from '../common/config'
import { Doc2TsConfig } from '../types/type'
import { CODE, GIT_BRANCHNAME } from './config'
import { getConfig, getRootFilePath, resolveOutPath } from '../utils/index'
import { checkGit, checkout, getBranchname, gitAdd, gitCommit, gitMerge, gitStatus } from './utils'
import log from '../utils/log'

class Status {
  config!: Doc2TsConfig
  includeFiles!: string
  docBranchname!: string
  originalBranchname!: string
  doc2tsConfigContent!: Buffer

  constructor() {
    this.init()
  }

  async init() {
    try {
      let res: any

      // 检测 git 是否能用 以及 读取配置信息
      res = await this.loadConfig()
      log.info('loadConfig')
      if (res === CODE.NOT_GIT) return

      // 获取当前分支并保留
      await this.getBranch()
      log.info('getBranch')
      // 切换到 doc 分支
      res = await this.checkout2Doc()
      log.info('checkout2Doc')
      if (res === CODE.NOT_GIT) return

      // 生成接口信息
      const doc2ts = new Doc2Ts()
      await doc2ts.init()
      log.info('init')

      // commit 代码【检查有没有代码】
      res = await this.checkStatus()
      log.info('checkStatus')
      if (res === CODE.NOTHING_COMMIT) {
        // 没有代码变更
        // 切换源分支
        await this.checkout2Base()
        log.info('checkout2Base')
        return
      }

      // add
      await this.addFile()
      log.info('addFile')

      // commit
      await this.commitFile()
      log.info('commitFile')

      // 切换源分支
      await this.checkout2Base()
      log.info('checkout2Base')

      // 合并 doc 分支代码
      await this.mergeCode()
      log.info('mergeCode')

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

    const { outDir, gitConfig = { branchname: undefined } } = this.config
    this.includeFiles = `${outDir}/*`
    this.docBranchname = gitConfig.branchname ?? GIT_BRANCHNAME
    // console.log(config.outDir)

    // 复制 切换分支前的 doc2ts-config.ts 文件内容到 内存
    this.doc2tsConfigContent = fs.readFileSync(getRootFilePath(CONFIG_PATH))
    // console.log(doc2tsConfigContent)
  }

  // 切换至源来分支
  async checkout2Base() {
    const { originalBranchname } = this
    if (!originalBranchname) throw new Error('源分支不存在')
    const [err, stdout, stderr] = await checkout(originalBranchname)
    if (err) throw new Error(stderr)
  }

  async checkout2Doc() {
    const [err, stdout, stderr] = await checkout(this.docBranchname)
    if (notBranch.test(stderr)) return this.initBranchname()
    if (err) throw new Error(stderr)
  }

  async getBranch() {
    const [err, branchname, stderr] = await getBranchname()
    if (err) throw new Error(stderr)
    this.originalBranchname = branchname
  }

  async initBranchname() {
    const [err, stdout, stderr] = await checkout(`-b ${this.docBranchname}`)
    console.log(err, stdout, stderr)
    // if (notBranch.test(stdout)) return this.initBranchname()
    // console.log(err, stdout, stderr)
  }

  async checkStatus() {
    const [err, stdout, stderr] = await gitStatus(this.includeFiles)
    if (err) throw new Error(stderr)
    return stdout
  }

  async addFile() {
    const [err, stdout, stderr] = await gitAdd(this.includeFiles)
    // warning: LF will be replaced by CRLF
    if (replacedLF.test(stderr)) return stdout
    if (err) throw new Error(stderr)
    return stdout
  }

  async commitFile() {
    const [err, stdout, stderr] = await gitCommit('"feat: update api file (doc2ts auto commmit)."')
    if (err) throw new Error(stderr)
    return stdout
  }

  async mergeCode() {
    const [err, stdout, stderr] = await gitMerge(this.docBranchname)
    if (err) throw new Error(stderr)
    return stdout
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
