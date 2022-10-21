//  TODO 切换到 doc 分支后，被 .gitignore 忽略的文件肯能会重现导致 commit 异常
//  解决：只操作代码存放文件夹【待测试】

//  TODO doc2ts-config.ts 文件 内容可能不是最新的
//  解决：切换到 doc 分支前，复制 当前分支的 doc2ts-config.ts 内容到内存，等待分支切换成功后，把内容覆盖到 当前分支的 doc2ts-config.ts 文件

import fs from 'fs-extra'
import Doc2Ts from '../doc2TsCore/index'
import { mergeConflict, notBranch, replacedLF } from './messagekey'
import { CONFIG_PATH } from '../common/config'
import { Doc2TsConfig } from '../types/type'
import { CODE, GIT_BRANCHNAME } from './config'
import { getConfig, getRootFilePath } from '../utils/index'
import {
  checkGit,
  checkout,
  createBranchname,
  getBranchname,
  getFirstCommitId,
  gitAdd,
  gitCommit,
  gitMerge,
  hasFileChange
} from './utils'
import log from '../utils/log'

export default class Manage {
  config!: Doc2TsConfig
  noVerify = true
  // commitId?: string
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
      if (res === CODE.NOT_GIT) return

      // 获取当前分支并保留
      await this.getBranch()

      // 切换到 doc 分支
      res = await this.checkout2Doc()
      if (res === CODE.NOT_GIT) return

      // 生成接口信息
      const doc2ts = new Doc2Ts()
      await doc2ts.init()

      // commit 代码【检查有没有代码】
      // res = await this.checkStatus()
      if (!(await this.checkStatus())) {
        // 没有代码变更
        // 切换源分支
        await this.checkout2Base()
        return
      }

      // add
      await this.addFile()

      // commit
      res = await this.commitFile()

      if (res === CODE.NOTHING_COMMIT) {
        // 没有代码变更
        // 切换源分支
        await this.checkout2Base()
        return
      }

      // 切换源分支
      await this.checkout2Base()

      // 合并 doc 分支代码
      await this.mergeCode()
    } catch (error) {
      console.error(error)
      await this.checkout2Base()
    }
  }

  async loadConfig() {
    // 检测是不是使用 git 管理的代码
    const [err, stdout, stderr] = await checkGit()
    if (err) throw new Error(stderr)
    if (stdout === CODE.NOT_GIT) return CODE.NOT_GIT

    // 读取 配置文件
    this.config = await getConfig(CONFIG_PATH)

    const { outDir, gitConfig } = this.config
    this.includeFiles = `${outDir}/* ${CONFIG_PATH}`
    this.noVerify = gitConfig?.noVerify ?? true
    // this.commitId = gitConfig?.commitId
    this.docBranchname = gitConfig?.branchname ?? GIT_BRANCHNAME
    // console.log(config.outDir)

    // 复制 切换分支前的 doc2ts-config.ts 文件内容到 内存
    this.doc2tsConfigContent = fs.readFileSync(getRootFilePath(CONFIG_PATH)) // .toString()
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
    const { outDir } = this.config

    if (await hasFileChange(`${outDir}/*`)) {
      log.error(`${log.errTag(' error ')} ${log.link(`${outDir}`)} ${log.errColor('目录下有文件没提交，请处理后在重新，本次操作将取消.')}`)
      process.exit(0)
    }

    const [err, stdout, stderr] = await checkout(this.docBranchname)
    if (notBranch.test(stderr)) return this.initBranchname()
    if (err) throw new Error(stderr)
    fs.writeFileSync(getRootFilePath(CONFIG_PATH), this.doc2tsConfigContent)
  }

  async getBranch() {
    const [err, branchname, stderr] = await getBranchname()
    if (err) throw new Error(stderr)
    this.originalBranchname = branchname
  }

  async initBranchname() {
    const { outDir } = this.config
    const commitId = await getFirstCommitId(`${outDir}/index.ts`)
    const [err, stdout, stderr] = await createBranchname(this.docBranchname, commitId)
    if (err) throw new Error(stderr)
  }

  async checkStatus() {
    return await hasFileChange(this.includeFiles)
  }

  async addFile() {
    const [err, stdout, stderr] = await gitAdd(this.includeFiles)
    // warning: LF will be replaced by CRLF
    if (replacedLF.test(stderr)) return stdout
    if (err) throw new Error(stderr)
    return stdout
  }

  async commitFile() {
    const exec = `"feat: update api files (doc2ts auto commmit)." ${this.noVerify ? '-n' : ''}`
    const [err, stdout, stderr] = await gitCommit(exec)
    if (err) throw new Error(stderr)
    return stdout
  }

  async mergeCode() {
    log.clear()
    const [err, stdout, stderr] = await gitMerge(this.docBranchname)
    if (mergeConflict.test(stdout)) {
      log.log(log.warning('=== 合并冲突，请手动处理 ==='))
      log.log(log.warning('=== 合并冲突，请手动处理 ==='))
      log.log(log.warning('=== 合并冲突，请手动处理 ==='))
    } else if (err) {
      throw new Error(stderr)
    }
    log.done(' ALL DONE ')
    return stdout
  }
}
