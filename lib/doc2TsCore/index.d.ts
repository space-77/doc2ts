import Api from '../utils/api';
import { Config } from '../common/config';
import { StandardDataSourceLister } from '../types/type';
export default class Doc2Ts {
    api: Api;
    StandardDataSourceList: StandardDataSourceLister[];
    config: Config;
    constructor();
    init(): Promise<void>;
    getConfig(): Promise<void>;
    initRemoteDataSource(): Promise<void>;
    generateFileData(): Promise<void>;
    createFiles(): void;
    transform2js(): Promise<undefined>;
}
