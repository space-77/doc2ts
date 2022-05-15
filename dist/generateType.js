"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const objMapType = `export type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
}
`;
class CreateTypeFile {
    constructor(params) {
        this.content = '';
        this.typeList = [];
        this.importType = new Set([]);
        const { interfaces, fileName, typeFilePaht, resultGenerics, typeFileRender } = params;
        this.fileName = fileName;
        this.interfaces = interfaces;
        this.typeFilePaht = typeFilePaht;
        this.resultGenerics = resultGenerics;
        this.generateFile(typeFileRender);
    }
    generateFile(typeFileRender) {
        const { typeFilePaht, fileName } = this;
        this.generateApiClassType(); // 创建 接口请求方法的类型
        this.generateTypes(); // 创建 返回数据的类型
        this.generateParamType(); // 创建 参数的类型
        this.generateImportType(); // 创建 返回数据类型和参数类型 需要引入的类型
        this.content = typeof typeFileRender === 'function' ? typeFileRender(this.content, fileName) : this.content;
        (0, utils_1.createFile)(path_1.default.join(typeFilePaht, `${fileName}.d.ts`), this.content);
    }
    generateApiClassType() {
        const { resultGenerics, interfaces, typeList } = this;
        const methodList = interfaces.map(i => {
            const { response, parameters } = i;
            const name = (0, utils_1.firstToUpper)(i.name);
            const resTpeName = `${name}Res`;
            const paramTypeName = `${name}Param`;
            typeList.push({ resTpeName, response, paramTypeName, parameters });
            return `export type ${name} = <T = ${resTpeName}>(params: ${paramTypeName}) => Promise<${resultGenerics}>\n`;
        });
        this.content = methodList.join('\n');
    }
    generateTypes() {
        const { typeList, content } = this;
        const resTypeList = typeList.map(i => {
            const { resTpeName, response } = i;
            return `export type ${resTpeName} = ${this.generateResTypeValue(response)}`;
        });
        this.content = `${resTypeList.join('\n')}\n${content}`;
    }
    generateResTypeValue(responseType) {
        const { typeArgs, typeName, templateIndex, isDefsType } = responseType;
        if (typeName === 'ObjectMap') {
            console.log(isDefsType);
        }
        if (isDefsType || typeName === 'ObjectMap')
            this.importType.add(typeName);
        let content = typeName;
        if (typeArgs.length > 0) {
            const [firstType] = typeArgs;
            content += `<${this.generateResTypeValue(firstType)}>`;
        }
        return content || 'any';
    }
    generateParamType() {
        const { typeList, content } = this;
        const resTypeList = typeList.map(i => {
            const { paramTypeName, parameters } = i;
            return `export type ${paramTypeName} = {\n${this.generateParamTypeValue(parameters).join('\n')}}`;
        });
        this.content = `${resTypeList.join('\n')}\n${content}`;
    }
    generateParamTypeValue(parameters) {
        return parameters.map(i => {
            const { required, name, description, dataType } = i;
            const valueType = this.generateResTypeValue(dataType);
            return `${this.getDescription(description)}${name}${required ? '' : '?'}: ${valueType}`;
        });
    }
    generateImportType() {
        const { importType, content } = this;
        const importTypeList = Array.from(importType).sort((a, b) => a.length - b.length);
        this.content = `import { ${importTypeList.join(', ')} } from './type' \n${content}`;
    }
    getDescription(des) {
        return des ? `/** @description ${des}*/\n` : '';
    }
    createBaseClasses(baseClasses) {
        const { typeFilePaht } = this;
        const content = baseClasses.map(i => {
            const { name, properties, templateArgs, description } = i;
            if (properties.length === 0)
                return '';
            const temList = templateArgs.map(i => i.typeName);
            const temStr = temList.length > 0 ? `<${temList.join(', ')}>` : '';
            const itemsValue = this.generateParamTypeValue(properties).join('\n');
            return `${this.getDescription(description)}export type ${name}${temStr} = {\n${itemsValue}}`;
        });
        (0, utils_1.createFile)(path_1.default.join(typeFilePaht, `type.d.ts`), `${objMapType}${content.join('\n')}`);
    }
}
exports.default = CreateTypeFile;
