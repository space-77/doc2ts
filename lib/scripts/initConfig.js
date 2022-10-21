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
const fs_1 = __importDefault(require("fs"));
const log_1 = __importDefault(require("../utils/log"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../common/config");
const utils_1 = require("../utils");
const inquirer_1 = __importDefault(require("inquirer"));
const defaultOriginUrl = 'https://petstore.swagger.io/v2/swagger.json';
const CONFIG_FILE_PATH = path_1.default.join(process.cwd(), config_1.CONFIG_PATH);
const promptList = [
    {
        type: 'input',
        message: '请设置数据源地址',
        name: 'originUrl',
        default: defaultOriginUrl,
        validate: originUrl => {
            if (!(0, utils_1.judgeIsVaildUrl)(originUrl)) {
                return '请输入正确的数据源地址';
            }
            return true;
        }
    },
    {
        type: 'confirm',
        message: '是否生成基类文件(请求方法需您自行实现)',
        name: 'createBaseClass',
        default: true
    },
    {
        type: 'input',
        message: '请设置基类存放相对路径',
        name: 'baseClassPath',
        default: './src/services/client.ts'
    },
    {
        type: 'input',
        message: '请设置基类名称',
        name: 'baseClassName',
        default: 'ApiClient'
    },
    {
        type: 'input',
        message: '请设置生成代码存放的相对路径',
        name: 'outDir',
        default: './src/services'
    },
    {
        type: 'list',
        message: '请选择语言类型:',
        name: 'languageType',
        choices: [config_1.Surrounding.typeScript, config_1.Surrounding.javaScript]
    }
];
function loadTempFile(filePath) {
    return fs_1.default.readFileSync(path_1.default.join(__dirname, filePath)).toString();
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const exists = fs_1.default.existsSync(CONFIG_FILE_PATH);
        if (exists) {
            const { confirm } = yield inquirer_1.default.prompt({
                type: 'confirm',
                name: 'confirm',
                default: true,
                message: `检测到已存在doc2ts-config文件，继续生成将覆盖配置项，是否继续？`
            });
            if (!confirm)
                return;
        }
        log_1.default.info('配置文件生成中...');
        const answers = yield inquirer_1.default.prompt(promptList);
        generateConfig(answers);
    });
}
exports.default = init;
function generateConfig(answers) {
    return __awaiter(this, void 0, void 0, function* () {
        const { originUrl, baseClassPath, baseClassName, outDir, languageType, createBaseClass } = answers;
        const tips = defaultOriginUrl === originUrl ? '/* 请把这个地址更换为您的地址 */' : '';
        const origins = `[{ url: ${tips} '${originUrl}' }]`;
        try {
            let content = loadTempFile('../temp/doc2ts-comfig');
            content = content.replace(/\{outDir\}/, outDir);
            content = content.replace(/\{origins\}/, origins);
            content = content.replace(/\{languageType\}/, languageType);
            content = content.replace(/\{baseClassPath\}/, baseClassPath);
            content = content.replace(/\{baseClassName\}/, baseClassName);
            yield (0, utils_1.createFile)(CONFIG_FILE_PATH, content);
            log_1.default.success('配置文件已生成');
            if (createBaseClass)
                generateBacsClass(baseClassPath, baseClassName, languageType);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function generateBacsClass(baseClassPath, baseClassName, languageType) {
    return __awaiter(this, void 0, void 0, function* () {
        log_1.default.info('基类文件生成中...');
        try {
            const isJs = /(js|javascript)/i.test(languageType);
            let content = loadTempFile('../temp/baseClassFile');
            content = content.replace(/\{baseClassName\}/, baseClassName);
            const filePath = path_1.default.join(process.cwd(), baseClassPath);
            yield (0, utils_1.createFile)(filePath, content);
            if (isJs) {
                (0, utils_1.ts2Js)([filePath], true);
                fs_1.default.unlinkSync(filePath);
            }
            log_1.default.success('基类文件已生成');
        }
        catch (error) {
            console.error(error);
        }
    });
}
