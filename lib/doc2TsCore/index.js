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
const fs_1 = __importDefault(require("fs"));
const log_1 = __importDefault(require("../utils/log"));
const api_1 = __importDefault(require("../utils/api"));
const path_1 = __importDefault(require("path"));
const fileList_1 = require("../generators/fileList");
const createTypeFile_1 = __importDefault(require("../generators/createTypeFile"));
const config_1 = require("../common/config");
const scripts_1 = require("../pont-engine/scripts");
const createApiFile_1 = require("../generators/createApiFile");
const utils_1 = require("../utils");
class Doc2Ts {
    constructor() {
        this.api = new api_1.default();
        // modelList: ModelList[] = []
        this.StandardDataSourceList = [];
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConfig();
                // await this.getModelList()
                yield this.initRemoteDataSource();
                yield this.generateFileData();
                this.createFiles();
                yield this.transform2js();
                log_1.default.clear();
                log_1.default.success(log_1.default.done(' ALL DONE '));
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield (0, utils_1.getConfig)(config_1.CONFIG_PATH);
            this.config = new config_1.Config(config);
        });
    }
    // async getModelList() {
    //   try {
    //     this.modelList = await getModelUrl(this.config.origins)
    //   } catch (error) {
    //     log.error('??????API??????????????????')
    //     console.error(error)
    //   }
    // }
    initRemoteDataSource() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                originType: scripts_1.OriginType.SwaggerV2,
                originUrl: '',
                swaggerHeader: this.config.swaggerHeaders,
                // ??????operationId???????????????
                usingOperationId: true,
                // pont ????????????????????????????????? Swagger ?????????????????????????????????????????????
                usingMultipleOrigins: false,
                // ????????????api-lock.json??????????????????
                spiltApiLock: false,
                outDir: './src/services',
                templatePath: './pontTemplate',
                taggedByName: true,
                // ???????????????????????? pont ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                templateType: '',
                // ??????????????????
                surrounding: config_1.Surrounding.typeScript,
                // ??????????????????
                scannedRange: [],
                // ?????????????????????????????????transformPath
                transformPath: '',
                // ?????????, ???????????????????????????????????? Swagger ?????????????????????????????????????????????????????????????????? Swagger ?????????????????????????????? node-fetch ??? fetch ??????
                fetchMethodPath: '',
                // ????????????????????? prettier ???????????????????????? prettier ???????????????????????????????????????
                prettierConfig: {},
                // pont?????????????????????????????????????????? 20 ??????
                pollingTime: 1200,
                mocks: {
                    enable: false,
                    basePath: '',
                    port: 8080,
                    wrapper: ''
                },
                fetchMethod: this.config.fetchSwaggerDataMethod
            };
            const reqs = this.config.origins.map(({ url, name, version }) => __awaiter(this, void 0, void 0, function* () {
                name = name ? (0, utils_1.camel2Kebab)(name) : '';
                if (this.config.rename)
                    name = (0, utils_1.rename)(name, this.config.rename);
                let originType;
                switch (version) {
                    case '3.0':
                        originType = scripts_1.OriginType.SwaggerV3;
                        break;
                    case '2.0':
                        originType = scripts_1.OriginType.SwaggerV2;
                        break;
                    case '1.0':
                        originType = scripts_1.OriginType.SwaggerV1;
                        break;
                    default:
                        originType = scripts_1.OriginType.SwaggerV2;
                }
                config.originUrl = url;
                config.originType = originType;
                const data = yield (0, scripts_1.readRemoteDataSource)(config, (text) => {
                    log_1.default.info(`${name}-${text}`);
                });
                data.mods.forEach(item => {
                    item.name = (0, utils_1.getName)(item.name);
                    item.interfaces.forEach(j => {
                        j.name = (0, utils_1.getName)(j.name);
                    });
                });
                this.StandardDataSourceList.push({ data, name });
            }));
            yield Promise.all(reqs);
            // const data = await readRemoteDataSource(config, (text: string) => {
            //   log.info(text)
            // })
            // fs.writeFileSync(path.join(__dirname, `../../mock/modelInfoList.json`), JSON.stringify(this.StandardDataSourceList))
        });
    }
    generateFileData() {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //   const dataList = fs.readFileSync(path.join(__dirname, '../../mock/modelInfoList.json')).toString()
            //   this.StandardDataSourceList = JSON.parse(dataList) as StandardDataSourceLister[]
            // } catch (error) {
            //   console.error(error)
            //   return
            // }
            const { StandardDataSourceList } = this;
            if (!Array.isArray(StandardDataSourceList) || StandardDataSourceList.length === 0)
                throw new Error('???????????????');
            const { render, outDir, hideMethod, prettierPath, baseClassName, baseClassPath, typeFileRender, methodConfig, resultTypeRender, moduleConfig = {} } = this.config;
            yield (0, utils_1.loadPrettierConfig)(prettierPath);
            const outputDir = (0, utils_1.resolveOutPath)(outDir);
            const targetPath = (0, utils_1.resolveOutPath)(baseClassPath);
            const tempClassPath = path_1.default.join(outputDir, 'module/baseClass.ts');
            (0, createApiFile_1.createBaseClassFile)({ tempClassPath, targetPath, importBaseCalssName: baseClassName });
            const filePathList = [];
            StandardDataSourceList.forEach((i) => __awaiter(this, void 0, void 0, function* () {
                const { data, name } = i;
                const { mods, baseClasses } = data;
                const config = name ? moduleConfig[name] || {} : {};
                const moduleName = config.moduleName || name;
                const modulePath = moduleName ? `/${moduleName}` : '';
                const dirPath = path_1.default.join(outputDir, `module${modulePath}`);
                const typeDirPaht = path_1.default.join(outputDir, `types${modulePath}`);
                const filePathItems = [];
                mods.forEach(({ interfaces, name: fileName, description }) => {
                    const filePath = path_1.default.join(dirPath, `${fileName}.ts`);
                    filePathItems.push({ filePath, fileName });
                    const diffClassPath = (0, utils_1.findDiffPath)(dirPath, tempClassPath).replace(/\.[t|j]s$/, '');
                    const params = {
                        name,
                        render,
                        config,
                        dirPath,
                        filePath,
                        fileName,
                        hideMethod,
                        interfaces,
                        description,
                        typeDirPaht,
                        diffClassPath,
                        methodConfig
                    };
                    const createApiFile = new createApiFile_1.CreateApiFile(params);
                    createApiFile.createFile();
                    const createTypeFile = new createTypeFile_1.default({
                        fileName,
                        interfaces,
                        baseClasses,
                        typeDirPaht,
                        typeFileRender,
                        resultTypeRender
                    });
                    createTypeFile.generateFile();
                    createTypeFile.createBaseClasses();
                });
                filePathList.push({ moduleName, data: filePathItems });
                // await Promise.all(pros)
            }));
            const indexFilePath = path_1.default.join(outDir, 'index.ts');
            (0, createApiFile_1.createIndexFilePath)({ outDir: outputDir, filePathList, indexFilePath });
        });
    }
    createFiles() {
        if (fileList_1.fileList.length === 0)
            return;
        const { outDir, baseClassPath } = this.config;
        const outDirPath = path_1.default.join((0, utils_1.resolveOutPath)(outDir), 'index');
        const targetPath = (0, utils_1.resolveOutPath)(baseClassPath);
        const typesDir = path_1.default.join(outDirPath, 'types');
        const modulesDir = path_1.default.join(outDirPath, 'module');
        // ?????????????????????
        if (fs_1.default.existsSync(typesDir))
            fs_1.default.rmdirSync(typesDir, { recursive: true });
        if (fs_1.default.existsSync(modulesDir))
            fs_1.default.rmdirSync(modulesDir, { recursive: true });
        const removeFiles = [
            `${outDirPath}.d.ts`,
            `${outDirPath}.ts`,
            `${outDirPath}.js`,
            `${targetPath}.js`,
            `${targetPath}.d.ts`
        ];
        removeFiles.forEach(filePath => {
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        });
        fileList_1.fileList.forEach(({ filePath, content }) => {
            (0, utils_1.createFile)(filePath, content);
        });
    }
    transform2js() {
        return __awaiter(this, void 0, void 0, function* () {
            const { outDir, languageType, declaration = true, emitTs = false } = this.config;
            const isJs = (0, utils_1.checkJsLang)(languageType);
            if (!isJs)
                return;
            try {
                const outDirPath = (0, utils_1.resolveOutPath)(outDir);
                const modeleDir = path_1.default.join(outDirPath, 'module');
                log_1.default.clear();
                log_1.default.info('???????????? ts ????????? js');
                const indexFilePath = path_1.default.join(outDirPath, 'index.ts');
                (0, utils_1.ts2Js)([indexFilePath], declaration);
                if (!emitTs) {
                    // ????????? ts ?????????????????????ts??????
                    const filesInfo = (0, utils_1.getTsFiles)(modeleDir);
                    filesInfo.push(indexFilePath);
                    filesInfo.map(filePath => fs_1.default.existsSync(filePath) && fs_1.default.unlinkSync(filePath));
                }
                if (!declaration) {
                    // ?????? types ?????? .d.ts ??????
                    fs_1.default.rmdirSync(path_1.default.join(outDirPath, 'types'), { recursive: true });
                }
                log_1.default.success('????????????');
            }
            catch (error) {
                log_1.default.error('????????????');
                return Promise.reject(error);
            }
        });
    }
}
exports.default = Doc2Ts;
//# sourceMappingURL=index.js.map