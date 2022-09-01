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
const _ = require("lodash");
const { youdao, baidu, google } = require('translation.js');
const assert = require("assert");
const debugLog = require("./debugLog");
const LocalDictManager_1 = require("./LocalDictManager");
class Translate {
    constructor(dictName = 'dict.json') {
        this.dictName = dictName;
        this.engines = [google, youdao, baidu];
        this.dict = {};
        const localDict = LocalDictManager_1.PontDictManager.loadFileIfExistsSync(dictName);
        if (localDict) {
            const dictstr = localDict.slice(0, localDict.length - 2);
            try {
                this.dict = JSON.parse(`{${dictstr}}`);
            }
            catch (err) {
                debugLog.error('[translate] local dict is invalid, attempting auto fix');
                LocalDictManager_1.PontDictManager.removeFile(dictName);
            }
        }
    }
    appendToDict(pairKey) {
        if (!this.dict[pairKey.cn]) {
            this.dict[pairKey.cn] = pairKey.en;
            LocalDictManager_1.PontDictManager.appendFileSync(this.dictName, `"${pairKey.cn}": "${pairKey.en}",\n`);
        }
    }
    startCaseClassName(result) {
        let wordArray = _.startCase(result).split(' ');
        if (wordArray.length > 6) {
            wordArray = [].concat(wordArray.slice(0, 5), wordArray.slice(-1));
        }
        return wordArray.join('');
    }
    translateAsync(text, engineIndex = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dict[text]) {
                return this.dict[text];
            }
            if (engineIndex >= this.engines.length) {
                throw new Error('translate error, all translate engine can not access');
            }
            let enKey;
            let index = engineIndex;
            try {
                let res = yield this.engines[index].translate(text);
                enKey = this.startCaseClassName(res.result[0]);
                assert.ok(enKey);
                this.appendToDict({ cn: text, en: enKey });
                return enKey;
            }
            catch (err) {
                if (engineIndex >= this.engines.length - 1) debugLog.error(err);
                return this.translateAsync(text, index + 1);
            }
        });
    }
}
exports.Translate = Translate;
exports.Translator = new Translate();
//# sourceMappingURL=translate.js.map