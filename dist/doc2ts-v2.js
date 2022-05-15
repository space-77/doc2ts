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
const log_1 = __importDefault(require("./log"));
const api_1 = __importDefault(require("./api"));
const config_1 = require("./config");
const generateType_1 = __importDefault(require("./generateType"));
const utils_1 = require("pont-engine/lib/utils");
const scripts_1 = require("pont-engine/lib/scripts");
const generate_1 = require("./generate");
const utils_2 = require("./utils");
class Doc2Ts {
    constructor() {
        this.modelList = [];
        this.StandardDataSourceList = [];
        this.configPath = './doc2ts.config.ts';
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getConfig();
                this.api = new api_1.default(this.config.originUrl);
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
                const config = yield (0, utils_2.getConfig)(this.configPath);
                this.config = new config_1.Config(config);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getModelList(count = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                log_1.default.info('正在拉取 swagger 文档信息');
                const { data } = yield this.api.getModelList();
                if (data.length === 0 && count <= 4) {
                    yield this.getModelList(count + 1);
                    return;
                }
                if (!data || !Array.isArray(data) || data.length === 0) {
                    log_1.default.error('数据加载失败');
                    throw new Error('数据加载异常');
                }
                this.modelList = data;
                log_1.default.ok();
            }
            catch (error) {
                log_1.default.error('数据加载失败');
                return Promise.reject(error);
            }
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
                    name = (0, utils_2.camel2Kebab)(name);
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
                    config.originType = originType;
                    config.originUrl = `${this.config.originUrl}${url}`;
                    const data = yield (0, scripts_1.readRemoteDataSource)(config, (text) => {
                        log_1.default.info(`${name}-${text}`);
                    });
                    this.StandardDataSourceList.push({ data, name });
                }));
                yield Promise.all(reqs);
                // const data = await readRemoteDataSource(config, (text: string) => {
                //   log.info(text)
                // })
                // fs.writeFileSync(path.join(__dirname, `../dist/modelInfoList2.json`), JSON.stringify(data))
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    generateFile() {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //   const dataList = fs.readFileSync(path.join(__dirname, '../dist/modelInfoList.json')).toString()
            //   this.StandardDataSourceList = JSON.parse(dataList) as StandardDataSourceLister[]
            // } catch (error) {
            //   console.error(error)
            //   return
            // }
            const { render, outDir, hideMethod, prettierPath, baseClassName, baseClassPath, typeFileRender, moduleConfig = {}, resultGenerics } = this.config;
            yield (0, utils_2.loadPrettierConfig)(prettierPath);
            const targetPath = (0, utils_2.resolveOutPath)(baseClassPath);
            const tempClassPath = (0, utils_2.resolveOutPath)(outDir, 'module/baseClass.ts');
            (0, generate_1.createBaseClassFile)(tempClassPath, targetPath, baseClassName);
            this.StandardDataSourceList.forEach(i => {
                const { data, name } = i;
                const { mods, baseClasses } = data;
                const config = moduleConfig[name] || {};
                const moduleName = config.moduleName || name;
                const filePath = (0, utils_2.resolveOutPath)(outDir, `module/${moduleName}`);
                const typeFilePaht = (0, utils_2.resolveOutPath)(outDir, `types/${moduleName}`);
                // hideMethod
                mods.forEach(({ interfaces, name: fileName }) => {
                    const params = Object.assign(Object.assign({}, i), { render,
                        config,
                        filePath,
                        fileName,
                        hideMethod,
                        interfaces,
                        typeFilePaht });
                    (0, generate_1.createApiFile)(params);
                    const createTypeFile = new generateType_1.default({
                        interfaces,
                        fileName,
                        typeFilePaht,
                        resultGenerics,
                        typeFileRender
                    });
                    createTypeFile.createBaseClasses(baseClasses);
                });
            });
        });
    }
}
exports.default = Doc2Ts;
