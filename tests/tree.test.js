'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { treeRows } = require('../lib/tree');

test('workspace, tab, and agent connectors align with Herdr continuation indentation', () => {
  const entries = [
    {workspace:'w1',tab:'t1',pane:'p1'},
    {workspace:'w1',tab:'t1',pane:'p2'},
    {workspace:'w1',tab:'t2',pane:'p3'},
    {workspace:'w2',tab:'t3',pane:'p4'},
  ];
  const rows = treeRows(entries,new Map([['w1','Project'],['w2','Other']]),new Map([['t1','Build'],['t2','Review'],['t3','Test']]));
  const rendered = [];
  for(const entry of entries){
    const row=rows.get(entry.pane);
    [row.workspace,row.tab,row.prefix+'● '+entry.pane].filter(Boolean).forEach((line,i)=>rendered.push(' '.repeat(i===0?1:3)+line.replaceAll('\u200b','')));
  }
  assert.deepEqual(rendered,[
    ' Project','   ├─ Build','   │  ├─ ● p1','   │  └─ ● p2',
    '   └─ Review','      └─ ● p3',
    ' Other','   └─ Test','      └─ ● p4',
  ]);
  assert.equal(rows.get('p2').gap,false);
  assert.equal(rows.get('p3').gap,true);
});

test('labels update, missing labels use IDs, empty lists have no headers',()=>{
  const entry={workspace:'w1',tab:'t1',pane:'p1'};
  assert.equal(treeRows([entry]).get('p1').workspace,'w1');
  assert.match(treeRows([entry],new Map(),new Map([['t1','Renamed']])).get('p1').tab,/Renamed$/);
  assert.equal(treeRows([]).size,0);
});

test('published metadata includes tab headers and cleanup removes them',async()=>{
  const herdr=require('../lib/herdr');
  const writes=[];
  herdr.reportMetadataAsync=async(pane,source,tokens)=>{writes.push({pane,source,tokens});return true;};
  const state=require('../lib/state');
  const entries=[{workspace:'w1',tab:'t1',pane:'p1'}];
  await state.writeGroups('test',entries,new Map([['w1','Project']]),new Set(),{tabs:new Map([['t1','Build']])});
  assert.equal(writes[0].tokens.group,'Project');
  assert.match(writes[0].tokens.tab_group,/└─ Build$/);
  await state.clearGroups('test',entries);
  assert.equal(writes[1].tokens.tab_group,null);
  assert.ok(state.OWNED_TOKENS.includes('tab_group'));
});
