export enum CODE {
  COMMIT_TYPE = '',
  COMMIT_MESSAGE = 'doc2ts auto commit',
  /**
   * @desc 没有任何代码修改 正常返回即可
   */
  NOTHING_COMMIT = '___ nothing commit ___',
  /**
   * @desc 不是 git 管理的仓库
   */
  NOT_GIT = '___  not a git repository ___'
}

export const GIT_BRANCHNAME = 'doc2ts'
