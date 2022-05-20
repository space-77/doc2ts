import { ResolveConfigOptions } from 'prettier';
import { Mod, StandardDataSource, StandardDataType } from './standard';
import { Manager } from './manage';
import { OriginType } from './scripts';
export declare class Mocks {
    enable: boolean;
    port: number;
    basePath: string;
    wrapper: string;
}
export declare enum Surrounding {
    typeScript = "typeScript",
    javaScript = "javaScript"
}
export declare enum SurroundingFileName {
    javaScript = "js",
    typeScript = "ts"
}
export declare class DataSourceConfig {
    originUrl?: string;
    originType: OriginType;
    name?: string;
    usingOperationId: boolean;
    usingMultipleOrigins: boolean;
    spiltApiLock: boolean;
    taggedByName: boolean;
    templatePath: string;
    templateType: string;
    surrounding: Surrounding;
    outDir: string;
    scannedRange: any[];
    transformPath: string;
    fetchMethodPath: string;
    prettierConfig: ResolveConfigOptions;
    pollingTime: number;
    mocks: Mocks;
    constructor(config: DataSourceConfig);
}
export declare class Config extends DataSourceConfig {
    origins: Array<{
        originType: OriginType;
        originUrl: string;
        name: string;
        usingOperationId: boolean;
        transformPath?: string;
        fetchMethodPath?: string;
        outDir?: string;
    }>;
    constructor(config: Config);
    static getTransformFromConfig(config: Config | DataSourceConfig): any;
    static getFetchMethodFromConfig(config: Config | DataSourceConfig): any;
    validate(): "" | "请配置 originUrl 来指定远程地址。";
    static createFromConfigPath(configPath: string): Config;
    getDataSourcesConfig(configDir: string): DataSourceConfig[];
}
export declare function format(fileContent: string, prettierOpts?: {}): any;
export declare function getDuplicateById<T>(arr: T[], idKey?: string): null | T;
export declare function transformModsName(mods: Mod[]): void;
export declare function transformCamelCase(name: string): string;
export declare function transformDescription(description: string): string;
export declare function toUpperFirstLetter(text: string): string;
export declare function getMaxSamePath(paths: string[], samePath?: string): any;
export declare function getIdentifierFromUrl(url: string, requestType: string, samePath?: string): string;
export declare function getIdentifierFromOperatorId(operationId: string): string;
export declare function getTemplate(templatePath: any, templateType: any, defaultValue?: string): any;
export declare function getTemplatesDirFile(fileName: any, filePath?: string): string;
export declare function judgeTemplatesDirFileExists(fileName: any, filePath?: string): boolean;
export declare function lookForFiles(dir: string, fileName: string): Promise<string>;
export declare function toDashCase(name: string): string;
export declare function toDashDefaultCase(name: string): string;
export declare function hasChinese(str: string): RegExpMatchArray;
export declare const CONFIG_FILE = "pont-config.json";
export declare function createManager(configFile?: string): Promise<Manager>;
export declare function diffDses(ds1: StandardDataSource, ds2: StandardDataSource): {
    modDiffs: import("./diff").Model[];
    boDiffs: import("./diff").Model[];
};
export declare function reviseModName(modName: string): string;
export declare function getFileName(fileName: string, surrounding: string): string;
export declare function judgeIsVaildUrl(url: string): boolean;
export declare function getDefsTypeBos(dataTypes: Array<StandardDataType>): Array<string>;
export declare function getRelatedBos(mod: Mod): Set<string>;
