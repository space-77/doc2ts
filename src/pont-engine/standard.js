"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils_1 = require("./utils");
const compiler_1 = require("./compiler");
var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType["number"] = "number";
    PrimitiveType["string"] = "string";
    PrimitiveType["boolean"] = "boolean";
})(PrimitiveType = exports.PrimitiveType || (exports.PrimitiveType = {}));
class Contextable {
    constructor(arg = {}) {
        _.forEach(arg, (value, key) => {
            if (value !== undefined) {
                this[key] = value;
            }
        });
    }
    getDsName() {
        const context = this.getContext();
        if (context && context.dataSource) {
            return context.dataSource.name;
        }
        return '';
    }
    getContext() {
        return this.context;
    }
    setContext(context) {
        this.context = context;
    }
    toJSON() {
        return _.mapValues(this, (value, key) => {
            if (key === 'context') {
                return undefined;
            }
            return value;
        });
    }
}
class DataType {
    constructor() {
        this.isArr = false;
        this.customType = '';
        this.reference = '';
        this.enum = [];
        this.isTemplateRef = false;
    }
}
function dateTypeRefs2Ast(refStr, originName, compileTemplateKeyword) {
    let ref = refStr.replace(new RegExp(`defs.${originName}.`, 'g'), '');
    ref = ref.replace(/defs./g, '');
    ref = ref.replace(/= any/g, '');
    const PreTemplate = '«';
    const EndTemplate = '»';
    ref = ref.replace(/</g, PreTemplate).replace(/>/g, EndTemplate);
    const ast = compiler_1.compileTemplate(ref, compileTemplateKeyword);
    return ast;
}
function dataType2StandardDataType(dataType, originName, defNames, compileTemplateKeyword) {
    let standardDataType = null;
    if (dataType.enum && dataType.enum.length) {
        standardDataType = new StandardDataType([], '', false, -1, compileTemplateKeyword);
        standardDataType.setEnum(dataType.enum);
    }
    else if (dataType.primitiveType) {
        standardDataType = new StandardDataType([], dataType.primitiveType, false, -1, compileTemplateKeyword);
    }
    else if (dataType.reference) {
        const ast = dateTypeRefs2Ast(dataType.reference, originName, compileTemplateKeyword);
        standardDataType = compiler_1.parseAst2StandardDataType(ast, defNames, []);
    }
    if (dataType.isArr) {
        if (!standardDataType) {
            standardDataType = new StandardDataType();
        }
        return new StandardDataType([standardDataType], 'Array', false, -1, compileTemplateKeyword);
    }
    if (!standardDataType) {
        return new StandardDataType();
    }
    return standardDataType;
}
class StandardDataType extends Contextable {
    constructor(typeArgs = [], typeName = '', isDefsType = false, templateIndex = -1, compileTemplateKeyword = '#/definitions/') {
        super();
        this.typeArgs = typeArgs;
        this.typeName = typeName;
        this.isDefsType = isDefsType;
        this.templateIndex = templateIndex;
        this.compileTemplateKeyword = compileTemplateKeyword;
        this.enum = [];
        this.typeProperties = [];
    }
    setEnum(enums = []) {
        this.enum = enums.map((value) => {
            if (typeof value === 'string') {
                if (!value.startsWith("'")) {
                    value = "'" + value;
                }
                if (!value.endsWith("'")) {
                    value = value + "'";
                }
            }
            return value;
        });
    }
    static constructorWithEnum(enums = []) {
        const dataType = new StandardDataType();
        dataType.setEnum(enums);
        return dataType;
    }
    static constructorFromJSON(dataType, originName, defNames) {
        if (Object.getOwnPropertyNames(dataType).includes('reference')) {
            return dataType2StandardDataType(dataType, originName, defNames, dataType.compileTemplateKeyword);
        }
        const { isDefsType, templateIndex, typeArgs = [], typeName, typeProperties } = dataType;
        if (typeArgs.length) {
            const instance = new StandardDataType(typeArgs.map((arg) => StandardDataType.constructorFromJSON(arg, originName, defNames)), typeName, isDefsType, templateIndex);
            instance.setEnum(dataType.enum);
            return instance;
        }
        const result = new StandardDataType([], typeName, isDefsType, templateIndex);
        result.setEnum(dataType.enum);
        result.typeProperties = (typeProperties || []).map((prop) => new Property(prop));
        return result;
    }
    setTemplateIndex(classTemplateArgs) {
        const codes = classTemplateArgs.map((arg) => arg.generateCode());
        const index = codes.indexOf(this.generateCode());
        this.typeArgs.forEach((arg) => arg.setTemplateIndex(classTemplateArgs));
        this.templateIndex = index;
    }
    getDefNameWithTemplate() { }
    generateCodeWithTemplate() { }
    getDefName(originName) {
        let name = this.typeName;
        if (this.isDefsType) {
            name = originName ? `defs.${originName}.${this.typeName}` : `defs.${this.typeName}`;
        }
        return name;
    }
    getEnumType() {
        return this.enum.join(' | ') || 'string';
    }
    generateCode(originName = '') {
        if (this.templateIndex !== -1) {
            return `T${this.templateIndex}`;
        }
        if (this.enum.length) {
            return this.getEnumType();
        }
        const name = this.getDefName(originName);
        if (this.typeArgs.length) {
            return `${name}<${this.typeArgs.map((arg) => arg.generateCode(originName)).join(', ')}>`;
        }
        if (this.typeProperties.length) {
            const interfaceCode = `{${this.typeProperties.map((property) => property.toPropertyCode())}
      }`;
            if (name) {
                return `${name}<${interfaceCode}>`;
            }
            return interfaceCode;
        }
        return name || 'any';
    }
    getInitialValue(usingDef = true) {
        if (this.typeName === 'Array') {
            return '[]';
        }
        if (this.isDefsType) {
            const originName = this.getDsName();
            if (!usingDef) {
                return `new ${this.typeName}()`;
            }
            return `new ${this.getDefName(originName)}()`;
        }
        if (this.templateIndex > -1) {
            return 'undefined';
        }
        if (this.typeName === 'string') {
            return "''";
        }
        if (this.typeName === 'boolean') {
            return 'false';
        }
        if (this.enum && this.enum.length) {
            const str = this.enum[0];
            if (typeof str === 'string') {
                return `${str}`;
            }
            return str + '';
        }
        return 'undefined';
    }
    get initialValue() {
        return this.getInitialValue();
    }
}
exports.StandardDataType = StandardDataType;
class Property extends Contextable {
    constructor(prop) {
        super(prop);
        if (this.name.includes('.')) {
            this.name = this.name.slice(this.name.lastIndexOf('.') + 1);
        }
    }
    setContext(context) {
        super.setContext(context);
        this.dataType.setContext(context);
    }
    toPropertyCode(surrounding = utils_1.Surrounding.typeScript, hasRequired = false, optional = false) {
        let optionalSignal = hasRequired && optional ? '?' : '';
        if (hasRequired && !this.required) {
            optionalSignal = '?';
        }
        let name = this.name;
        if (!name.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
            name = `'${name}'`;
        }
        const fieldTypeDeclaration = surrounding === utils_1.Surrounding.javaScript
            ? ''
            : `${optionalSignal}: ${this.dataType.generateCode(this.getDsName())}`;
        return `
      /** ${this.description || this.name} */
      ${name}${fieldTypeDeclaration};`;
    }
    toPropertyCodeWithInitValue(baseName = '') {
        let typeWithValue = `= ${this.dataType.getInitialValue(false)}`;
        if (!this.dataType.getInitialValue(false)) {
            typeWithValue = `: ${this.dataType.generateCode(this.getDsName())}`;
        }
        if (this.dataType.typeName === baseName) {
            typeWithValue = `= {}`;
        }
        let name = this.name;
        if (!name.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
            name = `'${name}'`;
        }
        return `
      /** ${this.description || this.name} */
      ${name} ${typeWithValue}
      `;
    }
    toBody() {
        return this.dataType.generateCode(this.getDsName());
    }
}
exports.Property = Property;
class Interface extends Contextable {
    constructor(inter) {
        super(inter);
    }
    get responseType() {
        return this.response.generateCode(this.getDsName());
    }
    getParamsCode(className = 'Params', surrounding = utils_1.Surrounding.typeScript) {
        return `class ${className} {
      ${this.parameters
            .filter((param) => param.in === 'path' || param.in === 'query')
            .map((param) => param.toPropertyCode(surrounding, true))
            .join('')}
    }
  `;
    }
    getParamList() {
        const form = !!this.parameters.find((param) => param.in === 'formData');
        const paramList = [
            {
                paramKey: 'params',
                paramType: 'Params'
            },
            {
                paramKey: 'form',
                paramType: form ? 'FormData' : ''
            },
            {
                paramKey: 'body',
                paramType: this.getBodyParamsCode()
            },
            {
                paramKey: 'options',
                optional: true,
                paramType: 'any',
                initialValue: '{}'
            }
        ];
        return paramList;
    }
    getRequestContent() {
        const paramList = this.getParamList().filter((param) => param.paramType);
        const method = this.method.toUpperCase();
        const hasForm = paramList.map((param) => param.paramKey).includes('form');
        const hasBody = paramList.map((param) => param.paramKey).includes('body');
        const hasOptions = paramList.map((param) => param.paramKey).includes('options');
        return `{
      method: "${method}",
      ${hasForm ? 'body: form,' : ''}
      ${hasBody ? 'body,' : ''}
      ${hasOptions ? '...options,' : ''}
    }`;
    }
    getRequestParams(surrounding = utils_1.Surrounding.typeScript) {
        const paramList = this.getParamList().filter((param) => param.paramType);
        if (surrounding === utils_1.Surrounding.typeScript) {
            return paramList.map((param) => `${param.paramKey}${param.optional ? '?' : ''}: ${param.paramType}`).join(', ');
        }
        return paramList
            .map((param) => `${param.paramKey}${param.initialValue ? ` = ${param.initialValue}` : ''}`)
            .join(', ');
    }
    getBodyParamsCode() {
        const bodyParam = this.parameters.find((param) => param.in === 'body');
        return (bodyParam && bodyParam.dataType.generateCode(this.getDsName())) || '';
    }
    setContext(context) {
        super.setContext(context);
        this.parameters.forEach((param) => param.setContext(context));
        this.response && this.response.setContext(context);
    }
}
exports.Interface = Interface;
class Mod extends Contextable {
    constructor(mod) {
        super(mod);
        this.interfaces = _.orderBy(this.interfaces, 'path');
    }
    setContext(context) {
        super.setContext(context);
        this.interfaces.forEach((inter) => inter.setContext(Object.assign(Object.assign({}, context), { mod: this })));
    }
}
exports.Mod = Mod;
class BaseClass extends Contextable {
    constructor(base) {
        super(base);
        this.properties = _.orderBy(this.properties, 'name');
    }
    setContext(context) {
        super.setContext(context);
        this.properties.forEach((prop) => prop.setContext(context));
    }
}
exports.BaseClass = BaseClass;
class StandardDataSource {
    constructor(standard) {
        this.mods = standard.mods;
        if (standard.name) {
            this.name = standard.name;
        }
        this.baseClasses = standard.baseClasses;
        this.reOrder();
        this.setContext();
    }
    reOrder() {
        this.baseClasses = _.orderBy(this.baseClasses, 'name');
        this.mods = _.orderBy(this.mods, 'name');
    }
    validate() {
        const errors = [];
        this.mods.forEach((mod) => {
            if (!mod.name) {
                errors.push(`lock 文件不合法，发现没有 name 属性的模块;`);
            }
        });
        this.baseClasses.forEach((base) => {
            if (!base.name) {
                errors.push(`lock 文件不合法，发现没有 name 属性的基类;`);
            }
        });
        const dupMod = utils_1.getDuplicateById(this.mods, 'name');
        const dupBase = utils_1.getDuplicateById(this.baseClasses, 'name');
        if (dupMod) {
            errors.push(`模块 ${dupMod.name} 重复了。`);
        }
        if (dupBase) {
            errors.push(`基类 ${dupBase.name} 重复了。`);
        }
        if (errors && errors.length) {
            throw new Error(errors.join('\n'));
        }
        return errors;
    }
    serialize() {
        return JSON.stringify({
            mods: this.mods,
            baseClasses: this.baseClasses
        }, null, 2);
    }
    setContext() {
        this.baseClasses.forEach((base) => base.setContext({ dataSource: this }));
        this.mods.forEach((mod) => mod.setContext({ dataSource: this }));
    }
    static constructorFromLock(localDataObject, originName) {
        let currentInter;
        try {
            const defNames = localDataObject.baseClasses.map((base) => {
                if (base.name.includes('<')) {
                    return base.name.slice(0, base.name.indexOf('<'));
                }
                return base.name;
            });
            const baseClasses = localDataObject.baseClasses.map((base) => {
                const props = base.properties.map((prop) => {
                    return new Property(Object.assign(Object.assign({}, prop), { dataType: StandardDataType.constructorFromJSON(prop.dataType, originName, defNames) }));
                });
                let templateArgs = base.templateArgs;
                let name = base.name;
                if (!templateArgs && base.name.includes('<')) {
                    const defNameAst = dateTypeRefs2Ast(base.name, localDataObject.name);
                    const dataType = compiler_1.parseAst2StandardDataType(defNameAst, defNames, []);
                    templateArgs = dataType.typeArgs;
                    name = dataType.typeName;
                }
                return new BaseClass({
                    description: base.description,
                    name,
                    templateArgs,
                    properties: _.unionBy(props, 'name')
                });
            });
            const mods = localDataObject.mods.map((mod) => {
                const interfaces = mod.interfaces.map((inter) => {
                    const response = StandardDataType.constructorFromJSON(inter.response, localDataObject.name, defNames);
                    currentInter = inter;
                    const parameters = inter.parameters
                        .map((param) => {
                        const dataType = StandardDataType.constructorFromJSON(param.dataType, localDataObject.name, defNames);
                        return new Property(Object.assign(Object.assign({}, param), { dataType }));
                    })
                        .filter(_.identity);
                    return new Interface(Object.assign(Object.assign({}, inter), { parameters,
                        response }));
                });
                return new Mod({
                    description: mod.description,
                    name: mod.name,
                    interfaces
                });
            });
            return new StandardDataSource({
                baseClasses,
                mods,
                name: localDataObject.name
            });
        }
        catch (e) {
            const errArray = [];
            if (currentInter) {
                errArray.push(`[interfaces.path]:${currentInter.path}`);
            }
            errArray.push(e.toString());
            throw new Error(`${errArray.join('\n')}\n请检查api-lock.json文件`);
        }
    }
}
exports.StandardDataSource = StandardDataSource;
//# sourceMappingURL=standard.js.map