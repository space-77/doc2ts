import { Doc2TsConfig, RenderVlaue } from '../types/type';
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
    typeList: TypeList;
    fileInfo: TypeFileInfo;
    tempMap: {
        tempName: string;
        value: string;
    }[];
    importType: Set<string>;
    typeItemList: {
        paramTypeName: string;
        typeItems: RenderVlaue[];
    }[];
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
    /**
     * @description 获取泛型的值
     */
    getGenericsValue(types: StandardDataType[]): string;
    private generateResTypeValue;
    private generateParamType;
    private createTypeItems;
    private createTypeContent;
    getDescription(des?: string, example?: string): string;
    createBaseClasses(): void;
}
export {};
