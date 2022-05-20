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
exports.traverseDir = exports.checkJsLang = exports.judgeIsVaildUrl = exports.getModelUrl = exports.format = exports.createFile = exports.resolveOutPath = exports.rename = exports.getConfig = exports.loadPrettierConfig = exports.findDiffPath = exports.firstToLower = exports.firstToUpper = exports.camel2Kebab = void 0;
const fs_1 = __importDefault(require("fs"));
const typescript_1 = __importDefault(require("typescript"));
const api_1 = __importDefault(require("./api"));
const log_1 = __importDefault(require("./log"));
const path_1 = __importDefault(require("path"));
const prettier_1 = __importDefault(require("prettier"));
const config_1 = require("../common/config");
/**
 * @param str
 * @description 烤串转驼峰
 */
function camel2Kebab(str) {
    return str.replace(/-(\w)/g, (_, $1) => $1.toUpperCase());
}
exports.camel2Kebab = camel2Kebab;
/**
 * @param str
 * @description 首字母大写
 */
function firstToUpper(str) {
    return str.replace(/^(\S)/g, val => val.toUpperCase());
}
exports.firstToUpper = firstToUpper;
/**
 * @param str
 * @description 首字母小写
 */
function firstToLower(str) {
    return str.replace(/^(\S)/g, val => val.toLocaleLowerCase());
}
exports.firstToLower = firstToLower;
/**
 * @param originPath 起始位置
 * @param targetPath 目标位置
 * @description 计算某个路径和另一个路径之间的差值
 */
function findDiffPath(originPath, targetPath) {
    const diffPath = path_1.default.relative(originPath, targetPath).replace(/\\\\?/g, '/');
    return /^\.\.?\//.test(diffPath) ? diffPath : `./${diffPath}`; // 处理同级目录应用异常问题
}
exports.findDiffPath = findDiffPath;
function getRootFilePath(filePath) {
    const prePath = findDiffPath(__dirname, `${process.cwd()}\\`);
    return path_1.default.join(__dirname, prePath, filePath);
}
function loadPrettierConfig(prettierPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let filePath;
        if (!prettierPath) {
            const fileType = [
                getRootFilePath('./.prettierrc.js'),
                getRootFilePath('./prettier.config.js'),
                getRootFilePath('./prettier.config.cjs'),
                getRootFilePath('./.prettierrc'),
                getRootFilePath('./.prettierrc.json'),
                getRootFilePath('./.prettierrc.json5')
            ];
            filePath = fileType.find(i => fs_1.default.existsSync(i));
        }
        else {
            filePath = getRootFilePath(prettierPath);
        }
        if (!filePath) {
            config_1.PrettierConfig.config = require(getRootFilePath('./package.json')).prettier;
        }
        else {
            try {
                // .js .cjs  .json
                if (/\.(c?js|json)$/.test(filePath)) {
                    // js
                    config_1.PrettierConfig.config = require(filePath);
                }
                else {
                    // json
                    config_1.PrettierConfig.config = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8').toString());
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    });
}
exports.loadPrettierConfig = loadPrettierConfig;
function getConfig(configPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const noCacheFix = (Math.random() + '').slice(2, 5);
        const jsName = path_1.default.join(__dirname, `__${noCacheFix}__.js`);
        try {
            log_1.default.info('正在读取配置文件');
            const filePath = getRootFilePath(configPath);
            const stat = fs_1.default.statSync(filePath);
            if (!stat.isFile())
                throw new Error('配置文件不存在');
            const tsResult = fs_1.default.readFileSync(filePath, 'utf8');
            const jsResult = typescript_1.default.transpileModule(tsResult, {
                compilerOptions: {
                    target: typescript_1.default.ScriptTarget.ES2015,
                    module: typescript_1.default.ModuleKind.CommonJS
                }
            });
            // 编译到js
            fs_1.default.writeFileSync(jsName, jsResult.outputText, 'utf8');
            // 删除该文件
            const res = require(jsName).default;
            fs_1.default.unlinkSync(jsName);
            return res;
        }
        catch (error) {
            log_1.default.error('读取配置文件失败');
            if (fs_1.default.existsSync(jsName))
                fs_1.default.unlinkSync(jsName);
            throw new Error('加载配置文件失败');
        }
    });
}
exports.getConfig = getConfig;
function rename(name, method) {
    if (typeof method === 'function') {
        return method(name);
    }
    else if (typeof method === 'string' || method instanceof RegExp) {
        return name.replace(method, '');
    }
    return name;
}
exports.rename = rename;
/**
 * @param preDirPath
 * @description 获取文件夹路径
 */
function resolveOutPath(...paths) {
    return path_1.default.join(process.cwd(), ...paths);
}
exports.resolveOutPath = resolveOutPath;
/**
 * @description 创建文件
 */
function createFile(filePath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dirList = filePath.split(path_1.default.sep);
            const fileName = dirList[dirList.length - 1];
            const dirPath = path_1.default.join(...dirList.slice(0, dirList.length - 1));
            if (!fs_1.default.existsSync(dirPath))
                fs_1.default.mkdirSync(dirPath, { recursive: true });
            log_1.default.info(`正在创建：${fileName} 文件`);
            fs_1.default.writeFileSync(filePath, format(content, config_1.PrettierConfig.config));
        }
        catch (error) {
            log_1.default.error('创建失败');
            console.error(error);
            return Promise.reject(error);
        }
    });
}
exports.createFile = createFile;
/**
 * @description 格式化代码
 */
function format(fileContent, prettierOpts = {}) {
    try {
        return prettier_1.default.format(fileContent, Object.assign({ parser: 'typescript' }, prettierOpts));
    }
    catch (e) {
        log_1.default.error(`代码格式化报错！${e.toString()}\n代码为：${fileContent}`);
        return fileContent;
    }
}
exports.format = format;
function getModelList(url, count = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = url.replace(/\/$/, '');
        try {
            log_1.default.info('正在拉取 swagger-bootstrap-ui 文档信息');
            const data = yield api_1.default.get(`${baseUrl}/swagger-resources`);
            if (data.length === 0 && count <= 4) {
                return yield getModelList(url, count + 1);
            }
            if (!data || !Array.isArray(data) || data.length === 0) {
                log_1.default.error('数据加载失败');
                throw new Error('数据加载异常');
            }
            log_1.default.ok();
            return data.map(i => (Object.assign(Object.assign({}, i), { url: `${baseUrl}${i.url}` })));
        }
        catch (error) {
            log_1.default.error('数据加载失败');
            return Promise.reject(error);
        }
    });
}
function getModelUrl(origins) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlBaseUrl = origins.filter(i => i.isSwaggerBootstrapUi).map(({ url }) => url);
        const urlList = origins.filter(i => !i.isSwaggerBootstrapUi); // .map(i => ({ name: i.modelName, url: i.url }))
        const apiUrls = urlList.map(i => {
            const [_, version = 2] = i.url.match(/\/v(\d)\//) || [];
            const swaggerVersion = `${version}.0`;
            return Object.assign(Object.assign({}, i), { swaggerVersion });
        });
        const reqs = urlBaseUrl.map((url) => __awaiter(this, void 0, void 0, function* () {
            const modelList = yield getModelList(url);
            apiUrls.push(...modelList);
        }));
        yield Promise.all(reqs);
        return apiUrls;
    });
}
exports.getModelUrl = getModelUrl;
/** 检测是否是合法url */
function judgeIsVaildUrl(url) {
    return /^(http|https):.*?$/.test(url);
}
exports.judgeIsVaildUrl = judgeIsVaildUrl;
function checkJsLang(lang = 'ts') {
    return /js|javascript/i.test(lang);
}
exports.checkJsLang = checkJsLang;
/**
 * @description 遍历文件夹下的文件
 */
const traverseDir = ({ dirPath, prePath = '', callback }) => {
    fs_1.default.readdirSync(dirPath).forEach(name => {
        const filePath = path_1.default.join(dirPath, name);
        const stat = fs_1.default.statSync(filePath);
        if (stat.isFile()) {
            callback === null || callback === void 0 ? void 0 : callback({ filePath, name, stat, prePath });
        }
        else if (stat.isDirectory()) {
            (0, exports.traverseDir)({ dirPath: filePath, prePath: `${prePath}/${name}`, callback });
        }
    });
};
exports.traverseDir = traverseDir;
//# sourceMappingURL=index.js.map