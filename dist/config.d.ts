import prettier from 'prettier';
import { Doc2TsConfig, ModuleConfig } from './type';
export declare enum PARAMS_NAME {
    BODY = "body",
    QUERY = "query",
    HEADER = "header",
    FORMDATA = "formData"
}
export declare class PrettierConfig {
    static config: prettier.Options;
}
export declare class Config {
    readonly outDir: string;
    readonly originUrl: string;
    readonly baseClassName: string;
    readonly rename?: Doc2TsConfig['rename'];
    readonly moduleConfig?: ModuleConfig;
    readonly prettierPath?: string;
    readonly baseClassPath: string;
    readonly resultGenerics = "T";
    readonly hideMethod: boolean;
    readonly render: Doc2TsConfig['render'];
    readonly typeFileRender: Doc2TsConfig['typeFileRender'];
    constructor(config: Doc2TsConfig);
}
