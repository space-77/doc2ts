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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const prettier = require("prettier");
const ts = require("typescript");
const debugLog_1 = require("./debugLog");
const manage_1 = require("./manage");
const scripts_1 = require("./scripts");
const diff_1 = require("./diff");
const templates_1 = require("./templates");
const defaultTemplateCode = `
import * as Pont from 'pont-engine';
import { CodeGenerator, Interface } from "pont-engine";

export class FileStructures extends Pont.FileStructures {
}

export default class MyGenerator extends CodeGenerator {
}
`;
const defaultTransformCode = `
import { StandardDataSource } from "pont-engine";

export default function(dataSource: StandardDataSource): StandardDataSource {
  return dataSource;
}
`;
const defaultFetchMethodCode = `
import fetch from 'node-fetch';

export default function (url: string): string {
  return fetch(url).then(res => res.text())
}
`;
class Mocks {
    constructor() {
        this.enable = false;
        this.port = 8080;
        this.basePath = '';
        this.wrapper = `{
      "code": 0,
      "data": {response},
      "message": ""
    }`;
    }
}
exports.Mocks = Mocks;
var Surrounding;
(function (Surrounding) {
    Surrounding["typeScript"] = "typeScript";
    Surrounding["javaScript"] = "javaScript";
})(Surrounding = exports.Surrounding || (exports.Surrounding = {}));
var SurroundingFileName;
(function (SurroundingFileName) {
    SurroundingFileName["javaScript"] = "js";
    SurroundingFileName["typeScript"] = "ts";
})(SurroundingFileName = exports.SurroundingFileName || (exports.SurroundingFileName = {}));
class DataSourceConfig {
    constructor(config) {
        this.originUrl = '';
        this.originType = scripts_1.OriginType.SwaggerV2;
        this.usingOperationId = true;
        this.usingMultipleOrigins = false;
        this.spiltApiLock = false;
        this.taggedByName = true;
        this.templatePath = 'serviceTemplate';
        this.templateType = '';
        this.surrounding = Surrounding.typeScript;
        this.outDir = 'src/service';
        this.scannedRange = [];
        this.transformPath = '';
        this.fetchMethodPath = '';
        this.prettierConfig = {};
        this.pollingTime = 60 * 20;
        this.mocks = new Mocks();
        Object.keys(config).forEach((key) => {
            if (key === 'mocks') {
                this[key] = Object.assign(Object.assign({}, this[key]), config[key]);
            }
            else {
                this[key] = config[key];
            }
        });
    }
}
exports.DataSourceConfig = DataSourceConfig;
class Config extends DataSourceConfig {
    constructor(config) {
        super(config);
        this.origins = config.origins || [];
    }
    static getTransformFromConfig(config) {
        if (config.transformPath) {
            const moduleResult = getTemplate(config.transformPath, '', defaultTransformCode);
            if (moduleResult) {
                return moduleResult.default;
            }
        }
        return (id) => id;
    }
    static getFetchMethodFromConfig(config) {
        if (config.fetchMethodPath) {
            const fetchMethodPath = path.isAbsolute(config.fetchMethodPath)
                ? config.fetchMethodPath
                : path.join(process.cwd(), config.fetchMethodPath);
            const moduleResult = getTemplate(fetchMethodPath, '', defaultFetchMethodCode);
            if (moduleResult) {
                return moduleResult.default;
            }
        }
        return (id) => id;
    }
    validate() {
        if (this.origins && this.origins.length) {
            this.origins.forEach((origin, index) => {
                if (!origin.originUrl) {
                    return `请在 origins[${index}] 中配置 originUrl `;
                }
                if (!origin.name) {
                    return `请在 origins[${index}] 中配置 originUrl `;
                }
            });
        }
        else {
            if (!this.originUrl) {
                return '请配置 originUrl 来指定远程地址。';
            }
        }
        return '';
    }
    static createFromConfigPath(configPath) {
        const content = fs.readFileSync(configPath, 'utf8');
        try {
            const configObj = JSON.parse(content);
            return new Config(configObj);
        }
        catch (e) {
            throw new Error('pont-config.json is not a validate json');
        }
    }
    getDataSourcesConfig(configDir) {
        const _a = this, { origins } = _a, rest = __rest(_a, ["origins"]);
        const commonConfig = Object.assign(Object.assign({}, rest), { outDir: path.join(configDir, this.outDir), scannedRange: Array.isArray(this.scannedRange) ? this.scannedRange.map((dir) => path.join(configDir, dir)) : [], templatePath: this.templatePath ? path.join(configDir, this.templatePath) : undefined, transformPath: this.transformPath ? path.join(configDir, this.transformPath) : undefined, fetchMethodPath: this.fetchMethodPath ? path.join(configDir, this.fetchMethodPath) : undefined });
        if (this.origins && this.origins.length) {
            return this.origins.map((origin) => {
                return new DataSourceConfig(Object.assign(Object.assign(Object.assign({}, commonConfig), origin), { outDir: origin.outDir ? path.join(configDir, origin.outDir) : commonConfig.outDir }));
            });
        }
        return [new DataSourceConfig(commonConfig)];
    }
}
exports.Config = Config;
function format(fileContent, prettierOpts = {}) {
    try {
        return prettier.format(fileContent, Object.assign({ parser: 'typescript', trailingComma: 'all', singleQuote: true }, prettierOpts));
    }
    catch (e) {
        debugLog_1.error(`代码格式化报错！${e.toString()}\n代码为：${fileContent}`);
        return fileContent;
    }
}
exports.format = format;
function getDuplicateById(arr, idKey = 'name') {
    if (!arr || !arr.length) {
        return null;
    }
    let result;
    arr.forEach((item, itemIndex) => {
        if (arr.slice(0, itemIndex).find((o) => o[idKey] === item[idKey])) {
            result = item;
            return;
        }
    });
    return result;
}
exports.getDuplicateById = getDuplicateById;
function transformModsName(mods) {
    mods.forEach((mod) => {
        const currName = mod.name;
        const sameMods = mods.filter((mod) => mod.name.toLowerCase() === currName.toLowerCase());
        if (sameMods.length > 1) {
            mod.name = transformDashCase(mod.name);
        }
    });
}
exports.transformModsName = transformModsName;
function transformDashCase(name) {
    return name.replace(/[A-Z]/g, (ch) => '_' + ch.toLowerCase());
}
function transformCamelCase(name) {
    let words = [];
    let result = '';
    if (name.includes('-')) {
        words = name.split('-');
    }
    else if (name.includes(' ')) {
        words = name.split(' ');
    }
    else {
        if (typeof name === 'string') {
            result = name;
        }
        else {
            throw new Error('mod name is not a string: ' + name);
        }
    }
    if (words && words.length) {
        result = words
            .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
            .join('');
    }
    result = result.charAt(0).toLowerCase() + result.slice(1);
    if (result.endsWith('Controller')) {
        result = result.slice(0, result.length - 'Controller'.length);
    }
    return result;
}
exports.transformCamelCase = transformCamelCase;
function transformDescription(description) {
    const words = description.split(' ').filter((word) => word !== 'Controller');
    const [firstWord, ...rest] = words;
    const sFirstWord = firstWord.charAt(0).toLowerCase() + firstWord.slice(1);
    return [sFirstWord, ...rest].join('');
}
exports.transformDescription = transformDescription;
function toUpperFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
exports.toUpperFirstLetter = toUpperFirstLetter;
function getMaxSamePath(paths, samePath = '') {
    if (!paths.length) {
        return samePath;
    }
    if (paths.some((path) => !path.includes('/'))) {
        return samePath;
    }
    const segs = paths.map((path) => {
        const [firstSeg, ...restSegs] = path.split('/');
        return { firstSeg, restSegs };
    });
    if (segs.every((seg, index) => index === 0 || seg.firstSeg === segs[index - 1].firstSeg)) {
        return getMaxSamePath(segs.map((seg) => seg.restSegs.join('/')), samePath + '/' + segs[0].firstSeg);
    }
    return samePath;
}
exports.getMaxSamePath = getMaxSamePath;
function getIdentifierFromUrl(url, requestType, samePath = '') {
    const currUrl = url.slice(samePath.length).match(/([^\.]+)/)[0];
    return (requestType +
        currUrl
            .split('/')
            .map((str) => {
            if (str.includes('-')) {
                str = str.replace(/(\-\w)+/g, (_match, p1) => {
                    if (p1) {
                        return p1.slice(1).toUpperCase();
                    }
                });
            }
            if (str.match(/^{.+}$/gim)) {
                return 'By' + toUpperFirstLetter(str.slice(1, str.length - 1));
            }
            return toUpperFirstLetter(str);
        })
            .join(''));
}
exports.getIdentifierFromUrl = getIdentifierFromUrl;
const TS_KEYWORDS = ['delete', 'export', 'import', 'new', 'function'];
const REPLACE_WORDS = ['remove', 'exporting', 'importing', 'create', 'functionLoad'];
function getIdentifierFromOperatorId(operationId) {
    const identifier = operationId.replace(/(.+)(Using.+)/, '$1');
    const index = TS_KEYWORDS.indexOf(identifier);
    if (index === -1) {
        return identifier;
    }
    return REPLACE_WORDS[index];
}
exports.getIdentifierFromOperatorId = getIdentifierFromOperatorId;
function getTemplate(templatePath, templateType, defaultValue = defaultTemplateCode) {
    if (!fs.existsSync(templatePath + '.ts')) {
        fs.writeFileSync(templatePath + '.ts', templates_1.getTemplateByTemplateType(templateType) || defaultValue);
    }
    const tsResult = fs.readFileSync(templatePath + '.ts', 'utf8');
    const jsResult = ts.transpileModule(tsResult, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2015,
            module: ts.ModuleKind.CommonJS
        }
    });
    const noCacheFix = (Math.random() + '').slice(2, 5);
    const jsName = templatePath + noCacheFix + '.js';
    let moduleResult;
    try {
        fs.writeFileSync(jsName, jsResult.outputText, 'utf8');
        moduleResult = require(jsName);
        fs.removeSync(jsName);
    }
    catch (e) {
        if (fs.existsSync(jsName)) {
            fs.removeSync(jsName);
        }
        if (!moduleResult) {
            throw new Error(e);
        }
    }
    return moduleResult;
}
exports.getTemplate = getTemplate;
function getTemplatesDirFile(fileName, filePath = 'templates/') {
    return fs.readFileSync(__dirname.substring(0, __dirname.lastIndexOf('lib')) + filePath + fileName, 'utf8');
}
exports.getTemplatesDirFile = getTemplatesDirFile;
function judgeTemplatesDirFileExists(fileName, filePath = 'templates/') {
    return fs.existsSync(__dirname.substring(0, __dirname.lastIndexOf('lib')) + filePath + fileName);
}
exports.judgeTemplatesDirFileExists = judgeTemplatesDirFileExists;
function lookForFiles(dir, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield fs.readdir(dir);
        for (let file of files) {
            const currName = path.join(dir, file);
            const info = yield fs.lstat(currName);
            if (info.isDirectory()) {
                if (file === '.git' || file === 'node_modules') {
                    continue;
                }
                const result = yield lookForFiles(currName, fileName);
                if (result) {
                    return result;
                }
            }
            else if (info.isFile() && file === fileName) {
                return currName;
            }
        }
    });
}
exports.lookForFiles = lookForFiles;
function toDashCase(name) {
    const dashName = name
        .split(' ')
        .join('')
        .replace(/[A-Z]/g, (p) => '-' + p.toLowerCase());
    if (dashName.startsWith('-')) {
        return dashName.slice(1);
    }
    return dashName;
}
exports.toDashCase = toDashCase;
function toDashDefaultCase(name) {
    let dashName = name
        .split(' ')
        .join('')
        .replace(/[A-Z]/g, (p) => '-' + p.toLowerCase());
    if (dashName.startsWith('-')) {
        dashName = dashName.slice(1);
    }
    if (dashName.endsWith('-controller')) {
        return dashName.slice(0, dashName.length - '-controller'.length);
    }
    return dashName;
}
exports.toDashDefaultCase = toDashDefaultCase;
function hasChinese(str) {
    return (str &&
        str.match(/[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uff1a\uff0c\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|[\uff01-\uff5e\u3000-\u3009\u2026]/));
}
exports.hasChinese = hasChinese;
const PROJECT_ROOT = process.cwd();
exports.CONFIG_FILE = 'pont-config.json';
function createManager(configFile = exports.CONFIG_FILE) {
    return __awaiter(this, void 0, void 0, function* () {
        const configPath = yield lookForFiles(PROJECT_ROOT, configFile);
        if (!configPath) {
            return;
        }
        const config = Config.createFromConfigPath(configPath);
        const manager = new manage_1.Manager(PROJECT_ROOT, config, path.dirname(configPath));
        yield manager.ready();
        return manager;
    });
}
exports.createManager = createManager;
function diffDses(ds1, ds2) {
    const mapModel = (model) => Object.assign({}, model, { details: [] });
    const modDiffs = diff_1.diff(ds1.mods.map(mapModel), ds2.mods.map(mapModel));
    const boDiffs = diff_1.diff(ds1.baseClasses.map(mapModel), ds2.baseClasses.map(mapModel));
    return {
        modDiffs,
        boDiffs
    };
}
exports.diffDses = diffDses;
function reviseModName(modName) {
    return modName.replace(/\//g, '.').replace(/^\./, '').replace(/\./g, '_');
}
exports.reviseModName = reviseModName;
function getFileName(fileName, surrounding) {
    const isInvalidSurrounding = Surrounding[surrounding];
    if (isInvalidSurrounding) {
        return `${fileName}.${SurroundingFileName[isInvalidSurrounding]}`;
    }
    return `${fileName}.ts`;
}
exports.getFileName = getFileName;
function judgeIsVaildUrl(url) {
    return /^(http|https):.*?$/.test(url);
}
exports.judgeIsVaildUrl = judgeIsVaildUrl;
function getDefsTypeBos(dataTypes) {
    const defsTypeBaseClasses = dataTypes
        .map((item) => item.isDefsType ? [item.typeName, ...getDefsTypeBos(item.typeArgs)] : getDefsTypeBos(item.typeArgs))
        .reduce((acc, item) => [...acc, ...item], []);
    return defsTypeBaseClasses;
}
exports.getDefsTypeBos = getDefsTypeBos;
function getRelatedBos(mod) {
    const dataTypes = mod.interfaces
        .map((item) => [...item.parameters, { dataType: item.response }])
        .reduce((acc, item) => [...acc, ...item], [])
        .map((item) => item.dataType);
    return new Set(getDefsTypeBos(dataTypes).filter(Boolean));
}
exports.getRelatedBos = getRelatedBos;
//# sourceMappingURL=utils.js.map