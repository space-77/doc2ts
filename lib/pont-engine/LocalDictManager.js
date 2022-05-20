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
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
class LocalDictManager {
    constructor() {
        this.localDictDir = os.homedir() + '/.pont';
        if (!fs.pathExistsSync(this.localDictDir)) {
            fs.mkdirpSync(this.localDictDir);
        }
    }
    static getSingleInstance() {
        if (!LocalDictManager.singleInstance) {
            LocalDictManager.singleInstance = new LocalDictManager();
            return LocalDictManager.singleInstance;
        }
        return LocalDictManager.singleInstance;
    }
    isFileExists(filename) {
        const filePath = path.join(this.localDictDir, filename);
        return fs.existsSync(filePath);
    }
    removeFile(filename) {
        const filePath = path.join(this.localDictDir, filename);
        if (fs.existsSync(filePath)) {
            return fs.remove(filePath);
        }
    }
    loadJsonFileIfExistsSync(filename) {
        const fileContent = this.loadFileIfExistsSync(filename);
        if (fileContent) {
            return JSON.parse(fileContent);
        }
        return false;
    }
    loadFileIfExistsSync(filename) {
        const filePath = path.join(this.localDictDir, filename);
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, {
                encoding: 'utf8'
            });
            return fileContent;
        }
        return false;
    }
    loadFileIfExists(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.join(this.localDictDir, filename);
            if (fs.existsSync(filePath)) {
                const fileContent = yield fs.readFile(filePath, {
                    encoding: 'utf8'
                });
                return fileContent;
            }
            return false;
        });
    }
    saveFile(filename, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.join(this.localDictDir, filename);
            const dirname = path.dirname(filePath);
            if (!fs.pathExistsSync(dirname)) {
                fs.mkdirpSync(dirname);
            }
            return fs.writeFileSync(filePath, content);
        });
    }
    saveFileSync(filename, content) {
        const filePath = path.join(this.localDictDir, filename);
        const dirname = path.dirname(filePath);
        if (!fs.pathExistsSync(dirname)) {
            fs.mkdirpSync(dirname);
        }
        return fs.writeFileSync(filePath, content);
    }
    appendFileSync(filename, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.join(this.localDictDir, filename);
            if (fs.existsSync(filePath)) {
                return fs.appendFile(filePath, content);
            }
        });
    }
    getFilePath(filename) {
        return path.join(this.localDictDir, filename);
    }
}
LocalDictManager.singleInstance = null;
const PontDictManager = LocalDictManager.getSingleInstance();
exports.PontDictManager = PontDictManager;
//# sourceMappingURL=LocalDictManager.js.map