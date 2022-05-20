import { DataSourceConfig } from '../utils';
import { StandardDataSource } from '../standard';
export declare class OriginBaseReader {
    protected config: DataSourceConfig;
    protected report: any;
    constructor(config: DataSourceConfig, report: any);
    translateChinese(jsonString: string): Promise<string>;
    transform2Standard(data: any, _usingOperationId: boolean, _originName: string): any;
    fetchMethod(url: string): Promise<string>;
    fetchData(): Promise<any>;
    fetchRemoteData(): Promise<StandardDataSource>;
    protected checkDataSource(dataSource: StandardDataSource): void;
}
