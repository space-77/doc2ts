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
exports.rename = exports.getConfig = exports.findDiffPath = exports.createType = exports.createDeepType = exports.getTypeList = exports.findType = exports.updateName = exports.firstToLower = exports.firstToUpper = exports.camel2Kebab = void 0;
const fs_1 = __importDefault(require("fs"));
const typescript_1 = __importDefault(require("typescript"));
const log_1 = __importDefault(require("./log"));
const path_1 = __importDefault(require("path"));
/**
 * @param str
 * @description 烤串转驼峰
 */
function camel2Kebab(str) {
    return str.replace(/-(\w)/g, (_, $1) => $1.toUpperCase());
}
exports.camel2Kebab = camel2Kebab;
/**
 * @param str
 * @description 首字母大写
 */
function firstToUpper(str) {
    return str.replace(/^(\S)/g, val => val.toUpperCase());
}
exports.firstToUpper = firstToUpper;
/**
 * @param str
 * @description 首字母小写
 */
function firstToLower(str) {
    return str.replace(/^(\S)/g, val => val.toLocaleLowerCase());
}
exports.firstToLower = firstToLower;
/**
 *
 * @param name
 * @param nameList
 * @description 就解决重名问题
 */
function updateName(name, nameList) {
    var _a;
    const reg = /(.*_)(\d+)/;
    while (nameList.has(name)) {
        const [_, _name, _version] = (_a = name.match(reg)) !== null && _a !== void 0 ? _a : [];
        name = _version ? `${_name || name}${Number(_version) + 1}` : `${name}_1`;
    }
    return name;
}
exports.updateName = updateName;
/**
 *
 * @param str
 * @description 类型装换
 */
function findType(str) {
    switch (str) {
        case 'number':
        case 'integer':
            return 'number';
        case 'string':
            return 'string';
        case 'boolean':
            return 'boolean';
        case 'array':
            return '[]';
        case 'object':
            return 'object';
    }
}
exports.findType = findType;
/**
 * @description 根据JSON生成数据类型
 */
const getTypeList = ({ json, deep = 1, parentName, deepTypes }) => {
    return json
        .map(i => {
        const { children, type, keyName, required, description, loop, hsaLoop } = i;
        if (keyName === 'budget') {
            console.log(i);
        }
        const space = Array.from(Array(deep * 2 + 1)).join(' ');
        const des = description ? `${space}/** @description ${description} */\n` : '';
        const keyStr = `${des}${space}${keyName}${required ? '' : '?'}`;
        const isArrayStr = type === 'array' ? '[]' : '';
        let valeuStr = '';
        if (Array.isArray(children)) {
            valeuStr = `{\n${(0, exports.getTypeList)({ json: children, deep: deep + 1, parentName: keyName, deepTypes })}\n${space}}`;
        }
        else {
            valeuStr = findType(type) || '';
        }
        // const valeuStr = Array.isArray(children)
        //   ? `{\n${getTypeList({ json: children, deep: deep + 1, parentName: keyName, deepTypes })}\n${space}}`
        //   : findType(type as string)
        if (hsaLoop) {
            // 子类型存在，引用该类型，需要在外部重新定义类型
            let typeName = `${firstToUpper(`${parentName || keyName}`)}LooSp`;
            typeName = deepTypes[typeName] ? updateName(typeName, new Set(Object.keys(deepTypes))) : typeName;
            deepTypes[typeName] = [i];
            return `${keyStr}: ${typeName}${isArrayStr}`;
        }
        // 该属性是引用父级的类型。
        if (loop)
            return `${keyStr}: ${parentName}${isArrayStr}`;
        return `${keyStr}: ${valeuStr}${isArrayStr}`;
    })
        .join('\n');
};
exports.getTypeList = getTypeList;
function createDeepType(deepTypes) {
    const newDeepTypes = {};
    return Object.entries(deepTypes)
        .map(([typeName, value]) => {
        let resStr = `export interface ${typeName} {\n`;
        resStr += `${(0, exports.getTypeList)({ json: value, parentName: typeName, deepTypes: newDeepTypes })}\n}`;
    })
        .join('\n');
}
exports.createDeepType = createDeepType;
function createType(typesList) {
    const { description, typeName, value, parentTypeName, refs } = typesList;
    let contentStr = '';
    value.forEach(i => {
        const { description, required, keyName, type, hsaChild, childTypeName, childType = '', example, loop } = i;
        if (!type && !hsaChild)
            return;
        let valeuStr = '';
        let childTypeStr = findType(childType) || '';
        const typeStr = type === 'array' ? '[]' : '';
        const exampleStr = example ? `\n   * @example ${example}\n   *` : '';
        childTypeStr = childTypeStr === 'object' ? 'any' : childTypeStr;
        const des = description ? `  /**${exampleStr} @description ${description}${exampleStr ? '\n  ' : ''} */\n` : '';
        if (loop) {
            valeuStr = `${typeName}${typeStr}`;
        }
        else {
            valeuStr = hsaChild
                ? `${childTypeName || 'any'}${typeStr}`
                : `${childTypeStr}${findType(type)}` || 'any';
        }
        const itemStr = `  ${keyName}${required ? '' : '?'}: ${valeuStr}\n`;
        contentStr += `${des}${itemStr}`;
    });
    return `/** @description ${description} */
export interface ${typeName}${parentTypeName ? ` extends ${parentTypeName}` : ''} {\n${contentStr}}\n`;
}
exports.createType = createType;
/**
 * @param originPath 起始位置
 * @param targetPath 目标位置
 * @description 计算某个路径和另一个路径之间的差值
 */
function findDiffPath(originPath, targetPath) {
    const maxLen = Math.max(...[originPath.length, targetPath.length]) - 1;
    let index = -1;
    for (let i = 0; i < maxLen; i++) {
        if (originPath[i] !== targetPath[i]) {
            index = i;
            break;
        }
    }
    if (index === -1)
        throw new Error('两个路径不在同一个盘符');
    const _originPath = originPath
        .slice(index)
        .split('\\')
        .map(() => '..')
        .join('/');
    const _targetPath = targetPath.slice(index);
    return path_1.default.join(_originPath, _targetPath).replace(/\\/g, '/');
}
exports.findDiffPath = findDiffPath;
function getConfig(configPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            log_1.default.info('正在读取配置文件');
            const prePath = findDiffPath(__dirname, `${process.cwd()}\\`);
            const filePath = path_1.default.join(__dirname, prePath, configPath);
            const tsResult = fs_1.default.readFileSync(filePath, 'utf8');
            const jsResult = typescript_1.default.transpileModule(tsResult, {
                compilerOptions: {
                    target: typescript_1.default.ScriptTarget.ES2015,
                    module: typescript_1.default.ModuleKind.CommonJS
                }
            });
            const noCacheFix = (Math.random() + '').slice(2, 5);
            const jsName = path_1.default.join(__dirname, `__${noCacheFix}__.js`);
            // 编译到js
            fs_1.default.writeFileSync(jsName, jsResult.outputText, 'utf8');
            // 删除该文件
            const res = require(jsName).default;
            fs_1.default.unlinkSync(jsName);
            return res;
        }
        catch (error) {
            log_1.default.error('读取配置文件失败');
            throw new Error('加载配置文件失败');
        }
    });
}
exports.getConfig = getConfig;
function rename(name, method) {
    if (typeof method === 'function') {
        return method(name);
    }
    else if (typeof method === 'string' || method instanceof RegExp) {
        return name.replace(method, '');
    }
    return name;
}
exports.rename = rename;
