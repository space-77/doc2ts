//  TODO 切换到 doc 分支后，被 .gitignore 忽略的文件肯能会重现导致 commit 异常
//  解决：只操作代码存放文件夹【待测试】

//  TODO doc2ts-config.ts 文件 内容可能不是最新的
//  解决：切换到 doc 分支前，复制 当前分支的 doc2ts-config.ts 内容到内存，等待分支切换成功后，把内容覆盖到 当前分支的 doc2ts-config.ts 文件

import fs from 'fs-extra'
import { CONFIG_PATH } from '../common/config'
import { getConfig, getRootFilePath } from '../utils'
import { CODE, GIT_BRANCHNAME } from './config'
import { checkGit, checkout, getCommitId, getGitVersion, gitAdd, gitCommit, gitStatus } from './utils'

async function start() {
  try {
    // 检测是不是使用 git 管理的代码
    const [err, stdout, stderr] = await checkGit()
    if (err) throw new Error(stderr)
    if (stdout === CODE.NOT_GIT) return CODE.NOT_GIT

    // 读取 配置文件
    const config = await getConfig(CONFIG_PATH)
    console.log(config.outDir)

    // 复制 切换分支前的 doc2ts-config.ts 文件内容到 内存
    const doc2tsConfigContent = fs.readFileSync(getRootFilePath(CONFIG_PATH))
    console.log(doc2tsConfigContent)

    // 切换分支到 doc 分支
    // const [err, stdout, stderr] = await checkout(config.gitConfig?.branchname ?? GIT_BRANCHNAME)
  } catch (error) {
    console.error(error)
  }
}

start()

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
