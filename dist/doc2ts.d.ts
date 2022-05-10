import Api from './api';
import { Doc2TsConfig, DocModelInfoList, ModelInfos, ModelList, ModuleConfig } from './type';
import TypesList from './typesList';
export default class Doc2Ts {
    configPath: string;
    api: Api;
    outDir: string;
    originUrl: string;
    dataKey?: string;
    modelList: ModelList[];
    baseModelInfoList: DocModelInfoList[];
    modelInfoList: TypesList[];
    rename?: Doc2TsConfig['rename'];
    baseClassName: string;
    baseClassPath: string;
    resultGenerics: string;
    hideMethod?: boolean;
    moduleConfig?: ModuleConfig;
    render: Doc2TsConfig['render'];
    typeFileRender: Doc2TsConfig['typeFileRender'];
    build(): Promise<void>;
    getConfig(): Promise<void>;
    createAxios(): void;
    getDocData(): Promise<undefined>;
    getModelList(count?: number): Promise<undefined>;
    getModelInfoList(name: string, modelPath: string): Promise<undefined>;
    /**
     * @description 整理数据结构
     */
    formatData(): void;
    createApiMethod(apiInfos: ModelInfos['apiInfos']): string;
    /**
     *
     * @description 创建 接口方法文件
     */
    createApiFile({ modelName, apiInfos, basePath, beforeName }: ModelInfos): Promise<undefined>;
    /**
     * @id 创建 接口方法类型文件
     */
    createApiTypeFile({ modelName, apiInfos, typesList }: ModelInfos): Promise<undefined>;
    /**
     * @description 创建入口文件
     */
    createIndexFile(): Promise<undefined>;
    /**
     * @description 创建 文件内容
     */
    createFileContent(): Promise<void>;
    /**
     * @param preDirPath
     * @description 获取文件夹路径
     */
    getDirPaht(preDirPath: string): string;
    /**
     *
     * @description 创建文件
     */
    createFile(dirPath: string, fileName: string, content: string): Promise<undefined>;
}
