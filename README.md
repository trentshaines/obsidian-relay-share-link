# Relay Share Link

An [Obsidian](https://obsidian.md) plugin that adds a one-click "Copy share link" action to notes inside a [Relay](https://relay.md) shared folder. The link uses Obsidian's built-in `obsidian://open?file=...` action, so anyone you share it with can click it and open the note in their own vault — no special plugin required on the receiving side.

## Why

Sharing a deep link to a note inside a Relay shared folder is awkward without help:

- `obsidian://open?vault=...&file=path/to/note.md` requires the vault to be named the same on every machine and the folder structure to match.
- Wikilinks (`[[note]]`) only work inside Obsidian, not when pasted into Slack or email.

This plugin emits `obsidian://open?file=<basename>`, which relies on Obsidian's wiki-link resolution to find the note by name in whichever vault the recipient currently has focused. Works as long as the note name is unique within their vault, which is almost always the case for notes synced via a Relay share.

## Install (BRAT)

The plugin isn't in Obsidian's community store yet. Install via BRAT:

1. In Obsidian, install **BRAT** (Beta Reviewers Auto-update Tool): Settings → Community plugins → Browse → search "BRAT" → install → enable.
2. Open the command palette (`Cmd/Ctrl + P`) → run **BRAT: Add a beta plugin with frozen version**.
3. Enter:
   - Repository: `trentshaines/obsidian-relay-share-link`
   - Version: pick the latest from the [releases page](https://github.com/trentshaines/obsidian-relay-share-link/releases) (e.g. `0.6.0`)
   - Enable after install: yes
4. The plugin appears in Settings → Community plugins → enable it.

To auto-update as new releases ship, use **BRAT: Add a beta plugin** (no frozen version) instead of the frozen variant in step 2.

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
