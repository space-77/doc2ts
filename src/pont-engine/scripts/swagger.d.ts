import { StandardDataSource, Interface, Mod, StandardDataType } from '../standard';
import { OriginBaseReader } from './base';
declare enum SwaggerType {
    integer = "integer",
    string = "string",
    file = "string",
    array = "array",
    number = "number",
    boolean = "boolean",
    object = "object"
}
declare class SwaggerProperty {
    type: SwaggerType;
    enum?: string[];
    items?: {
        type?: SwaggerType;
        $ref?: string;
    };
    additionalProperties: SwaggerProperty;
    $ref?: string;
    description?: string;
    name: string;
}
declare class SwaggerParameter {
    name: string;
    in: 'query' | 'body' | 'path';
    description: string;
    required: boolean;
    type: SwaggerType;
    enum: string[];
    items?: {
        type?: SwaggerType;
        $ref?: string;
    };
    schema: Schema;
}
declare class Schema {
    enum?: string[];
    type: SwaggerType;
    additionalProperties?: Schema;
    items: {
        type?: SwaggerType;
        $ref?: string;
    };
    $ref: string;
    static parseSwaggerSchema2StandardDataType(schema: Schema, defNames: string[], classTemplateArgs?: StandardDataType[], compileTemplateKeyword?: string): any;
}
export declare function parseSwaggerEnumType(enumStrs: string[]): (string | number)[];
declare class SwaggerInterface {
    consumes: string[];
    parameters: SwaggerParameter[];
    summary: string;
    description: string;
    initialValue: string;
    tags: string[];
    response: Schema;
    method: string;
    name: string;
    path: string;
    samePath: string;
    operationId: string;
    static transformSwaggerV3Interface2Standard(inter: SwaggerInterface, usingOperationId: boolean, samePath: string, defNames?: string[]): Interface;
    static transformSwaggerInterface2Standard(inter: SwaggerInterface, usingOperationId: boolean, samePath: string, defNames?: string[], compileTempateKeyword?: string): Interface;
}
interface SwaggerReferenceObject {
    $ref: string;
}
interface SwaggerPathItemObject {
    get?: SwaggerInterface;
    post?: SwaggerInterface;
    put?: SwaggerInterface;
    patch?: SwaggerInterface;
    delete?: SwaggerInterface;
    parameters?: SwaggerParameter[] | SwaggerReferenceObject[];
}
export declare class SwaggerDataSource {
    paths: {
        [key in string]: SwaggerPathItemObject;
    };
    tags: {
        name: string;
        description: string;
    }[];
    definitions: {
        [key in string]: {
            description: string;
            required?: string[];
            properties: {
                [key in string]: SwaggerProperty;
            };
        };
    };
}
export declare class SwaggerV3DataSource {
    paths: {
        [key in string]: SwaggerPathItemObject;
    };
    tags: {
        name: string;
        description: string;
    }[];
    components: {
        schemas: {
            [key in string]: {
                description: string;
                required?: string[];
                properties: {
                    [key in string]: SwaggerProperty;
                };
            };
        };
    };
}
export declare function parseSwaggerV3Mods(swagger: SwaggerV3DataSource, defNames: string[], usingOperationId: boolean): Mod[];
export declare function parseSwaggerMods(swagger: SwaggerDataSource, defNames: string[], usingOperationId: boolean, compileTempateKeyword?: string): Mod[];
export declare function transformSwaggerData2Standard(swagger: SwaggerDataSource, usingOperationId?: boolean, originName?: string): StandardDataSource;
export declare function transformSwaggerV3Data2Standard(swagger: SwaggerV3DataSource, usingOperationId?: boolean, originName?: string): StandardDataSource;
export declare class SwaggerV2Reader extends OriginBaseReader {
    transform2Standard(data: any, usingOperationId: boolean, originName: string): StandardDataSource;
}
export declare class SwaggerV3Reader extends OriginBaseReader {
    transform2Standard(data: any, usingOperationId: boolean, originName: string): StandardDataSource;
}
export {};
