"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const debugLog = require("./debugLog");
function readDirRecursively(dirPath, callback) {
    fs.readdirSync(dirPath).forEach((subPath) => {
        const currentPath = dirPath + '/' + subPath;
        const stat = fs.lstatSync(currentPath);
        if (stat.isDirectory()) {
            readDirRecursively(currentPath, callback);
        }
        else {
            callback(currentPath);
        }
    });
}
function main(manager) {
    debugLog.info('service scanning...');
    const rootPath = process.cwd();
    const { currConfig, allLocalDataSources, fileManager: { fileStructures: { getApiUseCases } } } = manager;
    const allRequests = new Set(allLocalDataSources
        .map((ds) => ds.mods)
        .reduce((acc, cur) => [...acc, ...cur], [])
        .map((mod) => mod.interfaces)
        .reduce((acc, cur) => [...acc, ...cur], []));
    const unusedRequests = new Set(allRequests);
    const outputFileName = './unusedRequests.json';
    currConfig.scannedRange.forEach((dir) => {
        readDirRecursively(dir, (currentPath) => {
            const fileContent = fs.readFileSync(currentPath).toString();
            unusedRequests.forEach((inter) => {
                const useCases = getApiUseCases(inter);
                if (useCases.some((useCase) => fileContent.includes(useCase))) {
                    unusedRequests.delete(inter);
                }
            });
        });
    });
    fs.writeFileSync(outputFileName, JSON.stringify([...unusedRequests].map(({ method, path, description }) => ({ method, path, description })), null, 2));
    debugLog.info(`unused case percentage: ${unusedRequests.size} / ${allRequests.size}`);
    debugLog.success(`done!\nunused file is outputted to ${path.resolve(rootPath, outputFileName)}`);
}
exports.main = main;
//# sourceMappingURL=scan.js.map