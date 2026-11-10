import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack, Row, Grid } from '../presentation/atoms';

describe('Layout Primitives (Stack, Row, Grid)', () => {
  it('renders Stack with default and custom gap, align, justify', () => {
    const { rerender } = render(
      <Stack data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );

    const el = screen.getByTestId('stack');
    expect(el.className).toContain('flex flex-col');
    expect(el.className).toContain('gap-4');
    expect(el.className).toContain('items-stretch');

    rerender(
      <Stack data-testid="stack" gap="lg" align="center" justify="between" wrap>
        <div>Item 1</div>
      </Stack>
    );

    expect(el.className).toContain('gap-6');
    expect(el.className).toContain('items-center');
    expect(el.className).toContain('justify-between');
    expect(el.className).toContain('flex-wrap');
  });

  it('renders Row with flex-row and inline option', () => {
    const { rerender } = render(
      <Row data-testid="row">
        <div>A</div>
        <div>B</div>
      </Row>
    );

    const el = screen.getByTestId('row');
    expect(el.className).toContain('flex flex-row');
    expect(el.className).toContain('gap-2');
    expect(el.className).toContain('items-center');

    rerender(
      <Row data-testid="row" inline gap="xs" justify="center">
        <div>A</div>
      </Row>
    );

    expect(el.className).toContain('inline-flex');
    expect(el.className).toContain('gap-1');
    expect(el.className).toContain('justify-center');
  });

  it('renders Grid with numeric cols and responsive cols object', () => {
    const { rerender } = render(
      <Grid data-testid="grid" cols={3} gap="sm">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </Grid>
    );

    const el = screen.getByTestId('grid');
    expect(el.className).toContain('grid');
    expect(el.className).toContain('grid-cols-3');
    expect(el.className).toContain('gap-2');

    rerender(
      <Grid
        data-testid="grid"
        cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
        gap="lg"
      >
        <div>1</div>
      </Grid>
    );

    expect(el.className).toContain('grid-cols-1');
    expect(el.className).toContain('sm:grid-cols-2');
    expect(el.className).toContain('md:grid-cols-3');
    expect(el.className).toContain('lg:grid-cols-4');
    expect(el.className).toContain('gap-6');
  });
});
