import { describe, expect, it } from 'vitest';
import * as pageKit from '../presentation/page-kit';

const COMPONENTS = [
  'PageHeader',
  'SectionHeader',
  'FilterBar',
  'FilterSelect',
  'FilterPanel',
  'FilterSection',
  'CheckFilterList',
  'SingleSelectFilterList',
  'TabNav',
  'NextSteps',
] as const;

describe('page-kit barrel', () => {
  it('exports every page scaffolding component as a renderable', () => {
    for (const name of COMPONENTS) {
      expect(['function', 'object'], `pageKit.${name}`).toContain(typeof pageKit[name]);
    }
  });

  it('exports the full surface with no extra values beyond the documented kit', () => {
    const record = pageKit as unknown as Record<string, unknown>;
    const valueNames = Object.keys(record).filter((k) => record[k] !== undefined);
    expect(valueNames.sort()).toEqual([...COMPONENTS].sort());
  });

  it('re-exports the same bindings as their layer barrels', async () => {
    const templates = await import('../presentation/templates');
    const molecules = await import('../presentation/molecules');
    const organisms = await import('../presentation/organisms');
    expect(pageKit.PageHeader).toBe(templates.PageHeader);
    expect(pageKit.SectionHeader).toBe(templates.SectionHeader);
    expect(pageKit.FilterSelect).toBe(molecules.FilterSelect);
    expect(pageKit.TabNav).toBe(molecules.TabNav);
    expect(pageKit.FilterBar).toBe(organisms.FilterBar);
    expect(pageKit.FilterPanel).toBe(organisms.FilterPanel);
    expect(pageKit.NextSteps).toBe(organisms.NextSteps);
  });
});
