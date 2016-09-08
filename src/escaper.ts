import * as vscode from 'vscode';

export enum MODE {
    EscapeUnicode,
    EscapeUnicodeES6,
    EscapeHex,
    EscapeOctal,
    UnescapeAll,
    UnescapeUnicode,
    UnescapeHex,
    UnescapeOctal,
}

const RX_EXTASCII = /([\u0080-\u00ff]+)/g;
const RX_NONASCII = /([^\u0000-\u007f]+)/g;
const RX_UNICODE = /(\\u([0-9A-Fa-f]{4}))/g;
const RX_UNICODE_ES6 = /(\\u\{([0-9A-Fa-f]{1,6})\})/g;
const RX_HEX = /(\\x([0-9A-Fa-f]{2}))/g;
const RX_OCTAL = /(\\([0-3][0-7]{2}))/g;

interface IProcessor {
    (text: string): string;
}

export class Escaper {

    private _statusBarItem: vscode.StatusBarItem;

    public process = (editor: vscode.TextEditor, mode: MODE) => {
        // Process entire document if user haven't selected a text block manually
        let selection = (() => {
            if (editor.selection.end.isAfter(editor.selection.start)) {
                return editor.selection;
            } else {
                let lastLine = editor.document.lineAt(editor.document.lineCount - 1);
                return new vscode.Selection(
                    new vscode.Position(0, 0),
                    new vscode.Position(
                        lastLine.lineNumber,
                        lastLine.text.length
                    )
                );
            }
        })();
        
        editor.edit((builder) => {
            builder.replace(selection, this.processText(mode, editor.document.getText(selection)));
        });
    }

    public processText(mode: MODE, text: string) : string {
        switch(mode) {
            case MODE.EscapeHex: return this.escapeHex(text);
            case MODE.EscapeOctal: return this.escapeOctal(text);
            case MODE.EscapeUnicode: return this.escapeUnicode(text);
            case MODE.EscapeUnicodeES6: return this.escapeUnicodeES6(text);
            case MODE.UnescapeAll: return this.unescapeAll(text);
            case MODE.UnescapeHex: return this.unescapeHex(text);
            case MODE.UnescapeOctal: return this.unescapeOctal(text);
            case MODE.UnescapeUnicode: return this.unescapeUnicode(text); 
        }
    }

    public unescapeAll(text: string) : string {
        text = this.unescapeHex(text);
        text = this.unescapeOctal(text);
        text = this.unescapeUnicode(text);
        return text;
    }

    public escapeUnicode(text: string): string {
        return text.replace(RX_NONASCII, (match: string) => {
            let replacement = [];
            for (var index = 0; index < match.length; index++) {
                replacement.push('\\u' + ('0000' + match.charCodeAt(index).toString(16).toUpperCase()).slice(-4));
            }
            return replacement.join('');
        });
    }

    public escapeUnicodeES6(text: string): string {
        return text.replace(RX_NONASCII, (match: string) => {
            let replacement = [];
            for(let ch of match) {
                replacement.push(`\\u{${ch.codePointAt(0).toString(16).toUpperCase()}}`);
            }
            return replacement.join('');
        });
    }

    public unescapeUnicode(text: string): string {
        return text.replace(RX_UNICODE, (match: string, sequence: string, code: string) => {
            return String.fromCharCode(parseInt(code, 16));
        }).replace(RX_UNICODE_ES6, (match: string, sequence: string, code: string) => {
            return String.fromCodePoint(parseInt(code, 16));
        });
    }

    public escapeHex(text: string): string {
        return text.replace(RX_EXTASCII, (match: string) => {
            let replacement = [];
            for (var index = 0; index < match.length; index++) {
                replacement.push('\\x' + ('00' + match.charCodeAt(index).toString(16).toUpperCase()).slice(-2));
            }
            return replacement.join('');
        });
    }

    public unescapeHex(text: string): string {
        return text.replace(RX_HEX, (match: string, sequence: string, code: string) => {
            return String.fromCharCode(parseInt(code, 16));
        });
    }

    public escapeOctal(text: string): string {
        return text.replace(RX_EXTASCII, (match: string) => {
            let replacement = [];
            for (var index = 0; index < match.length; index++) {
                replacement.push('\\' + ('000' + match.charCodeAt(index).toString(8).toUpperCase()).slice(-3));
            }
            return replacement.join('');
        });
    } 

    public unescapeOctal(text: string): string {
        return text.replace(RX_OCTAL, (match: string, sequence: string, code: string) => {
            return String.fromCharCode(parseInt(code, 8));
        });
    }

    dispose() { }

}