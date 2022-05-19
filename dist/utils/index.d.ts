import { Doc2TsConfig, ModelList } from '../type';
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
 * @param originPath 起始位置
 * @param targetPath 目标位置
 * @description 计算某个路径和另一个路径之间的差值
 */
export declare function findDiffPath(originPath: string, targetPath: string): string;
export declare function loadPrettierConfig(prettierPath?: string): Promise<void>;
export declare function getConfig(configPath: string): Promise<Doc2TsConfig>;
export declare function rename(name: string, method: Doc2TsConfig['rename']): string;
/**
 * @param preDirPath
 * @description 获取文件夹路径
 */
export declare function resolveOutPath(...paths: string[]): string;
/**
 * @description 创建文件
 */
export declare function createFile(filePath: string, content: string): Promise<undefined>;
/**
 * @description 格式化代码
 */
export declare function format(fileContent: string, prettierOpts?: {}): string;
export declare function getModelUrl(origins: Doc2TsConfig['origins']): Promise<ModelList[]>;
/** 检测是否是合法url */
export declare function judgeIsVaildUrl(url: string): boolean;
