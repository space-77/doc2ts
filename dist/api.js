"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Api {
    constructor(baseURL) {
        if (!baseURL)
            throw new Error('接口地址不存在');
        Api.axios = axios_1.default.create({ baseURL });
    }
    getModelList() {
        return Api.axios.get('/swagger-resources');
    }
    getModelInfoList(modelPath) {
        return Api.axios.get(modelPath);
    }
}
exports.default = Api;
