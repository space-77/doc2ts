//  TODO 切换到 doc 分支后，被 .gitignore 忽略的文件肯能会重现导致 commit 异常
//  解决：只操作代码存放文件夹【待测试】

//  TODO doc2ts-config.ts 文件 内容可能不是最新的
//  解决：切换到 doc 分支前，复制 当前分支的 doc2ts-config.ts 内容到内存，等待分支切换成功后，把内容覆盖到 当前分支的 doc2ts-config.ts 文件

import fs from 'fs-extra'
import Doc2Ts from '../doc2TsCore/index'
// import { mergeConflict, notBranch, replacedLF } from './messagekey'
import { CONFIG_PATH } from '../common/config'
import { Doc2TsConfig } from '../types/types'
import { CODE, GIT_BRANCHNAME } from './config'
import { getConfig, getRootFilePath } from '../utils/index'
import {
  checkGit,
  checkout,
  createBranchname,
  filesStatus,
  getBranchname,
  getFirstCommitId,
  gitAdd,
  gitCommit,
  gitMerge,
  hasFileChange
} from './utils'
import log from '../utils/log'
import { mergeConflict } from './messagekey'

export default class Manage {
  config!: Doc2TsConfig
  noVerify = true
  // commitId?: string
  includeFiles: string[] = []
  docBranchname!: string
  originalBranchname!: string
  doc2tsConfigContent!: Buffer

  constructor() {
    this.init()
  }

  async init() {
    try {
      // 检测 git 是否能用 以及 读取配置信息
      await this.loadConfig()

      // 获取当前分支并保留
      await this.getBranch()

      // 切换到 doc 分支
      await this.checkout2Doc()

      // 生成接口信息
      const doc2ts = new Doc2Ts()
      await doc2ts.init()

      // commit 代码【检查有没有代码】
      if ((await this.checkStatus()).length > 0) {
        // 没有代码变更
        // 切换源分支
        await this.checkout2Base()
        return
      }

      // add
      await this.addFile()

      // commit
      const changedFileCount = await this.commitFile()

      // 切换源分支
      await this.checkout2Base()

      // 合并 doc 分支代码
      if (changedFileCount > 0) await this.mergeCode()
    } catch (error) {
      console.error(error)
      const { originalBranchname } = this
      if (!originalBranchname) return
      await checkout(originalBranchname)
    }
  }

  async loadConfig() {
    // 检测是不是使用 git 管理的代码
    await checkGit()

    // 读取 配置文件
    this.config = await getConfig(CONFIG_PATH)

    const { outDir, gitConfig } = this.config
    this.includeFiles.push(...[`${outDir}/*`, CONFIG_PATH])
    this.noVerify = gitConfig?.noVerify ?? true
    this.docBranchname = gitConfig?.branchname ?? GIT_BRANCHNAME

    // 复制 切换分支前的 doc2ts-config.ts 文件内容到 内存
    this.doc2tsConfigContent = fs.readFileSync(getRootFilePath(CONFIG_PATH)) // .toString()
  }

  // 切换至源来分支
  async checkout2Base() {
    const { originalBranchname } = this
    if (!originalBranchname) throw new Error('源分支不存在')
    await checkout(originalBranchname)
  }

  async checkout2Doc() {
    const { outDir } = this.config
    const files = await filesStatus(`${outDir}/*`)

    if (files.length > 0) {
      const err = '目录下有文件没提交，请处理后在重试，本次操作将取消.'
      log.error(`${log.errTag(' error ')} ${log.link(`${outDir}`)} ${log.errColor(err)}`)
      process.exit(0)
    }

    try {
      await checkout(this.docBranchname)
    } catch (error: any) {
      const errStr: string = error.toString()
      if (/Your\s+local\s+changes/i.test(errStr)) throw new Error(errStr.replace(/Error:\s*/ig, ''))
      return this.initBranchname()
    }
    fs.writeFileSync(getRootFilePath(CONFIG_PATH), this.doc2tsConfigContent)
  }

  async getBranch() {
    const branchname = await getBranchname()
    this.originalBranchname = branchname
  }

  async initBranchname() {
    const { outDir } = this.config

    let commitId = await getFirstCommitId(`${outDir}/index.ts`)
    if (!commitId) {
      commitId = await getFirstCommitId(`${outDir}/index.js`)
    }

    await createBranchname(this.docBranchname, commitId)
  }

  async checkStatus() {
    return await hasFileChange(this.includeFiles.join(' '))
  }

  async addFile() {
    return await gitAdd(this.includeFiles)
  }

  async commitFile() {
    const message = '"feat: update api files (doc2ts auto commmit)."'
    const { summary } = await gitCommit(message, this.noVerify ? '-n' : '')
    return Object.values(summary).reduce((res, item) => res + item, 0)
  }

  async mergeCode() {
    log.clear()
    const { result } = await gitMerge(this.docBranchname)
    if (mergeConflict.test(result)) {
      log.log(log.warning('=== 合并冲突，请手动处理 ==='))
      log.log(log.warning('=== 合并冲突，请手动处理 ==='))
      log.log(log.warning('=== 合并冲突，请手动处理 ==='))
    }
    log.done(' ALL DONE ')
  }
}
