import { StandardDataSource } from './standard';
export declare class Record {
    filename: string;
    saveTime: Date;
    constructor(filename: string);
}
declare class Project {
    projectName: string;
    originUrl: string;
    records: Record[];
    projectPath: string;
    constructor(projectName: string, originUrl: string, records: Record[], projectPath: string);
}
declare class ProjectsManifest {
    projects: Project[];
    constructor(projects: Project[]);
}
declare class LocalDsManager {
    private readonly PROJECTS_MANIFEST_FILE;
    static singleInstance: LocalDsManager;
    static getSingleInstance(): LocalDsManager;
    getLatestDsInProject(project: Project): StandardDataSource;
    getProjectsManifest(): ProjectsManifest;
    isProjectExists(project: Project): Project;
    appendRecord(project: Project, record: string): Promise<void>;
    saveManifest(manifest: ProjectsManifest): Promise<void>;
    createProject(project: Project): Promise<Project>;
    saveDataSource(project: Project, ds: StandardDataSource): Promise<void>;
    getReportData(project: Project): {
        records: Record[];
        diffs: {
            saveTime: Date;
            boDiffs: import("./diff").Model[];
            modDiffs: import("./diff").Model[];
        }[];
    };
    openReport(project: Project): void;
}
declare const DsManager: LocalDsManager;
export { DsManager };
