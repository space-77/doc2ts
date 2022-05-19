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
const log_1 = __importDefault(require("../utils/log"));
const api_1 = __importDefault(require("../utils/api"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../common/config");
const createTypeFile_1 = __importDefault(require("../generators/createTypeFile"));
const utils_1 = require("pont-engine/lib/utils");
const scripts_1 = require("pont-engine/lib/scripts");
const createApiFile_1 = require("../generators/createApiFile");
const utils_2 = require("../utils");
class Doc2Ts {
    constructor() {
        this.api = new api_1.default();
        this.modelList = [];
        this.StandardDataSourceList = [];
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConfig();
                yield this.getModelList();
                yield this.initRemoteDataSource();
                this.generateFile();
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield (0, utils_2.getConfig)(config_1.CONFIG_PATH);
                this.config = new config_1.Config(config);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getModelList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.modelList = yield (0, utils_2.getModelUrl)(this.config.origins);
            }
            catch (error) {
                log_1.default.error('获取API接口数据失败');
                console.error(error);
            }
            // try {
            //   log.info('正在拉取 swagger 文档信息')
            //   let data: ModelList[] = []
            //   const { originUrl } = this.config
            //   if (Array.isArray(originUrl) && originUrl.length > 0) {
            //     // data = await this.api.getModelList()
            //   } else {
            //   }
            //   if (data.length === 0 && count <= 4) {
            //     await this.getModelList(count + 1)
            //     return
            //   }
            //   if (!data || !Array.isArray(data) || data.length === 0) {
            //     log.error('数据加载失败')
            //     throw new Error('数据加载异常')
            //   }
            //   log.ok()
            // } catch (error) {
            //   log.error('数据加载失败')
            //   return Promise.reject(error)
            // }
        });
    }
    initRemoteDataSource() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                originType: scripts_1.OriginType.SwaggerV2,
                originUrl: '',
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
                surrounding: utils_1.Surrounding.typeScript,
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
                }
            };
            try {
                const reqs = this.modelList.map(({ url, name, swaggerVersion }) => __awaiter(this, void 0, void 0, function* () {
                    name = name ? (0, utils_2.camel2Kebab)(name) : '';
                    if (this.config.rename)
                        name = (0, utils_2.rename)(name, this.config.rename);
                    let originType;
                    switch (swaggerVersion) {
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
                    this.StandardDataSourceList.push({ data, name });
                }));
                yield Promise.all(reqs);
                // const data = await readRemoteDataSource(config, (text: string) => {
                //   log.info(text)
                // })
                // fs.writeFileSync(path.join(__dirname, `../../dist/modelInfoList.json`), JSON.stringify(this.StandardDataSourceList))
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    generateFile() {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //   const dataList = fs.readFileSync(path.join(__dirname, '../../dist/modelInfoList.json')).toString()
            //   this.StandardDataSourceList = JSON.parse(dataList) as StandardDataSourceLister[]
            // } catch (error) {
            //   console.error(error)
            //   return
            // }
            const { render, outDir, hideMethod, prettierPath, baseClassName, baseClassPath, typeFileRender, resultTypeRender, moduleConfig = {} } = this.config;
            yield (0, utils_2.loadPrettierConfig)(prettierPath);
            const outputDir = (0, utils_2.resolveOutPath)(outDir);
            const targetPath = (0, utils_2.resolveOutPath)(baseClassPath);
            const tempClassPath = path_1.default.join(outputDir, 'module/baseClass.ts');
            (0, createApiFile_1.createBaseClassFile)(tempClassPath, targetPath, baseClassName);
            const filePathList = [];
            this.StandardDataSourceList.forEach(i => {
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
                    const diffClassPath = (0, utils_2.findDiffPath)(dirPath, tempClassPath).replace(/\.[t|j]s$/, '');
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
                        diffClassPath
                    };
                    new createApiFile_1.CreateApiFile(params);
                    const createTypeFile = new createTypeFile_1.default({
                        fileName,
                        interfaces,
                        baseClasses,
                        typeDirPaht,
                        typeFileRender,
                        resultTypeRender
                    });
                    createTypeFile.createBaseClasses();
                });
                filePathList.push({ moduleName, data: filePathItems });
            });
            (0, createApiFile_1.createIndexFilePath)(outputDir, filePathList);
        });
    }
}
exports.default = Doc2Ts;
