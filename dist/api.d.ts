import { AxiosInstance } from 'axios';
import { ModelInfoList, ModelList } from './type';
export default class Api {
    static axios: AxiosInstance;
    constructor(baseURL: string);
    getModelList(): Promise<import("axios").AxiosResponse<ModelList[], any>>;
    getModelInfoList(modelPath: string): Promise<import("axios").AxiosResponse<ModelInfoList, any>>;
}
