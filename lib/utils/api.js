"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const index_1 = require("./index");
class Api {
    static get(url) {
        if ((0, index_1.judgeIsVaildUrl)(url))
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
}
exports.default = Api;
Api.httpsReg = /^https:\/\//;
//# sourceMappingURL=api.js.map