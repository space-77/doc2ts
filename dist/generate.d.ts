import { Interface, Property } from 'pont-engine';
import { GetParamsStr, ModelInfo } from './pont_type';
import { ModuleConfigInfo } from './type';
/**
 * @description 创建请求接口文件
 */
export declare function createApiFile(modelInfo: ModelInfo): Promise<undefined>;
/**
 * @description 整理参数
 */
export declare function getParamsStr(parameters: Property[]): GetParamsStr;
export declare function formatUrl(url: string, paramsInfo: GetParamsStr): string;
/**
 * @description 生成请求接口class 里的请求方法
 */
export declare function generateApiClassMethodStr(interfaces: Interface[], config: ModuleConfigInfo, hideMethod: boolean): string;
/**
 *
 * @param tempClassPath
 * @param targetPath
 * @param importBaseCalssName '{xxx}' or 'xxx'
 */
export declare function createBaseClassFile(tempClassPath: string, targetPath: string, importBaseCalssName: string): void;
