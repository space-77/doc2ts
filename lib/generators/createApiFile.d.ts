import type { Property } from '../pont-engine';
import type { Method } from '../types/client';
import type { FilePathList, GetParamsStr, ModelInfo } from '../types/type';
export declare class CreateApiFile {
    modelInfo: ModelInfo;
    fileContent: string;
    constructor(params: ModelInfo);
    formatFileData(): void;
    generateApiClassMethod(): string;
    /**
     * @description  把get请求的 body 类型的参数，改为 query 类型
     */
    fixParamsType(parameters: Property[], method: Method): void;
    formatUrl(url: string, paramsInfo: GetParamsStr): string;
    getParamsStr(parameters: Property[]): GetParamsStr;
    createFile(): void;
    getTempData(filePath: string): string;
    filterParams(parameters: Property[], type: Property['in']): string[];
    joinParams(keyList: string[]): string;
}
declare type BaseClassConfig = {
    tempClassPath: string;
    targetPath: string;
    importBaseCalssName: string;
};
export declare function createBaseClassFile(config: BaseClassConfig): void;
declare type IndexFileConfig = {
    outDir: string;
    filePathList: FilePathList[];
    indexFilePath: string;
};
export declare function createIndexFilePath(config: IndexFileConfig): Promise<void>;
export {};
