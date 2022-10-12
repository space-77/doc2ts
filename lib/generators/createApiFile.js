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
exports.createIndexFilePath = exports.createBaseClassFile = exports.CreateApiFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fileList_1 = require("./fileList");
const utils_1 = require("../utils");
const config_1 = require("../common/config");
class CreateApiFile {
    constructor(params) {
        this.fileContent = ''; // 文件内容
        this.modelInfo = params;
        this.formatFileData();
    }
    formatFileData() {
        const { fileName, dirPath, description, typeDirPaht, diffClassPath, isJs } = this.modelInfo;
        const className = (0, utils_1.firstToUpper)(fileName);
        const classNameLower = (0, utils_1.firstToLower)(fileName);
        let typeFilePath = '';
        if (!isJs) {
            typeFilePath = (0, utils_1.findDiffPath)(dirPath, path_1.default.join(typeDirPaht, fileName));
            typeFilePath = `\nimport type * as mT from '${typeFilePath}'`;
        }
        const classMethodStr = this.generateApiClassMethod();
        let content = this.getTempData('../temp/apiFile');
        content = content.replace(/\{className\}/g, className);
        content = content.replace(/\{description\}/g, description);
        content = content.replace(/\{typeFilePath\}/g, typeFilePath);
        content = content.replace(/\{baseClassPath\}/g, diffClassPath);
        content = content.replace(/\{classMethodStr\}/g, classMethodStr);
        content = content.replace(/\{classNameLower\}/g, classNameLower);
        this.fileContent = content;
    }
    generateApiClassMethod() {
        const { hideMethod, interfaces, isJs, methodConfig, moduleName } = this.modelInfo;
        interfaces.sort((a, b) => a.path.length - b.path.length);
        const methodsList = interfaces.map(i => {
            const { name: funName, method: met, path: _path, description, response, parameters, id = '' } = i;
            const funcName = (0, utils_1.camel2Kebab)(`${moduleName}${moduleName ? '-' : ''}${id}`);
            const { isDownload, config: metConfig, description: configDes } = (methodConfig === null || methodConfig === void 0 ? void 0 : methodConfig[funcName]) || {};
            this.fixParamsType(parameters, met);
            const paramsInfo = this.getParamsStr(parameters);
            const { methodBody, body, header, formData, paramsName } = paramsInfo;
            // const paramsName = parameters.length === 0 ? '()' : onlyType && hasBody ? bodyName : 'params'
            const requestMethod = isDownload ? 'downloadFile' : 'request';
            const url = this.formatUrl(_path, paramsInfo);
            const otherConfig = header + formData;
            const funTypeName = isJs ? '' : `: mT.${(0, utils_1.firstToUpper)(funName)}`;
            const requestConfig = metConfig ? `, config: ${JSON.stringify(metConfig)}` : '';
            const hideMet = hideMethod ? /^get$/i.test(met) || (/^post$/i.test(met) && body) : false;
            const method = hideMet ? '' : `, method: '${met}'`;
            const des = configDes ? configDes : description.replace(/\r?\n/, '，') || '';
            const funConfig = `url${body}${otherConfig}${method}${requestConfig}`;
            let content = this.getTempData('../temp/apiFileMethod');
            content = content.replace(/\{name\}/g, funcName);
            content = content.replace(/\{url\}/g, url);
            content = content.replace(/\{funName\}/g, (0, utils_1.firstToLower)(funName));
            content = content.replace(/\{funConfig\}/g, funConfig);
            content = content.replace(/\{methodBody\}/g, methodBody);
            content = content.replace(/\{paramsName\}/g, paramsName);
            content = content.replace(/\{funTypeName\}/g, funTypeName);
            content = content.replace(/\{description\}/g, des);
            return content.replace(/\{requestMethod\}/g, requestMethod);
        });
        return methodsList.join('\r\n\r\n');
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
        const { hasPath, hasQuery, queryValue, onlyType } = paramsInfo;
        if (hasPath || hasQuery) {
            if (hasPath)
                url = url.replace(/\{(\w+)\}/g, v => {
                    let val = v;
                    if (onlyType) {
                        // 只有一个参数的时候 形参是否包含 关键字用的是  keyWordsListSet
                        val = config_1.keyWordsListSet.has(v) ? `_${v}` : v;
                    }
                    else {
                        // 多个参数的时候 形参是否包含 关键字用的是  keyWords
                        val = this.joinParams([v]);
                    }
                    return `$${val}`;
                });
            return `\`${url}${hasQuery ? `?\${${queryValue}}` : ''}\``;
        }
        return `'${url}'`;
    }
    getParamsStr(parameters) {
        // TODO 不同类型的参数重名存在 【bug】
        const { joinParams } = this;
        let methodBody = '';
        const bodyName = config_1.PARAMS_NAME.BODY;
        // const queryName = PARAMS_NAME.QUERY
        const headerName = config_1.PARAMS_NAME.HEADER;
        const formDataName = config_1.PARAMS_NAME.FORMDATA;
        let queryValue = '';
        let body = '';
        let header = '';
        let formData = '';
        // 是否需要解构请求参数
        const pathParams = parameters.filter(i => i.in === 'path');
        const hasPath = pathParams.length > 0;
        // query
        const queryParams = this.filterParams(parameters, 'query'); // .map(name => `${name}=\${${name}}`) // ['aaa=${aaa}']
        const hasQuery = queryParams.length > 0;
        // body
        const bodyParams = this.filterParams(parameters, 'body');
        const hasBody = bodyParams.length > 0;
        if (hasBody)
            body = `, ${bodyName}`;
        // formData
        const formDataParams = this.filterParams(parameters, 'formData');
        const hasformData = formDataParams.length > 0;
        if (hasformData)
            formData = `, ${formDataName}`;
        // header
        const headerParams = this.filterParams(parameters, 'header');
        if (hasformData)
            headerParams.push("'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'");
        const hasHeader = headerParams.length > 0;
        if (hasHeader)
            header = `, ${headerName}`;
        const parametersList = new Set(parameters.map(i => i.in));
        const onlyType = parametersList.size === 1;
        const onlyParam = parameters.length === 1;
        const paramsList = parameters.map(({ name }) => name);
        let paramsStr = 'params';
        let onlyParamName;
        // 请求方法的形参
        let paramsName = '()';
        if (parameters.length > 0) {
            if (onlyParam) {
                const { name } = parameters[0];
                onlyParamName = config_1.keyWordsListSet.has(name) ? `_${name}` : name;
                paramsName = onlyParamName;
                paramsStr = name !== onlyParamName ? `{${name}: ${onlyParamName}}` : onlyParamName;
            }
            else {
                paramsName = onlyType && hasBody ? bodyName : paramsStr;
            }
        }
        // const parametersSet = new Set(paramsList)
        // 判断是否存在 path 参数
        // 存在 path 参数 或者 存在两种及以上参数类型的需要 解构
        if (hasPath || parametersList.size > 1) {
            // 需要需要解构
            if (!onlyParam)
                methodBody = `\r\nconst { ${joinParams(paramsList)} } = ${paramsStr}`;
            // 组建各种请求类型参数
            // query
            if (hasQuery)
                queryValue += `this.serialize({${joinParams(queryParams)}})`;
            // body
            if (hasBody)
                methodBody += `\r\nconst ${bodyName} = {${joinParams(bodyParams)}}`;
            // formData
            if (hasformData)
                methodBody += `\r\nconst ${formDataName} = this.formData({${joinParams(formDataParams)}})`;
            // header
            if (hasHeader)
                methodBody += `\r\nconst ${headerName} = {${joinParams(headerParams)}}`;
        }
        else {
            // 只有一个类型的请求参数
            // 不需要解构
            // 组建各种请求类型参数
            // query
            if (hasQuery)
                queryValue = `this.serialize(${onlyParam ? `{${paramsStr}}` : paramsStr})`;
            // body
            // 直接把 params 传给 request方法即可
            if (hasBody && onlyParam) {
                // methodBody = `\nconst ${bodyName} = ${paramsStr}`
                body = `,body: ${paramsStr}`;
            }
            // formData
            if (hasformData) {
                formData = `, ${formDataName}`;
                methodBody = `\r\nconst ${formDataName} = this.formData({${paramsStr}})`;
                methodBody += `\r\nconst ${headerName} = {${joinParams(headerParams)}}`;
            }
            // header
            if (hasHeader && !hasformData)
                methodBody = `\nconst ${headerName} = {${joinParams(headerParams)}}`;
        }
        return {
            body,
            header,
            formData,
            methodBody,
            hasPath,
            hasBody,
            hasQuery,
            hasHeader,
            bodyName,
            onlyType,
            queryValue,
            headerName,
            paramsName,
            hasformData,
            formDataName
        };
    }
    createFile() {
        const { fileContent, modelInfo } = this;
        const { filePath, render, moduleName } = modelInfo;
        // const moduleName = config.moduleName || name || ''
        const content = render ? render(fileContent, moduleName) : fileContent;
        fileList_1.fileList.push({ filePath, content });
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
    joinParams(keyList) {
        return keyList.map(i => (config_1.keyWords.has(i) ? `${i}:_${i}` : i)).join(',');
    }
}
exports.CreateApiFile = CreateApiFile;
function createBaseClassFile(config) {
    const { tempClassPath, targetPath, importBaseCalssName } = config;
    const tempClassDirList = tempClassPath.split(path_1.default.sep);
    const tempClassDir = path_1.default.join(...tempClassDirList.slice(0, tempClassDirList.length - 1));
    const importPath = (0, utils_1.findDiffPath)(tempClassDir, targetPath); // .replace(/\.ts/, '')
    const baseClassName = importBaseCalssName.replace(/^\{(.+)\}$/, (_, $1) => $1);
    let content = fs_1.default.readFileSync(path_1.default.join(__dirname, '../temp/baseClass')).toString();
    content = content.replace(/\{BaseCalssName\}/g, baseClassName);
    content = content.replace(/\{BaseClassPath\}/g, importPath);
    content = content.replace(/\{ImportBaseCalssName\}/g, importBaseCalssName);
    fileList_1.fileList.push({ filePath: tempClassPath, content });
}
exports.createBaseClassFile = createBaseClassFile;
function createIndexFilePath(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const { outDir, filePathList, indexFilePath } = config;
        const fileNameList = [];
        const importPathCode = [];
        const filePathItems = filePathList.reduce((arr, item) => arr.concat(item.data), []);
        filePathItems.sort((a, b) => a.fileName.length - b.fileName.length);
        filePathItems.forEach(i => {
            const { fileName, filePath } = i;
            const apiFilePath = (0, utils_1.findDiffPath)(outDir, filePath).replace(/\.ts$/, '');
            importPathCode.push(`import {${fileName}} from '${apiFilePath}'`);
            fileNameList.push(fileName);
        });
        // 无模块，直接导出
        const noModelItems = filePathList
            .filter(i => !i.moduleName)
            .reduce((arr, i) => arr.concat(i.data), [])
            .sort((a, b) => a.fileName.length - b.fileName.length)
            .map(i => i.fileName)
            .join(',\r\n');
        // console.log(noModelItems)
        // 有模块，再分模块导出
        const hasModelItems = filePathList
            .filter(i => i.moduleName)
            .sort((a, b) => a.moduleName.length - b.moduleName.length)
            .map(({ moduleName, data }) => {
            data.sort((a, b) => a.fileName.length - b.fileName.length);
            return `${moduleName}: {
        ${data.map(i => i.fileName).join(',\r\n')}
      }`;
        })
            .join(',\r\n');
        // let exportContent = `
        // ${hasModelItems.map(i => {})}
        // `
        const content = `
  ${importPathCode.join('\r\n')}

  export default {
    ${noModelItems}
    ${noModelItems ? ',' : ''}
    ${hasModelItems}
  }
  `;
        fileList_1.fileList.push({ filePath: indexFilePath, content });
        // await createFile(indexFilePath, content)
    });
}
exports.createIndexFilePath = createIndexFilePath;
//# sourceMappingURL=createApiFile.js.map