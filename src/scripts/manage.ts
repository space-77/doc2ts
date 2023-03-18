//  TODO 切换到 doc 分支后，被 .gitignore 忽略的文件肯能会重现导致 commit 异常
//  解决：只操作代码存放文件夹【待测试】

//  TODO doc2ts-config.ts 文件 内容可能不是最新的
//  解决：切换到 doc 分支前，复制 当前分支的 doc2ts-config.ts 内容到内存，等待分支切换成功后，把内容覆盖到 当前分支的 doc2ts-config.ts 文件

import fs from 'fs-extra'
// import program from 'commander'
import inquirer, { QuestionCollection } from 'inquirer'
import Doc2Ts from '../doc2TsCore/index'
// import { mergeConflict, notBranch, replacedLF } from './messagekey'
import { CONFIG_PATH } from '../common/config'
import { Doc2TsConfig } from '../types/types'
import { CODE, GIT_BRANCHNAME } from './config'
import { getConfig, getRootFilePath } from '../utils/index'
import {
  status,
  checkGit,
  checkout,
  createBranchname,
  filesStatus,
  getBranchList,
  getBranchname,
  getFirstCommitId,
  gitAdd,
  gitCommit,
  gitMerge,
  hasFileChange,
  gitUpdate,
  gitPull,
  gitPush,
  getrRemote
} from './utils'
import log from '../utils/log'
import { mergeConflict } from './messagekey'
import { BranchSummaryBranch, GitResponseError, PullFailedResult, PushResult } from 'simple-git'

export default class Manage {
  config!: Doc2TsConfig
  noVerify = true
  // commitId?: string
  includeFiles: string[] = []
  remote!: string
  hasRemote = false
  docBranchname!: string
  remotesBranchKey!: string
  originalBranchname!: string
  doc2tsConfigContent!: Buffer
  remotesBranch?: BranchSummaryBranch // 远程分支

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

      // // 更新远程分支信息，确保当前分支是最新代码
      // await this.checkBranch()

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

      // 把doc分支代码也推送到服务器
      await this.pushCommit()
      // if (changedFileCount) {
      // }

      // 切换源分支
      await this.checkout2Base()

      // 合并 doc 分支代码
      if (changedFileCount > 0) await this.mergeCode()
    } catch (error) {
      console.error(error)
      // const { originalBranchname } = this
      // if (!originalBranchname) return
      // await checkout(originalBranchname)
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
    this.remote = gitConfig?.remote ?? 'origin'
    this.docBranchname = gitConfig?.branchname ?? GIT_BRANCHNAME
    this.remotesBranchKey = `remotes/${this.remote}/${this.docBranchname}`

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
    if (this.originalBranchname === this.docBranchname) {
      log.error(log.errColor(`${log.errTag(' error ')}当前分支为doc2ts的git自动管理分支，请把分支切回开发分支再操作。`))
      process.exit(0)
    }

    const { outDir } = this.config
    const files = await filesStatus(`${outDir}/*`)

    if (files.length > 0) {
      const err = '目录下有文件没提交，请处理后在重试，本次操作将取消.'
      log.error(`${log.errTag(' error ')} ${log.link(`${outDir}`)} ${log.errColor(err)}`)
      process.exit(0)
    }

    const remote = await getrRemote()
    this.hasRemote = typeof remote === 'string' && remote !== ''

    // console.log(this.hasRemote)

    // 更新远程分支信息
    if (this.hasRemote) await gitUpdate()

    const { all, branches } = await getBranchList()
    const hasBranch = all.some(i => i === this.docBranchname)
    const [, remotesBranch] = Object.entries(branches).find(([key]) => key === this.remotesBranchKey) ?? []
    this.remotesBranch = remotesBranch
    // remotes/origin/pont

    if (hasBranch || remotesBranch) {
      // 本地存在doc分支
      await checkout(this.docBranchname)
      if (hasBranch && this.hasRemote) {
        // doc分支本地存在，需要更新
        const { behind } = await status()

        if (behind > 0) {
          // 更新远程分支
          try {
            await gitPull(this.remote, this.docBranchname)
          } catch (error) {
            log.error(`获取更新远程 ${this.docBranchname} 出错，请手动处理错误：`)
            log.error((error as GitResponseError<PullFailedResult>).message)
            process.exit(0)
          }
        }
      }
    } else {
      await this.initBranchname()
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
    try {
      await gitMerge(this.docBranchname)
    } catch (error: any) {
      const { merges = [] } = error?.git ?? {}
      if (Array.isArray(merges) && merges.length > 0) {
        merges.forEach(file => {
          log.log(log.warning(file))
        })
        log.log(log.warning('=== 合并冲突，请手动处理 ==='))
        log.log(log.warning('=== 合并冲突，请手动处理 ==='))
        log.log(log.warning('=== 合并冲突，请手动处理 ==='))
      }
      process.exit(0)
    }
    log.done(' ALL DONE ')
  }

  // async checkBranch() {
  //   // 1、更新远程分支信息
  //   // 2、检查远程分支是否存在
  //   // 3、查看远程分支是否有更新
  //   // 4、有更新则更新，否则跳过

  //   // 2、检查远程分支是否存在
  //   const { branches } = await getBranchList()
  //   const remotesBranch = Object.entries(branches).find(([key]) => key === `remotes/origin/${this.docBranchname}`)
  //   if (remotesBranch) {
  //     // 更新 远程分支
  //     const { behind } = await status()

  //     if (behind > 0) {
  //       // 更新远程分支
  //       try {
  //         await gitPull(this.docBranchname)
  //       } catch (error) {
  //         log.error(`获取更新远程 ${this.docBranchname} 出错，请手动处理错误：`)
  //         log.error((error as GitResponseError<PullFailedResult>).message)
  //       }
  //     }
  //   }
  // }

  async pushCommit() {
    if (!this.hasRemote) return
    try {
      const res = await status()
      const { ahead, tracking } = res
      if (ahead > 0 || tracking === null) {
        if (!this.remotesBranch) {
          // 远程分支不存在
          // 推送分支
          await gitPush(this.remote, this.docBranchname, ['-u'])
        } else {
          // 远程分支已存在
          // 直接posh代码即可
          await gitPush(this.remote, this.docBranchname)
        }
      }
    } catch (error) {
      log.error(`推送${this.docBranchname}分支的代码到远程服务器失败，请手动处理`)
      process.exit(0)
    }
  }
}
