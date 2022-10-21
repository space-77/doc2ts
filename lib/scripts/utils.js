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
exports.getFirstCommitId = exports.gitMerge = exports.gitCommit = exports.getCommit = exports.gitAdd = exports.hasFileChange = exports.checkGit = exports.deleteBranch = exports.checkout = exports.createBranchname = exports.getBranchname = exports.getCommitId = exports.getGitVersion = exports.execSync = exports.decodeRes = void 0;
const fs_1 = __importDefault(require("fs"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const commands_1 = require("./commands");
const child_process_1 = require("child_process");
const messagekey_1 = require("./messagekey");
const config_1 = require("./config");
const log_1 = __importDefault(require("../utils/log"));
const utils_1 = require("../utils");
const encoding = 'cp936';
const binaryEncoding = 'binary';
function decodeRes(str) {
    return iconv_lite_1.default.decode(Buffer.from(str, binaryEncoding), encoding);
}
exports.decodeRes = decodeRes;
function execSync(command) {
    return new Promise(resolve => {
        log_1.default.info(command);
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
function createBranchname(branchname, commitId) {
    return __awaiter(this, void 0, void 0, function* () {
        // git checkout -b branchname commitId
        return yield execSync(`${commands_1.GET_CHECKOUT} -b ${branchname} ${commitId}`);
    });
}
exports.createBranchname = createBranchname;
function checkout(branchname) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSync(`${commands_1.GET_CHECKOUT} ${branchname}`);
    });
}
exports.checkout = checkout;
function deleteBranch(branchname) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSync(commands_1.GIT_DELETE_BRANCH + branchname);
    });
}
exports.deleteBranch = deleteBranch;
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
function hasFileChange(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const [err, stdout, stderr] = yield execSync(`${commands_1.GIT_STATUS} ${dirPath} -z`);
        if (err)
            throw new Error(stderr);
        return !!stdout;
    });
}
exports.hasFileChange = hasFileChange;
function gitAdd(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSync(commands_1.GIT_ADD + dirPath);
    });
}
exports.gitAdd = gitAdd;
function getCommit() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield execSync(commands_1.GIT_HEAD);
    });
}
exports.getCommit = getCommit;
function gitCommit(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const [err, stdout, stderr] = yield execSync(commands_1.GIT_COMMIT + message);
        if (messagekey_1.nothingCommit.test(stdout)) {
            // 没有更改 正常返回
            return [null, config_1.CODE.NOTHING_COMMIT, ''];
        }
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
function getFirstCommitId(fileName) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync((0, utils_1.getRootFilePath)(fileName)))
            return;
        const [err, stdout, stderr] = yield execSync(commands_1.GIT_LOG + fileName);
        if (err)
            throw new Error(stderr);
        const [_, id] = (_a = stdout.match(/(\S+)/)) !== null && _a !== void 0 ? _a : [];
        return id;
    });
}
exports.getFirstCommitId = getFirstCommitId;
