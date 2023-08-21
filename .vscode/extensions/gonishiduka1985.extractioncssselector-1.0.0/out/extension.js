"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const searchSelector_1 = __importDefault(require("./searchSelector"));
const setCssSelectors_1 = __importDefault(require("./setCssSelectors"));
const execute = async (filterId) => {
    const { activeTextEditor, showInformationMessage } = vscode.window;
    if (!activeTextEditor) {
        return;
    }
    const config = vscode.workspace.getConfiguration();
    const insertString = config.get('extractioncssselector.insertString');
    const isIncludeId = config.get('extractioncssselector.isIncludeId');
    const excludeRegexArray = config.get('extractioncssselector.excludeRegex');
    const excludeRegex = excludeRegexArray[filterId] ?? '';
    const { document, selection } = activeTextEditor;
    const text = document.getText(selection.isEmpty ? undefined : selection);
    const classes = (0, searchSelector_1.default)({ text, isIncludeId, excludeRegex: excludeRegex });
    if (!classes.length) {
        showInformationMessage('classが見つかりませんでした');
        return;
    }
    const { clipboard } = vscode.env;
    await clipboard.writeText((0, setCssSelectors_1.default)({
        classes,
        insertString,
    }));
    showInformationMessage('cssセレクタをクリップボードにコピーしました');
    return;
};
function activate(context) {
    [...new Array(3)].forEach((_, index) => {
        const disposable = vscode.commands.registerCommand(`extractioncssselector.filter${index + 1}`, () => execute(index));
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
function deactivate() {
    //
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map