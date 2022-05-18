import Api from '../utils/api';
import { Config } from '../common/config';
import { ModelList, StandardDataSourceLister } from '../type';
export default class Doc2Ts {
    api: Api;
    modelList: ModelList[];
    StandardDataSourceList: StandardDataSourceLister[];
    config: Config;
    configPath: string;
    constructor();
    init(): Promise<void>;
    getConfig(): Promise<void>;
    getModelList(): Promise<void>;
    initRemoteDataSource(): Promise<void>;
    generateFile(): Promise<void>;
}
