/// <reference types="node" />
import { Doc2TsConfig } from '../types/type';
import { CODE } from './config';
export default class Manage {
    config: Doc2TsConfig;
    noVerify: boolean;
    includeFiles: string;
    docBranchname: string;
    originalBranchname: string;
    doc2tsConfigContent: Buffer;
    constructor();
    init(): Promise<void>;
    loadConfig(): Promise<CODE.NOT_GIT | undefined>;
    checkout2Base(): Promise<void>;
    checkout2Doc(): Promise<void>;
    getBranch(): Promise<void>;
    initBranchname(): Promise<void>;
    checkStatus(): Promise<string>;
    addFile(): Promise<string>;
    commitFile(): Promise<string>;
    mergeCode(): Promise<string>;
}
