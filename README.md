# Relay Share Link

An [Obsidian](https://obsidian.md) plugin that adds a one-click "Copy share link" action to notes inside a [Relay](https://relay.md) shared folder. The link uses Obsidian's built-in `obsidian://open?file=...` action, so anyone you share it with can click it and open the note in their own vault — no special plugin required on the receiving side.

## Why

Sharing a deep link to a note inside a Relay shared folder is awkward without help:

- `obsidian://open?vault=...&file=path/to/note.md` requires the vault to be named the same on every machine and the folder structure to match.
- Wikilinks (`[[note]]`) only work inside Obsidian, not when pasted into Slack or email.

This plugin emits `obsidian://open?file=<basename>`, which relies on Obsidian's wiki-link resolution to find the note by name in whichever vault the recipient currently has focused. Works as long as the note name is unique within their vault, which is almost always the case for notes synced via a Relay share.

## Install

Two paths depending on whether you already use Relay.

### A. Already using Relay and joined the shared folder

Just BRAT this plugin:

1. Install **BRAT** (Beta Reviewers Auto-update Tool): Settings → Community plugins → Browse → search "BRAT" → install → enable.
2. Open the command palette (`Cmd/Ctrl + P`) → run **BRAT: Add a beta plugin with frozen version**.
3. Enter:
   - Repository: `trentshaines/obsidian-relay-share-link`
   - Version: pick the latest from the [releases page](https://github.com/trentshaines/obsidian-relay-share-link/releases) (e.g. `0.6.0`)
   - Enable after install: yes
4. The plugin appears in Settings → Community plugins → enable it.

To auto-update as new releases ship, use **BRAT: Add a beta plugin** (no frozen version) instead of the frozen variant in step 2.

### B. New to Relay — full setup from scratch

Do this once. After that you only ever need path A for future updates.

1. **Install Obsidian** from [obsidian.md](https://obsidian.md). Open it, create a new vault (any name and location works — you can rename or move it later). When prompted, opt out of catalyst / sync products; you don't need them.

2. **Install the Relay plugin.**
   - Settings → Community plugins. If this is a brand-new vault, click **Turn on community plugins** first.
   - **Browse** → search **Relay** (by System 3) → **Install** → **Enable**.

3. **Sign into Relay.** Open the Relay plugin's settings tab in the left sidebar (the chain-link icon, or Settings → Relay). Sign in with the account your team uses. If your team is on a dedicated tenant rather than the public `relay.md`, ask whoever set Relay up for the tenant URL and SSO instructions before signing in.

4. **Join your team's shared folder.** Ask a teammate (or whoever owns the share) for an invitation link or share key. In the Relay plugin's settings, **Add shared folder** → paste the invitation → pick a location inside your vault for the synced files to live. Wait for the initial sync to finish.

5. **Install this plugin via BRAT.** Now follow steps 1–4 from **A. Already using Relay** above.

6. **Test it.** Open any note inside the freshly synced shared folder. You should see a **share icon** in the top right of the tab. Click it — a notice pops up saying the link was copied. Paste the link into Slack or your address bar to confirm it opens the note.

If step 6 doesn't show the share icon, the most common cause is the note isn't actually inside a Relay-synced folder yet (sync still running, or you placed it outside the share root). The command palette entry, right-click menus, and share icon all hide themselves for non-shared notes.

## Usage

Open any note inside a Relay shared folder. You'll see four entry points to the same command:

- A **share icon** in the note's view-action bar (top right of the tab)
- **Right-click** the note in the file explorer → "Copy Relay share link"
- **Right-click** inside the editor → "Copy Relay share link"
- **Command palette** → "Copy Relay share link"

The command is hidden / disabled on notes that aren't inside a Relay share.

The copied URL looks like:

```
obsidian://open?file=My%20Note
```

Paste it into Slack, email, a doc, another note — clicking it opens the note in whatever Obsidian vault the recipient currently has focused.

## Recipient side

**Recipients don't need this plugin installed.** They only need:

- Obsidian installed.
- The Relay shared folder synced into one of their vaults (so the note exists).
- That vault to be the one currently focused when they click the link.

## Caveats

- **Name collisions**: if the recipient's vault has two notes with the same basename, Obsidian picks one and the URL has no way to disambiguate. Pick descriptive names.
- **Focused vault**: the link opens in whichever vault Obsidian currently has focused. If the recipient is in a vault that doesn't have the note, they'll see a notice from Obsidian.
- **Unofficial Relay API**: the plugin gates the "Copy" command on whether the active note lives inside a `system3-relay` shared folder, by reading Relay's internal `sharedFolders` collection. If a future Relay release renames that field, this gating may break (the command would either stop appearing or start appearing on every note). The URL itself doesn't depend on Relay — only the gate does.

## Development

```fish
npm install
npm run dev   # watch + rebuild
npm run build # production build
```

The build produces `main.js`. To test in a vault, drop `main.js` and `manifest.json` into `<vault>/.obsidian/plugins/relay-share-link/`.

## License

MIT.
