import Api from './api';
import { Config } from './config';
import { ModelList } from './type';
import { StandardDataSourceLister } from './pont_type';
export default class Doc2Ts {
    api: Api;
    modelList: ModelList[];
    StandardDataSourceList: StandardDataSourceLister[];
    config: Config;
    configPath: string;
    constructor();
    init(): Promise<void>;
    getConfig(): Promise<void>;
    getModelList(count?: number): Promise<undefined>;
    initRemoteDataSource(): Promise<void>;
    generateFile(): Promise<void>;
}
