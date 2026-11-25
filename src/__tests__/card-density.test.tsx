import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../presentation/organisms/Card';

afterEach(cleanup);

describe('Card density', () => {
  it('keeps the default density untouched', () => {
    const { container } = render(
      <Card>
        <CardHeader title="Default" subtitle="roomy" />
        <CardContent>Body</CardContent>
      </Card>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain('shadow-sm');
    const header = screen.getByText('Default').closest('div[class*="p-6"]');
    expect(header!.className).toContain('p-6');
  });

  it('applies compact spacing from a single Card prop', () => {
    const { container } = render(<Card density="compact">Inner</Card>);
    expect((container.firstChild as HTMLElement).className).toContain('shadow-sm');
  });

  it('compacts the structural header: single row, tick, small title', () => {
    render(
      <Card density="compact">
        <CardHeader tick title="Budget summary" subtitle="Committed vs actual against budget" />
        <CardContent>Body</CardContent>
      </Card>
    );
    const header = screen.getByText('Budget summary').closest('div[class*="min-h-[44px]"]');
    expect(header).not.toBeNull();
    expect(header!.className).toContain('border-b');
    expect(header!.className).toContain('px-3.5');
    const title = screen.getByText('Budget summary');
    expect(title.className).toContain('text-sm');
    expect(title.className).toContain('font-bold');
    const tick = document.querySelector('span[class*=bg-accent]') as HTMLElement;
    expect(tick).not.toBeNull();
    expect(screen.getByText('Committed vs actual against budget').className).toContain('text-[11.5px]');
  });

  it('compacts content and footer while allowing a flush override', () => {
    render(
      <Card density="compact">
        <CardContent>Roomy</CardContent>
        <CardContent className="p-0">Flush</CardContent>
        <CardFooter>Foot</CardFooter>
      </Card>
    );
    expect(screen.getByText('Roomy').className).toContain('p-3.5');
    expect(screen.getByText('Flush').className).not.toContain('p-3.5');
    expect(screen.getByText('Foot').className).toContain('p-3.5');
  });

  it('does not leak compact density outside the card', () => {
    render(
      <>
        <Card density="compact">
          <CardTitle>Inside</CardTitle>
        </Card>
        <CardTitle data-testid="outside">Outside</CardTitle>
      </>
    );
    expect(screen.getByText('Inside').className).toContain('text-sm');
    expect(screen.getByTestId('outside').className).not.toContain('text-sm');
  });
});
