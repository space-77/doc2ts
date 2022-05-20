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
const standard_1 = require("./standard");
const utils_1 = require("./utils");
const fs = require("fs-extra");
const path = require("path");
const diff_1 = require("./diff");
const generate_1 = require("./generators/generate");
const debugLog_1 = require("./debugLog");
const generate_2 = require("./generators/generate");
const scripts_1 = require("./scripts");
const _ = require("lodash");
const DsManager_1 = require("./DsManager");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
class Manager {
    constructor(projectRoot, config, configDir = process.cwd()) {
        this.projectRoot = projectRoot;
        this.lockFilename = 'api-lock.json';
        this.allLocalDataSources = [];
        this.diffs = {
            modDiffs: [],
            boDiffs: []
        };
        this.report = debugLog_1.info;
        this.pollingId = null;
        this.configDir = configDir;
        this.allConfigs = config.getDataSourcesConfig(configDir);
        this.currConfig = this.allConfigs[0];
    }
    setReport(report) {
        this.report = report;
        if (this.fileManager) {
            this.fileManager.report = report;
        }
    }
    mapModel(model) {
        return Object.assign({}, model, { details: [] });
    }
    selectDataSource(name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currConfig = this.allConfigs.find((conf) => conf.name === name);
            yield this.readLocalDataSource();
            yield this.readRemoteDataSource();
            if (this.pollingId) {
                this.beginPolling(this.currConfig);
            }
        });
    }
    makeAllSame() {
        if (this.allConfigs.length <= 1) {
            this.allLocalDataSources[0] = this.remoteDataSource;
        }
        else {
            const remoteName = this.remoteDataSource.name;
            const remoteDsIndex = this.allLocalDataSources.findIndex((ds) => ds.name === remoteName);
            if (remoteDsIndex === -1) {
                this.allLocalDataSources.push(this.remoteDataSource);
            }
            else {
                this.allLocalDataSources[remoteDsIndex] = this.remoteDataSource;
            }
        }
        this.currLocalDataSource = this.remoteDataSource;
        this.setFilesManager();
    }
    makeSameMod(modName) {
        const isRemoteModExists = this.remoteDataSource.mods.find((iMod) => iMod.name === modName);
        const isLocalModExists = this.currLocalDataSource.mods.find((iMod) => iMod.name === modName);
        if (!isRemoteModExists) {
            this.currLocalDataSource.mods = this.currLocalDataSource.mods.filter((mod) => mod.name !== modName);
            return;
        }
        const remoteMod = this.remoteDataSource.mods.find((iMod) => iMod.name === modName);
        if (isLocalModExists) {
            const index = this.currLocalDataSource.mods.findIndex((iMod) => iMod.name === modName);
            this.currLocalDataSource.mods[index] = remoteMod;
        }
        else {
            this.currLocalDataSource.mods.push(remoteMod);
            this.currLocalDataSource.reOrder();
        }
        const relatedBos = utils_1.getRelatedBos(remoteMod);
        relatedBos.forEach((typeName) => this.makeSameBase(typeName));
    }
    makeSameBase(baseName) {
        const isRemoteExists = this.remoteDataSource.baseClasses.find((base) => base.name === baseName);
        const isLocalExists = this.currLocalDataSource.baseClasses.find((base) => base.name === baseName);
        if (!isRemoteExists) {
            this.currLocalDataSource.baseClasses = this.currLocalDataSource.baseClasses.filter((base) => base.name !== baseName);
            return;
        }
        const remoteBase = this.remoteDataSource.baseClasses.find((base) => base.name === baseName);
        if (isLocalExists) {
            const index = this.currLocalDataSource.baseClasses.findIndex((base) => base.name === baseName);
            this.currLocalDataSource.baseClasses[index] = remoteBase;
        }
        else {
            this.currLocalDataSource.baseClasses.push(remoteBase);
            this.currLocalDataSource.reOrder();
        }
    }
    calDiffs() {
        const modDiffs = diff_1.diff(this.currLocalDataSource.mods.map(this.mapModel), this.remoteDataSource.mods.map(this.mapModel));
        const boDiffs = diff_1.diff(this.currLocalDataSource.baseClasses.map(this.mapModel), this.remoteDataSource.baseClasses.map(this.mapModel), false);
        this.diffs = {
            modDiffs,
            boDiffs
        };
    }
    polling(currConfig) {
        this.pollingId = setTimeout(() => {
            this.readRemoteDataSource(currConfig);
            this.polling(currConfig);
        }, currConfig.pollingTime * 1000);
    }
    beginPolling(currConfig = this.currConfig) {
        if (this.pollingId) {
            clearTimeout(this.pollingId);
        }
        this.polling(currConfig);
    }
    stopPolling() {
        if (this.pollingId) {
            clearTimeout(this.pollingId);
            this.pollingId = null;
        }
    }
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.existsLocal()) {
                yield this.readLocalDataSource();
                yield this.initRemoteDataSource();
            }
            else {
                const promises = this.allConfigs.map((config) => {
                    return this.readRemoteDataSource(config);
                });
                this.allLocalDataSources = yield Promise.all(promises);
                this.currLocalDataSource = this.allLocalDataSources[0];
                this.remoteDataSource = this.currLocalDataSource;
                yield this.regenerateFiles();
            }
        });
    }
    existsLocal() {
        return (fs.existsSync(path.join(this.currConfig.outDir, this.lockFilename)) ||
            _.some(this.allConfigs.map((config) => { var _a; return fs.existsSync(path.join(config.outDir, (_a = config.name, (_a !== null && _a !== void 0 ? _a : '')), this.lockFilename)); })));
    }
    readLockFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let lockFile = path.join(this.currConfig.outDir, this.lockFilename);
                const isExists = fs.existsSync(lockFile);
                if (isExists) {
                    const localDataStr = yield fs.readFile(lockFile, {
                        encoding: 'utf8'
                    });
                    if (this.allConfigs.length > 1 && this.currConfig.spiltApiLock) {
                        this.regenerateFiles().then(() => fs.rename(lockFile, `${lockFile}.bak`));
                    }
                    return JSON.parse(localDataStr);
                }
                else {
                    const allFilePromises = this.allConfigs.map((config) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const filePath = path.join(config.outDir, (_a = config.name, (_a !== null && _a !== void 0 ? _a : '')), this.lockFilename);
                        const localDataStr = yield fs.readFile(filePath, {
                            encoding: 'utf8'
                        });
                        return JSON.parse(localDataStr);
                    }));
                    return Promise.all(allFilePromises);
                }
            }
            catch (error) {
                this.report(error);
                return [];
            }
        });
    }
    readLocalDataSource() {
        return __awaiter(this, void 0, void 0, function* () {
            this.report('[readLocalDataSource]:开始');
            this.report('读取本地数据中...');
            const localDataObjects = yield this.readLockFile();
            if (!localDataObjects.length) {
                return;
            }
            this.report('读取本地完成');
            this.allLocalDataSources = localDataObjects.map((ldo) => {
                return standard_1.StandardDataSource.constructorFromLock(ldo, ldo.name);
            });
            this.allLocalDataSources = this.allLocalDataSources.filter((ldo) => {
                return Boolean(this.allConfigs.find((config) => config.name === ldo.name));
            });
            if (this.allLocalDataSources.length < this.allConfigs.length) {
                this.allConfigs.forEach((config) => {
                    if (!this.allLocalDataSources.find((ds) => ds.name === config.name)) {
                        this.allLocalDataSources.push(new standard_1.StandardDataSource({
                            mods: [],
                            name: config.name,
                            baseClasses: []
                        }));
                    }
                });
            }
            this.currLocalDataSource = this.allLocalDataSources[0];
            if (this.currConfig.name && this.allLocalDataSources.length > 1) {
                this.currLocalDataSource =
                    this.allLocalDataSources.find((ds) => ds.name === this.currConfig.name) ||
                        new standard_1.StandardDataSource({
                            mods: [],
                            name: this.currConfig.name,
                            baseClasses: []
                        });
            }
            this.setFilesManager();
            this.report('[readLocalDataSource]:结束');
        });
    }
    checkDataSource(dataSource) {
        const { mods, baseClasses } = dataSource;
        const errorModNames = [];
        const errorBaseNames = [];
        mods.forEach((mod) => {
            if (utils_1.hasChinese(mod.name)) {
                errorModNames.push(mod.name);
            }
        });
        baseClasses.forEach((base) => {
            if (utils_1.hasChinese(base.name)) {
                errorBaseNames.push(base.name);
            }
        });
        if (errorBaseNames.length && errorModNames.length) {
            const errMsg = ['当前数据源有如下项不符合规范，需要后端修改'];
            errorModNames.forEach((modName) => errMsg.push(`模块名${modName}应该改为英文名！`));
            errorBaseNames.forEach((baseName) => errMsg.push(`基类名${baseName}应该改为英文名！`));
            throw new Error(errMsg.join('\n'));
        }
    }
    initRemoteDataSource(config = this.currConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const projName = this.projectRoot;
            const currProj = {
                originUrl: this.currConfig.originUrl,
                projectName: projName
            };
            let oldRemoteSource = DsManager_1.DsManager.getLatestDsInProject(currProj);
            if (oldRemoteSource) {
                this.remoteDataSource = standard_1.StandardDataSource.constructorFromLock(oldRemoteSource, oldRemoteSource.name);
            }
            else {
                const remoteDataSource = yield scripts_1.readRemoteDataSource(config, this.report);
                this.remoteDataSource = remoteDataSource;
                yield DsManager_1.DsManager.saveDataSource(currProj, this.remoteDataSource);
            }
        });
    }
    readRemoteDataSource(config = this.currConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const projName = this.projectRoot;
            const currProj = {
                originUrl: this.currConfig.originUrl,
                projectName: projName
            };
            let oldRemoteSource = DsManager_1.DsManager.getLatestDsInProject(currProj);
            if (!oldRemoteSource) {
                if (this.remoteDataSource) {
                    DsManager_1.DsManager.saveDataSource(currProj, this.remoteDataSource);
                    oldRemoteSource = this.remoteDataSource;
                }
                else {
                    const remoteDataSource = yield scripts_1.readRemoteDataSource(config, this.report);
                    this.remoteDataSource = remoteDataSource;
                    DsManager_1.DsManager.saveDataSource(currProj, this.remoteDataSource);
                    return remoteDataSource;
                }
            }
            const remoteDataSource = yield scripts_1.readRemoteDataSource(config, this.report);
            this.remoteDataSource = remoteDataSource;
            const { modDiffs, boDiffs } = utils_1.diffDses(oldRemoteSource, this.remoteDataSource);
            if (modDiffs.length || boDiffs.length) {
                DsManager_1.DsManager.saveDataSource(currProj, this.remoteDataSource);
            }
            return remoteDataSource;
        });
    }
    lock() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fileManager.saveLock(this.currConfig.name);
        });
    }
    dispatch(files) {
        return _.mapValues(files, (value) => {
            if (typeof value === 'function') {
                return value();
            }
            if (typeof value === 'object') {
                return this.dispatch(value);
            }
            return value;
        });
    }
    getGeneratedFiles() {
        this.setFilesManager();
        const files = this.fileManager.fileStructures.getFileStructures();
        try {
            return this.dispatch(files);
        }
        catch (err) {
            return {};
        }
    }
    update(oldFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = this.getGeneratedFiles();
            try {
                yield this.fileManager.regenerate(files, oldFiles);
            }
            catch (e) {
                console.log(e.stack);
                throw new Error(e);
            }
        });
    }
    regenerateFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = this.getGeneratedFiles();
            yield this.fileManager.regenerate(files);
        });
    }
    setFilesManager() {
        this.report('文件生成器创建中...');
        const { default: Generator, FileStructures: MyFileStructures } = utils_1.getTemplate(this.currConfig.templatePath, this.currConfig.templateType);
        const generators = this.allLocalDataSources.map((dataSource) => {
            var _a;
            const config = this.getConfigByDataSourceName(dataSource.name);
            const generator = new Generator(this.currConfig.surrounding, (_a = config) === null || _a === void 0 ? void 0 : _a.outDir, this.lockFilename);
            generator.setDataSource(dataSource);
            generator.usingMultipleOrigins = this.currConfig.usingMultipleOrigins;
            if (_.isFunction(generator.getDataSourceCallback)) {
                generator.getDataSourceCallback(dataSource);
            }
            return generator;
        });
        let FileStructuresClazz = generate_2.FileStructures;
        if (MyFileStructures) {
            FileStructuresClazz = MyFileStructures;
        }
        this.fileManager = new generate_1.FilesManager(new FileStructuresClazz(generators, this.currConfig.usingMultipleOrigins, this.currConfig.surrounding, this.currConfig.outDir, this.currConfig.templateType, this.currConfig.spiltApiLock), this.currConfig.outDir);
        this.fileManager.prettierConfig = this.currConfig.prettierConfig;
        this.fileManager.report = this.report;
        this.report('文件生成器创建成功！');
    }
    getReportData() {
        const currProj = {
            originUrl: this.currConfig.originUrl,
            projectName: this.projectRoot
        };
        return DsManager_1.DsManager.getReportData(currProj);
    }
    getConfigByDataSourceName(name) {
        if (name) {
            return this.allConfigs.find((config) => config.name === name) || this.currConfig;
        }
        return this.currConfig;
    }
    openReport() {
        const currProj = {
            originUrl: this.currConfig.originUrl,
            projectName: this.projectRoot
        };
        DsManager_1.DsManager.openReport(currProj);
    }
    getCodeSnippet() {
        const generator = this.fileManager.fileStructures.generators.find((g) => {
            return g.dataSource.name === this.currLocalDataSource.name;
        });
        return generator.codeSnippet.bind(generator);
    }
}
exports.Manager = Manager;
//# sourceMappingURL=manage.js.map