import type prettier from 'prettier';
import { DisableParams, Doc2TsConfig } from '../types/type';
export declare const CONFIG_PATH = "doc2ts-config.ts";
export declare enum Surrounding {
    typeScript = "typeScript",
    javaScript = "javaScript"
}
export declare enum PARAMS_NAME {
    BODY = "body",
    QUERY = "query",
    HEADER = "headers",
    FORMDATA = "formData"
}
export declare class PrettierConfig {
    static config: prettier.Options;
}
export declare class Config {
    readonly outDir: string;
    readonly clearOutDir: boolean;
    readonly disableParams: DisableParams[];
    readonly origins: Doc2TsConfig['origins'];
    readonly swaggerHeaders?: Doc2TsConfig['swaggerHeaders'];
    readonly fetchSwaggerDataMethod?: Doc2TsConfig['fetchSwaggerDataMethod'];
    readonly baseClassName: string;
    readonly rename?: Doc2TsConfig['rename'];
    readonly emitTs?: boolean;
    readonly declaration?: boolean;
    readonly prettierPath?: string;
    readonly baseClassPath: string;
    readonly languageType?: Doc2TsConfig['languageType'];
    readonly hideMethod: boolean;
    readonly methodConfig?: Doc2TsConfig['methodConfig'];
    readonly render: Doc2TsConfig['render'];
    readonly typeFileRender: Doc2TsConfig['typeFileRender'];
    readonly generateTypeRender?: Doc2TsConfig['generateTypeRender'];
    readonly resultTypeRender: Doc2TsConfig['resultTypeRender'];
    constructor(config: Doc2TsConfig);
}
export declare const keyWordsListSet: Set<string>;
export declare const keyWords: Set<string>;
export declare const tsObjType: Set<string>;
export declare const tempNameList: string[];
