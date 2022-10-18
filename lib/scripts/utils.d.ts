/// <reference types="node" />
import { ExecException } from 'child_process';
export declare function decodeRes(str: string): string;
declare type ExecExceptions = [ExecException | null, string, string];
export declare function execSync(command: string): Promise<ExecExceptions>;
/**
 * @desc 获取 当前 git 版本
 */
export declare function getGitVersion(): Promise<ExecExceptions>;
export declare function getCommitId(): Promise<ExecExceptions>;
export declare function getBranchname(): Promise<ExecExceptions>;
export declare function createBranchname(branchname: string, commitId?: string): Promise<ExecExceptions>;
export declare function checkout(branchname: string): Promise<ExecExceptions>;
export declare function deleteBranch(branchname: string): Promise<ExecExceptions>;
export declare function checkGit(): Promise<ExecExceptions>;
export declare function gitStatus(dirPath: string): Promise<ExecExceptions>;
export declare function gitAdd(dirPath: string): Promise<ExecExceptions>;
export declare function getCommit(): Promise<ExecExceptions>;
export declare function gitCommit(message: string): Promise<ExecExceptions>;
export declare function gitMerge(branchname: string): Promise<ExecExceptions>;
export declare function getFirstCommitId(fileName: string): Promise<string | undefined>;
export {};
