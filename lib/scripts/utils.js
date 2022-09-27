"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitMerge = exports.gitCommit = exports.gitAdd = exports.gitStatus = exports.checkGit = exports.checkout = exports.getBranchname = exports.getCommitId = exports.getGitVersion = exports.execSync = exports.decodeRes = void 0;
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const commands_1 = require("./commands");
const child_process_1 = require("child_process");
const messagekey_1 = require("./messagekey");
const config_1 = require("./config");
const encoding = 'cp936';
const binaryEncoding = 'binary';
function decodeRes(str) {
    return iconv_lite_1.default.decode(Buffer.from(str, binaryEncoding), encoding);
}
exports.decodeRes = decodeRes;
function execSync(command) {
    return new Promise(resolve => {
        (0, child_process_1.exec)(command, { encoding: binaryEncoding }, (err, stdout, stderr) => {
            resolve([
                JSON.parse(decodeRes(JSON.stringify(err))),
                decodeRes(stdout).replace(/[\n\r?]+$/, ''),
                decodeRes(stderr)
            ]);
        });
    });
}
exports.execSync = execSync;
/**
 * @desc 获取 当前 git 版本
 */
function getGitVersion() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const [err, stdout, stderr] = yield execSync(commands_1.GIT_VERSION);
        const [_, version] = (_a = stdout.match(/(\d+\.\d+\.\d+)/)) !== null && _a !== void 0 ? _a : [];
        return [err, version, stderr];
    });
}
exports.getGitVersion = getGitVersion;
function getCommitId() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSync(commands_1.GET_REV_PARSE);
    });
}
exports.getCommitId = getCommitId;
// originalBranchname
function getBranchname() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSync(commands_1.GIT_BRANCH);
    });
}
exports.getBranchname = getBranchname;
function checkout(branchname) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSync(commands_1.GET_CHECKOUT + branchname);
    });
}
exports.checkout = checkout;
function checkGit() {
    return __awaiter(this, void 0, void 0, function* () {
        const [err, stdout, stderr] = yield execSync(commands_1.GIT_STATUS);
        if (messagekey_1.notGit.test(stdout)) {
            // 不是 git 管理的仓库
            return [null, config_1.CODE.NOT_GIT, ''];
        }
        return [err, stdout, stderr];
    });
}
exports.checkGit = checkGit;
function gitStatus(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const [err, stdout, stderr] = yield execSync(commands_1.GIT_STATUS + dirPath);
        if (messagekey_1.nothingCommit.test(stdout)) {
            // 没有更改 正常返回
            return [null, config_1.CODE.NOTHING_COMMIT, ''];
        }
        else if (messagekey_1.ignoredFile.test(stderr)) {
            return [null, stdout, ''];
        }
        return [err, stdout, stderr];
    });
}
exports.gitStatus = gitStatus;
function gitAdd(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSync(commands_1.GIT_ADD + dirPath);
    });
}
exports.gitAdd = gitAdd;
function gitCommit(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const [err, stdout, stderr] = yield execSync(commands_1.GIT_COMMIT + message);
        if (err) {
            if (messagekey_1.noChanges.test(stdout)) {
                // 没有更改 正常返回
                return [null, config_1.CODE.NOTHING_COMMIT, stderr];
            }
        }
        return [err, stdout, stderr];
    });
}
exports.gitCommit = gitCommit;
function gitMerge(branchname) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSync(commands_1.GIT_MERGE + branchname);
    });
}
exports.gitMerge = gitMerge;
//# sourceMappingURL=utils.js.map