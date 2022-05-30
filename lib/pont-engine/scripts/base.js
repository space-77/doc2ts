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
const translate_1 = require("../translate");
const _ = require("lodash");
const utils_1 = require("../utils");
const node_fetch_1 = require("node-fetch");
class OriginBaseReader {
    constructor(config, report) {
        this.config = config;
        this.report = report;
    }
    translateChinese(jsonString) {
        return __awaiter(this, void 0, void 0, function* () {
            let retString = jsonString;
            try {
                const matchItems = jsonString
                    .match(/"[a-z0-9\s-\/]*[\u4e00-\u9fa5]+[a-z0-9\s-\/«»()\u4e00-\u9fa5]*":/gi);
                if (!matchItems) {
                    return retString;
                }
                let chineseKeyCollect = matchItems.map((item) => item.replace(/["":]/g, ''));
                chineseKeyCollect = _.uniq(chineseKeyCollect.map((item) => (item.includes('«') ? item.split('«')[0] : item)));
                chineseKeyCollect.sort((pre, next) => next.length - pre.length);
                let result = yield Promise.all(chineseKeyCollect.map((text) => translate_1.Translator.translateAsync(text)));
                const toRegStr = (str) => str.replace(/(\W)/g, '\\$1');
                result.forEach((enKey, index) => {
                    const chineseKey = chineseKeyCollect[index];
                    if (enKey) {
                        retString = retString.replace(eval(`/${toRegStr(chineseKey)}/g`), enKey);
                    }
                });
                return retString;
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    transform2Standard(data, _usingOperationId, _originName) {
        return data;
    }
    fetchMethod(url) {
        if (this.config.fetchMethodPath) {
            const fetchMethod = utils_1.Config.getFetchMethodFromConfig(this.config);
            return fetchMethod(url);
        }
        return node_fetch_1.default(url, { headers: this.config.swaggerHeader }).then((res) => res.text());
    }
    fetchData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.report('获取远程数据中...');
            let swaggerJsonStr = yield this.fetchMethod(this.config.originUrl);
            swaggerJsonStr = yield this.translateChinese(swaggerJsonStr);
            this.report('自动翻译中文基类完成！');
            try {
                const data = yield JSON.parse(swaggerJsonStr);
                this.report('远程数据获取成功！');
                return data;
            }
            catch (error) {
                this.report(`远程数据获取失败${swaggerJsonStr}`);
                throw error;
            }
        });
    }
    fetchRemoteData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.fetchData();
                let remoteDataSource = this.transform2Standard(data, this.config.usingOperationId, this.config.name);
                this.report('远程数据解析完毕!');
                if (this.config.transformPath) {
                    this.report('获取用户自定义数据转换方法中...');
                    const transformProgram = utils_1.Config.getTransformFromConfig(this.config);
                    remoteDataSource = transformProgram(remoteDataSource);
                    this.report('用户自定义数据转换方法执行完毕');
                }
                this.checkDataSource(remoteDataSource);
                this.report('解析后数据校验完毕！');
                this.report('远程对象创建完毕！');
                return remoteDataSource;
            }
            catch (e) {
                throw new Error('读取远程接口数据失败！' + e.toString());
            }
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
}
exports.OriginBaseReader = OriginBaseReader;
//# sourceMappingURL=base.js.map