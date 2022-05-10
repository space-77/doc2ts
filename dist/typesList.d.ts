import type { DocModelInfoList, FormatParamsType, GetResponsesType, ModelInfos, ModuleConfig, TypeList } from './type';
export default class TypesList {
    modelName: string;
    modelItem: DocModelInfoList;
    resultGenerics: string;
    moduleConfig: ModuleConfig;
    modelInfo: ModelInfos;
    typesList: TypeList[];
    funcNames: Set<string>;
    funcTypeNameList: string[];
    emptyKey: string;
    dataKey: string | undefined;
    constructor(modelItem: DocModelInfoList, moduleConfig: ModuleConfig, resultGenerics: string, dataKey?: string);
    formarModelData(): void;
    /**
     * @description 整理 整理数据类型
     */
    formatTypeList: GetResponsesType;
    formatParamsType: FormatParamsType;
    advanceType(itemTypeInfo: TypeList): void;
    deleteType(typeName: string): number;
}
