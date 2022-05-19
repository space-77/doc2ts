import { ModelInfoList, ModelList } from '../type';
export default class Api {
    static httpsReg: RegExp;
    static baseURL: string;
    constructor();
    static get<T = any>(url: string): Promise<T>;
    getModelList(url?: string): Promise<ModelList[]> | Promise<ModelList>;
    getModelInfoList(modelPath: string): Promise<ModelInfoList>;
}
