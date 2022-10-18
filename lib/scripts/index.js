"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.Manage = exports.Doc2Ts = void 0;
const doc2TsCore_1 = __importDefault(require("../doc2TsCore"));
const initConfig_1 = __importDefault(require("./initConfig"));
const manage_1 = __importDefault(require("./manage"));
exports.Doc2Ts = doc2TsCore_1.default;
exports.Manage = manage_1.default;
exports.init = initConfig_1.default;
