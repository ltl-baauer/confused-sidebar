# confused-sidebar

Fork of [hhdebb/herdr-radar](https://github.com/hhdebb/herdr-radar), retaining its MIT license and credits.

Displays a workspace → tab → agent tree in Herdr’s Agents section:

```text
_crane
  ├─ curieux-clean
  │  ├─ ⣟ Claude · Implement changes
  │  └─ ✓ Codex · Review changes
  └─ paseo
     └─ ○ Codex · Explain repository
```

Status indicators precede agent names. Working agents animate, blocked agents pulse, and completed results retain their mark until seen. Tab names follow Herdr’s actual labels. Group ordering follows Radar’s activity sorting.

The headings are visual rows attached to agent entries, not collapsible nodes. Only tabs and workspaces containing detected/reported agents appear. Clicking an entry focuses its agent pane. The separate Spaces section remains. Workspaces are top-level groups, including worktree workspaces.

## Install

Requires Herdr 0.9.0+ and Node 18+.

```sh
herdr plugin install ltl-baauer/confused-sidebar --yes
herdr plugin action invoke ltl-baauer.confused-sidebar.state-start
```

When replacing Radar, first invoke `hhdebb.herdr-radar.unconfigure`, wait for it to succeed, then uninstall the old plugin. Keep the shared icon font installed. Do not run both metadata daemons on the same server.

The plugin uses ID `ltl-baauer.confused-sidebar` and its own config/state directories. Settings use the `CONFUSED_SIDEBAR_` environment prefix. In grouped mode, connector indentation is fixed to match Herdr’s continuation-row indentation. `show_tab` applies only to the flat view. Source and inherited settings are documented in [UPSTREAM-README.md](UPSTREAM-README.md); replace upstream action IDs with this fork’s ID.

## Verify

```sh
npm run check
npm test
```
