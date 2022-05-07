import { DeepTypes, Doc2TsConfig, GetTypeList, TypeList } from './type';
/**
 * @param str
 * @description 烤串转驼峰
 */
export declare function camel2Kebab(str: string): string;
/**
 * @param str
 * @description 首字母大写
 */
export declare function firstToUpper(str: string): string;
/**
 * @param str
 * @description 首字母小写
 */
export declare function firstToLower(str: string): string;
/**
 *
 * @param name
 * @param nameList
 * @description 就解决重名问题
 */
export declare function updateName(name: string, nameList: Set<string>): string;
/**
 *
 * @param str
 * @description 类型装换
 */
export declare function findType(str: string): "number" | "string" | "boolean" | "[]" | "object" | undefined;
/**
 * @description 根据JSON生成数据类型
 */
export declare const getTypeList: GetTypeList;
export declare function createDeepType(deepTypes: DeepTypes): string;
export declare function createType(typesList: TypeList): string;
/**
 * @param originPath 起始位置
 * @param targetPath 目标位置
 * @description 计算某个路径和另一个路径之间的差值
 */
export declare function findDiffPath(originPath: string, targetPath: string): string;
export declare function getConfig(configPath: string): Promise<any>;
export declare function rename(name: string, method: Doc2TsConfig['rename']): string;
