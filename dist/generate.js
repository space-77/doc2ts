"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseClassFile = exports.generateApiClassMethodStr = exports.formatUrl = exports.getParamsStr = exports.createApiFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const utils_1 = require("./utils");
/**
 * @description 创建请求接口文件
 */
function createApiFile(modelInfo) {
    // const { name, interfaces } = modelInfo
    const { render, name, interfaces, config, basePath, fileName, filePath, typeFilePaht, hideMethod } = modelInfo;
    const className = (0, utils_1.firstToUpper)(fileName);
    const modelName = config.moduleName || name;
    // const baseClassPath = findDiffPath(filePath, targetPath)
    const typeFilePath = (0, utils_1.findDiffPath)(filePath, path_1.default.join(typeFilePaht, fileName));
    const classMethodStr = generateApiClassMethodStr(interfaces, config, hideMethod);
    // const basePath = '${basePath}'
    let content = `
import BaseClass from '../baseClass'
import * as mT from '${typeFilePath}'
${basePath ? `\nconst basePath = '${basePath}'` : ''}

/**
 * @description ${name}
 */
class ${className} extends BaseClass {${classMethodStr}}\n
export default new ${className}()\n`;
    content = render ? render(content, modelName, config) : content;
    return (0, utils_1.createFile)(path_1.default.join(filePath, `${fileName}.ts`), content);
}
exports.createApiFile = createApiFile;
function filterParams(parameters, type) {
    return parameters.filter(i => i.in === type).map(({ name }) => name);
}
/**
 * @description 整理参数
 */
function getParamsStr(parameters) {
    // TODO 不同类型的参数重名存在 【bug】
    let codeStr = '';
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
    const queryParams = filterParams(parameters, 'query'); // .map(name => `${name}=\${${name}}`) // ['aaa=${aaa}']
    const hsaQuery = queryParams.length > 0;
    // body
    const bodyParams = filterParams(parameters, 'body');
    const hsaBody = bodyParams.length > 0;
    if (hsaBody)
        body = `, ${bodyName}`;
    // formData
    const formDataParams = filterParams(parameters, 'formData');
    const hasformData = formDataParams.length > 0;
    if (hasformData)
        formData = `, ${formDataName}`;
    // header
    const headerParams = filterParams(parameters, 'header'); // .map(i => `'${i}': ${i}`) // [ "'aaa': aaa" ]
    const hasHeader = headerParams.length > 0;
    if (hasHeader)
        header = `, ${headerName}`;
    const parametersList = new Set(parameters.map(i => i.in)); // .size === 1
    // 判断是否存在 path 参数
    // 存在 path 参数 或者 存在两种及以上参数类型的需要 解构
    if (hasPath || parametersList.size > 1) {
        // 需要需要解构
        codeStr = `\nconst { ${parameters.map(i => i.name).join(', ')} } = params`;
        // 组建各种请求类型参数
        // query
        if (hsaQuery)
            codeStr += `\nconst ${queryName} = this.serialize({${queryParams.join(', ')}})`;
        // body
        if (hsaBody)
            codeStr += `\nconst ${bodyName} = {${bodyParams.join(', ')}}`;
        // formData
        if (hasformData)
            codeStr += `\nconst ${formDataName} = this.formData({${formDataParams.join(', ')}})`;
        // header
        if (hasHeader)
            codeStr += `\nconst ${headerName} = {${headerParams.join(', ')}}`;
    }
    else {
        // 只有一个类型的请求参数
        // 不需要解构
        // 组建各种请求类型参数
        // query
        if (hsaQuery)
            codeStr = `\nconst ${queryName} = this.serialize(params)`;
        // body
        // 直接把 params 传给 request方法即可
        // formData
        if (hasformData) {
            formData = `, ${formDataName}`;
            codeStr = `\nconst ${formDataName} = this.formData(params)`;
        }
        // header
        // 直接把 params 传给 request方法即可
    }
    return {
        body,
        header,
        formData,
        codeStr,
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
exports.getParamsStr = getParamsStr;
function formatUrl(url, paramsInfo) {
    const { hasPath, hsaQuery, queryName } = paramsInfo;
    if (hasPath || hsaQuery) {
        if (hasPath)
            url = url.replace(/\{(\w+)\}/g, v => `$${v}`);
        return `\`${url}${hsaQuery ? `?\${${queryName}}` : ''}\``;
    }
    return `'${url}'`;
}
exports.formatUrl = formatUrl;
/**
 * @description  把get请求的 body 类型的参数，改为 query 类型
 */
function fixParamsType(parameters, method) {
    if (/get/i.test(method)) {
        parameters.forEach(i => {
            if (i.in === 'body')
                i.in = 'query';
        });
    }
}
/**
 * @description 生成请求接口class 里的请求方法
 */
function generateApiClassMethodStr(interfaces, config, hideMethod) {
    // const { hideMethod } = config
    const methodsList = interfaces.map(i => {
        var _a;
        const { name: funName, method: met, path: _path, description, response, parameters } = i;
        const { isDownload, config: metConfig, description: configDes } = ((_a = config.methodConfig) === null || _a === void 0 ? void 0 : _a[funName]) || {};
        fixParamsType(parameters, met);
        const paramsInfo = getParamsStr(parameters);
        const { codeStr, onlyType, hsaBody, bodyName, body, header, formData } = paramsInfo;
        // const { typeName } = response
        const paramsName = parameters.length === 0 ? '()' : onlyType && hsaBody ? bodyName : 'params';
        const requestMethod = isDownload ? 'downloadFile' : 'request';
        const url = `url:${formatUrl(_path, paramsInfo)}`;
        const otherConfig = header + formData;
        const requestConfig = metConfig ? `, config: ${JSON.stringify(metConfig)}` : '';
        const hideMet = hideMethod ? /^get$/i.test(met) || (/^post$/i.test(met) && body) : false;
        const method = hideMet ? '' : `, method: '${met}'`;
        return `
  /**
   * @description ${configDes ? configDes : description.replace(/\n\r?/, '，') || ''}
  */
  ${funName}: mT.${(0, utils_1.firstToUpper)(funName)} = ${paramsName} => {${codeStr}
    return this.${requestMethod}({ ${url}${body}${otherConfig}${method}${requestConfig} })
  }\n`;
    });
    return methodsList.join('\n');
}
exports.generateApiClassMethodStr = generateApiClassMethodStr;
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
    let content = fs_1.default.readFileSync(path_1.default.join(__dirname, './temp/baseClass')).toString();
    const baseClassName = importBaseCalssName.replace(/^\{(.+)\}$/, (_, $1) => $1);
    content = content.replace(/\{BaseCalssName\}/g, baseClassName);
    content = content.replace(/\{BaseClassPath\}/g, importPath);
    content = content.replace(/\{ImportBaseCalssName\}/g, importBaseCalssName);
    (0, utils_1.createFile)(tempClassPath, content);
}
exports.createBaseClassFile = createBaseClassFile;
