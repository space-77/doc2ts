"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notCommitId = exports.ignoredFile = exports.replacedLF = exports.notBranch = exports.nothingCommit = exports.noChanges = exports.notGit = void 0;
// 不是 git 管理的仓库
exports.notGit = /not\s+a\s+git\s+repository/i;
// 没有代码提交
exports.noChanges = /no\s+changes\s+added\s+to\s+commit/i;
// 没有代码commit
exports.nothingCommit = /nothing\s+to\s+commit/i;
// 没有代码commit
exports.notBranch = /did\s+not\s+match\s+any\s+file\(s\)\s+known\s+to\s+git/i;
// Git 更换换行符
exports.replacedLF = /warning:\s+LF\s+will\s+be\s+replaced\s+by\s+CRLF/i;
// Git 其中有文件被忽略
exports.ignoredFile = /The\s+following\s+paths\s+are\s+ignored\s+by\s+one\s+of\s+your\s+.gitignore\s+files/i;
// commit id 不存在
exports.notCommitId = /reference\s+is\s+not\s+a\s+tree/i;
