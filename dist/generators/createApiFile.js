"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexFilePath = exports.createBaseClassFile = exports.CreateApiFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../common/config");
const utils_1 = require("../utils");
class CreateApiFile {
    constructor(params) {
        this.fileContent = ''; // 文件内容
        this.modelInfo = params;
        this.formatFileData();
        this.createFile();
    }
    formatFileData() {
        const { fileName, dirPath, description, typeDirPaht, diffClassPath } = this.modelInfo;
        const className = (0, utils_1.firstToUpper)(fileName);
        const typeFilePath = (0, utils_1.findDiffPath)(dirPath, path_1.default.join(typeDirPaht, fileName));
        // const typeFilePath = findDiffPath(dirPath, path.join(typeDirPaht, fileName))
        const classMethodStr = this.generateApiClassMethod();
        let content = this.getTempData('../temp/apiFile');
        content = content.replace(/\{className\}/g, className);
        content = content.replace(/\{description\}/g, description);
        content = content.replace(/\{typeFilePath\}/g, typeFilePath);
        content = content.replace(/\{baseClassPath\}/g, diffClassPath);
        content = content.replace(/\{classMethodStr\}/g, classMethodStr);
        this.fileContent = content;
    }
    generateApiClassMethod() {
        const { config, hideMethod, interfaces } = this.modelInfo;
        const methodsList = interfaces.map(i => {
            var _a;
            const { name: funName, method: met, path: _path, description, response, parameters } = i;
            const { isDownload, config: metConfig, description: configDes } = ((_a = config.methodConfig) === null || _a === void 0 ? void 0 : _a[funName]) || {};
            this.fixParamsType(parameters, met);
            const paramsInfo = this.getParamsStr(parameters);
            const { methodBody, onlyType, hsaBody, bodyName, body, header, formData } = paramsInfo;
            const paramsName = parameters.length === 0 ? '()' : onlyType && hsaBody ? bodyName : 'params';
            const requestMethod = isDownload ? 'downloadFile' : 'request';
            const url = `url:${this.formatUrl(_path, paramsInfo)}`;
            const otherConfig = header + formData;
            const requestConfig = metConfig ? `, config: ${JSON.stringify(metConfig)}` : '';
            const hideMet = hideMethod ? /^get$/i.test(met) || (/^post$/i.test(met) && body) : false;
            const method = hideMet ? '' : `, method: '${met}'`;
            const des = configDes ? configDes : description.replace(/\n\r?/, '，') || '';
            const funConfig = `${url}${body}${otherConfig}${method}${requestConfig}`;
            let content = this.getTempData('../temp/apiFileMethod');
            content = content.replace(/\{funName\}/g, (0, utils_1.firstToLower)(funName));
            content = content.replace(/\{funConfig\}/g, funConfig);
            content = content.replace(/\{methodBody\}/g, methodBody);
            content = content.replace(/\{paramsName\}/g, paramsName);
            content = content.replace(/\{funTypeName\}/g, (0, utils_1.firstToUpper)(funName));
            content = content.replace(/\{description\}/g, des);
            return content.replace(/\{requestMethod\}/g, requestMethod);
        });
        return methodsList.join('\n');
    }
    /**
     * @description  把get请求的 body 类型的参数，改为 query 类型
     */
    fixParamsType(parameters, method) {
        if (/get/i.test(method)) {
            parameters.forEach(i => {
                if (i.in === 'body')
                    i.in = 'query';
            });
        }
    }
    formatUrl(url, paramsInfo) {
        const { hasPath, hsaQuery, queryName } = paramsInfo;
        if (hasPath || hsaQuery) {
            if (hasPath)
                url = url.replace(/\{(\w+)\}/g, v => `$${v}`);
            return `\`${url}${hsaQuery ? `?\${${queryName}}` : ''}\``;
        }
        return `'${url}'`;
    }
    getParamsStr(parameters) {
        // TODO 不同类型的参数重名存在 【bug】
        let methodBody = '';
        const bodyName = config_1.PARAMS_NAME.BODY;
        const queryName = config_1.PARAMS_NAME.QUERY;
        const headerName = config_1.PARAMS_NAME.HEADER;
        const formDataName = config_1.PARAMS_NAME.FORMDATA;
        let body = '';
        let header = '';
        let formData = '';
        // 是否需要解构请求参数
        const pathParams = parameters.filter(i => i.in === 'path');
        const hasPath = pathParams.length > 0;
        // query
        const queryParams = this.filterParams(parameters, 'query'); // .map(name => `${name}=\${${name}}`) // ['aaa=${aaa}']
        const hsaQuery = queryParams.length > 0;
        // body
        const bodyParams = this.filterParams(parameters, 'body');
        const hsaBody = bodyParams.length > 0;
        if (hsaBody)
            body = `, ${bodyName}`;
        // formData
        const formDataParams = this.filterParams(parameters, 'formData');
        const hasformData = formDataParams.length > 0;
        if (hasformData)
            formData = `, ${formDataName}`;
        // header
        const headerParams = this.filterParams(parameters, 'header'); // .map(i => `'${i}': ${i}`) // [ "'aaa': aaa" ]
        const hasHeader = headerParams.length > 0;
        if (hasHeader)
            header = `, ${headerName}`;
        const parametersList = new Set(parameters.map(i => i.in)); // .size === 1
        // 判断是否存在 path 参数
        // 存在 path 参数 或者 存在两种及以上参数类型的需要 解构
        if (hasPath || parametersList.size > 1) {
            // 需要需要解构
            methodBody = `\nconst { ${parameters.map(i => i.name).join(', ')} } = params`;
            // 组建各种请求类型参数
            // query
            if (hsaQuery)
                methodBody += `\nconst ${queryName} = this.serialize({${queryParams.join(', ')}})`;
            // body
            if (hsaBody)
                methodBody += `\nconst ${bodyName} = {${bodyParams.join(', ')}}`;
            // formData
            if (hasformData)
                methodBody += `\nconst ${formDataName} = this.formData({${formDataParams.join(', ')}})`;
            // header
            if (hasHeader)
                methodBody += `\nconst ${headerName} = {${headerParams.join(', ')}}`;
        }
        else {
            // 只有一个类型的请求参数
            // 不需要解构
            // 组建各种请求类型参数
            // query
            if (hsaQuery)
                methodBody = `\nconst ${queryName} = this.serialize(params)`;
            // body
            // 直接把 params 传给 request方法即可
            // formData
            if (hasformData) {
                formData = `, ${formDataName}`;
                methodBody = `\nconst ${formDataName} = this.formData(params)`;
            }
            // header
            // 直接把 params 传给 request方法即可
        }
        return {
            body,
            header,
            formData,
            methodBody,
            hasPath,
            hsaBody,
            hsaQuery,
            hasHeader,
            bodyName,
            queryName,
            headerName,
            hasformData,
            formDataName,
            onlyType: parametersList.size === 1
        };
    }
    createFile() {
        const { fileContent, modelInfo } = this;
        const { filePath, render, name, config } = modelInfo;
        const modelName = config.moduleName || name || '';
        const content = render ? render(fileContent, modelName, config) : fileContent;
        (0, utils_1.createFile)(filePath, content);
    }
    getTempData(filePath) {
        filePath = path_1.default.join(__dirname, filePath);
        if (fs_1.default.existsSync(filePath)) {
            return fs_1.default.readFileSync(filePath).toString();
        }
        else {
            throw new Error(`读取模板文件失败，模板文件不存在 => ${filePath}`);
        }
    }
    filterParams(parameters, type) {
        return parameters.filter(i => i.in === type).map(({ name }) => name);
    }
}
exports.CreateApiFile = CreateApiFile;
/**
 *
 * @param tempClassPath
 * @param targetPath
 * @param importBaseCalssName '{xxx}' or 'xxx'
 */
function createBaseClassFile(tempClassPath, targetPath, importBaseCalssName) {
    const tempClassDirList = tempClassPath.split(path_1.default.sep);
    const tempClassDir = path_1.default.join(...tempClassDirList.slice(0, tempClassDirList.length - 1));
    const importPath = (0, utils_1.findDiffPath)(tempClassDir, targetPath);
    const baseClassName = importBaseCalssName.replace(/^\{(.+)\}$/, (_, $1) => $1);
    let content = fs_1.default.readFileSync(path_1.default.join(__dirname, '../temp/baseClass')).toString();
    content = content.replace(/\{BaseCalssName\}/g, baseClassName);
    content = content.replace(/\{BaseClassPath\}/g, importPath);
    content = content.replace(/\{ImportBaseCalssName\}/g, importBaseCalssName);
    (0, utils_1.createFile)(tempClassPath, content);
}
exports.createBaseClassFile = createBaseClassFile;
function createIndexFilePath(outDir, filePathList) {
    const indexFilePath = path_1.default.join(outDir, 'index.ts');
    const fileNameList = [];
    const importPathCode = [];
    const filePathItems = filePathList.reduce((arr, item) => arr.concat(item.data), []);
    filePathItems.sort((a, b) => a.fileName.length - b.fileName.length);
    filePathItems.forEach(i => {
        const { fileName, filePath } = i;
        const apiFilePath = (0, utils_1.findDiffPath)(outDir, filePath).replace(/\.ts$/, '');
        importPathCode.push(`import ${fileName} from '${apiFilePath}'`);
        fileNameList.push(fileName);
    });
    const content = `
  ${importPathCode.join('\n')}

  export default {
    ${fileNameList.join(',\n')}
  }
  `;
    (0, utils_1.createFile)(indexFilePath, content);
}
exports.createIndexFilePath = createIndexFilePath;
