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
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const objMapType = `type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
  [key in Key]: Value;
}
`;
class CreateTypeFile {
    constructor(params) {
        this.content = '';
        this.typeList = [];
        this.importType = new Set([]);
        this.fileInfo = params;
        // this.generateFile()
    }
    generateFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const { typeDirPaht, fileName, typeFileRender } = this.fileInfo;
            this.generateApiClassType(); // 创建 接口请求方法的类型
            this.generateTypeValue(); // 创建 返回类型
            this.generateTypes(); // 创建 返回数据的类型
            this.generateParamType(); // 创建 参数的类型
            this.generateImportType(); // 创建 返回数据类型和参数类型 需要引入的类型
            this.content = typeof typeFileRender === 'function' ? typeFileRender(this.content, fileName) : this.content;
            yield (0, utils_1.createFile)(path_1.default.join(typeDirPaht, `${fileName}.d.ts`), this.content);
        });
    }
    generateApiClassType() {
        const { fileInfo, typeList } = this;
        const { interfaces } = fileInfo;
        const methodList = interfaces.map(i => {
            const { response, parameters } = i;
            const name = (0, utils_1.firstToUpper)(i.name);
            const resTypeName = `${name}Body`;
            const metReturnTypeName = `${name}Response`;
            const paramTypeName = `${name}Param`;
            typeList.push({ resTypeName, response, paramTypeName, parameters, metReturnTypeName });
            return `export type ${name} = (params: ${paramTypeName}) => ${metReturnTypeName}\n`;
        });
        this.content = methodList.join('\n');
    }
    generateTypeValue() {
        const { typeList, fileInfo } = this;
        const { baseClasses, resultTypeRender: render } = fileInfo;
        const typeValueList = typeList.map(i => {
            const { resTypeName, response, metReturnTypeName } = i;
            let promType = `Promise<${resTypeName}>`;
            if (typeof render === 'function') {
                const { typeName } = response;
                const typeInfo = baseClasses.find(i => i.name === typeName);
                if (typeInfo)
                    promType = render(resTypeName, typeInfo.properties);
            }
            return `type ${metReturnTypeName} = ${promType}`;
        });
        this.content = `${typeValueList.join('\n')}\n${this.content}`;
    }
    generateTypes() {
        const { typeList, content } = this;
        const resTypeList = typeList.map(i => {
            const { resTypeName, response } = i;
            return `export type ${resTypeName} = ${this.generateResTypeValue(response)}`;
        });
        this.content = `${resTypeList.join('\n')}\n${content}`;
    }
    generateResTypeValue(responseType) {
        var _a;
        const { baseClasses } = this.fileInfo;
        const { typeArgs, typeName, templateIndex, isDefsType } = responseType;
        if (isDefsType || typeName === 'ObjectMap')
            this.importType.add(typeName);
        let content = typeName;
        if (typeArgs.length > 0) {
            const [firstType] = typeArgs;
            content += `<${this.generateResTypeValue(firstType)}>`;
        }
        else if (content) {
            // 添加未知类型的泛型
            const templateArgs = ((_a = baseClasses.find(i => i.name === typeName)) === null || _a === void 0 ? void 0 : _a.templateArgs) || [];
            if (templateArgs.length > 0)
                content += '<any>';
        }
        return content || 'any';
    }
    generateParamType() {
        const { typeList, content } = this;
        const resTypeList = typeList.map(i => {
            const { paramTypeName, parameters } = i;
            return `export interface ${paramTypeName} {\n${this.generateParamTypeValue(parameters).join('\n')}}`;
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
        const hasObjectMap = importType.delete('ObjectMap');
        const importTypeList = Array.from(importType).sort((a, b) => a.length - b.length);
        const objectMapTypeStr = hasObjectMap ? `\n${objMapType}` : '';
        this.content = `import type { ${importTypeList.join(', ')} } from './type' ${objectMapTypeStr} \n${content}`;
    }
    getDescription(des) {
        return des ? `/** @description ${des} */\n` : '';
    }
    createBaseClasses() {
        return __awaiter(this, void 0, void 0, function* () {
            const { typeDirPaht, baseClasses } = this.fileInfo;
            const content = baseClasses.map(i => {
                const { name, properties, templateArgs, description } = i;
                if (properties.length === 0)
                    return '';
                const temList = templateArgs.map(i => i.typeName);
                const temStr = temList.length > 0 ? `<${temList.join(', ')}>` : '';
                const itemsValue = this.generateParamTypeValue(properties).join('\n');
                return `${this.getDescription(description)}export interface ${name}${temStr} {\n${itemsValue}}`;
            });
            yield (0, utils_1.createFile)(path_1.default.join(typeDirPaht, `type.d.ts`), content.join('\n'));
        });
    }
}
exports.default = CreateTypeFile;
//# sourceMappingURL=createTypeFile.js.map