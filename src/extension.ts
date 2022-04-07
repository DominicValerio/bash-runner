// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { basename, dirname, extname, join } from "path";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let run = vscode.commands.registerCommand('bash-runner.run', (fileUri: vscode.Uri) => {
		let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('bash-runner', fileUri)
		//console.log(config.inspect('properties'))
		const terminalName = "Bash Run"
		let command: string | undefined = config.get('executor')
		if(command === undefined) command = "bash"
		const langid = "shellscript"
		let terminal: vscode.Terminal | undefined = vscode.window.activeTerminal
		if(terminal === undefined) {
			vscode.window.showInformationMessage("Making new terminal")
			function inner(): vscode.Terminal {
				for(const term of vscode.window.terminals) {
					if(term.name === terminalName) {
						return term
					}
				}
				return vscode.window.createTerminal(terminalName)
			}
			terminal = inner()
		}
		
		let document: vscode.TextDocument;
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			document = editor.document
			const fileBasename = basename(document.fileName);
			terminal.sendText(`${command} ${fileBasename}`)
			
			terminal.show()
		}
	});
	
	context.subscriptions.push(run);
}

// this method is called when your extension is deactivated
export function deactivate() {}
