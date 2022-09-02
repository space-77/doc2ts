"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fileList_1 = require("./fileList");
const config_1 = require("../common/config");
const utils_1 = require("../utils");
const reg_1 = require("../common/reg");
const objMapType = `export type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
}
`;
class CreateTypeFile {
    constructor(params) {
        this.content = '';
        this.exportValue = '';
        this.typeList = [];
        this.importType = new Set([]);
        this.fileInfo = params;
        const showEx = typeof params.resultTypeRender === 'string';
        this.exportValue = showEx ? `export type ExportValue<T, U> = U extends keyof T ? T[U] : T;\n` : '';
        // `\ntype ExportValue<T, U> = U extends keyof T ? T[U] : T;\n`
        // this.generateFile()
    }
    generateFile() {
        const { typeDirPaht, fileName, typeFileRender } = this.fileInfo;
        this.generateApiClassType(); // 创建 接口请求方法的类型
        // this.generateTypeValue() // 创建 返回类型
        this.generateTypes(); // 创建 返回数据的类型
        this.generateParamType(); // 创建 参数的类型
        this.generateImportType(); // 创建 返回数据类型和参数类型 需要引入的类型
        this.content = typeof typeFileRender === 'function' ? typeFileRender(this.content, fileName) : this.content;
        const filePath = path_1.default.join(typeDirPaht, `${fileName}.d.ts`);
        fileList_1.fileList.push({ filePath, content: this.content });
    }
    generateImportType() {
        const { content } = this;
        // const hasObjectMap = importType.delete('ObjectMap')
        // const importTypeList = Array.from(importType)
        //   .sort((a, b) => a.length - b.length)
        //   .join(', ')
        // const objectMapTypeStr = hasObjectMap ? `\n${objMapType}` : ''
        this.content = `import type * as defs from './type' \n${content}`;
    }
    generateApiClassType() {
        const { fileInfo, typeList } = this;
        const { interfaces } = fileInfo;
        const methodList = interfaces.map(i => {
            const { response, parameters, id } = i;
            const onlyParam = parameters.length === 1;
            const name = (0, utils_1.firstToUpper)(i.name);
            const resTypeName = `${name}Body`;
            const paramTypeName = `${name}Param`;
            let paramsStr = `(params: ${paramTypeName})`;
            if (onlyParam) {
                const { name } = parameters[0];
                paramsStr = `(${name} :${paramTypeName}['${name}'])`;
            }
            typeList.push({ id, resTypeName, response, paramTypeName, parameters });
            const returnType = this.getReturnType(resTypeName, i, fileInfo);
            return `export type ${name} = ${paramsStr} => ${returnType}\n`;
        });
        this.content = methodList.join('\n');
    }
    getReturnType(resTypeName, item, fileInfo) {
        const { response, id } = item;
        const { baseClasses, resultTypeRender: render, modelName } = fileInfo;
        let promType = `Promise<${resTypeName}>`;
        const { typeName } = response;
        const typeInfo = baseClasses.find(i => i.name === typeName);
        if (render && typeInfo) {
            const { properties } = typeInfo;
            const isFile = properties.length === 1 && properties[0].dataType.typeName === 'Flie';
            if (!isFile) {
                if (typeof render === 'function') {
                    const info = { modelName, funId: id };
                    promType = render(resTypeName, typeInfo.properties, info);
                }
                else if (typeof render === 'string') {
                    let tempStr = render;
                    const [_, dataKey, keyValue] = render.match(reg_1.resTypeDataKey) || [];
                    if (dataKey) {
                        tempStr = tempStr.replace(reg_1.resTypeDataKey, `${resTypeName}['${keyValue}']`);
                    }
                    tempStr = tempStr.replace(/\{typeName\}/g, resTypeName);
                    promType = tempStr;
                }
            }
        }
        return promType;
    }
    generateTypes() {
        const { typeList, content } = this;
        const resTypeList = typeList.map(i => {
            const { resTypeName, response } = i;
            return `export type ${resTypeName} = ${this.generateResTypeValue(response, true)}`;
        });
        this.content = `${resTypeList.join('\n')}\n${content}`;
    }
    /**
     * @param typeName
     * @description 判断是不是ts的基本类型，如果如果不是的 则是改为any类型【处理不规范的类型】
     */
    getDefType(typeName) {
        return config_1.tsObjType.has(typeName) ? typeName : 'any';
    }
    generateResTypeValue(responseType, hasDefs = false) {
        var _a;
        const { baseClasses } = this.fileInfo;
        const { typeArgs, typeName, isDefsType } = responseType;
        let content = typeName;
        if ((isDefsType || typeName === 'ObjectMap') && hasDefs)
            content = `defs.${content}`;
        if (typeArgs.length > 0) {
            content += `<${typeArgs.map(i => this.generateResTypeValue(i, hasDefs)).join(', ')}>`;
        }
        else if (content) {
            // 添加未知类型的泛型
            const templateArgs = ((_a = baseClasses.find(i => i.name === typeName)) === null || _a === void 0 ? void 0 : _a.templateArgs) || [];
            if (templateArgs.length > 0) {
                content += `<${templateArgs.map(i => this.generateResTypeValue(i, hasDefs)).join(', ')}>`;
            }
        }
        return content || 'any';
    }
    generateParamType() {
        const { typeList, content } = this;
        const resTypeList = typeList.map(i => {
            const { paramTypeName, parameters } = i;
            return `export interface ${paramTypeName} {\n${this.generateParamTypeValue(parameters, true).join('\n')}}`;
        });
        this.content = `${resTypeList.join('\n')}\n${content}`;
    }
    generateParamTypeValue(parameters, hasDefs = false) {
        return parameters.map(i => {
            const { required, name, description, dataType } = i;
            const valueType = this.generateResTypeValue(dataType, hasDefs);
            return `${this.getDescription(description)}${name}${required ? '' : '?'}: ${valueType}`;
        });
    }
    getDescription(des, example) {
        if (!example && !des)
            return '';
        if (des) {
            return example ? `/** \n* @example ${example}\n* @description ${des}\n */\n` : `/** @description ${des} */\n`;
        }
        return `/** @example ${example} */\n`;
    }
    createBaseClasses() {
        const { fileInfo, exportValue } = this;
        const { typeDirPaht, baseClasses } = fileInfo;
        const content = baseClasses.map(i => {
            const { name, properties, templateArgs, description } = i;
            const temList = templateArgs.map(i => i.typeName);
            const temStr = temList.length > 0 ? `<${temList.join(', ')}>` : '';
            const itemsValue = this.generateParamTypeValue(properties).join('\n');
            return `${this.getDescription(description)}export interface ${name}${temStr} {\n${itemsValue}}`;
        });
        if (exportValue)
            content.unshift(exportValue);
        const filePath = path_1.default.join(typeDirPaht, `type.d.ts`);
        fileList_1.fileList.push({ filePath, content: objMapType + content.join('\n') });
    }
}
exports.default = CreateTypeFile;
//# sourceMappingURL=createTypeFile.js.map