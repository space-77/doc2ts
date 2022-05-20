declare class LocalDictManager {
    static singleInstance: LocalDictManager;
    static getSingleInstance(): LocalDictManager;
    private localDictDir;
    constructor();
    isFileExists(filename: string): boolean;
    removeFile(filename: string): Promise<void>;
    loadJsonFileIfExistsSync(filename: string): any;
    loadFileIfExistsSync(filename: string): string | false;
    loadFileIfExists(filename: string): Promise<string | false>;
    saveFile(filename: string, content: string): Promise<void>;
    saveFileSync(filename: string, content: string): void;
    appendFileSync(filename: string, content: string): Promise<void>;
    getFilePath(filename: string): string;
}
declare const PontDictManager: LocalDictManager;
export { PontDictManager };
