"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyWords = exports.keyWordsListSet = exports.Config = exports.PrettierConfig = exports.PARAMS_NAME = exports.Surrounding = exports.CONFIG_PATH = void 0;
exports.CONFIG_PATH = 'doc2ts-config.ts';
var Surrounding;
(function (Surrounding) {
    Surrounding["typeScript"] = "typeScript";
    Surrounding["javaScript"] = "javaScript";
})(Surrounding = exports.Surrounding || (exports.Surrounding = {}));
var PARAMS_NAME;
(function (PARAMS_NAME) {
    PARAMS_NAME["BODY"] = "body";
    PARAMS_NAME["QUERY"] = "query";
    PARAMS_NAME["HEADER"] = "header";
    PARAMS_NAME["FORMDATA"] = "formData";
})(PARAMS_NAME = exports.PARAMS_NAME || (exports.PARAMS_NAME = {}));
class PrettierConfig {
}
exports.PrettierConfig = PrettierConfig;
class Config {
    // baseClassPath
    constructor(config) {
        this.outDir = './services'; // 文件输出地址
        this.baseClassName = 'ApiClient';
        this.hideMethod = false;
        Object.entries(config).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '' || Number.isNaN(value)) {
                // 如果用户传参的不符合规范则需要删除它，使用默认值
                delete config[key];
            }
        });
        Object.assign(this, Object.assign({}, config));
        if (!this.baseClassPath || !Array.isArray(this.origins) || this.origins.length === 0)
            throw new Error('必要参数异常');
        this.baseClassPath = this.baseClassPath.replace(/.ts/, '');
    }
}
exports.Config = Config;
const keyWordsList = 'Array,Date,eval,function,hasOwnProperty,Infinity,isFinite,isNaN,isPrototypeOf,length,Math,NaN,Number,Object,prototype,String,toString,undefined,valueOf,abstract,arguments,boolean,break,byte,case,catch,char,class,const,continue,debugger,default,delete,do,double,else,enum,export,extends,false,final,finally,float,for,goto,if,implements,import,in,instanceof,int,interface,let,long,native,new,null,package,private,protected,public,return,short,static,super,switch,synchronized,this,throw,throws,transient,true,try,typeof,var,void,volatile,while,with,yield'.split(',');
// js  关键字组合可用于判断声明的变量是否包含关键字
exports.keyWordsListSet = new Set(keyWordsList);
keyWordsList.push(...Object.values(PARAMS_NAME));
// js  关键字组合 外加 请求方法里用上的几个变量名字 可用于判断声明的变量是否包含关键字
exports.keyWords = new Set(keyWordsList);
//# sourceMappingURL=config.js.map