"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.templateRegistion = [
    {
        templateType: 'fetch',
        templateFileName: 'fetch.ts'
    },
    {
        templateType: 'hooks',
        templateFileName: 'hooks.ts'
    }
];
function getTemplateByTemplateType(templateType = 'fetch') {
    const templateObj = exports.templateRegistion.find(template => templateType === template.templateType);
    if (templateObj) {
        return utils_1.getTemplatesDirFile(templateObj.templateFileName);
    }
    return '';
}
exports.getTemplateByTemplateType = getTemplateByTemplateType;
//# sourceMappingURL=templates.js.map