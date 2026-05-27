import { Plugin, Notice, TFile, ObsidianProtocolData } from "obsidian";

interface RelaySharedFolder {
  path: string;
  guid: string;
  relayId?: string;
  name: string;
}

interface RelaySharedFolders {
  lookup(path: string): RelaySharedFolder | null;
  items?(): RelaySharedFolder[];
  find?(pred: (f: RelaySharedFolder) => boolean): RelaySharedFolder | undefined;
  [Symbol.iterator]?: () => Iterator<RelaySharedFolder>;
}

interface RelayPluginApi {
  sharedFolders: RelaySharedFolders;
}

const RELAY_PLUGIN_ID = "system3-relay";
const URI_ACTION = "relay-share";
const WEB_PAGE = "https://trentshaines.github.io/obsidian-relay-share-link/";

export default class RelayShareLinkPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "copy-relay-share-link",
      name: "Copy Relay share link",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file) return false;
        const share = this.lookupShare(file.path);
        if (!share?.relayId) return false;
        if (!checking) this.copyLink(file, share);
        return true;
      },
    });

    this.registerObsidianProtocolHandler(URI_ACTION, (params) =>
      this.handleProtocol(params),
    );
  }

  private getRelay(): RelayPluginApi | null {
    const plugins = (this.app as unknown as { plugins: { plugins: Record<string, unknown> } })
      .plugins.plugins;
    return (plugins[RELAY_PLUGIN_ID] as RelayPluginApi | undefined) ?? null;
  }

  private allShares(relay: RelayPluginApi): RelaySharedFolder[] {
    const sf = relay.sharedFolders;
    if (typeof sf.items === "function") return sf.items();
    if (typeof sf[Symbol.iterator] === "function") {
      return Array.from(sf as Iterable<RelaySharedFolder>);
    }
    return [];
  }

  private lookupShare(path: string): RelaySharedFolder | null {
    const relay = this.getRelay();
    if (!relay) return null;
    if (typeof relay.sharedFolders.lookup === "function") {
      return relay.sharedFolders.lookup(path);
    }
    // Fallback: longest-prefix match.
    let best: RelaySharedFolder | null = null;
    for (const s of this.allShares(relay)) {
      if (path === s.path || path.startsWith(s.path + "/")) {
        if (!best || s.path.length > best.path.length) best = s;
      }
    }
    return best;
  }

  private async copyLink(file: TFile, share: RelaySharedFolder) {
    if (!share.relayId) {
      new Notice("This shared folder isn't connected to a Relay yet.");
      return;
    }
    const rel =
      file.path === share.path
        ? ""
        : file.path.startsWith(share.path + "/")
          ? file.path.slice(share.path.length + 1)
          : file.path;
    const params = new URLSearchParams();
    params.set("share", share.relayId);
    params.set("path", rel);
    if (share.name) params.set("name", share.name);
    const url = `${WEB_PAGE}?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    new Notice(`Copied Relay link: ${rel || "(folder root)"}`);
  }

  private async handleProtocol(params: ObsidianProtocolData) {
    const shareId = params.share;
    const relPath = params.path ?? "";
    const shareName = params.name;
    if (!shareId) {
      new Notice("Relay share link is missing a share ID.");
      return;
    }
    const relay = this.getRelay();
    if (!relay) {
      new Notice("Relay plugin isn't installed in this vault.");
      return;
    }
    const share = this.allShares(relay).find((s) => s.relayId === shareId);
    if (!share) {
      const label = shareName ? `"${shareName}"` : `id ${shareId.slice(0, 8)}…`;
      new Notice(
        `No matching Relay share in this vault. Open the vault that has share ${label}.`,
        8000,
      );
      return;
    }
    const fullPath = relPath ? `${share.path}/${relPath}` : share.path;
    const target = this.app.vault.getAbstractFileByPath(fullPath);
    if (!(target instanceof TFile)) {
      new Notice(`Relay link target not found in vault: ${fullPath}`);
      return;
    }
    await this.app.workspace.getLeaf(false).openFile(target);
  }
}
