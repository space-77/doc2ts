"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
class Api {
    constructor(baseURL) {
        if (!baseURL)
            throw new Error('接口地址不存在');
        if (!/^https?:\/\/.+/.test(baseURL))
            throw new Error('请配置正确的接口地址');
        Api.baseURL = /\/$/.test(baseURL) ? baseURL : `${baseURL}/`;
        this.fetch = /^http:\/\//.test(baseURL) ? http_1.default : https_1.default;
    }
    get(url) {
        url = url.replace(/^\//, '');
        return new Promise((resolve, reject) => {
            let rawData = '';
            this.fetch
                .get(`${Api.baseURL}${url}`, res => {
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
    getModelList() {
        return this.get('/swagger-resources');
    }
    getModelInfoList(modelPath) {
        return this.get(modelPath);
    }
}
exports.default = Api;
