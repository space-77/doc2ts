import { StandardDataType } from './standard';
interface AstNode {
    name: string;
    templateArgs: AstNode[];
}
export declare function parseAst2StandardDataType(ast: AstNode, defNames: string[], classTemplateArgs?: StandardDataType[]): StandardDataType;
export declare function compileTemplate(template: string, keyword?: string): AstNode;
export {};
