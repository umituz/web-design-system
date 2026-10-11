/**
 * Styles contract — the precompiled stylesheet is a published artifact.
 *
 * These tests run AFTER `npm run build` (the npm `test` script builds
 * first), so `dist/styles.css` reflects the current source. They fail the
 * release if the compile step breaks, a theme variable goes missing, or a
 * semantic class stops being generated.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(__dirname, '../../dist/styles.css'), 'utf8');

describe('dist/styles.css contract', () => {
  it('exists and is non-trivial', () => {
    expect(css.length).toBeGreaterThan(10_000);
  });

  it('defines the default palette (dashboard values)', () => {
    expect(css).toContain('--color-primary:#2563eb');
    expect(css).toContain('--color-background:#f8fafc');
    expect(css).toContain('--color-foreground:#0f172a');
    expect(css).toContain('--color-destructive:#dc2626');
  });

  it('binds semantic utilities to theme variables', () => {
    expect(css).toMatch(/\.bg-primary\{background-color:var\(--color-primary\)\}/);
    expect(css).toMatch(/\.text-muted-foreground\{[^}]*var\(--color-muted-foreground\)/);
    expect(css).toMatch(/\.border-border\{[^}]*var\(--color-border\)/);
  });

  it('compiles component classes used by the source', () => {
    // Button default variant hover state (compiled via color-mix)
    expect(css).toMatch(/hover\\:bg-primary\\\/90:hover\{background-color:color-mix/);
    // Button sizes
    expect(css).toMatch(/\.h-10\{/);
    expect(css).toMatch(/\.h-9\{/);
    // Radius scale
    expect(css).toMatch(/\.rounded-md\{border-radius:var\(--radius-md\)\}/);
    expect(css).toMatch(/\.rounded-lg\{border-radius:var\(--radius-lg\)\}/);
  });

  it('ships the dark palette under both dark selectors', () => {
    expect(css).toContain('[data-theme=dark],.dark{');
    expect(css).toContain('--color-primary:#3b82f6');
  });

  it('ships overlay animations (tw-animate) and accordion keyframes', () => {
    expect(css).toMatch(/\.animate-in\{/);
    expect(css).toMatch(/\.fade-in-0\{/);
    expect(css).toMatch(/@keyframes accordion-down/);
    expect(css).toMatch(/@keyframes accordion-up/);
  });

  it('ships preflight inside @layer base (safe for layered hosts)', () => {
    expect(css).toMatch(/@layer base/);
  });
});
