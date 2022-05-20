import { Surrounding } from './utils';
export declare enum PrimitiveType {
    number = "number",
    string = "string",
    boolean = "boolean"
}
declare class Contextable {
    getDsName(): any;
    private context;
    getContext(): any;
    setContext(context: any): void;
    constructor(arg?: {});
    toJSON(): { [P in keyof this]: this[keyof this]; };
}
export declare class StandardDataType extends Contextable {
    typeArgs: StandardDataType[];
    typeName: string;
    isDefsType: boolean;
    templateIndex: number;
    compileTemplateKeyword: string;
    enum: Array<string | number>;
    setEnum(enums?: Array<string | number>): void;
    typeProperties: Property[];
    constructor(typeArgs?: StandardDataType[], typeName?: string, isDefsType?: boolean, templateIndex?: number, compileTemplateKeyword?: string);
    static constructorWithEnum(enums?: Array<string | number>): StandardDataType;
    static constructorFromJSON(dataType: StandardDataType, originName: string, defNames: string[]): StandardDataType;
    setTemplateIndex(classTemplateArgs: StandardDataType[]): void;
    getDefNameWithTemplate(): void;
    generateCodeWithTemplate(): void;
    getDefName(originName: any): string;
    getEnumType(): string;
    generateCode(originName?: string): any;
    getInitialValue(usingDef?: boolean): string;
    get initialValue(): string;
}
export declare class Property extends Contextable {
    dataType: StandardDataType;
    description?: string;
    name: string;
    required: boolean;
    in: 'query' | 'body' | 'path' | 'formData' | 'header';
    setContext(context: any): void;
    constructor(prop: Partial<Property>);
    toPropertyCode(surrounding?: Surrounding, hasRequired?: boolean, optional?: boolean): any;
    toPropertyCodeWithInitValue(baseName?: string): string;
    toBody(): any;
}
export declare class Interface extends Contextable {
    consumes: string[];
    parameters: Property[];
    description: string;
    response: StandardDataType;
    method: string;
    name: string;
    path: string;
    get responseType(): any;
    getParamsCode(className?: string, surrounding?: Surrounding): string;
    getParamList(): ({
        paramKey: string;
        paramType: any;
        optional?: undefined;
        initialValue?: undefined;
    } | {
        paramKey: string;
        optional: boolean;
        paramType: string;
        initialValue: string;
    })[];
    getRequestContent(): string;
    getRequestParams(surrounding?: Surrounding): string;
    getBodyParamsCode(): any;
    setContext(context: any): void;
    constructor(inter: Partial<Interface>);
}
export declare class Mod extends Contextable {
    description: string;
    interfaces: Interface[];
    name: string;
    setContext(context: any): void;
    constructor(mod: Partial<Mod>);
}
export declare class BaseClass extends Contextable {
    name: string;
    description: string;
    properties: Property[];
    templateArgs: StandardDataType[];
    setContext(context: any): void;
    constructor(base: Partial<BaseClass>);
}
export declare class StandardDataSource {
    name: string;
    baseClasses: BaseClass[];
    mods: Mod[];
    reOrder(): void;
    validate(): string[];
    serialize(): string;
    setContext(): void;
    constructor(standard: {
        mods: Mod[];
        name: string;
        baseClasses: BaseClass[];
    });
    static constructorFromLock(localDataObject: StandardDataSource, originName: any): StandardDataSource;
}
export {};
