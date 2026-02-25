const vscode = require("vscode");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const CONFIG_NS = "aristobyteTheme";
const LAST_VERSION_KEY = "aristobyte.lastSeenVersion";
const WALKTHROUGH_ID = "aristobyte.getting-started";
const HOME_PANEL_ID = "aristobyte.home";
const LINKS = {
  marketplace:
    "https://marketplace.visualstudio.com/items?itemName=aristobyte.aristo-theme-vscode-color-theme",
  openVsx:
    "https://open-vsx.org/extension/aristobyte/aristo-theme-vscode-color-theme",
  website: "https://aristobyte.com",
  sourceCode: "https://github.com/aristobyte/aristo-theme-vscode-extension",
  stackoverflow: "https://stackoverflow.com/users/30507294/aristobyte",
  npm: "https://www.npmjs.com/~aristobyte_team",
  linkedin: "https://www.linkedin.com/company/aristobyte/",
  facebook: "https://www.facebook.com/aristobyte",
  instagram: "https://www.instagram.com/aristo_byte/",
  youtube: "https://www.youtube.com/@aristobyte",
  opencollective: "https://opencollective.com/aristobyte",
  patreon: "https://www.patreon.com/c/aristobyte",
};
const THEME_LABELS = {
  dark: "AristoByte Dark",
  midnight: "AristoByte Midnight",
  dusk: "AristoByte Dusk",
  highContrastDark: "AristoByte High Contrast Dark",
  oled: "AristoByte OLED",
  light: "AristoByte Light",
  softLight: "AristoByte Soft Light",
  highContrastLight: "AristoByte High Contrast Light",
};

let homePanel;

function getConfig() {
  return vscode.workspace.getConfiguration(CONFIG_NS);
}

async function applyTheme(themeLabel) {
  await vscode.workspace
    .getConfiguration("workbench")
    .update("colorTheme", themeLabel, vscode.ConfigurationTarget.Global);
}

function themeLabelFromSetting(settingValue) {
  return THEME_LABELS[settingValue];
}

async function openExternalUrl(url) {
  await vscode.env.openExternal(vscode.Uri.parse(url));
}

async function openDocsIndex(context) {
  const openInEditor = getConfig().get("openDocsInEditor", true);
  if (!openInEditor) {
    const homepage = context.extension.packageJSON.homepage;
    if (homepage) {
      await vscode.env.openExternal(vscode.Uri.parse(homepage));
    }
    return;
  }

  const uri = vscode.Uri.joinPath(context.extensionUri, "docs", "INDEX.md");
  const doc = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(doc, { preview: false });
}

async function openDashboard(context) {
  const walkthroughRef = `${context.extension.id}#${WALKTHROUGH_ID}`;
  await vscode.commands.executeCommand(
    "workbench.action.openWalkthrough",
    walkthroughRef,
    false,
  );
}

function getNonce() {
  return crypto.randomBytes(16).toString("hex");
}

function loadUiFile(context, fileName) {
  return fs.readFileSync(
    path.join(context.extensionUri.fsPath, "ui", fileName),
    "utf8",
  );
}

function getHomeHtml(context, webview) {
  const nonce = getNonce();
  const iconUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'assets', 'logo.png')
  );
  const companyLogoUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'assets', 'aristobyte-logo.png')
  );
  const bannerUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      context.extensionUri,
      "assets",
      "marketplace-banner.png",
    ),
  );
  const usageUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      context.extensionUri,
      "assets",
      "usage-code-editor.png",
    ),
  );
  const accessUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      context.extensionUri,
      "assets",
      "accessibility-contrast.png",
    ),
  );
  const profileUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "assets", "profile.png"),
  );
  const importedStyles = loadUiFile(context, "style.css");
  const importedScript = loadUiFile(context, "script.js");
  const htmlTemplate = loadUiFile(context, "index.html");
  const csp = `default-src 'none'; img-src ${webview.cspSource} https: data:; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';`;
  const replacements = {
    "{{CSP}}": csp,
    "{{STYLE}}": `<style>${importedStyles}</style>`,
    "{{SCRIPT}}": `<script nonce="${nonce}">${importedScript}</script>`,
    "{{ICON_URI}}": String(iconUri),
    "{{COMPANY_LOGO_URI}}": String(companyLogoUri),
    "{{BANNER_URI}}": String(bannerUri),
    "{{USAGE_URI}}": String(usageUri),
    "{{ACCESS_URI}}": String(accessUri),
    "{{PROFILE_URI}}": String(profileUri),
    "{{LINK_MARKETPLACE}}": LINKS.marketplace,
    "{{LINK_OPEN_VSX}}": LINKS.openVsx,
    "{{LINK_WEBSITE}}": LINKS.website,
    "{{LINK_SOURCE}}": LINKS.sourceCode,
    "{{LINK_STACKOVERFLOW}}": LINKS.stackoverflow,
    "{{LINK_NPM}}": LINKS.npm,
    "{{LINK_LINKEDIN}}": LINKS.linkedin,
    "{{LINK_FACEBOOK}}": LINKS.facebook,
    "{{LINK_INSTAGRAM}}": LINKS.instagram,
    "{{LINK_YOUTUBE}}": LINKS.youtube,
    "{{LINK_OPENCOLLECTIVE}}": LINKS.opencollective,
    "{{LINK_PATREON}}": LINKS.patreon,
  };

  return Object.entries(replacements).reduce(
    (html, [token, value]) => html.replaceAll(token, value),
    htmlTemplate,
  );
}

function showHomePanel(context) {
  if (homePanel) {
    homePanel.reveal(vscode.ViewColumn.One);
    return;
  }

  homePanel = vscode.window.createWebviewPanel(
    HOME_PANEL_ID,
    "AristoByte Home",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, "assets"),
        vscode.Uri.joinPath(context.extensionUri, "docs"),
        context.extensionUri,
      ],
    },
  );

  homePanel.webview.html = getHomeHtml(context, homePanel.webview);

  homePanel.webview.onDidReceiveMessage(async (message) => {
    if (!message) {
      return;
    }
    if (message.type === "externalLink" && message.url) {
      await openExternalUrl(message.url);
      return;
    }
    if (message.type !== "command" || !message.command) {
      return;
    }
    switch (message.command) {
      case "pickTheme":
        await vscode.commands.executeCommand("workbench.action.selectTheme");
        break;
      case "applyDarkTheme":
        await vscode.commands.executeCommand("aristobyteTheme.applyDarkTheme");
        break;
      case "applyLightTheme":
        await vscode.commands.executeCommand("aristobyteTheme.applyLightTheme");
        break;
      case "applyMidnightTheme":
        await vscode.commands.executeCommand(
          "aristobyteTheme.applyMidnightTheme",
        );
        break;
      case "applyDuskTheme":
        await vscode.commands.executeCommand("aristobyteTheme.applyDuskTheme");
        break;
      case "applyHighContrastDarkTheme":
        await vscode.commands.executeCommand(
          "aristobyteTheme.applyHighContrastDarkTheme",
        );
        break;
      case "applyHighContrastLightTheme":
        await vscode.commands.executeCommand(
          "aristobyteTheme.applyHighContrastLightTheme",
        );
        break;
      case "applyOledTheme":
        await vscode.commands.executeCommand("aristobyteTheme.applyOledTheme");
        break;
      case "applySoftLightTheme":
        await vscode.commands.executeCommand(
          "aristobyteTheme.applySoftLightTheme",
        );
        break;
      case "openDashboard":
        await vscode.commands.executeCommand("aristobyteTheme.openDashboard");
        break;
      case "openDocsIndex":
        await vscode.commands.executeCommand("aristobyteTheme.openDocsIndex");
        break;
      case "openMarketplacePage":
        await vscode.commands.executeCommand(
          "aristobyteTheme.openMarketplacePage",
        );
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
  const showWalkthrough = config.get("showWalkthroughOnInstallOrUpdate", true);
  const postInstallExperience = config.get("postInstallExperience", "home");
  const defaultTheme = config.get("defaultThemeOnInstall", "auto");
  const currentVersion = context.extension.packageJSON.version;
  const previousVersion = context.globalState.get(LAST_VERSION_KEY);
  const firstInstall = !previousVersion;
  const versionChanged = previousVersion !== currentVersion;

  if (!versionChanged) {
    return;
  }

  await context.globalState.update(LAST_VERSION_KEY, currentVersion);

  if (firstInstall) {
    const initialThemeLabel = themeLabelFromSetting(defaultTheme);
    if (initialThemeLabel) {
      await applyTheme(initialThemeLabel);
    }
  }

  if (postInstallExperience === "home") {
    showHomePanel(context);
  } else if (showWalkthrough || postInstallExperience === "walkthrough") {
    await openDashboard(context);
  }
}

function registerCommands(context) {
  const registerThemeCommand = (commandId, settingKey, message) =>
    vscode.commands.registerCommand(commandId, async () => {
      await applyTheme(THEME_LABELS[settingKey]);
      void vscode.window.showInformationMessage(message);
    });

  const subscriptions = [
    vscode.commands.registerCommand("aristobyteTheme.openHome", async () => {
      showHomePanel(context);
    }),

    vscode.commands.registerCommand(
      "aristobyteTheme.openDashboard",
      async () => {
        await openDashboard(context);
      },
    ),

    vscode.commands.registerCommand(
      "aristobyteTheme.openDocsIndex",
      async () => {
        await openDocsIndex(context);
      },
    ),

    vscode.commands.registerCommand(
      "aristobyteTheme.openMarketplacePage",
      async () => {
        await openExternalUrl(LINKS.marketplace);
      },
    ),

    registerThemeCommand(
      "aristobyteTheme.applyDarkTheme",
      "dark",
      "AristoByte Dark theme applied.",
    ),
    registerThemeCommand(
      "aristobyteTheme.applyLightTheme",
      "light",
      "AristoByte Light theme applied.",
    ),
    registerThemeCommand(
      "aristobyteTheme.applyMidnightTheme",
      "midnight",
      "AristoByte Midnight theme applied.",
    ),
    registerThemeCommand(
      "aristobyteTheme.applyDuskTheme",
      "dusk",
      "AristoByte Dusk theme applied.",
    ),
    registerThemeCommand(
      "aristobyteTheme.applyHighContrastDarkTheme",
      "highContrastDark",
      "AristoByte High Contrast Dark theme applied.",
    ),
    registerThemeCommand(
      "aristobyteTheme.applyHighContrastLightTheme",
      "highContrastLight",
      "AristoByte High Contrast Light theme applied.",
    ),
    registerThemeCommand(
      "aristobyteTheme.applyOledTheme",
      "oled",
      "AristoByte OLED theme applied.",
    ),
    registerThemeCommand(
      "aristobyteTheme.applySoftLightTheme",
      "softLight",
      "AristoByte Soft Light theme applied.",
    ),
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
  deactivate,
};
