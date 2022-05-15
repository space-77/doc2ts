import { PARAMS_NAME } from './config';
import { Doc2TsConfig, ModuleConfigInfo } from './type';
import { Interface, StandardDataSource } from 'pont-engine';
export declare type StandardDataSourceLister = {
    name: string;
    data: StandardDataSource;
};
export declare type ModelInfo = {
    data: StandardDataSource;
    name: string;
    config: ModuleConfigInfo;
    filePath: string;
    fileName: string;
    basePath?: string;
    hideMethod: boolean;
    interfaces: Interface[];
    typeFilePaht: string;
    render: Doc2TsConfig['render'];
};
export declare type GetParamsStr = {
    codeStr: string;
    onlyType: boolean;
    hasPath: boolean;
    hsaQuery: boolean;
    hsaBody: boolean;
    hasHeader: boolean;
    hasformData: boolean;
    bodyName: PARAMS_NAME.BODY;
    queryName: PARAMS_NAME.QUERY;
    headerName: PARAMS_NAME.HEADER;
    formDataName: PARAMS_NAME.FORMDATA;
    body: string;
    header: string;
    formData: string;
};
