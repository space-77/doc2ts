"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.PrettierConfig = exports.PARAMS_NAME = void 0;
var PARAMS_NAME;
(function (PARAMS_NAME) {
    PARAMS_NAME["BODY"] = "body";
    PARAMS_NAME["QUERY"] = "query";
    PARAMS_NAME["HEADER"] = "header";
    PARAMS_NAME["FORMDATA"] = "formData";
})(PARAMS_NAME = exports.PARAMS_NAME || (exports.PARAMS_NAME = {}));
class PrettierConfig {
}
exports.PrettierConfig = PrettierConfig;
class Config {
    constructor(config) {
        this.outDir = './services'; // 文件输出地址
        this.baseClassName = 'ApiClient';
        this.resultGenerics = 'T';
        this.hideMethod = false;
        Object.entries(config).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '' || Number.isNaN(value)) {
                // 如果用户传参的不符合规范则需要删除它，使用默认值
                delete config[key];
            }
        });
        Object.assign(this, Object.assign({}, config));
        if (!this.baseClassPath || !this.originUrl)
            throw new Error('必要参数异常');
    }
}
exports.Config = Config;
