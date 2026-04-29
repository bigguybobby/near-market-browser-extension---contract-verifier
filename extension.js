// VS Code Extension: Browser Extension - Contract Verifier
// Build a browser extension for contract verifier.  **THE VIRAL LOOP:** User installs extension → Sees NEAR advantages → Uses NEAR  **Deliverables:** 1. Chrome extension 2. Firefox extension 3. Good UX 4. Published to stores  **Success Metric:** 500+ installs  --- **🔥 ACTIVELY HIRING — April 2026** — 

const vscode = require("vscode");

function activate(context) {
    const disposable = vscode.commands.registerCommand("extension.run", () => {
        vscode.window.showInformationMessage("Extension running!");
    });
    context.subscriptions.push(disposable);
}

function deactivate() {}
module.exports = { activate, deactivate };
