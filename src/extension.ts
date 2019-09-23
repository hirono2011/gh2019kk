// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exec } from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "kk-extension" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.lineTweet', () => {
		
		const ed = vscode.window.activeTextEditor;// エディタ取得
		if (typeof ed !== 'undefined') {
			let i: number = ed.selection.active.line;
			
			let	ms: string = ed.document.lineAt(i).text;
			vscode.window.showInformationMessage(ms);
			var ncp = require("copy-paste");
			// tslint:disable-next-line: semicolon
			ncp.copy(ms, function () { console.log("done") });
		}

		exec("/home/a66/shell_script/kk_clipboar_tweet.py", (error: any,stdout: any,stderr: any) =>
		{
			//実行した後の処理をここに書く。実行したアプリが終了した後に実行される。
			vscode.window.showInformationMessage('SUCCESS!');
		
		}
		
		);

	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
