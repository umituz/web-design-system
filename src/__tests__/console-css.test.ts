import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(process.cwd(), 'src', 'styles', 'console.css'), 'utf8');

const CONSOLE_CLASSES = [
  'alert', 'alert-warning', 'cal-cell', 'cal-chip', 'cal-day', 'cal-dow', 'cal-grid', 'cal-legend', 'cal-legend-chip',
  'card', 'card-padless', 'd-label', 'd-value', 'data-toolbar', 'detail-grid', 'detail-item', 'done', 'dot',
  'fact-list', 'fact-row', 'feed-card', 'feed-empty', 'feed-grid', 'feed-head', 'feed-item', 'feed-list', 'feed-stats',
  'fi', 'fi-body', 'fi-end', 'fi-icon', 'fi-label', 'fi-meta', 'fi-title', 'fi-value', 'file-label', 'fk',
  'font-display', 'form-grid', 'future', 'fv', 'gantt-bar', 'gantt-grid', 'gantt-label', 'gantt-lane', 'gantt-month',
  'gantt-name', 'gantt-row', 'gantt-today', 'grid', 'grid-2', 'grid-kpi', 'grid-main-side', 'integration-card',
  'integration-grid', 'late', 'map-grid', 'map-legend', 'map-tile', 'node-date', 'node-dot', 'node-title', 'overline',
  'page', 'page-sub', 'pedigree-node', 'pedigree-row', 'pedigree-tree', 'pn-sub', 'pn-tag', 'po-num', 'pref-row',
  'profile-grid', 'profit-table', 'report-runner', 'report-scroll', 'result-count', 'role-card', 'role-grid',
  'section-head', 'section-title', 'stage-node', 'stage-rail', 'ta-c', 'ta-end', 'tag-chip', 'tag-input',
  'tag-new-btn', 'tag-swatch', 'text-link', 'tile-crop', 'tile-meta', 'tile-name', 'vfarm', 'vfarm-sidebar-note',
];

describe('console.css contract', () => {
  it('defines every console chrome class', () => {
    const missing = CONSOLE_CLASSES.filter((name) => !new RegExp(`^\\.${name}[ .{:]`, 'm').test(css));
    expect(missing).toEqual([]);
  });

  it('is plain CSS — no tailwind build at-rules', () => {
    expect(css).not.toMatch(/@utility|@source|@apply|@import|@theme/);
  });
});
