import { Doc2TsConfig } from './type';
import { BaseClass, Interface, Property, StandardDataType } from 'pont-engine';
declare type CreateTypeFileParams = {
    fileName: string;
    interfaces: Interface[];
    typeFilePaht: string;
    resultGenerics: string;
    typeFileRender?: Doc2TsConfig['typeFileRender'];
};
declare type TypeList = {
    resTpeName: string;
    response: StandardDataType;
    paramTypeName: string;
    parameters: Property[];
}[];
export default class CreateTypeFile {
    content: string;
    fileName: string;
    interfaces: Interface[];
    typeFilePaht: string;
    resultGenerics: string;
    typeList: TypeList;
    importType: Set<string>;
    constructor(params: CreateTypeFileParams);
    private generateFile;
    private generateApiClassType;
    private generateTypes;
    private generateResTypeValue;
    private generateParamType;
    private generateParamTypeValue;
    private generateImportType;
    getDescription(des?: string): string;
    createBaseClasses(baseClasses: BaseClass[]): void;
}
export {};
