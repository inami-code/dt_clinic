"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
function activate(context) {
    const search = vscode.commands.registerCommand('masscode-assistant.search', async () => {
        try {
            const { data } = await axios_1.default.get('http://localhost:3033/snippets/embed-folder');
            const lastSelectedId = context.globalState.get('masscode:last-selected');
            const options = data
                .filter(i => !i.isDeleted)
                .sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)
                .reduce((acc, snippet) => {
                const fragments = snippet.content.map(fragment => {
                    const isLastSelected = lastSelectedId === snippet.id;
                    return {
                        label: snippet.name || 'Untitled snippet',
                        detail: snippet.content.length > 1 ? fragment.label : '',
                        description: `${fragment.language} • ${snippet.folder?.name || 'Inbox'}`,
                        picked: isLastSelected // use picked props to determine as last selected
                    };
                });
                acc.push(...fragments);
                return acc;
            }, []);
            const isExist = options.find(i => i.picked);
            if (isExist) {
                options.sort(i => i.picked ? -1 : 1);
                options.unshift({
                    label: 'Last selected',
                    kind: -1
                });
            }
            let snippet;
            let fragmentContent = '';
            const picked = await vscode.window.showQuickPick(options, {
                placeHolder: 'Type to search...',
                onDidSelectItem(item) {
                    snippet = data.find(i => i.name === item.label);
                    if (snippet) {
                        if (snippet.content.length === 1) {
                            fragmentContent = snippet.content[0].value;
                        }
                        else {
                            fragmentContent = snippet.content
                                .find(i => i.label === item.detail)?.value || '';
                        }
                    }
                    else {
                        fragmentContent = '';
                    }
                }
            });
            if (!picked)
                return;
            if (fragmentContent.length) {
                vscode.env.clipboard.writeText(fragmentContent);
                vscode.commands.executeCommand('editor.action.clipboardPasteAction');
                context.globalState.update('masscode:last-selected', snippet?.id);
            }
        }
        catch (err) {
            vscode.window.showErrorMessage('massCode app is not running.');
        }
    });
    const create = vscode.commands.registerCommand('masscode-assistant.create', async () => {
        vscode.commands.executeCommand('editor.action.clipboardCopyAction');
        const preferences = vscode.workspace.getConfiguration('masscode-assistant');
        const isNotify = preferences.get('notify');
        const content = await vscode.env.clipboard.readText();
        content.trim();
        if (content.length <= 1)
            return;
        const name = await vscode.window.showInputBox();
        const body = {};
        body.name = name;
        body.content = [
            {
                label: 'Fragment 1',
                value: content,
                language: 'plain_text'
            }
        ];
        try {
            await axios_1.default.post('http://localhost:3033/snippets/create', body);
            if (isNotify) {
                vscode.window.showInformationMessage('Snippet successfully created');
            }
        }
        catch (err) {
            vscode.window.showErrorMessage('massCode app is not running.');
        }
    });
    context.subscriptions.push(search);
    context.subscriptions.push(create);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map