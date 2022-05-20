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
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fs = require("fs-extra");
const path = require("path");
const utils_1 = require("../utils");
const debugLog_1 = require("../debugLog");
const templates_1 = require("../templates");
class FileStructures {
    constructor(generators, usingMultipleOrigins, surrounding = utils_1.Surrounding.typeScript, baseDir = 'src/service', templateType = '', spiltApiLock) {
        this.generators = generators;
        this.usingMultipleOrigins = usingMultipleOrigins;
        this.surrounding = surrounding;
        this.baseDir = baseDir;
        this.templateType = templateType;
        this.spiltApiLock = spiltApiLock;
        this.getApiUseCases = (inter) => {
            const context = inter.getContext();
            return [`API${this.usingMultipleOrigins ? `.${context.dataSource.name}` : ''}.${context.mod.name}.${inter.name}`];
        };
    }
    getMultipleOriginsFileStructures() {
        const files = {};
        this.generators
            .filter((generator) => generator.outDir === this.baseDir)
            .forEach((generator) => {
            const dsName = generator.dataSource.name;
            const dsFiles = this.getOriginFileStructures(generator, true);
            files[dsName] = dsFiles;
        });
        const fileStructures = Object.assign(Object.assign({}, files), { [utils_1.getFileName('index', this.surrounding)]: this.getDataSourcesTs.bind(this), 'api.d.ts': this.getDataSourcesDeclarationTs.bind(this) });
        return this.spiltApiLock
            ? fileStructures
            : Object.assign(Object.assign({}, fileStructures), { 'api-lock.json': this.getLockContent() });
    }
    getBaseClassesInDeclaration(originCode, usingMultipleOrigins) {
        if (usingMultipleOrigins) {
            return `
      declare namespace defs {
        export ${originCode}
      };
      `;
        }
        return `
      declare ${originCode}
    `;
    }
    getModsDeclaration(originCode, usingMultipleOrigins) {
        if (usingMultipleOrigins) {
            return `
      declare namespace API {
        export ${originCode}
      };
      `;
        }
        return `
      declare ${originCode}
    `;
    }
    getOriginFileStructures(generator, usingMultipleOrigins = false) {
        let mods = {};
        const dataSource = generator.dataSource;
        const indexFileName = utils_1.getFileName('index', this.surrounding);
        dataSource.mods.forEach((mod) => {
            const currMod = {};
            mod.interfaces.forEach((inter) => {
                currMod[utils_1.getFileName(inter.name, this.surrounding)] = generator.getInterfaceContent.bind(generator, inter);
                currMod[indexFileName] = generator.getModIndex.bind(generator, mod);
            });
            const modName = utils_1.reviseModName(mod.name);
            mods[modName] = currMod;
            mods[indexFileName] = generator.getModsIndex.bind(generator);
        });
        if (!generator.hasContextBund) {
            generator.getBaseClassesInDeclaration = this.getBaseClassesInDeclaration.bind(this, generator.getBaseClassesInDeclaration(), usingMultipleOrigins);
            generator.getModsDeclaration = this.getModsDeclaration.bind(this, generator.getModsDeclaration(), usingMultipleOrigins);
            generator.hasContextBund = true;
        }
        const fileStructures = {
            [utils_1.getFileName('baseClass', this.surrounding)]: generator.getBaseClassesIndex.bind(generator),
            mods: mods,
            [indexFileName]: generator.getIndex.bind(generator),
            'api.d.ts': generator.getDeclaration.bind(generator)
        };
        if (this.spiltApiLock && usingMultipleOrigins) {
            fileStructures[generator.lockFilename] = this.getLockContent(generator);
        }
        else if (!usingMultipleOrigins) {
            fileStructures[generator.lockFilename] = this.getLockContent();
        }
        return fileStructures;
    }
    getFileStructures() {
        const result = this.usingMultipleOrigins || this.generators.length > 1
            ? this.getMultipleOriginsFileStructures()
            : this.getOriginFileStructures(this.generators[0]);
        if (this.surrounding === utils_1.Surrounding.javaScript) {
            if (!fs.existsSync(this.baseDir + '/pontCore.js')) {
                result['pontCore.js'] = utils_1.getTemplatesDirFile('pontCore.js', 'pontCore/');
                result['pontCore.d.ts'] = utils_1.getTemplatesDirFile('pontCore.d.ts', 'pontCore/');
            }
            if (this.templateType && this.checkHasTemplateFetch()) {
                result[`${this.templateType}.js`] = utils_1.getTemplatesDirFile(`${this.templateType}.js`, 'pontCore/');
                result[`${this.templateType}.d.ts`] = utils_1.getTemplatesDirFile(`${this.templateType}.d.ts`, 'pontCore/');
            }
        }
        return result;
    }
    checkHasTemplateFetch() {
        const templateTypesWithOutFetch = templates_1.templateRegistion
            .map((item) => item.templateType)
            .filter((item) => item !== 'fetch');
        if (templateTypesWithOutFetch.includes(this.templateType) &&
            utils_1.judgeTemplatesDirFileExists(`${this.templateType}.js`, 'pontCore/')) {
            return true;
        }
        return false;
    }
    getMultipleOriginsDataSourceName() {
        const dsNames = this.generators.map((ge) => ge.dataSource.name);
        if (this.judgeHasMultipleFilesName()) {
            const generate = this.generators.find((ge) => ge.outDir === this.baseDir);
            if (generate) {
                return [generate.dataSource.name];
            }
        }
        return dsNames;
    }
    judgeHasMultipleFilesName() {
        return this.generators.some((generate) => {
            return generate.outDir !== this.baseDir;
        });
    }
    getDataSourcesTs() {
        const dsNames = this.getMultipleOriginsDataSourceName();
        const generatedCode = this.surrounding === utils_1.Surrounding.typeScript ? '(window as any)' : 'window';
        return `
      ${dsNames
            .map((name) => {
            return `import { defs as ${name}Defs, ${name} } from './${name}';
          `;
        })
            .join('\n')}

      ${generatedCode}.defs = {
        ${dsNames.map((name) => `${name}: ${name}Defs,`).join('\n')}
      };
      ${generatedCode}.API = {
        ${dsNames.join(',\n')}
      };
    `;
    }
    getDataSourcesDeclarationTs() {
        const dsNames = this.getMultipleOriginsDataSourceName();
        return `
    ${dsNames
            .map((name) => {
            return `/// <reference path="./${name}/api.d.ts" />`;
        })
            .join('\n')}
    `;
    }
    getLockContent(generate) {
        if (generate) {
            const dataSource = this.usingMultipleOrigins ? generate.dataSource : [generate.dataSource];
            return JSON.stringify(dataSource, null, 2);
        }
        else {
            const dataSource = this.generators.map((ge) => ge.dataSource);
            return JSON.stringify(dataSource, null, 2);
        }
    }
}
exports.FileStructures = FileStructures;
class CodeGenerator {
    constructor(surrounding = utils_1.Surrounding.typeScript, outDir = '', lockFilename = 'api-lock.json') {
        this.surrounding = surrounding;
        this.outDir = outDir;
        this.usingMultipleOrigins = false;
        this.hasContextBund = false;
        this.lockFilename = lockFilename;
    }
    setDataSource(dataSource) {
        this.dataSource = dataSource;
        this.dataSource.name = _.camelCase(this.dataSource.name);
    }
    getBaseClassInDeclaration(base) {
        if (base.templateArgs && base.templateArgs.length) {
            return `class ${base.name}<${base.templateArgs.map((_, index) => `T${index} = any`).join(', ')}> {
        ${base.properties.map((prop) => prop.toPropertyCode(utils_1.Surrounding.typeScript, true)).join('\n')}
      }
      `;
        }
        return `class ${base.name} {
      ${base.properties.map((prop) => prop.toPropertyCode(utils_1.Surrounding.typeScript, true)).join('\n')}
    }
    `;
    }
    getBaseClassesInDeclaration() {
        const content = `namespace ${this.dataSource.name || 'defs'} {
      ${this.dataSource.baseClasses
            .map((base) => `
        export ${this.getBaseClassInDeclaration(base)}
      `)
            .join('\n')}
    }
    `;
        return content;
    }
    getBaseClassesInDeclarationWithMultipleOrigins() {
        return `
      declare namespace defs {
        export ${this.getBaseClassesInDeclaration()}
      }
    `;
    }
    getBaseClassesInDeclarationWithSingleOrigin() {
        return `
      declare ${this.getBaseClassesInDeclaration()}
    `;
    }
    getInterfaceContentInDeclaration(inter) {
        const bodyParams = inter.getBodyParamsCode();
        const requestParams = bodyParams ? `params: Params, bodyParams: ${bodyParams}` : `params: Params`;
        return `
      export ${inter.getParamsCode('Params', this.surrounding)}

      export type Response = ${inter.responseType};
      export const init: Response;
      export function request(${requestParams}): Promise<${inter.responseType}>;
    `;
    }
    getInterfaceInDeclaration(inter) {
        return `
      /**
        * ${inter.description}
        * ${inter.path}
        */
      export namespace ${inter.name} {
        ${this.getInterfaceContentInDeclaration(inter)}
      }
    `;
    }
    getModsDeclaration() {
        const mods = this.dataSource.mods;
        const content = `namespace ${this.dataSource.name || 'API'} {
        ${mods
            .map((mod) => `
          /**
           * ${mod.description}
           */
          export namespace ${utils_1.reviseModName(mod.name)} {
            ${mod.interfaces.map(this.getInterfaceInDeclaration.bind(this)).join('\n')}
          }
        `)
            .join('\n\n')}
      }
    `;
        return content;
    }
    getModsDeclarationWithMultipleOrigins() { }
    getModsDeclarationWithSingleOrigin() { }
    getCommonDeclaration() {
        return '';
    }
    getDeclaration() {
        return `
      type ObjectMap<Key extends string | number | symbol = any, Value = any> = {
        [key in Key]: Value;
      }

      ${this.getCommonDeclaration()}

      ${this.getBaseClassesInDeclaration()}

      ${this.getModsDeclaration()}
    `;
    }
    getIndex() {
        let conclusion = `
      import * as defs from './baseClass';
      import './mods/';

      ${this.surrounding === utils_1.Surrounding.typeScript ? '(window as any)' : 'window'}.defs = defs;
    `;
        if (this.dataSource.name) {
            conclusion = `
        import { ${this.dataSource.name} as defs } from './baseClass';
        export { ${this.dataSource.name} } from './mods/';
        export { defs };
      `;
        }
        return conclusion;
    }
    getBaseClassesIndex() {
        const clsCodes = this.dataSource.baseClasses.map((base) => `
        class ${base.name} {
          ${base.properties
            .map((prop) => {
            return prop.toPropertyCodeWithInitValue(base.name);
        })
            .filter((id) => id)
            .join('\n')}
        }
      `);
        if (this.dataSource.name) {
            return `
        ${clsCodes.join('\n')}
        export const ${this.dataSource.name} = {
          ${this.dataSource.baseClasses.map((bs) => bs.name).join(',\n')}
        }
      `;
        }
        return clsCodes.map((cls) => `export ${cls}`).join('\n');
    }
    getInterfaceContent(inter) {
        const method = inter.method.toUpperCase();
        const bodyParams = inter.getBodyParamsCode();
        return `
    /**
     * @desc ${inter.description}
     */

    import * as defs from '../../baseClass';
    import { pontCore } from '../../pontCore';

    export ${inter.getParamsCode('Params', this.surrounding)}

    export const init = ${inter.response.getInitialValue()};

    export function request(${bodyParams ? `params = {}, bodyParams = null` : 'params = {}'}) {

      return pontCore.fetch(pontCore.getUrl("${inter.path}", params, "${method}"), {
        method: "${method}",
        body: ${bodyParams ? 'bodyParams' : 'null'},
      });
    }
   `;
    }
    getModIndex(mod) {
        return `
      /**
       * @description ${mod.description}
       */
      ${mod.interfaces
            .map((inter) => {
            return `import * as ${inter.name} from './${inter.name}';`;
        })
            .join('\n')}

      export {
        ${mod.interfaces.map((inter) => inter.name).join(', \n')}
      }
    `;
    }
    getModsIndex() {
        let conclusion = `
      ${this.surrounding === utils_1.Surrounding.typeScript ? '(window as any)' : 'window'}.API = {
        ${this.dataSource.mods.map((mod) => utils_1.reviseModName(mod.name)).join(', \n')}
      };
    `;
        if (this.dataSource.name) {
            conclusion = `
        export const ${this.dataSource.name} = {
          ${this.dataSource.mods.map((mod) => utils_1.reviseModName(mod.name)).join(', \n')}
        };
      `;
        }
        return `
      ${this.dataSource.mods
            .map((mod) => {
            const modName = utils_1.reviseModName(mod.name);
            return `import * as ${modName} from './${modName}';`;
        })
            .join('\n')}

      ${conclusion}
    `;
    }
    getDataSourceCallback(dataSource) {
        if (dataSource) {
            return;
        }
    }
    codeSnippet(inter) {
        const context = inter.getContext();
        return `API${this.usingMultipleOrigins ? `.${context.dataSource.name}` : ''}.${context.mod.name}.${inter.name}`;
    }
}
exports.CodeGenerator = CodeGenerator;
class FilesManager {
    constructor(fileStructures, baseDir) {
        this.fileStructures = fileStructures;
        this.baseDir = baseDir;
        this.report = debugLog_1.info;
    }
    initPath(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirpSync(path);
        }
    }
    regenerate(files, oldFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initPath(this.baseDir);
            if (oldFiles && Object.keys(oldFiles || {}).length) {
                const updateTask = this.diffFiles(files, oldFiles);
                if (updateTask.deletes && updateTask.deletes.length) {
                    this.report(`删除${updateTask.deletes.length}个文件及文件夹`);
                    yield Promise.all(updateTask.deletes.map((filePath) => {
                        fs.unlink(filePath);
                    }));
                }
                if (updateTask.updateCnt) {
                    this.report(`更新${updateTask.updateCnt}个文件`);
                    console.time(`更新${updateTask.updateCnt}个文件`);
                    yield this.updateFiles(updateTask.files);
                    console.timeEnd(`更新${updateTask.updateCnt}个文件`);
                }
            }
            else {
                yield this.generateFiles(files);
            }
        });
    }
    saveLock(originName) {
        return __awaiter(this, void 0, void 0, function* () {
            const setLockFile = (generator) => __awaiter(this, void 0, void 0, function* () {
                const lockFilePath = path.join(generator.outDir, this.fileStructures.spiltApiLock && this.fileStructures.usingMultipleOrigins ? generator.dataSource.name : '', generator.lockFilename);
                const lockContent = yield fs.readFile(lockFilePath, 'utf8');
                const newLockContent = this.fileStructures.getLockContent(this.fileStructures.spiltApiLock && this.fileStructures.usingMultipleOrigins ? generator : null);
                if (lockContent !== newLockContent) {
                    yield fs.writeFile(lockFilePath, newLockContent);
                }
            });
            if (this.fileStructures.usingMultipleOrigins) {
                if (originName) {
                    const targetOrigin = this.fileStructures.generators.find((generator) => generator.dataSource.name === originName);
                    targetOrigin && setLockFile(targetOrigin);
                }
                else {
                    this.fileStructures.generators.forEach(setLockFile);
                }
            }
            else {
                const targetOrigin = this.fileStructures.generators[0];
                targetOrigin && setLockFile(targetOrigin);
            }
        });
    }
    diffFiles(newFiles, lastFiles, dir = this.baseDir) {
        const task = {
            deletes: [],
            files: {},
            updateCnt: 0
        };
        _.map(lastFiles, (lastValue, name) => {
            const currPath = `${dir}/${name}`;
            const newValue = newFiles[name];
            if (!newValue) {
                task.deletes.push(currPath);
                return;
            }
            if (typeof newValue === 'object' && typeof lastValue === 'string') {
                task.deletes.push(currPath);
                const fileTask = this.diffFiles(newValue, {}, currPath);
                if (fileTask.updateCnt) {
                    task.files = Object.assign(Object.assign(Object.assign({}, task.files), { [currPath]: undefined }), fileTask.files);
                    task.updateCnt += fileTask.updateCnt + 1;
                }
                return;
            }
            if (typeof newValue === 'string' && typeof lastValue === 'object') {
                task.deletes.push(currPath);
                return;
            }
            if (typeof lastValue === 'string') {
                if (newValue !== lastValue) {
                    task.files[currPath] = newValue;
                    task.updateCnt++;
                }
            }
            else {
                const fileTask = this.diffFiles(newValue, lastValue, currPath);
                task.deletes.push(...fileTask.deletes);
                if (fileTask.updateCnt) {
                    task.updateCnt += fileTask.updateCnt;
                    task.files = Object.assign(Object.assign({}, task.files), fileTask.files);
                }
            }
        });
        _.map(newFiles, (newValue, name) => {
            const currPath = `${dir}/${name}`;
            const lastValue = lastFiles[name];
            if (!lastValue) {
                if (typeof newValue === 'string') {
                    task.files[currPath] = newValue;
                    task.updateCnt += 1;
                }
                else {
                    const fileTask = this.diffFiles(newValue, {}, currPath);
                    if (fileTask.updateCnt) {
                        task.updateCnt += fileTask.updateCnt + 1;
                        task.files = Object.assign(Object.assign(Object.assign({}, task.files), { [currPath]: undefined }), fileTask.files);
                    }
                }
            }
        });
        return task;
    }
    formatFile(code, name = '') {
        if (name && name.endsWith('.json')) {
            return code;
        }
        return utils_1.format(code, this.prettierConfig);
    }
    updateFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(_.map(files, (value, filePath) => __awaiter(this, void 0, void 0, function* () {
                if (value === undefined) {
                    return fs.mkdir(filePath);
                }
                if (filePath.endsWith('.json')) {
                    return fs.writeFile(filePath, value);
                }
                return fs.writeFile(filePath, this.formatFile(value));
            })));
        });
    }
    generateFiles(files, dir = this.baseDir) {
        return __awaiter(this, void 0, void 0, function* () {
            const currFiles = yield fs.readdir(dir);
            const promises = _.map(files, (value, name) => __awaiter(this, void 0, void 0, function* () {
                const currPath = `${dir}/${name}`;
                if (typeof value === 'string') {
                    if (currFiles.includes(name)) {
                        const state = yield fs.lstat(currPath);
                        if (state.isDirectory()) {
                            yield fs.unlink(currPath);
                            return fs.writeFile(currPath, this.formatFile(value, name));
                        }
                        else {
                            const newValue = this.formatFile(value);
                            const currValue = yield fs.readFile(currPath, 'utf8');
                            if (newValue !== currValue) {
                                return fs.writeFile(currPath, this.formatFile(value, name));
                            }
                            return;
                        }
                    }
                    else {
                        return fs.writeFile(currPath, this.formatFile(value, name));
                    }
                }
                if (currFiles.includes(name)) {
                    const state = yield fs.lstat(currPath);
                    if (state.isDirectory()) {
                        return this.generateFiles(files[name], currPath);
                    }
                    else {
                        yield fs.unlink(currPath);
                        yield fs.mkdir(currPath);
                        return this.generateFiles(files[name], currPath);
                    }
                }
                else {
                    yield fs.mkdir(currPath);
                    return this.generateFiles(files[name], currPath);
                }
            }));
            yield Promise.all(promises);
        });
    }
}
exports.FilesManager = FilesManager;
//# sourceMappingURL=generate.js.map