import { PARAMS_NAME } from './common/config';
import { Interface, Property, StandardDataSource } from 'pont-engine/lib/standard';
export interface IApiClient {
    /**
     * @param config
     * @description 接口请求方法
     */
    request<T = any>(config: IRequestParams): Promise<T>;
    /**
     *
     * @description 下载文件
     */
    downloadFile(config: IRequestParams): Promise<any>;
}
export declare type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK';
export declare type TData = Record<string, any>;
export interface IRequestParams {
    url: string;
    body?: TData;
    config?: object;
    method?: Method;
    header?: TData;
    formData?: FormData;
}
export interface ModelList {
    url: string;
    name?: string;
    location?: string;
    swaggerVersion?: '3.0' | '2.0' | '1.0';
}
export declare type MethodConfig = {
    /**
     * @description 修改方法名称
     */
    name?: string;
    /**
     * @description 修改描述
     */
    description?: string;
    /**
     * @description 该接口是否是下载文件接口
     */
    isDownload?: boolean;
    /**
     * @description 接口的自定义配置，会传递到调用对应基类的方法里
     */
    config?: object;
};
export declare type ModuleConfigInfo = {
    /**
     * @description 模块重命名， 优先级高于 config.rename
     */
    moduleName?: string;
    methodConfig?: {
        [key: string]: MethodConfig;
    };
};
export declare type ModuleConfig = {
    /**
     * @description 每个模块自己的配置
     */
    [key: string]: ModuleConfigInfo;
};
export declare type Doc2TsConfig = {
    /**
     * @description swagger 文档请求地址 eg: http://localhost:7001
     */
    origins: (ModelList & {
        isSwaggerBootstrapUi?: boolean;
    })[];
    /**
     * @description 文件输出位置
     */
    outDir: string;
    /**
     * @default ApiClient
     * @description 每个模块继承的基类名称， 注意：基类必须 实现 IApiClient 接口
     */
    baseClassName: string;
    /**
     * @description 生成的文件类型
     */
    languageType?: 'typeScript' | 'javaScript';
    /**
     * @description 基类路径
     */
    baseClassPath: string;
    /**
     * @deprecated prettier 格式化代码的配置位置，默认会读取项目上的 .prettierrc.js  prettier.config.js prettier.config.cjs .prettierrc .prettierrc.json .prettierrc.json5 以及 package.json 里的  prettier配置， 没有则使用默认配置
     */
    prettierPath?: string;
    /**
     * @description 接口返回数据类型钩子
     */
    resultTypeRender?(typeName: string, typeInfo: Property[]): string;
    /**
     * @description 模块改名
     * @description 传入 正则类型或字符串类型则对模块名称进行 `name.replace` 操作
     */
    rename?: RegExp | string | ((modelName: string) => string);
    /**
     * @description 隐藏请求方法，达到简化代码
     */
    hideMethod?: boolean;
    /**
     * @param content 即将生成文件的内容
     * @param modelName 文件对应的模块名称
     * @param config  配置文件
     * @description 生成接口文件前的钩子，用于修改生成的内容
     */
    render?(content: string, modelName: string, config: ModuleConfig['']): string;
    /**
     * @param content 即将生成文件的内容
     * @param modelName 文件对应的模块名称
     * @description 生成接口类型文件前的钩子，用于修改生产内容
     */
    typeFileRender?(content: string, modelName: string): string;
    moduleConfig?: ModuleConfig;
};
export declare type Doc2TsConfigKey = keyof Doc2TsConfig;
export declare type StandardDataSourceLister = {
    name?: string;
    data: StandardDataSource;
};
export declare type ModelInfo = {
    name?: string;
    config: ModuleConfigInfo;
    dirPath: string;
    filePath: string;
    fileName: string;
    hideMethod: boolean;
    interfaces: Interface[];
    typeDirPaht: string;
    description: string;
    diffClassPath: string;
    render: Doc2TsConfig['render'];
};
export declare type GetParamsStr = {
    methodBody: string;
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
export declare type FilePathList = {
    moduleName?: string;
    data: {
        fileName: string;
        filePath: string;
    }[];
};
