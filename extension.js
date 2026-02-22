const vscode = require('vscode');

const CONFIG_NS = 'aristobyteTheme';
const LAST_VERSION_KEY = 'aristobyte.lastSeenVersion';
const WALKTHROUGH_ID = 'aristobyte.getting-started';
const DARK_THEME_LABEL = 'AristoByte Dark';
const LIGHT_THEME_LABEL = 'AristoByte Light';

function getConfig() {
  return vscode.workspace.getConfiguration(CONFIG_NS);
}

async function applyTheme(themeLabel) {
  await vscode.workspace
    .getConfiguration('workbench')
    .update('colorTheme', themeLabel, vscode.ConfigurationTarget.Global);
}

async function openDocsIndex(context) {
  const openInEditor = getConfig().get('openDocsInEditor', true);
  if (!openInEditor) {
    const homepage = context.extension.packageJSON.homepage;
    if (homepage) {
      await vscode.env.openExternal(vscode.Uri.parse(homepage));
    }
    return;
  }

  const uri = vscode.Uri.joinPath(context.extensionUri, 'docs', 'INDEX.md');
  const doc = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(doc, { preview: false });
}

async function openDashboard(context) {
  const walkthroughRef = `${context.extension.id}#${WALKTHROUGH_ID}`;
  await vscode.commands.executeCommand(
    'workbench.action.openWalkthrough',
    walkthroughRef,
    false
  );
}

async function maybeShowPostInstallExperience(context) {
  const config = getConfig();
  const showWalkthrough = config.get('showWalkthroughOnInstallOrUpdate', true);
  const defaultTheme = config.get('defaultThemeOnInstall', 'auto');
  const currentVersion = context.extension.packageJSON.version;
  const previousVersion = context.globalState.get(LAST_VERSION_KEY);
  const firstInstall = !previousVersion;
  const versionChanged = previousVersion !== currentVersion;

  if (!versionChanged) {
    return;
  }

  await context.globalState.update(LAST_VERSION_KEY, currentVersion);

  if (firstInstall) {
    if (defaultTheme === 'dark') {
      await applyTheme(DARK_THEME_LABEL);
    } else if (defaultTheme === 'light') {
      await applyTheme(LIGHT_THEME_LABEL);
    }
  }

  if (showWalkthrough) {
    await openDashboard(context);
  }
}

function registerCommands(context) {
  const subscriptions = [
    vscode.commands.registerCommand('aristobyteTheme.openDashboard', async () => {
      await openDashboard(context);
    }),

    vscode.commands.registerCommand('aristobyteTheme.openDocsIndex', async () => {
      await openDocsIndex(context);
    }),

    vscode.commands.registerCommand('aristobyteTheme.openMarketplacePage', async () => {
      const homepage = context.extension.packageJSON.homepage;
      if (homepage) {
        await vscode.env.openExternal(vscode.Uri.parse(homepage));
      }
    }),

    vscode.commands.registerCommand('aristobyteTheme.applyDarkTheme', async () => {
      await applyTheme(DARK_THEME_LABEL);
      void vscode.window.showInformationMessage('AristoByte Dark theme applied.');
    }),

    vscode.commands.registerCommand('aristobyteTheme.applyLightTheme', async () => {
      await applyTheme(LIGHT_THEME_LABEL);
      void vscode.window.showInformationMessage('AristoByte Light theme applied.');
    })
  ];

  context.subscriptions.push(...subscriptions);
}

async function activate(context) {
  registerCommands(context);
  await maybeShowPostInstallExperience(context);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
