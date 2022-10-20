import { Doc2TsConfig } from '../types/type';
import { BaseClass, Interface, Property, StandardDataType } from '../pont-engine';
declare type TypeFileInfo = {
    fileName: string;
    modelName?: string;
    interfaces: Interface[];
    baseClasses: BaseClass[];
    typeDirPaht: string;
    typeFileRender?: Doc2TsConfig['typeFileRender'];
    resultTypeRender?: Doc2TsConfig['resultTypeRender'];
    generateTypeRender?: Doc2TsConfig['generateTypeRender'];
};
declare type TypeList = {
    id?: string;
    response: StandardDataType;
    parameters: Property[];
    resTypeName: string;
    paramTypeName: string;
}[];
export default class CreateTypeFile {
    content: string;
    exportValue: string;
    typeList: TypeList;
    importType: Set<string>;
    fileInfo: TypeFileInfo;
    constructor(params: TypeFileInfo);
    generateFile(): void;
    private generateImportType;
    private generateApiClassType;
    private getReturnType;
    private generateTypes;
    /**
     * @param typeName
     * @description 判断是不是ts的基本类型，如果如果不是的 则是改为any类型【处理不规范的类型】
     */
    getDefType(typeName: string): string;
    private generateResTypeValue;
    private generateParamType;
    private createTypeItems;
    private createTypeContent;
    getDescription(des?: string, example?: string): string;
    createBaseClasses(): void;
}
export {};
