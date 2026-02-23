const vscode = require('vscode');
const crypto = require('crypto');

const CONFIG_NS = 'aristobyteTheme';
const LAST_VERSION_KEY = 'aristobyte.lastSeenVersion';
const WALKTHROUGH_ID = 'aristobyte.getting-started';
const DARK_THEME_LABEL = 'AristoByte Dark';
const LIGHT_THEME_LABEL = 'AristoByte Light';
const HOME_PANEL_ID = 'aristobyte.home';

let homePanel;

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

function getNonce() {
  return crypto.randomBytes(16).toString('hex');
}

function getHomeHtml(context, webview) {
  const nonce = getNonce();
  const iconUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'icon.png')
  );
  const bannerUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'media', 'assets', 'marketplace-banner.png')
  );
  const usageUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'media', 'assets', 'usage-code-editor.png')
  );
  const accessUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'media', 'assets', 'accessibility-contrast.png')
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <title>AristoByte Home</title>
  <style>
    :root {
      --bg: #0e1220;
      --panel: #12182b;
      --panel-2: #18233d;
      --line: #2a3557;
      --text: #e8ecf7;
      --muted: #a8b2d1;
      --accent: #fec800;
      --accent-2: #ffee27;
      --good: #7bc580;
      --warn: #f18e35;
      --bad: #e2312d;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background: radial-gradient(1200px 500px at 20% -20%, #263357 0%, var(--bg) 55%);
    }
    .shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
    .nav {
      border-right: 1px solid var(--line);
      background: linear-gradient(180deg, #0e1220 0%, #0b0f1a 100%);
      padding: 20px 16px;
    }
    .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
    .brand img { width: 28px; height: 28px; border-radius: 7px; }
    .brand h1 { margin: 0; font-size: 17px; font-weight: 700; }
    .sub { margin: 0 0 18px; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    .menu { display: flex; flex-direction: column; gap: 8px; }
    .tab {
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #131a2d;
      color: var(--text);
      text-align: left;
      padding: 10px 12px;
      cursor: pointer;
      font-size: 13px;
    }
    .tab.active { border-color: var(--accent); background: #1b2742; color: var(--accent-2); }
    .quick {
      margin-top: 18px;
      border-top: 1px solid var(--line);
      padding-top: 14px;
      display: grid;
      gap: 8px;
    }
    .link {
      color: var(--muted);
      text-decoration: none;
      font-size: 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 8px 10px;
      display: inline-block;
    }
    .main { padding: 24px; }
    .hero {
      border: 1px solid var(--line);
      border-radius: 14px;
      background: linear-gradient(145deg, #141d34 0%, #0f1526 100%);
      padding: 18px;
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 20px;
      align-items: center;
    }
    .hero h2 { margin: 0 0 8px; font-size: 28px; }
    .hero p { margin: 0; color: var(--muted); line-height: 1.5; }
    .hero img { width: 100%; border-radius: 10px; border: 1px solid var(--line); }
    .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
    .btn {
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 10px 12px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      color: #111;
      background: var(--accent);
    }
    .btn.secondary { background: #253352; color: var(--text); border-color: var(--line); }
    .btn.good { background: var(--good); }
    .grid { margin-top: 16px; display: grid; gap: 12px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .card { border: 1px solid var(--line); border-radius: 12px; background: var(--panel); padding: 14px; }
    .card h3 { margin: 0 0 6px; font-size: 15px; }
    .card p { margin: 0; color: var(--muted); font-size: 13px; }
    .card img { margin-top: 10px; width: 100%; border-radius: 8px; border: 1px solid var(--line); }
    .section { display: none; }
    .section.active { display: block; }
    .list { margin: 10px 0 0; padding-left: 16px; color: var(--muted); }
    .list li { margin: 6px 0; }
    @media (max-width: 960px) {
      .shell { grid-template-columns: 1fr; }
      .nav { border-right: 0; border-bottom: 1px solid var(--line); }
      .hero { grid-template-columns: 1fr; }
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <aside class="nav">
      <div class="brand">
        <img src="${iconUri}" alt="AristoByte icon" />
        <h1>AristoByte Home</h1>
      </div>
      <p class="sub">Theme Control Center</p>
      <div class="menu">
        <button class="tab active" data-tab="welcome">Welcome</button>
        <button class="tab" data-tab="themes">Themes</button>
        <button class="tab" data-tab="docs">Docs</button>
        <button class="tab" data-tab="resources">Resources</button>
      </div>
      <div class="quick">
        <a class="link" href="#" data-command="openDashboard">Open Walkthrough</a>
        <a class="link" href="#" data-command="openDocsIndex">Open Docs Index</a>
        <a class="link" href="#" data-command="openMarketplacePage">Marketplace Page</a>
      </div>
    </aside>
    <main class="main">
      <section class="section active" data-section="welcome">
        <div class="hero">
          <div>
            <h2>AristoTheme</h2>
            <p>Production-grade dark and light themes with high-coverage UI tokens, semantic highlighting, and a focused developer experience.</p>
            <div class="actions">
              <button class="btn" data-command="applyDarkTheme">Apply Dark Theme</button>
              <button class="btn secondary" data-command="applyLightTheme">Apply Light Theme</button>
              <button class="btn secondary" data-command="openDashboard">Open Onboarding</button>
            </div>
          </div>
          <img src="${bannerUri}" alt="AristoByte banner" />
        </div>
        <div class="grid">
          <article class="card">
            <h3>Why AristoByte</h3>
            <p>Minimal visuals, strong syntax contrast, and consistent workbench styling tuned for long coding sessions.</p>
            <ul class="list">
              <li>Dark + Light complete coverage</li>
              <li>Semantic token color support</li>
              <li>Optimized editor + terminal palette</li>
            </ul>
          </article>
          <article class="card">
            <h3>Editor Preview</h3>
            <p>Representative token balance across common languages.</p>
            <img src="${usageUri}" alt="Editor preview" />
          </article>
        </div>
      </section>
      <section class="section" data-section="themes">
        <div class="hero">
          <div>
            <h2>Theme Modes</h2>
            <p>Switch quickly between Dark and Light with command-level controls.</p>
            <div class="actions">
              <button class="btn" data-command="applyDarkTheme">Set Dark</button>
              <button class="btn secondary" data-command="applyLightTheme">Set Light</button>
            </div>
          </div>
          <img src="${accessUri}" alt="Accessibility preview" />
        </div>
      </section>
      <section class="section" data-section="docs">
        <div class="card">
          <h3>Documentation</h3>
          <p>Browse setup, customization, accessibility, and troubleshooting guides.</p>
          <div class="actions">
            <button class="btn secondary" data-command="openDocsIndex">Open Docs Index</button>
            <button class="btn secondary" data-command="openDashboard">Open Walkthrough</button>
          </div>
        </div>
      </section>
      <section class="section" data-section="resources">
        <div class="card">
          <h3>Resources</h3>
          <p>Manage your extension page, report issues, and follow release updates.</p>
          <div class="actions">
            <button class="btn secondary" data-command="openMarketplacePage">Marketplace</button>
            <button class="btn secondary" data-command="openDocsIndex">Docs</button>
          </div>
        </div>
      </section>
    </main>
  </div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const sections = Array.from(document.querySelectorAll('.section'));

    function activateTab(target) {
      tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === target));
      sections.forEach((section) => section.classList.toggle('active', section.dataset.section === target));
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    });

    document.querySelectorAll('[data-command]').forEach((el) => {
      el.addEventListener('click', (event) => {
        event.preventDefault();
        vscode.postMessage({
          type: 'command',
          command: el.dataset.command
        });
      });
    });
  </script>
</body>
</html>`;
}

function showHomePanel(context) {
  if (homePanel) {
    homePanel.reveal(vscode.ViewColumn.One);
    return;
  }

  homePanel = vscode.window.createWebviewPanel(
    HOME_PANEL_ID,
    'AristoByte Home',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, 'media'),
        vscode.Uri.joinPath(context.extensionUri, 'docs'),
        context.extensionUri
      ]
    }
  );

  homePanel.webview.html = getHomeHtml(context, homePanel.webview);

  homePanel.webview.onDidReceiveMessage(async (message) => {
    if (!message || message.type !== 'command' || !message.command) {
      return;
    }
    switch (message.command) {
      case 'applyDarkTheme':
        await vscode.commands.executeCommand('aristobyteTheme.applyDarkTheme');
        break;
      case 'applyLightTheme':
        await vscode.commands.executeCommand('aristobyteTheme.applyLightTheme');
        break;
      case 'openDashboard':
        await vscode.commands.executeCommand('aristobyteTheme.openDashboard');
        break;
      case 'openDocsIndex':
        await vscode.commands.executeCommand('aristobyteTheme.openDocsIndex');
        break;
      case 'openMarketplacePage':
        await vscode.commands.executeCommand('aristobyteTheme.openMarketplacePage');
        break;
      default:
        break;
    }
  });

  homePanel.onDidDispose(() => {
    homePanel = undefined;
  });
}

async function maybeShowPostInstallExperience(context) {
  const config = getConfig();
  const showWalkthrough = config.get('showWalkthroughOnInstallOrUpdate', true);
  const postInstallExperience = config.get('postInstallExperience', 'home');
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

  if (postInstallExperience === 'home') {
    showHomePanel(context);
  } else if (showWalkthrough || postInstallExperience === 'walkthrough') {
    await openDashboard(context);
  }
}

function registerCommands(context) {
  const subscriptions = [
    vscode.commands.registerCommand('aristobyteTheme.openHome', async () => {
      showHomePanel(context);
    }),

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
