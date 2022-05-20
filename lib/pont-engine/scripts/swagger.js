"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standard_1 = require("../standard");
const _ = require("lodash");
const utils_1 = require("../utils");
const compiler_1 = require("../compiler");
const base_1 = require("./base");
var SwaggerType;
(function (SwaggerType) {
    SwaggerType["integer"] = "integer";
    SwaggerType["string"] = "string";
    SwaggerType["file"] = "string";
    SwaggerType["array"] = "array";
    SwaggerType["number"] = "number";
    SwaggerType["boolean"] = "boolean";
    SwaggerType["object"] = "object";
})(SwaggerType || (SwaggerType = {}));
class SwaggerProperty {
    constructor() {
        this.enum = [];
        this.items = null;
        this.$ref = '';
        this.description = '';
    }
}
class SwaggerParameter {
    constructor() {
        this.name = '';
        this.description = '';
        this.items = null;
    }
}
class Schema {
    static parseSwaggerSchema2StandardDataType(schema, defNames, classTemplateArgs = [], compileTemplateKeyword) {
        const { items, $ref, type, additionalProperties } = schema;
        let typeName = schema.type;
        if (type === 'array') {
            let itemsType = _.get(items, 'type', '');
            const itemsRef = _.get(items, '$ref', '');
            const itemsEnum = _.get(items, 'enum', []);
            if (itemsType) {
                if (itemsType === 'integer') {
                    itemsType = 'number';
                }
                if (itemsType === 'file') {
                    itemsType = 'File';
                }
                let contentType = new standard_1.StandardDataType([], itemsType, false, -1);
                if (itemsType === 'array') {
                    contentType = new standard_1.StandardDataType([new standard_1.StandardDataType()], 'Array', false, -1);
                }
                if (itemsEnum.length) {
                    contentType = standard_1.StandardDataType.constructorWithEnum(parseSwaggerEnumType(itemsEnum));
                    contentType.typeName = itemsType;
                }
                return new standard_1.StandardDataType([contentType], 'Array', false, -1);
            }
            if (itemsRef) {
                const ast = compiler_1.compileTemplate(itemsRef, compileTemplateKeyword);
                const contentType = compiler_1.parseAst2StandardDataType(ast, defNames, classTemplateArgs);
                return new standard_1.StandardDataType([contentType], 'Array', false, -1);
            }
        }
        if (typeName === 'integer') {
            typeName = 'number';
        }
        if (typeName === 'file') {
            typeName = 'File';
        }
        if ($ref) {
            const ast = compiler_1.compileTemplate($ref, compileTemplateKeyword);
            if (!ast) {
                return new standard_1.StandardDataType();
            }
            return compiler_1.parseAst2StandardDataType(ast, defNames, classTemplateArgs);
        }
        if (schema.enum) {
            return standard_1.StandardDataType.constructorWithEnum(parseSwaggerEnumType(schema.enum));
        }
        if (type === 'object') {
            if (additionalProperties) {
                const typeArgs = [
                    new standard_1.StandardDataType(),
                    Schema.parseSwaggerSchema2StandardDataType(additionalProperties, defNames, classTemplateArgs, compileTemplateKeyword)
                ];
                return new standard_1.StandardDataType(typeArgs, 'ObjectMap', false);
            }
        }
        return new standard_1.StandardDataType([], typeName, false);
    }
}
function parseSwaggerEnumType(enumStrs) {
    let enums = enumStrs;
    enumStrs.forEach(str => {
        if (!Number.isNaN(Number(str))) {
            enums.push(Number(str));
        }
    });
    return enums
        .filter(str => {
        return String(str).match(/^[0-9a-zA-Z\_\-\$]+$/);
    })
        .map(numOrStr => {
        if (typeof numOrStr === 'string') {
            return `'${numOrStr}'`;
        }
        return numOrStr;
    });
}
exports.parseSwaggerEnumType = parseSwaggerEnumType;
class SwaggerInterface {
    constructor() {
        this.consumes = [];
        this.parameters = [];
        this.summary = '';
        this.tags = [];
    }
    static transformSwaggerV3Interface2Standard(inter, usingOperationId, samePath, defNames = []) {
        let name = '';
        const compileTemplateKeyword = '#/components/schemas/';
        if (!usingOperationId || !inter.operationId) {
            name = utils_1.getIdentifierFromUrl(inter.path, inter.method, samePath);
        }
        else {
            name = utils_1.getIdentifierFromOperatorId(inter.operationId);
        }
        const responseSuccessContent = _.get(inter, 'responses.200.content', {});
        let responseSchema;
        if (responseSuccessContent) {
            const responseFormat = Object.keys(responseSuccessContent)[0];
            responseSchema = _.get(responseSuccessContent, `${responseFormat}.schema`, {});
        }
        const response = Schema.parseSwaggerSchema2StandardDataType(responseSchema, defNames, [], compileTemplateKeyword);
        const parameters = (inter.parameters || []).map(param => {
            let paramSchema;
            const { description, items, name, type, schema = {}, required } = param;
            if (param.in === 'body') {
                paramSchema = param.schema;
            }
            else if (param.in === 'path' || param.in === 'query') {
                const schemaType = schema.type === 'array' ? undefined : schema.type;
                paramSchema = {
                    enum: param.enum,
                    items,
                    type: type || schemaType,
                    $ref: _.get(schema, '$ref')
                };
            }
            else {
                paramSchema = {
                    enum: param.enum,
                    items,
                    type,
                    $ref: _.get(schema, '$ref')
                };
            }
            return new standard_1.Property({
                in: param.in,
                description,
                name: name.includes('/') ? name.split('/').join('') : name,
                required,
                dataType: Schema.parseSwaggerSchema2StandardDataType(paramSchema, defNames, [], compileTemplateKeyword)
            });
        });
        let interDesc = inter.summary;
        if (inter.description) {
            if (interDesc) {
                interDesc += '\n' + inter.description;
            }
            else {
                interDesc = inter.description;
            }
        }
        const standardInterface = new standard_1.Interface({
            consumes: inter.consumes,
            description: interDesc,
            name,
            method: inter.method,
            path: inter.path,
            response,
            parameters: _.unionBy(parameters, 'name')
        });
        return standardInterface;
    }
    static transformSwaggerInterface2Standard(inter, usingOperationId, samePath, defNames = [], compileTempateKeyword) {
        let name = '';
        if (!usingOperationId || !inter.operationId) {
            name = utils_1.getIdentifierFromUrl(inter.path, inter.method, samePath);
        }
        else {
            name = utils_1.getIdentifierFromOperatorId(inter.operationId);
        }
        const responseSchema = _.get(inter, 'responses.200.schema', {});
        const response = Schema.parseSwaggerSchema2StandardDataType(responseSchema, defNames, [], compileTempateKeyword);
        const parameters = (inter.parameters || []).map(param => {
            let paramSchema;
            const { description, items, name, type, schema = {}, required } = param;
            if (param.in === 'body') {
                paramSchema = param.schema;
            }
            else {
                paramSchema = {
                    enum: param.enum,
                    items,
                    type,
                    $ref: _.get(schema, '$ref')
                };
            }
            return new standard_1.Property({
                in: param.in,
                description,
                name: name.includes('/') ? name.split('/').join('') : name,
                required,
                dataType: Schema.parseSwaggerSchema2StandardDataType(paramSchema, defNames)
            });
        });
        let interDesc = inter.summary;
        if (inter.description) {
            if (interDesc) {
                interDesc += '\n' + inter.description;
            }
            else {
                interDesc = inter.description;
            }
        }
        const standardInterface = new standard_1.Interface({
            consumes: inter.consumes,
            description: interDesc,
            name,
            method: inter.method,
            path: inter.path,
            response,
            parameters: _.unionBy(parameters, 'name')
        });
        return standardInterface;
    }
}
class SwaggerDataSource {
}
exports.SwaggerDataSource = SwaggerDataSource;
class SwaggerV3DataSource {
}
exports.SwaggerV3DataSource = SwaggerV3DataSource;
function parseSwaggerV3Mods(swagger, defNames, usingOperationId) {
    const allSwaggerInterfaces = [];
    _.forEach(swagger.paths, (methodInters, path) => {
        const pathItemObject = _.cloneDeep(methodInters);
        if (Array.isArray(pathItemObject.parameters)) {
            ['get', 'post', 'patch', 'delete', 'put'].forEach(method => {
                if (pathItemObject[method]) {
                    pathItemObject[method].parameters = (pathItemObject[method].parameters || []).concat(pathItemObject.parameters);
                }
            });
            delete pathItemObject.parameters;
        }
        _.forEach(pathItemObject, (inter, method) => {
            inter.path = path;
            inter.method = method;
            if (!inter.tags) {
                inter.tags = ['defaultModule'];
            }
            allSwaggerInterfaces.push(inter);
        });
    });
    if (!swagger.tags) {
        swagger.tags = [];
        allSwaggerInterfaces.forEach(({ tags }) => {
            if (tags && tags.length) {
                tags.forEach(tag => {
                    if (!swagger.tags.some(u => u.name == tag)) {
                        swagger.tags.push({ name: tag, description: '' });
                    }
                });
            }
        });
    }
    swagger.tags.push({
        name: 'defaultModule',
        description: 'defaultModule'
    });
    const mods = (swagger.tags || [])
        .map(tag => {
        const modInterfaces = allSwaggerInterfaces.filter(inter => {
            if (tag.description === undefined || tag.description === null) {
                tag.description = '';
            }
            return (inter.tags.includes(tag.name) ||
                inter.tags.includes(tag.name.toLowerCase()) ||
                inter.tags.includes(tag.description.toLowerCase()) ||
                inter.tags.includes(utils_1.toDashCase(tag.description)));
        });
        const samePath = utils_1.getMaxSamePath(modInterfaces.map(inter => inter.path.slice(1)));
        const standardInterfaces = modInterfaces.map(inter => {
            return SwaggerInterface.transformSwaggerV3Interface2Standard(inter, usingOperationId, samePath, defNames);
        });
        if (usingOperationId) {
            const names = [];
            standardInterfaces.forEach(inter => {
                if (!names.includes(inter.name)) {
                    names.push(inter.name);
                }
                else {
                    inter.name = utils_1.getIdentifierFromUrl(inter.path, inter.method, samePath);
                }
            });
        }
        if (utils_1.hasChinese(tag.name)) {
            return new standard_1.Mod({
                description: tag.name,
                interfaces: _.uniqBy(standardInterfaces, 'name'),
                name: utils_1.transformCamelCase(tag.description)
            });
        }
        else {
            return new standard_1.Mod({
                description: tag.description,
                interfaces: _.uniqBy(standardInterfaces, 'name'),
                name: utils_1.transformCamelCase(tag.name)
            });
        }
    })
        .filter(mod => {
        return mod.interfaces.length;
    });
    utils_1.transformModsName(mods);
    return mods;
}
exports.parseSwaggerV3Mods = parseSwaggerV3Mods;
function parseSwaggerMods(swagger, defNames, usingOperationId, compileTempateKeyword) {
    const allSwaggerInterfaces = [];
    _.forEach(swagger.paths, (methodInters, path) => {
        const pathItemObject = _.cloneDeep(methodInters);
        if (Array.isArray(pathItemObject.parameters)) {
            ['get', 'post', 'patch', 'delete', 'put'].forEach(method => {
                if (pathItemObject[method]) {
                    pathItemObject[method].parameters = (pathItemObject[method].parameters || []).concat(pathItemObject.parameters);
                }
            });
            delete pathItemObject.parameters;
        }
        _.forEach(pathItemObject, (inter, method) => {
            inter.path = path;
            inter.method = method;
            if (!inter.tags) {
                inter.tags = ['defaultModule'];
            }
            allSwaggerInterfaces.push(inter);
        });
    });
    if (!swagger.tags) {
        swagger.tags = [];
    }
    swagger.tags.push({
        name: 'defaultModule',
        description: 'defaultModule'
    });
    const mods = swagger.tags
        .map(tag => {
        const modInterfaces = allSwaggerInterfaces.filter(inter => {
            if (tag.description === undefined || tag.description === null) {
                tag.description = '';
            }
            return (inter.tags.includes(tag.name) ||
                inter.tags.includes(tag.name.toLowerCase()) ||
                inter.tags.includes(tag.description.toLowerCase()) ||
                inter.tags.includes(utils_1.toDashCase(tag.description)));
        });
        const samePath = utils_1.getMaxSamePath(modInterfaces.map(inter => inter.path.slice(1)));
        const standardInterfaces = modInterfaces.map(inter => {
            return SwaggerInterface.transformSwaggerInterface2Standard(inter, usingOperationId, samePath, defNames, compileTempateKeyword);
        });
        if (usingOperationId) {
            const names = [];
            standardInterfaces.forEach(inter => {
                if (!names.includes(inter.name)) {
                    names.push(inter.name);
                }
                else {
                    inter.name = utils_1.getIdentifierFromUrl(inter.path, inter.method, samePath);
                }
            });
        }
        if (utils_1.hasChinese(tag.name)) {
            return new standard_1.Mod({
                description: tag.name,
                interfaces: _.uniqBy(standardInterfaces, 'name'),
                name: utils_1.transformCamelCase(tag.description)
            });
        }
        else {
            return new standard_1.Mod({
                description: tag.description,
                interfaces: _.uniqBy(standardInterfaces, 'name'),
                name: utils_1.transformCamelCase(tag.name)
            });
        }
    })
        .filter(mod => {
        return mod.interfaces.length;
    });
    utils_1.transformModsName(mods);
    return mods;
}
exports.parseSwaggerMods = parseSwaggerMods;
function transformSwaggerData2Standard(swagger, usingOperationId = true, originName = '') {
    const draftClasses = _.map(swagger.definitions, (def, defName) => {
        const defNameAst = compiler_1.compileTemplate(defName);
        if (!defNameAst) {
            throw new Error('compiler error in defname: ' + defName);
        }
        return {
            name: defNameAst.name,
            defNameAst,
            def
        };
    });
    const defNames = draftClasses.map(clazz => clazz.name);
    const baseClasses = draftClasses.map(clazz => {
        const dataType = compiler_1.parseAst2StandardDataType(clazz.defNameAst, defNames, []);
        const templateArgs = dataType.typeArgs;
        const { description, properties } = clazz.def;
        const requiredProps = clazz.def.required || [];
        const props = _.map(properties, (prop, propName) => {
            const { $ref, description, type, items, additionalProperties } = prop;
            const required = requiredProps.includes(propName);
            const dataType = Schema.parseSwaggerSchema2StandardDataType({
                $ref,
                enum: prop.enum,
                items,
                type,
                additionalProperties
            }, defNames, templateArgs);
            return new standard_1.Property({
                dataType,
                name: propName,
                description,
                required
            });
        });
        return new standard_1.BaseClass({
            description,
            name: clazz.name,
            properties: props,
            templateArgs
        });
    });
    baseClasses.sort((pre, next) => {
        if (pre.name === next.name && pre.templateArgs.length === next.templateArgs.length) {
            return pre.templateArgs.filter(({ isDefsType }) => isDefsType).length >
                next.templateArgs.filter(({ isDefsType }) => isDefsType).length
                ? -1
                : 1;
        }
        if (pre.name === next.name) {
            return pre.templateArgs.length > next.templateArgs.length ? -1 : 1;
        }
        return next.name > pre.name ? 1 : -1;
    });
    return new standard_1.StandardDataSource({
        baseClasses: _.uniqBy(baseClasses, base => base.name),
        mods: parseSwaggerMods(swagger, defNames, usingOperationId),
        name: originName
    });
}
exports.transformSwaggerData2Standard = transformSwaggerData2Standard;
function transformSwaggerV3Data2Standard(swagger, usingOperationId = true, originName = '') {
    const compileTemplateKeyword = '#/components/schemas/';
    const draftClasses = _.map(swagger.components.schemas, (def, defName) => {
        const defNameAst = compiler_1.compileTemplate(defName, compileTemplateKeyword);
        if (!defNameAst) {
            throw new Error('compiler error in defname: ' + defName);
        }
        return {
            name: defNameAst.name,
            defNameAst,
            def
        };
    });
    const defNames = draftClasses.map(({ name }) => name);
    const baseClasses = draftClasses.map(clazz => {
        const dataType = compiler_1.parseAst2StandardDataType(clazz.defNameAst, defNames, []);
        const templateArgs = dataType.typeArgs;
        const { description, properties } = clazz.def;
        const requiredProps = clazz.def.required || [];
        const props = _.map(properties, (prop, propName) => {
            const { $ref, description, type, items, additionalProperties } = prop;
            const required = requiredProps.includes(propName);
            const dataType = Schema.parseSwaggerSchema2StandardDataType({
                $ref,
                enum: prop.enum,
                items,
                type,
                additionalProperties
            }, defNames, templateArgs, compileTemplateKeyword);
            dataType.setTemplateIndex(templateArgs);
            return new standard_1.Property({
                dataType,
                name: propName,
                description,
                required
            });
        });
        return new standard_1.BaseClass({
            description,
            name: clazz.name,
            properties: props,
            templateArgs
        });
    });
    baseClasses.sort((prev, next) => {
        if (prev.name === next.name) {
            return prev.templateArgs.length > next.templateArgs.length ? -1 : 1;
        }
        return next.name > prev.name ? 1 : -1;
    });
    return new standard_1.StandardDataSource({
        baseClasses: _.uniqBy(baseClasses, base => base.name),
        mods: parseSwaggerV3Mods(swagger, defNames, usingOperationId),
        name: originName
    });
}
exports.transformSwaggerV3Data2Standard = transformSwaggerV3Data2Standard;
class SwaggerV2Reader extends base_1.OriginBaseReader {
    transform2Standard(data, usingOperationId, originName) {
        return transformSwaggerData2Standard(data, usingOperationId, originName);
    }
}
exports.SwaggerV2Reader = SwaggerV2Reader;
class SwaggerV3Reader extends base_1.OriginBaseReader {
    transform2Standard(data, usingOperationId, originName) {
        return transformSwaggerV3Data2Standard(data, usingOperationId, originName);
    }
}
exports.SwaggerV3Reader = SwaggerV3Reader;
//# sourceMappingURL=swagger.js.map