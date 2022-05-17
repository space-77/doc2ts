/// <reference types="node" />
import http from 'http';
import https from 'https';
import { ModelInfoList, ModelList } from '../type';
export default class Api {
    fetch: typeof https | typeof http;
    static baseURL: string;
    constructor(baseURL: string);
    get<T = any>(url: string): Promise<T>;
    getModelList(): Promise<ModelList[]>;
    getModelInfoList(modelPath: string): Promise<ModelInfoList>;
}
