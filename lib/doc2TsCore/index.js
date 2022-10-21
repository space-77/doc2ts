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
    }
    // constructor() {
    //   this.init()
    // }
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
    //     log.error('获取API接口数据失败')
    //     console.error(error)
    //   }
    // }
    initRemoteDataSource() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                originType: scripts_1.OriginType.SwaggerV2,
                originUrl: '',
                swaggerHeader: this.config.swaggerHeaders,
                // 使用operationId作为方法名
                usingOperationId: true,
                // pont 支持一个项目中配置多个 Swagger 来源。此处配置是否启用多数据源
                usingMultipleOrigins: false,
                // 是否拆分api-lock.json到具体数据源
                spiltApiLock: false,
                outDir: './src/services',
                templatePath: './pontTemplate',
                taggedByName: true,
                // 可选项。用于生成 pont 内置模板。配置该项时，一旦检测到本地模板文件不存在将自动使用配置的模板类型生成模板文件。内置模板功能强大
                templateType: '',
                // 生成文件类型
                surrounding: config_1.Surrounding.typeScript,
                // 废弃接口扫描
                scannedRange: [],
                // 数据源之后会尝试调用由transformPath
                transformPath: '',
                // 可选项, 相对项目根目录路径。用于 Swagger 数据源需要登录才能请求成功的场景，可指定获取 Swagger 源数据的方法。默认为 node-fetch 的 fetch 方法
                fetchMethodPath: '',
                // 生成的代码会用 prettier 来美化。此处配置 prettier 的配置项即可，具体可以参考
                prettierConfig: {},
                // pont定时拉取数据，单位为秒，默认 20 分钟
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
            // 关闭全局配置参数的入参
            const disableParams = this.config.disableParams.map(({ type, name }) => `${type}__${name}`);
            const paramsSet = new Set(disableParams);
            this.StandardDataSourceList.forEach(({ data }) => {
                data.mods.forEach(({ interfaces }) => {
                    interfaces.forEach(item => {
                        item.parameters = item.parameters.filter(({ name, in: _in }) => !paramsSet.has(`${_in}__${name}`));
                    });
                });
            });
            const { StandardDataSourceList } = this;
            if (!Array.isArray(StandardDataSourceList) || StandardDataSourceList.length === 0)
                throw new Error('没有数据源');
            const { render, outDir, hideMethod, prettierPath, baseClassName, baseClassPath, typeFileRender, generateTypeRender, methodConfig, resultTypeRender
            // moduleConfig = {}
             } = this.config;
            yield (0, utils_1.loadPrettierConfig)(prettierPath);
            const outputDir = (0, utils_1.resolveOutPath)(outDir);
            const targetPath = (0, utils_1.resolveOutPath)(baseClassPath);
            const tempClassPath = path_1.default.join(outputDir, 'module/baseClass.ts');
            (0, createApiFile_1.createBaseClassFile)({ tempClassPath, targetPath, importBaseCalssName: baseClassName });
            const filePathList = [];
            StandardDataSourceList.forEach((i) => __awaiter(this, void 0, void 0, function* () {
                const { data, name: moduleName } = i;
                const { mods, baseClasses } = data;
                const modulePath = moduleName ? `/${moduleName}` : '';
                const dirPath = path_1.default.join(outputDir, `module${modulePath}`);
                const typeDirPaht = path_1.default.join(outputDir, `types${modulePath}`);
                const filePathItems = [];
                const fileTypeList = [];
                mods.forEach(({ interfaces, name: fileName, description }, index) => {
                    const filePath = path_1.default.join(dirPath, `${fileName}.ts`);
                    filePathItems.push({ filePath, fileName });
                    const diffClassPath = (0, utils_1.findDiffPath)(dirPath, tempClassPath).replace(/\.[t|j]s$/, '');
                    const params = {
                        render,
                        dirPath,
                        filePath,
                        fileName,
                        moduleName,
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
                        resultTypeRender,
                        generateTypeRender
                    });
                    if (index === 0)
                        createTypeFile.createBaseClasses();
                    createTypeFile.generateFile();
                });
                filePathList.push({ moduleName, data: filePathItems });
            }));
            const indexFilePath = path_1.default.join(outDir, 'index.ts');
            (0, createApiFile_1.createIndexFilePath)({ outDir: outputDir, filePathList, indexFilePath });
        });
    }
    createFiles() {
        if (fileList_1.fileList.length === 0)
            return;
        const { outDir, clearOutDir } = this.config;
        if (clearOutDir) {
            // const isJs = checkJsLang(languageType)
            const outDirPath = path_1.default.join((0, utils_1.resolveOutPath)(outDir), 'index');
            // const targetPath = resolveOutPath(baseClassPath)
            const typesDir = path_1.default.join(outDirPath, 'types');
            const modulesDir = path_1.default.join(outDirPath, 'module');
            // 删除清空文件夹
            if (fs_1.default.existsSync(typesDir))
                fs_1.default.rmdirSync(typesDir, { recursive: true });
            if (fs_1.default.existsSync(modulesDir))
                fs_1.default.rmdirSync(modulesDir, { recursive: true });
            const removeFiles = [
                `${outDirPath}.d.ts`,
                `${outDirPath}.ts`,
                `${outDirPath}.js`
                // isJs && `${targetPath}.js`,
                // isJs && `${targetPath}.d.ts`
            ];
            removeFiles.forEach(filePath => {
                if (fs_1.default.existsSync(filePath))
                    fs_1.default.unlinkSync(filePath);
            });
        }
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
                log_1.default.info('正在转换 ts 文件为 js');
                const indexFilePath = path_1.default.join(outDirPath, 'index.ts');
                const indexFileJsPath = indexFilePath.replace(/\.ts$/, '.js');
                (0, utils_1.ts2Js)([indexFilePath], declaration, (fileName, content) => {
                    content = content.replace(/(\/\*\*)/g, '\n$1');
                    content = content.replace(/(export\s+const)/g, '\n$1');
                    content = content.replace(/(export\s+declare)/g, '\n$1');
                    if (path_1.default.resolve(fileName) === indexFileJsPath)
                        content = content.replace(/(export)/, '\n$1');
                    return content;
                });
                if (!emitTs) {
                    // 不保留 ts 源文件，删除源ts文件
                    const filesInfo = (0, utils_1.getTsFiles)(modeleDir);
                    filesInfo.push(indexFilePath);
                    filesInfo.map(filePath => fs_1.default.existsSync(filePath) && fs_1.default.unlinkSync(filePath));
                }
                if (!declaration) {
                    // 删除 types 里的 .d.ts 文件
                    fs_1.default.rmdirSync(path_1.default.join(outDirPath, 'types'), { recursive: true });
                }
                log_1.default.success('转换成功');
            }
            catch (error) {
                log_1.default.error('转换失败');
                return Promise.reject(error);
            }
        });
    }
}
exports.default = Doc2Ts;
