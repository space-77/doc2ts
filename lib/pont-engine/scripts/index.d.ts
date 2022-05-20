import { DataSourceConfig } from '../utils';
export declare enum OriginType {
    SwaggerV3 = "SwaggerV3",
    SwaggerV2 = "SwaggerV2",
    SwaggerV1 = "SwaggerV1"
}
export declare function readRemoteDataSource(config: DataSourceConfig, report: any): Promise<import("..").StandardDataSource>;
