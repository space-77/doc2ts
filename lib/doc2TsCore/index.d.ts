import Api from '../utils/api';
import { Config } from '../common/config';
import { ModelList, StandardDataSourceLister } from '../types/type';
export default class Doc2Ts {
    api: Api;
    modelList: ModelList[];
    StandardDataSourceList: StandardDataSourceLister[];
    config: Config;
    constructor();
    init(): Promise<void>;
    getConfig(): Promise<void>;
    getModelList(): Promise<void>;
    initRemoteDataSource(): Promise<void>;
    generateFile(): Promise<void>;
    transform2js(): Promise<undefined>;
    remveTsFile(): void;
}
