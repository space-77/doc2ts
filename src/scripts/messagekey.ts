// 不是 git 管理的仓库
export const notGit = /not\s+a\s+git\s+repository/i

// 没有代码提交
export const noChanges = /no\s+changes\s+added\s+to\s+commit/i

// 没有代码commit
export const nothingCommit = /nothing\s+to\s+commit/i

// 没有代码commit
export const notBranch = /did\s+not\s+match\s+any\s+file\(s\)\s+known\s+to\s+git/i

// Git 更换换行符
export const replacedLF = /warning:\s+LF\s+will\s+be\s+replaced\s+by\s+CRLF/i

// Git 其中有文件被忽略
export const ignoredFile = /The\s+following\s+paths\s+are\s+ignored\s+by\s+one\s+of\s+your\s+.gitignore\s+files/i
