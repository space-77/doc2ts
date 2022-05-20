import { StandardDataSource, Interface, Mod, BaseClass } from '../standard';
import { Surrounding } from '../utils';
import { info } from '../debugLog';
export declare class FileStructures {
    generators: CodeGenerator[];
    usingMultipleOrigins: boolean;
    private surrounding;
    private baseDir;
    private templateType;
    spiltApiLock: boolean;
    constructor(generators: CodeGenerator[], usingMultipleOrigins: boolean, surrounding: Surrounding, baseDir: string, templateType: string, spiltApiLock: boolean);
    getMultipleOriginsFileStructures(): {
        'api.d.ts': any;
    } | {
        'api-lock.json': string;
        'api.d.ts': any;
    };
    getBaseClassesInDeclaration(originCode: string, usingMultipleOrigins: boolean): string;
    getModsDeclaration(originCode: string, usingMultipleOrigins: boolean): string;
    getOriginFileStructures(generator: CodeGenerator, usingMultipleOrigins?: boolean): {
        [x: string]: any;
        mods: {};
        'api.d.ts': any;
    };
    getFileStructures(): {
        'api.d.ts': any;
    };
    private checkHasTemplateFetch;
    getMultipleOriginsDataSourceName(): string[];
    judgeHasMultipleFilesName(): boolean;
    getDataSourcesTs(): string;
    getDataSourcesDeclarationTs(): string;
    getLockContent(generate?: CodeGenerator): string;
    getApiUseCases: (inter: Interface) => string[];
}
export declare class CodeGenerator {
    surrounding: Surrounding;
    outDir: string;
    usingMultipleOrigins: boolean;
    dataSource: StandardDataSource;
    hasContextBund: boolean;
    readonly lockFilename: string;
    constructor(surrounding?: Surrounding, outDir?: string, lockFilename?: string);
    setDataSource(dataSource: StandardDataSource): void;
    getBaseClassInDeclaration(base: BaseClass): string;
    getBaseClassesInDeclaration(): string;
    getBaseClassesInDeclarationWithMultipleOrigins(): string;
    getBaseClassesInDeclarationWithSingleOrigin(): string;
    getInterfaceContentInDeclaration(inter: Interface): string;
    private getInterfaceInDeclaration;
    getModsDeclaration(): string;
    getModsDeclarationWithMultipleOrigins(): void;
    getModsDeclarationWithSingleOrigin(): void;
    getCommonDeclaration(): string;
    getDeclaration(): string;
    getIndex(): string;
    getBaseClassesIndex(): string;
    getInterfaceContent(inter: Interface): string;
    getModIndex(mod: Mod): string;
    getModsIndex(): string;
    getDataSourceCallback(dataSource?: StandardDataSource): void;
    codeSnippet(inter: Interface): string;
}
export declare class FilesManager {
    fileStructures: FileStructures;
    private baseDir;
    report: typeof info;
    prettierConfig: {};
    constructor(fileStructures: FileStructures, baseDir: string);
    private initPath;
    regenerate(files: {}, oldFiles?: {}): Promise<void>;
    saveLock(originName?: string): Promise<void>;
    diffFiles(newFiles: {}, lastFiles: {}, dir?: string): {
        deletes: string[];
        files: {};
        updateCnt: number;
    };
    formatFile(code: string, name?: string): any;
    updateFiles(files: {}): Promise<void>;
    generateFiles(files: {}, dir?: string): Promise<void>;
}
