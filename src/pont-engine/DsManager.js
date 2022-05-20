"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const LocalDictManager_1 = require("./LocalDictManager");
const utils_1 = require("./utils");
class Record {
    constructor(filename) {
        this.filename = filename;
        this.saveTime = new Date();
    }
}
exports.Record = Record;
class Project {
    constructor(projectName, originUrl, records = [], projectPath) {
        this.projectName = projectName;
        this.originUrl = originUrl;
        this.records = records;
        this.projectPath = projectPath;
    }
}
class ProjectsManifest {
    constructor(projects) {
        this.projects = projects;
    }
}
class LocalDsManager {
    constructor() {
        this.PROJECTS_MANIFEST_FILE = 'projects_manifest.json';
    }
    static getSingleInstance() {
        if (!LocalDsManager.singleInstance) {
            LocalDsManager.singleInstance = new LocalDsManager();
        }
        return LocalDsManager.singleInstance;
    }
    getLatestDsInProject(project) {
        const manifest = this.getProjectsManifest();
        const foundProj = manifest.projects.find(proj => proj.originUrl === project.originUrl && proj.projectName === project.projectName);
        if (foundProj && foundProj.records.length) {
            const record = foundProj.records[foundProj.records.length - 1];
            const recordPath = foundProj.projectPath + '/' + record.filename;
            return LocalDictManager_1.PontDictManager.loadJsonFileIfExistsSync(recordPath);
        }
        return null;
    }
    getProjectsManifest() {
        const content = LocalDictManager_1.PontDictManager.loadJsonFileIfExistsSync(this.PROJECTS_MANIFEST_FILE);
        if (!content) {
            const manifest = new ProjectsManifest([]);
            LocalDictManager_1.PontDictManager.saveFileSync(this.PROJECTS_MANIFEST_FILE, JSON.stringify(manifest, null, 2));
            return manifest;
        }
        return content;
    }
    isProjectExists(project) {
        const projectsInfo = this.getProjectsManifest();
        return projectsInfo.projects.find(proj => {
            return proj.originUrl === project.originUrl && proj.projectName === project.projectName;
        });
    }
    appendRecord(project, record) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = 'record_' + project.records.length;
            const manifest = this.getProjectsManifest();
            const proj = manifest.projects.find(proj => proj.projectPath === project.projectPath);
            proj.records.push(new Record(filename));
            yield LocalDictManager_1.PontDictManager.saveFile(`${project.projectPath}/${filename}`, record);
            yield this.saveManifest(manifest);
        });
    }
    saveManifest(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            return LocalDictManager_1.PontDictManager.saveFile(this.PROJECTS_MANIFEST_FILE, JSON.stringify(manifest, null, 2));
        });
    }
    createProject(project) {
        return __awaiter(this, void 0, void 0, function* () {
            const manifest = this.getProjectsManifest();
            const projectPath = 'project_' + manifest.projects.length;
            const proj = new Project(project.projectName, project.originUrl, [], projectPath);
            manifest.projects.push(proj);
            yield this.saveManifest(manifest);
            return proj;
        });
    }
    saveDataSource(project, ds) {
        return __awaiter(this, void 0, void 0, function* () {
            let proj = this.isProjectExists(project);
            if (!proj) {
                proj = yield this.createProject(project);
            }
            yield this.appendRecord(proj, JSON.stringify(ds, null, 2));
        });
    }
    getReportData(project) {
        const manifest = this.getProjectsManifest();
        const proj = manifest.projects.find(p => p.originUrl === project.originUrl && p.projectName === project.projectName);
        if (!proj) {
            throw new Error('该项目暂无记录！');
            return;
        }
        const diffs = [];
        proj.records.forEach((record, recordIndex) => {
            if (recordIndex === 0) {
                return;
            }
            const lastRecord = proj.records[recordIndex - 1];
            const currRecord = record;
            const lastDs = LocalDictManager_1.PontDictManager.loadJsonFileIfExistsSync(`${project.projectPath}/${lastRecord.filename}`);
            const currDs = LocalDictManager_1.PontDictManager.loadJsonFileIfExistsSync(`${project.projectPath}/${currRecord.filename}`);
            const currDiff = utils_1.diffDses(lastDs, currDs);
            diffs.push({
                saveTime: currRecord.saveTime,
                boDiffs: currDiff.boDiffs,
                modDiffs: currDiff.modDiffs
            });
        });
        return {
            records: project.records,
            diffs
        };
    }
    openReport(project) {
        const { diffs, records } = this.getReportData(project);
        LocalDictManager_1.PontDictManager.saveFile('report.html', `
<html>
  <div>项目记录数：${records.length}</div>
  <div>历次变更详情：</div>
  报表UI 待优化：
  <pre>
  ${diffs.map(diff => {
            return `
      <pre>
      ${diff.saveTime}：
      ${diff.modDiffs.join('\n')}
      ${diff.boDiffs.join('\n')}
      </pre>
    `;
        })}
  </pre>
</html>
    `);
        const htmlPath = LocalDictManager_1.PontDictManager.getFilePath('report.html');
        child_process_1.execSync(`open ${htmlPath}`);
    }
}
LocalDsManager.singleInstance = null;
const DsManager = LocalDsManager.getSingleInstance();
exports.DsManager = DsManager;
//# sourceMappingURL=DsManager.js.map