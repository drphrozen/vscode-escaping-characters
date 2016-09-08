'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Escaper, MODE} from './escaper'

interface ICommand {
    id: string,
    mode: MODE
}

let commands : ICommand[] = [
    {id: 'extension.escapeHex', mode: MODE.EscapeHex},
    {id: 'extension.escapeOctal', mode: MODE.EscapeOctal},
    {id: 'extension.escapeUnicode', mode: MODE.EscapeUnicode},
    {id: 'extension.escapeUnicodeES6', mode: MODE.EscapeUnicodeES6},
    {id: 'extension.unescapeAll', mode: MODE.UnescapeAll},
    {id: 'extension.unescapeHex', mode: MODE.UnescapeHex},
    {id: 'extension.unescapeOctal', mode: MODE.UnescapeOctal},
    {id: 'extension.unescapeUnicode', mode: MODE.UnescapeUnicode}
];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "escaping-characters" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let escaper = new Escaper();
    context.subscriptions.push(escaper);
    
    commands.forEach(command => {
        let textEditorCommand = vscode.commands.registerTextEditorCommand(command.id, (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
            escaper.process(editor, command.mode);
        });
        context.subscriptions.push(textEditorCommand);
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}