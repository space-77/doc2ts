import { Property } from 'pont-engine';
import { FilePathList, GetParamsStr, Method, ModelInfo } from '../type';
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
}
/**
 *
 * @param tempClassPath
 * @param targetPath
 * @param importBaseCalssName '{xxx}' or 'xxx'
 */
export declare function createBaseClassFile(tempClassPath: string, targetPath: string, importBaseCalssName: string): void;
export declare function createIndexFilePath(outDir: string, filePathList: FilePathList[]): void;
