"use strict";
//  TODO 切换到 doc 分支后，被 .gitignore 忽略的文件肯能会重现导致 commit 异常
//  解决：只操作代码存放文件夹【待测试】
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
//  TODO doc2ts-config.ts 文件 内容可能不是最新的
//  解决：切换到 doc 分支前，复制 当前分支的 doc2ts-config.ts 内容到内存，等待分支切换成功后，把内容覆盖到 当前分支的 doc2ts-config.ts 文件
const fs_extra_1 = __importDefault(require("fs-extra"));
const index_1 = __importDefault(require("../doc2TsCore/index"));
const messagekey_1 = require("./messagekey");
const config_1 = require("../common/config");
const config_2 = require("./config");
const index_2 = require("../utils/index");
const utils_1 = require("./utils");
const log_1 = __importDefault(require("../utils/log"));
class Manage {
    constructor() {
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res;
                // 检测 git 是否能用 以及 读取配置信息
                res = yield this.loadConfig();
                if (res === config_2.CODE.NOT_GIT)
                    return;
                // 获取当前分支并保留
                yield this.getBranch();
                // 切换到 doc 分支
                res = yield this.checkout2Doc();
                if (res === config_2.CODE.NOT_GIT)
                    return;
                // 生成接口信息
                const doc2ts = new index_1.default();
                yield doc2ts.init();
                log_1.default.info('init');
                // commit 代码【检查有没有代码】
                res = yield this.checkStatus();
                log_1.default.info('checkStatus');
                if (res === config_2.CODE.NOTHING_COMMIT) {
                    // 没有代码变更
                    // 切换源分支
                    yield this.checkout2Base();
                    log_1.default.info('checkout2Base');
                    return;
                }
                // add
                yield this.addFile();
                log_1.default.info('addFile');
                // commit
                yield this.commitFile();
                log_1.default.info('commitFile');
                // 切换源分支
                yield this.checkout2Base();
                log_1.default.info('checkout2Base');
                // 合并 doc 分支代码
                yield this.mergeCode();
                log_1.default.info('mergeCode');
                // console.log(res)
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    loadConfig() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // 检测是不是使用 git 管理的代码
            const [err, stdout, stderr] = yield (0, utils_1.checkGit)();
            if (err)
                throw new Error(stderr);
            if (stdout === config_2.CODE.NOT_GIT)
                return config_2.CODE.NOT_GIT;
            // 读取 配置文件
            this.config = yield (0, index_2.getConfig)(config_1.CONFIG_PATH);
            const { outDir, gitConfig = { branchname: undefined } } = this.config;
            this.includeFiles = `${outDir}/* ${config_1.CONFIG_PATH}`;
            this.docBranchname = (_a = gitConfig.branchname) !== null && _a !== void 0 ? _a : config_2.GIT_BRANCHNAME;
            // console.log(config.outDir)
            // 复制 切换分支前的 doc2ts-config.ts 文件内容到 内存
            this.doc2tsConfigContent = fs_extra_1.default.readFileSync((0, index_2.getRootFilePath)(config_1.CONFIG_PATH));
        });
    }
    // 切换至源来分支
    checkout2Base() {
        return __awaiter(this, void 0, void 0, function* () {
            const { originalBranchname } = this;
            if (!originalBranchname)
                throw new Error('源分支不存在');
            const [err, stdout, stderr] = yield (0, utils_1.checkout)(originalBranchname);
            if (err)
                throw new Error(stderr);
        });
    }
    checkout2Doc() {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, stdout, stderr] = yield (0, utils_1.checkout)(this.docBranchname);
            if (messagekey_1.notBranch.test(stderr))
                return this.initBranchname();
            if (err)
                throw new Error(stderr);
        });
    }
    getBranch() {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, branchname, stderr] = yield (0, utils_1.getBranchname)();
            if (err)
                throw new Error(stderr);
            this.originalBranchname = branchname;
        });
    }
    initBranchname() {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, stdout, stderr] = yield (0, utils_1.checkout)(`-b ${this.docBranchname}`);
            if (err)
                throw new Error(stderr);
            // console.log(err, stdout, stderr)
            // if (notBranch.test(stdout)) return this.initBranchname()
            // console.log(err, stdout, stderr)
        });
    }
    checkStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, stdout, stderr] = yield (0, utils_1.gitStatus)(this.includeFiles);
            if (err)
                throw new Error(stderr);
            return stdout;
        });
    }
    addFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, stdout, stderr] = yield (0, utils_1.gitAdd)(this.includeFiles);
            // warning: LF will be replaced by CRLF
            if (messagekey_1.replacedLF.test(stderr))
                return stdout;
            if (err)
                throw new Error(stderr);
            return stdout;
        });
    }
    commitFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, stdout, stderr] = yield (0, utils_1.gitCommit)('"feat: update api files (doc2ts auto commmit)."');
            if (err)
                throw new Error(stderr);
            return stdout;
        });
    }
    mergeCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const [err, stdout, stderr] = yield (0, utils_1.gitMerge)(this.docBranchname);
            if (err)
                throw new Error(stderr);
            return stdout;
        });
    }
}
exports.default = Manage;
//# sourceMappingURL=manage.js.map