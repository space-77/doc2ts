"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standard_1 = require("./standard");
const primitiveTypeMap_1 = require("./primitiveTypeMap");
class Token {
    constructor(type, value = '') {
        this.type = type;
        this.value = value;
    }
}
class Parser {
    constructor(nodes) {
        this.nodes = nodes;
    }
    eat(type) {
        if (this.nodes.length && this.nodes[0].type === type) {
            const node = this.nodes[0];
            this.nodes = this.nodes.slice(1);
            return node;
        }
        else {
            console.error('current nodes', this.nodes);
            throw Error('the first node type is not ' + type + " in template parser's eat method");
        }
    }
    check(type) {
        if (this.nodes.length && this.nodes[0].type === type) {
            return true;
        }
        return false;
    }
    parserTemplateArgs() {
        const args = [];
        args[0] = this.parseTemplate();
        while (this.check('Comma')) {
            this.eat('Comma');
            args.push(this.parseTemplate());
        }
        return args;
    }
    parseTemplate() {
        const name = this.eat('Identifier').value;
        let templateArgs = [];
        if (this.check('PreTemplate')) {
            this.eat('PreTemplate');
            templateArgs = this.parserTemplateArgs();
            this.eat('EndTemplate');
        }
        return {
            type: 'Template',
            name,
            templateArgs
        };
    }
}
function parseAst2StandardDataType(ast, defNames, classTemplateArgs = []) {
    const { name, templateArgs } = ast;
    let typeName = primitiveTypeMap_1.PrimitiveTypeMap[name] || name;
    const isDefsType = defNames.includes(name);
    const typeArgs = templateArgs.map(arg => {
        return parseAst2StandardDataType(arg, defNames, classTemplateArgs);
    });
    const dataType = new standard_1.StandardDataType(typeArgs, typeName, isDefsType);
    dataType.setTemplateIndex(classTemplateArgs);
    return dataType;
}
exports.parseAst2StandardDataType = parseAst2StandardDataType;
function compileTemplate(template, keyword = '#/definitions/') {
    if (template.startsWith(keyword)) {
        template = template.slice(keyword.length);
    }
    if (!template) {
        return null;
    }
    const Identifier = /^[a-zA-Z_][a-zA-Z_0-9-]*/;
    const PreTemplate = /^«/;
    const EndTemplate = /^»/;
    const Comma = /^,/;
    let code = template;
    let matchedText = '';
    let nodes = [];
    while (code) {
        code = code.replace(/\s/g, '');
        code = code.replace(/\./g, '_');
        if (code.match(Identifier)) {
            matchedText = code.match(Identifier)[0];
            nodes.push(new Token('Identifier', matchedText));
        }
        else if (code.match(PreTemplate)) {
            matchedText = code.match(PreTemplate)[0];
            nodes.push(new Token('PreTemplate', matchedText));
        }
        else if (code.match(EndTemplate)) {
            matchedText = code.match(EndTemplate)[0];
            nodes.push(new Token('EndTemplate', matchedText));
        }
        else if (code.match(Comma)) {
            matchedText = code.match(Comma)[0];
            nodes.push(new Token('Comma', matchedText));
        }
        else {
            return null;
        }
        code = code.slice(matchedText.length);
    }
    return new Parser(nodes).parseTemplate();
}
exports.compileTemplate = compileTemplate;
//# sourceMappingURL=compiler.js.map