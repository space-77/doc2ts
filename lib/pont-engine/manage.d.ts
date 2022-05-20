import { StandardDataSource } from './standard';
import { Config, DataSourceConfig } from './utils';
import { Model } from './diff';
import { FilesManager } from './generators/generate';
import { info as debugInfo } from './debugLog';
export declare class Manager {
    private projectRoot;
    readonly lockFilename = "api-lock.json";
    configDir: string;
    allLocalDataSources: StandardDataSource[];
    allConfigs: DataSourceConfig[];
    remoteDataSource: StandardDataSource;
    currConfig: DataSourceConfig;
    currLocalDataSource: StandardDataSource;
    fileManager: FilesManager;
    diffs: {
        modDiffs: Model[];
        boDiffs: Model[];
    };
    report: typeof debugInfo;
    setReport(report: typeof debugInfo): void;
    mapModel<T extends {}>(model: T): Model;
    selectDataSource(name: string): Promise<void>;
    makeAllSame(): void;
    makeSameMod(modName: string): void;
    makeSameBase(baseName: string): void;
    calDiffs(): void;
    constructor(projectRoot: string, config: Config, configDir?: string);
    pollingId: any;
    private polling;
    beginPolling(currConfig?: DataSourceConfig): void;
    stopPolling(): void;
    ready(): Promise<void>;
    existsLocal(): boolean;
    readLockFile(): Promise<Array<StandardDataSource>>;
    readLocalDataSource(): Promise<void>;
    checkDataSource(dataSource: StandardDataSource): void;
    initRemoteDataSource(config?: DataSourceConfig): Promise<void>;
    readRemoteDataSource(config?: DataSourceConfig): Promise<StandardDataSource>;
    lock(): Promise<void>;
    dispatch(files: {}): any;
    getGeneratedFiles(): any;
    update(oldFiles: {}): Promise<void>;
    regenerateFiles(): Promise<void>;
    setFilesManager(): void;
    getReportData(): {
        records: import("./DsManager").Record[];
        diffs: {
            saveTime: Date;
            boDiffs: Model[];
            modDiffs: Model[];
        }[];
    };
    getConfigByDataSourceName(name: string): DataSourceConfig;
    openReport(): void;
    getCodeSnippet(): any;
}
