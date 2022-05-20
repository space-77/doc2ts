export declare class Translate {
    private dictName;
    private engines;
    dict: {};
    constructor(dictName?: string);
    appendToDict(pairKey: {
        cn: string;
        en: string;
    }): void;
    startCaseClassName(result: any): string;
    translateAsync(text: string, engineIndex?: number): any;
}
export declare const Translator: Translate;
