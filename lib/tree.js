'use strict';

// Herdr indents continuation rows two columns beyond an entry's first row.
// These prefixes compensate for that while keeping the tree continuous.
function treeRows(entries, workspaces = new Map(), tabs = new Map()) {
  const groups = new Map();
  for (const entry of entries) {
    if (!groups.has(entry.workspace)) groups.set(entry.workspace, new Map());
    const group = groups.get(entry.workspace);
    if (!group.has(entry.tab)) group.set(entry.tab, []);
    group.get(entry.tab).push(entry);
  }
  const rows = new Map();
  for (const [workspace, group] of groups) {
    const tabEntries = [...group];
    for (const [tabIndex, [tab, agents]] of tabEntries.entries()) {
      const lastTab = tabIndex === tabEntries.length - 1;
      for (const [agentIndex, entry] of agents.entries()) {
        const firstTab = agentIndex === 0;
        const firstWorkspace = firstTab && tabIndex === 0;
        const tabPrefix = `${lastTab ? '└' : '├'}─ `;
        const agentPrefix = `${lastTab ? '  ' : '│ '} ${agentIndex === agents.length - 1 ? '└' : '├'}─ `;
        rows.set(entry.pane, {
          workspace: firstWorkspace ? (workspaces.get(workspace) || workspace) : null,
          tab: firstTab ? `\u200b${firstWorkspace ? '' : '  '}${tabPrefix}${tabs.get(tab) || tab || 'Untitled tab'}` : null,
          prefix: `\u200b${firstTab ? '' : '  '}${agentPrefix}`,
          gap: lastTab && agentIndex === agents.length - 1,
        });
      }
    }
  }
  return rows;
}

module.exports = { treeRows };
