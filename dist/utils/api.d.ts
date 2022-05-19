import { ModelList } from '../type';
export default class Api {
    static baseURL: string;
    static httpsReg: RegExp;
    static get<T = any>(url: string): Promise<T>;
    getModelList(url?: string): Promise<ModelList[]> | Promise<ModelList>;
}
