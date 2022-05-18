"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
class Api {
    constructor() {
        // if (!Array.isArray(originUrl) || originUrl.length === 0) throw new Error('接口地址不存在')
        // const uiUrl = originUrl.filter
        // if (!/^https?:\/\/.+/.test(baseURL)) throw new Error('请配置正确的接口地址')
        // Api.baseURL = /\/$/.test(baseURL) ? baseURL : `${baseURL}/`
        // this.fetch = /^http:\/\//.test(baseURL) ? http : https
    }
    static get(url) {
        if (!Api.urlReg)
            throw new Error(`${url} 请求路径不合法`);
        const fetch = Api.httpsReg.test(url) ? https_1.default : http_1.default;
        return new Promise((resolve, reject) => {
            let rawData = '';
            fetch
                .get(url, res => {
                if (res.statusCode == 200) {
                    res.on('data', chunk => {
                        //接收流数据
                        rawData += chunk;
                    });
                    res.on('end', () => {
                        //数据接收完毕
                        try {
                            resolve(JSON.parse(rawData));
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                }
            })
                .on('error', err => {
                reject(err);
            });
        });
    }
    getModelList(url) {
        if (url) {
            return Api.get(url);
        }
        else {
            const url = `${Api.baseURL}/swagger-resources`;
            return Api.get(url);
        }
    }
    getModelInfoList(modelPath) {
        return Api.get(modelPath);
    }
}
exports.default = Api;
// static fetch: typeof https | typeof http
Api.urlReg = /^https?:\/\//;
Api.httpsReg = /^https:\/\//;
