import { Plugin, Notice, TFile } from "obsidian";

interface RelaySharedFolder {
  path: string;
  relayId?: string;
}

interface RelayPluginApi {
  sharedFolders: {
    lookup(path: string): RelaySharedFolder | null;
  };
}

const RELAY_PLUGIN_ID = "system3-relay";

export default class RelayShareLinkPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "copy-relay-share-link",
      name: "Copy Relay share link",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        if (!this.isInShare(file.path)) return false;
        if (!checking) this.copyLink(file);
        return true;
      },
    });
  }

  private isInShare(path: string): boolean {
    const plugins = (this.app as unknown as { plugins: { plugins: Record<string, unknown> } })
      .plugins.plugins;
    const relay = plugins[RELAY_PLUGIN_ID] as RelayPluginApi | undefined;
    const share = relay?.sharedFolders?.lookup?.(path);
    return !!share?.relayId;
  }

  private async copyLink(file: TFile) {
    const url = `obsidian://open?file=${encodeURIComponent(file.basename)}`;
    await navigator.clipboard.writeText(url);
    new Notice(`Copied: ${file.basename}`);
  }
}
