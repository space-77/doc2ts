"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Log {
    info(text) {
        console.log(chalk_1.default.blue('[doc2ts] '), text);
    }
    errTag(text) {
        return chalk_1.default.bgHex('#ff0000')(text);
    }
    errColor(text) {
        return chalk_1.default.red(text);
    }
    error(text) {
        console.log(this.errColor('[doc2ts] '), text);
    }
    warning(text) {
        return chalk_1.default.yellow(text);
    }
    log(text) {
        console.log(text);
    }
    done(text) {
        return chalk_1.default.bgHex('#0DBC79')(text);
    }
    success(text) {
        console.log(chalk_1.default.hex('#0DBC79')('[doc2ts] '), text);
    }
    link(text) {
        return chalk_1.default.hex('#42a5f5').underline(text);
    }
    ok() {
        this.success(this.done(' DONE '));
    }
    clear() {
        const lines = process.stdout.getWindowSize()[1];
        for (let i = 0; i < lines; i++) {
            console.log('\r\n');
        }
        console.clear();
    }
}
exports.default = new Log();
