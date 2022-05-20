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
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs-extra");
const debugLog = require("../debugLog");
const utils_1 = require("../utils");
const templates_1 = require("../templates");
const promptList = [
    {
        type: 'input',
        message: '请设置数据源地址',
        name: 'originUrl',
        validate: (originUrl) => {
            if (!utils_1.judgeIsVaildUrl(originUrl)) {
                return '请输入正确的数据源地址';
            }
            return true;
        }
    },
    {
        type: 'input',
        message: '请设置自定义代码生成器(模板)的相对路径',
        name: 'templatePath',
        default: './pontTemplate'
    },
    {
        type: 'confirm',
        message: '是否使用内置模板？',
        name: 'useTemplate'
    },
    {
        type: 'list',
        message: '请选择内置模板类型:',
        name: 'templateType',
        choices: templates_1.templateRegistion.map((template) => template.templateType),
        when: function (answers) {
            return answers.useTemplate;
        }
    },
    {
        type: 'confirm',
        message: '是否使用自动化 mocks 服务？',
        name: 'enableMocks'
    },
    {
        type: 'input',
        message: '请设置生成代码存放的相对路径',
        name: 'outDir',
        default: './services'
    },
    {
        type: 'list',
        message: '请选择语言类型:',
        name: 'languageType',
        choices: [utils_1.Surrounding.javaScript, utils_1.Surrounding.typeScript]
    }
];
function generatePontConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const configPath = yield utils_1.lookForFiles(process.cwd(), utils_1.CONFIG_FILE);
        if (configPath) {
            const result = yield inquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                default: true,
                message: `检测到已存在pont-config文件，继续生成将覆盖配置项，是否继续？`
            });
            if (!result.confirm) {
                return;
            }
        }
        debugLog.info('配置文件生成中...');
        const answers = yield inquirer.prompt(promptList);
        generateConfig(configPath, answers);
        debugLog.success('文件生成成功。');
        debugLog.info(`
    其余配置项请参阅官方文档 https://github.com/alibaba/pont
  `);
    });
}
exports.generatePontConfig = generatePontConfig;
function generateConfig(configPath, answers) {
    const { originUrl, templatePath, outDir, enableMocks, surrounding } = answers;
    const dirName = path.join(process.cwd(), '/pont-config.json');
    let config = {};
    if (configPath) {
        try {
            const content = fs.readFileSync(configPath, 'utf8');
            config = JSON.parse(content);
        }
        catch (e) {
            throw new Error('pont-config.json is not a validate json');
        }
    }
    config.originUrl = originUrl;
    config.templatePath = templatePath;
    config.outDir = outDir;
    config.surrounding = surrounding;
    config.mocks = {
        enable: enableMocks
    };
    if (answers.templateType) {
        config.templateType = answers.templateType;
    }
    fs.writeFileSync(configPath || dirName, JSON.stringify(config, null, 2));
}
//# sourceMappingURL=start.js.map