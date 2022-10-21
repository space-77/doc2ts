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
        this.typeList = [];
        this.tempMap = [];
        this.importType = new Set([]);
        this.typeItemList = [];
        this.fileInfo = params;
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
        const { content, importType } = this;
        const importTypeStr = Array.from(importType)
            .sort((a, b) => a.length - b.length)
            .join(', ');
        this.content = `import type {${importTypeStr}} from './type' \r\n${content}`;
    }
    generateApiClassType() {
        const { fileInfo, typeList } = this;
        const { interfaces, baseClasses } = fileInfo;
        const methodList = interfaces.map(i => {
            const { response, parameters, id } = i;
            const onlyParam = parameters.length === 1;
            const funName = (0, utils_1.firstToUpper)(i.name);
            const resTypeName = `${funName}Body`;
            const paramTypeName = `${funName}Param`;
            let paramsStr = `(params: ${paramTypeName})`;
            if (onlyParam) {
                const [firstParam] = parameters;
                const { dataType } = firstParam;
                const { isDefsType } = dataType;
                const classItem = baseClasses.find(i => i.name === dataType.typeName);
                const { properties = [] } = classItem !== null && classItem !== void 0 ? classItem : {};
                if (!isDefsType || properties.length > 0) {
                    const { typeArgs, typeName, isDefsType } = firstParam.dataType;
                    paramsStr = `(params :${this.generateResTypeValue(typeArgs, typeName, isDefsType)})`;
                }
                else if (parameters.length > 0) {
                    // 文档未定义参数类型
                    paramsStr = `(params: any)`;
                }
                else {
                    // 不需要传参
                    paramsStr = `()`;
                }
            }
            else if (parameters.length === 0) {
                // 不需要传参
                paramsStr = '()';
            }
            const resTypes = { id, resTypeName, response, paramTypeName, parameters };
            typeList.push(resTypes);
            const returnType = this.getReturnType(resTypeName, i, fileInfo, resTypes);
            return `export type ${funName} = ${paramsStr} => ${returnType}\r\n`;
        });
        this.content = methodList.join('\r\n');
    }
    getReturnType(resTypeName, item, fileInfo, resTypes) {
        var _a;
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
                    // if (resTypeName === 'GetAuthUserListBody') {
                    //   const { typeArgs } = resTypes.response
                    //   // console.log(JSON.stringify(typeArgs))
                    //   // const propertie = typeArgs.find(i => i.typeName === 'data')
                    //   const { typeArgs: args = [], typeName, isDefsType } = typeArgs[0]
                    //   // const { typeArgs, typeName, isDefsType } = resTypes.response
                    //   const res = this.generateResTypeValue(args, typeName as string, isDefsType as boolean)
                    //   console.log(res)
                    //   // const { templateIndex = 0 } = dataType ?? {}
                    //   // // typeList.find(i => i.)
                    //   // const { typeArgs: types, typeName } = typeArgs[templateIndex]
                    //   // console.log(JSON.stringify(resTypes.response))
                    //   // // console.log(JSON.stringify(typeInfo))
                    //   // console.log(`${typeName}${this.getGenericsValue(types)}`)
                    //   process.exit(0)
                    // }
                    let tempStr = render;
                    const [_, dataKey, keyValue] = render.match(reg_1.resTypeDataKey) || [];
                    const hasDataItem = typeInfo.properties.find(i => i.name === keyValue);
                    if (dataKey && hasDataItem) {
                        const { typeArgs } = resTypes.response;
                        const { dataType, required = false } = hasDataItem !== null && hasDataItem !== void 0 ? hasDataItem : {};
                        const index = (dataType === null || dataType === void 0 ? void 0 : dataType.templateIndex) || 0;
                        const { typeArgs: types = [], typeName, isDefsType } = (_a = typeArgs[index]) !== null && _a !== void 0 ? _a : {};
                        const res = this.generateResTypeValue(types, typeName, isDefsType);
                        const newType = types && typeName ? `${res}${!required ? '| undefined' : ''}` : 'any';
                        tempStr = tempStr.replace(reg_1.resTypeDataKey, newType);
                        tempStr = tempStr.replace(/\{typeName\}/g, resTypeName);
                        promType = tempStr;
                    }
                }
            }
        }
        return promType;
    }
    generateTypes() {
        const { typeList, content } = this;
        const resTypeList = typeList.map((i, index) => {
            // console.log(i)
            const { resTypeName, response } = i;
            const { typeArgs, typeName, isDefsType } = response;
            return `export type ${resTypeName} = ${this.generateResTypeValue(typeArgs, typeName, isDefsType)}`;
        });
        this.content = `${resTypeList.join('\r\n')}\r\n${content}`;
    }
    /**
     * @param typeName
     * @description 判断是不是ts的基本类型，如果如果不是的 则是改为any类型【处理不规范的类型】
     */
    getDefType(typeName) {
        return config_1.tsObjType.has(typeName) ? typeName : 'any';
    }
    /**
     * @description 获取泛型的值
     */
    getGenericsValue(types) {
        if (types.length > 0) {
            return `<${types
                .map(({ typeArgs, typeName }) => typeArgs.length > 0 ? `${typeName}${this.getGenericsValue(typeArgs)}` : typeName)
                .join(', ')}>`;
        }
        return '';
    }
    generateResTypeValue(typeArgs, typeName, isDefsType, isTemp) {
        var _a, _b;
        const { baseClasses } = this.fileInfo;
        // const { typeArgs, typeName, isDefsType } = responseType
        let content = typeName;
        const tempItem = this.tempMap.find(i => i.tempName === typeName);
        // if (tempItem) this.importType.add(tempItem.tempName)
        if (isDefsType || typeName === 'ObjectMap')
            this.importType.add(content);
        content = (_a = tempItem === null || tempItem === void 0 ? void 0 : tempItem.value) !== null && _a !== void 0 ? _a : content;
        if (typeArgs.length > 0) {
            content += `<${typeArgs
                .map(i => {
                // if (isDefsType || typeName === 'ObjectMap') this.importType.add(content)
                return this.generateResTypeValue(i.typeArgs, i.typeName, i.isDefsType);
            })
                .join(', ')}>`;
        }
        else if (content) {
            // 添加未知类型的泛型
            const templateArgs = ((_b = baseClasses.find(i => i.name === typeName)) === null || _b === void 0 ? void 0 : _b.templateArgs) || [];
            if (templateArgs.length > 0) {
                content += `<${templateArgs
                    .map(i => {
                    // this.importType.add(i.typeName)
                    return this.generateResTypeValue(i.typeArgs, i.typeName, i.isDefsType);
                })
                    .join(', ')}>`;
            }
        }
        return content || 'any';
    }
    generateParamType() {
        const { typeList, content, fileInfo } = this;
        const { generateTypeRender, fileName } = fileInfo;
        const resTypeList = typeList
            .filter(i => i.parameters.length > 1)
            .map(i => {
            const { paramTypeName, parameters } = i;
            let typeItems = this.createTypeItems(parameters);
            if (typeof generateTypeRender === 'function') {
                typeItems = generateTypeRender({ fileName, typeName: paramTypeName, values: typeItems });
            }
            this.typeItemList.push({ paramTypeName, typeItems });
            return `export interface ${paramTypeName} {\r\n${this.createTypeContent(typeItems).join('\n')}}`;
        });
        this.content = `${resTypeList.join('\r\n')}\r\n${content}`;
    }
    createTypeItems(parameters) {
        return parameters.map(i => {
            var _a;
            const { description: des, dataType, example } = i;
            const { typeArgs, typeName, isDefsType, templateIndex } = dataType;
            const { value } = (_a = this.tempMap.find(i => i.tempName === typeName)) !== null && _a !== void 0 ? _a : {};
            const valueType = value !== null && value !== void 0 ? value : this.generateResTypeValue(typeArgs, typeName, isDefsType);
            const description = this.getDescription(des, example);
            return Object.assign(i, { valueType, description });
        });
    }
    createTypeContent(typeItems) {
        return typeItems.map(({ name, required, valueType, description }) => `${description}${name}${required ? '' : '?'}: ${valueType}`);
    }
    getDescription(des, example) {
        if (!example && !des)
            return '';
        if (des) {
            return example
                ? `/** \r\n* @example ${example}\r\n* @description ${des}\r\n */\r\n`
                : `/** @description ${des} */\r\n`;
        }
        return `/** @example ${example} */\r\n`;
    }
    createBaseClasses() {
        const fileName = 'type.d.ts';
        // const { fileInfo } = this
        const { typeDirPaht, baseClasses, generateTypeRender } = this.fileInfo;
        const content = baseClasses.map(i => {
            const { name, properties, templateArgs, description } = i;
            const tempIndexs = templateArgs.map((i, index) => {
                const temp = config_1.tempNameList[index];
                this.tempMap.push({ tempName: i.typeName, value: temp });
                return temp;
            });
            const temStr = tempIndexs.length > 0 ? `<${tempIndexs.join(', ')}>` : '';
            let typeItems = this.createTypeItems(properties);
            if (typeof generateTypeRender === 'function') {
                typeItems = generateTypeRender({ fileName, typeName: name, values: typeItems });
            }
            return `${this.getDescription(description)}export interface ${name}${temStr} {\r\n${this.createTypeContent(typeItems).join('\r\n')}}`;
        });
        const filePath = path_1.default.join(typeDirPaht, fileName);
        fileList_1.fileList.push({ filePath, content: objMapType + content.join('\r\n') });
    }
}
exports.default = CreateTypeFile;
