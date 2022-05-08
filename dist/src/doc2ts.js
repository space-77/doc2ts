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
const path_1 = __importDefault(require("path"));
const api_1 = __importDefault(require("./api"));
const utils_1 = require("./utils");
const typesList_1 = __importDefault(require("./typesList"));
const log_1 = __importDefault(require("./log"));
class Doc2Ts {
    constructor() {
        this.configPath = './doc2ts.config.ts';
        this.modelList = []; // 模块数据
        this.baseModelInfoList = []; // 原始数据
        this.modelInfoList = []; // 整理后的数据
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                log_1.default.clear();
                yield this.getConfig();
                this.createAxios();
                yield this.getDocData();
                log_1.default.success('------- 任务成功 ------');
                log_1.default.success('------- 任务成功 ------');
                log_1.default.success('------- 任务成功 ------');
            }
            catch (error) {
                console.error(error);
                log_1.default.error('----任务终止----');
                log_1.default.error('----任务终止----');
                log_1.default.error('----任务终止----');
            }
        });
    }
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield (0, utils_1.getConfig)(this.configPath);
                const { originUrl, outDir, moduleConfig, resultGenerics, dataKey, rename, baseClassName, baseClassPath, render, typeFileRender } = config;
                if (!baseClassPath || !originUrl)
                    throw new Error('必要参数异常');
                this.rename = rename;
                this.outDir = outDir || './services';
                this.render = render;
                this.dataKey = dataKey;
                this.baseClassName = baseClassName || 'ApiClient';
                this.originUrl = originUrl;
                this.moduleConfig = moduleConfig;
                this.baseClassPath = baseClassPath;
                this.typeFileRender = typeFileRender;
                this.resultGenerics = resultGenerics || 'T';
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    createAxios() {
        this.api = new api_1.default(this.originUrl);
    }
    getDocData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getModelList();
                const reqList = this.modelList.map(i => this.getModelInfoList(i.name, i.url));
                yield Promise.all(reqList);
                this.formatData();
                // fs.writeFileSync(path.join(__dirname, '../dist/baseModelInfoList.json'), JSON.stringify(this.baseModelInfoList))
                // fs.writeFileSync(path.join(__dirname, '../dist/modelInfoList.json'), JSON.stringify(this.modelInfoList))
                yield this.createFileContent();
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getModelList(count = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                log_1.default.info('正在拉取 swagger 文档信息');
                const { data = [] } = yield this.api.getModelList();
                if (data.length === 0 && count <= 4) {
                    yield this.getModelList(count + 1);
                    return;
                }
                if (!data || !Array.isArray(data) || data.length === 0) {
                    log_1.default.error('数据加载失败');
                    throw new Error('数据加载异常');
                }
                this.modelList = data;
                log_1.default.ok();
            }
            catch (error) {
                log_1.default.error('数据加载失败');
                return Promise.reject(error);
            }
        });
    }
    getModelInfoList(name, modelPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.api.getModelInfoList(modelPath);
                const modelName = (0, utils_1.rename)((0, utils_1.camel2Kebab)(name), this.rename);
                if (!modelName)
                    throw Error('模块名称不存在');
                this.baseModelInfoList.push({ data, modelName: (0, utils_1.firstToLower)(modelName) });
            }
            catch (error) {
                console.error(error);
                return Promise.reject(error);
            }
        });
    }
    /**
     * @description 整理数据结构
     */
    formatData() {
        log_1.default.info('正在整理数据');
        const { baseModelInfoList, moduleConfig = {}, resultGenerics, dataKey } = this;
        this.modelInfoList = baseModelInfoList.map(item => new typesList_1.default(item, moduleConfig, resultGenerics, dataKey));
        log_1.default.ok();
    }
    createApiMethod(apiInfos) {
        return apiInfos
            .map(i => {
            const { requestInfo, funcInfo, methodConfig } = i;
            const { funcName, funcTypeName } = funcInfo;
            const { description, isDownload, config } = methodConfig;
            const { url, params, restParameters } = requestInfo;
            const noParams = restParameters.length === 0;
            const bodyParams = restParameters.filter(i => i.inType === 'body');
            const queryParams = restParameters.filter(i => i.inType === 'query');
            const filterBody = bodyParams.length !== restParameters.length;
            const filterQuery = queryParams.length !== restParameters.length;
            let filterCode = '';
            if (filterBody && bodyParams.length > 0) {
                filterCode += `const bodyParams = ${JSON.stringify(bodyParams.map(i => i.keyName)).replace(/"/g, "'")}\n`;
                filterCode += `    const body = this.extractParams(params, bodyParams)`;
            }
            if (filterQuery && queryParams.length > 0) {
                const codeArray = JSON.stringify(queryParams.map(i => i.keyName)).replace(/"/g, "'");
                filterCode += `${filterCode ? '\n' : ''}    const queryParams = ${codeArray}\n`;
                filterCode += `    const query = this.extractParams(params, queryParams)`;
            }
            filterCode = filterCode ? `\n    ${filterCode}` : '';
            const query = queryParams.length > 0 ? `?\${this.serialize(${filterQuery ? 'query' : 'params'})}` : '';
            const body = bodyParams.length > 0 ? `, ${filterBody ? `params: body` : 'params'}` : '';
            const hideMethod = (!body && /get/i.test(i.method)) || (!noParams && /post/i.test(i.method));
            const method = hideMethod ? '' : `, method: '${i.method}'`;
            const requestMethod = isDownload ? 'downloadFile' : 'request';
            const requestConfig = config ? `, config: ${JSON.stringify(config)}` : '';
            return `
  /**
   * @description ${description || i.summary}
  */
  ${funcName}: mT.${funcTypeName} = ${/^params$/.test(params) ? 'params' : `(${params})`} => {${filterCode}
    return this.${requestMethod}({ url: \`\${basePath}${url}${query}\`${body}${method}${requestConfig} })
  }\n`;
        })
            .join('');
    }
    /**
     *
     * @description 创建 接口方法文件
     */
    createApiFile({ modelName, apiInfos, basePath, beforeName }) {
        const className = `${(0, utils_1.firstToUpper)(modelName)}`;
        const apiMethodList = this.createApiMethod(apiInfos);
        const { baseClassName, baseClassPath, moduleConfig, render } = this;
        // const {baseClassPath = './src/api/services/client', render } = this.config
        const savePath = this.getDirPaht('module');
        const targetPath = path_1.default.join(process.cwd(), baseClassPath);
        const _baseClassPath = (0, utils_1.findDiffPath)(savePath, targetPath);
        let content = `
import { ${baseClassName} } from '${_baseClassPath}'
import * as mT from './type/${modelName}'\n
const basePath = '${basePath}'

/**
 * @description ${beforeName}
 */
class ${className} extends ApiClient {${apiMethodList}}\n
export default new ${className}()\n`;
        content = render ? render(content, modelName, (moduleConfig === null || moduleConfig === void 0 ? void 0 : moduleConfig[modelName]) || {}) : content;
        return this.createFile(savePath, (0, utils_1.firstToLower)(`${className}.ts`), content);
    }
    /**
     * @id 创建 接口方法类型文件
     */
    createApiTypeFile({ modelName, apiInfos, typesList }) {
        const { moduleConfig, typeFileRender } = this;
        let methodTypes = '';
        let typesListStr = '';
        try {
            apiInfos.forEach(i => {
                const { funcInfo } = i;
                const { funcType } = funcInfo;
                methodTypes += `${funcType}\n`;
            });
            typesList.forEach(i => {
                typesListStr += `${(0, utils_1.createType)(i)}\n`;
            });
            let content = `${typesListStr}${methodTypes}`;
            content = typeFileRender ? typeFileRender(content, modelName, (moduleConfig === null || moduleConfig === void 0 ? void 0 : moduleConfig[modelName]) || {}) : content;
            const savePath = this.getDirPaht('module/type');
            return this.createFile(savePath, `${modelName}.d.ts`, content);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * @description 创建入口文件
     */
    createIndexFile() {
        const modelInfoList = this.modelInfoList.sort((a, b) => a.modelName.length - b.modelName.length);
        let content = modelInfoList.map(i => `import ${i.modelName} from './module/${i.modelName}'`).join('\n');
        content += `\n\nexport default {\n${modelInfoList.map(i => `  ${i.modelName}`).join(',\n')}\n}\n`;
        return this.createFile(this.getDirPaht(''), `index.ts`, content);
    }
    /**
     * @description 创建 文件内容
     */
    createFileContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const process = this.modelInfoList.map((i) => __awaiter(this, void 0, void 0, function* () {
                // api 接口文件相关
                yield this.createApiFile(i.modelInfo);
                // api 接口类型相关
                yield this.createApiTypeFile(i.modelInfo);
            }));
            process.push(this.createIndexFile());
            try {
                yield Promise.all(process);
                log_1.default.success(log_1.default.done(' ALL DONE '));
            }
            catch (error) { }
        });
    }
    /**
     * @param preDirPath
     * @description 获取文件夹路径
     */
    getDirPaht(preDirPath) {
        return path_1.default.join(process.cwd(), this.outDir, preDirPath);
    }
    /**
     *
     * @description 创建文件
     */
    createFile(dirPath, fileName, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!fs_1.default.existsSync(dirPath))
                    fs_1.default.mkdirSync(dirPath, { recursive: true });
                log_1.default.info(`正在创建：${fileName} 文件`);
                const filePath = path_1.default.join(dirPath, fileName);
                fs_1.default.writeFileSync(filePath, content);
            }
            catch (error) {
                log_1.default.error('创建失败');
                console.error(error);
                return Promise.reject(error);
            }
        });
    }
}
exports.default = Doc2Ts;
